from langchain import OpenAI, GoogleSearchAPIWrapper, LLMChain
from langchain.agents import ZeroShotAgent, Tool, AgentExecutor
import faiss
import json
import os
from collections import deque
from typing import Dict, List, Optional, Any

from langchain import LLMChain, OpenAI, PromptTemplate
from langchain.embeddings import OpenAIEmbeddings
from langchain.llms import BaseLLM
from langchain.vectorstores.base import VectorStore
from pydantic import BaseModel, Field
from langchain.chains.base import Chain

from langchain.vectorstores import FAISS
from langchain.docstore import InMemoryDocstore

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Use a service account
cred = credentials.Certificate('cfa-creds.json')
firebase_admin.initialize_app(cred)

db = firestore.client()

# Define your embedding model
embeddings_model = OpenAIEmbeddings()

# Initialize the vectorstore as empty
embedding_size = 1536
index = faiss.IndexFlatL2(embedding_size)
vectorstore = FAISS(embeddings_model.embed_query,
                    index, InMemoryDocstore({}), {})


class TaskProgressChain(LLMChain):
    """Chain to manage the progress of tasks."""

    @classmethod
    def from_llm(cls, llm: BaseLLM, verbose: bool = True) -> LLMChain:
        """Get the response parser."""
        task_progress_template = (
            "You are a task progress AI that uses the current task and its metadata"
            " to manage the progress of the task. The current task is: {task_name},"
            " and its metadata is: {metadata}. Based on this information,"
            " provide a summary of the progress on task completion."
        )
        prompt = PromptTemplate(
            template=task_progress_template,
            input_variables=["task_name", "metadata"],
        )
        return cls(prompt=prompt, llm=llm, verbose=verbose)


class TaskCreationChain(LLMChain):
    """Chain to generates tasks."""

    @classmethod
    def from_llm(cls, llm: BaseLLM, verbose: bool = True) -> LLMChain:
        """Get the response parser."""
        task_creation_template = (
            "You are an task creation AI that uses the result of an execution agent"
            " to create new tasks with the following objective: {objective},"
            " The last completed task was: {task_description}."
            " This result was: {result}."
            " These are the incomplete tasks still remaining: {incomplete_tasks}."
            " Based on the result, create new tasks to be completed"
            " by the AI system that do not overlap with incomplete tasks."
            " Return the tasks as an array."
        )
        prompt = PromptTemplate(
            template=task_creation_template,
            input_variables=["result", "task_description",
                             "incomplete_tasks", "objective"],
        )
        return cls(prompt=prompt, llm=llm, verbose=verbose)


class TaskPrioritizationChain(LLMChain):
    """Chain to prioritize tasks."""

    @classmethod
    def from_llm(cls, llm: BaseLLM, verbose: bool = True) -> LLMChain:
        """Get the response parser."""
        task_prioritization_template = (
            "You are an task prioritization AI tasked with cleaning the formatting of and reprioritizing"
            " the following tasks: {task_names}."
            " Consider the ultimate objective of your team: {objective}."
            " Do not remove any tasks. Return the result as a numbered list, like:"
            " #. First task"
            " #. Second task"
            " Start the task list with number {next_task_id}."
        )
        prompt = PromptTemplate(
            template=task_prioritization_template,
            input_variables=["task_names", "next_task_id", "objective"],
        )
        return cls(prompt=prompt, llm=llm, verbose=verbose)


todo_prompt = PromptTemplate.from_template(
    "You are a planner who is an expert at coming up with a todo list for a given objective. Come up with a todo list for this objective: {objective}")
todo_chain = LLMChain(llm=OpenAI(temperature=0), prompt=todo_prompt)

search = GoogleSearchAPIWrapper()


def search_parser(string: str):
    """Parse the search results."""
    return search.results(string, num_results=4)


tools = [
    Tool(
        name="Search",
        func=search_parser,
        description="useful for when you need to gather real time information using Google Search. Input: a search query. Output: the top 4 search results."
    ),
    Tool(
        name="TODO",
        func=todo_chain.run,
        description="useful for when you need to come up with todo lists. Input: an objective to create a todo list for. Output: a todo list for that objective. Please be very clear what the objective is!"
    )
]


prefix = """
You are an AI who performs one task keeping in mind that your final objective is: {objective}. 
Take into account these previously completed tasks: {context} 
Also take into account a summary of your current progress: {summary}
"""
FORMAT_INSTRUCTIONS = """Use the following format:
Question: the input question you must answer
Thought: you should always think about what to do
Action: the action to take, should be one of [{tool_names}]
Action Input: the input to the action
Observation: the result of the action
... (this Thought/Action/Action Input/Observation can repeat N times)
Thought: I now know the final answer
Final Answer: the final answer to the original input question"""
suffix = """Question: {task}
{agent_scratchpad}"""
prompt = ZeroShotAgent.create_prompt(
    tools,
    prefix=prefix,
    format_instructions=FORMAT_INSTRUCTIONS,
    suffix=suffix,
    input_variables=["objective", "task", "context", "summary", "agent_scratchpad"]
)


