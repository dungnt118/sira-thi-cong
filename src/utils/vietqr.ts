export interface BankInfo {
    bin: string;
    shortName: string;
    name: string;
    logo?: string;
}

// Danh sách các ngân hàng Việt Nam theo Napas
export const SUPPORTED_BANKS: BankInfo[] = [
    { bin: '970436', shortName: 'VCB', name: 'Vietcombank (Ngoại Thương)' },
    { bin: '970407', shortName: 'TCB', name: 'Techcombank (Kỹ Thương)' },
    { bin: '970422', shortName: 'MB', name: 'MBBank (Quân Đội)' },
    { bin: '970415', shortName: 'CTG', name: 'VietinBank (Công Thương)' },
    { bin: '970418', shortName: 'BIDV', name: 'BIDV (Đầu tư & Phát triển)' },
    { bin: '970416', shortName: 'ACB', name: 'ACB (Á Châu)' },
    { bin: '970432', shortName: 'VPB', name: 'VPBank (Thịnh Vượng)' },
    { bin: '970423', shortName: 'TPB', name: 'TPBank (Tiên Phong)' },
    { bin: '970403', shortName: 'STB', name: 'Sacombank (Sài Gòn Thương Tín)' },
    { bin: '970405', shortName: 'VBA', name: 'Agribank (Nông nghiệp)' },
    { bin: '970443', shortName: 'SHB', name: 'SHB (Sài Gòn - Hà Nội)' },
    { bin: '970437', shortName: 'HDB', name: 'HDBank (Phát triển TP.HCM)' },
    { bin: '970441', shortName: 'VIB', name: 'VIB (Quốc tế)' },
    { bin: '970426', shortName: 'MSB', name: 'MSB (Hàng Hải)' },
    { bin: '970440', shortName: 'SEAB', name: 'SeABank (Đông Nam Á)' },
    { bin: '970448', shortName: 'OCB', name: 'OCB (Phương Đông)' },
    { bin: '970431', shortName: 'EIB', name: 'Eximbank (Xuất Nhập Khẩu)' },
    { bin: '970449', shortName: 'LPB', name: 'LPBank (Bưu điện Liên Việt)' },
    { bin: '970412', shortName: 'PVB', name: 'PVcomBank (Đại chúng)' },
    { bin: '970409', shortName: 'BAB', name: 'Bac A Bank (Bắc Á)' },
    { bin: '970406', shortName: 'DAB', name: 'DongA Bank (Đông Á)' },
    { bin: '970419', shortName: 'NCB', name: 'NCB (Quốc Dân)' },
    { bin: '970428', shortName: 'NAB', name: 'Nam A Bank (Nam Á)' },
    { bin: '970454', shortName: 'VAB', name: 'Viet A Bank (Việt Á)' },
    { bin: '970429', shortName: 'SCB', name: 'SCB (Sài Gòn)' },
    { bin: '970442', shortName: 'ABB', name: 'ABBANK (An Bình)' },
    { bin: '970452', shortName: 'KIENLONGBANK', name: 'Kienlongbank (Kiên Long)' },
    { bin: '970457', shortName: 'WOORI', name: 'Woori Bank Việt Nam' },
    { bin: '970458', shortName: 'UOB', name: 'UOB Việt Nam' },
    { bin: '970408', shortName: 'PGBANK', name: 'PGBank (Xăng dầu Petrolimex)' },
    { bin: '970439', shortName: 'BAOVIETBANK', name: 'BaoViet Bank (Bảo Việt)' },
    { bin: '970425', shortName: 'ABBank', name: 'An Binh Bank' },
];

/**
 * Loại bỏ dấu tiếng Việt và các ký tự đặc biệt không phù hợp trong chuỗi VietQR
 */
export function removeVietnameseTones(str: string): string {
    if (!str) return '';
    let result = str;
    result = result.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    result = result.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    result = result.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    result = result.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    result = result.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    result = result.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    result = result.replace(/đ/g, "d");
    result = result.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    result = result.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    result = result.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    result = result.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    result = result.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    result = result.replace(/Ỳ|Ý|Ạ|Ỷ|Ỹ/g, "Y");
    result = result.replace(/Đ/g, "D");
    // Chỉ giữ lại chữ cái, số, khoảng trắng, gạch ngang, gạch dưới
    result = result.replace(/[^a-zA-Z0-9\s-_]/g, "");
    return result;
}

/**
 * Tính toán CRC-16 CCITT (Đa thức 0x1021, Giá trị khởi tạo 0xFFFF)
 */
export function calculateCRC16(str: string): string {
    let crc = 0xFFFF;
    for (let c = 0; c < str.length; c++) {
        const charCode = str.charCodeAt(c);
        crc ^= (charCode << 8);
        for (let i = 0; i < 8; i++) {
            if ((crc & 0x8000) !== 0) {
                crc = ((crc << 1) ^ 0x1021) & 0xFFFF;
            } else {
                crc = (crc << 1) & 0xFFFF;
            }
        }
    }
    const crcHex = crc.toString(16).toUpperCase();
    return crcHex.padStart(4, '0');
}

/**
 * Sinh chuỗi mã VietQR theo chuẩn EMVCo
 */
export interface VietQRParams {
    bankBin: string; // Mã BIN ngân hàng
    accountNo: string; // Số tài khoản thụ hưởng
    amount?: number; // Số tiền (nếu có)
    description?: string; // Nội dung chuyển khoản
}

