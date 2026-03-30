import { message, notification } from 'antd';

/**
 * Hiện thị message dựa trên antd.message hoặc antd.notification.
 */
export const showMessage = (options: {
    message: string,
    variant?: 'success' | 'error' | 'warning' | 'info',
    duration?: number,
    title?: string
}) => {
    const key = options.variant || 'info';
    
    // Nếu có title, ta dùng notification cho trang trọng (giống Fuse dialog)
    if (options.title) {
        notification[key]({
            message: options.title,
            description: options.message,
            duration: options.duration || 4.5
        });
    } else {
        // Nếu không có title, ta dùng message.toast
        message[key](options.message, options.duration || 3);
    }
    
    // Trả về action giả để tránh dispatch error
    return { type: 'SHOW_MESSAGE', payload: options };
};

export const hideMessage = () => {
    return { type: 'HIDE_MESSAGE' };
};
