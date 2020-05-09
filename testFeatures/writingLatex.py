import os,glob,subprocess

title = r"\title{Boletín Ofcial del Parlamento de Canarias}"
date = r"\date{22 de septiembre de 2016}"
# Me falta poner el número de página formato: Núm. numPages / numPage



header = r'''\documentclass{article}
\usepackage[utf8]{inputenc}
\usepackage{imakeidx}
\makeindex

\begin{document}
'''

articulo =  r'''\section*{Artículo primero}
Hola españoles, este es el artículo primero, lo tengo que hacer muy largo a propósito porque mi objetivo es comprobar si el texto se autoformatea en líneas
'''

footer = r'''\printindex
\end{document}'''

main = r'''\section{Introduction}
In this example several keywords\index{keywords} will be used 
which are important and deserve to appear in the Index\index{Index}.

Terms like generate\index{generate} and some\index{others} will 
also show up. 
'''

content = header + main + articulo + footer

with open('document.tex','w') as f:
     f.write(content)

commandLine = subprocess.Popen(['pdflatex', 'document.tex'])
commandLine.communicate()

os.unlink('document.aux')
os.unlink('document.log')
os.unlink('document.tex')