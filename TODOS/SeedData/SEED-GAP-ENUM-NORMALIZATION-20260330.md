# Xác Nhận Chuẩn Enum Canonical

## Kết luận đã được chốt
- User đã xác nhận các enum dạng lowercase là đúng.
- Backend schema BAC là nguồn sự thật duy nhất cho batch seed hiện tại.
- Frontend legacy enum viết hoa hoặc khác chuẩn không còn là tiêu chí quyết định cho dữ liệu seed.

## Phạm vi áp dụng
- Các seed mới tiếp tục dùng lowercase với mọi enum mà backend schema hiện lưu ở lowercase, ví dụ:
  `new`, `in_progress`, `approved`, `pending`, `published`, `warranty_aftercare`.
- Với các schema mà backend đang dùng enum uppercase thật sự, seed sẽ giữ đúng uppercase theo schema, ví dụ:
  `REQUEST_OUT`, `RECEIVED`, `INVESTIGATING`.

## Tác động tới batch hiện tại
- Không còn blocker về việc `MKT` hay `mkt`.
- Không cần giữ tương thích với enum legacy của frontend trong giai đoạn tạo file seed.
- Batch seed sẽ được xây theo đúng enum khai báo tại backend schema từng bảng.

## Hướng xử lý tiếp theo
- Phase 2 import MCP sẽ resolve dữ liệu dựa trên backend schema, không normalize theo frontend.
- Nếu sau này frontend cần chạy với enum legacy, đó là một batch đồng bộ UI riêng, không ảnh hưởng quyết định dữ liệu seed hiện tại.
