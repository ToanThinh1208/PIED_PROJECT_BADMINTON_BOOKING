import { z } from "zod";

export const createCourtSchema = z.object({
  name: z.string().min(3, "Tên sân phải có ít nhất 3 ký tự").max(100, "Tên sân quá dài"),
  openTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Giờ mở cửa không hợp lệ (HH:mm)"),
  closeTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Giờ đóng cửa không hợp lệ (HH:mm)"),
  address: z.string().min(5, "Địa chỉ phải có ít nhất 5 ký tự"),
  latitude: z.number().refine((val) => val >= -90 && val <= 90, "Vĩ độ không hợp lệ"),
  longitude: z.number().refine((val) => val >= -180 && val <= 180, "Kinh độ không hợp lệ"),
  mapUrl: z.string().url("Link bản đồ không hợp lệ"),
  pictureUrl: z.any().refine((file) => file instanceof File, "Vui lòng chọn ảnh sân"),
}).refine((data) => {
  const [openH, openM] = data.openTime.split(":").map(Number);
  const [closeH, closeM] = data.closeTime.split(":").map(Number);
  return (closeH > openH) || (closeH === openH && closeM > openM);
}, {
  message: "Giờ đóng cửa phải sau giờ mở cửa",
  path: ["closeTime"],
});

export type CreateCourtFormValues = z.infer<typeof createCourtSchema>;
