import re
import nltk
import pdftotext
import time
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
    text = re.sub(r"[0-9]+ de [a-zA-Z]+ de [0-9][0-9][0-9][0-9] Boletín O˜cial del Parlamento de Canarias", "", text)
    text = re.sub(r"[0-9]+ de [a-zA-Z]+ de [0-9][0-9][0-9][0-9] Boletín Oficial del Parlamento de Canarias", "", text)
    text = re.sub(r"Boletín Oficial del Parlamento de Canarias [0-9]+ de [a-zA-Z]+ de [0-9][0-9][0-9][0-9]", "", text)
    text = re.sub(r"12 de junio de 2018 Boletín Oficial del Parlamento de Canarias", "", text)   
    # text = re.sub(r"22 de septiembre de 2016", "", text)
    # Remove the number of page
    text = re.sub(r"Núm. [0-9]+ / [0-9]+", "", text)
    # Cleaning text format to tokenize
    text = re.sub(r"\r", " ", text).replace(r"\n", " ")
    single_whitespace = re.compile(r"\s+")
    text = single_whitespace.sub(" ", text).strip()
    return text


def is_articulo(token):
    token = token.strip()
    return re.match('^Artículo',token)


def is_capitulo(token):
    token = token.strip()
    return re.match('^Capítulo.*', token)


def is_seccion(token):
    token = token.strip()
    return re.match('^Sección.*', token)


def is_titulo(token):
    token = token.strip()
    return re.match('^Título.*', token) or re.match('^TÍTULO.*', token)


def subtokenize_token(token):
    subtokens = [""]
    start_time = time.time()
    words = nltk.word_tokenize(token)
    num_words = len(words)
    duration = time.time() - start_time
    print("Time transcurred: ", duration)
    print("Num words: ", num_words)
    num_words = len(words)
    count = 0
    last_is_token = False
    for word in words:
        word = word.strip()

        """
        word.splitlines()
        word_encode = word.encode('utf-8')
        
        if re.match("[.].+".encode('utf-8'), word_encode, re.MULTILINE):
            print(word)
        if word[0] == '.' and len(word) > 1:
            print(word)
        # If word start by dot, I remove it
        if re.match("^[.].+", word, re.MULTILINE):
            print(word)
            subtokens[len(subtokens) - 1] += '.'
            word = word[1:]
        """
        if not last_is_token and (is_titulo(word) or is_capitulo(word) or is_seccion(word) or is_articulo(word)) and (count < len(words)-2 and ((words[count + 1] != "o") and (words[count + 1] != "habilitante") and (words[count + 1] != "habilitantes") and (words[count + 1] != "de"))):
            subtokens.append(word)
            last_is_token = True
            # print(subtokens)
        elif not last_is_token and len(word) == 1 and count + 1 < len(words) and count > 0 and words[count + 1] == ')' and word != '.' and words[count - 1] != 'letras' and words[count - 1] != ',' and words[count - 1] != 'letra' and words[count - 1] != 'y' and words[count - 1] != 'apartado':
            subtokens.append(word)
            last_is_token = True
        elif not last_is_token and word.isnumeric() and count > 1 and count + 1 < len(words) and (words[count - 1][len(words[count - 1]) - 1] == '.' or words[count + 1] == '.') and words[count - 2] != 'Núm' and words[count - 2] != 'Grupo' and words[count - 1] != 'Natura':
            subtokens.append(word)
            last_is_token = True
        elif not last_is_token and word == '–' and count > 1 and words[count - 1] == ':' and words[count - 1] != '.':
            subtokens.append(word)
            last_is_token = True
        elif not last_is_token and re.match("[0-9]+[.][ªº]", word) and not is_seccion(words[count - 1]):
            subtokens.append(word)
            last_is_token = True
        elif not last_is_token and word == 'Grupo':
            subtokens.append(word)
            last_is_token = True
        else:
            subtokens[len(subtokens) - 1] += (' ' + word)
            if word != '.':
                last_is_token = False
        count += 1
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
            if last_capitulo is None:
                if last_titulo is None:
                    current_node = AnyNode(id=id, parent=root, name=" ".join(token.split('.')[2:]), shortname=" ".join(token.split('.')[0:2]))
                else:
                    current_node = AnyNode(id=id, parent=last_titulo, name=" ".join(token.split('.')[2:]), shortname=" ".join(token.split('.')[0:2]))
            else:
                current_node = AnyNode(id=id, parent=last_capitulo, name=" ".join(token.split('.')[2:]), shortname=" ".join(token.split('.')[0:2]))
            last_seccion = current_node
            last_articulo = None
        elif is_articulo(token):
            token = formatToken(token)
            if last_seccion is None:
                if last_capitulo is None:
                    if last_titulo is None:
                        current_node = AnyNode(id=id, parent=root, name=" ".join(token.split('.')[2:]), shortname=" ".join(token.split('.')[0:2]))
                    else:
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



