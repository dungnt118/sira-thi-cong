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
        description: 'Tài liệu nghiệp vụ kho, kiểm soát chi tiêu và dòng tiền trên thiết bị di động.',
        documents: [
            {
                id: 'tong-quan-dashboard',
                title: 'Tổng quan Dashboard Kế toán',
                description: 'Giới thiệu màn hình theo dõi số liệu tài chính và kho vận tổng hợp.',
                sections: [
                    {
                        title: '1. Giao diện báo cáo nhanh',
                        content: 'Màn hình Dashboard giúp kế toán nắm bắt nhanh tình hình vật tư và tài sản hiện có. Các thẻ số liệu hiển thị tổng số SKU, nhóm vật tư và cảnh báo tồn kho thấp.',
                        image: '/assets/docs/accountant/acc_dashboard_mobile.png',
                        alert: {
                            type: 'info',
                            text: 'Nhấn vào các thẻ số liệu để đi đến danh sách chi tiết của từng hạng mục.'
                        }
                    }
                ]
            },
            {
                id: 'quan-ly-yeu-cau-chi',
                title: 'Quản lý Yêu cầu Chi',
                description: 'Quy trình tạo mới và theo dõi các khoản chi tiêu trong hệ thống.',
                sections: [
                    {
                        title: '1. Danh sách yêu cầu chi',
                        content: 'Màn hình quản lý tập trung toàn bộ các đề nghị thanh toán, giúp kế toán dễ dàng lọc theo trạng thái (Chờ duyệt, Đã chi...).',
                        image: '/assets/docs/accountant/acc_expenditure_list_mobile.png'
                    },
                    {
                        title: '2. Lập phiếu chi thực tế',
                        content: 'Khi cần thực hiện một khoản chi (ví dụ: Tạm ứng vật tư), kế toán nhập nội dung, số tiền và chọn MBBank làm tài khoản nguồn.',
                        image: '/assets/docs/accountant/acc_expenditure_form_mobile.png'
                    },
                    {
                        title: '3. Xác nhận hoàn tất',
                        content: 'Sau khi lưu, hệ thống sẽ thông báo giao dịch đã được ghi nhận. Bạn có thể kiểm tra lại phiếu vừa tạo trong danh sách "Chờ duyệt".',
                        image: '/assets/docs/accountant/acc_expenditure_success_mobile.png'
                    }
                ]
            },
            {
                id: 'quan-ly-kho-vat-tu',
                title: 'Nhập/Xuất kho Vật tư',
                description: 'Hướng dẫn đối soát và quản lý biến động hàng hóa tại kho.',
                sections: [
                    {
                        title: '1. Quản lý phiếu kho',
                        content: 'Theo dõi toàn bộ lịch sử nhập và xuất vật tư. Kế toán sử dụng màn hình này để đối chiếu số lượng thực tế với các chứng từ mua hàng.',
                        image: '/assets/docs/accountant/acc_stock_in_mobile.png',
                        alert: {
                            type: 'important',
                            text: 'Mọi biến động kho cần được cập nhật ngay để bộ phận Kinh doanh và Kỹ thuật có số liệu chính xác khi làm dự toán.'
                        }
                    }
                ]
            },
            {
                id: 'quan-ly-ca-nhan',
                title: 'Quản lý Cá nhân',
                description: 'Cập nhật thông tin và cài đặt bảo mật tài khoản kế toán.',
                sections: [
                    {
                        title: '1. Hồ sơ người dùng',
                        content: 'Xem thông tin cá nhân và thiết lập mật khẩu truy cập để bảo vệ dữ liệu tài chính của công ty.',
                        image: '/assets/docs/accountant/acc_profile_mobile.png'
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
    },
    {
        id: 'sale',
        title: 'Hướng dẫn sử dụng Kinh doanh',
        description: 'Tài liệu hướng dẫn quản lý khách hàng, theo dõi hành trình yêu cầu và lập báo giá chuyên nghiệp trên di động.',
        documents: [
            {
                id: 'tong-quan-kinh-doanh',
                title: 'Tổng quan Giao diện Kinh doanh',
                description: 'Giới thiệu màn hình điều phối yêu cầu và các chỉ số thông báo tiến độ.',
                sections: [
                    {
                        title: '1. Màn hình Yêu cầu',
                        content: 'Đây là trung tâm điều phối công việc hằng ngày của nhân viên kinh doanh, giúp bạn nắm bắt nhanh các đầu việc cần xử lý gấp.',
                        image: '/assets/docs/sale/sl_dashboard_mobile.png',
                        subsections: [
                            {
                                title: '1.1. Các chỉ số cảnh báo (KPI)',
                                content: 'Hệ thống tự động thống kê số lượng hành trình trễ hạn hoặc có rủi ro về thời gian xử lý (SLA) để bạn ưu tiên chăm sóc khách hàng.'
                            },
                            {
                                title: '1.2. Danh sách yêu cầu mới',
                                content: 'Hiển thị các khách hàng vừa đăng ký hoặc vừa được giao cho bạn phụ trách, sắp xếp theo thời gian mới nhất.'
                            }
                        ]
                    }
                ]
            },
            {
                id: 'quan-ly-khach-hang',
                title: 'Quản lý Khách hàng & CRM',
                description: 'Hướng dẫn lưu trữ hồ sơ và thêm mới thông tin khách hàng tiềm năng.',
                sections: [
                    {
                        title: '1. Danh sách khách hàng',
                        content: 'Tra cứu nhanh thông tin liên hệ, lịch sử tư vấn và các công trình mà khách hàng đã thực hiện với công ty.',
                        image: '/assets/docs/sale/sl_customer_list_mobile.png'
                    },
                    {
                        title: '2. Thêm mới khách hàng tiềm năng',
                        content: 'Khi gặp gỡ hoặc nhận yêu cầu mới, Sale nhập nhanh các thông tin định danh (Tên, SĐT, Địa chỉ) để hệ thống khởi tạo hành trình tư vấn.',
                        image: '/assets/docs/sale/sl_customer_form_mobile.png',
                        alert: {
                            type: 'tip',
                            text: 'Ghi chú địa chỉ chi tiết sẽ giúp bộ phận kỹ thuật định vị công trình chính xác khi đi khảo sát.'
                        }
                    }
                ]
            },
            {
                id: 'theo-doi-hanh-trinh',
                title: 'Tiếp nhận & Theo dõi Hành trình',
                description: 'Quy trình bám sát yêu cầu từ giai đoạn tư vấn đến khi hoàn thành.',
                sections: [
                    {
                        title: '1. Chi tiết Hành trình (Journey)',
                        content: 'Mỗi yêu cầu dịch vụ được quản lý như một hành trình xuyên suốt. Tại đây Sale có thể xem trạng thái khảo sát của kỹ thuật hoặc tiến độ thi công thực tế.',
                        image: '/assets/docs/sale/sl_journey_detail_mobile.png',
                        alert: {
                            type: 'info',
                            text: 'Sử dụng tab "Lịch sử" để xem lại các mốc thời gian quan trọng đã làm việc với khách hàng.'
                        }
                    }
                ]
            },
            {
                id: 'du-toan-bao-gia',
                title: 'Dự toán & Báo giá',
                description: 'Hướng dẫn lập bảng kê hạng mục thi công và gửi báo giá cho khách.',
                sections: [
                    {
                        title: '1. Lập dự toán chi tiết',
                        content: 'Sale chọn các hạng mục thi công mẫu (ví dụ: Chống thấm sàn) và nhập diện tích thực tế. Hệ thống sẽ tự động tính toán chi phí dựa trên đơn giá chuẩn.',
                        image: '/assets/docs/sale/sl_quote_form_mobile.png',
                        alert: {
                            type: 'important',
                            text: 'Luôn rà soát lại khối lượng và mô tả hạng mục trước khi nhấn gửi báo giá cho khách hàng.'
                        }
                    }
                ]
            },
            {
                id: 'thong-tin-ca-nhan',
                title: 'Thông tin Cá nhân',
                description: 'Quản lý hồ sơ cá nhân và cài đặt thông báo.',
                sections: [
                    {
                        title: '1. Hồ sơ Sale',
                        content: 'Xem thông tin cá nhân, lịch làm việc cá nhân và cấu hình các thông báo đẩy để không bỏ lỡ yêu cầu từ khách hàng.',
                        image: '/assets/docs/sale/sl_profile_mobile.png'
                    }
                ]
            }
        ]
    },
    {
        id: 'pm',
        title: 'Hướng dẫn sử dụng Quản lý dự án (PM)',
        description: 'Tài liệu quản trị hành trình khách hàng, giám sát thi công và phê duyệt hồ sơ trên di động.',
        documents: [
            {
                id: 'tong-quan-dashboard',
                title: 'Bàn làm việc Quản lý (Dashboard)',
                description: 'Theo dõi chỉ số sức khỏe dự án và các tác vụ trễ hạn.',
                sections: [
                    {
                        title: '1. Giao diện báo cáo quản trị',
                        content: 'Dashboard giúp PM nắm bắt nhanh các đầu việc "nghẽn mạch" (Blocked) hoặc "quá hạn" (Overdue) để can thiệp kịp thời.',
                        image: '/assets/docs/pm/pm-dashboard.png'
                    }
                ]
            },
            {
                id: 'trung-tam-xu-ly',
                title: 'Trung tâm xử lý Action Center',
                description: 'Lọc và điều hướng nhanh các hành trình đang thực thi.',
                sections: [
                    {
                        title: '1. Quản lý tác vụ chờ đóng',
                        content: 'PM sử dụng màn hình danh sách hành trình để theo dõi các điểm chạm của khách hàng, đảm bảo các yêu cầu được đóng đúng thời hạn.',
                        image: '/assets/docs/pm/pm-action-center.png'
                    }
                ]
            },
            {
                id: 'tra-cuu-ho-so',
                title: 'Tra cứu hồ sơ dự án',
                description: 'Tìm kiếm hồ sơ khách hàng và lọc danh sách hành trình.',
                sections: [
                    {
                        title: '1. Danh sách hành trình công trình',
                        content: 'Tra cứu tập trung mọi dự án, từ khảo sát đến bảo hành. PM có thể lọc danh sách theo khu vực giám sát của từng cá nhân.',
                        image: '/assets/docs/pm/pm-journey-list.png'
                    }
                ]
            },
            {
                id: 'theo-doi-chi-tiet',
                title: 'Theo dõi chi tiết & Nhật ký',
                description: 'Xem nhật ký thi công, sơ đồ ký duyệt và bóc tách vật tư.',
                sections: [
                    {
                        title: '1. Chi tiết tiến độ thực tế',
                        content: 'Hệ thống lưu lại dòng thời gian (Timeline) các mốc quan trọng, hồ sơ khảo sát đã duyệt và chi phí vật tư dự kiến.',
                        image: '/assets/docs/pm/pm-journey-detail.png',
                        alert: {
                            type: 'info',
                            text: 'PM có thể kiểm duyệt các biên bản khảo sát của kỹ thuật ngay tại màn hình này.'
                        }
                    }
                ]
            },
            {
                id: 'thong-tin-ca-nhan',
                title: 'Hồ sơ Cá nhân & Chuyển quyền',
                description: 'Quản lý thông tin tài khoản và đổi vai trò tác nghiệp.',
                sections: [
                    {
                        title: '1. Trang Cá nhân PM',
                        content: 'Xem cấu hình thông báo và chuyển đổi quyền nhanh giữa các vai trò trong hệ thống.',
                        image: '/assets/docs/pm/pm-profile.png'
                    },
                    {
                        title: '2. Chuyển quyền nhanh',
                        content: 'Cho phép PM đổi sang vai trò Giám sát hoặc Sale để hỗ trợ nghiệp vụ cho nhân viên hiện trường.',
                        image: '/assets/docs/pm/pm-role-switch.png'
                    }
                ]
            }
        ]
    }
];
