import React, { useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import './LandingPage.css';
import { ArrowLeftOutlined, PhoneOutlined, SafetyCertificateOutlined } from '@ant-design/icons';

const ArticleDetail: React.FC = () => {
    const { slug: paramSlug } = useParams<{ slug: string }>();
    const location = useLocation();
    
    // Fallback to path if slug param is missing (for /gioi-thieu, /san-pham)
    const slug = paramSlug || location.pathname.split('/').filter(Boolean).pop();

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = `Chi tiết: ${slug?.replace(/-/g, ' ')} | BAC Group`;
    }, [slug]);

    const getArticleContent = (slug: string | undefined) => {
        switch(slug) {
            case 'chong-tham-san-thuong':
                return {
                    title: "Giải pháp Chống thấm Sân thượng Chuyên sâu",
                    image: "/images/landing/terrace.png",
                    content: "Sân thượng là khu vực tiếp xúc trực tiếp với nắng mưa, chịu sự co giãn nhiệt lớn nhất trong công trình. Tại BAC, chúng tôi sử dụng hệ thống màng polyme đa lớp kết hợp tinh thể thẩm thấu cao cấp để tạo ra lớp màng bảo vệ vĩnh cửu."
                };
            case 'chong-tham-nha-ve-sinh':
                return {
                    title: "Chống thấm Nhà vệ sinh - Không đục gạch",
                    image: "/images/landing/bathroom_basement.png",
                    content: "Khu vực ẩm ướt thường xuyên như nhà vệ sinh cần sự tinh tế trong xử lý cổ ống và chân tường. Công nghệ mới của BAC cho phép chống thấm hiệu quả mà không cần tháo dỡ gạch, tiết kiệm 50% chi phí và thời gian."
                };
            default:
                return {
                    title: "Giải pháp Chống thấm Toàn diện",
                    image: "/images/landing/hero.png",
                    content: "BAC Group cung cấp các giải pháp kỹ thuật chuyên sâu cho mọi hạng mục công trình. Với hơn 15 năm kinh nghiệm, chúng tôi tự tin xử lý mọi sự cố thấm dột phức tạp nhất."
                };
        }
    };

    const article = getArticleContent(slug);

    return (
        <div className="landing-page">
            <header className="landing-header">
                <div className="header-container">
                    <div className="logo">
                        <Link to="/"><img src="/logo.png" alt="BAC Group Logo" /></Link>
                    </div>
                    <nav className="nav-menu">
                        <Link to="/" className="nav-link">Trang chủ</Link>
                        <Link to="/san-pham" className="nav-link">Sản phẩm</Link>
                        <Link to="/gioi-thieu" className="nav-link">Giới thiệu</Link>
                        <Link to="/du-an" className="nav-link">Dự án</Link>
                        <Link to="/chinh-sach" className="nav-link">Chính sách</Link>
                    </nav>
                    <a href="tel:0362555167" className="cta-button">Hotline: 0362555167</a>
                </div>
            </header>

            <main className="section" style={{ background: 'var(--bg-soft)', minHeight: '100vh', paddingTop: 'calc(var(--header-height) + 4rem)' }}>
                <div className="container" style={{ maxWidth: '900px' }}>
                    <article style={{ background: 'white', padding: '4rem', borderRadius: 'var(--border-radius-xl)', boxShadow: 'var(--shadow-premium)' }}>
                        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '2rem', fontWeight: '600' }}>
                            <ArrowLeftOutlined /> Quay lại trang chủ
                        </Link>
                        
                        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '2rem', color: 'var(--primary)', lineHeight: '1.2' }}>
                            {article.title}
                        </h1>
                        
                        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '3rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            <span>📅 21/04/2026</span>
                            <span>👤 Ban biên tập BAC</span>
                            <span>📂 Dự án tiêu biểu</span>
                        </div>

                        <div style={{ borderRadius: '24px', overflow: 'hidden', marginBottom: '3rem', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                            <img src={article.image} alt={article.title} style={{ width: '100%', display: 'block' }} />
                        </div>

                        <div className="article-content" style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#334155' }}>
                            <p style={{ fontSize: '1.4rem', fontWeight: '500', color: 'var(--primary)', marginBottom: '2rem' }}>{article.content}</p>
                            
                            <h2 style={{ fontSize: '2rem', fontWeight: '700', marginTop: '3rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>Quy trình xử lý tiêu chuẩn</h2>
                            <p>Chúng tôi áp dụng quy trình 5 bước nghiêm ngặt để đảm bảo hiệu quả tối đa cho hạng mục này:</p>
                            <ul style={{ paddingLeft: '1.5rem', marginTop: '1.5rem' }}>
                                <li style={{ marginBottom: '1rem' }}><strong>Bước 1:</strong> Mài sàn vệ sinh và trám vá các vết nứt bằng vữa chuyên dụng.</li>
                                <li style={{ marginBottom: '1rem' }}><strong>Bước 2:</strong> Gia cố các điểm xung yếu như cổ ống, nách tường.</li>
                                <li style={{ marginBottom: '1rem' }}><strong>Bước 3:</strong> Phủ lớp lót tăng cường liên kết (Primer).</li>
                                <li style={{ marginBottom: '1rem' }}><strong>Bước 4:</strong> Thi công màng chống thấm đa lớp cao cấp.</li>
                                <li style={{ marginBottom: '1rem' }}><strong>Bước 5:</strong> Ngâm thử nước 48h và bàn giao.</li>
                            </ul>

                            <div style={{ background: 'var(--bg-soft)', padding: '2.5rem', borderRadius: '24px', marginTop: '4rem', borderLeft: '6px solid var(--primary-accent)' }}>
                                <h4 style={{ color: 'var(--primary-accent)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <SafetyCertificateOutlined /> Bảo hành vàng tại BAC Group
                                </h4>
                                <p style={{ margin: 0 }}>Mọi công trình do BAC thi công đều được bảo hành từ 5-10 năm. Chúng tôi cam kết có mặt xử lý trong vòng 24h nếu phát sinh bất kỳ vấn đề gì.</p>
                            </div>
                        </div>

                        <div style={{ marginTop: '5rem', display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                            <a href="tel:0362555167" className="cta-button"><PhoneOutlined /> Liên hệ ngay: 0362555167</a>
                            <Link to="/" className="cta-button btn-secondary">Quay lại trang chủ</Link>
                        </div>
                    </article>
                </div>
            </main>

            <footer className="landing-footer">
                <div className="footer-content">
                    <div>
                        <img src="/logo.png" alt="BAC Group" className="footer-logo" />
                        <p style={{ opacity: 0.6, maxWidth: '350px' }}>Kiến tạo sự vững bền cho mọi công trình.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default ArticleDetail;
