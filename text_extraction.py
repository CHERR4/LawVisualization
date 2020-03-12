import PyPDF2
from nltk.tokenize import word_tokenize
import re
from nltk.corpus import gutenberg, nps_chat
import nltk

PDF_FILE = 'bo291_ANTES GOBIERNO.pdf'
TEXT_FILE = 'lawText.txt'
TOKENS_FILE = 'tokens.txt'


def readTextFromPfd(pdf, min):
    pdfReader = PyPDF2.PdfFileReader(pdf)
    # Extract text from pdf
    text = ""
    for i in range(min, pdfReader.numPages-1):
        text += pdfReader.getPage(i).extractText()
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

def articulo(token):
    pattern = re.compile('^Artículo')
    return pattern.match(token)

def tokenizeText(text):
    # This is needed for tokenize well
    text = re.sub(r"\n", " ", text)
    spanish_tokenizer = nltk.data.load('tokenizers/punkt/spanish.pickle')
    sentences = spanish_tokenizer.tokenize(text)
    articulos = filter(articulo, sentences)
    # print(sentences)
    # for elemento in articulos:
        # print(elemento)
    return articulos

def saveText(text):
    textFile = open(TEXT_FILE, "w+")
    textFile.write(text)
    textFile.close()

def saveTokens(tokens):
    textFile = open(TOKENS_FILE, "w+")
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
    print("1) full execution\n")
    print("2) reload text from textFile\n")
    print("3) reload tokens from tokensFile\n")
    mode = int( input ("Insert mode of execution: \n"))
    # switch (mode)
    pdf = open(PDF_FILE, 'rb')
    text = readTextFromPfd(pdf, 1)
    cleaned_text = cleanText(text)
    # print(cleaned_text)
    saveText(cleaned_text)
    tokens = tokenizeText(cleaned_text)
    print(tokens)
    saveTokens(tokens)
    #readTokens(TOKENS_FILE)
    

if __name__ == "__main__":
    main()