import React, { useState, useEffect } from 'react';
import { Select, Spin, Empty } from 'antd';
import type { SelectProps } from 'antd';
import { useAppDispatch } from '@/store/hooks';
import { search_indexed_content } from '@/store/actions/schemas/schemas.action';
import type { IndexedContentItem } from '@/types/apis/ApiResponse';
import _ from 'lodash';

interface IndexedSelectProps extends Omit<SelectProps, 'options' | 'loading'> {
    schema: string;
    placeholder?: string;
}

const IndexedSelect: React.FC<IndexedSelectProps> = ({ 
    schema, 
    placeholder = 'Chọn...', 
    value, 
    onChange, 
    ...rest 
}) => {
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState<{ value: string; label: string }[]>([]);

    const fetchSuggestions = async (key: string = '') => {
        setLoading(true);
        try {
            const res = await dispatch(search_indexed_content({
                schemas: [schema],
                key,
                limit: 20
            }));
            
            if (res?.data) {
                const newOptions = res.data.map((item: any) => ({
                    value: item.itemId || item._id,
                    label: item.title || item.code || item.name || item._id
                }));
                setOptions(newOptions);
            }
        } catch (error) {
            console.error(`Error fetching suggestions for schema ${schema}:`, error);
        } finally {
            setLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        fetchSuggestions();
    }, [schema]);

    const handleSearch = _.debounce((val: string) => {
        fetchSuggestions(val);
    }, 300);

    return (
        <Select
            showSearch
            value={value}
            placeholder={placeholder}
            defaultActiveFirstOption={false}
            showArrow={true}
            filterOption={false}
            onSearch={handleSearch}
            onChange={onChange}
            notFoundContent={loading ? <Spin size="small" /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
            loading={loading}
            {...rest}
        >
            {options.map(opt => (
                <Select.Option key={opt.value} value={opt.value}>
                    {opt.label}
                </Select.Option>
            ))}
        </Select>
    );
};

export default IndexedSelect;
