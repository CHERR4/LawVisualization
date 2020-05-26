import re
import nltk
import pdftotext
import pandas as pd
from anytree import RenderTree, AnyNode
from anytree.exporter import JsonExporter
from nltk.corpus import gutenberg, nps_chat, stopwords
from anytree.search import find, find_by_attr, findall
from wordcloud import WordCloud


def read_text_from_pfd(filepath):
    with open(filepath, "rb") as f:
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


def manual_tokenize(text):
    tokens = nltk.word_tokenize(text)
    articulos = [""]
    for i in range(len(tokens)):
        token = tokens[i]
        if (is_titulo(token) or is_capitulo(token) or is_seccion(token) or is_articulo(token)) and (i < len(tokens)-2 and ((tokens[i+1] != "o") and (tokens[i+1] != "habilitante") and (tokens[i+1] != "habilitantes") and (tokens[i+1] != "de"))):
            articulos.append(token)
        else:
            articulos[len(articulos) - 1] += (' ' + token)
    """
    for token in tokens:
        if is_titulo(token) or is_capitulo(token) or is_seccion(token) or is_articulo(token):
            articulos.append(token)
        else:
            articulos[len(articulos) - 1] += (' ' + token)
    """
    return articulos


def is_articulo(token):
    token = token.strip()
    pattern = re.compile('^Artículo')
    pattern_2 = re.compile('^TÍTULO.*')
    return pattern.match(token) or pattern_2.match(token)


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
    pattern_2 = re.compile('^TÍTULO.*')
    return pattern.match(token) or pattern_2.match(token)


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

def formatToken(token):
    token = re.sub(" [.]", ".", token)
    token = re.sub(" ,", ",", token)
    token = re.sub(" :", ":", token)
    token = re.sub(" ;", ";", token)
    token = re.sub("“ ", "“", token)
    token = re.sub(" ”", "”", token)
    token = re.sub("[(] ", "(", token)
    token = re.sub(" [)]", ")", token)
    token = re.sub(" / ", "/", token)
    return token

def create_tokens_tree(tokens, file):
    id = 1
    print(file)
    root = AnyNode(id=0, name=file, shortname=file)
    last_titulo = None
    last_capitulo = None
    last_seccion = None
    last_articulo = None
    current_node = None
    for token in tokens:
        token = token.replace("/^\s*\s*$/", "")
        if is_titulo(token):
            if not (re.match(".*[.].*", token[0:140])):
                token = formatToken(token)
                current_node = AnyNode(id=id, parent=root, name=" ".join(token.split('.')[2:]), shortname=" ".join(token.split('.')[0:2]))
                last_titulo = current_node
                last_capitulo = None
                last_seccion = None
                last_articulo = None
        elif is_capitulo(token):
            token = formatToken(token)
            current_node = AnyNode(id=id, parent=last_titulo, name=" ".join(token.split('.')[2:]), shortname=" ".join(token.split('.')[0:2]))
            last_capitulo = current_node
            last_seccion = None
            last_articulo = None
        elif is_seccion(token):
            current_node = AnyNode(id=id, parent=last_capitulo, name=" ".join(token.split('.')[2:]), shortname=" ".join(token.split('.')[0:2]))
            last_seccion = current_node
            last_articulo = None
        elif is_articulo(token):
            token = formatToken(token)
            if last_seccion is None:
                if last_capitulo is None:
                    current_node = AnyNode(id=id, parent=last_titulo, name=" ".join(token.split('.')[2:]), shortname=" ".join(token.split('.')[0:2]))
                else:
                    current_node = AnyNode(id=id, parent=last_capitulo, name=" ".join(token.split('.')[2:]), shortname=" ".join(token.split('.')[0:2]))
            else:
                current_node = AnyNode(id=id, parent=last_seccion, name=" ".join(token.split('.')[2:]), shortname=" ".join(token.split('.')[0:2]))
            last_articulo = current_node
        else:
            token = formatToken(token)
            # token = re.sub(r" [)]", ")", token)
            current_node = AnyNode(id=id, parent=last_articulo, name=token, shortname="")
        id += 1
    return root


def tree_as_data_frame(tree):
    df = pd.DataFrame(columns=["id", "text", "children"])
    for _, _, node in RenderTree(tree):
        children = []
        # print(subnode)
        for node2 in node.children:
            children.append(node2.id)
        dict = {"id": node.id, "text": node.name, "children": children}
        df = df.append(dict, ignore_index=True)
    return df


def exporter_tree(tree):
    exporter = JsonExporter(indent=2)
    array = []
    for child in tree.children:
        # print(child)
        # print(exporter.export(child))
        array.append(exporter.export(child))
    return array


def print_wordcloud(text, document):
    stopwords_spanish = stopwords.words('spanish')
    stopwords_spanish.extend(['Artículo', 'Boletín', 'Oficial', 'Parlamento', 'Canarias'])
    # Here I can add all the worlds I dont like as stopwords
    wc = WordCloud(background_color="white", max_words=2000,
                   stopwords=stopwords_spanish, contour_width=3, contour_color='steelblue')
    # generate word cloud
    wc.generate(text)
    # store to file
    wc.to_file("outputs/" + document + ".png")
    return wc.generate(text)

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


def search_node(tree, sentence):
    tokens = manual_tokenize_query(sentence)
    tokens = tokens[1:len(tokens)]
    print(tokens)
    # this is because it introduces an space at first TODO fix
    if len(tokens) <= 1:
        print(tree.children)
        nodes = findall(tree, filter_=lambda node: re.match("^ " + tokens[0] + " ", node.shortname))
        for node in nodes:
            for pre, fill, subnode in RenderTree(node, maxlevel=3):
                print("%s%s" % (pre, subnode.name))
        print(nodes)
        return len(nodes) > 0, nodes
    else:
        sentence = " "
        sentence = sentence.join(tokens[1:len(tokens)])
        nodes = findall(tree, filter_=lambda node: re.match("^.*" + tokens[0] + "[ .].*", node.shortname))
        for node in nodes:
            find, nodes = search_node(node, sentence)
            if find:
                return find, nodes
        return False, []

def search_articulo(tree, sentence):
    print(tree.children)
    nodes = findall(tree, filter_=lambda node: re.match(".*" + sentence + ".*", node.shortname + node.name))
    for node in nodes:
        for pre, fill, subnode in RenderTree(node, maxlevel=3):
            print("%s%s" % (pre, subnode.name))
    print(nodes)
    if(nodes):
        root = AnyNode(id=0, name=tree.name, shortname=tree.shortname, children=nodes)
        return True, root
    return False, []




def formatTree(tree):
    for token in tree:
        print("hola")
    return tree