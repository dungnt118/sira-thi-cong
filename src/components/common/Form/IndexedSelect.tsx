import React, { useState } from 'react';
import { Select, Spin, Empty } from 'antd';
import type { SelectProps } from 'antd';
import { useAppDispatch } from '@/store/hooks';
import { search_indexed_content } from '@/store/actions/schemas/schemas.action';
import _ from 'lodash';

interface IndexedSelectProps extends Omit<SelectProps, 'options' | 'loading'> {
    schema: string;
    propType?: 'ObjectId' | 'Lookup';
    placeholder?: string;
}

const IndexedSelect: React.FC<IndexedSelectProps> = ({ 
    schema, 
    propType = 'ObjectId',
    placeholder = 'Chọn...', 
    value, 
    onChange, 
    ...rest 
}) => {
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);
    const [hasFetched, setHasFetched] = useState(false);
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
                    value: propType === 'Lookup' ? (item.code || item.itemId || item._id) : (item.itemId || item._id),
                    label: item.title || item.code || item.name || item._id
                }));
                setOptions(newOptions);
                setHasFetched(true);
            }
        } catch (error) {
            console.error(`Error fetching suggestions for schema ${schema}:`, error);
        } finally {
            setLoading(false);
        }
    };

    const handleDropdownVisibleChange = (open: boolean) => {
        if (open && !hasFetched) {
            fetchSuggestions();
        }
    };

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
            onDropdownVisibleChange={handleDropdownVisibleChange}
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
