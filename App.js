import React, { useState } from 'react';
import axios from 'axios';
import { Document, Page, pdfjs } from 'react-pdf';
import { useDropzone } from 'react-dropzone';
import { FaFilePdf } from "react-icons/fa6";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function App() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [fileName, setFileName] = useState('');

  const onDrop = (acceptedFiles) => {
    const files = acceptedFiles.map(file => ({
      file: file,
      name: file.name
    }));
    setUploadedFiles(prevFiles => [...prevFiles, ...files]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const uploadFile = async (selectedFile) => {
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://localhost:3000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data.success) {
        return response.data.url;
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleViewFile = (fileUrl) => {
    setPdfUrl(fileUrl);
  };
const handleDownloadFile = async (file) => {
    const fileUrl = await uploadFile(file);
    if (fileUrl) {
      // Create a temporary anchor element
      const link = document.createElement('a');
      link.href = fileUrl;
      link.setAttribute('download', file.name);
      // Simulate a click on the anchor to trigger the download
      document.body.appendChild(link);
      link.click();
      // Remove the anchor from the body
      document.body.removeChild(link);
    }
  };



  return (
    <div className="App" style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>PDF Manager</h1>

      <div {...getRootProps()} style={{ border: '2px dashed black', padding: '20px', textAlign: 'center', marginBottom: '20px' , height:'200px', width:'400px',alignItems:'center', justifyContent:'center',padding:'50px'}}>
        <input {...getInputProps()} />
        {isDragActive ? <p>Drop the PDF file here...</p> : <p>Drag 'n' drop a PDF file here, or click to select a file</p> }
      </div>

      {uploadedFiles.map((uploadedFile, index) => (
        <div key={index}>
          <p>Selected File: <FaFilePdf style={{color:'red', marginRight:'10px'}}/>{uploadedFile.name}</p>
          <button onClick={() => handleViewFile(uploadedFile.file)} style={{ marginRight: '10px' , height:'40px', width:'100px', background:'blue', color:'white'}}>View</button>
          <button onClick={() => handleDownloadFile(uploadedFile.file)} style={{ marginRight: '10px' , height:'40px', width:'100px', background:'green', color:'white' }}>Download</button>
        </div>
      ))}

      {pdfUrl && (
        <div style={{ marginTop: '20px' }}>
          <h2>Uploaded PDF:</h2>
          <Document file={pdfUrl} >
            <Page pageNumber={1} />
          </Document>
        </div>
      )}
    </div>
  );
}

export default App;
