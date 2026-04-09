import {
    ArrowLeftOutlined,
    HomeOutlined,
    SafetyCertificateOutlined,
    SolutionOutlined
} from '@ant-design/icons';
import { Alert, Anchor, Button, Card, Divider, Image, Layout, Menu, theme, Typography } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { docsData, DocSection } from '../../data/docsData';

const { Header, Content, Sider } = Layout;
const { Title, Paragraph, Text } = Typography;

// Simple Badge component
const Badge = ({ status, text, style }: { status: string, text: string, style?: any }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, ...style }}>
        <span style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: status === 'processing' ? '#1890ff' : '#ccc'
        }} />
        <Text type="secondary">{text}</Text>
    </div>
);

const DocumentationPage: React.FC = () => {
    console.log('DocumentationPage: Rendering');
    const navigate = useNavigate();
    const { token } = theme.useToken();
    const [selectedKey, setSelectedKey] = useState<string>(docsData[0].id);

    const activeGuide = docsData.find(g => g.id === selectedKey) || docsData[0];

    const getSlug = (text: string) => {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[đĐ]/g, 'd')
            .replace(/([^0-9a-z-\s])/g, '')
            .replace(/(\s+)/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const renderAnchorItems = (sections: DocSection[]): any[] => {
        return sections.map(section => ({
            key: getSlug(section.title),
            href: `#${getSlug(section.title)}`,
            title: section.title,
            children: section.subsections ? renderAnchorItems(section.subsections) : undefined,
        }));
    };

    const renderSection = (section: DocSection, level: number = 2) => {
        const sectionId = getSlug(section.title);
        return (
            <div key={section.title} style={{ marginBottom: 32 }}>
                <Title level={level as any} id={sectionId}>
                    {section.title}
                </Title>

                {Array.isArray(section.content) ? (
                    <ul style={{ paddingLeft: 20 }}>
                        {section.content.map((item, index) => (
                            <li key={index}><Paragraph>{item}</Paragraph></li>
                        ))}
                    </ul>
                ) : (
                    <Paragraph>{section.content}</Paragraph>
                )}

                {section.alert && (
                    <Alert
                        message={section.alert.text}
                        type={section.alert.type === 'important' ? 'error' :
                            section.alert.type === 'warning' ? 'warning' : 'info'}
                        showIcon
                        style={{ marginBottom: 16 }}
                    />
                )}

                {section.image && (
                    <div style={{ margin: '24px 0', textAlign: 'center' }}>
                        <Card variant={'outlined'} styles={{ body: { padding: 8 } }} style={{ display: 'inline-block', maxWidth: '100%' }}>
                            <Image
                                src={section.image}
                                alt={section.title}
                                style={{ borderRadius: 8, maxHeight: 500, width: 'auto' }}
                            />
                        </Card>
                    </div>
                )}

                {section.subsections && section.subsections.map(sub => renderSection(sub, level + 1))}
            </div>
        );
    };

    return (
        <Layout style={{ minHeight: '100vh', background: '#f5f7fa' }}>
            <Header style={{
                background: '#fff',
                padding: '0 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                position: 'sticky',
                top: 0,
                zIndex: 1000
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{
                        width: 40,
                        height: 40,
                        background: token.colorPrimary,
                        borderRadius: 8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: 20,
                        fontWeight: 'bold'
                    }}>
                        S
                    </div>
                    <div>
                        <Title level={4} style={{ margin: 0, lineHeight: '1.2' }}>BACDocuments</Title>
                        <Text type="secondary" style={{ fontSize: 12 }}>Hướng dẫn sử dụng hệ thống</Text>
                    </div>
                </div>
                <Button
                    type="text"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/login')}
                >
                    Quay lại Đăng nhập
                </Button>
            </Header>

            <Layout>
                <Sider
                    width={280}
                    breakpoint="lg"
                    collapsedWidth="0"
                    style={{ background: '#fff', borderRight: '1px solid #e8e8e8' }}
                >
                    <div style={{ padding: '24px 16px 8px' }}>
                        <Text strong type="secondary" style={{ fontSize: 12, textTransform: 'uppercase' }}>Danh mục tài liệu</Text>
                    </div>
                    <Menu
                        mode="inline"
                        selectedKeys={[selectedKey]}
                        onClick={({ key }) => setSelectedKey(key)}
                        items={docsData.map(guide => ({
                            key: guide.id,
                            icon: guide.id === 'accountant' ? <SolutionOutlined /> : <SafetyCertificateOutlined />,
                            label: guide.title
                        }))}
                        style={{ borderRight: 0 }}
                    />
                    <Divider style={{ margin: '12px 0' }} />
                    <Menu
                        mode="inline"
                        selectable={false}
                        items={[
                            { key: 'home', icon: <HomeOutlined />, label: 'Trang chủ BAC', onClick: () => window.open('https://dltech.vn', '_blank') }
                        ]}
                    />
                </Sider>

                <Content style={{ padding: '24px', overflowY: 'auto' }}>
                    <div style={{ maxWidth: 960, margin: '0 auto' }}>
                        <Card style={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                            <div style={{ marginBottom: 40 }}>
                                <Badge status="processing" text="Hệ thống BACv3.0" style={{ marginBottom: 8, display: 'block' }} />
                                <Title level={1}>{activeGuide.title}</Title>
                                <Paragraph style={{ fontSize: 16, color: '#666' }}>
                                    {activeGuide.description}
                                </Paragraph>
                            </div>

                            <Divider />

                            <div className="doc-content">
                                {activeGuide.sections.map(section => renderSection(section))}
                            </div>

                            <Divider style={{ marginTop: 60 }} />
                            <div style={{ textAlign: 'center', padding: '24px 0' }}>
                                <Paragraph type="secondary">
                                    © 2026 BACConstruction Management System. Tài liệu hướng dẫn nội bộ.
                                </Paragraph>
                            </div>
                        </Card>
                    </div>
                </Content>

                <Sider
                    width={240}
                    breakpoint="xl"
                    collapsedWidth="0"
                    style={{
                        background: 'transparent',
                        padding: '24px 16px',
                        height: 'calc(100vh - 64px)',
                        position: 'sticky',
                        top: 64,
                        overflowY: 'auto'
                    }}
                >
                    <div style={{ paddingLeft: 12, marginBottom: 16 }}>
                        <Text strong type="secondary" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>Mục lục</Text>
                    </div>
                    <Anchor
                        offsetTop={80}
                        items={renderAnchorItems(activeGuide.sections)}
                        style={{ background: 'transparent' }}
                    />
                </Sider>
            </Layout>
        </Layout>
    );
};

export default DocumentationPage;
