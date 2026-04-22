import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Breadcrumb, 
  Typography, 
  Divider,
  Space,
  message
} from 'antd';
import { 
  PhoneOutlined, 
  MailOutlined, 
  EnvironmentOutlined, 
  ClockCircleOutlined, 
  SendOutlined 
} from '@ant-design/icons';
import './LandingPage.css';
import PublicHeader from './components/PublicHeader';
import PublicFooter from './components/PublicFooter';
import FloatingCTA from './components/FloatingCTA';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const ContactPage: React.FC = () => {
  const [form] = Form.useForm();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Liên hệ | BAC Group";
  }, []);

  const onFinish = (values: any) => {
    console.log('Success:', values);
    message.success('Cảm ơn bạn! Yêu cầu của bạn đã được gửi thành công. Chúng tôi sẽ liên hệ lại sớm nhất.');
    form.resetFields();
  };

  return (
    <div className="landing-page">
      <PublicHeader />
      <FloatingCTA />

      <main style={{ paddingTop: '100px', backgroundColor: 'var(--bg-soft)', minHeight: '100vh' }}>
        <div className="container" style={{ paddingBottom: '80px' }}>
          <div style={{ margin: '2rem 0' }}>
            <Breadcrumb>
              <Breadcrumb.Item><Link to="/">Trang chủ</Link></Breadcrumb.Item>
              <Breadcrumb.Item>Liên hệ</Breadcrumb.Item>
            </Breadcrumb>
          </div>

          <div className="section-header" style={{ textAlign: 'left', margin: '0 0 3rem' }}>
            <span className="section-subtitle">Kết nối với chúng tôi</span>
            <h2>Liên Hệ Tư Vấn Giải Pháp</h2>
            <p>Đội ngũ chuyên gia của BAC Group luôn sẵn sàng lắng nghe và giải quyết mọi vấn đề về thấm dột công trình của bạn.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '3rem' }}>
            {/* Contact Info */}
            <div className="contact-info-column">
              <Space direction="vertical" size={24} style={{ width: '100%' }}>
                <Card 
                  style={{ borderRadius: '24px', border: 'none', boxShadow: 'var(--shadow-sm)' }}
                  bodyStyle={{ padding: '2rem' }}
                >
                  <Title level={4} style={{ marginBottom: '1.5rem' }}>Thông tin liên hệ</Title>
                  
                  <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', background: 'var(--bg-soft)', color: 'var(--accent)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <PhoneOutlined />
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: '0.85rem' }}>Hotline 24/7</Text>
                      <div style={{ fontSize: '1.1rem', fontWeight: '700' }}>0362 555 167</div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', background: 'var(--bg-soft)', color: 'var(--accent)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MailOutlined />
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: '0.85rem' }}>Email hỗ trợ</Text>
                      <div style={{ fontSize: '1.1rem', fontWeight: '700' }}>contact@bacgroup.vn</div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', background: 'var(--bg-soft)', color: 'var(--accent)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <EnvironmentOutlined />
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: '0.85rem' }}>Văn phòng chính</Text>
                      <div style={{ fontSize: '1.1rem', fontWeight: '700' }}>Số 10, Ngõ 123, Đường ABC, Quận Cầu Giấy, Hà Nội</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', background: 'var(--bg-soft)', color: 'var(--accent)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ClockCircleOutlined />
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: '0.85rem' }}>Giờ làm việc</Text>
                      <div style={{ fontSize: '1.1rem', fontWeight: '700' }}>Thứ 2 - Chủ Nhật (08:00 - 20:00)</div>
                    </div>
                  </div>
                </Card>

                <Card 
                  style={{ 
                    borderRadius: '24px', 
                    border: 'none', 
                    background: 'linear-gradient(135deg, var(--primary) 0%, #1e293b 100%)',
                    color: 'white'
                  }}
                >
                  <Title level={4} style={{ color: 'white', marginBottom: '1rem' }}>Mạng xã hội</Title>
                  <Paragraph style={{ color: 'rgba(255,255,255,0.7)' }}>
                    Theo dõi chúng tôi trên các nền tảng mạng xã hội để cập nhật những dự án và kiến thức chống thấm mới nhất.
                  </Paragraph>
                  <Space size="large">
                    <a href="#" style={{ color: 'white', fontSize: '1.1rem' }}>Facebook</a>
                    <a href="#" style={{ color: 'white', fontSize: '1.1rem' }}>Zalo</a>
                    <a href="#" style={{ color: 'white', fontSize: '1.1rem' }}>Youtube</a>
                  </Space>
                </Card>
              </Space>
            </div>

            {/* Contact Form */}
            <div className="contact-form-column">
              <Card style={{ borderRadius: '24px', border: 'none', boxShadow: 'var(--shadow-sm)', padding: '2rem' }}>
                <Title level={3} style={{ marginBottom: '2rem' }}>Gửi tin nhắn cho chúng tôi</Title>
                <Form form={form} layout="vertical" onFinish={onFinish}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <Form.Item label="Họ và tên" name="fullname" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
                      <Input size="large" placeholder="Nguyễn Văn A" />
                    </Form.Item>
                    <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}>
                      <Input size="large" placeholder="09xx xxx xxx" />
                    </Form.Item>
                  </div>
                  <Form.Item label="Email" name="email">
                    <Input size="large" placeholder="example@email.com" />
                  </Form.Item>
                  <Form.Item label="Vấn đề cần tư vấn" name="subject" rules={[{ required: true, message: 'Vui lòng chọn hoặc nhập vấn đề' }]}>
                    <Input size="large" placeholder="Ví dụ: Chống thấm sàn mái, báo giá vật liệu..." />
                  </Form.Item>
                  <Form.Item label="Nội dung chi tiết" name="message">
                    <TextArea rows={5} placeholder="Mô tả cụ thể yêu cầu của bạn..." />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" size="large" icon={<SendOutlined />} style={{ height: '56px', borderRadius: '12px', padding: '0 3rem' }} htmlType="submit">
                      Gửi yêu cầu ngay
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};

export default ContactPage;
