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
        description: 'Tài liệu hướng dẫn tác nghiệp tại công trình: ghi nhật ký và kiểm nhận vật tư trên thiết bị di động.',
        sections: [
            {
                title: '1. Truy cập via Mobile',
                content: 'Sau khi đăng nhập, sử dụng tính năng "Chuyển quyền nhanh" trong menu cá nhân để truy cập giao diện Giám sát.',
                image: '/assets/docs/gs/gs_dashboard_1775274718818.png'
            },
            {
                title: '2. Nhật ký thi công',
                content: 'Ghi nhận tiến độ công việc hàng ngày ngay tại hiện trường.',
                subsections: [
                    {
                        title: '2.1. Cập nhật tiến độ',
                        content: 'Nhập tỷ lệ % hoàn thành và mô tả nội dung công việc đã thực hiện.',
                        image: '/assets/docs/gs/gs_diary_form_1775274766098.png'
                    },
                    {
                        title: '2.2. Hình ảnh hiện trường',
                        content: 'Chụp ảnh thực tế các hạng mục thi công để làm bằng chứng chất lượng.',
                        image: '/assets/docs/gs/gs_project_overview_1775274739388.png'
                    }
                ]
            },
            {
                title: '3. Kiểm nhận vật tư',
                content: 'Đối soát vật tư khi xe từ kho giao đến công trình.',
                image: '/assets/docs/gs/gs_material_receive_modal_1775274808082.png',
                alert: {
                    type: 'important',
                    text: 'Giám sát cần ký xác nhận điện tử và chụp ảnh bao bì/nhãn mác vật tư khi kiểm nhận.'
                }
            },
            {
                title: '4. Quản lý Cá nhân',
                content: 'Quản lý hồ sơ cá nhân và thiết lập tài khoản trực tiếp trên ứng dụng.',
                image: '/assets/docs/gs/gs_profile_page_1775274837349.png'
            }
        ]
    }
];
