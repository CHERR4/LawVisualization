from anytree.exporter import JsonExporter
from flask import Flask, send_from_directory, request, make_response
from flask_cors import CORS
import json
from utils import read_text_from_pfd, clean_text, tokenize_text, subtokenize_text, \
    create_tokens_tree, tree_as_data_frame, exporter_tree, print_wordcloud, search_node, \
    search_articulo

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
    cleaned_text = clean_text(text)
    tokens = tokenize_text(cleaned_text)
    print('titulos', tokens['titulos'])
    subtokens = subtokenize_text(tokens['partes'])
    tree = create_tokens_tree(subtokens, document)
    # tree = formatTree(tree)
    array_tree = exporter_tree(tree)
    # print(exporter.export(tree))
    data = json.dumps(array_tree)
    # print(data)
    return data

@app.route('/getWordcloud/<document>', methods=['GET'])
def get_wordcloud(document):
    url = FILES_URL + document  
    text = read_text_from_pfd(url)
    filename = print_wordcloud(text, document)
    return send_from_directory(directory= "outputs/", filename=filename, as_attachment=True)

@app.route('/getFilterTree', methods=['GET'])
def get_filter_tree():
    print(request.args)
    document = request.args.get('document')
    filter = request.args.get('filter')
    url = FILES_URL + document
    text = read_text_from_pfd(url)
    cleaned_text = clean_text(text)
    tokens = tokenize_text(cleaned_text)
    subtokens = subtokenize_text(tokens['partes'])
    tree = create_tokens_tree(subtokens, document)
    find, node = search_node(tree, filter)
    if(find):
        exporter = JsonExporter(indent=2)
        print(len(node))
        array_tree = exporter.export(node[0])
        # print(exporter.export(tree))
        data = json.dumps(array_tree)
        print(data)
    else:
        array_tree = exporter_tree(tree)
        # print(exporter.export(tree))
        data = json.dumps(array_tree)
        print(data)
    return data

@app.route('/getFilterArticulos', methods=['GET'])
def get_filter_articulos():
    print(request.args)
    document = request.args.get('document')
    filter = request.args.get('filter')
    url = FILES_URL + document
    text = read_text_from_pfd(url)
    cleaned_text = clean_text(text)
    tokens = tokenize_text(cleaned_text)
    subtokens = subtokenize_text(tokens['partes'])
    tree = create_tokens_tree(subtokens, document)
    find, node = search_articulo(tree, filter)
    if(find):
        # exporter = JsonExporter(indent=2)
        #array_tree = exporter.export(node)
        # print(exporter.export(tree))
        array_tree = exporter_tree(node)
        data = json.dumps(array_tree)
        # print(data)
    else:
        array_tree = exporter_tree(tree)
        # print(exporter.export(tree))
        data = json.dumps(array_tree)
        print(data)
    return data

@app.route('/getLawText/<document>', methods=['GET'])
def get_law_text(document):
    print(document)
    url = FILES_URL + document
    text = read_text_from_pfd(url)
    response = make_response(text, 200)
    response.mimetype = "text/plain"
    return response

if __name__ == "__main__":
    app.run(debug=True, port=5001)
