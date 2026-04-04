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
                content: 'Tất cả bản vẽ mặt bằng, chi tiết kỹ thuật và ảnh hiện trường được quản lý tập trung theo từng hành trình công trình.',
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
                content: 'Màn hình "Yêu cầu" là trung tâm điều phối công việc của nhân viên kinh doanh. Tại đây, bạn có thể theo dõi tổng số hành trình đang phụ trách, các yêu cầu trễ hạn hoặc có rủi ro về tiến độ (SLA).',
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
    }
];