def get_next_task(task_creation_chain: LLMChain, result: Dict, task_description: str, task_list: List[str], objective: str) -> List[Dict]:
    """Get the next task."""
    incomplete_tasks = ", ".join(task_list)
    response = task_creation_chain.run(
        result=result, task_description=task_description, incomplete_tasks=incomplete_tasks, objective=objective)
    new_tasks = response.split('\n')
    return [{"task_name": task_name, "iteration": 0, "status": "incomplete", "summary": ""} for task_name in new_tasks if task_name.strip()]


def prioritize_tasks(task_prioritization_chain: LLMChain, this_task_id: int, task_list: List[Dict], objective: str) -> List[Dict]:
    """Prioritize tasks."""
    task_names = [t["task_name"] for t in task_list]
    next_task_id = int(this_task_id) + 1
    response = task_prioritization_chain.run(task_names=task_names,
                                             next_task_id=next_task_id,
                                             objective=objective)
    new_tasks = response.split('\n')
    prioritized_task_list = []
    for task_string in new_tasks:
        if not task_string.strip():
            continue
        task_parts = task_string.strip().split(".", 1)
        if len(task_parts) == 2:
            task_id = task_parts[0].strip()
            task_name = task_parts[1].strip()
            prioritized_task_list.append(
                {"task_id": task_id, "task_name": task_name, "iteration": 0, "status": "incomplete", "summary": ""})
    return prioritized_task_list


def _get_top_tasks(vectorstore, query: str, k: int) -> List[str]:
    """Get the top k tasks based on the query."""
    print("Query:", query)
    if query == "":
        return [' ']
    results = vectorstore.similarity_search_with_score(query, k=k)
    if not results:
        return []
    sorted_results, _ = zip(*sorted(results, key=lambda x: x[1], reverse=True))
    return [str(item.metadata['task']) for item in sorted_results]


def execute_task(vectorstore, execution_chain: AgentExecutor, objective: str, task: str, summary: str,  k: int = 5) -> str:
    """Execute a task."""
    context = _get_top_tasks(vectorstore, query=objective, k=k)
    result = execution_chain(inputs={"objective": objective, "context": context, "task": task, "summary": summary})
    # Do something with intermediate_steps...
    return result['output'], result['intermediate_steps']


