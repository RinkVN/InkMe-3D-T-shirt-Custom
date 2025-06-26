import React, { useState } from 'react';
import './CartInkmeInfo.css';
import Inkme3DPreview from '../Inkme3DPreview/Inkme3DPreview';

const CartInkmeInfo = ({ inkmeFile }) => {
    const [showPreview, setShowPreview] = useState(false);

    if (!inkmeFile) return null;

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleString('vi-VN');
    };

    const downloadInkmeFile = () => {
        if (inkmeFile.url) {
            const link = document.createElement('a');
            link.href = inkmeFile.url;
            link.download = `${inkmeFile.sceneName}_layout.inkme`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <>
            <div className="cart-inkme-info">
                <div className="inkme-header">
                    <h4>Thông tin thiết kế tùy chỉnh</h4>
                    <div className="inkme-actions">
                        <button
                            className="preview-3d-btn"
                            onClick={() => setShowPreview(true)}
                            title="Xem preview 3D"
                        >
                            <i className="fa-solid fa-cube"></i>
                            Preview 3D
                        </button>
                        <button
                            className="download-inkme-btn"
                            onClick={downloadInkmeFile}
                            title="Tải file .inkme"
                        >
                            <i className="fa-solid fa-download"></i>
                        </button>
                    </div>
                </div>

                <div className="inkme-details">
                    <div className="detail-row">
                        <span className="label">Tên thiết kế:</span>
                        <span className="value">{inkmeFile.sceneName}</span>
                    </div>

                    <div className="detail-row">
                        <span className="label">Màu áo:</span>
                        <span className="value">
                            <div
                                className="color-preview"
                                style={{ backgroundColor: inkmeFile.color }}
                            ></div>
                            {inkmeFile.color}
                        </span>
                    </div>

                    <div className="detail-row">
                        <span className="label">Màu nền:</span>
                        <span className="value">
                            <div
                                className="color-preview"
                                style={{ backgroundColor: inkmeFile.bgColor }}
                            ></div>
                            {inkmeFile.bgColor}
                        </span>
                    </div>

                    {inkmeFile.acidWash > 0 && (
                        <div className="detail-row">
                            <span className="label">Hiệu ứng Acid Wash:</span>
                            <span className="value">{Math.round(inkmeFile.acidWash * 100)}%</span>
                        </div>
                    )}

                    {inkmeFile.puffPrint > 0 && (
                        <div className="detail-row">
                            <span className="label">Hiệu ứng Puff Print:</span>
                            <span className="value">{Math.round(inkmeFile.puffPrint * 100)}%</span>
                        </div>
                    )}

                    <div className="detail-row">
                        <span className="label">Thời gian tạo:</span>
                        <span className="value">{formatDate(inkmeFile.timestamp)}</span>
                    </div>
                </div>
            </div>

            {showPreview && (
                <Inkme3DPreview
                    inkmeFile={inkmeFile}
                    onClose={() => setShowPreview(false)}
                />
            )}
        </>
    );
};

export default CartInkmeInfo; 