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
        description: 'Tài liệu nghiệp vụ kho, tài sản và kiểm soát chi tiêu trên giao diện Desktop.',
        documents: [
            {
                id: 'dashboard-ke-toan',
                title: '1. Dashboard & Chỉ số tài chính',
                description: 'Tổng quan tình hình sức khỏe tài chính và kho vận.',
                sections: [
                    {
                        title: 'Theo dõi số liệu tổng hợp',
                        content: 'Màn hình Dashboard cung cấp cái nhìn 360 độ về các chỉ số quan trọng: Tổng số SKU vật tư, giá trị kho hiện tại, các khoản chi chờ duyệt và cảnh báo tồn kho thấp dưới ngưỡng an toàn.',
                        image: '/assets/docs/kt/kt_dashboard.png',
                        alert: {
                            type: 'info',
                            text: 'Các biểu đồ xu hướng giúp kế toán dự báo nhu cầu vốn cho các đợt nhập hàng tiếp theo.'
                        }
                    }
                ]
            },
            {
                id: 'quan-ly-kho-vat-tu',
                title: '2. Nghiệp vụ Kho Vật tư',
                description: 'Quy trình nhập, xuất và quản lý danh mục vật tư thi công.',
                sections: [
                    {
                        title: 'Danh mục vật tư thi công',
                        content: 'Tra cứu toàn bộ danh sách vật tư hiện có trong hệ thống bao gồm: Mã vật tư, tên gọi, đơn vị tính và số lượng tồn kho thực tế tại các kho.',
                        image: '/assets/docs/kt/kt_materials_list.png'
                    },
                    {
                        title: 'Quy trình Nhập kho',
                        content: 'Khi vật tư được giao đến, kế toán thực hiện lập phiếu nhập kho. Quy trình bao gồm: Chọn nhà cung cấp, nhập số lượng, đơn giá và đính kèm hóa đơn/chứng từ liên quan.',
                        image: '/assets/docs/kt/kt_stock_in_form_empty.png',
                        subsections: [
                            {
                                title: 'Điền thông tin phiếu nhập',
                                content: 'Chọn đúng danh mục vật tư cần nhập. Hệ thống sẽ tự động tính toán tổng giá trị phiếu dựa trên đơn giá và số lượng.',
                                image: '/assets/docs/kt/kt_stock_in_form_filled.png'
                            },
                            {
                                title: 'Xác nhận hoàn tất nhập kho',
                                content: 'Sau khi kiểm tra thông tin, nhấn "Hoàn tất". Hệ thống sẽ cập nhật số lượng tồn kho ngay lập tức và tạo bút toán công nợ tương ứng.',
                                image: '/assets/docs/kt/kt_stock_in_success.png'
                            }
                        ]
                    },
                    {
                        title: 'Quy trình Xuất kho',
                        content: 'Vật tư được xuất cho các đội thi công dựa trên yêu cầu từ Giám sát. Kế toán cần chọn đúng mã hành trình (Journey) để ghi nhận chi phí vật tư cho từng công trình.',
                        image: '/assets/docs/kt/kt_stock_out_form_empty.png',
                        subsections: [
                            {
                                title: 'Bốc tách vật tư xuất kho',
                                content: 'Đảm bảo chọn đúng SKU và số lượng cần xuất. Hệ thống sẽ cảnh báo nếu số lượng xuất vượt quá tồn kho khả dụng.',
                                image: '/assets/docs/kt/kt_stock_out_form_filled.png'
                            },
                            {
                                title: 'In phiếu xuất & Giao hàng',
                                content: 'Hoàn tất quy trình xuất kho để hệ thống trừ tồn và ghi nhận chi phí vào bảng giá trị hành trình.',
                                image: '/assets/docs/kt/kt_stock_out_success.png'
                            }
                        ]
                    },
                    {
                        title: 'Tra cứu lịch sử biến động',
                        content: 'Hệ thống lưu trữ chi tiết mọi giao dịch nhập/xuất để phục vụ công tác kiểm kê và đối soát định kỳ.',
                        image: '/assets/docs/kt/kt_inventory_history.png'
                    },
                    {
                        title: 'Quản lý Nhà cung cấp',
                        content: 'Danh sách các đối tác cung cấp vật tư với đầy đủ thông tin liên hệ và lịch sử giao dịch.',
                        image: '/assets/docs/kt/kt_distributors.png'
                    }
                ]
            },
            {
                id: 'quan-ly-tai-san',
                title: '3. Tài sản & Công cụ dụng cụ',
                description: 'Theo dõi vòng đời máy móc và trang thiết bị thi công.',
                sections: [
                    {
                        title: 'Danh sách tài sản cố định',
                        content: 'Quản lý tập trung các tài sản có giá trị lớn như máy khoan, máy cắt, xe vận tải... bao gồm thông số kỹ thuật và tình trạng sử dụng.',
                        image: '/assets/docs/kt/kt_assets_list.png'
                    },
                    {
                        title: 'Cấp phát tài sản cho Giám sát',
                        content: 'Quy trình bàn giao công cụ dụng cụ cho nhân viên hiện trường. Hệ thống ghi nhận người chịu trách nhiệm và vị trí hiện tại của tài sản.',
                        image: '/assets/docs/kt/kt_asset_allocation_empty.png',
                        subsections: [
                            {
                                title: 'Thiết lập phiếu cấp phát',
                                content: 'Chọn tài sản và nhân viên tiếp nhận. Có thể ghi chú tình trạng máy móc tại thời điểm bàn giao.',
                                image: '/assets/docs/kt/kt_asset_allocation_filled.png'
                            },
                            {
                                title: 'Xác nhận bàn giao',
                                content: 'Sau khi xác nhận, trạng thái tài sản sẽ chuyển sang "Đang sử dụng".',
                                image: '/assets/docs/kt/kt_asset_allocation_success.png'
                            }
                        ]
                    },
                    {
                        title: 'Lịch sử di chuyển tài sản',
                        content: 'Theo dõi quá trình luân chuyển tài sản giữa các công trình hoặc các nhân sự khác nhau.',
                        image: '/assets/docs/kt/kt_asset_allocation_history.png'
                    },
                    {
                        title: 'Bảo trì & Bảo dưỡng',
                        content: 'Lên kế hoạch và theo dõi chi phí bảo trì định kỳ cho trang thiết bị để đảm bảo an toàn thi công.',
                        image: '/assets/docs/kt/kt_asset_maintenance.png'
                    }
                ]
            },
            {
                id: 'quan-ly-tai-chinh',
                title: '4. Tài chính & Thanh toán',
                description: 'Kiểm soát dòng tiền, thanh toán nhà cung cấp và lương nhân công.',
                sections: [
                    {
                        title: 'Kế hoạch thu hồi công nợ',
                        content: 'Theo dõi các đợt thanh toán (Milestones) của khách hàng dựa trên tiến độ thi công thực tế.',
                        image: '/assets/docs/kt/kt_payment_milestones.png'
                    },
                    {
                        title: 'Danh sách Yêu cầu thanh toán',
                        content: 'Nơi tập trung các đề xuất chi từ các bộ phận. Kế toán thực hiện kiểm tra hồ sơ và phê duyệt chi.',
                        image: '/assets/docs/kt/kt_payment_requests_list.png'
                    },
                    {
                        title: 'Lập lệnh chi tiền',
                        content: 'Quy trình thực hiện chi trả tiền mặt hoặc chuyển khoản cho nhà cung cấp/nhân công.',
                        image: '/assets/docs/kt/kt_payment_request_empty.png',
                        subsections: [
                            {
                                title: 'Chi tiết nội dung thanh toán',
                                content: 'Nhập số tiền thực chi, chọn phương thức thanh toán và tài khoản nguồn.',
                                image: '/assets/docs/kt/kt_payment_request_filled.png'
                            },
                            {
                                title: 'Xác nhận giao dịch thành công',
                                content: 'Ghi nhận bút toán giảm tiền và cập nhật trạng thái "Đã thanh toán" cho yêu cầu.',
                                image: '/assets/docs/kt/kt_payment_request_success.png'
                            }
                        ]
                    },
                    {
                        title: 'Quản lý Tài khoản ngân hàng',
                        content: 'Cấu hình các tài khoản ngân hàng của công ty để thực hiện kết nối và đối soát tự động.',
                        image: '/assets/docs/kt/kt_company_banks.png'
                    },
                    {
                        title: 'Danh mục Người thụ hưởng',
                        content: 'Lưu trữ thông tin tài khoản của nhà cung cấp và đội nhóm thi công để thực hiện thanh toán nhanh.',
                        image: '/assets/docs/kt/kt_beneficiaries.png'
                    }
                ]
            },
            {
                id: 'quan-ly-ca-nhan',
                title: '5. Quản lý Cá nhân',
                description: 'Cập nhật thông tin và cài đặt bảo mật tài khoản kế toán.',
                sections: [
                    {
                        title: 'Hồ sơ người dùng',
                        content: 'Xem thông tin cá nhân và thiết lập mật khẩu truy cập để bảo vệ dữ liệu tài chính của công ty.',
                        image: '/assets/docs/accountant/acc_profile_mobile.png'
                    }
                ]
            }
        ]
    },
    {
        id: 'supervisor',
        title: 'Hướng dẫn vận hành Giám sát (Pro Guide)',
        description: 'Cẩm nang quản lý hiện trường: Nhật ký thi công, kiểm trị vật tư và quy trình bàn giao công trình.',
        documents: [
            {
                id: '1-dashboard-quan-tri',
                title: '1. Bàn làm việc & Cảnh báo SLA',
                description: 'Theo dõi tiến độ tổng thể và các cảnh báo trễ hạn.',
                sections: [
                    {
                        title: 'Tổng quan chỉ số hiện trường',
                        content: 'Dashboard cung cấp cái nhìn nhanh về các công trình đang phụ trách. Các thẻ màu (Đỏ/Cam) giúp nhận diện hành trình đang bị nghẽn (Blocked) hoặc trễ tiến độ (SLA).',
                        image: '/assets/docs/gs/gs_pro_dashboard.png',
                        alert: {
                            type: 'important',
                            text: 'Luôn kiểm tra các mục "Tác vụ quá hạn" đầu ngày để ưu tiên xử lý hiện trường.'
                        }
                    }
                ]
            },
            {
                id: '2-loc-tim-kiem-du-an',
                title: '2. Bộ lọc & Tìm kiếm Dự án',
                description: 'Cách tìm nhanh các công trình đang thi công.',
                sections: [
                    {
                        title: 'Tìm kiếm hành trình thông minh',
                        content: 'Sử dụng thanh tìm kiếm để nhập mã JRN hoặc tên khách hàng. Kết hợp bộ lọc trạng thái "Đang thi công" để quản lý danh sách công việc hiệu quả.',
                        image: '/assets/docs/gs/gs_pro_journey_list.png'
                    }
                ]
            },
            {
                id: '3-tong-quan-hanh-trinh',
                title: '3. Tổng quan Hành trình chi tiết',
                description: 'Xem thông tin 360 độ về một dự án cụ thể.',
                sections: [
                    {
                        title: 'Thông tin định danh công trình',
                        content: 'Tại màn hình chi tiết, Giám sát có thể xem: Địa chỉ thi công chính xác (vị trí GPS), số điện thoại khách hàng, tiến độ hoàn thành hiện tại và thanh Timeline kế hoạch.',
                        image: '/assets/docs/gs/gs_pro_journey_overview.png'
                    }
                ]
            },
            {
                id: '4-tra-cuu-nhat-ky',
                title: '4. Tra cứu Nhật ký & Ảnh hiện trường',
                description: 'Xem lại lịch sử thi công và ảnh chụp minh chứng.',
                sections: [
                    {
                        title: 'Dòng thời gian sự kiện',
                        content: 'Tab "Nhật ký thi công" hiển thị mọi cập nhật từ ngày khởi công. Bạn có thể nhấn vào từng dòng để xem lại các ảnh chụp hiện trường và ghi chú kỹ thuật của đồng nghiệp hoặc chính mình.',
                        image: '/assets/docs/gs/gs_pro_journey_timeline.png'
                    }
                ]
            },
            {
                id: '5-cap-nhat-tien-do-phan-1',
                title: '5. Cập nhật tiến độ: Thông tin chung',
                description: 'Khởi tạo báo cáo tiến độ hàng ngày (Phần 1).',
                sections: [
                    {
                        title: 'Ghi nhận khối lượng hoàn thành',
                        content: 'Nhấn nút "Cập nhật tiến độ". Giám sát thực hiện chọn hạng mục công việc đang làm (ví dụ: Chống thấm sàn) và kéo thanh trượt % tương ứng với thực tế thi công.',
                        image: '/assets/docs/gs/gs_pro_log_form_1.png'
                    }
                ]
            },
            {
                id: '6-cap-nhat-tien-do-phan-2',
                title: '6. Cập nhật tiến độ: Ghi chú & Hình ảnh',
                description: 'Hoàn tất báo cáo với minh chứng thực tế (Phần 2).',
                sections: [
                    {
                        title: 'Minh chứng hình ảnh hiện trường',
                        content: 'Tại phần dưới của Form, nhập chi tiết các công việc đã làm. Lưu ý: Phải chụp ít nhất 1-2 ảnh thực tế để PM và khách hàng có thể giám sát từ xa.',
                        image: '/assets/docs/gs/gs_pro_log_form_2.png',
                        alert: {
                            type: 'tip',
                            text: 'Ghi chú "Bài học kinh nghiệm" (Field lessons) nếu có các phát sinh kỹ thuật cần lưu ý cho các đợt thi công sau.'
                        }
                    }
                ]
            },
            {
                id: '7-quan-ly-tai-lieu',
                title: '7. Quản lý Tài liệu & Bản vẽ',
                description: 'Tra cứu hồ sơ kỹ thuật ngay tại công trường.',
                sections: [
                    {
                        title: 'Bản vẽ & Biên bản điện tử',
                        content: 'Hồ sơ dự án bao gồm bản vẽ 2D, giải pháp thi công và ảnh khảo sát hiện trạng. Toàn bộ được lưu trữ tập trung, giúp Giám sát tra cứu nhanh các thông số kỹ thuật mà không cần hồ sơ giấy.',
                        image: '/assets/docs/gs/gs_pro_documents.png'
                    }
                ]
            },
            {
                id: '8-doi-soat-vat-tu',
                title: '8. Đối soát & Kiểm nhận Vật tư',
                description: 'Xác nhận vật tư chuyển đến công trình.',
                sections: [
                    {
                        title: 'Quy trình kiểm nhập thực tế',
                        content: 'Khi vật tư từ kho đổ về, Giám sát mở danh sách "Vật tư" của dự án để đối soát chủng loại và số lượng. Nhấn xác nhận để ghi nhận vật tư đã nhập vào công trường.',
                        image: '/assets/docs/gs/gs_pro_materials.png',
                        alert: {
                            type: 'important',
                            text: 'Mọi sai lệch số lượng cần được ghi chú và báo về bộ phận Kho ngay tại thời điểm giao hàng.'
                        }
                    }
                ]
            },
            {
                id: '9-ky-duyet-ban-giao',
                title: '9. Quy trình Ký duyệt & Bàn giao',
                description: 'Xác nhận hoàn thành giai đoạn thi công.',
                sections: [
                    {
                        title: 'Lấy chữ ký điện tử',
                        content: 'Khi kết thúc các hạng mục then chốt, Giám sát thực hiện lấy chữ ký xác nhận của khách hàng trực tiếp trên màn hình điện thoại để hoàn tất quy trình bàn giao điện tử.',
                        image: '/assets/docs/gs/gs_pro_handover.png'
                    }
                ]
            },
            {
                id: '10-chuyen-quyen-thiet-lap',
                title: '10. Chuyển quyền & Thiết lập cá nhân',
                description: 'Tùy chỉnh tài khoản và thay đổi vai trò.',
                sections: [
                    {
                        title: 'Cá nhân hóa trải nghiệm',
                        content: 'Sử dụng menu "Chuyển quyền nhanh" để linh hoạt hỗ trợ các bộ phận khác. Tại trang Cá nhân, bạn có thể quản lý lịch sử thông báo và bảo mật tài khoản.',
                        image: '/assets/docs/gs/gs_pro_switching.png'
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
                            text: 'Thông tin khảo sát là cơ sở để lập dự toán, hãy đảm báo các vị trí nứt/thấm được mô tả chính xác.'
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
