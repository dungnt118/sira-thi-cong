import React, { useState, useEffect } from 'react';
import { Select, SelectProps, Spin } from 'antd';
import { masterDataItemService } from '../../services/core-contracts/services/masterDataItem.service';
import { IMasterDataItem, MasterDataItemCategoryEnum } from '../../services/core-contracts/types/masterDataItem.types';

export interface MasterDataSelectProps extends Omit<SelectProps, 'options'> {
    category?: MasterDataItemCategoryEnum;
    /** @deprecated Use category instead */
    categoryCode?: string;
    /** @deprecated Use category instead */
    categoryId?: string;
}

export const MasterDataSelect: React.FC<MasterDataSelectProps> = ({ 
    category,
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
                        children: [
                            { id: 'isActive', operation: '==', value: true }
                        ]
                    }
                };

                if (category) {
                    filter.group.children.push({ id: 'category', operation: '==', value: category });
                } else if (categoryCode) {
                    // Backwards compatibility if needed, but since the contract changed to enum, 
                    // we should probably just use the code as the enum value
                    filter.group.children.push({ id: 'category', operation: '==', value: categoryCode });
                } else if (categoryId) {
                    // This might not work anymore if categoryId was removed from schema
                    filter.group.children.push({ id: 'category', operation: '==', value: categoryId });
                }

                const res = await masterDataItemService.queryContent(filter);
                if (res.data) {
                    setOptions(res.data.map((item: IMasterDataItem) => ({
                        label: item.label || '',
                        value: item.value || item._id
                    })));
                }
            } catch (error) {
                console.error('Failed to fetch master data items:', error);
            } finally {
                setLoading(false);
            }
        };

        if (category || categoryCode || categoryId) {
            fetchItems();
        }
    }, [category, categoryCode, categoryId]);

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
