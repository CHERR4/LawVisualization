import React, { Fragment, useState, useEffect } from 'react';
import Message from './Message';
import Progress from './Progress';
import PdfComponent from './PdfComponent';
import LawTable from './LawTable'
import LawTreeComponent from './LawTreeComponent'
import LawTreeCards from './LawTreeCardsComponent'
import SearchAppBar from './SearchAppBar'
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState('');
  const [filename, setFilename] = useState('Choose File');
  const [uploadedFile, setUploadedFile] = useState({});
  const [message, setMessage] = useState('');
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [filter, setFilter] = useState('')
  //const [lawTree, setLawTree] = useState('')
  const lawTree = useGetLawTree(filename)
  

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

      const { fileName, filePath } = res.data;
      console.log(fileName)
      setUploadedFile({ fileName, filePath });
      setMessage('File Uploaded');
      setFilter('')
    } catch (err) {
      if (err.response.status === 500) {
        setMessage('There was a problem with the server');
      } else {
        setMessage(err.response.data.msg);
      }
    }
  };

  return (
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
      {uploadedFile ? (
        <div className='row mt-5'>
          <div className='col-md-6 m-auto'>
            <h3 className='text-center'>{uploadedFile.fileName}</h3>
            <PdfComponent pathToPdf={uploadedFile.filePath}/>
          </div>
        </div>
      ) : null}
      {lawTree ? (
        <LawTreeCards data={lawTree.data}/>
      ): null}
    </Fragment>
  );
};

export default FileUpload;

export default function useGetLawTree(document) {
  console.log("useGetLawTree: " + document)
  const [data, setData] = useState();
  useEffect(() => {
    axios.get("http://localhost:5001/getLawTree/bo291_ANTES%20GOBIERNO.pdf").then(response =>{
      setData(response)
    })
  }, [document])
  return data
}