const fs = require('fs');
const path = require('path');

const steps = [
  { code: '01Info', title: 'Thông tin khách hàng', roles: ['Sale'] },
  { code: '02Consult', title: 'Liên hệ / Tư vấn', roles: ['Sale'] },
  { code: '03Survey', title: 'Khảo sát', roles: ['Kỹ thuật'] },
  { code: '04Solution', title: 'Xây Dựng Giải pháp', roles: ['Kỹ thuật', 'Sale'] },
  { code: '05Quote', title: 'Báo giá', roles: ['Sale'] },
  { code: '06Contract', title: 'Làm hợp đồng', roles: ['Sale', 'PM'] },
  { code: '07Advance', title: 'Tạm ứng', roles: ['Kế toán'] },
  { code: '08Construct', title: 'Triển khai', roles: ['Giám sát'] },
  { code: '09Acceptance', title: 'Nghiệm Thu', roles: ['Giám sát', 'Kỹ thuật'] },
  { code: '10Payment', title: 'Thanh Toán', roles: ['Kế toán'] },
  { code: '11Maintain', title: 'Bảo trì', roles: ['Kỹ thuật'] },
  { code: '12Warranty', title: 'Bảo hành', roles: ['Kỹ thuật'] },
  { code: '13Care', title: 'CSKH sau công trình', roles: ['Sale'] }
];

const dir = path.join(__dirname, 'src/pages/shared/JourneySteps');
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

steps.forEach(step => {
  const content = `import React from 'react';
import { Card, Form, Input, Button, Result, Typography, Divider, Space } from 'antd';
import { EditOutlined, SaveOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

export interface Step${step.code}Props {
    journeyId: string;
    isEditable?: boolean;
    onSave?: (data: any) => void;
}

export const Step${step.code}: React.FC<Step${step.code}Props> = ({ journeyId, isEditable = false, onSave }) => {
    const [form] = Form.useForm();

    const handleFinish = (values: any) => {
        if (onSave) onSave(values);
    };

    if (!isEditable) {
        return (
            <Card title="Chi tiết bước: ${step.title} (${step.roles.join(', ')})" bordered={false} className="ky-card">
                <Result
                    status="info"
                    title="${step.title}"
                    subTitle="Thông tin chi tiết của bước ${step.title} ở chế độ xem (Readonly)."
                />
            </Card>
        );
    }

    return (
        <Card title="Thực hiện: ${step.title}" bordered={false} className="ky-card">
            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Divider orientation="left">Thông tin cơ bản</Divider>
                <Form.Item label="Ghi chú / Đánh giá" name="notes" rules={[{ required: true }]}>
                    <TextArea rows={4} placeholder="Nhập ghi chú hoặc kết quả thực hiện của công việc này..." />
                </Form.Item>
                <Space style={{ marginTop: 16 }}>
                    <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>Lưu kết quả</Button>
                    <Button>Hủy</Button>
                </Space>
            </Form>
        </Card>
    );
};

export default Step${step.code};
`;

  fs.writeFileSync(path.join(dir, `Step${step.code}.tsx`), content);
});

const rendererContent = `import React from 'react';
import { Empty } from 'antd';
${steps.map(s => `import Step${s.code} from './Step${s.code}';`).join('\n')}

export interface JourneyStepRendererProps {
    stepCode: string;
    journeyId: string;
    isEditable?: boolean;
}

export const JourneyStepRenderer: React.FC<JourneyStepRendererProps> = ({ stepCode, journeyId, isEditable = false }) => {
    switch (stepCode) {
${steps.map((s, index) => `        case 'S${(index + 1).toString().padStart(2, '0')}_${s.code.substring(2).toUpperCase() === 'CONSTRUCT' ? 'CONSTRUCT' : s.code.substring(2).toUpperCase()}':\n            return <Step${s.code} journeyId={journeyId} isEditable={isEditable} />;`).join('\n').replace(/_INFO/g, '_INFO').replace(/_CONSULT/g, '_CONSULT').replace(/_SURVEY/g, '_SURVEY').replace(/_SOLUTION/g, '_SOLUTION').replace(/_QUOTE/g, '_QUOTE').replace(/_CONTRACT/g, '_CONTRACT').replace(/_ADVANCE/g, '_ADVANCE').replace(/_CONSTRUCT/g, '_CONSTRUCT').replace(/_ACCEPTANCE/g, '_ACCEPTANCE').replace(/_PAYMENT/g, '_PAYMENT').replace(/_MAINTAIN/g, '_MAINTAIN').replace(/_WARRANTY/g, '_WARRANTY').replace(/_CARE/g, '_CARE')}
        default:
            return <Empty description="Component cho bước này đang được phát triển" />;
    }
};

export default JourneyStepRenderer;
`;
// Let's refine the stepCode to match the defined enum 
// S01_INFO, S02_CONSULT, S03_SURVEY, S04_SOLUTION, S05_QUOTE, S06_CONTRACT, S07_ADVANCE, S08_CONSTRUCT, S09_ACCEPTANCE, S10_PAYMENT, S11_MAINTAIN, S12_WARRANTY, S13_CARE

fs.writeFileSync(path.join(dir, 'JourneyStepRenderer.tsx'), rendererContent);
console.log('Created 13 components and renderer.');
