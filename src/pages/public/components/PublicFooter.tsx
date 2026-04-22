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
        <div className="footer-content" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '4rem' }}>
          <div className="footer-brand" style={{ gridColumn: 'span 2' }}>
            <div className="logo" style={{ marginBottom: '1.5rem' }}>
              <img src="/logo.png" alt="BAC Group" className="footer-logo" style={{ height: '50px', filter: 'brightness(0) invert(1)' }} />
              <span style={{ fontSize: '1.5rem', fontWeight: 800, marginLeft: '12px', color: 'white', letterSpacing: '-0.02em' }}>BAC Group</span>
            </div>
            <p style={{ maxWidth: '400px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.8 }}>
              Chuyên gia hàng đầu trong lĩnh vực xử lý sự cố công trình và chống thấm chuyên nghiệp. Chúng tôi mang đến giải pháp bền vững, bảo vệ giá trị tài sản vĩnh cửu cho mọi công trình.
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <a href="#" className="social-link"><FacebookOutlined /></a>
              <a href="#" className="social-link"><YoutubeOutlined /></a>
              <a href="#" className="social-link"><GlobalOutlined /></a>
            </div>
          </div>
          
          <div className="footer-links">
            <h4>Dịch vụ</h4>
            <ul>
              <li><Link to="/article/chong-tham-san-thuong">Sân thượng & Sàn mái</Link></li>
              <li><Link to="/article/chong-tham-nha-ve-sinh">Nhà vệ sinh & Khu ẩm ướt</Link></li>
              <li><Link to="/article/chong-tham-tang-ham">Tầng hầm & Bể ngầm</Link></li>
              <li><Link to="/article/chong-tham-tuong-ngoai">Tường ngoài & Khe lún</Link></li>
              <li><Link to="/article/xu-ly-nut-be-tong">Xử lý nứt kết cấu</Link></li>
            </ul>
          </div>
          
          <div className="footer-links">
            <h4>Sản phẩm</h4>
            <ul>
              <li><Link to="/san-pham">Sơn chống thấm</Link></li>
              <li><Link to="/san-pham">Màng chống thấm</Link></li>
              <li><Link to="/san-pham">Vữa chuyên dụng</Link></li>
              <li><Link to="/san-pham">Hóa chất xây dựng</Link></li>
              <li><Link to="/san-pham">Phụ gia bê tông</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Công ty</h4>
            <ul>
              <li><Link to="/gioi-thieu">Về chúng tôi</Link></li>
              <li><Link to="/du-an">Dự án thực tế</Link></li>
              <li><Link to="/chinh-sach">Chính sách bảo hành</Link></li>
              <li><Link to="/chinh-sach">Tin tức & Sự kiện</Link></li>
              <li><Link to="/portal">Portal Khách hàng</Link></li>
            </ul>
          </div>
          
          <div className="footer-links" style={{ gridColumn: 'span 2' }}>
            <h4>Liên hệ trực tiếp</h4>
            <div className="footer-contact-info">
              <div className="footer-contact-item">
                <EnvironmentOutlined style={{ color: 'var(--accent)', marginTop: '5px' }} />
                <span>Trụ sở: Số 12, Ngõ 155 Nguyễn Lương Bằng, Đống Đa, Hà Nội</span>
              </div>
              <div className="footer-contact-item">
                <PhoneOutlined style={{ color: 'var(--accent)', marginTop: '5px' }} />
                <div>
                    <span style={{ display: 'block', opacity: 0.6, fontSize: '0.8rem' }}>Hotline Tư vấn 24/7</span>
                    <span style={{ fontWeight: 800, color: 'var(--accent)', fontSize: '1.25rem' }}>0362 555 167</span>
                </div>
              </div>
              <div className="footer-contact-item">
                <MailOutlined style={{ color: 'var(--accent)', marginTop: '5px' }} />
                <span>Email: contact@bacgroup.vn</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <SafetyCertificateOutlined style={{ color: 'var(--accent)', fontSize: '1.5rem' }} />
            <p style={{ opacity: 0.5, fontSize: '0.85rem', margin: 0 }}>
              &copy; {new Date().getFullYear()} BAC Group. All Rights Reserved. MST: 0108842526
            </p>
          </div>
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
