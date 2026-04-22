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

      <main style={{ paddingTop: '120px', backgroundColor: 'var(--bg-soft)', minHeight: '100vh' }}>
        <div className="container" style={{ paddingBottom: '120px' }}>
          <div style={{ margin: '1rem 0 3rem' }}>
            <Breadcrumb separator=">">
              <Breadcrumb.Item><Link to="/">Trang chủ</Link></Breadcrumb.Item>
              <Breadcrumb.Item>Chính sách bảo hành</Breadcrumb.Item>
            </Breadcrumb>
          </div>

          <div className="section-header" style={{ textAlign: 'center', marginBottom: '5rem', maxWidth: '800px', margin: '0 auto 5rem' }}>
            <span className="section-subtitle">Quyền lợi khách hàng</span>
            <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>Chính Sách Bảo Hành & Cam Kết</h2>
            <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>Chúng tôi hiểu rằng sự tin tưởng của khách hàng là tài sản quý giá nhất. Vì vậy, mọi dự án đều được đảm bảo bằng những cam kết văn bản pháp lý mạnh mẽ.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1fr)', gap: '4rem', alignItems: 'start' }}>
            {/* Policy Content */}
            <div className="policy-content-column">
              <Card style={{ borderRadius: '32px', border: 'none', boxShadow: 'var(--shadow-premium)', marginBottom: '3rem', padding: '1.5rem' }}>
                <Title level={3} style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--primary)', marginBottom: '2rem' }}>
                  <div style={{ background: 'rgba(234, 179, 8, 0.1)', padding: '12px', borderRadius: '12px' }}>
                    <FileProtectOutlined style={{ color: 'var(--accent)', fontSize: '1.5rem' }} />
                  </div>
                  1. Cam Kết Vàng 100%
                </Title>
                <Paragraph style={{ fontSize: '1.2rem', lineHeight: '1.9', color: '#475569', marginBottom: '3rem' }}>
                  BAC Group cam kết xử lý triệt để 100% các vấn đề thấm dột ngay trong lần thi công đầu tiên. Nếu hạng mục thi công bị thấm lại trong thời gian bảo hành, chúng tôi cam kết hoàn tiền 100% chi phí thi công cho quý khách hàng.
                </Paragraph>
                
                <div style={{ height: '1px', background: '#e2e8f0', margin: '3rem 0' }} />
                
                <Title level={3} style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--primary)', marginBottom: '2rem' }}>
                  <div style={{ background: 'rgba(51, 65, 85, 0.1)', padding: '12px', borderRadius: '12px' }}>
                    <AuditOutlined style={{ color: 'var(--primary)', fontSize: '1.5rem' }} />
                  </div>
                  2. Quy Trình Bảo Hành 24h
                </Title>
                <Timeline 
                  mode="left"
                  style={{ marginTop: '2rem' }}
                  items={[
                    { label: <Text strong style={{ color: 'var(--primary-accent)' }}>Bước 1</Text>, children: <div style={{ marginBottom: '20px' }}><Text strong>Tiếp nhận yêu cầu</Text><br /><Text type="secondary">Qua hotline 0362 555 167 hoặc ứng dụng Portal.</Text></div>, dot: <HistoryOutlined style={{ fontSize: '18px' }} /> },
                    { label: <Text strong style={{ color: 'var(--primary-accent)' }}>Bước 2</Text>, children: <div style={{ marginBottom: '20px' }}><Text strong>Khảo sát thực tế</Text><br /><Text type="secondary">Chuyên viên có mặt tại công trình trong vòng 24h.</Text></div>, dot: <HistoryOutlined style={{ fontSize: '18px' }} /> },
                    { label: <Text strong style={{ color: 'var(--primary-accent)' }}>Bước 3</Text>, children: <div style={{ marginBottom: '20px' }}><Text strong>Lập phương án</Text><br /><Text type="secondary">Thống nhất giải pháp và thời gian thi công khắc phục.</Text></div>, dot: <HistoryOutlined style={{ fontSize: '18px' }} /> },
                    { label: <Text strong style={{ color: 'var(--primary-accent)' }}>Bước 4</Text>, children: <div style={{ marginBottom: '20px' }}><Text strong>Thi công & Bàn giao</Text><br /><Text type="secondary">Xử lý dứt điểm và kích hoạt lại bảo hành.</Text></div>, dot: <HistoryOutlined style={{ fontSize: '18px' }} /> },
                  ]}
                />
              </Card>

              <div>
                <Title level={3} style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <QuestionCircleOutlined style={{ color: 'var(--accent)' }} /> Câu hỏi thường gặp (FAQ)
                </Title>
                <Collapse 
                  accordion 
                  ghost 
                  expandIconPosition="end"
                  style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', padding: '1rem', boxShadow: 'var(--shadow-sm)' }}
                >
                  {faqs.map((faq, index) => (
                    <Panel header={<Text strong style={{ fontSize: '1.1rem' }}>{faq.q}</Text>} key={index} style={{ borderBottom: index !== faqs.length - 1 ? '1px solid #f1f5f9' : 'none', padding: '15px 0' }}>
                      <Paragraph style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.7', marginBottom: 0 }}>{faq.a}</Paragraph>
                    </Panel>
                  ))}
                </Collapse>
              </div>
            </div>

            {/* Side Highlights */}
            <div className="policy-highlights-column" style={{ position: 'sticky', top: '140px' }}>
              <Card 
                style={{ 
                  borderRadius: '32px', 
                  border: 'none', 
                  background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                  color: 'white',
                  marginBottom: '2rem',
                  overflow: 'hidden'
                }}
              >
                <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                  <SafetyCertificateOutlined style={{ fontSize: '4.5rem', color: 'var(--accent)', marginBottom: '2rem' }} />
                  <Title level={2} style={{ color: 'white', marginBottom: '0.5rem', fontSize: '2.5rem' }}>10 NĂM</Title>
                  <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', fontWeight: '600', letterSpacing: '0.1em' }}>BẢO HÀNH VÀNG</Text>
                  <div style={{ width: '40px', height: '3px', background: 'var(--accent)', margin: '2rem auto' }} />
                  <Paragraph style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', lineHeight: 1.6 }}>
                    Cam kết chất lượng tuyệt đối từ đội ngũ kỹ sư hàng đầu của BAC Group. An tâm cho mọi công trình.
                  </Paragraph>
                </div>
              </Card>

              <Card style={{ borderRadius: '32px', border: 'none', boxShadow: 'var(--shadow-sm)', padding: '1.5rem' }}>
                <Title level={4} style={{ marginBottom: '1.5rem' }}>Lưu ý quan trọng</Title>
                <ul style={{ paddingLeft: '0', listStyle: 'none' }}>
                  {[
                    'Giữ gìn phiếu bảo hành hoặc thông tin hợp đồng điện tử.',
                    'Không tự ý đục phá, thay đổi cấu trúc hạng mục đã chống thấm.',
                    'Thông báo ngay qua Portal khi phát hiện dấu hiệu bất thường.'
                  ].map((item, idx) => (
                    <li key={idx} style={{ 
                      display: 'flex', 
                      gap: '1rem', 
                      marginBottom: '1.2rem', 
                      color: 'var(--text-muted)',
                      lineHeight: 1.5
                    }}>
                      <CheckCircleOutlined style={{ color: 'var(--primary-accent)', flexShrink: 0, marginTop: '4px' }} />
                      {item}
                    </li>
                  ))}
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
