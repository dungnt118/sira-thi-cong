import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MenuOutlined, CloseOutlined } from '@ant-design/icons';

const PublicHeader: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={`landing-header ${isScrolled || pathname !== '/' || isMobileMenuOpen ? 'scrolled' : ''}`}>
      <div className="container header-container">
        <div className="logo">
          <Link to="/">
            <img src="/logo.png" alt="BAC Group Logo" />
            <span className="brand-text">BAC Group</span>
          </Link>
        </div>
        
        <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
        </div>

        <nav className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
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
