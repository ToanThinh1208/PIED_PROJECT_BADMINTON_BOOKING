# Luồng xử lý Bản đồ (Court Map Workflow)

Tài liệu này giải thích chi tiết cơ chế hoạt động đằng sau Hook `useCourtMap`, cách bản đồ tương tác với các API khác nhau và lý do tại sao chúng ta cần gộp dữ liệu.

## 1. Các luồng API độc lập

Bản đồ hiện tại đang sử dụng song song 2 luồng dữ liệu chính:

### A. Luồng Bounding Box (Hiển thị tự động theo màn hình)
- **Kích hoạt khi:** Bản đồ vừa load xong, hoặc khi người dùng kéo (pan) / thu phóng (zoom) bản đồ.
- **Cách thức hoạt động:**
  1. Thư viện VietmapGL bắt sự kiện `moveend`.
  2. Lệnh `map.getBounds()` tính toán 4 góc màn hình hiện tại để tạo ra 1 hình chữ nhật (`minLat`, `maxLat`, `minLon`, `maxLon`).
  3. Lưu 4 tọa độ này vào state `bbox`.
  4. React Query phát hiện state `bbox` thay đổi, tự động gọi API `/Map/boxing-box`.
  5. Kết quả trả về được lưu vào biến `mapData`.

### B. Luồng Radius (Tìm kiếm quanh tôi)
- **Kích hoạt khi:** Người dùng chủ động bấm vào nút **"Locate Me"** (Tâm ngắm).
- **Cách thức hoạt động:**
  1. Hàm `handleLocateMe` gọi GPS của trình duyệt để lấy vĩ độ (`latitude`) và kinh độ (`longitude`) hiện tại.
  2. Cập nhật state `radiusReq` với tọa độ vừa lấy + bán kính `radiusKm: 10`.
  3. Cùng lúc đó, lệnh `map.flyTo()` đẩy bản đồ trượt tới vị trí GPS và zoom ra mức `12` (khoảng 10-20km).
  4. React Query kích hoạt, gửi API `/Map/radius` và lưu kết quả vào biến `radiusData`.
  
  > **Lưu ý Cache:** Nếu bạn đứng im một chỗ và bấm nút 2 lần, React Query sẽ cố gắng dùng dữ liệu cũ (cache) để tiết kiệm băng thông. Ta đã ép gọi lại API bằng lệnh `refetchRadius()` nếu tọa độ không thay đổi.

---

## 2. Quá trình Gộp dữ liệu (Merge Data)

Vì hành động `flyTo` ở luồng Radius làm bản đồ di chuyển, nó sẽ **vô tình kích hoạt lại Luồng Bounding Box**. Kết quả là ta có 2 mảng dữ liệu cùng lúc: `mapData` và `radiusData`.

Nếu không gộp lại, Dữ liệu `radiusData` vừa tải xong có thể ngay lập tức bị `mapData` ghi đè (hoặc ngược lại).

### Logic gộp bằng `Map`
```javascript
const allCourtsMap = new Map();

// Đưa sân từ API Bounding Box vào
if (mapData?.listCourts) {
  mapData.listCourts.forEach(c => allCourtsMap.set(c.id, c));
}

// Đưa sân từ API Radius vào
if (radiusData?.listCourts) {
  radiusData.listCourts.forEach(c => allCourtsMap.set(c.id, c));
}

// Xuất ra mảng cuối cùng
const courts = Array.from(allCourtsMap.values());
```

**Bản chất của `new Map()`:** Mỗi ID là duy nhất. Nếu một sân (ví dụ: Sân Cầu Lông A) vô tình có mặt trong cả 2 API, `Map` sẽ tự động ghi đè và giữ lại 1 bản sao duy nhất, giúp màn hình không bị lỗi 2 marker vẽ chồng lên nhau.

---

## 3. Tại sao lại thấy sân nằm ngoài bán kính 10km?

Mảng `courts` cuối cùng được vẽ lên bản đồ là tập hợp của:
**(Vòng tròn bán kính 10km) + (Hình chữ nhật của màn hình bản đồ)**

Hình chữ nhật (màn hình) luôn có phần diện tích lớn hơn và trùm ra ngoài vòng tròn (bán kính) ở 4 góc màn hình.
Do đó, các sân cách xa 12km, 14km vẫn sẽ xuất hiện trên màn hình vì chúng vô tình lọt vào 4 góc này và được trả về bởi API Bounding Box (`mapData`).

Nếu dự án yêu cầu: *"Khi bấm Locate Me, tuyệt đối chỉ hiển thị các sân trong 10km, phải ẩn đi tất cả các sân xa hơn dù nó nằm trên màn hình"*, bạn sẽ cần phải:
1. Tạo thêm state `isRadiusMode = true` khi bấm Locate Me.
2. Dừng việc lấy `mapData` hoặc ưu tiên chỉ hiển thị `radiusData` khi biến này là `true`.
3. Tắt `isRadiusMode` đi nếu người dùng lướt bản đồ ra chỗ khác.
