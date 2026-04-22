import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Card, 
  Breadcrumb, 
  Typography, 
  Collapse,
  Timeline
} from 'antd';
import { 
  SafetyCertificateOutlined,
  FileProtectOutlined,
  AuditOutlined,
  HistoryOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import './LandingPage.css';
import PublicHeader from './components/PublicHeader';
import PublicFooter from './components/PublicFooter';
import FloatingCTA from './components/FloatingCTA';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

const PolicyPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Chính sách Bảo hành | BAC Group";
  }, []);

  const faqs = [
    {
      q: "Thời gian bảo hành cho công trình chống thấm là bao lâu?",
      a: "Tùy thuộc vào gói giải pháp và hạng mục thi công, BAC Group áp dụng thời gian bảo hành từ 5 đến 10 năm. Trong suốt thời gian này, mọi sự cố phát sinh do lỗi kỹ thuật thi công sẽ được xử lý hoàn toàn miễn phí."
    },
    {
      q: "Quy trình yêu cầu bảo hành như thế nào?",
      a: "Khi phát sinh sự cố, quý khách chỉ cần gọi hotline 0362 555 167. Trong vòng 24h, chuyên viên kỹ thuật của BAC sẽ có mặt tại công trình để khảo sát và đưa ra phương án xử lý."
    },
    {
      q: "BAC Group có bảo hành cho các hạng mục đã thi công bởi đơn vị khác không?",
      a: "Chúng tôi có dịch vụ 'Sửa chữa bảo trì' cho các công trình cũ. Tuy nhiên, thời gian bảo hành sẽ được đánh giá cụ thể sau khi khảo sát thực tế tình trạng công trình."
    }
  ];

  return (
    <div className="landing-page">
      <PublicHeader />
      <FloatingCTA />

      <main style={{ paddingTop: '100px', backgroundColor: 'var(--bg-soft)', minHeight: '100vh' }}>
        <div className="container" style={{ paddingBottom: '80px' }}>
          <div style={{ margin: '2rem 0' }}>
            <Breadcrumb>
              <Breadcrumb.Item><Link to="/">Trang chủ</Link></Breadcrumb.Item>
              <Breadcrumb.Item>Chính sách bảo hành</Breadcrumb.Item>
            </Breadcrumb>
          </div>

          <div className="section-header" style={{ textAlign: 'left', margin: '0 0 3rem' }}>
            <span className="section-subtitle">Quyền lợi khách hàng</span>
            <h2>Chính Sách Bảo Hành & Cam Kết</h2>
            <p>Chúng tôi hiểu rằng sự tin tưởng của khách hàng là tài sản quý giá nhất. Vì vậy, mọi dự án đều được đảm bảo bằng những cam kết văn bản pháp lý mạnh mẽ.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '3rem' }}>
            {/* Policy Content */}
            <div className="policy-content-column">
              <Card style={{ borderRadius: '24px', border: 'none', boxShadow: 'var(--shadow-sm)', marginBottom: '2rem' }}>
                <Title level={3} style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--primary)' }}>
                  <FileProtectOutlined style={{ color: 'var(--accent)' }} /> 1. Cam Kết Vàng 100%
                </Title>
                <Paragraph style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                  BAC Group cam kết xử lý triệt để 100% các vấn đề thấm dột ngay trong lần thi công đầu tiên. Nếu hạng mục thi công bị thấm lại trong thời gian bảo hành, chúng tôi cam kết hoàn tiền 100% chi phí thi công cho quý khách hàng.
                </Paragraph>
                
                <Divider />
                
                <Title level={3} style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--primary)' }}>
                  <AuditOutlined style={{ color: 'var(--accent)' }} /> 2. Quy Trình Bảo Hành 24h
                </Title>
                <Timeline 
                  mode="left"
                  items={[
                    { label: 'Bước 1', children: 'Tiếp nhận yêu cầu bảo hành qua hotline 0362 555 167 hoặc ứng dụng Portal.', dot: <HistoryOutlined style={{ fontSize: '16px' }} /> },
                    { label: 'Bước 2', children: 'Chuyên viên kỹ thuật khảo sát tại công trình trong vòng 24h kể từ khi tiếp nhận.', dot: <HistoryOutlined style={{ fontSize: '16px' }} /> },
                    { label: 'Bước 3', children: 'Lập phương án xử lý và thống nhất thời gian thi công khắc phục.', dot: <HistoryOutlined style={{ fontSize: '16px' }} /> },
                    { label: 'Bước 4', children: 'Tiến hành thi công bảo hành và bàn giao lại cho khách hàng.', dot: <HistoryOutlined style={{ fontSize: '16px' }} /> },
                  ]}
                />
              </Card>

              <div style={{ marginBottom: '3rem' }}>
                <Title level={3} style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <QuestionCircleOutlined style={{ color: 'var(--accent)' }} /> Câu hỏi thường gặp (FAQ)
                </Title>
                <Collapse 
                  accordion 
                  ghost 
                  expandIconPosition="end"
                  style={{ background: 'white', borderRadius: '16px', overflow: 'hidden' }}
                >
                  {faqs.map((faq, index) => (
                    <Panel header={<Text strong style={{ fontSize: '1.05rem' }}>{faq.q}</Text>} key={index} style={{ borderBottom: '1px solid #f1f5f9', padding: '10px 0' }}>
                      <Paragraph style={{ color: 'var(--text-muted)', marginBottom: 0 }}>{faq.a}</Paragraph>
                    </Panel>
                  ))}
                </Collapse>
              </div>
            </div>

            {/* Side Highlights */}
            <div className="policy-highlights-column">
              <Card 
                style={{ 
                  borderRadius: '24px', 
                  border: 'none', 
                  background: 'linear-gradient(135deg, var(--primary) 0%, #1e293b 100%)',
                  color: 'white',
                  marginBottom: '2rem'
                }}
              >
                <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                  <SafetyCertificateOutlined style={{ fontSize: '4rem', color: 'var(--accent)', marginBottom: '1.5rem' }} />
                  <Title level={2} style={{ color: 'white', marginBottom: '0.5rem' }}>10 NĂM</Title>
                  <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', fontWeight: '500' }}>BẢO HÀNH CÔNG TRÌNH</Text>
                  <Divider style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                  <Paragraph style={{ color: 'rgba(255,255,255,0.8)' }}>
                    Chúng tôi tự tin vào chất lượng kỹ thuật và vật liệu sử dụng, mang lại sự an tâm tuyệt đối cho khách hàng.
                  </Paragraph>
                </div>
              </Card>

              <Card style={{ borderRadius: '24px', border: 'none', boxShadow: 'var(--shadow-sm)' }}>
                <Title level={4}>Lưu ý quan trọng</Title>
                <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-muted)' }}>
                  <li style={{ marginBottom: '0.8rem' }}>Giữ gìn phiếu bảo hành hoặc thông tin hợp đồng để đối chiếu.</li>
                  <li style={{ marginBottom: '0.8rem' }}>Không tự ý đục phá, thay đổi cấu trúc hạng mục đã chống thấm.</li>
                  <li style={{ marginBottom: '0.8rem' }}>Thông báo ngay khi phát hiện dấu hiệu ẩm mốc mới.</li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};

const Divider = () => <div style={{ height: '1px', background: '#f1f5f9', margin: '2rem 0' }} />;

export default PolicyPage;
