import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux'
import Message from './Message';
import Progress from './Progress';
import { makeStyles } from '@material-ui/core/styles';
import PdfComponent from './PdfComponent';
import LawTreeCards from './LawTreeCardsComponent'
import SearchAppBar from './SearchAppBar'
import axios from 'axios';
import { uploadFile } from '../actions/index'

const useStyles = makeStyles({
  root: {
      width: '50%',
      margin: 'auto',
      marginTop: '5em',
  },
});

const mapDispatchToProps = (dispatch) => {
  return {
      uploadFile: file => dispatch(uploadFile(file))
  }
}



const ConnectedFileUpload = (props) => {
  const [file, setFile] = useState('');
  const [filename, setFilename] = useState('');
  const [message, setMessage] = useState('');
  const [uploadPercentage, setUploadPercentage] = useState(0);
  //const [lawTree, setLawTree] = useState('')

  const classes = useStyles();
  

  const onChange = e => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const onSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'application/pdf'
        },
        onUploadProgress: progressEvent => {
          setUploadPercentage(
            parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            )
          );

          // Clear percentage
          setTimeout(() => setUploadPercentage(0), 10000);
        }
      });
      setMessage('File Uploaded');
      props.uploadFile({filename})
    } catch (err) {
      if (err.response.status === 500) {
        setMessage('There was a problem with the server');
      } else {
        setMessage(err.response.data.msg);
      }
    }
  };

  return (
    <div className={classes.root}>
      <Fragment>
        {message ? <Message msg={message} /> : null}
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

          <Progress percentage={uploadPercentage} />

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
