export interface DocSection {
    title: string;
    content: string | string[];
    image?: string;
    subsections?: DocSection[];
    alert?: {
        type: 'info' | 'warning' | 'important' | 'tip' | 'caution';
        text: string;
    };
}

export interface UserGuide {
    id: string;
    title: string;
    description: string;
    sections: DocSection[];
}

export const docsData: UserGuide[] = [
    {
        id: 'accountant',
        title: 'Hướng Dẫn Sử Dụng Kế Toán',
        description: 'Tài liệu hướng dẫn quy trình quản lý kho, chi tiêu và dòng tiền cho bộ phận kế toán.',
        sections: [
            {
                title: '1. Đăng nhập hệ thống',
                content: [
                    'Truy cập link: http://localhost:5173/kt/dashboard',
                    'Sử dụng tài khoản: {user-email} / {mật-khẩu-đã-cấp}'
                ]
            },
            {
                title: '2. Tổng quan Dashboard',
                content: 'Trang Dashboard cung cấp cái nhìn tổng thể về tình hình vật tư, tài sản và dòng tiền của doanh nghiệp thông qua các con số thống kê và sơ đồ quy trình trực quan.',
                image: '/assets/docs/kt/kt_dashboard_1775272688097.png'
            },
            {
                title: '3. Quản lý Kho (Inventory)',
                content: 'Kế toán quản lý việc nhập và xuất vật tư để đảm bảo tính chính xác của tồn kho.',
                subsections: [
                    {
                        title: '3.1. Phiếu nhập kho (Stock In)',
                        content: 'Sử dụng khi có vật tư mới từ nhà cung cấp. Quy trình bao gồm chọn nhà phân phối, SKU và nhập đơn giá.',
                        image: '/assets/docs/kt/kt_phieu_nhap_kho_1775272710364.png'
                    },
                    {
                        title: '3.2. Phiếu xuất kho (Stock Out)',
                        content: 'Xuất cấp vật tư cho các đội thi công dựa trên mã Hành trình (Journey) để đảm bảo đúng định mức.',
                        image: '/assets/docs/kt/kt_phieu_xuat_kho_1775272720147.png'
                    }
                ]
            },
            {
                title: '4. Quản lý Chi (Expenditures)',
                content: 'Quy trình phê duyệt chi tiêu từ lúc yêu cầu đến khi xác nhận chuyển khoản thực tế.',
                subsections: [
                    {
                        title: '4.1. Danh sách yêu cầu chi',
                        content: 'Theo dõi trạng thái phiếu chi: Chờ duyệt, Đã duyệt, Đã chi hoặc Từ chối.',
                        image: '/assets/docs/kt/danh_sach_yeu_cau_chi_1775273061866.png'
                    },
                    {
                        title: '4.2. Biểu mẫu tạo yêu cầu',
                        content: 'Nhập đầy đủ loại yêu cầu, nội dung, số tiền, tài khoản nguồn và đính kèm chứng từ.',
                        image: '/assets/docs/kt/bieu_mau_tao_yeu_cau_chi_1775273070202.png'
                    },
                    {
                        title: '4.3. Xác nhận đã chi',
                        content: 'Sau khi chuyển tiền, kế toán nhập mã giao dịch và đính kèm biên lai để kết thúc quy trình.',
                        image: '/assets/docs/kt/xac_nhan_chi_tra_yeu_cau_1775273198253.png'
                    }
                ]
            },
            {
                title: '5. Theo dõi Thanh toán',
                content: 'Kiểm soát các khoản phải thu từ khách hàng, số tiền đã thu và cảnh báo quá hạn.',
                image: '/assets/docs/kt/kt_theo_doi_thanh_toan_1775272756897.png',
                alert: {
                    type: 'tip',
                    text: 'Luôn kiểm tra kỹ SKU và chứng từ đính kèm để quy trình phê duyệt diễn ra nhanh chóng.'
                }
            }
        ]
    },
    {
        id: 'supervisor',
        title: 'Hướng Dẫn Sử Dụng Giám Sát',
        description: 'Tài liệu hướng dẫn tác nghiệp tại công trình: ghi nhật ký, kiểm nhận vật tư và theo dõi lịch sử vận hành trên thiết bị di động.',
        sections: [
            {
                title: '1. Tổng quan Giao diện Mobile',
                content: 'Giao diện Giám sát được tối ưu hóa cho thiết bị di động, giúp người dùng dễ dàng thao tác ngay tại hiện trường. Dashboard cung cấp các chỉ số nhanh về dự án và các phím tắt truy cập tính năng.',
                image: '/assets/docs/gs/gs_dashboard_mobile.png',
                alert: {
                    type: 'info',
                    text: 'Sử dụng menu "Chuyển quyền nhanh" để truy cập giao diện này từ tài khoản của bạn.'
                }
            },
            {
                title: '2. Nhật ký Thi công & Hành trình',
                content: 'Đây là tính năng cốt lõi để ghi nhận tiến độ công việc hàng ngày. Giám sát có thể theo dõi danh sách các "Hành trình" đang diễn ra và cập nhật nhật ký cho từng công đoạn.',
                image: '/assets/docs/gs/gs_nhat_ky_mobile.png',
                subsections: [
                    {
                        title: '2.1. Danh sách Hành trình',
                        content: 'Xem tất cả các dự án đang thi công, trạng thái hiện tại và thời hạn xử lý (SLA).',
                    },
                    {
                        title: '2.2. Ghi nhật ký & Chụp ảnh',
                        content: 'Nhập nội dung công việc đã hoàn thành, tỷ lệ % và chụp ảnh hiện trường để làm bằng chứng nghiệm thu.',
                    }
                ]
            },
            {
                title: '3. Kiểm nhận Vật tư',
                content: 'Khi vật tư được giao đến công trình, Giám sát thực hiện đối soát số lượng thực tế so với phiếu xuất kho từ trung tâm.',
                image: '/assets/docs/gs/gs_vat_tu_mobile.png',
                alert: {
                    type: 'important',
                    text: 'Vui lòng kiểm tra kỹ số lượng và tình trạng bao bì trước khi xác nhận trên hệ thống.'
                }
            },
            {
                title: '4. Tra cứu Lịch sử Hoạt động',
                content: 'Theo dõi dòng sự kiện (timeline) của các tác vụ đã thực hiện. Tính năng này giúp kiểm soát các thay đổi và log vận hành gần đây một cách minh bạch.',
                image: '/assets/docs/gs/gs_lich_su_mobile.png'
            },
            {
                title: '5. Quản lý Tài khoản',
                content: 'Truy cập trang Cá nhân để xem hồ sơ, thay đổi cài đặt thông báo hoặc đăng xuất khỏi hệ thống.',
                image: '/assets/docs/gs/gs_ca_nhan_mobile.png'
            }
        ]
    }
];
