# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\customer-journey\customer-journey-lifecycle.spec.ts >> Customer Journey Lifecycle - Create and Update Steps >> P1: Tạo mới Customer Journey từ danh sách
- Location: test\e2e\customer-journey\customer-journey-lifecycle.spec.ts:14:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('.ant-select-item-option-content').filter({ hasText: /Thi công/i }).first()

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e4]:
    - complementary [ref=e5]:
      - generic [ref=e7]:
        - generic [ref=e8]:
          - img "Logo" [ref=e10]
          - generic [ref=e11]: Quản lý dự án
        - menu [ref=e13]:
          - menuitem "dashboard Dashboard" [ref=e14] [cursor=pointer]:
            - img "dashboard" [ref=e15]:
              - img [ref=e16]
            - generic [ref=e18]: Dashboard
          - menuitem "node-index Công trình Khách hàng" [expanded] [ref=e19] [cursor=pointer]:
            - img "node-index" [ref=e20]:
              - img [ref=e21]
            - generic [ref=e23]: Công trình Khách hàng
          - menu [ref=e24]:
            - menuitem "unordered-list Danh sách yêu cầu" [ref=e25] [cursor=pointer]:
              - img "unordered-list" [ref=e26]:
                - img [ref=e27]
              - generic [ref=e29]: Danh sách yêu cầu
            - menuitem "team Danh sách Khách hàng" [ref=e30] [cursor=pointer]:
              - img "team" [ref=e31]:
                - img [ref=e32]
              - generic [ref=e34]: Danh sách Khách hàng
            - menuitem "user-add Thêm Khách hàng mới" [ref=e35] [cursor=pointer]:
              - img "user-add" [ref=e36]:
                - img [ref=e37]
              - generic [ref=e39]: Thêm Khách hàng mới
          - menuitem "inbox Kho Vật tư" [expanded] [ref=e40] [cursor=pointer]:
            - img "inbox" [ref=e41]:
              - img [ref=e42]
            - generic [ref=e44]: Kho Vật tư
          - menu [ref=e45]:
            - menuitem "inbox Danh mục Vật tư" [ref=e46] [cursor=pointer]:
              - img "inbox" [ref=e47]:
                - img [ref=e48]
              - generic [ref=e50]: Danh mục Vật tư
            - menuitem "export Tạo phiếu xuất" [ref=e51] [cursor=pointer]:
              - img "export" [ref=e52]:
                - img [ref=e53]
              - generic [ref=e55]: Tạo phiếu xuất
            - menuitem "export Tạo phiếu mượn" [ref=e56] [cursor=pointer]:
              - img "export" [ref=e57]:
                - img [ref=e58]
              - generic [ref=e60]: Tạo phiếu mượn
            - menuitem "history Lịch sử xuất/nhập" [ref=e61] [cursor=pointer]:
              - img "history" [ref=e62]:
                - img [ref=e63]
              - generic [ref=e65]: Lịch sử xuất/nhập
          - menuitem "dollar Tài chính" [expanded] [ref=e66] [cursor=pointer]:
            - img "dollar" [ref=e67]:
              - img [ref=e68]
            - generic [ref=e70]: Tài chính
          - menu [ref=e71]:
            - menuitem "Tài chính Dự án" [ref=e72] [cursor=pointer]:
              - generic [ref=e73]: Tài chính Dự án
            - menuitem "dollar Phiếu Yêu cầu chi" [ref=e74] [cursor=pointer]:
              - img "dollar" [ref=e75]:
                - img [ref=e76]
              - generic [ref=e78]: Phiếu Yêu cầu chi
            - menuitem "Mốc Thanh toán" [ref=e79] [cursor=pointer]:
              - generic [ref=e80]: Mốc Thanh toán
          - menuitem "team Quản lý Đội/Thợ" [expanded] [ref=e81] [cursor=pointer]:
            - img "team" [ref=e82]:
              - img [ref=e83]
            - generic [ref=e85]: Quản lý Đội/Thợ
          - menu [ref=e86]:
            - menuitem "team Quản lý Thợ" [ref=e87] [cursor=pointer]:
              - img "team" [ref=e88]:
                - img [ref=e89]
              - generic [ref=e91]: Quản lý Thợ
            - menuitem "team Quản lý Đội thợ" [ref=e92] [cursor=pointer]:
              - img "team" [ref=e93]:
                - img [ref=e94]
              - generic [ref=e96]: Quản lý Đội thợ
            - menuitem "dollar Trình độ thợ" [ref=e97] [cursor=pointer]:
              - img "dollar" [ref=e98]:
                - img [ref=e99]
              - generic [ref=e101]: Trình độ thợ
          - menuitem "bar-chart Báo Cáo" [ref=e102] [cursor=pointer]:
            - img "bar-chart" [ref=e103]:
              - img [ref=e104]
            - generic [ref=e106]: Báo Cáo
          - menuitem "setting Cấu hình" [ref=e107] [cursor=pointer]:
            - img "setting" [ref=e108]:
              - img [ref=e109]
            - generic [ref=e111]: Cấu hình
      - img "left" [ref=e113] [cursor=pointer]:
        - img [ref=e114]
    - generic [ref=e116]:
      - banner [ref=e117]:
        - generic [ref=e119]:
          - generic [ref=e120]:
            - img "Logo" [ref=e121]
            - generic [ref=e122]: Quản lý dự án
          - generic [ref=e124]:
            - generic [ref=e125]:
              - img "search" [ref=e127]:
                - img [ref=e128]
              - searchbox "Tìm kiếm dự án, đội nhóm..." [ref=e130]
            - button "search" [ref=e133] [cursor=pointer]:
              - img "search" [ref=e135]:
                - img [ref=e136]
          - generic [ref=e138]:
            - button "bell" [ref=e140] [cursor=pointer]:
              - img "bell" [ref=e142]:
                - img [ref=e143]
            - generic [ref=e145] [cursor=pointer]:
              - img "user" [ref=e148]:
                - img [ref=e149]
              - generic [ref=e151]: lamnguyen.sira@gmail.com
      - main [ref=e152]:
        - navigation [ref=e154]:
          - list [ref=e155]:
            - listitem [ref=e156]:
              - link "home" [ref=e158] [cursor=pointer]:
                - /url: /
                - img "home" [ref=e159]:
                  - img [ref=e160]
            - listitem [ref=e162]: /
            - listitem [ref=e163]:
              - link "Tổng Quan" [ref=e165] [cursor=pointer]:
                - /url: /admin
            - listitem [ref=e166]: /
            - listitem [ref=e167]:
              - link "Tổng Quan" [ref=e169] [cursor=pointer]:
                - /url: /admin/ql
            - listitem [ref=e170]: /
            - listitem [ref=e171]: journeys
        - generic [ref=e172]:
          - generic [ref=e173]:
            - generic [ref=e174]:
              - heading "Danh sách công trình Khách hàng" [level=2] [ref=e175]
              - text: Quản lý toàn bộ công trình dịch vụ theo cấu hình chuẩn 12 bước
            - generic [ref=e177]:
              - button "plus Tạo yêu cầu" [ref=e179] [cursor=pointer]:
                - img "plus" [ref=e181]:
                  - img [ref=e182]
                - generic [ref=e185]: Tạo yêu cầu
              - button "layout Board" [ref=e187] [cursor=pointer]:
                - img "layout" [ref=e189]:
                  - img [ref=e190]
                - generic [ref=e192]: Board
              - button "alert Action" [ref=e194] [cursor=pointer]:
                - img "alert" [ref=e196]:
                  - img [ref=e197]
                - generic [ref=e199]: Action
              - button "reload Làm mới" [ref=e201] [cursor=pointer]:
                - img "reload" [ref=e203]:
                  - img [ref=e204]
                - generic [ref=e206]: Làm mới
          - generic [ref=e207]:
            - generic [ref=e211]:
              - generic [ref=e212]: Đang mở
              - generic [ref=e213]:
                - img "unordered-list" [ref=e215]:
                  - img [ref=e216]
                - generic [ref=e218]: "7"
            - generic [ref=e222]:
              - generic [ref=e223]: Quá SLA
              - generic [ref=e224]:
                - img "clock-circle" [ref=e226]:
                  - img [ref=e227]
                - generic [ref=e230]: "0"
            - generic [ref=e234]:
              - generic [ref=e235]: Có Blocker
              - generic [ref=e236]:
                - img "exclamation-circle" [ref=e238]:
                  - img [ref=e239]
                - generic [ref=e242]: "0"
            - generic [ref=e246]:
              - generic [ref=e247]: Tin nhắn Portal
              - generic [ref=e248]:
                - img "message" [ref=e250]:
                  - img [ref=e251]
                - generic [ref=e253]: "0"
          - generic [ref=e255]:
            - generic [ref=e256]:
              - generic [ref=e258]:
                - img "search" [ref=e260]:
                  - img [ref=e261]
                - textbox "Tìm kiếm công trình..." [ref=e263]
              - generic [ref=e266] [cursor=pointer]:
                - generic [ref=e268]:
                  - combobox [ref=e270]
                  - generic "Tất cả bước" [ref=e271]
                - generic:
                  - img:
                    - img
              - generic [ref=e273] [cursor=pointer]:
                - generic [ref=e275]:
                  - combobox [ref=e277]
                  - generic "Tất cả SLA" [ref=e278]
                - generic:
                  - img:
                    - img
              - generic [ref=e280] [cursor=pointer]:
                - generic [ref=e282]:
                  - combobox [ref=e284]
                  - generic "Tất cả ưu tiên" [ref=e285]
                - generic:
                  - img:
                    - img
              - button "Xóa lọc" [ref=e287] [cursor=pointer]:
                - generic [ref=e288]: Xóa lọc
            - generic [ref=e292]:
              - table [ref=e296]:
                - rowgroup [ref=e308]:
                  - row "Select all Công trình Yêu cầu / Dịch vụ Bước hiện tại Phụ trách SLA Ưu tiên Blocker Cập nhật Thao tác" [ref=e309]:
                    - columnheader "Select all" [ref=e310]:
                      - checkbox "Select all" [ref=e314] [cursor=pointer]
                    - columnheader "Công trình" [ref=e316]
                    - columnheader "Yêu cầu / Dịch vụ" [ref=e317]
                    - columnheader "Bước hiện tại" [ref=e318]
                    - columnheader "Phụ trách" [ref=e319]
                    - columnheader "SLA" [ref=e320]
                    - columnheader "Ưu tiên" [ref=e321]
                    - columnheader "Blocker" [ref=e322]
                    - columnheader "Cập nhật" [ref=e323]
                    - columnheader "Thao tác" [ref=e324]
                - rowgroup [ref=e325]:
                  - row "YCDV-20260411-0002 Dũng Nguyễn Yêu cầu Xử lý thấm - Dũng Nguyễn Giải pháp user Chưa gán Đúng hạn Trung bình stop N/A more" [ref=e326] [cursor=pointer]:
                    - cell [ref=e327]:
                      - checkbox [ref=e330]
                    - cell "YCDV-20260411-0002 Dũng Nguyễn" [ref=e332]:
                      - generic [ref=e333]:
                        - generic [ref=e334]: YCDV-20260411-0002
                        - text: Dũng Nguyễn
                    - cell "Yêu cầu Xử lý thấm - Dũng Nguyễn" [ref=e335]:
                      - generic [ref=e337]: Yêu cầu Xử lý thấm - Dũng Nguyễn
                    - cell "Giải pháp" [ref=e338]:
                      - generic [ref=e339]: Giải pháp
                    - cell "user Chưa gán" [ref=e340]:
                      - generic [ref=e341]:
                        - img "user" [ref=e344]:
                          - img [ref=e345]
                        - generic [ref=e347]: Chưa gán
                    - cell "Đúng hạn" [ref=e348]:
                      - generic [ref=e349]: Đúng hạn
                    - cell "Trung bình" [ref=e351]:
                      - generic [ref=e352]: Trung bình
                    - cell "stop" [ref=e353]:
                      - img "stop" [ref=e354]:
                        - img [ref=e355]
                    - cell "N/A" [ref=e357]
                    - cell "more" [ref=e358]:
                      - button "more" [ref=e359]:
                        - img "more" [ref=e361]:
                          - img [ref=e362]
                  - row "YCDV-20260406-0001 Nguyen Tuan Dung Chống thấm tường ẩm Khởi tạo user Chưa gán Đúng hạn Cao stop N/A more" [ref=e364] [cursor=pointer]:
                    - cell [ref=e365]:
                      - checkbox [ref=e368]
                    - cell "YCDV-20260406-0001 Nguyen Tuan Dung" [ref=e370]:
                      - generic [ref=e371]:
                        - generic [ref=e372]: YCDV-20260406-0001
                        - text: Nguyen Tuan Dung
                    - cell "Chống thấm tường ẩm" [ref=e373]:
                      - generic [ref=e375]: Chống thấm tường ẩm
                    - cell "Khởi tạo" [ref=e376]:
                      - generic [ref=e377]: Khởi tạo
                    - cell "user Chưa gán" [ref=e378]:
                      - generic [ref=e379]:
                        - img "user" [ref=e382]:
                          - img [ref=e383]
                        - generic [ref=e385]: Chưa gán
                    - cell "Đúng hạn" [ref=e386]:
                      - generic [ref=e387]: Đúng hạn
                    - cell "Cao" [ref=e389]:
                      - generic [ref=e390]: Cao
                    - cell "stop" [ref=e391]:
                      - img "stop" [ref=e392]:
                        - img [ref=e393]
                    - cell "N/A" [ref=e395]
                    - cell "more" [ref=e396]:
                      - button "more" [ref=e397]:
                        - img "more" [ref=e399]:
                          - img [ref=e400]
                  - row "JRN-TEST-100 Nguyen New Customer Test Flow for New Customer Nghiệm thu user Chưa gán Đúng hạn Cao stop N/A more" [ref=e402] [cursor=pointer]:
                    - cell [ref=e403]:
                      - checkbox [ref=e406]
                    - cell "JRN-TEST-100 Nguyen New Customer" [ref=e408]:
                      - generic [ref=e409]:
                        - generic [ref=e410]: JRN-TEST-100
                        - text: Nguyen New Customer
                    - cell "Test Flow for New Customer" [ref=e411]:
                      - generic [ref=e413]: Test Flow for New Customer
                    - cell "Nghiệm thu" [ref=e414]:
                      - generic [ref=e415]: Nghiệm thu
                    - cell "user Chưa gán" [ref=e416]:
                      - generic [ref=e417]:
                        - img "user" [ref=e420]:
                          - img [ref=e421]
                        - generic [ref=e423]: Chưa gán
                    - cell "Đúng hạn" [ref=e424]:
                      - generic [ref=e425]: Đúng hạn
                    - cell "Cao" [ref=e427]:
                      - generic [ref=e428]: Cao
                    - cell "stop" [ref=e429]:
                      - img "stop" [ref=e430]:
                        - img [ref=e431]
                    - cell "N/A" [ref=e433]
                    - cell "more" [ref=e434]:
                      - button "more" [ref=e435]:
                        - img "more" [ref=e437]:
                          - img [ref=e438]
                  - row "JRN-FINAL-001 Final Test Success Yeu cau final test Khảo sát user Chưa gán Đúng hạn Trung bình stop N/A more" [ref=e440] [cursor=pointer]:
                    - cell [ref=e441]:
                      - checkbox [ref=e444]
                    - cell "JRN-FINAL-001 Final Test Success" [ref=e446]:
                      - generic [ref=e447]:
                        - generic [ref=e448]: JRN-FINAL-001
                        - text: Final Test Success
                    - cell "Yeu cau final test" [ref=e449]:
                      - generic [ref=e451]: Yeu cau final test
                    - cell "Khảo sát" [ref=e452]:
                      - generic [ref=e453]: Khảo sát
                    - cell "user Chưa gán" [ref=e454]:
                      - generic [ref=e455]:
                        - img "user" [ref=e458]:
                          - img [ref=e459]
                        - generic [ref=e461]: Chưa gán
                    - cell "Đúng hạn" [ref=e462]:
                      - generic [ref=e463]: Đúng hạn
                    - cell "Trung bình" [ref=e465]:
                      - generic [ref=e466]: Trung bình
                    - cell "stop" [ref=e467]:
                      - img "stop" [ref=e468]:
                        - img [ref=e469]
                    - cell "N/A" [ref=e471]
                    - cell "more" [ref=e472]:
                      - button "more" [ref=e473]:
                        - img "more" [ref=e475]:
                          - img [ref=e476]
                  - row "JRN-2026-003 Nguyen Van Perfect Yêu cầu cải tạo chống thấm khách sạn MayFair quotation_sent user Chưa gán Đúng hạn Khẩn cấp stop 12/3/2026 more" [ref=e478] [cursor=pointer]:
                    - cell [ref=e479]:
                      - checkbox [ref=e482]
                    - cell "JRN-2026-003 Nguyen Van Perfect" [ref=e484]:
                      - generic [ref=e485]:
                        - generic [ref=e486]: JRN-2026-003
                        - text: Nguyen Van Perfect
                    - cell "Yêu cầu cải tạo chống thấm khách sạn MayFair" [ref=e487]:
                      - generic [ref=e489]: Yêu cầu cải tạo chống thấm khách sạn MayFair
                    - cell "quotation_sent" [ref=e490]:
                      - generic [ref=e491]: quotation_sent
                    - cell "user Chưa gán" [ref=e492]:
                      - generic [ref=e493]:
                        - img "user" [ref=e496]:
                          - img [ref=e497]
                        - generic [ref=e499]: Chưa gán
                    - cell "Đúng hạn" [ref=e500]:
                      - generic [ref=e501]: Đúng hạn
                    - cell "Khẩn cấp" [ref=e503]:
                      - generic [ref=e504]: Khẩn cấp
                    - cell "stop" [ref=e505]:
                      - img "stop" [ref=e506]:
                        - img [ref=e507]
                    - cell "12/3/2026" [ref=e509]
                    - cell "more" [ref=e510]:
                      - button "more" [ref=e511]:
                        - img "more" [ref=e513]:
                          - img [ref=e514]
                  - row "JRN-2026-002 Khách hàng ẩn danh Yêu cầu xử lý thấm tường nhà anh Dương Giải pháp user Chưa gán Đúng hạn Trung bình stop 28/3/2026 more" [ref=e516] [cursor=pointer]:
                    - cell [ref=e517]:
                      - checkbox [ref=e520]
                    - cell "JRN-2026-002 Khách hàng ẩn danh" [ref=e522]:
                      - generic [ref=e523]:
                        - generic [ref=e524]: JRN-2026-002
                        - text: Khách hàng ẩn danh
                    - cell "Yêu cầu xử lý thấm tường nhà anh Dương" [ref=e525]:
                      - generic [ref=e527]: Yêu cầu xử lý thấm tường nhà anh Dương
                    - cell "Giải pháp" [ref=e528]:
                      - generic [ref=e529]: Giải pháp
                    - cell "user Chưa gán" [ref=e530]:
                      - generic [ref=e531]:
                        - img "user" [ref=e534]:
                          - img [ref=e535]
                        - generic [ref=e537]: Chưa gán
                    - cell "Đúng hạn" [ref=e538]:
                      - generic [ref=e539]: Đúng hạn
                    - cell "Trung bình" [ref=e541]:
                      - generic [ref=e542]: Trung bình
                    - cell "stop" [ref=e543]:
                      - img "stop" [ref=e544]:
                        - img [ref=e545]
                    - cell "28/3/2026" [ref=e547]
                    - cell "more" [ref=e548]:
                      - button "more" [ref=e549]:
                        - img "more" [ref=e551]:
                          - img [ref=e552]
                  - row "JRN-2026-001 Anh Kien Yêu cầu chống thấm sân thượng nhà anh Kiên project_execution user Chưa gán Có rủi ro Cao stop 16/3/2026 more" [ref=e554] [cursor=pointer]:
                    - cell [ref=e555]:
                      - checkbox [ref=e558]
                    - cell "JRN-2026-001 Anh Kien" [ref=e560]:
                      - generic [ref=e561]:
                        - generic [ref=e562]: JRN-2026-001
                        - text: Anh Kien
                    - cell "Yêu cầu chống thấm sân thượng nhà anh Kiên" [ref=e563]:
                      - generic [ref=e565]: Yêu cầu chống thấm sân thượng nhà anh Kiên
                    - cell "project_execution" [ref=e566]:
                      - generic [ref=e567]: project_execution
                    - cell "user Chưa gán" [ref=e568]:
                      - generic [ref=e569]:
                        - img "user" [ref=e572]:
                          - img [ref=e573]
                        - generic [ref=e575]: Chưa gán
                    - cell "Có rủi ro" [ref=e576]:
                      - generic [ref=e577]: Có rủi ro
                    - cell "Cao" [ref=e579]:
                      - generic [ref=e580]: Cao
                    - cell "stop" [ref=e581]:
                      - img "stop" [ref=e582]:
                        - img [ref=e583]
                    - cell "16/3/2026" [ref=e585]
                    - cell "more" [ref=e586]:
                      - button "more" [ref=e587]:
                        - img "more" [ref=e589]:
                          - img [ref=e590]
              - list [ref=e592]:
                - listitem [ref=e593]: 7 công trình
                - listitem "Trang Trước" [ref=e594]:
                  - button "left" [disabled] [ref=e595]:
                    - img "left" [ref=e596]:
                      - img [ref=e597]
                - listitem "1" [ref=e599] [cursor=pointer]:
                  - generic [ref=e600]: "1"
                - listitem "Trang Kế" [ref=e601]:
                  - button "right" [disabled] [ref=e602]:
                    - img "right" [ref=e603]:
                      - img [ref=e604]
  - dialog "Tạo công trình mới" [ref=e607]:
    - generic [ref=e609]:
      - button "Đóng" [ref=e610] [cursor=pointer]:
        - img "close" [ref=e611]:
          - img [ref=e612]
      - generic [ref=e614]: Tạo công trình mới
    - generic [ref=e618]:
      - separator [ref=e619]:
        - generic [ref=e621]:
          - img "user" [ref=e623]:
            - img [ref=e624]
          - strong [ref=e628]: Thông tin Khách hàng (Ưu tiên SĐT)
      - generic [ref=e629]:
        - generic [ref=e632]:
          - generic "Số điện thoại" [ref=e634]: "* Số điện thoại"
          - generic [ref=e642] [cursor=pointer]:
            - img "phone" [ref=e644]:
              - img [ref=e645]
            - combobox "* Số điện thoại" [ref=e647]: "0972688406"
        - generic [ref=e650]:
          - generic "Họ và tên" [ref=e652]: "* Họ và tên"
          - generic [ref=e656]:
            - img "user" [ref=e658]:
              - img [ref=e659]
            - textbox "* Họ và tên" [ref=e661]:
              - /placeholder: Tự động nhận diện hoặc nhập mới
              - text: Khách hàng Test
      - generic [ref=e662]:
        - generic [ref=e665]:
          - generic "Email" [ref=e667]
          - generic [ref=e671]:
            - img "mail" [ref=e673]:
              - img [ref=e674]
            - textbox "Email" [ref=e676]:
              - /placeholder: abc@gmail.com
        - generic [ref=e679]:
          - generic "Địa chỉ liên hệ" [ref=e681]
          - generic [ref=e685]:
            - img "home" [ref=e687]:
              - img [ref=e688]
            - textbox "Địa chỉ liên hệ" [ref=e690]:
              - /placeholder: Số nhà, đường, phường...
      - generic [ref=e691]:
        - generic [ref=e694]:
          - generic "Tỉnh/Thành" [ref=e696]: "* Tỉnh/Thành"
          - textbox "* Tỉnh/Thành" [ref=e700]:
            - /placeholder: "VD: Hà Nội"
            - text: Hà Nội
        - generic [ref=e703]:
          - generic "Phường/Xã" [ref=e705]: "* Phường/Xã"
          - textbox "* Phường/Xã" [ref=e709]:
            - /placeholder: "VD: Dịch Vọng"
            - text: Dịch Vọng
      - separator [ref=e710]:
        - generic [ref=e712]:
          - img "info-circle" [ref=e714]:
            - img [ref=e715]
          - strong [ref=e720]: Thông tin Công trình & Kỹ thuật
      - generic [ref=e721]:
        - generic [ref=e724]:
          - generic "Mã công trình" [ref=e726]
          - textbox "Mã công trình" [ref=e730]:
            - /placeholder: "VD: HN-2024-001 (Để trống để tự động tạo)"
        - generic [ref=e733]:
          - generic "Tiêu đề yêu cầu" [ref=e735]: "* Tiêu đề yêu cầu"
          - textbox "* Tiêu đề yêu cầu" [ref=e739]:
            - /placeholder: "VD: Khảo sát chống thấm sân thượng"
            - text: Journey Test 1776572684415
      - generic [ref=e740]:
        - generic [ref=e743]:
          - generic "Địa chỉ công trình" [ref=e745]
          - generic [ref=e749]:
            - img "home" [ref=e751]:
              - img [ref=e752]
            - textbox "Địa chỉ công trình" [ref=e754]:
              - /placeholder: Nếu khác địa chỉ liên hệ
        - generic [ref=e757]:
          - generic "Người phụ trách (PM)" [ref=e759]
          - generic [ref=e763] [cursor=pointer]:
            - generic [ref=e764]:
              - img "user" [ref=e766]:
                - img [ref=e767]
              - generic [ref=e769]:
                - combobox "Người phụ trách (PM)" [ref=e771]
                - generic "lamnguyen.sira@gmail.com" [ref=e772]
            - generic:
              - img:
                - img
      - separator [ref=e773]:
        - generic [ref=e775]:
          - img "customer-service" [ref=e777]:
            - img [ref=e778]
          - strong [ref=e782]: Chi tiết dịch vụ
      - generic [ref=e783]:
        - generic [ref=e786]:
          - generic "Loại dịch vụ" [ref=e788]
          - generic [ref=e792] [cursor=pointer]:
            - generic [ref=e794]:
              - combobox "Loại dịch vụ" [expanded] [active] [ref=e796]:
                - listbox:
                  - option "Cải tạo chống thấm mái tum": cai_tao_chong_tham_mai_tum
                  - option "Chống thấm sân thượng": chong_tham_san_thuong
              - generic: Chọn loại dịch vụ (Xây mới, Cải tạo...)
            - generic:
              - img:
                - img
        - generic [ref=e799]:
          - generic "Mức ưu tiên" [ref=e801]
          - generic [ref=e805] [cursor=pointer]:
            - generic [ref=e807]:
              - combobox "Mức ưu tiên" [ref=e809]
              - generic "Trung bình" [ref=e810]
            - generic:
              - img:
                - img
        - generic [ref=e813]:
          - generic "Kênh nguồn" [ref=e815]
          - generic [ref=e819] [cursor=pointer]:
            - generic [ref=e821]:
              - combobox "Kênh nguồn" [ref=e823]
              - generic "Trực tiếp" [ref=e824]
            - generic:
              - img:
                - img
      - generic [ref=e825]:
        - generic [ref=e828]:
          - generic "Diện tích (m2)" [ref=e830]
          - generic [ref=e834]:
            - generic:
              - img "field-number":
                - img
            - generic [ref=e835]:
              - generic:
                - button "Increase Value" [ref=e836] [cursor=pointer]:
                  - img "up" [ref=e837]:
                    - img [ref=e838]
                - button "Decrease Value" [ref=e840] [cursor=pointer]:
                  - img "down" [ref=e841]:
                    - img [ref=e842]
              - spinbutton "Diện tích (m2)" [ref=e845]
        - generic [ref=e848]:
          - generic "Ngày thi công (Dự kiến)" [ref=e850]
          - generic [ref=e854]:
            - generic:
              - img "hourglass":
                - img
            - generic [ref=e855]:
              - generic:
                - button "Increase Value" [ref=e856] [cursor=pointer]:
                  - img "up" [ref=e857]:
                    - img [ref=e858]
                - button "Decrease Value" [ref=e860] [cursor=pointer]:
                  - img "down" [ref=e861]:
                    - img [ref=e862]
              - spinbutton "Ngày thi công (Dự kiến)" [ref=e865]
        - generic [ref=e868]:
          - generic "Độ phức tạp" [ref=e870]
          - generic [ref=e874] [cursor=pointer]:
            - generic [ref=e876]:
              - combobox "Độ phức tạp" [ref=e878]
              - generic: Chọn độ khó
            - img [ref=e879]:
              - img [ref=e880]
      - generic [ref=e882]:
        - generic [ref=e885]:
          - generic "Ngày khởi công (dự kiến)" [ref=e887]
          - generic [ref=e891]:
            - img "calendar" [ref=e893]:
              - img [ref=e894]
            - generic [ref=e896]:
              - textbox "Ngày khởi công (dự kiến)" [ref=e897]:
                - /placeholder: Chọn thời điểm
              - generic:
                - img "calendar":
                  - img
        - generic [ref=e900]:
          - generic "Ngày kết thúc (dự kiến)" [ref=e902]
          - generic [ref=e906]:
            - img "calendar" [ref=e908]:
              - img [ref=e909]
            - generic [ref=e911]:
              - textbox "Ngày kết thúc (dự kiến)" [ref=e912]:
                - /placeholder: Chọn thời điểm
              - generic:
                - img "calendar":
                  - img
      - generic [ref=e914]:
        - generic "Mô tả chi tiết yêu cầu" [ref=e916]
        - textbox "Mô tả chi tiết yêu cầu" [ref=e920]:
          - /placeholder: Nhập các ghi chú chi tiết từ khách hàng...
      - generic [ref=e922]:
        - button "Hủy" [ref=e924] [cursor=pointer]:
          - generic [ref=e925]: Hủy
        - button "Tạo mới" [ref=e927] [cursor=pointer]:
          - generic [ref=e928]: Tạo mới
  - generic [ref=e934]:
    - generic "Cải tạo chống thấm mái tum" [ref=e935] [cursor=pointer]:
      - generic [ref=e936]: Cải tạo chống thấm mái tum
    - generic "Chống thấm sân thượng" [ref=e937] [cursor=pointer]:
      - generic [ref=e938]: Chống thấm sân thượng
    - generic "Chống thấm sàn" [ref=e939] [cursor=pointer]:
      - generic [ref=e940]: Chống thấm sàn
