import React, { useEffect } from 'react';
import { 
  TeamOutlined, 
  SafetyCertificateOutlined, 
  GlobalOutlined, 
  RocketOutlined,
  HeartOutlined,
  CheckCircleOutlined 
} from '@ant-design/icons';
import './LandingPage.css';
import PublicHeader from './components/PublicHeader';
import PublicFooter from './components/PublicFooter';
import FloatingCTA from './components/FloatingCTA';

const AboutPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Về chúng tôi | BAC Group";
  }, []);

  return (
    <div className="landing-page">
      <PublicHeader />
      <FloatingCTA />

      <main>
        {/* Hero Section */}
        <section className="about-hero" style={{ 
          padding: '160px 0 100px', 
          background: 'linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.8)), url("/images/landing/hero.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          textAlign: 'center'
        }}>
          <div className="container">
            <span className="section-subtitle" style={{ color: 'var(--accent)' }}>Về BAC Group</span>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.1 }}>
              Kiến Tạo Sự <span className="text-gradient">Bền Vững</span><br />Cho Mọi Công Trình
            </h1>
            <p style={{ fontSize: '1.25rem', opacity: 0.9, maxWidth: '800px', margin: '0 auto', lineHeight: 1.6 }}>
              Chúng tôi không chỉ cung cấp dịch vụ chống thấm, chúng tôi mang đến sự an tâm tuyệt đối và bảo vệ giá trị vĩnh cửu cho mái ấm của bạn.
            </p>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="section section-white">
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
              <div>
                <img 
                  src="/images/landing/bathroom_basement.png" 
                  alt="BAC Group Office" 
                  style={{ width: '100%', borderRadius: '32px', boxShadow: 'var(--shadow-premium)' }} 
                />
              </div>
              <div>
                <div className="section-header" style={{ textAlign: 'left', marginBottom: '2rem' }}>
                  <span className="section-subtitle">Tầm nhìn & Sứ mệnh</span>
                  <h2>Dẫn đầu công nghệ <br />Chống thấm tại Việt Nam</h2>
                </div>
                <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--text-muted)', marginBottom: '2rem' }}>
                  Được thành lập với khát khao giải quyết triệt để vấn đề thấm dột - "căn bệnh" nan giải của các công trình tại Việt Nam. BAC Group đã không ngừng nghiên cứu và ứng dụng những công nghệ tiên tiến nhất thế giới.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  <div className="vision-card">
                    <RocketOutlined style={{ fontSize: '2.5rem', color: 'var(--primary-accent)', marginBottom: '1rem' }} />
                    <h4 style={{ fontWeight: 700 }}>Tầm nhìn</h4>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>Trở thành hệ sinh thái dịch vụ xây dựng & bảo trì số 1 dựa trên nền tảng công nghệ.</p>
                  </div>
                  <div className="vision-card">
                    <HeartOutlined style={{ fontSize: '2.5rem', color: 'var(--primary-accent)', marginBottom: '1rem' }} />
                    <h4 style={{ fontWeight: 700 }}>Sứ mệnh</h4>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>Bảo vệ tài sản và nâng tầm chất lượng cuộc sống cho hàng triệu gia đình Việt.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="section" style={{ background: 'var(--bg-soft)' }}>
          <div className="container">
            <div className="section-header">
              <span className="section-subtitle">Giá trị cốt lõi</span>
              <h2>Nền Tảng Tạo Nên Uy Tín</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
              {[
                { icon: <CheckCircleOutlined />, title: 'Chất lượng là gốc', desc: 'Mọi giải pháp đều được kiểm chứng kỹ thuật nghiêm ngặt trước khi thi công.' },
                { icon: <TeamOutlined />, title: 'Khách hàng là trung tâm', desc: 'Lắng nghe và thấu hiểu để đưa ra giải pháp tối ưu nhất cho từng khách hàng.' },
                { icon: <SafetyCertificateOutlined />, title: 'Minh bạch & Trách nhiệm', desc: 'Cam kết bằng văn bản pháp lý, minh bạch trong vật liệu và đơn giá.' },
                { icon: <GlobalOutlined />, title: 'Đổi mới không ngừng', desc: 'Luôn cập nhật công nghệ và vật liệu mới nhất từ các cường quốc xây dựng.' }
              ].map((item, idx) => (
                <div key={idx} className="core-value-card" style={{ 
                  background: 'white', 
                  padding: '3rem 2rem', 
                  borderRadius: '24px', 
                  textAlign: 'center',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>{item.icon}</div>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>{item.title}</h4>
                  <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="section section-dark" style={{ background: 'var(--primary)', color: 'white' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--accent)' }}>15+</div>
                <div style={{ fontSize: '1.1rem', opacity: 0.8 }}>Năm kinh nghiệm</div>
              </div>
              <div>
                <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--accent)' }}>5000+</div>
                <div style={{ fontSize: '1.1rem', opacity: 0.8 }}>Dự án hoàn thành</div>
              </div>
              <div>
                <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--accent)' }}>100%</div>
                <div style={{ fontSize: '1.1rem', opacity: 0.8 }}>Khách hàng hài lòng</div>
              </div>
              <div>
                <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--accent)' }}>24/7</div>
                <div style={{ fontSize: '1.1rem', opacity: 0.8 }}>Hỗ trợ kỹ thuật</div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="section">
          <div className="container">
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
              <div className="section-header">
                <span className="section-subtitle">Tại sao chọn BAC?</span>
                <h2>Sự Khác Biệt Nằm Ở <br />Sự Tận Tâm & Công Nghệ</h2>
              </div>
              <div className="modern-list">
                {[
                  'Đội ngũ kỹ sư giàu kinh nghiệm, đào tạo chuyên sâu.',
                  'Vật liệu nhập khẩu chính hãng, thân thiện với môi trường.',
                  'Ứng dụng phần mềm Portal giúp khách hàng theo dõi tiến độ 24/7.',
                  'Chính sách bảo hành vàng lên tới 10 năm.',
                  'Báo cáo kỹ thuật chi tiết bằng hình ảnh và video thực tế.'
                ].map((text, i) => (
                  <div key={i} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1.5rem', 
                    padding: '1.5rem', 
                    background: 'white', 
                    borderRadius: '16px', 
                    marginBottom: '1rem',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    <CheckCircleOutlined style={{ color: 'var(--primary-accent)', fontSize: '1.5rem' }} />
                    <span style={{ fontSize: '1.1rem', fontWeight: 500, color: '#334155' }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
};

export default AboutPage;
