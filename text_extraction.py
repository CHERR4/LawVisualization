import os, glob, subprocess
import pdftotext
import json
import re
import nltk
import pickle
import pandas as pd
from nltk.tokenize import RegexpTokenizer
from nltk.tokenize import word_tokenize
from nltk.corpus import gutenberg, nps_chat, stopwords
from anytree import AnyNode, RenderTree, PreOrderIter
from anytree.exporter import DictExporter, JsonExporter, DotExporter
from anytree.search import find, find_by_attr, findall
from collections import OrderedDict
from wordcloud import WordCloud

"""
Un título tiene capítulos
Un capítulo tiene secciones
Un capítulo tien artículos
Una sección tiene artículos
Un artículo tiene puntos
"""
MAX_WEIGHT = 10
PDF_FILE = 'bo291_ANTES GOBIERNO.pdf'
TEXT_FILE = 'lawText.txt'
TOKENS_FILE = 'tokens.txt'


def read_text_from_pfd(path_to_pdf):
    with open(path_to_pdf, "rb") as f:
        pdf = pdftotext.PDF(f)
    text = ""
    for page in pdf:
        text += page
    return text


def clean_text(text):
    # Remove multiple jumpline
    text_arr = [line for line in text.split('\n') if line.strip() != '']
    text = ""
    for line in text_arr:
        text += (line + "\n")
    text = re.sub(r"Boletín O˜cial del Parlamento de Canarias", "", text)
    text = re.sub(r"22 de septiembre de 2016", "", text)
    text = re.sub(r"Núm. 291 / [0-9]+", "", text)
    return text


def is_articulo(token):
    token = token.strip()
    pattern = re.compile('^Artículo')
    return pattern.match(token)


def is_capitulo(token):
    token = token.strip()
    pattern = re.compile('^Capítulo.*')
    return pattern.match(token)


def is_seccion(token):
    token = token.strip()
    pattern = re.compile('^Sección.*')
    return pattern.match(token)


def is_titulo(token):
    token = token.strip()
    pattern = re.compile('^Título.*')
    return pattern.match(token)


def is_keyword(word):
    return is_articulo(word) or is_seccion(word) or is_capitulo(word) or is_titulo(word)


def manual_tokenize(text):
    tokens = nltk.word_tokenize(text)
    articulos = [""]
    for token in tokens:
        if is_titulo(token) or is_capitulo(token) or is_seccion(token) or is_articulo(token):
            articulos.append(token)
        else:
            articulos[len(articulos) - 1] += (' ' + token)
    return articulos


def manual_tokenize_query(text):
    tokens = nltk.word_tokenize(text)
    articulos = [""]
    last_is_token = False
    for token in tokens:
        if is_titulo(token) or is_capitulo(token) or is_seccion(token) or is_articulo(token):
            articulos.append(token)
            last_is_token = True
        elif (not (
                is_titulo(token) or is_capitulo(token) or is_seccion(token) or is_articulo(token)) and last_is_token):
            articulos[len(articulos) - 1] += (' ' + token)
            last_is_token = False
        else:
            last_is_token = False
    return articulos


def tokenize_text(text):
    # Cleaning text format to tokenize
    single_whitespace = re.compile(r"\s+")
    text = re.sub(r"\n", " ", text).replace("\r", " ")
    text = single_whitespace.sub(" ", text).strip()
    # Tokenization by common tokenizer 
    # Want to change for tokenization by important words
    sentences = manual_tokenize(text)
    # Getting important words, this is just for seeing that stract them correctly
    # My objetive is to make a structure with all of them
    articulos = filter(is_articulo, sentences)
    secciones = filter(is_seccion, sentences)
    capitulos = filter(is_capitulo, sentences)
    titulos = filter(is_titulo, sentences)
    return {'partes': sentences, 'articulos': articulos, 'secciones': secciones, 'capitulos': capitulos,
            'titulos': titulos}


def subtokenize_token(token):
    subtokens = [""]
    words = nltk.word_tokenize(token)
    count = 0
    for word in words:
        if len(word) == 1 and count + 1 < len(words) and words[count + 1] == ')':
            subtokens.extend(word)
        else:
            subtokens[len(subtokens) - 1] += (' ' + word)
        count += 1
    return subtokens


def subtokenize_text(tokens):
    subtokens = []
    for token in tokens:
        subtokens.extend(subtokenize_token(token))
    return subtokens


def create_tokens_tree(tokens):
    id = 1
    root = AnyNode(id=0, text="root")
    last_titulo = None
    last_capitulo = None
    last_seccion = None
    last_articulo = None
    current_node = None
    for token in tokens:
        token = token.replace("/^\s*\s*$/", "")
        if re.match("^ Título", token):
            if not (re.match(".*[.].*", token[0:140])):
                current_node = AnyNode(id=id, parent=root, text=token)
                last_titulo = current_node
                last_capitulo = None
                last_seccion = None
                last_articulo = None
        elif re.match('^ Capítulo', token):
            current_node = AnyNode(id=id, parent=last_titulo, text=token)
            last_capitulo = current_node
            last_seccion = None
            last_articulo = None
        elif re.match('^ Sección', token):
            current_node = AnyNode(id=id, parent=last_capitulo, text=token)
            last_seccion = current_node
            last_articulo = None
        elif re.match('^ Artículo', token):
            if last_seccion is None:
                current_node = AnyNode(id=id, parent=last_capitulo, text=token)
            else:
                current_node = AnyNode(id=id, parent=last_seccion, text=token)
            last_articulo = current_node
        elif re.match('^ [a-z] [)]', token):
            current_node = AnyNode(id=id, parent=last_articulo, text=token)
        id += 1
    return root


