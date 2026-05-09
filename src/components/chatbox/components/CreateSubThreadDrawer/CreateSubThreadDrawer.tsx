import { Button, Drawer, Form, Input, Radio, Select } from 'antd';
import { useEffect } from 'react';
import { AuthorizedUserSelect } from '@/components/authorizedusers/AuthorizedUser';
import {
    ConversationVisibility,
    type IConversationThread,
    type ICreateSubThreadInput,
    ThreadType,
} from '../../contentConversation.types';

interface ICreateSubThreadDrawerProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (input: ICreateSubThreadInput) => void;
    parentThread: IConversationThread | null;
    allowedThreadTypes?: ThreadType[];
    defaultVisibility?: ConversationVisibility;
}

const DEFAULT_TITLE = 'Luồng thảo luận';

export default function CreateSubThreadDrawer({
    open,
    onClose,
    onSubmit,
    parentThread,
    allowedThreadTypes = [ThreadType.Discussion],
    defaultVisibility = ConversationVisibility.Internal,
}: ICreateSubThreadDrawerProps) {
    const [form] = Form.useForm<ICreateSubThreadInput>();

    useEffect(() => {
        if (open) {
            form.setFieldsValue({
                title: DEFAULT_TITLE,
                thread_type: allowedThreadTypes[0] || ThreadType.Discussion,
                visibility: defaultVisibility,
                invite_users: [],
            });
        }
    }, [allowedThreadTypes, defaultVisibility, form, open]);

    const visibilityOptions = [
        { value: ConversationVisibility.Private, label: 'Riêng tư' },
        { value: ConversationVisibility.Internal, label: 'Nội bộ' },
        { value: ConversationVisibility.Public, label: 'Công khai' },
        { value: ConversationVisibility.Restricted, label: 'Hạn chế' },
    ];

    return (
        <Drawer
            title="Thêm luồng thảo luận"
            placement="right"
            width={420}
            open={open}
            onClose={onClose}
            destroyOnHidden
            footer={
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    <Button onClick={onClose}>Hủy</Button>
                    <Button type="primary" onClick={() => form.submit()}>Tạo luồng</Button>
                </div>
            }
        >
            <p style={{ color: '#8c8c8c', fontSize: 12, marginBottom: 16 }}>
                Luồng con sẽ được tạo dưới luồng hiện tại {parentThread?.title ? `"${parentThread.title}"` : ''}.
            </p>

            <Form form={form} layout="vertical" onFinish={onSubmit}>
                <Form.Item
                    name="title"
                    label="Tên luồng"
                    rules={[{ required: true, message: 'Vui lòng nhập tên luồng.' }]}
                >
                    <Input placeholder={DEFAULT_TITLE} maxLength={120} showCount />
                </Form.Item>

                {allowedThreadTypes.length > 1 && (
                    <Form.Item name="thread_type" label="Loại luồng">
                        <Select
                            options={[
                                { value: ThreadType.Discussion, label: 'Thảo luận' },
                                { value: ThreadType.Private, label: 'Ghi chú nội bộ' },
                                { value: ThreadType.Escalation, label: 'Escalation' },
                                { value: ThreadType.External, label: 'External' },
                            ].filter((item) => allowedThreadTypes.includes(item.value))}
                        />
                    </Form.Item>
                )}

                {allowedThreadTypes.length <= 1 && (
                    <Form.Item name="thread_type" initialValue={allowedThreadTypes[0] || ThreadType.Discussion} hidden>
                        <Input />
                    </Form.Item>
                )}

                <Form.Item name="visibility" label="Phạm vi hiển thị">
                    <Radio.Group options={visibilityOptions} />
                </Form.Item>

                <Form.Item name="invite_users" label="Mời thành viên ban đầu">
                    <AuthorizedUserSelect allowMultiple placeholder="Chọn thành viên cần mời" />
                </Form.Item>
            </Form>
        </Drawer>
    );
}