def exporter_tree(tree):
    exporter = JsonExporter(indent=2)
    array = []
    for child in tree.children:
        array.append(exporter.export(child))
    return array

def exporter_tree_list(tree_list):
    exporter = JsonExporter(indent = 2)
    array = []
    for tree in tree_list:
        array.append(exporter.export(tree))
    return array


def print_wordcloud(text, document):
    stopwords_spanish = stopwords.words('spanish')
    stopwords_spanish.extend(['Artículo', 'Boletín', 'Oficial', 'Parlamento', 'Canarias'])
    # Here I can add all the worlds I dont like as stopwords
    wc = WordCloud(background_color="white", max_words=100,
                   stopwords=stopwords_spanish, contour_width=3, contour_color='steelblue',
                   width=600, height=300)
    # generate word cloud
    wc.generate(text)
    # store to file
    wc.to_file("outputs/" + document + ".png")
    return document + ".png"

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
        nodes = findall(tree, filter_=lambda node: re.match("^ " + tokens[0] + " ", node.shortname))
        for node in nodes:
            for pre, fill, subnode in RenderTree(node, maxlevel=3):
                print("%s%s" % (pre, subnode.name))
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


def search_articulo(tree, sentence, case_sensitive):
    # nodes = findall(tree, filter_=lambda node: re.match(".*" + sentence + ".*", node.shortname + node.name), maxlevel=2)
    if not case_sensitive and re.match(".*" + sentence + ".*", tree.shortname + tree.name, flags=re.IGNORECASE):
        return True, tree
    elif case_sensitive and re.match(".*" + sentence + ".*", tree.shortname + tree.name):
        return True, tree
    elif tree.children:
        nodes = []
        for node in tree.children:
            find, nodeList = search_articulo(node, sentence, case_sensitive)
            if find:
                nodes.append(nodeList)
        if nodes:
            node = AnyNode(id=tree.id, shortname=tree.shortname, name=tree.name, children=nodes)
            return True, node
    return False, None


def search_words(tree, words, case_sensitive):
    array_words = words.split()
    if not case_sensitive:
        for word in array_words:
            if re.match(".*" + word + ".*", tree.shortname + tree.name, flags=re.IGNORECASE):
                return True, tree
    elif case_sensitive:
        for word in array_words:
            if re.match(".*" + word + ".*", tree.shortname + tree.name):
                return True, tree
    if tree.children:
        nodes = []
        for node in tree.children:
            find, nodeList = search_words(node, words, case_sensitive)
            if find:
                nodes.append(nodeList)
        if nodes:
            node = AnyNode(id=tree.id, shortname=tree.shortname, name=tree.name, children=nodes)
            return True, node
    return False, None


def search_regexp(tree, regexp, case_sensitive):
    pattern_sensitive = re.compile(regexp)
    pattern_no_sensitive = re.compile(regexp, flags=re.IGNORECASE)

    if case_sensitive and pattern_sensitive.match((tree.shortname + tree.name).strip()):
        print("Found!")
        return True, tree
    elif not case_sensitive and pattern_no_sensitive.match((tree.shortname + tree.name).strip()):
        print("Found!")
        return True, tree
    elif tree.children:
        nodes = []
        for node in tree.children:
            find, nodeList = search_regexp(node, regexp, case_sensitive)
            if find:
                nodes.append(nodeList)
        if nodes:
            node = AnyNode(id=tree.id, shortname=tree.shortname, name=tree.name, children=nodes)
            return True, node
    return False, None    