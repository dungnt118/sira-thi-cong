import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Anchor, Button, Card, Divider, Image, Layout, Menu, Typography, theme } from 'antd';
import {
    ArrowLeftOutlined,
    BookOutlined,
    FileTextOutlined,
    HomeOutlined,
    ReadOutlined,
    SafetyCertificateOutlined,
    SolutionOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { documentationContent, DocSection } from '../../data/documentationContent';

const HEADER_HEIGHT = 88;
const { Header, Content, Sider } = Layout;
const { Title, Paragraph, Text } = Typography;

const categoryIcons: Record<string, React.ReactNode> = {
    accountant: <SolutionOutlined />,
    supervisor: <SafetyCertificateOutlined />
};

const Badge = ({ text, style }: { text: string; style?: React.CSSProperties }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, ...style }}>
        <span
            style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#1677ff'
            }}
        />
        <Text type="secondary">{text}</Text>
    </div>
);

const getSlug = (text: string) =>
    text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .replace(/([^0-9a-z-\s])/g, '')
        .replace(/(\s+)/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');

const renderAnchorItems = (sections: DocSection[]): NonNullable<React.ComponentProps<typeof Anchor>['items']> =>
    sections.map(section => ({
        key: getSlug(section.title),
        href: `#${getSlug(section.title)}`,
        title: section.title,
        children: section.subsections ? renderAnchorItems(section.subsections) : undefined
    }));

const renderSection = (section: DocSection, level = 2) => {
    const titleLevel = Math.min(level, 5) as 1 | 2 | 3 | 4 | 5;
    const sectionId = getSlug(section.title);

    return (
        <div key={section.title} style={{ marginBottom: 32 }}>
            <Title level={titleLevel} id={sectionId}>
                {section.title}
            </Title>

            {Array.isArray(section.content) ? (
                <ul style={{ paddingLeft: 20 }}>
                    {section.content.map(item => (
                        <li key={item}>
                            <Paragraph>{item}</Paragraph>
                        </li>
                    ))}
                </ul>
            ) : (
                <Paragraph>{section.content}</Paragraph>
            )}

            {section.alert && (
                <Alert
                    message={section.alert.text}
                    type={
                        section.alert.type === 'important'
                            ? 'error'
                            : section.alert.type === 'warning' || section.alert.type === 'caution'
                              ? 'warning'
                              : 'info'
                    }
                    showIcon
                    style={{ marginBottom: 16 }}
                />
            )}

            {section.image && (
                <div style={{ margin: '24px 0', textAlign: 'center' }}>
                    <Card
                        variant="outlined"
                        styles={{ body: { padding: 8 } }}
                        style={{ display: 'inline-block', maxWidth: '100%' }}
                    >
                        <Image
                            src={section.image}
                            alt={section.title}
                            style={{ borderRadius: 8, maxHeight: 500, width: 'auto', maxWidth: '100%' }}
                        />
                    </Card>
                </div>
            )}

            {section.subsections?.map(subsection => renderSection(subsection, level + 1))}
        </div>
    );
};

const DocumentationCenterPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { token } = theme.useToken();
    const [openKeys, setOpenKeys] = useState<string[]>([]);

    const activeCategory = useMemo(() => {
        const categoryId = searchParams.get('category');
        return documentationContent.find(category => category.id === categoryId) ?? documentationContent[0];
    }, [searchParams]);

    const activeDocument = useMemo(() => {
        const documentId = searchParams.get('doc');
        return activeCategory.documents.find(document => document.id === documentId) ?? activeCategory.documents[0];
    }, [activeCategory, searchParams]);

    useEffect(() => {
        setOpenKeys(previousKeys => {
            if (previousKeys.includes(activeCategory.id)) {
                return previousKeys;
            }

            return [...previousKeys, activeCategory.id];
        });
    }, [activeCategory.id]);

    useEffect(() => {
        const currentCategoryId = searchParams.get('category');
        const currentDocumentId = searchParams.get('doc');

        if (currentCategoryId === activeCategory.id && currentDocumentId === activeDocument.id) {
            return;
        }

        const nextParams = new URLSearchParams();
        nextParams.set('category', activeCategory.id);
        nextParams.set('doc', activeDocument.id);

        navigate(
            {
                pathname: '/documents',
                search: `?${nextParams.toString()}`
            },
            { replace: true }
        );
    }, [activeCategory.id, activeDocument.id, navigate, searchParams]);

    const menuItems = useMemo<MenuProps['items']>(
        () =>
            documentationContent.map(category => ({
                key: category.id,
                icon: categoryIcons[category.id] ?? <BookOutlined />,
                label: category.title,
                children: category.documents.map(document => ({
                    key: `${category.id}:${document.id}`,
                    icon: <FileTextOutlined />,
                    label: document.title
                }))
            })),
        []
    );

    const handleDocumentSelect: MenuProps['onClick'] = ({ key }) => {
        const [categoryId, documentId] = String(key).split(':');

        if (!categoryId || !documentId) {
            return;
        }

        const nextParams = new URLSearchParams();
        nextParams.set('category', categoryId);
        nextParams.set('doc', documentId);

        navigate({
            pathname: '/documents',
            search: `?${nextParams.toString()}`
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
            return;
        }

        navigate('/login');
    };

    return (
        <Layout style={{ minHeight: '100vh', background: '#f5f7fa' }}>
            <Header
                style={{
                    background: '#fff',
                    padding: '16px 24px',
                    minHeight: HEADER_HEIGHT,
                    height: 'auto',
                    lineHeight: 'normal',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 16,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1000,
                    flexWrap: 'wrap'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div
                        style={{
                            width: 44,
                            height: 44,
                            background: token.colorPrimary,
                            borderRadius: 12,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontSize: 20,
                            fontWeight: 700
                        }}
                    >
                        B
                    </div>
                    <div>
                        <Title level={4} style={{ margin: 0, lineHeight: 1.3 }}>
                            BAC Document
                        </Title>
                        <Text type="secondary" style={{ fontSize: 13 }}>
                            Hướng dẫn sử dụng hệ thống theo vai trò và tính năng
                        </Text>
                    </div>
                </div>

                <Button type="text" icon={<ArrowLeftOutlined />} onClick={handleBack}>
                    Quay lại
                </Button>
            </Header>

            <Layout>
                <Sider
                    width={320}
                    breakpoint="lg"
                    collapsedWidth="0"
                    style={{
                        background: '#fff',
                        borderRight: '1px solid #e8e8e8'
                    }}
                >
                    <div style={{ padding: '24px 16px 8px' }}>
                        <Text strong type="secondary" style={{ fontSize: 12, textTransform: 'uppercase' }}>
                            Danh mục tài liệu
                        </Text>
                        <Paragraph type="secondary" style={{ marginTop: 8, marginBottom: 0 }}>
                            Chọn nhóm tài liệu ở cấp 1, sau đó mở tài liệu chi tiết ở cấp 2.
                        </Paragraph>
                    </div>

                    <Menu
                        mode="inline"
                        selectedKeys={[`${activeCategory.id}:${activeDocument.id}`]}
                        openKeys={openKeys}
                        onOpenChange={keys => {
                            const nextOpenKeys = Array.from(new Set([...(keys as string[]), activeCategory.id]));
                            setOpenKeys(nextOpenKeys);
                        }}
                        onClick={handleDocumentSelect}
                        items={menuItems}
                        style={{ borderRight: 0 }}
                    />

                    <Divider style={{ margin: '12px 0' }} />

                    <Menu
                        mode="inline"
                        selectable={false}
                        items={[
                            {
                                key: 'home',
                                icon: <HomeOutlined />,
                                label: 'Trang chủ BAC',
                                onClick: () => window.open('https://dltech.vn', '_blank')
                            }
                        ]}
                    />
                </Sider>

                <Content style={{ padding: '24px', overflowY: 'auto' }}>
                    <div style={{ maxWidth: 960, margin: '0 auto' }}>
                        <Card
                            style={{
                                borderRadius: 12,
                                border: 'none',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)'
                            }}
                        >
                            <div style={{ marginBottom: 40 }}>
                                <Badge text={activeCategory.title} style={{ marginBottom: 8, display: 'block' }} />
                                <Title level={1} style={{ marginBottom: 12 }}>
                                    {activeDocument.title}
                                </Title>
                                <Paragraph style={{ fontSize: 16, color: '#666', marginBottom: 0 }}>
                                    {activeDocument.description}
                                </Paragraph>
                            </div>

                            <Divider />

                            <div className="doc-content">
                                {activeDocument.sections.map(section => renderSection(section))}
                            </div>

                            <Divider style={{ marginTop: 60 }} />

                            <div style={{ textAlign: 'center', padding: '24px 0' }}>
                                <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                                    © 2026 BAC Document. Tài liệu hướng dẫn nội bộ.
                                </Paragraph>
                            </div>
                        </Card>
                    </div>
                </Content>

                <Sider
                    width={260}
                    breakpoint="xl"
                    collapsedWidth="0"
                    style={{
                        background: 'transparent',
                        padding: '24px 16px',
                        height: `calc(100vh - ${HEADER_HEIGHT}px)`,
                        position: 'sticky',
                        top: HEADER_HEIGHT,
                        overflowY: 'auto'
                    }}
                >
                    <div style={{ paddingLeft: 12, marginBottom: 16 }}>
                        <Text
                            strong
                            type="secondary"
                            style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}
                        >
                            Mục lục
                        </Text>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '0 12px 16px',
                            color: token.colorTextSecondary
                        }}
                    >
                        <ReadOutlined />
                        <Text type="secondary">{activeDocument.title}</Text>
                    </div>

                    <Anchor
                        offsetTop={HEADER_HEIGHT + 24}
                        items={renderAnchorItems(activeDocument.sections)}
                        style={{ background: 'transparent' }}
                    />
                </Sider>
            </Layout>
        </Layout>
    );
};

export default DocumentationCenterPage;
