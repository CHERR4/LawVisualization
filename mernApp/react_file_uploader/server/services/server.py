import anytree
from anytree.exporter import JsonExporter
from flask import Flask, send_from_directory, request, make_response
from flask_cors import CORS
import json
from utils import read_text_from_pfd, clean_text, \
    create_tokens_tree, exporter_tree, print_wordcloud, search_node, \
    search_articulo, exporter_tree_list, search_words, search_regexp, subtokenize_token


FILES_URL = "../../client/public/uploads/"


app = Flask(__name__)
CORS(app)


@app.route('/ping')
def hello_world():
    return "pong!"


@app.route('/getLawTree/<document>', methods=['GET'])
def get_law_tree(document):
    print(document)
    url = FILES_URL + document
    text = read_text_from_pfd(url)
    cleaned_text = clean_text(text)
    tokens = subtokenize_token(cleaned_text)
    tree = create_tokens_tree(tokens, document)
    array_tree = exporter_tree(tree)
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
    tokens = subtokenize_token(cleaned_text)
    tree = create_tokens_tree(tokens, document)
    find, node = search_node(tree, filter)
    if(find):
        exporter = JsonExporter(indent=2)
        array_tree = exporter_tree_list(node)
        data = json.dumps(array_tree)
    else:
        array_tree = exporter_tree(tree)
        data = json.dumps(array_tree)
    return data


@app.route('/getFilterArticulos', methods=['GET'])
def get_filter_articulos():
    print(request.args)
    document = request.args.get('document')
    filter_value = request.args.get('filter')
    case_sensitive = request.args.get('case_sensitive')
    case_sensitive = case_sensitive == "true"
    print("case sensitive: ", case_sensitive)
    url = FILES_URL + document
    text = read_text_from_pfd(url)
    cleaned_text = clean_text(text)
    tokens = subtokenize_token(cleaned_text)
    tree = create_tokens_tree(tokens, document)
    find, node = search_articulo(tree, filter_value, case_sensitive)
    if(find):
        array_tree = exporter_tree(node)
        data = json.dumps(array_tree)
        print(data)
    else:
        array_tree = exporter_tree(tree)
        data = json.dumps(array_tree)        
    return data


@app.route('/getFilterWords', methods=['GET'])
def get_filter_words():
    document = request.args.get('document')
    words = request.args.get('words')
    case_sensitive = request.args.get('case_sensitive')
    case_sensitive = case_sensitive == "true"
    url = FILES_URL + document
    text = read_text_from_pfd(url)
    cleaned_text = clean_text(text)
    tokens = subtokenize_token(cleaned_text)
    tree = create_tokens_tree(tokens, document)
    find, node = search_words(tree, words, case_sensitive)
    if(find):
        print("encontrado")
        array_tree = exporter_tree(node)
        data = json.dumps(array_tree)
        print(data)
    else:
        array_tree = exporter_tree(tree)
        data = json.dumps(array_tree)        
    return data


@app.route('/getFilterRegexp', methods=['GET'])
def get_filter_regexp():
    document = request.args.get('document')
    regexp = request.args.get('regexp')
    case_sensitive = request.args.get('case_sensitive')
    case_sensitive = case_sensitive == "true"
    print(regexp)
    url = FILES_URL + document
    text = read_text_from_pfd(url)
    cleaned_text = clean_text(text)
    tokens = subtokenize_token(cleaned_text)
    tree = create_tokens_tree(tokens, document)
    find, node = search_regexp(tree, regexp, case_sensitive)
    if(find):
        array_tree = exporter_tree(node)
        data = json.dumps(array_tree)
        print(data)
    else:
        array_tree = exporter_tree(tree)
        data = json.dumps(array_tree)        
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
