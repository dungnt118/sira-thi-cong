# Audit Mock Data Usage Report

Báo cáo rà soát việc sử dụng dữ liệu inline (cứng tại chỗ) so với dữ liệu từ nguồn mockdata tập trung tại các trang thuộc các vai trò của người dùng.

## 1. Project Manager (PM)

| Trang | Trạng thái | Thông tin xung đột | Đề xuất hướng xử lý |
| :--- | :--- | :--- | :--- |
| **Project Management Dashboard** | 🔴 Inline Data | Sử dụng `kpiData`, `recentProjects`, `recentPayments`, `notifications` khai báo cứng trong file. Các dự án này không tồn tại trong `mockData.ts`. | Thay thế bằng cách import `mockProjects` và `mockMilestones` từ `src/data/mockData.ts`. Tính toán các KPI (thẻ Statistic) bằng cách aggregate từ mảng project. |
| **Project List** | 🔴 Inline Data | Khai báo lại mảng `mockProjects` riêng (8 dự án) ngay trong file. Có sự không nhất quán về trạng thái (ví dụ "Chậm tiến độ") và màu sắc so với data chung. | Loại bỏ mảng `mockProjects` nội bộ. Import và sử dụng `mockProjects` từ `src/data/mockData.ts`. Sử dụng chung các mapping màu sắc trạng thái. |
| Customer List | 🟢 Đồng bộ | Đã sử dụng `mockCustomers` từ `src/data/mockData.ts`. | Không cần xử lý. |
| Pipeline (Kanban) | 🟢 Đồng bộ | Đã sử dụng `mockServiceRequests` và `mockPipelines` từ `src/data/mockData.ts`. | Không cần xử lý. |
| Journey List | 🟢 Đồng bộ | Đã sử dụng `mockJourneys` từ `src/data/journeyMockData.ts`. | Không cần xử lý. |
| Action Center | 🟢 Đồng bộ | Đã sử dụng `mockActionItems` từ `src/data/journeyMockData.ts`. | Không cần xử lý. |

---

## 2. Sale (Kinh doanh)

| Trang | Trạng thái | Thông tin xung đột | Đề xuất hướng xử lý |
| :--- | :--- | :--- | :--- |
| Journey Inbox | 🟢 Đồng bộ | Đã sử dụng `mockJourneys` từ `src/data/journeyMockData.ts`. | Không cần xử lý. |

---

## 3. Giám sát / Supervisor

| Trang | Trạng thái | Thông tin xung đột | Đề xuất hướng xử lý |
| :--- | :--- | :--- | :--- |
| Dashboard GS | 🟢 Đồng bộ | Đã sử dụng `mockProjects` từ `src/data/mockData.ts`. | Không cần xử lý. |

---

## 4. Kỹ thuật / Technical

| Trang | Trạng thái | Thông tin xung đột | Đề xuất hướng xử lý |
| :--- | :--- | :--- | :--- |
| Dashboard KT | 🟢 Đồng bộ | Đã sử dụng `mockJourneys` từ `src/data/journeyMockData.ts`. | Không cần xử lý. |

---

## 5. Kế toán / Accountant

| Trang | Trạng thái | Thông tin xung đột | Đề xuất hướng xử lý |
| :--- | :--- | :--- | :--- |
| Inventory Dashboard | 🟢 Đồng bộ | Đã sử dụng `mockMaterials` và `mockStockOrders` từ `src/data/mockData.ts`. | Không cần xử lý. |
| Finance Dashboard | 🟢 Đồng bộ | Đã sử dụng `mockMilestones` từ `src/data/mockData.ts`. | Không cần xử lý. |

---

## 6. Admin

| Trang | Trạng thái | Thông tin xung đột | Đề xuất hướng xử lý |
| :--- | :--- | :--- | :--- |
| **Admin Dashboard V2** | 🔴 Inline Data | Sử dụng `metrics` và `recentActivities` khai báo cứng. Thông tin số lượng người dùng (24), dự án (47) là số ảo. | Thay thế `metrics` bằng các phép tính aggregate từ `mockUsers`, `mockProjects`, `mockMilestones`. Mock data cho `recentActivities` nên được lấy từ một mảng log tập trung nếu có hoặc generate từ các hành động gần đây của mock data. |

---

## 7. Tổng kết & Đề xuất chung

### Vấn đề chính:
- **PM Dashboard** và **Admin Dashboard** là hai khu vực quan trọng nhưng đang bị "tách rời" khỏi luồng dữ liệu chung của hệ thống.
- Việc này dẫn đến khi người dùng tạo mới khách hàng hay dự án ở các màn hình khác, kết quả không được phản ánh lên Dashboard, tạo cảm giác tính năng chưa hoàn thiện (broken).

### Hướng xử lý đề xuất:
1.  **Chuyển đổi PM Dashboard**: Ưu tiên 1. Cần viết các selector hoặc helper function để aggregate dữ liệu từ `mockProjects` thành các chỉ số KPI.
2.  **Đồng bộ Project List**: Đảm bảo tất cả các màn hình hiển thị dự án đều nhìn thấy cùng một tập hợp dữ liệu từ `mockData.ts`.
3.  **Tập trung hóa Metadata**: Các hằng số về màu sắc trạng thái (`statusColor`) nên được đưa vào một file cấu hình hoặc file types chung để tránh copy-paste và sai lệch màu sắc giữa các trang.
