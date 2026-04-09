import React from 'react';
import { Drawer } from 'antd';
import type { IJourney, ICreateJourneyInput } from '../../services/core-contracts/types/journey.types';
import JourneyForm from './JourneyForm';

interface JourneyUpsertDrawerProps {
    open: boolean;
    mode: 'pm' | 'sale';
    journey?: IJourney | null;
    initialValues?: Partial<ICreateJourneyInput>;
    saving?: boolean;
    currentUsername?: string;
    onCancel: () => void;
    onSubmit: (values: ICreateJourneyInput) => Promise<void>;
}

const JourneyUpsertDrawer: React.FC<JourneyUpsertDrawerProps> = ({
    open,
    mode,
    journey,
    initialValues,
    saving = false,
    currentUsername,
    onCancel,
    onSubmit,
}) => {
    const isEdit = !!journey?._id;
    const title = mode === 'sale'
        ? (isEdit ? 'Cập nhật yêu cầu dịch vụ' : 'Tạo yêu cầu dịch vụ')
        : (isEdit ? 'Chỉnh sửa công trình' : 'Tạo công trình mới');

    return (
        <Drawer
            title={title}
            width={720}
            onClose={onCancel}
            open={open}
            maskClosable={false}
            destroyOnClose
            placement="right"
        >
            <JourneyForm
                mode={mode}
                initialValues={(journey || initialValues || {}) as any}
                onSubmit={onSubmit}
                onCancel={onCancel}
                isLoading={saving}
                currentUsername={currentUsername}
            />
        </Drawer>
    );
};

export default JourneyUpsertDrawer;
