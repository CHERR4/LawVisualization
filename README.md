# LawVisualization

LawVisualization is a TFG project in order to visualizate of a better way the laws

  node version: v10.19.0
  npm version: 6.14.4
  python version: 3.7.6
  pip version: 20.0.2 from python 3.7
  git version: 2.25.1

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
      1. `pip install anytree==2.8.0`
      2. `pip install flask_cors==3.8.0`
      3. `pip install pdftotext==2.1.4`
      4. `pip install wordcloud==1.7.0`
      5. Install any additional required package
      6. If a package isn't found try without the version
  3. `python3 server.py`
  

  
  ## App
  You can launch in any navigator http://localhost:3000/ and try the differente features with different laws that are on the repo, at the moment not all document work
