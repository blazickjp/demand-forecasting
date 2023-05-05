import PyPDF2
import re
import os
import pdfplumber
import fitz
from transformers import GPT2Tokenizer
import openai
import time


SYSTEM_PROMPT = """
You are a CFA Study Assistant created to help people pass the CFA exams. Your task is to create ten questions related to 
the following CFA study material. The questions should be in the style of the CFA exam, which requires selecting 
the correct answer from three possible options. The questions should have varying level of difficulty (easy, medium, hard). Each question
should only have one correct answer.
Questions should be formatted as follows:

DIFFICULTY LEVEL
1. QUESTION.
A. Option 1
B. Option 2
C. Option 3

Example CFA-style questions:

MEDIUM
1. A bank loan department is trying to determine the correct rate for a 2-year loan to be made two years from now. If current 
implied Treasury effective annual spot rates are 1- year = 2%, 2-year = 3%, 3-year = 3.5%, and 4-year = 4.5%, the base (risk-free) 
forward rate for the loan before adding a risk premium is closest to:
A. 4.5%. 
B. 6.0%. 
C. 9.0%

EASY
2. Coyote Corporation has an issuer credit rating of AA, but its most recently issued bonds have an issue credit rating of AA–. 
This difference is most likely due to the newly issued bonds having:
A. been issued as senior subordinate ddebt.
B. been affected by restricted subsidiary status.
C. additional covenants that protect the bond holders.

HARD
3. Which of the following bonds would appreciate the most if the yield curve shifts down by 50 basis points at all maturities?
A. 4-year8%,8%YTM. 
B. 5-year8%,7.5%YTM. 
C. 5-year8.5%,8%YTM.
"""

USER_PROMPT = """
CONTEXT: {study_material_excerpt}
QUESTIONS:
"""

tokenizer = GPT2Tokenizer.from_pretrained("gpt2")


def read_pdf(file_path):
    with pdfplumber.open(file_path) as pdf:
        num_pages = len(pdf.pages)
        text = ""

        for page in range(num_pages):
            text += pdf.pages[page].extract_text()

    return text


def save_processed_file(text_list, output_file):
    output_dir = os.path.dirname(output_file)
    os.makedirs(output_dir, exist_ok=True)

    with open(output_file, 'w') as file:
        file.write(text_list)


def generate_questions(user_prompt):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt}
        ],
        temperature=0.7
    )
    return response['choices'][0]['message']['content']


def extract_toc(file_path):
    doc = fitz.open(file_path)
    toc = doc.get_toc()
    toc_entries = []
    for level, title, page_number in toc:
        toc_entries.append({"level": level, "title": title,
                           "page_number": page_number})
    return toc_entries


def process_chunks_and_generate_questions(modules, output_dir):
    for reading_idx, reading in enumerate(modules):
        reading_dir = os.path.join(output_dir, f"Reading_{reading_idx + 1}")

        for module_idx, module_chunks in enumerate(reading):
            module_dir = os.path.join(reading_dir, f"Module_{module_idx + 1}")
            # Ensure the module directory exists
            os.makedirs(module_dir, exist_ok=True)

            for chunk_idx, chunk in enumerate(module_chunks):
                prompt = USER_PROMPT.format(study_material_excerpt=chunk)
                time.sleep(1)
                questions = generate_questions(prompt)

                output_filename = os.path.join(
                    module_dir, f"Questions_Chunk_{chunk_idx + 1}.txt")
                with open(output_filename, "w") as file:
                    file.write(questions)


def split_into_chunks(text, max_tokens):
    tokens = tokenizer.tokenize(text)
    chunks = []
    current_chunk = []
    current_chunk_tokens = 0

    for token in tokens:
        token_length = len(token)
        if current_chunk_tokens + token_length <= max_tokens:
            current_chunk.append(token)
            current_chunk_tokens += token_length
        else:
            chunks.append(tokenizer.convert_tokens_to_string(current_chunk))
            current_chunk = [token]
            current_chunk_tokens = token_length

    if current_chunk:
        chunks.append(tokenizer.convert_tokens_to_string(current_chunk))

    return chunks


