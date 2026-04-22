import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Input, 
  Select, 
  Pagination, 
  Breadcrumb, 
  Empty,
  Tag,
  Button,
  Typography
} from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined, 
  ShoppingOutlined
} from '@ant-design/icons';
import './LandingPage.css';
import PublicHeader from './components/PublicHeader';
import PublicFooter from './components/PublicFooter';
import FloatingCTA from './components/FloatingCTA';

const { Search } = Input;
const { Option } = Select;

interface Product {
  id: number;
  name: string;
  category: string;
  brand: string;
  description: string;
  price: string;
  image: string;
  isHot?: boolean;
}

const ProductListing: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [category, setCategory] = useState('Tất cả');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Sản phẩm Chống thấm | BAC Group";
    const meta = document.querySelector('meta[name="description"]') || document.createElement('meta');
    meta.setAttribute('name', 'description');
    meta.setAttribute('content', 'Danh mục vật liệu chống thấm, hóa chất xây dựng chính hãng từ Sika, Sira, Kova... Giải pháp bảo vệ công trình toàn diện từ BAC Group.');
    if (!document.querySelector('meta[name="description"]')) {
      document.head.appendChild(meta);
    }
  }, []);

  // Mock data for 32 products
  const allProducts: Product[] = useMemo(() => {
    const brands = ['Sira', 'Sika', 'Kova', 'Bestmix', 'CT-11A'];
    const categories = ['Sơn chống thấm', 'Màng chống thấm', 'Vữa chuyên dụng', 'Hóa chất xây dựng'];
    const items: Product[] = [];

    for (let i = 1; i <= 32; i++) {
      const brand = brands[i % brands.length];
      const cat = categories[i % categories.length];
      const imgNum = (i % 3) + 1;
      items.push({
        id: i,
        name: `${brand} Waterproof ${i < 10 ? '0' : ''}${i} - ${cat}`,
        category: cat,
        brand: brand,
        description: `Giải pháp chống thấm cao cấp cho các hạng mục ${cat.toLowerCase()}, đảm bảo độ bền trên 15 năm.`,
        price: 'Liên hệ',
        image: `/images/products/prod${imgNum}.png`,
        isHot: i % 7 === 0
      });
    }
    return items;
  }, []);

  const filteredProducts = useMemo(() => {
    return allProducts.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchText.toLowerCase()) || 
                          p.brand.toLowerCase().includes(searchText.toLowerCase());
      const matchCat = category === 'Tất cả' || p.brand === category || p.category === category;
      return matchSearch && matchCat;
    });
  }, [allProducts, searchText, category]);

  const pagedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage]);

  return (
    <div className="landing-page">
      <PublicHeader />
      <FloatingCTA />

      <main style={{ paddingTop: '100px', backgroundColor: 'var(--bg-soft)', minHeight: '100vh' }}>
        <div className="container" style={{ paddingBottom: '80px' }}>
          <div style={{ margin: '2rem 0' }}>
            <Breadcrumb>
              <Breadcrumb.Item><Link to="/">Trang chủ</Link></Breadcrumb.Item>
              <Breadcrumb.Item>Sản phẩm</Breadcrumb.Item>
            </Breadcrumb>
          </div>

          <div className="section-header" style={{ textAlign: 'left', margin: '0 0 3rem' }}>
            <span className="section-subtitle">Danh mục vật liệu</span>
            <h2>Sản Phẩm Chống Thấm Chuyên Dụng</h2>
            <p>BAC Group cung cấp hệ thống vật liệu chống thấm nhập khẩu và nội địa chính hãng, đạt tiêu chuẩn quốc tế.</p>
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
                placeholder="Tìm kiếm sản phẩm, thương hiệu..." 
                onSearch={val => { setSearchText(val); setCurrentPage(1); }}
                onChange={e => setSearchText(e.target.value)}
                enterButton={<SearchOutlined />}
                size="large"
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontWeight: '600' }}><FilterOutlined /> Lọc nhanh:</span>
              <Select 
                defaultValue="Tất cả" 
                style={{ width: 180 }} 
                onChange={val => { setCategory(val); setCurrentPage(1); }}
                size="large"
              >
                <Option value="Tất cả">Tất cả thương hiệu</Option>
                <Option value="Sira">Sira</Option>
                <Option value="Sika">Sika</Option>
                <Option value="Kova">Kova</Option>
                <Option value="Bestmix">Bestmix</Option>
              </Select>
            </div>
          </div>

          {/* Products Grid with Sections */}
          {pagedProducts.length > 0 ? (
            <>
              {Object.entries(
                pagedProducts.reduce((groups: Record<string, Product[]>, p) => {
                  if (!groups[p.category]) groups[p.category] = [];
                  groups[p.category].push(p);
                  return groups;
                }, {})
              ).map(([catName, products]) => (
                <div key={catName} className="product-section">
                  <div className="product-section-header">
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1.5rem' }}>{catName}</h3>
                    <div className="line"></div>
                  </div>
                  
                  <div className="services-grid">
                    {products.map((p) => (
                      <div className="service-card" key={p.id} style={{ height: 'auto' }}>
                        <div className="service-card-img" style={{ height: '200px' }}>
                          <img src={p.image} alt={p.name} />
                          {p.isHot && <div style={{ position: 'absolute', top: '15px', left: '15px', zIndex: 3 }}><Tag color="red">Bán chạy</Tag></div>}
                        </div>
                        <div className="service-card-content" style={{ padding: '2rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: '700', textTransform: 'uppercase' }}>{p.brand}</span>
                          </div>
                          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', minHeight: '3rem' }}>{p.name}</h3>
                          <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {p.description}
                          </p>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
                            <span style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '1.1rem' }}>{p.price}</span>
                            <Link to="/article/chong-tham-san-thuong">
                                <Button type="primary" icon={<ShoppingOutlined />} style={{ borderRadius: '8px' }}>Chi tiết</Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              <div style={{ marginTop: '4rem', display: 'flex', justifyContent: 'center' }}>
                <Pagination 
                  current={currentPage} 
                  total={filteredProducts.length} 
                  pageSize={pageSize} 
                  onChange={page => { setCurrentPage(page); window.scrollTo(0, 0); }}
                  showSizeChanger={false}
                />
              </div>
            </>
          ) : (
            <div style={{ padding: '5rem 0', background: 'white', borderRadius: '24px', textAlign: 'center' }}>
              <Empty description="Không tìm thấy sản phẩm phù hợp" />
              <Button onClick={() => { setSearchText(''); setCategory('Tất cả'); }} style={{ marginTop: '1rem' }}>Xóa bộ lọc</Button>
            </div>
          )}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};

export default ProductListing;
