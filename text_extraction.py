import os,glob,subprocess
import pdftotext
import json
import re
import nltk
import pickle
from nltk.tokenize import RegexpTokenizer
from nltk.tokenize import word_tokenize
from nltk.corpus import gutenberg, nps_chat
from anytree import Node, RenderTree, PreOrderIter
from anytree.exporter import DictExporter, JsonExporter
from anytree.search import find, find_by_attr, findall
from collections import OrderedDict

"""
Un título tiene capítulos
Un capítulo tiene secciones
Un capítulo tien artículos
Una sección tiene artículos
Un artículo tiene puntos
"""

PDF_FILE = 'bo291_ANTES GOBIERNO.pdf'
TEXT_FILE = 'lawText.txt'
TOKENS_FILE = 'tokens.txt'
LATEX_HEADER = r'''\documentclass{article}
\usepackage[utf8]{inputenc}
\usepackage{imakeidx}
\makeindex

\begin{document}

\tableofcontents
'''
LATEX_FOOTER = r'''\printindex
\end{document}'''
LATEX_TITLE = r"\title{Boletín Ofcial del Parlamento de Canarias}"
LATEX_DATE = r"\date{22 de septiembre de 2016}"
LATEX_SECTION_TOC_OPEN = r'''\addcontentsline{toc}{section}{'''
LATEX_SECTION_OPEN = r'''}
\section*{'''


def readTextFromPfd():
    with open(PDF_FILE, "rb") as f:
        pdf = pdftotext.PDF(f)
    text = ""
    for page in pdf: 
           text += page
    return text

def cleanText(text):
    # Remove multiple jumpline
    textArr = [line for line in text.split('\n') if line.strip() != '']
    text = ""
    for line in textArr:
        text += (line + "\n")
    text = re.sub(r"Boletín O˜cial del Parlamento de Canarias", "", text)
    text = re.sub(r"22 de septiembre de 2016", "", text)
    text = re.sub(r"Núm. 291 / [0-9]+", "", text)
    return text

def isArticulo(token):
    pattern = re.compile('^Artículo')
    return pattern.match(token)

def isCapitulo(token):
    pattern = re.compile('^Capítulo')
    return pattern.match(token)

def isSeccion(token):
    pattern = re.compile('^Sección')
    return pattern.match(token)

def isTitulo(token):
    pattern = re.compile('^Título')
    return pattern.match(token)

def isKeyword(word):
    return isArticulo(word) or isSeccion(word) or isCapitulo(word) or isTitulo(word)

def manualTokenize(text):
    tokens = nltk.word_tokenize(text)
    articulos = [""]
    for token in tokens: 
        if token == 'Título' or token == 'Capítulo' or token == 'Sección' or token == 'Artículo':
            articulos.append(token)
        else:
            articulos[len(articulos)-1] += (' ' + token)
    return articulos

def manualTokenizeQuery(text):
    tokens = nltk.word_tokenize(text)
    articulos = [""]
    lastIsToken = False
    for token in tokens: 
        if token == 'Título' or token == 'Capítulo' or token == 'Sección' or token == 'Artículo':
            articulos.append(token)
            lastIsToken = True
        elif(not(token == 'Título' or token == 'Capítulo' or token == 'Sección' or token == 'Artículo') and lastIsToken):
            articulos[len(articulos)-1] += (' ' + token)
            lastIsToken = False
        else:
            lastIsToken = False
    return articulos

def tokenizeText(text):
    # Cleaning text format to tokenize
    single_whitespace = re.compile(r"\s+")
    text = re.sub(r"\n", " ", text).replace("\r", " ")
    text = single_whitespace.sub(" ", text).strip()
    # Tokenization by common tokenizer 
    # Want to change for tokenization by important words
    # spanish_tokenizer = nltk.data.load('tokenizers/punkt/spanish.pickle')
    # sentences = spanish_tokenizer.tokenize(text) (.*?)Artículo (?:(?!X).)*
    # tokenizer = RegexpTokenizer('')
    # sentences = tokenizer.tokenize(text)
    sentences = manualTokenize(text)
    #print(sentences)
    #print(len(sentences))
    # Getting important words, this is just for seeing that stract them correctly
    # My objetive is to make a structure with all of them
    articulos = filter(isArticulo, sentences)
    secciones = filter(isSeccion, sentences)
    capitulos = filter(isCapitulo, sentences)
    titulos = filter(isTitulo, sentences)
    return {'partes': sentences, 'articulos': articulos, 'secciones': secciones, 'capitulos': capitulos, 'titulos': titulos}

def subtokenizeToken(token):
    subtokens = [""]
    words = nltk.word_tokenize(token)
    count = 0
    for word in words:
        if  len(word) == 1 and count + 1 < len(words) and words[count + 1] == ')':
            subtokens.extend(word)
            """
        elif word.isnumeric() and count + 1 < len(words) and words[count + 1] == '.':
            subtokens.extend(word)
            """
        else:
            subtokens[len(subtokens) - 1] += (' ' + word)
        count += 1
    return subtokens

def subtokenizeText(tokens):
    subtokens = []
    for token in tokens:
        subtokens.extend(subtokenizeToken(token))
    return subtokens

