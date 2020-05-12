from anytree.exporter import JsonExporter
from flask import Flask
from flask_cors import CORS
import json
from utils import read_text_from_pfd, clean_text, tokenize_text, subtokenize_text, \
    create_tokens_tree, tree_as_data_frame, exporter_tree

app = Flask(__name__)
CORS(app)

FILES_URL = "../../client/public/uploads/"


@app.route('/ping')
def hello_world():
    return "pong!"


@app.route('/getLawTree/<document>', methods=['GET'])
def get_law_tree(document):
    print(document)
    url = FILES_URL + document
    text = read_text_from_pfd(url)
    print(document)
    cleaned_text = clean_text(text)
    tokens = tokenize_text(cleaned_text)
    subtokens = subtokenize_text(tokens['partes'])
    print(document)
    tree = create_tokens_tree(subtokens, document)
    array_tree = exporter_tree(tree)
    # print(exporter.export(tree))
    data = json.dumps(array_tree)
    print(data)
    return data


if __name__ == "__main__":
    app.run(debug=True, port=5001)