def delete_node(tree, node1, node2):
    if len(node1.children) > len(node2.children) or len(node1.id) > len(node2.id):
        del node2
    else:
        del node1


def save_text(text):
    text_file = open("outputs/" + TEXT_FILE, "w+")
    text_file.write(text)
    text_file.close()


def save_tokens(filename, tokens):
    text_file = open("outputs/" + filename + '.txt', "w+")
    for token in tokens:
        text_file.write(token + '\n')
    text_file.close()


def read_tokens(doc):
    text_file = open(doc, "r+")
    tokens = text_file.read()
    text_file.close()
    return tokens


def create_dict_tree(tree):
    exporter = DictExporter(dictcls=OrderedDict, attriter=sorted)
    dict_tree = exporter.export(tree)
    return dict_tree


def create_json_tree(tree):
    exporter = JsonExporter(indent=2, sort_keys=True)
    json_tree = exporter.export(tree)
    return json_tree


def save_dict_tree(dict_tree):
    with open('outputs/dictTree.p', 'wb') as file:
        pickle.dump(dict_tree, file, protocol=pickle.HIGHEST_PROTOCOL)


def save_json_tree(json_tree):
    with open('outputs/jsonTree.txt', 'w') as file:
        json.dump(json_tree, file)


def save_tree_as_graph(tree):
    DotExporter(tree, maxlevel=2).to_dotfile("outputs/tree.dot")


def tree_as_data_frame(tree):
    df = pd.DataFrame(columns=["id", "text", "children"])
    for _, _, node in RenderTree(tree):
        children = []
        # print(subnode)
        for node2 in node.children:
            children.append(node2.id)
        dict = {"id": node.id, "text": node.text, "children": children}
        df = df.append(dict, ignore_index=True)
    return df


# Tengo: busco un nodo y todos sus hijos a partir de una palabra por la que empiza
# Quiero conseguir: me pasan una consulta: la tokenizo, obtengo todos los subnodos de orden menor en orden
def search_node(tree, sentence):
    tokens = manual_tokenize_query(sentence)
    tokens = tokens[1:len(tokens)]
    # this is because it introduces an space at first TODO fix
    if len(tokens) <= 1:
        nodes = findall(tree, filter_=lambda node: re.match("^ " + tokens[0] + " ", node.text))
        for node in nodes:
            for pre, fill, subnode in RenderTree(node, maxlevel=3):
                print("%s%s" % (pre, subnode.text))
        return len(nodes) > 0, nodes
    else:
        sentence = " "
        sentence = sentence.join(tokens[1:len(tokens)])
        nodes = findall(tree, filter_=lambda node: re.match("^.*" + tokens[0] + "[ .].*", node.text))
        for node in nodes:
            find, nodes = search_node(node, sentence)
            if find:
                return find, nodes
        return False, []


def print_tokens_tree(tree, level=2):
    for pre, fill, subnode in RenderTree(tree, maxlevel=level):
        print("%s%s%s" % (pre, subnode.id, subnode.text))


def print_wordcloud(text):
    stopwords_spanish = stopwords.words('spanish')
    stopwords_spanish.extend(['Artículo', 'Boletín', 'Oficial', 'Parlamento', 'Canarias'])
    # Here I can add all the worlds I dont like as stopwords
    wc = WordCloud(background_color="white", max_words=2000,
                   stopwords=stopwords_spanish, contour_width=3, contour_color='steelblue')
    # generate word cloud
    wc.generate(text)
    # store to file
    wc.to_file("outputs/wordcloud.png")


def main():
    """
    print("1) full execution\n")
    print("2) reload text from textFile\n")
    print("3) reload tokens from tokensFile\n")
    mode = int( input ("Insert mode of execution: \n"))
    switch (mode)
    """
    text = read_text_from_pfd(PDF_FILE)
    cleaned_text = clean_text(text)
    save_text(cleaned_text)
    tokens = tokenize_text(cleaned_text)
    subtokens = subtokenize_text(tokens['partes'])
    save_tokens('articulos', tokens['articulos'])
    save_tokens('secciones', tokens['secciones'])
    save_tokens('capitulos', tokens['capitulos'])
    save_tokens('titulos', tokens['titulos'])
    save_tokens('partes', tokens['partes'])
    save_tokens('subtokens', subtokens)
    tree = create_tokens_tree(subtokens)
    print_tokens_tree(tree)
    print_wordcloud(text)
    # save_tree_as_graph(tree)
    tree_df = tree_as_data_frame(tree)
    print(tree_df.info())
    print(tree_df.head(10))
    print(len(tree_df))
    tree_df.to_json('outputs/law_tree.json', orient='table')

    # tree_as_data_frame(tree)
    # dictTree = create_dict_tree(tree)
    # jsonTree = create_json_tree(tree)
    # save_dict_tree(dictTree)
    # save_json_tree(jsonTree)
    query = "Artículo 68"
    res, nodes = search_node(tree, query)
    print(res)
    print(nodes)
    # exportTokensLatex(subtokens)
    # read_tokens(TOKENS_FILE)


if __name__ == "__main__":
    main()
