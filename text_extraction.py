import pdftotext
from nltk.tokenize import word_tokenize
import re
from nltk.corpus import gutenberg, nps_chat
import nltk

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

def tokenizeText(text):
    # This is needed for tokenize well
    single_whitespace = re.compile(r"\s+")
    text = re.sub(r"\n", " ", text).replace("\r", " ")
    text = single_whitespace.sub(" ", text).strip()
    spanish_tokenizer = nltk.data.load('tokenizers/punkt/spanish.pickle')
    sentences = spanish_tokenizer.tokenize(text)
    articulos = filter(isArticulo, sentences)
    secciones = filter(isSeccion, sentences)
    capitulos = filter(isCapitulo, sentences)
    titulos= filter(isTitulo, sentences)
    return {'articulos': articulos, 'secciones': secciones, 'capitulos': capitulos, 'titulos': titulos}

def saveText(text):
    textFile = open("outputs/" + TEXT_FILE, "w+")
    textFile.write(text)
    textFile.close()

def saveTokens(filename, tokens):
    textFile = open("outputs/" + filename + '.txt', "w+")
    for token in tokens:
        textFile.write(token + '\n')
        print(token)
    textFile.close()

def readTokens(documento):
    textFile = open(documento, "r+")
    tokens = textFile.read()
    textFile.close()
    return tokens

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
    saveTokens('articulos', tokens['articulos'])
    saveTokens('secciones', tokens['secciones'])
    saveTokens('capitulos', tokens['capitulos'])
    saveTokens('titulos', tokens['titulos'])
    #readTokens(TOKENS_FILE)


if __name__ == "__main__":
    main()