
- mỗi người đều có sẵn ví khi đc sinh ra, nhưng ví đó trống, muốn liên kết tk thì phải nhập các thông tin của ngân hàng. mỗi người chỉ đc có 1 tk ngân hàng [AddInforWallet]
- người dùng có nút để xem ví và thông tin tk ngân hàng đã liên kết [GetInforWallet]
- họ muốn đổi tài khoản ngân hàng khác hoặc xóa thông tin đi thì phải xóa thông tin đi, chứ ko xóa cái ví đó [RemoveBankWallet]
- admin có người nhà và muốn cho họ tiền [AdminUpBalanceForUser]
- nạp tiền vào ví: nhận vào số tiền muốn nạp và hiện ra mã qr [AddBalanceToWalletFromPayment]
- xác nhận xác nhận từ sepay [SepayWebhookHandler]

- khi muốn rút tiền thì người dùng sẽ tạo 1 lệnh chờ và cho admin duyệt cái lện đó [WithdrawalRequest]
- người dùng muốn coi lại các lện yêu cầu rút tiền đó, có thể chọn ngày và ưu tiên cái pending [GetWithdrawalRequest]
- admin cũng coi đc các cái đó của người dùng gửi, có thể chọn theo ngày luôn [AdminGetWithdrawalRequest]
- sau khi coi thì admin quyết định chấp nhận cái đơn này và chuyển tiền vào ví người dùng [AdminApprovedWithdrawalRequest]
- admin không chấp nhận lời mời gọi này [AdminRejectWithdrawalRequest]

- lấy các slot hiện tại đang đc tạo của sân con, có các thông tin như giờ, giá và ô đó có bị block ko, nen hiển thị toàn bộ sân con trong 1 sân lớn đó, tạo sẵn các ô ghi giờ [GetAvailableSlots]
- sau khi chọn các slot họ tiến hành đặt sân bằng tiền trong ví, khi ấn vào sẽ block slot đó và sẽ hiện ra màn hình hiển thị mã qr ứng với số tiền tổng và các thông tin xác nhận [CreateBooking]
- họ đổi ý ko muốn chuyển khoản mà sài tiền trong ví để thanh toán booking [CreateBookingByWallet]
- khi xác nhận, hiện mã qr lên, mà đổi ý ko đặt sân khác, thì hủy cái sân cùng thanh toán đó, chưa chuyển tiền [CancelBooking]
- ấn vào lịch sử hoặc gì đó để coi các booking đã đặt và trạng thái và thông tin chi tiết của chúng [GetBooking]
- hủy booking đã đặt, yêu cầu hoàn tiền, nếu chưa tới thời gian thì hủy hoàn tiền, còn nếu qua rồi thông báo buồn [BookingRefund]

- người dùng coi các biến động số dư của họ, có thể lọc theo ngày [GetTransaction]
- admin coi được biến động số dư của 1 người dùng [AdminGetTransaction]