export function generateVietQRString({ bankBin, accountNo, amount, description }: VietQRParams): string {
    const formatField = (id: string, value: string): string => {
        const len = value.length.toString().padStart(2, '0');
        return `${id}${len}${value}`;
    };

    // 00: Payload Format Indicator (Cố định "01")
    let emvString = formatField('00', '01');
    
    // 01: Point of Initiation Method (11: Tĩnh, 12: Động có số tiền)
    emvString += formatField('01', amount ? '12' : '11');

    // 38: Consumer Merchant Information (Thông tin ngân hàng thụ hưởng)
    const guidField = formatField('00', 'A000000727'); // GUID Napas
    
    const bankBinField = formatField('00', bankBin);
    const accountNoField = formatField('01', accountNo);
    const merchantInfoSubField = `${bankBinField}${accountNoField}`;
    const merchantInfoField = formatField('01', merchantInfoSubField);
    
    const serviceField = formatField('02', '01'); // 01: Chuyển tiền nhanh đến tài khoản
    
    const tag38Value = `${guidField}${merchantInfoField}${serviceField}`;
    emvString += formatField('38', tag38Value);

    // 53: Transaction Currency (704: VND)
    emvString += formatField('53', '704');

    // 54: Transaction Amount
    if (amount && amount > 0) {
        emvString += formatField('54', Math.floor(amount).toString());
    }

    // 58: Country Code (VN)
    emvString += formatField('58', 'VN');

    // 62: Additional Data Field Template (Nội dung chuyển khoản)
    if (description) {
        const cleanDesc = removeVietnameseTones(description).substring(0, 25);
        const descField = formatField('08', cleanDesc);
        emvString += formatField('62', descField);
    }

    // 63: CRC-16
    emvString += '6304';
    const crc = calculateCRC16(emvString);
    emvString += crc;

    return emvString;
}

/**
 * Nhận diện ngân hàng thông minh từ chuỗi tên nhập tự do
 */
export function findBank(bankNameStr?: string): BankInfo | undefined {
    if (!bankNameStr) return undefined;
    
    // Chuẩn hóa chuỗi tìm kiếm (không dấu, viết liền, chữ thường)
    const cleanStr = removeVietnameseTones(bankNameStr).toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // 1. Khớp chính xác hoặc chứa ShortName (vd: "vcb", "tcb"...)
    let match = SUPPORTED_BANKS.find(b => {
        const short = b.shortName.toLowerCase();
        return cleanStr === short || cleanStr.startsWith(short) || cleanStr.endsWith(short);
    });
    if (match) return match;

    // 2. Các quy tắc map thủ công dựa trên từ khóa phổ biến
    const rules = [
        { keywords: ['vietcom', 'vcb', 'ngoai thuong', 'ngoaituong'], target: 'VCB' },
        { keywords: ['techcom', 'tcb', 'ky thuong', 'kythuong'], target: 'TCB' },
        { keywords: ['vietin', 'ctg', 'cong thuong', 'vtb'], target: 'CTG' },
        { keywords: ['agri', 'vba', 'nong nghiep', 'nongnghiep'], target: 'VBA' },
        { keywords: ['quan doi', 'quandoi', 'mb', 'mbbank'], target: 'MB' },
        { keywords: ['dau tu', 'dautu', 'bidv', 'bid'], target: 'BIDV' },
        { keywords: ['thinh vuong', 'thinhvuong', 'vpbank', 'vpb'], target: 'VPB' },
        { keywords: ['tien phong', 'tienphong', 'tpbank', 'tpb'], target: 'TPB' },
        { keywords: ['sai gon thuong tin', 'sacom', 'stb'], target: 'STB' },
        { keywords: ['a chau', 'achau', 'acb'], target: 'ACB' },
        { keywords: ['buu dien lien viet', 'lpbank', 'lpb', 'lienviet'], target: 'LPB' },
        { keywords: ['hang hai', 'hanghai', 'msb'], target: 'MSB' },
        { keywords: ['phuong dong', 'phuongdong', 'ocb'], target: 'OCB' },
        { keywords: ['quoc te', 'quocte', 'vib'], target: 'VIB' },
        { keywords: ['sai gon', 'saigon', 'shb'], target: 'SHB' },
        { keywords: ['phat trien', 'hdbank', 'hdb'], target: 'HDB' },
        { keywords: ['dong nam a', 'dongnama', 'seabank', 'seab'], target: 'SEAB' },
        { keywords: ['xuat nhap khau', 'exim', 'eib'], target: 'EIB' },
        { keywords: ['dai chung', 'pvcom', 'pvb'], target: 'PVB' },
        { keywords: ['bac a', 'baca', 'bab'], target: 'BAB' },
        { keywords: ['dong a', 'donga', 'dab'], target: 'DAB' },
        { keywords: ['quoc dan', 'quocdan', 'ncb'], target: 'NCB' },
        { keywords: ['nam a', 'nama', 'nab'], target: 'NAB' },
    ];

    for (const rule of rules) {
        if (rule.keywords.some(keyword => cleanStr.includes(keyword.replace(/\s+/g, '')))) {
            const found = SUPPORTED_BANKS.find(b => b.shortName === rule.target);
            if (found) return found;
        }
    }

    // 3. Khớp mờ theo Tên đầy đủ
    match = SUPPORTED_BANKS.find(b => {
        const fullName = removeVietnameseTones(b.name).toLowerCase().replace(/[^a-z0-9]/g, '');
        return cleanStr.includes(fullName) || fullName.includes(cleanStr);
    });
    
    return match;
}
