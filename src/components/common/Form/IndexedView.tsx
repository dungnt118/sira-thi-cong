import React, { useState, useEffect } from 'react';
import { Tag, Spin } from 'antd';
import { useAppDispatch } from '@/store/hooks';
import { get_indexed_content } from '@/store/actions/schemas/schemas.action';
import type { IndexedContentItem } from '@/types/apis/ApiResponse';

interface IndexedViewProps {
    schema: string;
    value?: string;
    idxValue?: IndexedContentItem;
    color?: string;
}

const IndexedView: React.FC<IndexedViewProps> = ({ 
    schema, 
    value, 
    idxValue, 
    color = 'blue' 
}) => {
    const dispatch = useAppDispatch();
    const [label, setLabel] = useState<string | undefined>(idxValue?.title || idxValue?.code);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (idxValue?.title || idxValue?.code) {
            setLabel(idxValue.title || idxValue.code);
            return;
        }

        if (value) {
            const fetchLabel = async () => {
                setLoading(true);
                try {
                    const res = await dispatch(get_indexed_content(schema, [value], true));
                    if (res?.data && res.data.length > 0) {
                        const item = res.data[0];
                        setLabel(item.title || item.code || value);
                    } else {
                        setLabel(value);
                    }
                } catch (error) {
                    console.error(`Error fetching label for id ${value} in schema ${schema}:`, error);
                    setLabel(value);
                } finally {
                    setLoading(false);
                }
            };
            fetchLabel();
        } else {
            setLabel('—');
        }
    }, [value, idxValue, schema]);

    if (loading) return <Spin size="small" />;
    
    return (
        <Tag color={color}>
            {label}
        </Tag>
    );
};

export default IndexedView;
