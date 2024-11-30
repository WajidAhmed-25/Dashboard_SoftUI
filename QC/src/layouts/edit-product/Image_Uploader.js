import React, { useState } from 'react';
import "./style.css";

// eslint-disable-next-line react/prop-types
function ImageUploader({ onDownload }) {
    const [files, setFiles] = useState([]);
    const [currentFile, setCurrentFile] = useState(null);

    const getFileType = (fileName) => {
        const ext = fileName.split('.').pop().toLowerCase();
        switch (ext) {
            case 'pdf': return 'PDF';
            case 'zip': return 'ZIP';
            case 'rar': return 'RAR';
            case 'eps': return 'EPS';
            case 'ai': return 'AI';
            case 'doc': return 'DOC';
            case 'docx': return 'DOCX';
            case 'cnd': return 'CND';
            case 'dst': return 'DST';
            case 'emb': return 'EMB';
            case 'exp': return 'EXP';
            case 'pes': return 'PES';
            case 'ppt': return 'PPT';
            case 'pxf': return 'PXF';
            case 'heic': return 'HEIC';
            case 'svg': return 'SVG';
            case 'bmp': return 'BMP';
            case 'pso': return 'PSO';
            case 'cdr': return 'CDR';
            case 'cdr': return 'CDR';
            default: return ext.toUpperCase();
        }
    };

    const handleFileChange = (event) => {
        const newFiles = Array.from(event.target.files);
        setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    };

    const handleThumbnailClick = (file) => {
        setCurrentFile(file);
    };

    const handleDelete = (fileToDelete) => {
        setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToDelete));
        if (currentFile === fileToDelete) {
            setCurrentFile(null);
        }
    };

    const handleDownload = () => {
        if (currentFile) {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(currentFile);
            link.download = currentFile.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

//   const handleDownload = () => {
//     if (onDownload && enlargedImage) {
//       onDownload(enlargedImage);
//     }
//   };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '20px' }}>
    <input type="file" id="fileUpload" multiple accept="image/*,.pdf,.zip,.rar,.eps,.ai,.doc,.docx,.cnd,.dst,.emb,.exp,.pes" onChange={handleFileChange} style={{ marginBottom: '20px' }} />
    <div id="enlargedPreview" style={{ marginTop: '20px', display: currentFile ? 'flex' : 'none', flexDirection: 'column', alignItems: 'center',marginBottom:"10px" }}>
        {currentFile && currentFile.type.startsWith('image/') && (
            <img id="enlargedImage" src={URL.createObjectURL(currentFile)} alt="Enlarged" style={{ maxWidth: '100%', maxHeight: '400px' }} />
        )}
        {currentFile && !currentFile.type.startsWith('image/') && (
            <div id="fileInfo" style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f0f0f0', border: '1px solid #ccc', display: 'block', whiteSpace: 'pre-wrap' }}>
                File Name: {currentFile.name}
                <br />
                File Type: {currentFile.type}
            </div>
        )}
    
    </div>   
    <div id="filePreview" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {files.map((file) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            return (
                <div key={file.name} className="file-container" style={{ position: 'relative', width: '70px' }}>
                    {file.type.startsWith('image/') ? (
                        <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="thumbnail"
                            style={{ width: '100%', cursor: 'pointer', border: '2px solid transparent' }}
                            onClick={() => handleThumbnailClick(file)}
                        />
                    ) : (
                        <div
                            className="thumbnail"
                            style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0', border: '1px solid #ccc', cursor: 'pointer', border: '2px solid transparent', textAlign: 'center', fontWeight: 'bold' }}
                            onClick={() => handleThumbnailClick(file)}
                        >
                            {getFileType(file.name)}
                        </div>
                    )}
                    <button
                        className="delete-btn"
                        style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(255, 0, 0, 0.8)', color: 'white', border: 'none', cursor: 'pointer', padding: '2px 5px', fontSize: '8px' }}
                        onClick={() => handleDelete(file)}
                    >
                        X
                    </button>
                </div>
            );
        })}
    </div>
  
     <button id="downloadBtn" style={{ marginTop: '10px', padding: '10px 20px', backgroundColor: '#007BFF', color: 'white', border: 'none', cursor: 'pointer', display: currentFile ? 'block' : 'none' }} onClick={handleDownload}>
            Download
        </button>
</div>
  );
}

export default ImageUploader;