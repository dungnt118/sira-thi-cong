import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';

const PublicHeader: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <header className={`landing-header ${isScrolled || pathname !== '/' ? 'scrolled' : ''}`}>
      <div className="container header-container">
        <div className="logo">
          <Link to="/">
            <img src="/logo.png" alt="BAC Group Logo" />
            <span className="brand-text">BAC Group</span>
          </Link>
        </div>
        <nav className="nav-menu">
          <Link to="/gioi-thieu" className={`nav-link ${isActive('/gioi-thieu') ? 'active' : ''}`}>Giới thiệu</Link>
          <Link to="/san-pham" className={`nav-link ${isActive('/san-pham') ? 'active' : ''}`}>Sản phẩm</Link>
          <Link to="/du-an" className={`nav-link ${isActive('/du-an') ? 'active' : ''}`}>Dự án</Link>
          <Link to="/chinh-sach" className={`nav-link ${isActive('/chinh-sach') ? 'active' : ''}`}>Chính sách</Link>
          <Link to="/portal" className="nav-link portal-link">Portal</Link>
        </nav>
      </div>
    </header>
  );
};

export default PublicHeader;
