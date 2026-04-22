import React from 'react';
import { Link } from 'react-router-dom';
import { 
  PhoneOutlined, 
  MailOutlined, 
  EnvironmentOutlined,
  FacebookOutlined,
  YoutubeOutlined,
  GlobalOutlined,
  SafetyCertificateOutlined,
  SolutionOutlined,
  PropertySafetyOutlined
} from '@ant-design/icons';

const PublicFooter: React.FC = () => {
  return (
    <footer className="landing-footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="logo" style={{ marginBottom: '2rem' }}>
              <img src="/logo.png" alt="BAC Group" className="footer-logo" style={{ height: '60px', filter: 'brightness(0) invert(1)' }} />
            </div>
            <p>Công ty Chống thấm BAC tự hào mang đến cho quý khách hàng dịch vụ chống thấm chuyên nghiệp và hoàn hảo nhất với hơn 20 năm kinh nghiệm trong ngành xử lý sự cố công trình.</p>
            <div style={{ display: 'flex', gap: '1.25rem', marginTop: '2.5rem' }}>
              <a href="https://facebook.com" className="social-link" title="Facebook"><FacebookOutlined style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,0.6)' }} /></a>
              <a href="https://youtube.com" className="social-link" title="Youtube"><YoutubeOutlined style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,0.6)' }} /></a>
              <a href="https://bacgroup.vn" className="social-link" title="Website"><GlobalOutlined style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,0.6)' }} /></a>
            </div>
          </div>
          
          <div className="footer-links">
            <h4>Dịch vụ nổi bật</h4>
            <ul>
              <li><Link to="/article/chong-tham-san-thuong">Chống thấm Sân thượng</Link></li>
              <li><Link to="/article/chong-tham-nha-ve-sinh">Chống thấm Nhà vệ sinh</Link></li>
              <li><Link to="/article/chong-tham-tang-ham">Chống thấm Tầng hầm</Link></li>
              <li><Link to="/article/chong-tham-mai-ton">Chống thấm Mái tôn</Link></li>
              <li><Link to="/article/xu-ly-nut-be-tong">Xử lý nứt bê tông</Link></li>
              <li><Link to="/article/chong-tham-tuong-ngoai">Chống thấm Tường ngoài</Link></li>
              <li><Link to="/article/chong-tham-be-boi">Chống thấm Bể bơi</Link></li>
            </ul>
          </div>
          
          <div className="footer-links">
            <h4>Thông tin hữu ích</h4>
            <ul>
              <li><Link to="/gioi-thieu">Về BAC Group</Link></li>
              <li><Link to="/du-an">Dự án tiêu biểu</Link></li>
              <li><Link to="/chinh-sach">Chính sách bảo hành</Link></li>
              <li><Link to="/chinh-sach">Quy định bảo mật</Link></li>
              <li><Link to="/san-pham">Danh mục sản phẩm</Link></li>
              <li><Link to="/lien-he">Liên hệ báo giá</Link></li>
              <li><Link to="/lien-he">Tuyển dụng</Link></li>
            </ul>
          </div>
          
          <div className="footer-links">
            <h4>Thông tin liên hệ</h4>
            <div className="footer-contact-info">
              <div className="footer-contact-item">
                <EnvironmentOutlined />
                <span>Số 12, Ngõ 155 Nguyễn Lương Bằng, Đống Đa, Hà Nội</span>
              </div>
              <div className="footer-contact-item">
                <PhoneOutlined />
                <span style={{ fontWeight: 700, color: 'var(--accent)', fontSize: '1.1rem' }}>0362555167</span>
              </div>
              <div className="footer-contact-item">
                <MailOutlined />
                <span>contact@bacgroup.vn</span>
              </div>
              <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', fontSize: '0.85rem' }}>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)' }}><SafetyCertificateOutlined style={{ marginRight: '0.5rem' }} /> Đã thông báo Bộ Công Thương</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p style={{ opacity: 0.4, fontSize: '0.85rem', margin: 0 }}>&copy; {new Date().getFullYear()} BAC Group. Chống thấm vĩnh cửu cho mọi công trình. Designed by Antigravity.</p>
          <div className="footer-bottom-links">
            <Link to="/chinh-sach">Điều khoản</Link>
            <Link to="/chinh-sach">Bảo mật</Link>
            <Link to="/chinh-sach">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