def break_into_sections(text, reading_pattern, module_pattern, sample_question_pattern):
    # Find all reading headers and their positions
    reading_positions = [(m.start(0), m.end(0))
                         for m in re.finditer(reading_pattern, text)]

    reading_sections = []
    module_sections = []
    sample_questions = []

    for i, (start, end) in enumerate(reading_positions):
        if i + 1 < len(reading_positions):
            next_start, _ = reading_positions[i + 1]
            reading_text = text[end:next_start]
        else:
            reading_text = text[end:]

        # Find all module headers and their positions within the reading
        reading_module_positions = [(m.start(0), m.end(0))
                                    for m in re.finditer(module_pattern, reading_text)]
        reading_modules = []
        reading_sample_questions = []

        for j, (m_start, m_end) in enumerate(reading_module_positions):
            if j + 1 < len(reading_module_positions):
                next_m_start, _ = reading_module_positions[j + 1]
                module_text = reading_text[m_end:next_m_start]
            else:
                module_text = reading_text[m_end:]

            # Split the module into 1,000-token chunks
            module_chunks = split_into_chunks(module_text, 5000)
            reading_modules.append(module_chunks)

            # Find and extract sample questions
            sample_question_positions = [(m.start(0), m.end(0)) for m in re.finditer(
                sample_question_pattern, module_text)]
            questions = []
            for k, (q_start, q_end) in enumerate(sample_question_positions):
                if k + 1 < len(sample_question_positions):
                    next_q_start, _ = sample_question_positions[k + 1]
                    question_text = module_text[q_end:next_q_start]
                else:
                    question_text = module_text[q_end:]

                questions.append(question_text)

            reading_sample_questions.append(questions)

        reading_sections.append(reading_text)
        module_sections.append(reading_modules)
        sample_questions.append(reading_sample_questions)

    return reading_sections, module_sections, sample_questions


def preprocess_text(text):
    # Replace line breaks with spaces
    text = text.replace('\n', ' ')

    # Remove multiple spaces
    text = re.sub(r'\s+', ' ', text)

    # Remove page numbers
    text = re.sub(r'\s\d+\s', ' ', text)

    return text


def save_to_txt_file(readings, modules, output_dir):

    os.makedirs(output_dir, exist_ok=True)
    reading_folder = os.path.join(output_dir, 'readings')
    module_folder = os.path.join(output_dir, 'modules')

    os.makedirs(reading_folder, exist_ok=True)
    os.makedirs(module_folder, exist_ok=True)

    for i, reading in enumerate(readings):
        token_count = len(tokenizer.encode(reading))
        reading_filename = f'reading_{i + 1}_{token_count}_tokens.txt'
        reading_file_path = os.path.join(reading_folder, reading_filename)
        with open(reading_file_path, 'w') as file:
            file.write(reading)

    for reading_idx, reading in enumerate(readings):
        reading_dir = os.path.join(output_dir, f"Reading_{reading_idx + 1}")
        os.makedirs(reading_dir, exist_ok=True)

        for module_idx, module_chunks in enumerate(modules[reading_idx]):
            module_dir = os.path.join(reading_dir, f"Module_{module_idx + 1}")
            os.makedirs(module_dir, exist_ok=True)

            for chunk_idx, chunk in enumerate(module_chunks):
                token_count = len(tokenizer.encode(chunk))
                output_filename = os.path.join(
                    module_dir, f"Chunk_{chunk_idx + 1}_{token_count}_tokens.txt")
                with open(output_filename, "w") as file:
                    file.write(chunk)


if __name__ == "__main__":
    # file_path = 'docs/Kaplan 2020 CFA Level II Schweser Notes eBook 1-2020.pdf'

    file_path = 'docs/CFA 2020 - Level 1 Book 4.pdf'
    output_dir = 'output/'

    raw_text = read_pdf(file_path)
    preprocessed_text = preprocess_text(raw_text)
    # save_processed_file(preprocessed_text, 'output/preprocessed.txt')
    sample_question_pattern = r'MODULE\sQuiz\s+\d+\.\d+:'
    reading_pattern = r'READINGS?\s+(\d+(\s+&\s+\d+)?)+:'
    module_pattern = r'MODULE\s+\d+\.\d+:'

    readings, modules, sample_questions = break_into_sections(
        preprocessed_text, reading_pattern, module_pattern, sample_question_pattern)

    # save_to_txt_file(readings, modules, output_dir)
    process_chunks_and_generate_questions(modules, output_dir)
    # Save the readings and modules to separate text files
