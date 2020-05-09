import os,glob,subprocess

text = r'''\documentclass[10pt,a4paper]{article}
\usepackage{makeidx}

\usepackage{xparse}
\makeindex


\let\oldsection\section
\RenewDocumentCommand{\section}{som}{%
  \IfBooleanTF{#1}{%  Is it the starred command? Yes, then no \index
    \oldsection*{#3}
  }{%
  \IfValueTF{#2}{% Is it the optional argument version --> use #3
    \oldsection[#2]{#3\protect\index{#3}}
  }{%
    \oldsection{#3\protect\index{#3}} % Use #3 as well
  }
}
}

\begin{document}
\tableofcontents

\section{foo}

\printindex

\end{document}'''

with open('index.tex','w') as f:
     f.write(text)

commandLine = subprocess.Popen(['pdflatex', 'index.tex'])
commandLine.communicate()

os.unlink('index.aux')
os.unlink('index.log')
os.unlink('index.tex')