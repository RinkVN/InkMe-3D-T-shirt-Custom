import React from 'react'

const InkMeFile = ({ inkmeFile }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('vi-VN');
    };

    const downloadFile = () => {
        if (inkmeFile?.url) {
            window.open(inkmeFile.url, '_blank');
        }
    };

    if (!inkmeFile) return null;

    return (
        <button
            onClick={downloadFile}
            className="btn btn-outline-primary btn-sm"
            style={{
                fontSize: '14px',
                padding: '4px 8px',
                marginTop: '5px',
                borderRadius: '4px',
                margin: '10px 0px'
            }}
            title={`Tải file: ${inkmeFile.sceneName || 'Custom Design'}`}
        >
            <i className="fas fa-download"></i> Tải Model 3D
        </button>
    )
}

export default InkMeFile