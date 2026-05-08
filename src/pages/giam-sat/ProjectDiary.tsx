import React, { useCallback, useEffect, useState } from 'react';
import {
    Button,
    Card,
    DatePicker,
    Empty,
    Form,
    Input,
    List,
    Result,
    Space,
    Spin,
    Tag,
    Typography,
    message,
} from 'antd';
import {
    CalendarOutlined,
    EnvironmentOutlined,
    FieldTimeOutlined,
    FileTextOutlined,
    PlusOutlined,
    ReloadOutlined,
    SaveOutlined,
} from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';

import { siteReportService } from '../../services/core-contracts/services/siteReport.service';
import {
    ICreateSiteReportInput,
    ISiteReport,
} from '../../services/core-contracts/types/siteReport.types';
import { buildFilter } from '@/utils/filterBuilder';

const { TextArea } = Input;
const { Text, Title } = Typography;

/* ─── Helpers ─────────────────────────────────────────────────── */

/**
 * Bug 2.2: SiteReport schema không có field weather/manpower riêng.
 * Solution Wave 3.5: encode chúng vào `content` field theo template có dấu hiệu rõ ràng,
 * dễ parse khi hiển thị, dễ migrate sau khi schema có field riêng (Wave 4+).
 */
const DIARY_PREFIX = '[DIARY-V1]';
const FIELD_WEATHER = 'WEATHER:';
const FIELD_MANPOWER = 'MANPOWER:';
const FIELD_ACTIVITIES = 'ACTIVITIES:';
const FIELD_NOTES = 'NOTES:';

interface DiaryFormValues {
    date: dayjs.Dayjs;
    weather: string;
    manpower: string;
    activities: string;
    notes?: string;
}

interface ParsedDiary {
    weather: string;
    manpower: string;
    activities: string;
    notes: string;
}

const encodeDiaryContent = (v: DiaryFormValues): string => {
    return [
        DIARY_PREFIX,
        `${FIELD_WEATHER} ${v.weather || ''}`,
        `${FIELD_MANPOWER} ${v.manpower || ''}`,
        `${FIELD_ACTIVITIES} ${v.activities || ''}`,
        v.notes ? `${FIELD_NOTES} ${v.notes}` : '',
    ].filter(Boolean).join('\n');
};

const parseDiaryContent = (content?: string): ParsedDiary => {
    if (!content) return { weather: '', manpower: '', activities: '', notes: '' };
    if (!content.startsWith(DIARY_PREFIX)) {
        // Legacy/non-diary report — show raw content as activities.
        return { weather: '', manpower: '', activities: content, notes: '' };
    }
    const lines = content.split('\n');
    const get = (prefix: string) => {
        const line = lines.find(l => l.startsWith(prefix));
        return line ? line.slice(prefix.length).trim() : '';
    };
    return {
        weather: get(FIELD_WEATHER),
        manpower: get(FIELD_MANPOWER),
        activities: get(FIELD_ACTIVITIES),
        notes: get(FIELD_NOTES),
    };
};

/* ─── Component ──────────────────────────────────────────────── */