def createTokensTree(tokens):
    root = Node("Root")
    lastTitulo = None
    lastCapitulo = None
    lastSeccion = None
    lastArticulo = None
    currentNode = None
    for token in tokens:
        if re.match("^ Título", token):
            currentNode = Node(token, parent=root)
            lastTitulo = currentNode
            lastCapitulo = None
            lastSeccion = None
            lastArticulo = None
        elif re.match('^ Capítulo', token):
            currentNode = Node(token, parent=lastTitulo)
            lastCapitulo = currentNode
            lastSeccion = None
            lastArticulo = None
        elif re.match('^ Sección', token):
            currentNode = Node(token, parent=lastCapitulo)
            lastSeccion = currentNode
            lastArticulo = None
        elif re.match('^ Artículo', token):
            if lastSeccion == None:
                currentNode = Node(token, parent=lastCapitulo)
            else:
                currentNode = Node(token, parent=lastSeccion)
            lastArticulo = currentNode
        elif re.match('^ [a-z] [)]', token):
            currentNode = Node(token, parent=lastArticulo)
    #for pre, fill, node in RenderTree(root):
    #    print("%s%s" % (pre, node.name))
    return root

def saveText(text):
    textFile = open("outputs/" + TEXT_FILE, "w+")
    textFile.write(text)
    textFile.close()

def saveTokens(filename, tokens):
    textFile = open("outputs/" + filename + '.txt', "w+")
    for token in tokens:
        textFile.write(token + '\n')
    textFile.close()

def readTokens(documento):
    textFile = open(documento, "r+")
    tokens = textFile.read()
    textFile.close()
    return tokens

def createDictTree(tree):
    exporter = DictExporter(dictcls=OrderedDict, attriter=sorted)
    dictTree = exporter.export(tree)
    return dictTree

def createJsonTree(tree):
    exporter = JsonExporter(indent=2, sort_keys=True)
    jsonTree = exporter.export(tree)
    return jsonTree

def saveDictTree(dictTree):
    with open('outputs/dictTree.p', 'wb') as file:
        pickle.dump(dictTree, file, protocol=pickle.HIGHEST_PROTOCOL)

def saveJsonTree(jsonTree):
    with open('outputs/jsonTree.txt', 'w') as file:
        json.dump(jsonTree, file)


def searchToken(artículo, tree):
    """
    This method is for searching one articl giving the full tree
    """
    print("hola mundo")

def exportTreeLatex(tree):
    for node in PreOrderIter(tree):
        print("Hola mundo")

def exportTokensLatex(tokens):
    document = LATEX_HEADER
    for token in tokens:
        if re.match("^ Título", token):
            document += LATEX_SECTION_TOC_OPEN
            document += token.split(' ', 1)[1]
            document += LATEX_SECTION_OPEN
            document += token.split(' ', 1)[1]
            # document += token.split(' ', 2)[2]
            document += r'''}
            '''
            # allExceptOne = " ".join(token.split(' ')[4:])
            # document += allExceptOne
        elif re.match('^ Capítulo', token):
            print("hola")
        elif re.match('^ Sección', token):
            print("hola")
        elif re.match('^ Artículo', token):
            print("hola")
        elif re.match('^ [a-z] [)]', token):
            print("hola")
    document += LATEX_FOOTER

    with open('outputs/law.tex','w') as f:
        f.write(document)

    commandLine = subprocess.Popen(['pdflatex', 'outputs/law.tex'])
    commandLine.communicate()

    os.unlink('outputs/law.aux')
    os.unlink('outputs/law.log')
    os.unlink('outputs/law.tex')
    return document

# Tengo: busco un nodo y todos sus hijos a partir de una palabra por la que empiza
# Quiero conseguir: me pasan una consulta: la tokenizo, obtengo todos los subnodos de orden menor en orden
def searchNode(tree, sentence):
    tokens = manualTokenizeQuery(sentence)
    # this is becouse it introduces an space at first TODO fix
    if(len(tokens) <= 2):
        nodes = findall(tree, filter_= lambda node : re.match("^ " + tokens[1] + " ", node.name))
        for node in nodes:
            for pre, fill, subnode in RenderTree(node):
                print("%s%s" % (pre, subnode.name))
    else:
        sentence = " "
        sentence = sentence.join(tokens[2:len(tokens)])
        nodes = findall(tree, filter_= lambda node : re.match("^ " + tokens[1] + " ", node.name))
        for node in nodes:
            searchNode(node, sentence)


def main():
    '''
    print("1) full execution\n")
    print("2) reload text from textFile\n")
    print("3) reload tokens from tokensFile\n")
    mode = int( input ("Insert mode of execution: \n"))
    switch (mode)
    '''
    text = readTextFromPfd()
    cleaned_text = cleanText(text)
    # print(cleaned_text)
    saveText(cleaned_text)
    tokens = tokenizeText(cleaned_text)
    subtokens = subtokenizeText(tokens['partes'])
    saveTokens('articulos', tokens['articulos'])
    saveTokens('secciones', tokens['secciones'])
    saveTokens('capitulos', tokens['capitulos'])
    saveTokens('titulos', tokens['titulos'])
    saveTokens('partes', tokens['partes'])
    saveTokens('subtokens', subtokens)
    tree = createTokensTree(subtokens)
    # dictTree = createDictTree(tree)
    # jsonTree = createJsonTree(tree)
    # saveDictTree(dictTree)
    # saveJsonTree(jsonTree)
    consulta = "Título VI quiero el Capítulo II , el Artículo 316"
    searchNode(tree, consulta)
    # exportTokensLatex(subtokens)
    # readTokens(TOKENS_FILE)


if __name__ == "__main__":
    main()