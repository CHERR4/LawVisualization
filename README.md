# LawVisualization

LawVisualization is a TFG project in order to visualizate of a better way the laws

To use it:
  1. `git clone https://github.com/CHERR4/LawVisualization.git`
  
  ### Client
  1. `cd LawVisualization/mernApp/react_file_uploader/client/`
  2. `npm install`
  3. (If problem with dependencies) `npm audit fix && npm audit fix --force`
  4. `npm start`
  
  ### Node Server
  1. `cd LawVisualization/mernApp/react_file_uploader/server/`
  2. `npm install`
  3. (If problem with dependencies) `npm audit fix && npm audit fix --force`
  4. `nodemon start`
  
  ### Python service
  1. `cd LawVisualization/mernApp/react_file_uploader/server/services`
  2. Install packages:
      1. `pip install anytree`
      2. `pip install flask_cors`
      3. `pip install pdftotext`
      4. `pip install wordcloud`
      5. Install any additional required package
  3. `python3 server.py`
  
  ## App
  You can launch in any navigator http://localhost:3000/ and try the differente features with different laws that are on the repo, at the moment not all document work
