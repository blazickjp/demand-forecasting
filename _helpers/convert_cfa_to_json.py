import re
import fitz
import json
import tiktoken
import re
import openai


def remove_content_until_learning_outcome(content):
    match = re.search(r'LEARNING OUTCOME', content)
    if match:
        content = content[match.start():]

    match = re.search(r'(L.E.A.R.N.I.N.G.M.O.D.U.L.E)', content)
    if match:
        content = content[:match.end() + 1]

    return content


def parse_text_to_list(text):
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    parsed_items = [line.strip('- ') for line in lines]

    return parsed_items


def format_LOS(objectives):
    user_prompt = f"""
    I'm going to  provide you with a poorly formatted list of Learning Objectives in plain text. I want you to parse the test and return a list of bulleted learning objectives. Items in the list should be verbatim as they're found in the objectives. First think, then generate a response.
    Learning Objectives: {objectives}
    """
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful AI assistant."},
            {"role": "user", "content": user_prompt}
        ],
        temperature=0.0
    )
    parsed_list = parse_text_to_list(
        response['choices'][0]['message']['content'])
    return parsed_list


def preprocess_text(text):
    # text = text.replace("\n", " ")
    text = re.sub(r'\u00a9.*?Not for distribution\.', '', text)
    text = re.sub(r'\u20ac', 'EUR', text)
    text = re.sub(r'\u2212', '-', text)
    text = re.sub(r'\u2248', 'approx', text)
    # text = "".join(char for char in text if char.isprintable())
    # text = re.sub(r'\s+', ' ', text)
    # text = text.strip()

    return text


def count_tokens(text, model="gpt-3.5-turbo-0301"):
    """Returns the number of tokens in a given text string."""
    try:
        encoding = tiktoken.encoding_for_model(model)
    except KeyError:
        encoding = tiktoken.get_encoding("cl100k_base")

    num_tokens = len(encoding.encode(text))
    return num_tokens


def extract_toc(file_path):
    doc = fitz.open(file_path)
    toc = doc.get_toc()
    toc_entries = [{"level": level, "title": title, "page_number": page_number}
                   for level, title, page_number in toc]
    return toc_entries


def remove_child_content(node):
    if not node["children"]:
        return node["content"]

    child_content = "".join(remove_child_content(child)
                            for child in node["children"])

    node["content"] = node["content"].replace(child_content, "")
    return child_content


def build_nested_toc_with_content(file_path, toc):
    nested_toc = []
    stack = []

    pdf = fitz.open(file_path)

    for i, entry in enumerate(toc):
        level = entry["level"]
        start_page = entry["page_number"] - 1
        end_page = toc[i + 1]["page_number"] - \
            1 if i < len(toc) - 1 else len(pdf)

        content = ""

        for page in range(start_page, end_page + 1):
            if page < len(pdf):
                content += pdf.load_page(page).get_text()

        title = entry["title"]

        # Split content by the child's title
        if i < len(toc) - 1 and toc[i + 1]["page_number"] == entry["page_number"]:
            child_title = toc[i + 1]["title"].upper()
            child_title_regex = re.compile(r'{}'.format(child_title))
            match = child_title_regex.search(content)
            if match:
                content = content[:match.start()]

        if i < len(toc) - 1 and toc[i + 1]["page_number"] > entry["page_number"]:

            child_title = re.escape(toc[i + 1]["title"].upper())
            child_title_regex = re.compile(r'{}'.format(child_title))
            child_match = child_title_regex.search(content)

            upper_title = re.escape(title.upper())
            title_regex = re.compile(r'{}'.format(upper_title))
            match = title_regex.search(content)

            if match and child_match:
                content = content[match.start():child_match.start()]
            elif match:
                content = content[match.start():]

        if level in [1, 2]:
            content = remove_content_until_learning_outcome(content)

        content = preprocess_text(content)

        if level == 2:
            lors = format_LOS(content)

        item = {
            "title": title,
            "page_number": entry["page_number"],
            "content": content,
            "learning_objectives": lors if level == 2 else None,
            "token_count": count_tokens(content),
            "children": []
        }

        while len(stack) >= level:
            stack.pop()

        if not stack:
            nested_toc.append(item)
        else:
            parent = stack[-1]
            parent["children"].append(item)

        stack.append(item)

    pdf.close()

    # Remove content of child nodes from parent nodes
    for item in nested_toc:
        remove_child_content(item)

    return nested_toc


def main(file, output_file):
    toc = extract_toc(file)
    sections = build_nested_toc_with_content(file, toc)
    with open(output_file, "w") as f:
        json.dump(sections, f, indent=4)


if __name__ == "__main__":
    # /docs/Level-1/CFA Level 1 Volume 1 (2023, CFA Institute) - libgen.li.pdf
    file = "./docs/Level-1/cfai_level1_volume1/CFA Level 1 Volume 1 (2023, CFA Institute) - libgen.li.pdf"
    output_file = "output/level_1_volume_1.json"
    main(file, output_file)
