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
        description: 'Tài liệu hướng dẫn quy trình quản lý kho, kiểm soát chi tiêu và dòng tiền trên thiết bị di động.',
        sections: [
            {
                title: '1. Tổng quan Dashboard Kế toán',
                content: 'Màn hình Dashboard cung cấp cái nhìn tổng thể về tình hình tài chính của toàn bộ hệ thống, bao gồm số lượng vật tư, tài sản và các phiếu kho đang chờ đóng.',
                image: '/assets/docs/accountant/acc_dashboard_mobile.png',
                alert: {
                    type: 'info',
                    text: 'Các chỉ số được cập nhật theo thời gian thực để kế toán có thể giám sát dòng tiền và hàng hóa chính xác.'
                }
            },
            {
                title: '2. Quản lý Yêu cầu Chi',
                content: 'Hệ thống cho phép lọc và xử lý các yêu cầu chi từ các bộ phận khác một cách nhanh chóng.',
                image: '/assets/docs/accountant/acc_expenditure_list_mobile.png',
                subsections: [
                    {
                        title: '2.1. Lập phiếu chi mới',
                        content: 'Để tạo một khoản chi mới, nhấn nút **Tạo yêu cầu chi**. Điền đầy đủ nội dung thanh toán, số tiền và chọn tài khoản nguồn (Ngân hàng) tương ứng.',
                        image: '/assets/docs/accountant/acc_expenditure_form_mobile.png'
                    },
                    {
                        title: '2.2. Hoàn kết & Ghi nhận',
                        content: 'Sau khi lưu, hệ thống sẽ xác nhận bản ghi đã được ghi nhận thành công và nằm trong danh sách chờ phê duyệt.',
                        image: '/assets/docs/accountant/acc_expenditure_success_mobile.png'
                    }
                ]
            },
            {
                title: '3. Nhập/Xuất kho Vật tư',
                content: 'Quản lý việc luân chuyển hàng hóa giữa kho trung tâm và các công trình. Tính năng này giúp kế toán bám sát tồn kho thực tế.',
                image: '/assets/docs/accountant/acc_stock_in_mobile.png',
                alert: {
                    type: 'important',
                    text: 'Luôn xác nhận trên hệ thống ngay sau khi hàng đã về kho hoặc xuất đi để tránh sai lệch số liệu tồn.'
                }
            },
            {
                title: '4. Hồ sơ Cá nhân',
                content: 'Nơi quản lý thông tin đăng nhập, bảo mật tài khoản và xem các thông báo cá nhân dành riêng cho bộ phận kế toán.',
                image: '/assets/docs/accountant/acc_profile_mobile.png'
            }
        ]
    },
    {
        id: 'supervisor',
        title: 'Hướng Dẫn Vận Hành Hiện Trường (Giám sát)',
        description: 'Cẩm nang tác nghiệp chuyên sâu dành cho Giám sát: Quản lý tiến độ, nhật ký thi công, đối soát vật tư và ký duyệt bàn giao trên di động.',
        sections: [
            {
                title: '1. Bàn làm việc & Cảnh báo SLA',
                content: 'Giao diện Dashboard giúp Giám sát nắm bắt nhanh số lượng công trình đang thi công và các cảnh báo trễ hạn (SLA) để ưu tiên xử lý.',
                image: '/assets/docs/gs/gs_pro_dashboard.png',
                alert: {
                    type: 'important',
                    text: 'Các chỉ số có màu đỏ hoặc cam yêu cầu Giám sát phải cập nhật tiến độ ngay lập tức để tránh vi phạm cam kết với khách hàng.'
                }
            },
            {
                title: '2. Bộ lọc & Tìm kiếm Dự án',
                content: 'Sử dụng bộ lọc "Đang thi công" để tập trung vào các công trình đang thực thi. Bạn có thể tìm nhanh dự án theo mã JRN hoặc tên khách hàng.',
                image: '/assets/docs/gs/gs_pro_journey_list.png'
            },
            {
                title: '3. Tổng quan Hành trình chi tiết',
                content: 'Màn hình này cung cấp cái nhìn 360 độ về dự án: Địa chỉ thi công, số điện thoại khách hàng, nhân sự phối hợp (Sale/KT) và thanh tiến độ tổng thể.',
                image: '/assets/docs/gs/gs_pro_journey_overview.png'
            },
            {
                title: '4. Tra cứu Nhật ký & Ảnh hiện trường',
                content: 'Tab "Nhật ký thi công" lưu trữ toàn bộ lịch sử các đợt cập nhật. Giám sát có thể xem lại các ghi chú kỹ thuật và hình ảnh đối chứng của những ngày trước đó.',
                image: '/assets/docs/gs/gs_pro_journey_timeline.png'
            },
            {
                title: '5. Cập nhật tiến độ: Thông tin chung',
                content: 'Khi có khối lượng hoàn thành mới, Giám sát nhấn "Cập nhật tiến độ". Tại đây, bạn chọn hạng mục thi công và kéo thanh trượt để ghi nhận % hoàn thành thực tế.',
                image: '/assets/docs/gs/gs_pro_log_form_1.png'
            },
            {
                title: '6. Cập nhật tiến độ: Ghi chú & Hình ảnh',
                content: 'Phần cuối biểu mẫu cho phép nhập chi tiết nội dung công việc (ví dụ: đã đi dây điện, láng nền...). QUAN TRỌNG: Phải chụp ảnh thực tế tại công trường để làm minh chứng hoàn thành.',
                image: '/assets/docs/gs/gs_pro_log_form_2.png',
                alert: {
                    type: 'tip',
                    text: 'Ghi chú càng chi tiết giúp bộ phận PM và Kế toán dễ dàng đối soát khối lượng để thực hiện thanh quyết toán sau này.'
                }
            },
            {
                title: '7. Quản lý Tài liệu & Bản vẽ',
                content: 'Truy cập nhanh các bản vẽ thiết kế, biên bản khảo sát hiện trạng hoặc các chứng từ kỹ thuật liên quan ngay tại công trình mà không cần mang theo hồ sơ giấy.',
                image: '/assets/docs/gs/gs_pro_documents.png'
            },
            {
                title: '8. Đối soát & Kiểm nhận Vật tư',
                content: 'Xem danh sách vật tư đã được phê duyệt và xuất từ kho. Giám sát thực hiện kiểm đếm số lượng thực tế nhận được tại hiện trường và xác nhận vào hệ thống.',
                image: '/assets/docs/gs/gs_pro_materials.png'
            },
            {
                title: '9. Quy trình Ký duyệt & Bàn giao',
                content: 'Khi kết thúc giai đoạn thi công, Giám sát truy cập tab "Bàn giao" để xem luồng ký duyệt điện tử giữa Kỹ thuật, Giám sát và Khách hàng.',
                image: '/assets/docs/gs/gs_pro_handover.png'
            },
            {
                title: '10. Chuyển quyền & Thiết lập cá nhân',
                content: 'Giám sát có thể sử dụng menu "Chuyển quyền nhanh" để đổi sang vai trò khác (nếu được cấp phép) hoặc cập nhật thông tin liên hệ trong trang cá nhân.',
                image: '/assets/docs/gs/gs_pro_switching.png'
            }
        ]
    },
    {
        id: 'technical',
        title: 'Hướng Dẫn Sử Dụng Kỹ Thuật',
        description: 'Tài liệu hướng dẫn quy trình khảo sát hiện trường, lập giải pháp kỹ thuật, dự toán và quản lý hồ sơ công trình trên thiết bị di động.',
        sections: [
            {
                title: '1. Tổng quan Giao diện Công việc',
                content: 'Màn hình chính (Dashboard) giúp kỹ thuật viên theo dõi nhanh số lượng công trình theo trạng thái: Khảo sát, Đang thi công và Bảo hành. Các lối tắt nhanh bên dưới giúp truy cập tức thì vào các nhiệm vụ quan trọng.',
                image: '/assets/docs/ky-thuat/kt_dashboard_mobile.png',
                alert: {
                    type: 'info',
                    text: 'Giao diện được tối ưu cho điện thoại, thuận tiện cho việc thao tác trực tiếp tại công trường.'
                }
            },
            {
                title: '2. Khảo sát Hiện trường',
                content: 'Đây là bước đầu tiên để ghi nhận hiện trạng hư hỏng của công trình. Kỹ thuật viên chọn mẫu khảo sát phù hợp (ví dụ: Chống thấm sân thượng) và điền chi tiết các phát hiện.',
                image: '/assets/docs/ky-thuat/kt_survey_form_filled.png',
                subsections: [
                    {
                        title: '2.1. Nhập liệu khảo sát',
                        content: 'Ghi chú cụ thể vị trí thấm, các vết nứt và nhu cầu thực tế của khách hàng. Chọn các dấu hiệu nhận biết có sẵn để hệ thống phân loại chính xác.'
                    },
                    {
                        title: '2.2. Kiểm tra Biên bản',
                        content: 'Trước khi nộp, hệ thống cho phép xem trước Biên bản khảo sát điện tử để rà soát lại toàn bộ thông tin đã nhập.',
                        image: '/assets/docs/ky-thuat/kt_survey_report.png'
                    },
                    {
                        title: '2.3. Hoàn tất & Nộp hồ sơ',
                        content: 'Sau khi kiểm tra, nhấn nút nộp để hệ thống lưu hồ sơ và chuyển sang giai đoạn lập giải pháp. Thông báo thành công sẽ hiển thị ngay khi dữ liệu được ghi nhận.',
                        image: '/assets/docs/ky-thuat/kt_survey_success.png'
                    }
                ]
            },
            {
                title: '3. Giải pháp & Dự toán Kỹ thuật',
                content: 'Dựa trên kết quả khảo sát, kỹ thuật viên tiến hành bóc tách khối lượng và lập dự toán vật tư, nhân công cần thiết cho việc sửa chữa.',
                alert: {
                    type: 'tip',
                    text: 'Sử dụng các "Hạng mục mẫu" có sẵn để tiết kiệm thời gian nhập liệu và đảm bảo định mức kỹ thuật.'
                }
            },
            {
                title: '4. Quản lý Bản vẽ & Tài liệu',
                content: 'Tất cả bản vẽ mặt bằng, chi tiết kỹ thuật và ảnh hiện trường được quản lý tập trung theo từng công trình công trình.',
                image: '/assets/docs/ky-thuat/kt_project_docs_form.png',
                alert: {
                    type: 'important',
                    text: 'Luôn đính kèm ảnh chụp hiện trạng trước khi thi công để làm cơ sở đối chiếu cho biên bản nghiệm thu sau này.'
                }
            },
            {
                title: '5. Cá nhân & Lịch công tác',
                content: 'Truy cập tab Cá nhân để theo dõi hồ sơ cá nhân và các thông tin liên quan đến tài khoản kỹ thuật của bạn.',
                image: '/assets/docs/ky-thuat/kt_profile_mobile.png'
            }
        ]
    },
    {
        id: 'sale',
        title: 'Hướng Dẫn Sử Dụng Kinh Doanh',
        description: 'Tài liệu hướng dẫn quản lý khách hàng, theo dõi yêu cầu dịch vụ và lập báo giá chuyên nghiệp trên thiết bị di động.',
        sections: [
            {
                title: '1. Tổng quan Giao diện Kinh doanh',
                content: 'Màn hình "Yêu cầu" là trung tâm điều phối công việc của nhân viên kinh doanh. Tại đây, bạn có thể theo dõi tổng số công trình đang phụ trách, các yêu cầu trễ hạn hoặc có rủi ro về tiến độ (SLA).',
                image: '/assets/docs/sale/sl_dashboard_mobile.png',
                alert: {
                    type: 'info',
                    text: 'Các con số thống kê ở đầu trang giúp bạn ưu tiên xử lý những khách hàng đang chờ phản hồi gấp.'
                }
            },
            {
                title: '2. Quản lý Khách hàng & CRM',
                content: 'Hệ thống lưu trữ tập trung hồ sơ khách hàng, giúp Sale dễ dàng tra cứu lịch sử và thông tin liên hệ mọi lúc mọi nơi.',
                image: '/assets/docs/sale/sl_customer_list_mobile.png',
                subsections: [
                    {
                        title: '2.1. Thêm mới Khách hàng',
                        content: 'Khi có khách hàng mới, nhấn nút **+ Tạo khách hàng** và điền các thông tin định danh cơ bản. Việc nhập liệu chính xác sẽ giúp bộ phận kỹ thuật liên hệ khảo sát thuận tiện hơn.',
                        image: '/assets/docs/sale/sl_customer_form_mobile.png'
                    }
                ]
            },
            {
                title: '3. Tiếp nhận & Theo dõi Hành trình',
                content: 'Mỗi khách hàng sẽ gắn liền với một "Hành trình" (Journey) xuyên suốt từ khi tư vấn đến khi hoàn thành thi công. Sale cần theo dõi sát sao từng giai đoạn để kịp thời thông tin cho khách.',
                image: '/assets/docs/sale/sl_journey_detail_mobile.png',
                alert: {
                    type: 'tip',
                    text: 'Sử dụng các tab chi tiết trong Hành trình để xem tình trạng khảo sát của kỹ thuật hoặc lịch sử bàn giao vật tư.'
                }
            },
            {
                title: '4. Dự toán & Báo giá',
                content: 'Dựa trên phương án kỹ thuật, Sale thực hiện lập dự toán chi tiết cho khách hàng. Hệ thống hỗ trợ tính toán tự động dựa trên khối lượng và đơn giá mẫu.',
                image: '/assets/docs/sale/sl_quote_form_mobile.png',
                alert: {
                    type: 'important',
                    text: 'Hãy kiểm tra kỹ các hạng mục và chiết khấu (nếu có) trước khi gửi bản báo giá cuối cùng cho khách hàng.'
                }
            },
            {
                title: '5. Thông tin Cá nhân',
                content: 'Truy cập tab Cá nhân để xem hồ sơ riêng, lịch làm việc cá nhân và cài đặt các thông báo quan trọng từ hệ thống.',
                image: '/assets/docs/sale/sl_profile_mobile.png'
            }
        ]
    },
    {
        id: 'pm',
        title: 'Hướng Dẫn Sử Dụng Quản Lý Dự Án (PM)',
        description: 'Tài liệu quản trị công trình khách hàng, giám sát tiến độ thi công và phê duyệt khảo sát kỹ thuật trên di động.',
        sections: [
            {
                title: '1. Bàn làm việc Quản lý (Dashboard)',
                content: 'Màn hình Dashboard tập trung các chỉ số vận hành quan trọng: tổng số công trình, các tác vụ quá hạn cần ưu tiên xử lý và các hồ sơ khảo sát đang chờ phê duyệt.',
                image: '/assets/docs/pm/pm-dashboard.png',
                alert: {
                    type: 'important',
                    text: 'Các con số màu đỏ biểu thị tác vụ đang bị nghẽn (Blocked) hoặc quá hạn (SLA), PM cần can thiệp ngay.'
                }
            },
            {
                title: '2. Trung tâm xử lý Hành trình',
                content: 'Đây là Action Center giúp PM bám sát các yêu cầu đang thực thi. Hệ thống tự động phân loại các công trình "Chưa hoàn thành" để PM dễ dàng quản trị theo thời gian thực.',
                image: '/assets/docs/pm/pm-action-center.png'
            },
            {
                title: '3. Tra cứu & Quản lý Hồ sơ',
                content: 'Tính năng cho phép tìm kiếm nhanh hồ sơ khách hàng và lọc các dự án theo khu vực hoặc trạng thái thi công cụ thể.',
                image: '/assets/docs/pm/pm-journey-list.png'
            },
            {
                title: '4. Theo dõi chi tiết & Nhật ký',
                content: 'PM có thể truy cập sâu vào từng dự án để xem nhật ký thi công của giám sát, danh sách vật tư đã xuất và lịch sử ký duyệt hồ sơ điện tử.',
                image: '/assets/docs/pm/pm-journey-detail.png',
                alert: {
                    type: 'tip',
                    text: 'Sử dụng thanh timeline để đối soát các mốc bàn giao thực tế so với cam kết ban đầu với khách hàng.'
                }
            },
            {
                title: '5. Cá nhân & Chuyển quyền',
                content: 'Nơi quản lý thông tin tài khoản và sử dụng menu "Chuyển quyền nhanh" để hỗ trợ các bộ phận khác (Sale, Kỹ thuật) khi cần thiết.',
                image: '/assets/docs/pm/pm-role-switch.png'
            }
        ]
    }
];
