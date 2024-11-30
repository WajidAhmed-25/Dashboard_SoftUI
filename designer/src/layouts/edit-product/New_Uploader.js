import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './style.css';
import SoftButton from 'components/SoftButton';

// eslint-disable-next-line react/prop-types
const NewUploader = ({ attachments, onUpdate, edit,onFileSelect }) => {
  const extractFileDetails = (attachments) => {
    try {
      const parsedAttachments = JSON.parse(attachments);
      if (Array.isArray(parsedAttachments)) {
        return parsedAttachments.map(({ filename, file_path, mimeType }) => ({
          filename,
          file_path,
          mimeType,
        }));
      }
    } catch (error) {
      console.error('Error parsing attachments:', error);
    }
    return [];
  };

  const initialFiles = extractFileDetails(attachments);
  const [files, setFiles] = useState(initialFiles);
  const [currentFile, setCurrentFile] = useState(null);
  const [currentFileUrl, setCurrentFileUrl] = useState(null);
  const [isFromDb, setIsFromDb] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    setFiles(extractFileDetails(attachments));
  }, [attachments]);

  useEffect(() => {
    if (selectedFile) {
      setCurrentFile(selectedFile);
      setCurrentFileUrl(selectedFile.file_path);
    }
  }, [selectedFile]);

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    const updatedFiles = [...files];

    newFiles.forEach((newFile) => {
      const exists = updatedFiles.some((file) => 
        (file.filename || file.name) === newFile.name && 
        file.file_path === URL.createObjectURL(newFile)
      );

      if (!exists) {
        updatedFiles.push({
          filename: newFile.name,
          file_path: URL.createObjectURL(newFile),
          mimeType: newFile.type,
        });
      }
    });

    setFiles(updatedFiles);
    onFileSelect([...files, ...newFiles]);
    onUpdate(JSON.stringify(updatedFiles));
  };

  const handleThumbnailClick = (file, fileUrl, fromDb) => {
    setCurrentFile(file);
    setCurrentFileUrl(fileUrl);
    setIsFromDb(fromDb);
  };

  const handleDownload = () => {
    if (currentFileUrl) {
      const link = document.createElement('a');
      link.href = currentFileUrl;
      link.download = currentFile.filename || currentFile.name;
      if (isFromDb) {
        link.target = '_blank';
      }
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDelete = (file, fromDb) => {
    const updatedFiles = files.filter(f => f !== file);
    setFiles(updatedFiles);
    onUpdate(JSON.stringify(updatedFiles));
    if (selectedFile === file) {
      setSelectedFile(null);
      setCurrentFile(null);
      setCurrentFileUrl(null);
    }
  };

  const handleSelectFile = (file) => {
    setSelectedFile(file);
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
          {currentFile.mimeType?.startsWith('image/') ? (
            <img id="enlargedImage" src={currentFileUrl} alt="Enlarged" />
          ) : (
            <div id="fileInfo">
              {`File Name: ${currentFile.filename}\nFile Type: ${currentFile.mimeType}`}
            </div>
          )}
          <SoftButton variant="gradient" color="info" id="downloadBtn" onClick={handleDownload}>Download</SoftButton>
        </div>
      )}

      <div id="dbFilePreview">
        {files.map((file, index) => (
          <div className="file-container" key={index}>
            {file.mimeType.startsWith('image/') ? (
              <div
                className="thumbnail-container"
                style={{ opacity: selectedFile === file ? 0.5 : 1 }}
              >
                <img
                  src={file.file_path}
                  className="thumbnail"
                  alt={file.filename}
                  onClick={() => handleThumbnailClick(file, file.file_path, false)}
                />
                <label style={{ fontSize:"12px" }}>
                  <input
                    type="radio"
                    name="dominantImage"
                    checked={selectedFile === file}
                    onChange={() => handleSelectFile(file)}
                  />
                  Dominant
                </label>
              </div>
            ) : (
              <div
                className="thumbnail-container"
                style={{ opacity: selectedFile === file ? 0.5 : 1 }}
                onClick={() => handleThumbnailClick(file, file.file_path, false)}
              >
                <div className="thumbnail">
                  {getFileType(file.filename)}
                </div>
                <label>
                  <input
                    type="radio"
                    name="dominantImage"
                    checked={selectedFile === file}
                    onChange={() => handleSelectFile(file)}
                  />
                  Dominant
                </label>
              </div>
            )}
            {edit && (
              <button className="delete-btn" onClick={() => handleDelete(file, false)}>
                X
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

NewUploader.propTypes = {
  attachments: PropTypes.string.isRequired,
  onUpdate: PropTypes.func.isRequired,
  edit: PropTypes.bool.isRequired,
};

export default NewUploader;
