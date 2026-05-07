import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateCourt } from "../hooks/useOwnerCourts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { createCourtSchema, type CreateCourtFormValues } from "../schema";
import type { CreateCourtRequest } from "../types";
import type { FieldPath } from "react-hook-form";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { PlusCircle, Upload, MapPin } from "lucide-react";
import { useState } from "react";

export const CreateCourtDialog = () => {
  const [open, setOpen] = useState(false);
  const createCourt = useCreateCourt();

  const form = useForm<CreateCourtFormValues>({
    resolver: zodResolver(createCourtSchema),
    defaultValues: {
      name: "",
      openTime: "05:00",
      closeTime: "22:00",
      address: "",
      latitude: 10.762622, // Default HCM
      longitude: 106.660172,
      mapUrl: "",
    },
  });

  const onSubmit = (values: CreateCourtFormValues) => {
    createCourt.mutate(values as CreateCourtRequest, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2">
          <PlusCircle size={18} />
          Đăng ký sân mới
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">Đăng ký sân mới 🏸</DialogTitle>
          <DialogDescription>
            Nhập thông tin sân của bạn. Sân sẽ được hiển thị sau khi Admin phê duyệt.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên sân</FormLabel>
                  <FormControl>
                    <Input placeholder="VD: Sân Cầu Lông ABC" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="openTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giờ mở cửa</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="closeTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giờ đóng cửa</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ</FormLabel>
                  <FormControl>
                    <Input placeholder="Số nhà, tên đường, quận/huyện..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vĩ độ (Latitude)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="any"
                        value={field.value}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kinh độ (Longitude)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="any"
                        value={field.value}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="mapUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Google Maps URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://maps.google.com/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pictureUrl"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Ảnh đại diện sân</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      <Input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="court-image"
                        onChange={(e) => onChange(e.target.files?.[0] || null)}
                        {...field}
                      />
                      <label
                        htmlFor="court-image"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        {value instanceof File ? (
                          <div className="flex items-center gap-2 text-emerald-600 font-medium">
                            <Upload size={20} />
                            <span>{value.name}</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center text-gray-500">
                            <Upload size={24} className="mb-2" />
                            <span className="text-sm">Nhấn để tải ảnh lên</span>
                          </div>
                        )}
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 rounded-xl font-bold text-lg shadow-lg shadow-emerald-200 transition-all active:scale-[0.98]"
                disabled={createCourt.isPending}
              >
                {createCourt.isPending ? "Đang xử lý..." : "Gửi yêu cầu đăng ký"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
