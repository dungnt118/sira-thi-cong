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
        description: 'Tài liệu tác nghiệp tại công trình: ghi nhật ký, kiểm nhận vật tư, theo dõi lịch sử và quản lý tài khoản.',
        documents: [
            {
                id: 'tong-quan-dashboard',
                title: 'Tổng quan Giao diện Mobile',
                description: 'Giới thiệu giao diện chính và các thành phần nhanh trên Dashboard di động.',
                sections: [
                    {
                        title: '1. Giao diện tối ưu di động',
                        content: 'Giao diện Giám sát được thiết kế tinh gọn, tập trung vào các thao tác chạm và vuốt, giúp người dùng dễ dàng sử dụng bằng một tay ngay tại công trường.',
                        image: '/assets/docs/gs/gs_dashboard_mobile.png',
                        alert: {
                            type: 'info',
                            text: 'Sử dụng menu "Chuyển quyền nhanh" để truy cập giao diện này từ tài khoản của bạn.'
                        }
                    }
                ]
            },
            {
                id: 'nhat-ky-thi-cong',
                title: 'Nhật ký thi công',
                description: 'Hướng dẫn cập nhật tiến độ và hình ảnh hiện trường ngay tại công trình.',
                sections: [
                    {
                        title: '1. Quy trình ghi nhật ký',
                        content: 'Mỗi ngày, Giám sát chọn hành trình tương ứng để cập nhật khối lượng công việc đã hoàn thành và mô tả chi tiết các phát sinh.',
                        image: '/assets/docs/gs/gs_nhat_ky_mobile.png',
                        subsections: [
                            {
                                title: '1.1. Cập nhật tiến độ %',
                                content: 'Kéo thanh trượt hoặc nhập số % hoàn thành cho từng hạng mục công việc.'
                            },
                            {
                                title: '1.2. Chụp ảnh minh chứng',
                                content: 'Sử dụng camera điện thoại để chụp ảnh thực tế các hạng mục đã thi công xong hoặc các lỗi cần lưu ý.'
                            }
                        ]
                    }
                ]
            },
            {
                id: 'kiem-nhan-vat-tu',
                title: 'Kiểm nhận vật tư',
                description: 'Đối soát vật tư giao đến công trình và xác nhận ngay trên hệ thống.',
                sections: [
                    {
                        title: '1. Xác nhận vật tư thực tế',
                        content: 'Khi xe kho giao hàng đến, Giám sát thực hiện kiểm đếm và xác nhận vào phiếu kiểm nhận điện tử.',
                        image: '/assets/docs/gs/gs_vat_tu_mobile.png',
                        alert: {
                            type: 'important',
                            text: 'Vui lòng kiểm tra kỹ số lượng và tình trạng bao bì trước khi nhấn xác nhận.'
                        }
                    }
                ]
            },
            {
                id: 'lich-su-hoat-dong',
                title: 'Lịch sử hoạt động',
                description: 'Theo dõi các hoạt động và log vận hành gần đây của cá nhân.',
                sections: [
                    {
                        title: '1. Nhật ký vận hành',
                        content: 'Màn hình lịch sử giúp bạn xem lại các thao tác đã thực hiện trong ngày, đảm bảo tính minh bạch và dễ dàng rà soát lỗi.',
                        image: '/assets/docs/gs/gs_lich_su_mobile.png'
                    }
                ]
            },
            {
                id: 'quan-ly-ca-nhan',
                title: 'Quản lý Cá nhân',
                description: 'Cập nhật hồ sơ cá nhân và các thông tin tài khoản ngay trên ứng dụng.',
                sections: [
                    {
                        title: '1. Thông tin tài khoản',
                        content: 'Quản lý thông tin liên hệ, đổi mật khẩu và thiết lập thông báo thông qua trang cá nhân.',
                        image: '/assets/docs/gs/gs_ca_nhan_mobile.png'
                    }
                ]
            }
        ]
    },
    {
        id: 'technical',
        title: 'Hướng dẫn sử dụng Kỹ thuật',
        description: 'Tài liệu hướng dẫn quy trình khảo sát, lập giải pháp kỹ thuật, dự toán và quản lý hồ sơ công trình.',
        documents: [
            {
                id: 'tong-quan-cong-viec',
                title: 'Tổng quan Giao diện Công việc',
                description: 'Giới thiệu màn hình Dashboard và cách theo dõi trạng thái dự án trên di động.',
                sections: [
                    {
                        title: '1. Màn hình Dashboard',
                        content: 'Dashboard giúp kỹ thuật viên nắm bắt nhanh số lượng công trình đang phụ trách, phân loại theo các giai đoạn: Khảo sát, Thi công và Bảo hành.',
                        image: '/assets/docs/ky-thuat/kt_dashboard_mobile.png',
                        alert: {
                            type: 'info',
                            text: 'Sử dụng các phím tắt nhanh ở cuối màn hình để chuyển đổi giữa các phân hệ nghiệp vụ.'
                        }
                    }
                ]
            },
            {
                id: 'khao-sat-hien-truong',
                title: 'Khảo sát Hiện trường',
                description: 'Quy trình lập biên bản khảo sát hiện trạng hư hỏng tại công trình.',
                sections: [
                    {
                        title: '1. Lập phiếu khảo sát mới',
                        content: 'Kỹ thuật viên chọn mẫu khảo sát phù hợp với tình hình thực tế (ví dụ: Chống thấm). Hệ thống sẽ cung cấp các trường dữ liệu cần thiết để ghi nhận lỗi.',
                        image: '/assets/docs/ky-thuat/kt_survey_form_filled.png'
                    },
                    {
                        title: '2. Kiểm tra và Nộp biên bản',
                        content: 'Sau khi nhập liệu, bạn có thể xem lại toàn bộ nội dung biên bản khảo sát dưới dạng văn bản điện tử trước khi chính thức nộp lên hệ thống.',
                        image: '/assets/docs/ky-thuat/kt_survey_report.png',
                        alert: {
                            type: 'important',
                            text: 'Thông tin khảo sát là cơ sở để lập dự toán, hãy đảm bảo các vị trí nứt/thấm được mô tả chính xác.'
                        }
                    },
                    {
                        title: '3. Xác nhận nộp thành công',
                        content: 'Hệ thống sẽ hiển thị thông báo xác nhận khi hồ sơ khảo sát đã được gửi đi thành công.',
                        image: '/assets/docs/ky-thuat/kt_survey_success.png'
                    }
                ]
            },
            {
                id: 'giai-phap-du-toan',
                title: 'Giải pháp & Dự toán Kỹ thuật',
                description: 'Hướng dẫn bóc tách khối lượng và lập bảng kê vật tư cần thiết.',
                sections: [
                    {
                        title: '1. Lập dự toán vật tư',
                        content: 'Dựa trên phương án kỹ thuật đã chọn, kỹ thuật viên tiến hành chọn các hạng mục vật tư và nhân công tương ứng để hệ thống tính toán chi phí sơ bộ.',
                        alert: {
                            type: 'tip',
                            text: 'Bạn có thể chọn từ thư viện giải pháp có sẵn để đảm bảo đúng định mức kỹ thuật của công ty.'
                        }
                    }
                ]
            },
            {
                id: 'quan-ly-ho-so',
                title: 'Quản lý Bản vẽ & Tài liệu',
                description: 'Lưu trữ và tra cứu hồ sơ kỹ thuật tập trung theo từng công trình.',
                sections: [
                    {
                        title: '1. Đính kèm hồ sơ kỹ thuật',
                        content: 'Kỹ thuật viên có thể tải lên các bản vẽ mặt bằng, chi tiết cấu tạo hoặc ảnh chụp hiện trạng để lưu trữ tập trung.',
                        image: '/assets/docs/ky-thuat/kt_project_docs_form.png'
                    }
                ]
            },
            {
                id: 'ca-nhan-lich-cong-tac',
                title: 'Cá nhân & Lịch công tác',
                description: 'Quản lý thông tin cá nhân và theo dõi lịch hẹn khảo sát.',
                sections: [
                    {
                        title: '1. Hồ sơ kỹ thuật viên',
                        content: ' Xem và cập nhật các thông tin cá nhân, số điện thoại liên lạc và theo dõi lịch trình làm việc được giao.',
                        image: '/assets/docs/ky-thuat/kt_profile_mobile.png'
                    }
                ]
            }
        ]
    }
];
