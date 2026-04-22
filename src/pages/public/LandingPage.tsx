import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import { 
  CheckCircleFilled, 
  PhoneOutlined, 
  ArrowRightOutlined, 
  SafetyCertificateOutlined, 
  GlobalOutlined, 
  TeamOutlined, 
  ExperimentOutlined,
  CustomerServiceOutlined,
  SearchOutlined,
  EditOutlined,
  CheckOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { message } from 'antd';

import PublicHeader from './components/PublicHeader';
import PublicFooter from './components/PublicFooter';
import FloatingCTA from './components/FloatingCTA';

const LandingPage: React.FC = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    document.title = "BAC Group | Chuyên gia Xử lý Sự cố Công trình Hàng đầu";
    const meta = document.querySelector('meta[name="description"]') || document.createElement('meta');
    meta.setAttribute('name', 'description');
    meta.setAttribute('content', 'BAC Group - Chuyên gia hàng đầu trong lĩnh vực xử lý sự cố công trình, chống thấm chuyên nghiệp với công nghệ hiện đại và bảo hành dài hạn.');
    if (!document.querySelector('meta[name="description"]')) {
      document.head.appendChild(meta);
    }
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    message.success('Yêu cầu của bạn đã được tiếp nhận. Chúng tôi sẽ liên hệ lại ngay!');
  };

  return (
    <div className="landing-page">
      <PublicHeader />
      <FloatingCTA />

      <main>
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-bg">
            <img src="/images/landing/hero.png" alt="Modern construction" />
          </div>
          <div className="container hero-container">
            <div className="hero-content">
              <div className="hero-tagline animate-up">Chuyên gia xử lý sự cố công trình hàng đầu</div>
              <h1 className="animate-up" style={{ animationDelay: '0.2s' }}>
                KIẾN TẠO SỰ VỮNG BỀN <br /> 
                <span style={{ color: '#60a5fa' }}>CHO TỔ ẤM CỦA BẠN</span>
              </h1>
              <p className="animate-up" style={{ animationDelay: '0.4s' }}>
                BAC Group kết hợp công nghệ hóa chất hiện đại và quy trình thi công chuẩn 5S 
                để bảo vệ công trình của bạn vĩnh cửu trước mọi tác động của thời tiết.
              </p>
              <div className="hero-btns animate-up" style={{ animationDelay: '0.6s' }}>
                <a href="#consultation" className="cta-button">Nhận tư vấn miễn phí</a>
                <Link to="/du-an" className="cta-button btn-secondary">Khám phá dự án</Link>
              </div>
              <div className="hero-stats animate-up" style={{ animationDelay: '0.8s' }}>
                <div className="stat-item">
                  <h3>20+</h3>
                  <p>Năm kinh nghiệm</p>
                </div>
                <div className="stat-item">
                  <h3>5000+</h3>
                  <p>Dự án thành công</p>
                </div>
                <div className="stat-item">
                  <h3>10 Năm</h3>
                  <p>Bảo hành dài hạn</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="section section-white" id="services">
          <div className="container">
            <div className="section-header">
              <span className="section-subtitle">Giải pháp chuyên sâu</span>
              <h2>Dịch Vụ Mũi Nhọn</h2>
              <p>Chúng tôi cung cấp các gói giải pháp toàn diện, xử lý triệt để mọi hạng mục thấm dột với độ bền vĩnh cửu.</p>
            </div>
            
            <div className="services-grid">
              {[
                {
                  title: "Chống thấm Sân thượng",
                  desc: "Xử lý triệt để thấm dột sàn mái, ban công bằng công nghệ màng tinh thể thẩm thấu và màng đàn hồi cao cấp.",
                  icon: <GlobalOutlined />,
                  img: "/images/landing/terrace.png",
                  slug: "chong-tham-san-thuong"
                },
                {
                  title: "Chống thấm Nhà vệ sinh",
                  desc: "Giải pháp không cần đục gạch, bảo vệ tối đa cấu trúc sàn và tường với độ bền trên 15 năm.",
                  icon: <CheckCircleFilled />,
                  img: "/images/landing/bathroom_basement.png",
                  slug: "chong-tham-nha-ve-sinh"
                },
                {
                  title: "Chống thấm Tường ngoài",
                  desc: "Xử lý nứt chân chim, phủ sơn co giãn chống tia UV, bảo vệ công trình trước nắng mưa khắc nghiệt.",
                  icon: <SafetyCertificateOutlined />,
                  img: "/images/landing/wall.png",
                  slug: "chong-tham-tuong-ngoai"
                },
                {
                  title: "Xử lý Tầng hầm & Bể",
                  desc: "Chống thấm ngược hiệu quả cho vách hầm, bể ngầm. Đảm bảo khô ráo tuyệt đối cho không gian của bạn.",
                  icon: <ExperimentOutlined />,
                  img: "/images/landing/basement.png",
                  slug: "chong-tham-tang-ham"
                },
                {
                  title: "Chống thấm Mái tôn",
                  desc: "Xử lý nứt khe tiếp giáp, chống rỉ sét và dột nát cho nhà xưởng, mái tôn gia đình chuyên nghiệp.",
                  icon: <PhoneOutlined />,
                  img: "/images/landing/roof.png",
                  slug: "chong-tham-mai-ton"
                },
                {
                  title: "Xử lý Nứt bê tông",
                  desc: "Bơm keo Epoxy xử lý nứt dầm, sàn, đảm bảo an toàn kết cấu và ngăn chặn nước xâm nhập.",
                  icon: <ArrowRightOutlined />,
                  img: "/images/landing/concrete.png",
                  slug: "xu-ly-nut-be-tong"
                }
              ].map((service, index) => (
                <div className="service-card" key={index}>
                  <div className="service-card-img">
                    <img src={service.img} alt={service.title} />
                    <div className="service-icon-badge">{service.icon}</div>
                  </div>
                  <div className="service-card-content">
                    <h3>{service.title}</h3>
                    <p>{service.desc}</p>
                    <Link to={`/article/${service.slug}`} className="service-link">
                      Xem chi tiết <ArrowRightOutlined />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="section section-soft">
          <div className="container">
            <div className="section-header">
              <span className="section-subtitle">Quy trình làm việc</span>
              <h2>Sự Chuyên Nghiệp Từ Những Bước Đầu</h2>
              <p>Chúng tôi tối ưu hóa quy trình để mang lại trải nghiệm tốt nhất và tiết kiệm thời gian cho quý khách.</p>
            </div>
            <div className="process-steps">
              {[
                { step: "01", title: "Khảo sát & Tư vấn", desc: "Chuyên viên kỹ thuật khảo sát thực tế và đưa ra phương án xử lý tối ưu miễn phí.", icon: <SearchOutlined /> },
                { step: "02", title: "Báo giá & Hợp đồng", desc: "Minh bạch về chi phí và cam kết tiến độ, chất lượng bằng văn bản pháp lý.", icon: <EditOutlined /> },
                { step: "03", title: "Thi công chuẩn 5S", desc: "Đội ngũ thợ lành nghề triển khai kỹ thuật cao, đảm bảo vệ sinh và an toàn.", icon: <TeamOutlined /> },
                { step: "04", title: "Bàn giao & Bảo hành", desc: "Nghiệm thu khắt khe và kích hoạt chế độ bảo hành dài hạn lên đến 10 năm.", icon: <CheckOutlined /> }
              ].map((p, i) => (
                <div className="process-card" key={i}>
                  <div className="process-ico">{p.icon}</div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>{p.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="section section-accent">
          <div className="container">
            <div className="section-header">
              <span className="section-subtitle">Tại sao chọn BAC?</span>
              <h2>Cam Kết Chất Lượng Vàng</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {[
                "Chi phí cạnh tranh nhất thị trường",
                "Giải pháp kỹ thuật đạt chuẩn quốc tế",
                "Sử dụng vật liệu cao cấp, chính hãng",
                "Cam kết hoàn tiền 100% nếu thấm lại",
                "Đội ngũ kỹ thuật tinh nhuệ, tận tâm",
                "Phương pháp thi công hiện đại, sạch sẽ",
                "Chính sách bảo hành dài hạn, chu đáo"
              ].map((reason, i) => (
                <div key={i} style={{ background: 'white', padding: '1.5rem 2rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: 'var(--shadow-sm)' }}>
                  <CheckCircleFilled style={{ color: 'var(--accent)', fontSize: '1.5rem' }} />
                  <span style={{ fontWeight: '600', color: 'var(--primary)' }}>{reason}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="section section-dark" id="projects">
          <div className="container">
            <div className="section-header">
              <span className="section-subtitle">Thực tế thi công</span>
              <h2 style={{ color: 'white' }}>Dự Án Tiêu Biểu</h2>
            </div>
            <div className="projects-grid">
              {[
                { title: "Chống thấm VinHomes Ocean Park", cat: "Sân thượng", img: "/images/landing/terrace.png" },
                { title: "Xử lý tầng hầm Lotte Center", cat: "Tầng hầm", img: "/images/landing/basement.png" },
                { title: "Chống thấm bể bơi Keangnam", cat: "Bể bơi", img: "/images/landing/bathroom_basement.png" }
              ].map((p, i) => (
                <div className="project-card" key={i}>
                  <img src={p.img} alt={p.title} />
                  <div className="project-overlay">
                    <span className="project-cat">{p.cat}</span>
                    <h3>{p.title}</h3>
                    <div>
                        <Link to="/du-an" className="cta-button" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>Xem chi tiết</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Consultation Form Section */}
        <section className="consultation-section" id="consultation">
          <div className="container">
            <div className="consultation-container">
              <div className="consultation-info">
                <h2>Hãy để BAC bảo vệ tổ ấm của bạn!</h2>
                <p style={{ fontSize: '1.2rem', opacity: 0.8, marginBottom: '3rem' }}>Liên hệ ngay để được khảo sát và tư vấn giải pháp chống thấm miễn phí tại công trình.</p>
                <div className="contact-info-list">
                  <div className="contact-item">
                    <div className="contact-icon"><PhoneOutlined /></div>
                    <div>
                      <p style={{ margin: 0, opacity: 0.6 }}>Hotline 24/7</p>
                      <strong style={{ fontSize: '1.5rem' }}>0362555167</strong>
                    </div>
                  </div>
                  <div className="contact-item">
                    <div className="contact-icon"><CustomerServiceOutlined /></div>
                    <div>
                      <p style={{ margin: 0, opacity: 0.6 }}>Email hỗ trợ</p>
                      <strong style={{ fontSize: '1.5rem' }}>contact@bacgroup.vn</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="consultation-form-wrapper">
                {formSubmitted ? (
                  <div className="form-success" style={{ textAlign: 'center' }}>
                    <CheckCircleFilled style={{ fontSize: '5rem', color: 'var(--accent)', marginBottom: '2rem' }} />
                    <h3>Gửi yêu cầu thành công!</h3>
                    <p>Chúng tôi sẽ liên hệ lại với bạn trong vòng 30 phút.</p>
                    <button onClick={() => setFormSubmitted(false)} className="cta-button" style={{ marginTop: '2rem' }}>Gửi yêu cầu mới</button>
                  </div>
                ) : (
                  <form className="consultation-form" onSubmit={handleSubmit}>
                    <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '2rem' }}>Đăng ký tư vấn miễn phí</h3>
                    <div className="form-group">
                      <label>Họ và tên</label>
                      <input type="text" placeholder="Nhập họ tên của bạn" required />
                    </div>
                    <div className="form-group">
                      <label>Số điện thoại</label>
                      <input type="tel" placeholder="Nhập số điện thoại" required />
                    </div>
                    <div className="form-group">
                      <label>Hạng mục cần tư vấn</label>
                      <input type="text" placeholder="Ví dụ: Chống thấm sân thượng" />
                    </div>
                    <div className="form-group">
                      <label>Ghi chú thêm</label>
                      <textarea rows={4} placeholder="Mô tả tình trạng thấm dột (nếu có)"></textarea>
                    </div>
                    <button type="submit" className="cta-button" style={{ width: '100%', padding: '1.2rem', justifyContent: 'center' }}>Gửi yêu cầu ngay</button>
                    <p className="form-note" style={{ textAlign: 'center', fontSize: '0.8rem', marginTop: '1.5rem', color: 'var(--text-muted)' }}>Cam kết bảo mật thông tin khách hàng tuyệt đối.</p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
};

export default LandingPage;
