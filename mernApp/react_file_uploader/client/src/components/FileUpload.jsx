import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles';
import { uploadFile } from '../actions/index'
import store from '../store/index'

const useStyles = makeStyles({
  root: {
      width: '50%',
      margin: 'auto',
      marginTop: '5em',
  },
});

const mapDispatchToProps = (dispatch) => {
  return {
      uploadFile: file => store.dispatch(uploadFile(file))
  }
}



const ConnectedFileUpload = (props) => {
  const [file, setFile] = useState('');
  const [filename, setFilename] = useState('');
  //const [lawTree, setLawTree] = useState('')

  const classes = useStyles();
  

  const onChange = e => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const onSubmit = async e => {
    e.preventDefault();  
    props.uploadFile({file})
  };

  return (
    <div className={classes.root}>
      <Fragment>
        <form onSubmit={onSubmit}>
          <div className='custom-file mb-4'>
            <input
              type='file'
              className='custom-file-input'
              id='customFile'
              onChange={onChange}
            />
            <label className='custom-file-label' htmlFor='customFile'>
              {filename}
            </label>
          </div>
          <input
            type='submit'
            value='Upload'
            className='btn btn-primary btn-block mt-4'
          />
        </form>
      </Fragment>
    </div>
  );
};

const FileUpload = connect(null, mapDispatchToProps)(ConnectedFileUpload);

export default FileUpload;