export const ProjectDiary: React.FC = () => {
    // Route: /admin/gs/diary/:projectId — projectId hiện tại = journey._id (Wave 1 unified IA)
    const { projectId: journeyId } = useParams<{ projectId: string }>();

    const [entries, setEntries] = useState<ISiteReport[]>([]);
    const [loading, setLoading] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form] = Form.useForm<DiaryFormValues>();

    /* ─── Data fetching ─────────────────────────────────────── */

    const fetchEntries = useCallback(async () => {
        if (!journeyId) return;
        setLoading(true);
        try {
            const res = await siteReportService.querySiteReportsDto(buildFilter({
                where: [
                    { id: 'journey_id', value: journeyId },
                    { id: 'journey_step_code', value: 'execution' },
                ],
                sortBy: [{ id: 'createdAt', desc: true }],
                limit: 100,
            }));
            setEntries(res?.data || []);
        } catch {
            message.error('Không thể tải nhật ký hiện trường.');
        } finally {
            setLoading(false);
        }
    }, [journeyId]);

    useEffect(() => { fetchEntries(); }, [fetchEntries]);

    /* ─── Handlers ──────────────────────────────────────────── */

    const handleFinish = async (values: DiaryFormValues) => {
        if (!journeyId) {
            message.error('Thiếu mã công trình. Vui lòng truy cập từ danh sách công trình.');
            return;
        }
        setSaving(true);
        try {
            const dateLabel = values.date.format('DD/MM/YYYY');
            const input: ICreateSiteReportInput = {
                journey_id: journeyId,
                journey_step_code: 'execution',
                title: `Nhật ký ${dateLabel}`,
                content: encodeDiaryContent(values),
                createdAt: values.date.toDate(),
            };
            const created = await siteReportService.createSiteReport(input);
            setEntries(prev => [created, ...prev]);
            message.success('Đã lưu nhật ký hiện trường');
            form.resetFields();
            setIsAdding(false);
        } catch (e: any) {
            message.error(e?.message || 'Không thể lưu nhật ký. Vui lòng thử lại.');
        } finally {
            setSaving(false);
        }
    };

    /* ─── Render ─────────────────────────────────────────────── */

    if (!journeyId) {
        return (
            <Result
                status="warning"
                title="Thiếu mã công trình"
                subTitle="Vui lòng truy cập trang nhật ký từ danh sách công trình của bạn."
            />
        );
    }

    return (
        <div className="project-diary" style={{ padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Title level={4} style={{ margin: 0 }}>
                    <FileTextOutlined /> Nhật ký hiện trường
                </Title>
                <Space>
                    <Button icon={<ReloadOutlined />} onClick={fetchEntries} loading={loading} />
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setIsAdding(!isAdding)}
                    >
                        {isAdding ? 'Hủy' : 'Ghi nhật ký'}
                    </Button>
                </Space>
            </div>

            {isAdding && (
                <Card className="gs-card" style={{ marginBottom: 20 }}>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleFinish}
                        initialValues={{ date: dayjs(), weather: 'Nắng ráo' }}
                    >
                        <Form.Item name="date" label="Ngày ghi nhận" rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}>
                            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                        </Form.Item>
                        <Form.Item name="weather" label="Thời tiết" rules={[{ required: true, message: 'Vui lòng nhập thời tiết' }]}>
                            <Input placeholder="Nắng, mưa, mát mẻ..." />
                        </Form.Item>
                        <Form.Item name="manpower" label="Nhân lực hiện trường" rules={[{ required: true, message: 'Vui lòng nhập nhân lực' }]}>
                            <Input placeholder="VD: 5 người (2 thợ chính, 3 phụ)" />
                        </Form.Item>
                        <Form.Item name="activities" label="Nội dung công việc" rules={[{ required: true, message: 'Vui lòng nhập nội dung công việc' }]}>
                            <TextArea rows={4} placeholder="Mô tả chi tiết các hạng mục đã làm..." />
                        </Form.Item>
                        <Form.Item name="notes" label="Ghi chú thêm (tuỳ chọn)">
                            <TextArea rows={2} placeholder="Vấn đề phát sinh, đề xuất, lưu ý cho ngày kế tiếp..." />
                        </Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={saving}>
                                Lưu nhật ký hôm nay
                            </Button>
                            <Button onClick={() => { form.resetFields(); setIsAdding(false); }}>
                                Hủy
                            </Button>
                        </Space>
                    </Form>
                </Card>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: 40 }}><Spin size="large" /></div>
            ) : entries.length === 0 ? (
                <Empty description="Chưa có nhật ký nào cho công trình này." />
            ) : (
                <List
                    dataSource={entries}
                    renderItem={(entry) => {
                        const parsed = parseDiaryContent(entry.content);
                        const dateLabel = entry.createdAt
                            ? dayjs(entry.createdAt).format('DD/MM/YYYY')
                            : '—';
                        const timeLabel = entry.createdAt
                            ? dayjs(entry.createdAt).format('HH:mm')
                            : '';
                        return (
                            <Card size="small" className="gs-card" style={{ marginBottom: 12 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                    <Space direction="vertical" size={0}>
                                        <Text strong>
                                            <CalendarOutlined /> {dateLabel}
                                        </Text>
                                        {timeLabel && (
                                            <Text type="secondary" style={{ fontSize: 12 }}>
                                                <FieldTimeOutlined /> Ghi lúc {timeLabel}
                                            </Text>
                                        )}
                                    </Space>
                                    {parsed.weather && (
                                        <Tag color="blue">{parsed.weather}</Tag>
                                    )}
                                </div>
                                {parsed.manpower && (
                                    <Text type="secondary" style={{ display: 'block', fontSize: 13, marginBottom: 6 }}>
                                        <EnvironmentOutlined /> Nhân lực: {parsed.manpower}
                                    </Text>
                                )}
                                {parsed.activities && (
                                    <div style={{ marginBottom: 6 }}>
                                        <Text strong style={{ fontSize: 13 }}>Công việc: </Text>
                                        <Text>{parsed.activities}</Text>
                                    </div>
                                )}
                                {parsed.notes && (
                                    <div style={{ paddingTop: 6, borderTop: '1px dashed #f0f0f0' }}>
                                        <Text type="secondary" style={{ fontSize: 12, fontStyle: 'italic' }}>
                                            Ghi chú: {parsed.notes}
                                        </Text>
                                    </div>
                                )}
                            </Card>
                        );
                    }}
                />
            )}
        </div>
    );
};

export default ProjectDiary;
