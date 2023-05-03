import os
import glob


def compile_questions(output_dir, compiled_filename="compiled_questions.txt"):
    compiled_filepath = os.path.join(output_dir, compiled_filename)

    with open(compiled_filepath, "w") as compiled_file:
        for reading_idx in glob.glob(os.path.join(output_dir, "Reading_*")):
            for module_idx in glob.glob(os.path.join(reading_idx, "Module_*")):
                for question_file in glob.glob(os.path.join(module_idx, "Questions_Chunk_*.txt")):
                    with open(question_file, "r") as file:
                        questions = file.read()
                        compiled_file.write(questions)
                        compiled_file.write("\n\n************\n\n")


if __name__ == "__main__":
    output_dir = "output/"
    compile_questions(output_dir)
