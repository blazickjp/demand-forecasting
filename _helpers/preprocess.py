import PyPDF2
import re


def read_pdf(file_path):
    with open(file_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        num_pages = len(reader.pages)
        text = ""

        for page in range(num_pages):
            text += reader.pages[page].extract_text()

    return text


def preprocess_text(text):
    # Replace line breaks with spaces
    text = text.replace('\n', ' ')

    # Remove multiple spaces
    text = re.sub(r'\s+', ' ', text)

    # Remove page numbers
    text = re.sub(r'\s\d+\s', ' ', text)

    return text


file_path = '../../../Desktop/Textbooks/Bayesian Data Analysis.pdf'
raw_text = read_pdf(file_path)
preprocessed_text = preprocess_text(raw_text)

print(preprocessed_text)
