import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
    Card, Table, Tag, Button, Row, Col, Statistic, Form, Input, Select,
    Popconfirm, message, Modal, Rate, Tabs, Avatar, Space, Divider, Checkbox,
} from 'antd';
import {
    PlusOutlined, EditOutlined, DeleteOutlined, TeamOutlined,
    UserAddOutlined, SearchOutlined, PhoneOutlined, MailOutlined,
    EnvironmentOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

// ─── Types ─────────────────────────────────────────────────────────
interface InternalMember {
    id: string;
    name: string;
    role: string;
    phone: string;
    email: string;
    rating: number;
    status: 'available' | 'busy' | 'on_leave';
    projectCount: number;
}

interface OutsourceCompany {
    id: string;
    name: string;
    contact: string;
    phone: string;
    email: string;
    address: string;
    province: string;
    district: string;
    ward: string;
    lat: number | null;
    lng: number | null;
    specializations: string[];
    members: number;
    rating: number;
    status: 'active' | 'inactive';
}

interface DirectoryEmployee {
    id: string;
    name: string;
    role: string;
    department: string;
    phone: string;
    email: string;
    rating: number;
}

// ─── Mock Data ─────────────────────────────────────────────────────
const initialInternalTeam: InternalMember[] = [
    { id: '1', name: 'Nguyễn Văn A', role: 'Giám sát', phone: '0901-234-567', email: 'a@sira.vn', rating: 4.8, status: 'available', projectCount: 3 },
    { id: '2', name: 'Trần Thị B', role: 'Kỹ thuật viên', phone: '0902-345-678', email: 'b@sira.vn', rating: 4.5, status: 'busy', projectCount: 5 },
    { id: '3', name: 'Lê Văn C', role: 'Công nhân', phone: '0903-456-789', email: 'c@sira.vn', rating: 4.2, status: 'available', projectCount: 2 },
    { id: '4', name: 'Phạm Thị D', role: 'Giám sát', phone: '0904-567-890', email: 'd@sira.vn', rating: 4.9, status: 'on_leave', projectCount: 4 },
    { id: '5', name: 'Hoàng Văn E', role: 'Kỹ thuật viên', phone: '0905-678-901', email: 'e@sira.vn', rating: 4.0, status: 'available', projectCount: 1 },
];

const initialOutsourceCompanies: OutsourceCompany[] = [
    { id: '1', name: 'NTC Construction', contact: 'Nguyễn Trung', phone: '0908-123-456', email: 'info@ntc.vn', address: '123 Nguyễn Huệ', province: 'TP. Hồ Chí Minh', district: 'Quận 1', ward: 'Phường Bến Nghé', lat: 10.7769, lng: 106.7009, specializations: ['Chống thấm', 'Sửa chữa kết cấu'], members: 25, rating: 4.5, status: 'active' },
    { id: '2', name: 'Hoàng Long JSC', contact: 'Hoàng Long', phone: '0908-234-567', email: 'info@hoanglong.vn', address: '456 Lê Lợi', province: 'TP. Hồ Chí Minh', district: 'Quận 3', ward: 'Phường Võ Thị Sáu', lat: 10.7850, lng: 106.6914, specializations: ['Thi công nội thất', 'Chống thấm'], members: 40, rating: 4.2, status: 'active' },
    { id: '3', name: 'Đại Phát JSC', contact: 'Trần Đại', phone: '0908-345-678', email: 'info@daiphat.vn', address: '789 Trần Hưng Đạo', province: 'Hà Nội', district: 'Quận Hoàn Kiếm', ward: 'Phường Hàng Bài', lat: 21.0285, lng: 105.8542, specializations: ['Xây dựng', 'Sơn Epoxy'], members: 60, rating: 3.8, status: 'inactive' },
];

const companyDirectory: DirectoryEmployee[] = [
    { id: 'd1', name: 'Vũ Minh Tuấn', role: 'Giám sát', department: 'Kỹ thuật', phone: '0906-111-222', email: 'tuan@sira.vn', rating: 4.6 },
    { id: 'd2', name: 'Đỗ Thị Hương', role: 'Kỹ thuật viên', department: 'Kỹ thuật', phone: '0906-222-333', email: 'huong@sira.vn', rating: 4.7 },
    { id: 'd3', name: 'Bùi Văn Khoa', role: 'Công nhân', department: 'Thi công', phone: '0906-333-444', email: 'khoa@sira.vn', rating: 4.3 },
    { id: 'd4', name: 'Ngô Thị Lan', role: 'Kỹ thuật viên', department: 'Chống thấm', phone: '0906-444-555', email: 'lan@sira.vn', rating: 4.8 },
    { id: 'd5', name: 'Trịnh Văn Sơn', role: 'Công nhân', department: 'Thi công', phone: '0906-555-666', email: 'son@sira.vn', rating: 4.1 },
];

const PROVINCES = [
    'TP. Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng',
    'Bình Dương', 'Đồng Nai', 'Long An', 'Bà Rịa - Vũng Tàu', 'Khánh Hòa',
];

const DISTRICTS_BY_PROVINCE: Record<string, string[]> = {
    'TP. Hồ Chí Minh': ['Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 7', 'Quận 9', 'Quận 10', 'Quận 12', 'Quận Bình Thạnh', 'Quận Gò Vấp', 'Quận Phú Nhuận', 'Quận Tân Bình', 'Quận Thủ Đức'],
    'Hà Nội': ['Quận Ba Đình', 'Quận Hoàn Kiếm', 'Quận Hai Bà Trưng', 'Quận Đống Đa', 'Quận Tây Hồ', 'Quận Cầu Giấy', 'Quận Thanh Xuân', 'Quận Hoàng Mai', 'Quận Long Biên', 'Quận Nam Từ Liêm'],
    'Đà Nẵng': ['Quận Hải Châu', 'Quận Thanh Khê', 'Quận Sơn Trà', 'Quận Ngũ Hành Sơn', 'Quận Liên Chiểu', 'Quận Cẩm Lệ'],
};

const WARDS_BY_DISTRICT: Record<string, string[]> = {
    'Quận 1': ['Phường Bến Nghé', 'Phường Bến Thành', 'Phường Cầu Kho', 'Phường Cầu Ông Lãnh', 'Phường Cô Giang', 'Phường Đa Kao', 'Phường Nguyễn Cư Trinh', 'Phường Nguyễn Thái Bình', 'Phường Phạm Ngũ Lão', 'Phường Tân Định'],
    'Quận 3': ['Phường Võ Thị Sáu', 'Phường Phường 1', 'Phường Phường 2', 'Phường Phường 3', 'Phường Phường 4'],
    'Quận Hoàn Kiếm': ['Phường Hàng Bài', 'Phường Hàng Bạc', 'Phường Hàng Bồ', 'Phường Hàng Buồm', 'Phường Hàng Đào'],
};

// ─── Google Map Picker Component ───────────────────────────────────
interface MapPickerProps {
    lat: number | null;
    lng: number | null;
    onChange: (lat: number, lng: number) => void;
}

const MapPicker: React.FC<MapPickerProps> = ({ lat, lng, onChange }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const googleMapRef = useRef<any>(null);
    const markerRef = useRef<any>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const defaultCenter = { lat: lat || 10.7769, lng: lng || 106.7009 };

    useEffect(() => {
        // Check if Google Maps is already loaded
        if ((window as any).google?.maps) {
            setIsLoaded(true);
            return;
        }

        // Load Google Maps script
        const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
        if (!existingScript) {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=&libraries=places`;
            script.async = true;
            script.defer = true;
            script.onload = () => setIsLoaded(true);
            document.head.appendChild(script);
        } else {
            const checkLoaded = setInterval(() => {
                if ((window as any).google?.maps) {
                    setIsLoaded(true);
                    clearInterval(checkLoaded);
                }
            }, 100);
            return () => clearInterval(checkLoaded);
        }
    }, []);

    useEffect(() => {
        if (!isLoaded || !mapRef.current) return;
        const gMaps = (window as any).google?.maps;
        if (!gMaps) return;

        const map = new gMaps.Map(mapRef.current, {
            center: defaultCenter,
            zoom: 15,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
        });
        googleMapRef.current = map;

        const marker = new gMaps.Marker({
            position: defaultCenter,
            map,
            draggable: true,
            animation: gMaps.Animation?.DROP,
        });
        markerRef.current = marker;

        // Click on map to move marker
        map.addListener('click', (e: any) => {
            if (e.latLng) {
                marker.setPosition(e.latLng);
                onChange(e.latLng.lat(), e.latLng.lng());
            }
        });

        // Drag marker
        marker.addListener('dragend', () => {
            const pos = marker.getPosition();
            if (pos) onChange(pos.lat(), pos.lng());
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoaded]);

    // Fallback without API key
    if (!isLoaded || !(window as any).google?.maps) {
        return (
            <div
                style={{
                    width: '100%',
                    height: 250,
                    border: '2px dashed #d9d9d9',
                    borderRadius: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#f5f5f5',
                    gap: 8,
                }}
            >
                <EnvironmentOutlined style={{ fontSize: 32, color: '#999' }} />
                <span style={{ color: '#666', fontSize: 13 }}>
                    Bấm để chọn vị trí trên bản đồ
                </span>
                <span style={{ color: '#999', fontSize: 12 }}>
                    {lat && lng ? `📍 ${lat.toFixed(6)}, ${lng.toFixed(6)}` : 'Chưa chọn vị trí'}
                </span>
                <Space style={{ marginTop: 4 }}>
                    <Button
                        size="small"
                        icon={<EnvironmentOutlined />}
                        onClick={() => {
                            if (navigator.geolocation) {
                                navigator.geolocation.getCurrentPosition(
                                    (pos) => onChange(pos.coords.latitude, pos.coords.longitude),
                                    () => message.warning('Không thể lấy vị trí hiện tại'),
                                );
                            }
                        }}
                    >
                        Lấy vị trí hiện tại
                    </Button>
                </Space>
            </div>
        );
    }

    return (
        <div>
            <div ref={mapRef} style={{ width: '100%', height: 250, borderRadius: 8 }} />
            {lat && lng && (
                <div style={{ marginTop: 4, color: '#666', fontSize: 12 }}>
                    📍 {lat.toFixed(6)}, {lng.toFixed(6)}
                </div>
            )}
        </div>
    );
};

// ─── Main Component ────────────────────────────────────────────────
const Teams: React.FC = () => {
    const navigate = useNavigate();
    const [internalTeam, setInternalTeam] = useState<InternalMember[]>(initialInternalTeam);
    const [outsourceCompanies, setOutsourceCompanies] = useState<OutsourceCompany[]>(initialOutsourceCompanies);

    // Outsource Company Modal
    const [companyModalOpen, setCompanyModalOpen] = useState(false);
    const [editingCompany, setEditingCompany] = useState<OutsourceCompany | null>(null);
    const [companyForm] = Form.useForm();
    const [mapLat, setMapLat] = useState<number | null>(null);
    const [mapLng, setMapLng] = useState<number | null>(null);
    const [selectedProvince, setSelectedProvince] = useState<string>('');
    const [selectedDistrict, setSelectedDistrict] = useState<string>('');

    // Invite Modal
    const [inviteModalOpen, setInviteModalOpen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

    // ─── Outsource Company handlers ──────────────────────────────
    const openCompanyModal = useCallback((company?: OutsourceCompany) => {
        if (company) {
            setEditingCompany(company);
            companyForm.setFieldsValue(company);
            setMapLat(company.lat);
            setMapLng(company.lng);
            setSelectedProvince(company.province);
            setSelectedDistrict(company.district);
        } else {
            setEditingCompany(null);
            companyForm.resetFields();
            setMapLat(null);
            setMapLng(null);
            setSelectedProvince('');
            setSelectedDistrict('');
        }
        setCompanyModalOpen(true);
    }, [companyForm]);

    const handleSaveCompany = useCallback(() => {
        companyForm.validateFields().then((values) => {
            const companyData: OutsourceCompany = {
                ...values,
                lat: mapLat,
                lng: mapLng,
                id: editingCompany?.id || Date.now().toString(),
                rating: editingCompany?.rating || 0,
                status: editingCompany?.status || 'active',
            };

            if (editingCompany) {
                setOutsourceCompanies((prev) =>
                    prev.map((c) => (c.id === editingCompany.id ? { ...c, ...companyData } : c)),
                );
                message.success('Cập nhật công ty thành công!');
            } else {
                setOutsourceCompanies((prev) => [...prev, companyData]);
                message.success('Thêm công ty mới thành công!');
            }
            setCompanyModalOpen(false);
        });
    }, [companyForm, editingCompany, mapLat, mapLng]);

    const handleDeleteCompany = useCallback((id: string) => {
        setOutsourceCompanies((prev) => prev.filter((c) => c.id !== id));
        message.success('Đã xóa công ty!');
    }, []);

    // ─── Invite handlers ─────────────────────────────────────────
    const filteredDirectory = companyDirectory.filter(
        (emp) =>
            !internalTeam.find((m) => m.name === emp.name) &&
            (emp.name.toLowerCase().includes(searchText.toLowerCase()) ||
                emp.role.toLowerCase().includes(searchText.toLowerCase()) ||
                emp.department.toLowerCase().includes(searchText.toLowerCase())),
    );

    const handleInvite = useCallback(() => {
        const newMembers = companyDirectory
            .filter((emp) => selectedEmployees.includes(emp.id))
            .map((emp) => ({
                id: emp.id,
                name: emp.name,
                role: emp.role,
                phone: emp.phone,
                email: emp.email,
                rating: emp.rating,
                status: 'available' as const,
                projectCount: 0,
            }));
        setInternalTeam((prev) => [...prev, ...newMembers]);
        setSelectedEmployees([]);
        setInviteModalOpen(false);
        message.success(`Đã mời ${newMembers.length} nhân viên!`);
    }, [selectedEmployees]);

    const handleMapChange = useCallback((lat: number, lng: number) => {
        setMapLat(lat);
        setMapLng(lng);
    }, []);

    // ─── Table columns ───────────────────────────────────────────
    const internalColumns = [
        {
            title: 'Nhân viên',
            dataIndex: 'name',
            key: 'name',
            render: (name: string, record: InternalMember) => (
                <Space>
                    <Avatar style={{ background: '#1890ff' }}>{name[0]}</Avatar>
                    <div>
                        <div style={{ fontWeight: 500 }}>{name}</div>
                        <div style={{ fontSize: 12, color: '#888' }}>{record.role}</div>
                    </div>
                </Space>
            ),
        },
        { title: 'SĐT', dataIndex: 'phone', key: 'phone', responsive: ['md' as const] },
        { title: 'Email', dataIndex: 'email', key: 'email', responsive: ['lg' as const] },
        {
            title: 'Đánh giá', dataIndex: 'rating', key: 'rating',
            render: (r: number) => <Rate disabled value={r} allowHalf style={{ fontSize: 14 }} />,
            responsive: ['md' as const],
        },
        {
            title: 'Trạng thái', dataIndex: 'status', key: 'status',
            render: (s: string) => {
                const map: Record<string, { color: string; label: string }> = {
                    available: { color: 'green', label: 'Sẵn sàng' },
                    busy: { color: 'orange', label: 'Đang bận' },
                    on_leave: { color: 'red', label: 'Nghỉ phép' },
                };
                return <Tag color={map[s]?.color}>{map[s]?.label}</Tag>;
            },
        },
        {
            title: 'Dự án', dataIndex: 'projectCount', key: 'projectCount',
            responsive: ['md' as const],
        },
    ];

    const outsourceColumns = [
        {
            title: 'Công ty',
            dataIndex: 'name',
            key: 'name',
            render: (name: string, record: OutsourceCompany) => (
                <div>
                    <div style={{ fontWeight: 500 }}>{name}</div>
                    <div style={{ fontSize: 12, color: '#888' }}>{record.contact} • {record.phone}</div>
                </div>
            ),
        },
        {
            title: 'Khu vực', key: 'area',
            render: (_: any, record: OutsourceCompany) => (
                <div>
                    <div style={{ fontSize: 13 }}>{record.province}</div>
                    <div style={{ fontSize: 12, color: '#888' }}>{record.district}, {record.ward}</div>
                </div>
            ),
            responsive: ['md' as const],
        },
        {
            title: 'Chuyên môn', dataIndex: 'specializations', key: 'specializations',
            render: (specs: string[]) => specs.map((s) => <Tag key={s} color="blue">{s}</Tag>),
            responsive: ['lg' as const],
        },
        {
            title: 'Nhân sự', dataIndex: 'members', key: 'members',
            responsive: ['md' as const],
        },
        {
            title: 'Đánh giá', dataIndex: 'rating', key: 'rating',
            render: (r: number) => <Rate disabled value={r} allowHalf style={{ fontSize: 14 }} />,
            responsive: ['lg' as const],
        },
        {
            title: 'Trạng thái', dataIndex: 'status', key: 'status',
            render: (s: string) => <Tag color={s === 'active' ? 'green' : 'default'}>{s === 'active' ? 'Hoạt động' : 'Ngừng HĐ'}</Tag>,
        },
        {
            title: 'Thao tác', key: 'action',
            render: (_: any, record: OutsourceCompany) => (
                <Space>
                    <Button size="small" icon={<EditOutlined />} onClick={() => openCompanyModal(record)} />
                    <Popconfirm title="Xóa công ty này?" onConfirm={() => handleDeleteCompany(record.id)}>
                        <Button size="small" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    // ─── Render ──────────────────────────────────────────────────
    const summaryStats = (
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={12} sm={6}>
                <Card size="small"><Statistic title="Nhân viên nội bộ" value={internalTeam.length} prefix={<TeamOutlined />} /></Card>
            </Col>
            <Col xs={12} sm={6}>
                <Card size="small"><Statistic title="Sẵn sàng" value={internalTeam.filter((m) => m.status === 'available').length} valueStyle={{ color: '#52c41a' }} /></Card>
            </Col>
            <Col xs={12} sm={6}>
                <Card size="small"><Statistic title="Cộng tác viên" value={outsourceCompanies.length} /></Card>
            </Col>
            <Col xs={12} sm={6}>
                <Card size="small"><Statistic title="Outsource hoạt động" value={outsourceCompanies.filter((c) => c.status === 'active').length} valueStyle={{ color: '#1890ff' }} /></Card>
            </Col>
        </Row>
    );

    return (
        <div>
            <h2 style={{ marginBottom: 16 }}>Quản Lý Đội Nhóm</h2>
            {summaryStats}

            <Card>
                <Tabs
                    defaultActiveKey="internal"
                    items={[
                        {
                            key: 'internal',
                            label: 'Đội Nội bộ',
                            children: (
                                <>
                                    <Row justify="end" style={{ marginBottom: 16 }}>
                                        <Button type="primary" icon={<UserAddOutlined />} onClick={() => setInviteModalOpen(true)}>
                                            Mời nhân viên
                                        </Button>
                                    </Row>
                                    <Table
                                        dataSource={internalTeam}
                                        columns={internalColumns}
                                        rowKey="id"
                                        pagination={{ pageSize: 10 }}
                                        scroll={{ x: 600 }}
                                    />
                                </>
                            ),
                        },
                        {
                            key: 'outsource',
                            label: 'Cộng tác viên',
                            children: (
                                <>
                                    <Row justify="end" style={{ marginBottom: 16 }}>
                                        <Button type="primary" icon={<PlusOutlined />} onClick={() => openCompanyModal()}>
                                            Thêm Cộng tác viên
                                        </Button>
                                    </Row>
                                    <Table
                                        dataSource={outsourceCompanies}
                                        columns={outsourceColumns}
                                        rowKey="id"
                                        pagination={{ pageSize: 10 }}
                                        scroll={{ x: 800 }}
                                        onRow={(record) => ({
                                            onClick: (e) => {
                                                // Don't navigate if clicking action buttons
                                                if ((e.target as HTMLElement).closest('button, .ant-popconfirm')) return;
                                                navigate(`/ql/teams/outsource/${record.id}`);
                                            },
                                            style: { cursor: 'pointer' },
                                        })}
                                    />
                                </>
                            ),
                        },
                    ]}
                />
            </Card>

            {/* ═══ Outsource Company Modal ═══ */}
            <Modal
                title={editingCompany ? 'Chỉnh Sửa Cộng tác viên' : 'Thêm Cộng tác viên'}
                open={companyModalOpen}
                onCancel={() => setCompanyModalOpen(false)}
                onOk={handleSaveCompany}
                okText={editingCompany ? 'Cập nhật' : 'Tạo mới'}
                cancelText="Hủy"
                width={720}
                destroyOnClose
            >
                <Form form={companyForm} layout="vertical">
                    <Divider orientation="left" plain style={{ fontSize: 13 }}>Thông tin cơ bản</Divider>
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item name="name" label="Tên công ty" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
                                <Input placeholder="VD: ABC Construction" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item name="contact" label="Người liên hệ" rules={[{ required: true, message: 'Vui lòng nhập' }]}>
                                <Input placeholder="VD: Nguyễn Văn A" prefix={<UserAddOutlined />} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập' }]}>
                                <Input placeholder="VD: 0908-123-456" prefix={<PhoneOutlined />} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item name="email" label="Email">
                                <Input placeholder="VD: info@company.vn" prefix={<MailOutlined />} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider orientation="left" plain style={{ fontSize: 13 }}>Khu vực hoạt động</Divider>
                    <Row gutter={16}>
                        <Col xs={24} sm={8}>
                            <Form.Item name="province" label="Tỉnh/Thành phố" rules={[{ required: true, message: 'Vui lòng chọn' }]}>
                                <Select
                                    placeholder="Chọn tỉnh/thành"
                                    showSearch
                                    onChange={(val: string) => {
                                        setSelectedProvince(val);
                                        setSelectedDistrict('');
                                        companyForm.setFieldsValue({ district: undefined, ward: undefined });
                                    }}
                                >
                                    {PROVINCES.map((p) => <Option key={p} value={p}>{p}</Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={8}>
                            <Form.Item name="district" label="Quận/Huyện" rules={[{ required: true, message: 'Vui lòng chọn' }]}>
                                <Select
                                    placeholder="Chọn quận/huyện"
                                    showSearch
                                    disabled={!selectedProvince}
                                    onChange={(val: string) => {
                                        setSelectedDistrict(val);
                                        companyForm.setFieldsValue({ ward: undefined });
                                    }}
                                >
                                    {(DISTRICTS_BY_PROVINCE[selectedProvince] || []).map((d) => (
                                        <Option key={d} value={d}>{d}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={8}>
                            <Form.Item name="ward" label="Phường/Xã" rules={[{ required: true, message: 'Vui lòng chọn' }]}>
                                <Select placeholder="Chọn phường/xã" showSearch disabled={!selectedDistrict}>
                                    {(WARDS_BY_DISTRICT[selectedDistrict] || []).map((w) => (
                                        <Option key={w} value={w}>{w}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item name="address" label="Địa chỉ chi tiết">
                                <Input placeholder="VD: 123 Nguyễn Huệ" prefix={<EnvironmentOutlined />} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item label="Vị trí trên bản đồ">
                                <MapPicker lat={mapLat} lng={mapLng} onChange={handleMapChange} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider orientation="left" plain style={{ fontSize: 13 }}>Chuyên môn & Quy mô</Divider>
                    <Row gutter={16}>
                        <Col xs={24} sm={16}>
                            <Form.Item name="specializations" label="Chuyên môn">
                                <Select mode="tags" placeholder="Nhập chuyên môn (nhấn Enter để thêm)" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={8}>
                            <Form.Item name="members" label="Số nhân sự">
                                <Input type="number" placeholder="VD: 10" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>

            {/* ═══ Invite Employees Modal ═══ */}
            <Modal
                title="Mời Nhân Viên Vào Đội"
                open={inviteModalOpen}
                onCancel={() => { setInviteModalOpen(false); setSelectedEmployees([]); setSearchText(''); }}
                onOk={handleInvite}
                okText={`Mời (${selectedEmployees.length})`}
                okButtonProps={{ disabled: selectedEmployees.length === 0 }}
                cancelText="Hủy"
                width={600}
            >
                <Input
                    placeholder="Tìm theo tên, vai trò, phòng ban..."
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    allowClear
                    style={{ marginBottom: 16 }}
                />
                <div style={{ maxHeight: 400, overflow: 'auto' }}>
                    {filteredDirectory.map((emp) => (
                        <Card
                            key={emp.id}
                            size="small"
                            style={{
                                marginBottom: 8,
                                cursor: 'pointer',
                                border: selectedEmployees.includes(emp.id) ? '2px solid #1890ff' : undefined,
                                background: selectedEmployees.includes(emp.id) ? '#e6f4ff' : undefined,
                            }}
                            onClick={() =>
                                setSelectedEmployees((prev) =>
                                    prev.includes(emp.id) ? prev.filter((id) => id !== emp.id) : [...prev, emp.id],
                                )
                            }
                        >
                            <Row align="middle" gutter={12}>
                                <Col flex="none">
                                    <Checkbox checked={selectedEmployees.includes(emp.id)} />
                                </Col>
                                <Col flex="none">
                                    <Avatar style={{ background: '#1890ff' }}>{emp.name[0]}</Avatar>
                                </Col>
                                <Col flex="auto">
                                    <div style={{ fontWeight: 500 }}>{emp.name}</div>
                                    <div style={{ fontSize: 12, color: '#888' }}>
                                        {emp.role} • {emp.department} • {emp.phone}
                                    </div>
                                </Col>
                                <Col flex="none">
                                    <Rate disabled value={emp.rating} allowHalf style={{ fontSize: 12 }} />
                                </Col>
                            </Row>
                        </Card>
                    ))}
                    {filteredDirectory.length === 0 && (
                        <div style={{ textAlign: 'center', padding: 24, color: '#999' }}>
                            Không tìm thấy nhân viên phù hợp
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default Teams;
