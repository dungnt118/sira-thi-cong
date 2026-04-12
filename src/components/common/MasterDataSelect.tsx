import React, { useState, useEffect } from 'react';
import { Select, SelectProps, Spin } from 'antd';
import { masterDataItemService } from '../../services/core-contracts/services/masterDataItem.service';
import { IMasterDataItem } from '../../services/core-contracts/types/masterDataItem.types';

export interface MasterDataSelectProps extends Omit<SelectProps, 'options'> {
    categoryCode?: string;
    categoryId?: string;
}

export const MasterDataSelect: React.FC<MasterDataSelectProps> = ({ 
    categoryCode, 
    categoryId, 
    placeholder = "Chọn...",
    ...props 
}) => {
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState<{ label: string; value: string }[]>([]);

    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            try {
                const filter: any = {
                    group: {
                        op: 'AND',
                        children: []
                    }
                };

                if (categoryCode) {
                    filter.group.children.push({ id: 'categoryId.code', operation: '==', value: categoryCode });
                }
                if (categoryId) {
                    filter.group.children.push({ id: 'categoryId', operation: '==', value: categoryId });
                }

                const res = await masterDataItemService.queryMasterDataItemsDto(filter);
                if (res.data) {
                    setOptions(res.data.map((item: IMasterDataItem) => ({
                        label: item.label || '',
                        value: item._id
                    })));
                }
            } catch (error) {
                console.error('Failed to fetch master data items:', error);
            } finally {
                setLoading(false);
            }
        };

        if (categoryCode || categoryId) {
            fetchItems();
        }
    }, [categoryCode, categoryId]);

    return (
        <Select
            loading={loading}
            placeholder={placeholder}
            options={options}
            notFoundContent={loading ? <Spin size="small" /> : null}
            showSearch
            filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            {...props}
        />
    );
};
