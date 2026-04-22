import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Input, 
  Select, 
  Pagination, 
  Breadcrumb, 
  Empty,
  Tag,
  Button
} from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined, 
  ArrowRightOutlined
} from '@ant-design/icons';
import './LandingPage.css';
import PublicHeader from './components/PublicHeader';
import PublicFooter from './components/PublicFooter';
import FloatingCTA from './components/FloatingCTA';

const { Search } = Input;
const { Option } = Select;

interface Project {
  id: number;
  title: string;
  category: string;
  location: string;
  description: string;
  image: string;
  isHot?: boolean;
}

const ProjectListing: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [category, setCategory] = useState('Tất cả');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Dự án Tiêu biểu | BAC Group";
    const meta = document.querySelector('meta[name="description"]') || document.createElement('meta');
    meta.setAttribute('name', 'description');
    meta.setAttribute('content', 'Khám phá các dự án thi công chống thấm tiêu biểu của BAC Group trên toàn quốc. Đảm bảo chất lượng, tiến độ và sự hài lòng của khách hàng.');
    if (!document.querySelector('meta[name="description"]')) {
      document.head.appendChild(meta);
    }
  }, []);

  // Mock data for projects
  const allProjects: Project[] = useMemo(() => {
    const categories = ['Sân thượng', 'Tầng hầm', 'Bể bơi', 'Nhà vệ sinh', 'Mái tôn'];
    const locations = ['Hà Nội', 'Hải Phòng', 'Bắc Ninh', 'Quảng Ninh', 'TP.HCM'];
    const items: Project[] = [];

    for (let i = 1; i <= 20; i++) {
      const cat = categories[i % categories.length];
      const loc = locations[i % locations.length];
      const imgNum = (i % 3) + 1;
      items.push({
        id: i,
        title: `Chống thấm ${cat} tại ${loc} - Công trình ${i < 10 ? '0' : ''}${i}`,
        category: cat,
        location: loc,
        description: `Dự án xử lý triệt để thấm dột ${cat.toLowerCase()} sử dụng công nghệ màng tinh thể và màng đàn hồi cao cấp của BAC Group.`,
        image: `/images/landing/${i % 2 === 0 ? 'terrace' : 'basement'}.png`,
        isHot: i % 5 === 0
      });
    }
    return items;
  }, []);

  const filteredProjects = useMemo(() => {
    return allProjects.filter(p => {
      const matchSearch = p.title.toLowerCase().includes(searchText.toLowerCase()) || 
                          p.location.toLowerCase().includes(searchText.toLowerCase());
      const matchCat = category === 'Tất cả' || p.category === category;
      return matchSearch && matchCat;
    });
  }, [allProjects, searchText, category]);

  const pagedProjects = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProjects.slice(start, start + pageSize);
  }, [filteredProjects, currentPage]);

  return (
    <div className="landing-page">
      <PublicHeader />
      <FloatingCTA />

      <main style={{ paddingTop: '100px', backgroundColor: 'var(--bg-soft)', minHeight: '100vh' }}>
        <div className="container" style={{ paddingBottom: '80px' }}>
          <div style={{ margin: '2rem 0' }}>
            <Breadcrumb>
              <Breadcrumb.Item><Link to="/">Trang chủ</Link></Breadcrumb.Item>
              <Breadcrumb.Item>Dự án</Breadcrumb.Item>
            </Breadcrumb>
          </div>

          <div className="section-header" style={{ textAlign: 'left', margin: '0 0 3rem' }}>
            <span className="section-subtitle">Thực tế thi công</span>
            <h2>Dự Án Tiêu Biểu Toàn Quốc</h2>
            <p>Hàng ngàn công trình đã được BAC Group bảo vệ thành công khỏi sự tàn phá của nước và độ ẩm.</p>
          </div>

          {/* Filters Bar */}
          <div style={{ 
            background: 'white', 
            padding: '1.5rem', 
            borderRadius: '16px', 
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.5rem',
            alignItems: 'center',
            marginBottom: '3rem'
          }}>
            <div style={{ flex: '1', minWidth: '300px' }}>
              <Search 
                placeholder="Tìm kiếm dự án, địa điểm..." 
                onSearch={val => { setSearchText(val); setCurrentPage(1); }}
                onChange={e => setSearchText(e.target.value)}
                enterButton={<SearchOutlined />}
                size="large"
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontWeight: '600' }}><FilterOutlined /> Lọc hạng mục:</span>
              <Select 
                defaultValue="Tất cả" 
                style={{ width: 180 }} 
                onChange={val => { setCategory(val); setCurrentPage(1); }}
                size="large"
              >
                <Option value="Tất cả">Tất cả hạng mục</Option>
                <Option value="Sân thượng">Sân thượng</Option>
                <Option value="Tầng hầm">Tầng hầm</Option>
                <Option value="Bể bơi">Bể bơi</Option>
                <Option value="Nhà vệ sinh">Nhà vệ sinh</Option>
              </Select>
            </div>
          </div>

          {/* Projects Grid */}
          {pagedProjects.length > 0 ? (
            <>
              <div className="projects-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
                {pagedProjects.map((p) => (
                  <div className="project-card" key={p.id} style={{ height: '450px' }}>
                    <img src={p.image} alt={p.title} />
                    {p.isHot && <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 3 }}><Tag color="gold">Dự án lớn</Tag></div>}
                    <div className="project-overlay" style={{ background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95), transparent)' }}>
                      <span className="project-cat">{p.category}</span>
                      <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{p.title}</h3>
                      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                        📍 {p.location} • {p.description}
                      </p>
                      <div>
                          <Link to="/article/chong-tham-san-thuong">
                              <Button type="primary" size="large" icon={<ArrowRightOutlined />} style={{ borderRadius: '12px' }}>Xem chi tiết</Button>
                          </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div style={{ marginTop: '4rem', display: 'flex', justifyContent: 'center' }}>
                <Pagination 
                  current={currentPage} 
                  total={filteredProjects.length} 
                  pageSize={pageSize} 
                  onChange={page => { setCurrentPage(page); window.scrollTo(0, 0); }}
                  showSizeChanger={false}
                />
              </div>
            </>
          ) : (
            <div style={{ padding: '5rem 0', background: 'white', borderRadius: '24px', textAlign: 'center' }}>
              <Empty description="Không tìm thấy dự án phù hợp" />
              <Button onClick={() => { setSearchText(''); setCategory('Tất cả'); }} style={{ marginTop: '1rem' }}>Xóa bộ lọc</Button>
            </div>
          )}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};

export default ProjectListing;
