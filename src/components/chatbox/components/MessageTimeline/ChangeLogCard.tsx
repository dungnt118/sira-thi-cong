import { DeleteOutlined, SettingOutlined, StarOutlined } from '@ant-design/icons';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { IDataChangedDetail, IContentChatboxMessage } from '../../contentConversation.types';
import { SystemChangeType } from '../../contentConversation.types';
import { formatMessageTime, parseJsonSafe } from '../../utils/chatboxUtils';
import './ChangeLogCard.less';

interface IChangeLogCardProps {
    message: IContentChatboxMessage;
}

export default function ChangeLogCard({ message }: IChangeLogCardProps) {
    const changeType = message.system?.change_type ?? message.system_change_type;
    const title = (() => {
        switch (changeType) {
            case SystemChangeType.Created:
                return <><StarOutlined /> Nội dung đã được tạo</>;
            case SystemChangeType.Deleted:
                return <><DeleteOutlined /> Nội dung đã bị xóa</>;
            default:
                return <><SettingOutlined /> Nội dung đã được cập nhật</>;
        }
    })();

    const isDeleted = changeType === SystemChangeType.Deleted;
    const data: IDataChangedDetail[] = message.system?.changes || [];
    const changesCount = typeof message.changes_count === 'number' ? message.changes_count : data.length;
    const detailContentHtml = message.content
        ? (message.content.includes('<') ? message.content : message.content.replace(/\n/g, '<br />'))
        : '';

    const columns: ColumnsType<IDataChangedDetail> = [
        { title: 'Trường', dataIndex: 'label', key: 'label', width: '30%', render: (text: string) => <strong>{text}</strong> },
        {
            title: isDeleted ? 'Giá trị đã xóa' : 'Giá trị cũ',
            dataIndex: 'ori',
            key: 'ori',
            width: isDeleted ? '70%' : '35%',
            render: (text: string) => {
                const value = parseJsonSafe(text);
                return <span>{value ? String(value) : '—'}</span>;
            },
        },
        ...(isDeleted ? [] : [{
            title: 'Giá trị mới',
            dataIndex: 'current',
            key: 'current',
            width: '35%',
            render: (text: string) => {
                const value = parseJsonSafe(text);
                return <span style={{ color: '#27ae60', fontWeight: 500 }}>{value ? String(value) : '—'}</span>;
            },
        }]),
    ];

    return (
        <div className="changelog-card">
            <div className="changelog-card-title">
                <span>{title}</span>
                {changesCount > 0 && <span className="changelog-card-count">{changesCount} thay đổi</span>}
            </div>

            {data.length > 0 ? (
                <Table
                    dataSource={data}
                    columns={columns}
                    rowKey={(record) => record.id}
                    pagination={false}
                    size="small"
                    bordered
                    className="changelog-table"
                />
            ) : detailContentHtml.trim() ? (
                <div className="changelog-card-content" dangerouslySetInnerHTML={{ __html: detailContentHtml }} />
            ) : (
                <div className="changelog-card-empty">Không có thông tin chi tiết về thay đổi.</div>
            )}

            <div className="changelog-card-footer">
                <span className="changelog-meta">{message.createdBy} • {formatMessageTime(message.createdAt)}</span>
            </div>
        </div>
    );
}
