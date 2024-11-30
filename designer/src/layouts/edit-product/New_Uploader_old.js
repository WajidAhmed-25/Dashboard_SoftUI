import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './style.css';
import SoftButton from 'components/SoftButton';

const NewUploader = ({ attachments, onUpdate, edit }) => {
  const extractFileDetails = (attachments) => {
    try {
      const parsedAttachments = JSON.parse(attachments);
      if (parsedAttachments.length > 0) {
        const { filename, file_path, mimeType } = parsedAttachments[0];
        return { filename, file_path, mimeType };
      }
    } catch (error) {
      console.error('Error parsing attachments:', error);
    }
    return { filename: 'Demo Name', file_path: 'Demo Path', mimeType: 'Demo Type' };
  };

  const { filename, file_path, mimeType } = extractFileDetails(attachments);

  const [files, setFiles] = useState([]);
  const [dbFiles, setDbFiles] = useState([]);
  const [currentFile, setCurrentFile] = useState(null);
  const [currentFileUrl, setCurrentFileUrl] = useState(null);
  const [isFromDb, setIsFromDb] = useState(false);

  useEffect(() => {
    const dbFiles = [
      { name: `${filename}`, url: `${file_path}`, type: `${mimeType}` }
    ];
    if (dbFiles[0].name !== 'Demo Name') {
      setDbFiles(dbFiles);
    }
  }, [filename, file_path, mimeType]);

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    console.log("attachments", newFiles);
    setFiles([...files, ...newFiles]);
    const newAttachments = JSON.stringify(newFiles.map(file => ({
      filename: file.name,
      file_path: URL.createObjectURL(file),
      mimeType: file.type
    })));
    onUpdate(newAttachments); // Call the onUpdate callback
  };

  console.log(files);

  const handleThumbnailClick = (file, fileUrl, fromDb) => {
    setCurrentFile(file);
    setCurrentFileUrl(fileUrl);
    setIsFromDb(fromDb);
  };

  const handleDownload = () => {
    if (currentFileUrl) {
      const link = document.createElement('a');
      link.href = currentFileUrl;
      link.download = currentFile.name;
      if (isFromDb) {
        link.target = '_blank';
      }
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDelete = (file, fromDb) => {
    if (fromDb) {
      setDbFiles(dbFiles.filter(f => f !== file));
    } else {
      setFiles(files.filter(f => f !== file));
    }
    setCurrentFile(null);
    setCurrentFileUrl(null);
  };

  const getFileType = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    const types = {
      'pdf': 'PDF',
      'zip': 'ZIP',
      'rar': 'RAR',
      'eps': 'EPS',
      'ai': 'AI',
      'doc': 'DOC',
      'docx': 'DOCX',
      'cnd': 'CND',
      'dst': 'DST',
      'emb': 'EMB',
      'exp': 'EXP',
      'pes': 'PES',
      'ppt': 'PPT',
      'pxf': 'PXF',
      'heic': 'HEIC',
      'svg': 'SVG',
      'bmp': 'BMP',
      'pso': 'PSO',
      'cdr': 'CDR'
    };
    return types[ext] || ext.toUpperCase();
  };

  const hasDemoName = dbFiles.some(file => file.name !== 'Demo Name');

  return (
    <div className="App">
        <input
          type="file"
          id="fileUpload"
          multiple
          accept="image/*,.pdf,.zip,.rar,.eps,.ai,.doc,.docx,.cnd,.dst,.emb,.exp,.pes"
          onChange={handleFileChange}
          disabled={!edit}
        />

      {currentFile && (
        <div id="enlargedPreview">
          {currentFile.type.startsWith('image/') ? (
            <img id="enlargedImage" src={currentFileUrl} alt="Enlarged" />
          ) : (
            <div id="fileInfo">
              {`File Name: ${currentFile.name}\nFile Type: ${currentFile.type}`}
            </div>
          )}
          <SoftButton variant="gradient" color="info" id="downloadBtn" onClick={handleDownload}>Download</SoftButton>
        </div>
      )}
      {/* <span id="filePreview">
        {files.map((file, index) => (
          <div className="file-container" key={index}>
            {file.type.startsWith('image/') ? (
              <img src={URL.createObjectURL(file)} className="thumbnail" alt={file.name} onClick={() => handleThumbnailClick(file, URL.createObjectURL(file), false)} />
            ) : (
              <div className="thumbnail" onClick={() => handleThumbnailClick(file, URL.createObjectURL(file), false)}>{getFileType(file.name)}</div>
            )}
            <button className="delete-btn" onClick={() => handleDelete(file, false)}>X</button>
          </div>
        ))}
      </span> */}
      <span id="dbFilePreview">
        {dbFiles.map((file, index) => (
          <div className="file-container" key={index}>
            {file.type.startsWith('image/') ? (
              <img src={file.url} className="thumbnail" alt={file.name} onClick={() => handleThumbnailClick(file, file.url, true)} />
            ) : (
              <div className="thumbnail" onClick={() => handleThumbnailClick(file, file.url, true)}>{getFileType(file.name)}</div>
            )}
            {edit && (
            <button className="delete-btn" onClick={() => handleDelete(file, true)}>X</button>
          )}
          </div>
        ))}
      </span>
    </div>
  );
};

NewUploader.propTypes = {
  attachments: PropTypes.string.isRequired,
  onUpdate: PropTypes.func.isRequired,
  edit: PropTypes.func.isRequired
};

export default NewUploader;
