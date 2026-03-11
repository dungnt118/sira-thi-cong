export default function SurveyApp() {
  const sectionTitle = "text-lg font-semibold text-slate-800";
  const card = "bg-white rounded-2xl shadow-sm border border-slate-200 p-4 md:p-5";
  const label = "text-sm font-medium text-slate-700 mb-1";
  const input = "w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300 bg-white";
  const textarea = "w-full rounded-xl border border-slate-300 px-3 py-2 text-sm min-h-[96px] outline-none focus:ring-2 focus:ring-slate-300 bg-white";
  const chip = "px-3 py-2 rounded-xl border border-slate-300 text-sm bg-slate-50";
  const subCard = "rounded-2xl border border-dashed border-slate-300 p-4 bg-slate-50/60";

  const areaTypes = [
    "Mái tôn",
    "Tường đứng",
    "Nhà vệ sinh",
    "Sân thượng",
    "Ban công",
    "Mái bê tông",
    "Hộp kỹ thuật",
    "Cổ ống / xuyên sàn",
    "Khe tiếp giáp",
    "Khác"
  ];

  const issueTypes = [
    "Thấm nước",
    "Dột",
    "Nứt",
    "Rỉ sét",
    "Bong tróc",
    "Rêu mốc",
    "Đọng nước",
    "Rò rỉ quanh ống",
    "Hở mí / hở khe",
    "Xuống cấp lớp cũ"
  ];

  const causeOptions = [
    "Nguồn từ mưa tạt",
    "Từ mái / chồng mí",
    "Từ vít / phụ kiện",
    "Từ cổ ống",
    "Từ sàn tầng trên",
    "Từ tường ngoài",
    "Từ khe tiếp giáp",
    "Từ đường ống cấp thoát nước",
    "Chưa xác định"
  ];

  const safetyOptions = [
    "Làm việc trên cao",
    "Trơn trượt",
    "Gần điện",
    "Không gian hẹp",
    "Đang có người sử dụng",
    "Cần giàn giáo",
    "Cần dây an toàn",
    "Khó vận chuyển vật tư"
  ];

  const mediaChecklist = [
    "Ảnh toàn cảnh nhận diện khu vực",
    "Ảnh cận cảnh lỗi chính",
    "Ảnh có thước đo / vật chuẩn",
    "Video mô tả xuyên suốt khu vực",
    "Ảnh đường tiếp cận thi công",
    "Ảnh rủi ro / vật cản"
  ];

  const quantityRows = [
    ["Diện tích xử lý", "m²"],
    ["Chiều dài khe / nứt / mí", "md"],
    ["Số vị trí lỗi", "vị trí"],
    ["Cổ ống / chi tiết xuyên sàn", "cái"],
  ];

  const OptionGrid = ({ items, cols = 3 }) => (
    <div className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-${cols} gap-2`}>
      {items.map((item) => (
        <label key={item} className="flex items-start gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
          <input type="checkbox" className="mt-1" />
          <span>{item}</span>
        </label>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="mb-5 rounded-3xl bg-slate-900 text-white p-5 md:p-6 shadow-lg">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="text-sm uppercase tracking-[0.2em] text-slate-300">Khảo sát hiện trạng công trình</div>
              <h1 className="text-2xl md:text-3xl font-bold mt-1">Form khảo sát linh động phục vụ số hóa dữ liệu kỹ thuật</h1>
              <p className="text-slate-300 mt-2 max-w-3xl text-sm md:text-base">
                Thiết kế theo hướng phần mềm vận hành thực tế: chia theo khu vực khảo sát, có option dựng sẵn,
                hỗ trợ media, bóc tách khối lượng, đánh giá nguyên nhân, điều kiện thi công và cơ sở lên giải pháp.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 min-w-[280px]">
              <div className="rounded-2xl bg-white/10 p-3">
                <div className="text-xs text-slate-300">Loại form</div>
                <div className="font-semibold">Dynamic Survey UI</div>
              </div>
              <div className="rounded-2xl bg-white/10 p-3">
                <div className="text-xs text-slate-300">Mục tiêu</div>
                <div className="font-semibold">Khảo sát + số hóa</div>
              </div>
              <div className="rounded-2xl bg-white/10 p-3">
                <div className="text-xs text-slate-300">Phù hợp</div>
                <div className="font-semibold">Nhiều loại công trình</div>
              </div>
              <div className="rounded-2xl bg-white/10 p-3">
                <div className="text-xs text-slate-300">Trọng tâm</div>
                <div className="font-semibold">Đầy đủ dữ kiện</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
          <aside className="xl:col-span-1 space-y-4">
            <div className={card}>
              <div className={sectionTitle}>Điều hướng form</div>
              <div className="mt-3 space-y-2 text-sm">
                {[
                  "1. Thông tin hồ sơ",
                  "2. Nhu cầu khách hàng",
                  "3. Khu vực khảo sát",
                  "4. Media hiện trạng",
                  "5. Khối lượng sơ bộ",
                  "6. Điều kiện thi công",
                  "7. Đề xuất ban đầu",
                ].map((item) => (
                  <div key={item} className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-2">{item}</div>
                ))}
              </div>
            </div>

            <div className={card}>
              <div className={sectionTitle}>Ý tưởng UX</div>
              <div className="mt-3 space-y-3 text-sm text-slate-600">
                <p>Chia form thành từng khu vực để tránh nhập liệu dàn trải và thiếu logic.</p>
                <p>Mỗi khu vực có option dựng sẵn + ô mô tả mở để vừa chuẩn hóa vừa linh hoạt.</p>
                <p>Media được gắn theo từng khu vực thay vì upload chung, giúp truy vết tốt hơn.</p>
                <p>Khối lượng và rủi ro được nhập ngay tại hiện trường để giảm thiếu sót khi báo giá.</p>
              </div>
            </div>
          </aside>

          <main className="xl:col-span-3 space-y-5">
            <section className={card}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className={sectionTitle}>1. Thông tin hồ sơ khảo sát</h2>
                  <p className="text-sm text-slate-500 mt-1">Thông tin định danh dùng xuyên suốt cho toàn bộ lần khảo sát.</p>
                </div>
                <div className="text-xs px-3 py-2 rounded-full bg-slate-100 border border-slate-200">Header level</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
                <div><div className={label}>Mã hồ sơ</div><input className={input} placeholder="VD: KS-2026-0001" /></div>
                <div><div className={label}>Ngày khảo sát</div><input className={input} type="date" /></div>
                <div><div className={label}>Người khảo sát</div><input className={input} placeholder="Nhập họ tên" /></div>
                <div><div className={label}>Tên khách hàng</div><input className={input} placeholder="Người liên hệ / chủ đầu tư" /></div>
                <div><div className={label}>Số điện thoại</div><input className={input} placeholder="Nhập số điện thoại" /></div>
                <div><div className={label}>Vai trò người liên hệ</div><select className={input}><option>Chủ nhà</option><option>Nhà thầu</option><option>Quản lý công trình</option><option>Đại diện công ty</option></select></div>
                <div className="md:col-span-2 xl:col-span-3"><div className={label}>Địa chỉ công trình</div><input className={input} placeholder="Nhập địa chỉ chi tiết" /></div>
                <div><div className={label}>Loại công trình</div><select className={input}><option>Nhà dân</option><option>Nhà phố</option><option>Biệt thự</option><option>Nhà xưởng</option><option>Văn phòng</option><option>Khác</option></select></div>
                <div><div className={label}>Tình trạng sử dụng</div><select className={input}><option>Đang sử dụng</option><option>Đang cải tạo</option><option>Công trình mới</option><option>Bỏ trống</option></select></div>
                <div><div className={label}>Mức độ ưu tiên</div><select className={input}><option>Rất gấp</option><option>Trong tuần</option><option>Trong tháng</option><option>Khảo sát trước</option></select></div>
              </div>
            </section>

            <section className={card}>
              <h2 className={sectionTitle}>2. Nhu cầu khách hàng và phạm vi quan tâm</h2>
              <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div>
                  <div className={label}>Hạng mục khách yêu cầu</div>
                  <OptionGrid items={["Chống thấm mái tôn", "Chống thấm tường đứng", "Chống thấm nhà vệ sinh", "Chống dột khe tiếp giáp", "Sơn phủ bảo vệ", "Chống nóng", "Xử lý nứt", "Khác"]} />
                </div>
                <div>
                  <div className={label}>Kỳ vọng của khách hàng</div>
                  <OptionGrid items={["Xử lý triệt để", "Ưu tiên tiết kiệm chi phí", "Thi công nhanh", "Ít ảnh hưởng sinh hoạt", "Yêu cầu bảo hành", "Cần xuất hóa đơn", "Cần quy trình kỹ thuật", "Thi công ngoài giờ"]} />
                </div>
              </div>
              <div className="mt-4">
                <div className={label}>Mô tả vấn đề khách hàng đang phản ánh</div>
                <textarea className={textarea} placeholder="VD: Mưa lớn thì dột tại mái tôn khu sau, tường ngoài hướng tây bị thấm loang, WC tầng 2 thấm xuống trần tầng 1..." />
              </div>
            </section>

            <section className={card}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className={sectionTitle}>3. Khu vực khảo sát</h2>
                  <p className="text-sm text-slate-500 mt-1">Mỗi khu vực là một block dữ liệu độc lập. Đây là phần lõi để phần mềm mở rộng linh động.</p>
                </div>
                <button className="rounded-xl px-4 py-2 bg-slate-900 text-white text-sm shadow-sm">+ Thêm khu vực</button>
              </div>

              <div className="mt-4 space-y-4">
                {[1, 2].map((idx) => (
                  <div key={idx} className="rounded-3xl border border-slate-300 bg-slate-50 p-4 md:p-5">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
                      <div>
                        <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Khu vực {idx.toString().padStart(2, "0")}</div>
                        <div className="text-xl font-semibold">{idx === 1 ? "Mái tôn khu sau" : "Nhà vệ sinh tầng 2"}</div>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <span className={chip}>Trạng thái: Đang khảo sát</span>
                        <span className={chip}>Media: 4 ảnh · 1 video</span>
                        <span className={chip}>Khối lượng: Chưa chốt</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                      <div><div className={label}>Mã khu vực</div><input className={input} defaultValue={`KV-${idx.toString().padStart(2, "0")}`} /></div>
                      <div><div className={label}>Loại hạng mục</div><select className={input}>{areaTypes.map(v => <option key={v}>{v}</option>)}</select></div>
                      <div><div className={label}>Tầng / vị trí</div><input className={input} placeholder="VD: Tầng 2 / mặt sau" /></div>
                      <div><div className={label}>Mức độ nghiêm trọng</div><select className={input}><option>Nhẹ</option><option>Trung bình</option><option>Nặng</option><option>Rất nặng</option></select></div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-4">
                      <div className={subCard}>
                        <div className={label}>Dấu hiệu hiện trạng</div>
                        <OptionGrid items={issueTypes} />
                      </div>
                      <div className={subCard}>
                        <div className={label}>Nguyên nhân nghi ngờ</div>
                        <OptionGrid items={causeOptions} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
                      <div><div className={label}>Chiều dài</div><input className={input} placeholder="m" /></div>
                      <div><div className={label}>Chiều rộng</div><input className={input} placeholder="m" /></div>
                      <div><div className={label}>Chiều cao</div><input className={input} placeholder="m" /></div>
                      <div><div className={label}>Diện tích ước tính</div><input className={input} placeholder="m²" /></div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 xl:grid-cols-2 gap-4">
                      <div>
                        <div className={label}>Mô tả hiện trạng chi tiết</div>
                        <textarea className={textarea} placeholder="Mô tả càng cụ thể càng tốt: vị trí dột, thời điểm phát sinh, quy luật xuất hiện, dấu vết lan truyền, lớp vật liệu hiện hữu..." />
                      </div>
                      <div>
                        <div className={label}>Ghi chú đánh giá kỹ thuật</div>
                        <textarea className={textarea} placeholder="Nhận định sơ bộ, điểm cần test thêm, giả định nguồn lỗi, điểm ảnh hưởng đến giải pháp..." />
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 xl:grid-cols-2 gap-4">
                      <div className={subCard}>
                        <div className={label}>Điều kiện bề mặt</div>
                        <OptionGrid items={["Khô", "Ẩm", "Đọng nước", "Bám bụi", "Có lớp cũ", "Rêu mốc", "Bề mặt yếu / bở", "Có dầu mỡ"]} />
                      </div>
                      <div className={subCard}>
                        <div className={label}>An toàn và khó khăn thi công</div>
                        <OptionGrid items={safetyOptions} />
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div>
                          <div className="font-semibold">Media hiện trạng gắn theo khu vực</div>
                          <div className="text-sm text-slate-500">Thiết kế để sau này liên kết ảnh, video, chú thích, góc chụp và thứ tự khảo sát.</div>
                        </div>
                        <button className="rounded-xl px-4 py-2 bg-slate-100 border border-slate-300 text-sm">+ Thêm media</button>
                      </div>
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        <div>
                          <div className={label}>Checklist media bắt buộc</div>
                          <OptionGrid items={mediaChecklist} cols={2} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {[
                            "Ảnh toàn cảnh",
                            "Ảnh cận lỗi",
                            "Ảnh có thước đo",
                            "Video thuyết minh",
                          ].map((item) => (
                            <div key={item} className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 h-28 flex items-center justify-center text-sm text-slate-500 text-center p-3">
                              {item}\nplaceholder upload
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="font-semibold mb-3">Bóc tách khối lượng sơ bộ ngay tại hiện trường</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                        {quantityRows.map(([title, unit]) => (
                          <div key={title} className="rounded-2xl border border-slate-200 p-3">
                            <div className="text-sm font-medium text-slate-700">{title}</div>
                            <div className="text-xs text-slate-500 mt-1">Đơn vị: {unit}</div>
                            <input className={`${input} mt-3`} placeholder={`Nhập ${unit}`} />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 xl:grid-cols-2 gap-4">
                      <div>
                        <div className={label}>Đề xuất giải pháp sơ bộ cho khu vực này</div>
                        <textarea className={textarea} placeholder="VD: xử lý vít + chồng mí + phủ chống thấm đàn hồi 2–3 lớp, cần vệ sinh và xử lý rỉ trước..." />
                      </div>
                      <div>
                        <div className={label}>Hạng mục cần xác minh thêm</div>
                        <textarea className={textarea} placeholder="VD: cần test nước 24h, cần kiểm tra lại đường ống, cần tháo lớp hoàn thiện cục bộ..." />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className={card}>
              <h2 className={sectionTitle}>4. Tổng hợp điều kiện thi công toàn công trình</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                <div className={subCard}>
                  <div className={label}>Điều kiện mặt bằng</div>
                  <OptionGrid items={["Dễ tập kết vật tư", "Khó tập kết vật tư", "Có điện", "Có nước", "Có chỗ chứa vật tư", "Phải vận chuyển thủ công", "Khó tiếp cận bằng xe", "Phải làm cuốn chiếu"]} />
                </div>
                <div className={subCard}>
                  <div className={label}>Ràng buộc từ khách hàng / công trình</div>
                  <OptionGrid items={["Chỉ thi công ban ngày", "Chỉ thi công ban đêm", "Không gây tiếng ồn", "Không ảnh hưởng sinh hoạt", "Cần che chắn kỹ", "Có khu vực hạn chế tiếp cận", "Cần bảo vệ tài sản", "Phải nghiệm thu từng phần"]} />
                </div>
              </div>
              <div className="mt-4">
                <div className={label}>Ghi chú bổ sung</div>
                <textarea className={textarea} placeholder="Những điểm ảnh hưởng đến tổ chức thi công, tiến độ, nhân công, thiết bị, an toàn..." />
              </div>
            </section>

            <section className={card}>
              <h2 className={sectionTitle}>5. Footer hành động</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                <button className="rounded-xl px-4 py-2 bg-slate-900 text-white">Lưu nháp khảo sát</button>
                <button className="rounded-xl px-4 py-2 bg-white border border-slate-300">Xuất dữ liệu JSON</button>
                <button className="rounded-xl px-4 py-2 bg-white border border-slate-300">Tạo đề xuất sơ bộ</button>
                <button className="rounded-xl px-4 py-2 bg-white border border-slate-300">Sinh báo cáo hiện trạng</button>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
