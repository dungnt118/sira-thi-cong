import React from 'react';
import { PhoneOutlined, CustomerServiceOutlined } from '@ant-design/icons';

const FloatingCTA: React.FC = () => {
  return (
    <div className="floating-cta-container">
      <a href="https://zalo.me/0362555167" target="_blank" rel="noreferrer" className="floating-button zalo">
        <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg" alt="Zalo" style={{ width: '30px' }} />
        <span className="btn-label">Chat Zalo</span>
      </a>
      <a href="https://m.me/bacgroup" target="_blank" rel="noreferrer" className="floating-button messenger">
        <CustomerServiceOutlined />
        <span className="btn-label">Messenger</span>
      </a>
      <a href="tel:0362555167" className="floating-button call">
        <PhoneOutlined />
        <span className="phone-number">0362.555.167</span>
        <span className="btn-label">Gọi ngay</span>
      </a>
    </div>
  );
};

export default FloatingCTA;
