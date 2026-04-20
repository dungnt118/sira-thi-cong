import React, { useState, useEffect } from 'react';
import { 
  Card, Table, Button, Space, Typography, Tag, Divider, 
  Row, Col, Statistic, Form, Input, InputNumber, 
  Popconfirm, message, Skeleton, Empty 
} from 'antd';
import { 
  CalculatorOutlined, SaveOutlined, EditOutlined, 
  RollbackOutlined, DeleteOutlined, FileTextOutlined,
  CheckCircleOutlined, DollarOutlined, PlusOutlined
} from '@ant-design/icons';
import { useJourneyQuote } from '../../../hooks/journey/useJourneyQuote';

const { Text, Title } = Typography;
const { TextArea } = Input;

export interface Step05QuoteOrchestrationProps {
  journeyId: string;
  isEditable?: boolean;
  onEditStateChange?: (isEditing: boolean) => void;
}

const Step05QuoteOrchestration: React.FC<Step05QuoteOrchestrationProps> = ({ 
  journeyId, 
  isEditable = false,
  onEditStateChange 
}) => {
  const { 
    quotation, 
    lineItems, 
    loading, 
    saveQuotationAndItems, 
    syncFromEstimate 
  } = useJourneyQuote(journeyId);

  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (quotation || lineItems.length > 0) {
      form.setFieldsValue({
        notes: quotation?.notes,
        discount: quotation?.discount || 0,
        items: lineItems.map(item => ({
          ...item,
          key: (item as any)._id || (item as any).key || `item-${Math.random()}`
        }))
      });
    }
  }, [quotation, lineItems, form, isEditing]);

  const toggleEdit = () => {
    const newMode = !isEditing;
    setIsEditing(newMode);
    onEditStateChange?.(newMode);
  };

  const handleFinish = async (values: any) => {
    const items = values.items || [];
    const subtotal = items.reduce((sum: number, item: any) => sum + ((item.quantity || 0) * (item.unit_price || 0)), 0);
    const discount = values.discount || 0;
    const total = subtotal - discount;

    await saveQuotationAndItems({
      notes: values.notes,
      subtotal,
      discount,
      total,
      status: quotation?.status || 'draft'
    }, items.map((i: any) => ({
      item_name: i.item_name,
      unit: i.unit,
      quantity: i.quantity,
      unit_price: i.unit_price,
      line_total: (i.quantity || 0) * (i.unit_price || 0),
      note: i.note
    })));

    setIsEditing(false);
    onEditStateChange?.(false);
  };

  const formatVND = (val: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  if (loading && !quotation && lineItems.length === 0) {
    return <Card variant="borderless"><Skeleton active /></Card>;
  }

  const columns = [
    { title: 'Hạng mục', dataIndex: 'item_name', key: 'item_name' },
    { title: 'ĐVT', dataIndex: 'unit', key: 'unit', width: 80 },
    { title: 'SL', dataIndex: 'quantity', key: 'quantity', width: 80, align: 'right' as const },
    { 
      title: 'Đơn giá', 
      dataIndex: 'unit_price', 
      key: 'unit_price', 
      align: 'right' as const,
      render: (val: number) => formatVND(val) 
    },
    { 
      title: 'Thành tiền', 
      key: 'total', 
      align: 'right' as const,
      render: (_: any, record: any) => <Text strong>{formatVND((record.quantity || 0) * (record.unit_price || 0))}</Text> 
    },
  ];

  return (
    <div className="quote-orchestration">
      <Card 
        variant="borderless" 
        className="ky-card"
        title={
          <Space>
            <DollarOutlined />
            <Text>BẢNG ĐIỀU KHIỂN CHỐT GIÁ KHÁCH HÀNG</Text>
            {quotation && <Tag color="blue">{quotation.status === 'draft' ? 'NHÁP' : quotation.status?.toUpperCase()}</Tag>}
          </Space>
        }
        extra={isEditable && (
          <Space>
            {!isEditing ? (
              <Button type="primary" icon={<EditOutlined />} onClick={toggleEdit}>Điều chỉnh báo giá</Button>
            ) : (
              <Button icon={<RollbackOutlined />} onClick={toggleEdit}>Hủy thay đổi</Button>
            )}
          </Space>
        )}
      >
        {!quotation && !isEditing && (
          <Empty 
            description="Chưa có báo giá chính thức" 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            {isEditable && (
              <Button type="primary" onClick={toggleEdit}>Tạo báo giá mới</Button>
            )}
          </Empty>
        )}

        {(quotation || isEditing) && (
          <Form form={form} layout="vertical" onFinish={handleFinish}>
            <Row gutter={24}>
              <Col span={18}>
                {isEditing ? (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <Title level={5}>Chi tiết bảng giá</Title>
                      <Button 
                        size="small" 
                        icon={<CalculatorOutlined />} 
                        onClick={syncFromEstimate}
                        loading={loading}
                      >
                        Tải từ Dự toán kỹ thuật
                      </Button>
                    </div>
                    <Form.List name="items">
                      {(fields, { add, remove }) => (
                        <>
                          <Table
                            dataSource={form.getFieldValue('items')}
                            pagination={false}
                            size="small"
                            bordered
                            columns={[
                              {
                                title: 'Tên hạng mục',
                                key: 'item_name',
                                render: (_, __, index) => (
                                  <Form.Item name={[index, 'item_name']} noStyle rules={[{ required: true }]}>
                                    <Input placeholder="Tên" size="small" />
                                  </Form.Item>
                                )
                              },
                              {
                                title: 'SL',
                                key: 'quantity',
                                width: 80,
                                render: (_, __, index) => (
                                  <Form.Item name={[index, 'quantity']} noStyle>
                                    <InputNumber size="small" min={0} style={{ width: '100%' }} />
                                  </Form.Item>
                                )
                              },
                              {
                                title: 'Đơn giá',
                                key: 'unit_price',
                                width: 150,
                                render: (_, __, index) => (
                                  <Form.Item name={[index, 'unit_price']} noStyle>
                                    <InputNumber 
                                      size="small" 
                                      min={0} 
                                      style={{ width: '100%' }}
                                      formatter={(v: any) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    />
                                  </Form.Item>
                                )
                              },
                              {
                                title: 'Thành tiền',
                                key: 'total',
                                width: 120,
                                align: 'right',
                                render: (_, __, index) => (
                                  <Form.Item shouldUpdate noStyle>
                                    {({ getFieldValue }) => {
                                      const item = getFieldValue(['items', index]);
                                      return formatVND((item?.quantity || 0) * (item?.unit_price || 0));
                                    }}
                                  </Form.Item>
                                )
                              },
                              {
                                title: '',
                                key: 'action',
                                width: 40,
                                render: (_, __, index) => <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(index)} size="small" />
                              }
                            ]}
                            footer={() => (
                              <Button type="dashed" block onClick={() => add({ item_name: '', quantity: 1, unit_price: 0 })} icon={<PlusOutlined />}>
                                Thêm thủ công
                              </Button>
                            )}
                          />
                        </>
                      )}
                    </Form.List>
                  </div>
                ) : (
                  <Table 
                    dataSource={lineItems} 
                    columns={columns} 
                    pagination={false} 
                    size="small" 
                    bordered
                    rowKey="_id"
                    footer={() => (
                      <div style={{ textAlign: 'right' }}>
                        <Text strong>Tạm tính hàng hóa: {formatVND(quotation?.subtotal || 0)}</Text>
                      </div>
                    )}
                  />
                )}

                <Divider />
                <Form.Item label="Ghi chú & Điều khoản" name="notes">
                  <TextArea rows={4} readOnly={!isEditing} placeholder="Các ghi chú bổ sung cho khách hàng..." />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Card size="small" title="Tổng kết tài chính">
                  <Statistic 
                    title="Cộng tiền hàng" 
                    value={isEditing ? '...' : (quotation?.subtotal || 0)} 
                    formatter={(v: any) => typeof v === 'number' ? formatVND(v) : v}
                  />
                  <Divider style={{ margin: '12px 0' }} />
                  {isEditing ? (
                    <Form.Item label="Chiết khấu / Giảm giá" name="discount">
                      <InputNumber style={{ width: '100%' }} min={0} step={500000} />
                    </Form.Item>
                  ) : (
                    <Statistic 
                      title="Giảm giá" 
                      value={quotation?.discount || 0} 
                      valueStyle={{ color: '#cf1322' }}
                      formatter={(v: any) => formatVND(v)} 
                    />
                  )}
                  <Divider style={{ margin: '12px 0' }} />
                  <Statistic 
                    title="TỔNG THANH TOÁN" 
                    value={isEditing ? '...' : (quotation?.total || 0)} 
                    valueStyle={{ color: '#3f8600', fontWeight: 'bold' }}
                    formatter={(v: any) => typeof v === 'number' ? formatVND(v) : v}
                  />

                  {isEditing && (
                    <Button 
                      type="primary" 
                      block 
                      size="large" 
                      style={{ marginTop: 24 }} 
                      icon={<SaveOutlined />}
                      htmlType="submit"
                      loading={loading}
                    >
                      Lưu & Chốt báo giá
                    </Button>
                  )}
                </Card>

                {!isEditing && quotation && (
                  <Space direction="vertical" style={{ width: '100%', marginTop: 16 }}>
                    <Button block icon={<FileTextOutlined />}>Xuất PDF báo giá</Button>
                    <Button block icon={<CheckCircleOutlined />} type="dashed">Đánh dấu đã gửi khách</Button>
                  </Space>
                )}
              </Col>
            </Row>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default Step05QuoteOrchestration;
