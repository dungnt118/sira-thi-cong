import { Modal } from 'antd';

/**
 * Hiện thị Confirm Dialog dựa trên antd.Modal.confirm
 */
export const showConfirmDialog = (options: {
    message: string,
    title?: string,
    onSubmit?: () => void,
    onCancel?: () => void
}) => {
    Modal.confirm({
        title: options.title || 'Xác nhận',
        content: options.message,
        onOk: () => {
            options.onSubmit && options.onSubmit();
        },
        onCancel: () => {
            options.onCancel && options.onCancel();
        }
    });
    // Trả về một action object giả để dispatch nếu cần
    return { type: 'SHOW_CONFIRM_DIALOG', payload: options };
};
