import pdftotext
import json
import re
import nltk
import pickle
from nltk.tokenize import RegexpTokenizer
from nltk.tokenize import word_tokenize
from nltk.corpus import gutenberg, nps_chat
from anytree import Node, RenderTree
from anytree.exporter import DictExporter, JsonExporter
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
    for pre, fill, node in RenderTree(root):
        print("%s%s" % (pre, node.name))
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
    dictTree = createDictTree(tree)
    jsonTree = createJsonTree(tree)
    saveDictTree(dictTree)
    saveJsonTree(jsonTree)

    # readTokens(TOKENS_FILE)


if __name__ == "__main__":
    main()