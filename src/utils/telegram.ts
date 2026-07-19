import config from '@/services/config';

const escapeHtml = (text: string = ''): string => {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
};

export const sendTelegramNotification = async (
    action: 'create' | 'update' | 'approve' | 'reject' | 'pay',
    request: any
) => {
    const botToken = config.telegram_bot_token;
    const chatId = config.telegram_chat_id;

    if (!botToken || !chatId || botToken === 'YOUR_TELEGRAM_BOT_TOKEN' || chatId === 'YOUR_TELEGRAM_CHAT_ID') {
        console.warn('[Telegram] Bot token hoặc Chat ID chưa được cấu hình. Bỏ qua gửi thông báo.');
        return false;
    }

    // Xác định tiêu đề và icon hành động
    let title = '🔔 THÔNG BÁO YÊU CẦU CHI TIỀN';
    let actionText = '';
    
    switch (action) {
        case 'create':
            actionText = '➕ Tạo mới yêu cầu chi';
            break;
        case 'update':
            actionText = '✏️ Cập nhật yêu cầu chi';
            break;
        case 'approve':
            title = '✅ YÊU CẦU CHI ĐÃ ĐƯỢC DUYỆT';
            actionText = '👌 Phê duyệt yêu cầu';
            break;
        case 'reject':
            title = '❌ YÊU CẦU CHI BỊ TỪ CHỐI';
            actionText = '⛔ Từ chối phê duyệt / chi';
            break;
        case 'pay':
            title = '💰 HOÀN TẤT CHI TIỀN THÀNH CÔNG';
            actionText = '💸 Xác nhận đã chi tiền';
            break;
    }

    const prCode = escapeHtml(request.code || 'Chưa có mã');
    const amount = request.amount ? Number(request.amount).toLocaleString('vi-VN') + ' VND' : '0 VND';
    const content = escapeHtml(request.payment_content || 'Không có nội dung');
    const note = escapeHtml(request.request_note || request.payment_proof_note || '—');
    const requestedBy = escapeHtml(request.requested_by?.display_name || request.requested_by || '—');
    
    // Thụ hưởng
    const beneficiaryName = escapeHtml(request.beneficiary_name_snapshot || '—');
    const beneficiaryBank = escapeHtml(request.beneficiary_bank_name_snapshot || '—');
    const beneficiaryAccount = escapeHtml(request.beneficiary_account_number_snapshot || '—');

    // Tạo link thanh toán công khai
    const cleanDesc = request.code ? request.code.replace(/[^a-zA-Z0-9 -]/g, '') : 'CHUYEN KHOAN';
    const cleanName = request.beneficiary_name_snapshot ? request.beneficiary_name_snapshot.replace(/[^a-zA-Z0-9 ]/g, '').toUpperCase() : '';
    const publicPayUrl = `${window.location.origin}/public/pay/${request._id || 'temp'}?b=${encodeURIComponent(request.beneficiary_bank_name_snapshot || '')}&a=${encodeURIComponent(request.beneficiary_account_number_snapshot || '')}&n=${encodeURIComponent(cleanName)}&m=${request.amount || 0}&d=${encodeURIComponent(cleanDesc)}`;

    // Build message HTML
    let message = `<b>${title}</b>\n\n`;
    message += `📝 <b>Hành động</b>: ${actionText}\n`;
    message += `📌 <b>Mã phiếu</b>: <code>${prCode}</code>\n`;
    message += `💰 <b>Số tiền</b>: <b><span class="tg-spoiler">${amount}</span></b>\n`;
    message += `👤 <b>Người yêu cầu</b>: ${requestedBy}\n`;
    message += `🎯 <b>Nội dung chi</b>: <i>${content}</i>\n`;
    
    if (note && note !== '—') {
        message += `ℹ️ <b>Ghi chú</b>: ${note}\n`;
    }
    
    message += `🏦 <b>Thụ hưởng</b>: ${beneficiaryName} (${beneficiaryBank} - <code>${beneficiaryAccount}</code>)\n`;
    
    if (action === 'pay' && request.bank_transaction_ref) {
        message += `🔑 <b>Mã giao dịch</b>: <code>${escapeHtml(request.bank_transaction_ref)}</code>\n`;
    }

    if (request.beneficiary_account_number_snapshot) {
        message += `\n🔗 <b>Liên kết thanh toán nhanh</b>:\n<a href="${publicPayUrl}">Mở QR Code & Thanh toán</a>\n`;
    }

    try {
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML',
                disable_web_page_preview: false
            })
        });
        const resData = await response.json();
        if (resData.ok) {
            console.log(`[Telegram] Đã gửi thông báo thành công cho sự kiện ${action}: ${prCode}`);
        } else {
            console.error('[Telegram] Gửi tin nhắn thất bại:', resData);
        }
        return resData.ok;
    } catch (err) {
        console.error('[Telegram] Lỗi kết nối gửi thông báo:', err);
        return false;
    }
};
