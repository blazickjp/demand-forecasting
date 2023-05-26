import ast


class ClassCollector(ast.NodeVisitor):
    def visit_ClassDef(self, node):
        print(f'Class name: {node.name}')
        print(f'Class body: {ast.unparse(node.body)}')
        self.generic_visit(node)  # Continue visiting the rest of the tree


def main():
    with open('BabyAGI.py', 'r') as file:
        code = file.read()

    tree = ast.parse(code)
    collector = FunctionCollector()
    class_collection = ClassCollector()
    collector.visit(tree)
    class_collection.visit(tree)


if __name__ == '__main__':
    main()
