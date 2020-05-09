import React, { Fragment } from 'react';
import FileUpload from './components/FileUpload';
import SearchAppBar from './components/SearchAppBar';
import TemporaryDrawer from './components/SideNavApp';
import './App.css';

const App = () => (
  <Fragment>
    <SearchAppBar></SearchAppBar>
    <div className='container mt-4'>
      <h4 className='display-4 text-center mb-4'>
        <i className='fab fa-react' /> File Upload
      </h4>
      <FileUpload />
    </div>
  </Fragment>
);

export default App;