class BabyAGI(Chain, BaseModel):
    """Controller model for the BabyAGI agent."""

    task_creation_chain: TaskCreationChain = Field(...)
    task_prioritization_chain: TaskPrioritizationChain = Field(...)
    task_progress_chain: TaskProgressChain = Field(...)
    execution_chain: AgentExecutor = Field(...)
    task_id_counter: int = Field(1)
    task_list: List = Field([])
    completed_tasks: List = Field([])
    vectorstore: VectorStore = Field(init=False)
    max_iterations: Optional[int] = None
    # path to the task list file
    task_file_path: str = Field("task_list.json")

    class Config:
        """Configuration for this pydantic object."""
        arbitrary_types_allowed = True

    def add_task(self, task: Dict):
        """Add a task to the task list."""
        self.task_list.append(task)
        with open(self.task_file_path, 'w') as file:
            json.dump(list(self.task_list), file)

    def load_tasks_from_file(self):
        """Load tasks from the task list file."""
        if os.path.exists(self.task_file_path):
            with open(self.task_file_path, 'r') as file:
                self.task_list = deque(json.load(file))

    # def add_task(task):
    #     doc_ref = db.collection(u'tasks').document(str(task['task_id']))
    #     doc_ref.set(task)

    # def get_tasks():
    #     tasks = db.collection(u'tasks').stream()
    #     task_list = []
    #     for task in tasks:
    #         task_list.append(task.to_dict())
    #     return task_list

    def get_max_task_id(self):
        """Get the maximum task id."""
        if not self.task_list:
            return 0
        return max([int(t["task_id"]) for t in self.task_list])

    def print_task_list(self):
        print("\033[95m\033[1m" + "\n*****TASK LIST*****\n" + "\033[0m\033[0m")
        if self.task_list:
            for t in self.task_list:
                print(t)

    def print_next_task(self, task: Dict):
        print("\033[92m\033[1m" + "\n*****NEXT TASK*****\n" + "\033[0m\033[0m")
        print(str(task["task_id"]) + ": " + task["task_name"])

    def print_task_result(self, result: str):
        print("\033[93m\033[1m" +
              "\n*****TASK RESULT*****\n" + "\033[0m\033[0m")
        print(result)

    @property
    def input_keys(self) -> List[str]:
        return ["objective"]

    @property
    def output_keys(self) -> List[str]:
        return []

    def _call(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        """Run the agent."""
        if os.path.exists(self.task_file_path):
            os.remove(self.task_file_path)
        objective = inputs['objective']
        if not self.task_list:  # Only add the first task if the task list is empty
            self.add_task({"task_id": "0", "task_name": "Make a Todo List", "iteration": 0,
                           "status": "incomplete", "summary": ""})
            task = [i for i in self.task_list if i['task_id'] == "0"][0]

            # Step 2: Execute the task
            result, _ = execute_task(
                self.vectorstore, self.execution_chain, objective, task["task_name"], summary=""
            )
            task.update({f"result_{task['iteration']}": result})
            new_tasks = get_next_task(
                self.task_creation_chain, result, task["task_name"], [
                    t["task_name"] for t in self.task_list], objective
            )
            self.task_id_counter = self.get_max_task_id()
            for new_task in new_tasks:
                self.task_id_counter += 1
                new_task.update({"task_id": self.task_id_counter})
                self.add_task(new_task)
            reprioritized_tasks = prioritize_tasks(
                self.task_prioritization_chain, "0", list(
                    self.task_list), objective
            )
            task.update({"status": "complete"})
            self.task_list = [task] + reprioritized_tasks
            with open(self.task_file_path, 'w') as file:
                json.dump(self.task_list, file)

        task_in_work = 0

        while True:
            if self.task_list:
                input("Check Progress and update Status. Press Enter to continue...")
                self.load_tasks_from_file()
                task = [i for i in self.task_list if i['task_id'] == str(task_in_work)][0]
                iteration = task["iteration"]
                if task['status'] == "complete":
                    task_in_work += 1
                    print("Completed task!\t- ", task['task_name'])
                    self.completed_tasks.append(task)
                    continue

                # Step 2: Execute the task
                result, intermediate_steps = execute_task(
                    self.vectorstore, self.execution_chain, objective, task["task_name"], task["summary"]
                )
                task.update({f"result_{iteration}": result})
                task.update({f"intermediate_steps_{iteration}": intermediate_steps})
                this_task_id = int(task["task_id"])
                self.print_task_result(result)

                summary = self.task_progress_chain.run(
                    task_name=task["task_name"], metadata=task
                )
                task.update({"summary": summary})

                # Step 3: Store the result in Pinecone
                result_id = f"result_{iteration}"
                self.vectorstore.add_texts(
                    texts=[result],
                    metadatas=[{"task": task["task_name"]}],
                    ids=[result_id],
                )

                # Step 4: Create new tasks and reprioritize task list
                new_tasks = get_next_task(
                    self.task_creation_chain, result, task["task_name"], [
                        t["task_name"] for t in self.task_list], objective
                )
                self.task_id_counter = self.get_max_task_id()
                for new_task in new_tasks:
                    self.task_id_counter += 1
                    new_task.update({"task_id": self.task_id_counter})
                    self.add_task(new_task)
                reprioritized_tasks = prioritize_tasks(
                    self.task_prioritization_chain, this_task_id, list(
                        self.task_list), objective
                )
                task
                self.task_list = [task] + reprioritized_tasks
                with open(self.task_file_path, 'w') as file:
                    json.dump(self.task_list, file)
        return {}

    @classmethod
    def from_llm(
        cls,
        llm: BaseLLM,
        vectorstore: VectorStore,
        verbose: bool = False,
        **kwargs
    ) -> "BabyAGI":
        """Initialize the BabyAGI Controller."""
        task_creation_chain = TaskCreationChain.from_llm(
            llm, verbose=verbose
        )
        task_prioritization_chain = TaskPrioritizationChain.from_llm(
            llm, verbose=verbose
        )
        task_progress_chain = TaskProgressChain.from_llm(
            llm, verbose=verbose
        )
        llm_chain = LLMChain(llm=llm, prompt=prompt)
        tool_names = [tool.name for tool in tools]
        agent = ZeroShotAgent(llm_chain=llm_chain, allowed_tools=tool_names)
        agent_executor = AgentExecutor.from_agent_and_tools(
            agent=agent, tools=tools, verbose=True, return_intermediate_steps=True)  # Change this line
        return cls(
            task_creation_chain=task_creation_chain,
            task_prioritization_chain=task_prioritization_chain,
            execution_chain=agent_executor,
            task_progress_chain=task_progress_chain,
            vectorstore=vectorstore,
            **kwargs
        )


OBJECTIVE = "Research the Langchain Python documentation and generate some product ideas leveraging the python package"

llm = OpenAI(temperature=0)
# Logging of LLMChains
verbose = False
# If None, will keep on going forever
max_iterations: Optional[int] = 7
baby_agi = BabyAGI.from_llm(
    llm=llm,
    vectorstore=vectorstore,
    verbose=verbose,
    max_iterations=max_iterations
)

baby_agi({"objective": OBJECTIVE})
