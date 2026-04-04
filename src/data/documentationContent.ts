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

export interface GuideDocument {
    id: string;
    title: string;
    description: string;
    sections: DocSection[];
}

export interface GuideCategory {
    id: string;
    title: string;
    description: string;
    documents: GuideDocument[];
}

export const documentationContent: GuideCategory[] = [
    {
        id: 'accountant',
        title: 'Hướng dẫn sử dụng Kế toán',
        description: 'Tài liệu nghiệp vụ kho, chi tiêu và theo dõi thanh toán dành cho bộ phận kế toán.',
        documents: [
            {
                id: 'dang-nhap-he-thong',
                title: 'Đăng nhập hệ thống',
                description: 'Các bước truy cập và đăng nhập vào phân hệ kế toán.',
                sections: [
                    {
                        title: '1. Truy cập đúng đường dẫn',
                        content: [
                            'Mở đúng đường dẫn phân hệ kế toán: http://localhost:5173/kt/dashboard.',
                            'Nếu đăng nhập từ màn hình chung, sau khi xác thực thành công hệ thống sẽ tự điều hướng về đúng vai trò đang hoạt động.'
                        ]
                    },
                    {
                        title: '2. Tài khoản minh họa',
                        content: [
                            'Tài khoản minh họa: lamnd@gmail.com / Bac@2026.',
                            'Sau khi đăng nhập, hãy kiểm tra góc phải phía trên để chắc chắn vai trò đang dùng là Kế toán.'
                        ],
                        alert: {
                            type: 'info',
                            text: 'Nếu đang ở vai trò khác, sử dụng mục “Chuyển quyền nhanh” trong menu người dùng để quay về đúng phân hệ.'
                        }
                    }
                ]
            },
            {
                id: 'tong-quan-dashboard',
                title: 'Trang tổng quan (Dashboard)',
                description: 'Giải thích các khu vực chính trên dashboard để theo dõi nhanh vật tư, tài sản và dòng tiền.',
                sections: [
                    {
                        title: '1. Mục đích màn hình',
                        content: 'Trang Dashboard cung cấp góc nhìn tổng hợp về tình hình vật tư, tài sản và dòng tiền để kế toán theo dõi nhanh trước khi đi sâu vào từng nghiệp vụ chi tiết.'
                    },
                    {
                        title: '2. Các thành phần chính trên giao diện',
                        content: 'Mỗi khu vực trên màn hình đóng vai trò như một điểm truy cập nhanh đến số liệu hoặc hành động thường dùng trong ngày.',
                        image: '/assets/docs/kt/kt_dashboard_1775272688097.png',
                        subsections: [
                            {
                                title: '2.1. Thanh điều hướng bên trái',
                                content: 'Hiển thị các nhóm chức năng chính như Tổng quan, Quản lý vật tư, Quản lý chi và những phân hệ kế toán cần thao tác hằng ngày.'
                            },
                            {
                                title: '2.2. Khu vực tiêu đề và breadcrumb',
                                content: 'Cho biết bạn đang đứng ở màn hình nào, giúp tránh thao tác nhầm khi phải chuyển nhanh giữa nhiều tính năng.'
                            },
                            {
                                title: '2.3. Cụm số liệu tổng hợp',
                                content: 'Các thẻ KPI giúp nhận diện nhanh tồn kho, tài sản cần theo dõi hoặc các khoản thanh toán cần xử lý trong ngày.'
                            },
                            {
                                title: '2.4. Biểu đồ và danh sách theo dõi nhanh',
                                content: 'Khu vực này dùng để quan sát xu hướng hoặc phát hiện bất thường, ví dụ số lượng phiếu chờ xử lý, biến động vật tư và trạng thái thanh toán.'
                            },
                            {
                                title: '2.5. Nút thao tác nhanh',
                                content: 'Các nút như làm mới, điều hướng sang chi tiết hoặc mở biểu mẫu giúp rút ngắn thời gian thao tác từ màn hình tổng quan.'
                            }
                        ]
                    }
                ]
            },
            {
                id: 'quan-ly-kho',
                title: 'Quản lý Kho (Inventory)',
                description: 'Hướng dẫn nhập kho và xuất kho để kiểm soát chính xác vật tư theo từng nghiệp vụ.',
                sections: [
                    {
                        title: '1. Vai trò của phân hệ kho',
                        content: 'Phân hệ kho giúp kế toán kiểm soát luồng vật tư vào và ra khỏi hệ thống, đồng thời là nguồn dữ liệu đầu vào cho các báo cáo tồn kho và chi phí.'
                    },
                    {
                        title: '2. Phiếu nhập kho (Stock In)',
                        content: 'Sử dụng khi có vật tư mới từ nhà cung cấp. Quy trình bao gồm chọn nhà phân phối, SKU, số lượng, đơn giá và chứng từ đi kèm.',
                        image: '/assets/docs/kt/kt_phieu_nhap_kho_1775272710364.png'
                    },
                    {
                        title: '3. Phiếu xuất kho (Stock Out)',
                        content: 'Xuất cấp vật tư cho các đội thi công theo mã Hành trình (Journey) để bám sát định mức và đối chiếu về sau.',
                        image: '/assets/docs/kt/kt_phieu_xuat_kho_1775272720147.png',
                        alert: {
                            type: 'tip',
                            text: 'Luôn đối chiếu đúng công trình, Journey và SKU trước khi xác nhận xuất kho để tránh sai lệch tồn kho.'
                        }
                    }
                ]
            },
            {
                id: 'quan-ly-chi',
                title: 'Quản lý Chi (Expenditures)',
                description: 'Theo dõi toàn bộ vòng đời của một yêu cầu chi, từ lúc tạo đến khi hoàn tất thanh toán.',
                sections: [
                    {
                        title: '1. Mục đích của quy trình chi',
                        content: 'Quy trình chi đảm bảo mỗi khoản thanh toán đều có yêu cầu rõ ràng, được phê duyệt đúng người và có bằng chứng hoàn tất để phục vụ hậu kiểm.'
                    },
                    {
                        title: '2. Danh sách yêu cầu chi',
                        content: 'Màn hình danh sách giúp theo dõi trạng thái từng phiếu chi như Chờ duyệt, Đã duyệt, Đã chi hoặc Từ chối.',
                        image: '/assets/docs/kt/danh_sach_yeu_cau_chi_1775273061866.png'
                    },
                    {
                        title: '3. Biểu mẫu tạo yêu cầu',
                        content: 'Biểu mẫu yêu cầu chi cần nhập đầy đủ loại yêu cầu, nội dung, số tiền, tài khoản nguồn và chứng từ đính kèm.',
                        image: '/assets/docs/kt/bieu_mau_tao_yeu_cau_chi_1775273070202.png'
                    },
                    {
                        title: '4. Xác nhận đã chi',
                        content: 'Sau khi chuyển tiền thành công, kế toán nhập mã giao dịch và đính kèm biên lai để hoàn tất quy trình.',
                        image: '/assets/docs/kt/xac_nhan_chi_tra_yeu_cau_1775273198253.png'
                    }
                ]
            },
            {
                id: 'theo-doi-thanh-toan',
                title: 'Theo dõi Thanh toán',
                description: 'Giám sát các khoản phải thu, số tiền đã thu và các cảnh báo cần xử lý sớm.',
                sections: [
                    {
                        title: '1. Mục tiêu theo dõi',
                        content: 'Màn hình theo dõi thanh toán giúp kế toán kiểm soát các khoản phải thu từ khách hàng, số tiền đã thu và trạng thái công nợ còn lại.',
                        image: '/assets/docs/kt/kt_theo_doi_thanh_toan_1775272756897.png',
                        alert: {
                            type: 'tip',
                            text: 'Luôn kiểm tra kỹ chứng từ đính kèm, mã thanh toán và trạng thái đối soát để việc xác nhận thu tiền diễn ra chính xác.'
                        }
                    }
                ]
            }
        ]
    },
    {
        id: 'supervisor',
        title: 'Hướng dẫn sử dụng Giám sát',
        description: 'Tài liệu tác nghiệp tại công trình: ghi nhật ký, kiểm nhận vật tư và quản lý tài khoản cá nhân.',
        documents: [
            {
                id: 'truy-cap-mobile',
                title: 'Truy cập qua Mobile',
                description: 'Cách mở đúng giao diện giám sát trên thiết bị di động.',
                sections: [
                    {
                        title: '1. Chuyển đúng vai trò làm việc',
                        content: 'Sau khi đăng nhập, sử dụng tính năng “Chuyển quyền nhanh” trong menu người dùng để chuyển sang vai trò Giám sát trước khi thao tác.',
                        image: '/assets/docs/gs/gs_dashboard_1775274718818.png'
                    }
                ]
            },
            {
                id: 'nhat-ky-thi-cong',
                title: 'Nhật ký thi công',
                description: 'Hướng dẫn cập nhật tiến độ và hình ảnh hiện trường ngay tại công trình.',
                sections: [
                    {
                        title: '1. Mục đích của nhật ký',
                        content: 'Nhật ký thi công là nơi ghi nhận tiến độ, khối lượng đã làm và các phát sinh cần báo cáo hằng ngày.'
                    },
                    {
                        title: '2. Cập nhật tiến độ',
                        content: 'Nhập tỷ lệ hoàn thành, mô tả công việc và các ghi chú quan trọng để quản lý dự án nắm được tình hình thực tế.',
                        image: '/assets/docs/gs/gs_diary_form_1775274766098.png'
                    },
                    {
                        title: '3. Hình ảnh hiện trường',
                        content: 'Chụp ảnh hiện trạng thi công để lưu bằng chứng chất lượng và hỗ trợ đối chiếu khi cần.',
                        image: '/assets/docs/gs/gs_project_overview_1775274739388.png'
                    }
                ]
            },
            {
                id: 'kiem-nhan-vat-tu',
                title: 'Kiểm nhận vật tư',
                description: 'Đối soát vật tư giao đến công trình và xác nhận ngay trên hệ thống.',
                sections: [
                    {
                        title: '1. Kiểm tra khi nhận hàng',
                        content: 'Đối chiếu số lượng, chủng loại và tình trạng bao bì của vật tư khi xe giao đến công trình.',
                        image: '/assets/docs/gs/gs_material_receive_modal_1775274808082.png',
                        alert: {
                            type: 'important',
                            text: 'Giám sát cần ký xác nhận điện tử và chụp ảnh nhãn mác hoặc bao bì vật tư để lưu vết đầy đủ.'
                        }
                    }
                ]
            },
            {
                id: 'quan-ly-ca-nhan',
                title: 'Quản lý Cá nhân',
                description: 'Cập nhật hồ sơ cá nhân và các thông tin tài khoản ngay trên ứng dụng.',
                sections: [
                    {
                        title: '1. Hồ sơ cá nhân',
                        content: 'Màn hình hồ sơ cho phép xem và cập nhật thông tin cá nhân, đồng thời hỗ trợ kiểm tra quyền hạn đang sử dụng.',
                        image: '/assets/docs/gs/gs_profile_page_1775274837349.png'
                    }
                ]
            }
        ]
    }
];