```

# Test source

```ts
  1   | import { test, expect } from '../../fixtures/app.fixture';
  2   | import { AdminLayoutPage } from '../../page-objects/admin/AdminLayout';
  3   | import { savePassedTest } from '../../helpers/registry';
  4   | 
  5   | test.describe.serial('Customer Journey Lifecycle - Create and Update Steps', () => {
  6   |   const journeyTitle = `Journey Test ${Date.now()}`;
  7   |   const customChecklistItem = `Checklist Item ${Date.now()}`;
  8   |   let journeyId = '';
  9   | 
  10  |   test.beforeEach(async ({ page }) => {
  11  |     // Authentication is handled via storageState in playwright.config.ts
  12  |   });
  13  | 
  14  |   test('P1: Tạo mới Customer Journey từ danh sách', async ({ page }) => {
  15  |     const testName = 'Customer Journey Lifecycle - Create and Update Steps > P1: Tạo mới Customer Journey từ danh sách';
  16  |     const adminLayout = new AdminLayoutPage(page);
  17  | 
  18  |     // 1. Đi tới trang danh sách Journey
  19  |     await page.goto('/admin/ql/journeys');
  20  |     await expect(adminLayout.topBar).toBeVisible({ timeout: 15000 });
  21  | 
  22  |     // 2. Click nút "Tạo yêu cầu"
  23  |     await page.click('button:has-text("Tạo yêu cầu")');
  24  |     await page.waitForTimeout(1000); // Đợi drawer mở hẳn
  25  | 
  26  |     // 3. Điền form tạo mới (JourneyForm)
  27  |     await page.fill('input#customer_phone', `09${Date.now().toString().slice(-8)}`);
  28  |     await page.fill('input#customer_full_name', 'Khách hàng Test');
  29  |     await page.fill('input#customer_province', 'Hà Nội');
  30  |     await page.fill('input#customer_ward', 'Dịch Vọng');
  31  |     
  32  |     await page.fill('input#request_title', journeyTitle);
  33  |     
  34  |     // Chọn loại dịch vụ (MasterDataSelect)
  35  |     const serviceSelect = page.locator('.ant-select-selector').filter({ hasText: 'Chọn loại dịch vụ' });
  36  |     await serviceSelect.click();
  37  |     await page.waitForSelector('.ant-select-item-option');
  38  |     // Tìm và click option có chứa chữ "Thi công" (không phân biệt hoa thường hoặc khoảng trắng dư)
> 39  |     await page.locator('.ant-select-item-option-content').filter({ hasText: /Thi công/i }).first().click();
      |                                                                                                    ^ Error: locator.click: Test timeout of 30000ms exceeded.
  40  | 
  41  |     // Submit
  42  |     await page.click('button[type="submit"]:has-text("Tạo mới")');
  43  | 
  44  |     // 4. Kiểm tra message thành công and redirection
  45  |     await expect(page.locator('.ant-message-success')).toBeVisible();
  46  |     
  47  |     // Wait for the drawer to close
  48  |     await expect(page.locator('.ant-drawer-content')).not.toBeVisible();
  49  | 
  50  |     // 5. Tìm kiếm lại và vào chi tiết
  51  |     await page.fill('input[placeholder="Tìm kiếm công trình..."]', journeyTitle);
  52  |     const journeyLink = page.locator(`div:has-text("${journeyTitle}")`).first();
  53  |     await expect(journeyLink).toBeVisible();
  54  |     await journeyLink.click();
  55  | 
  56  |     // 6. Verify URL and extract ID
  57  |     await expect(page).toHaveURL(/\/admin\/ql\/journeys\/detail/);
  58  |     const url = page.url();
  59  |     const match = url.match(/detail\/([^/?]+)/);
  60  |     if (match) {
  61  |         journeyId = match[1];
  62  |         console.log(`Created Journey ID: ${journeyId}`);
  63  |     } else {
  64  |         throw new Error('Could not extract journeyId from URL: ' + url);
  65  |     }
  66  | 
  67  |     savePassedTest(testName);
  68  |   });
  69  | 
  70  |   test('P2: Cấu hình Customer Journey Step (Thêm checklist)', async ({ page }) => {
  71  |     const testName = 'Customer Journey Lifecycle - Create and Update Steps > P2: Cấu hình Customer Journey Step (Thêm checklist)';
  72  |     
  73  |     // 1. Đi tới trang cấu hình
  74  |     await page.goto('/admin/ql/settings/customer-journey');
  75  |     
  76  |     // 2. Chọn bước "Bước 02 - Tư vấn / liên hệ" (consult_contact)
  77  |     await page.click('.step-item:has-text("Bước 02")');
  78  |     
  79  |     // 3. Click "Chỉnh sửa"
  80  |     await page.click('button:has-text("Chỉnh sửa")');
  81  | 
  82  |     // 4. Thêm Checklist item mới
  83  |     await page.click('button:has-text("Thêm Nhiệm vụ Checklist")');
  84  |     
  85  |     // Ant Design Form.List uses indices. We assume the last one is the new one.
  86  |     const lastChecklistNameInput = page.locator('input[placeholder="Nhập tên nhiệm vụ..."]').last();
  87  |     await lastChecklistNameInput.fill(customChecklistItem);
  88  | 
  89  |     // 5. Lưu cấu hình
  90  |     await page.click('button:has-text("Cập nhật & Lưu")');
  91  |     await expect(page.locator('.ant-message-success')).toBeVisible();
  92  | 
  93  |     savePassedTest(testName);
  94  |   });
  95  | 
  96  |   test('P3: Thực hiện các bước trong Journey Detail 360', async ({ page }) => {
  97  |     const testName = 'Customer Journey Lifecycle - Create and Update Steps > P3: Thực hiện các bước trong Journey Detail 360';
  98  |     
  99  |     if (!journeyId) {
  100 |         throw new Error('No journeyId available for P3');
  101 |     }
  102 | 
  103 |     await page.goto(`/admin/ql/journeys/detail/${journeyId}`);
  104 |     
  105 |     // 1. Kiểm tra hiển thị các Steps
  106 |     await expect(page.locator('.ant-steps')).toBeVisible();
  107 | 
  108 |     // 2. Chuyển sang tab "Tư vấn"
  109 |     // URL support: /admin/ql/journeys/detail/:id?tab=GRP_02_CONTACT
  110 |     await page.click('.ant-tabs-tab:has-text("Tư vấn")');
  111 | 
  112 |     // 3. Kiểm tra Checklist item mới thêm ở P2 có xuất hiện không
  113 |     // Lưu ý: Journey Detail 360 có thể load config dynamic. 
  114 |     // Tuy nhiên, journey hiện tại có thể đã được "snapshot" nếu đã tạo trước đó.
  115 |     // Nhưng trong code JourneyDetail360.tsx nó gọi customerJourneySettingService.findSetting() 
  116 |     // để verify quyền và buildWorkTasks.
  117 |     
  118 |     // Ta sẽ kiểm tra sự tồn tại của checklist item trong UI
  119 |     await expect(page.locator(`text=${customChecklistItem}`)).toBeVisible({ timeout: 10000 });
  120 | 
  121 |     savePassedTest(testName);
  122 |   });
  123 | });
  124 | 
```