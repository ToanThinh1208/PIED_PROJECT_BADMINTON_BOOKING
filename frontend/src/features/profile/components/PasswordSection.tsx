import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema, type ChangePasswordSchema } from "../schema";
import { Button } from "@/shared/components/ui/button";

interface PasswordSectionProps {
  onUpdate: (data: ChangePasswordSchema) => void;
  isLoading: boolean;
}

export function PasswordSection({ onUpdate, isLoading }: PasswordSectionProps) {
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  });

  const handleConfirm = (data: ChangePasswordSchema) => {
    onUpdate(data);
  };

  return (
    <div className="bg-white rounded-2xl p-5 mb-4" style={{ border: "1px solid rgba(0,0,0,0.07)" }}>
      <h3 style={{ fontWeight: 700, fontSize: "0.95rem", color: "#1a1a2e", marginBottom: "14px" }}>
        Đổi mật khẩu
      </h3>
      <form onSubmit={handleSubmit(handleConfirm)}>
        <div className="flex flex-col gap-4">
            <div className="relative">
              <input
                type={showOldPass ? "text" : "password"}
                {...register("oldPassword")}
                placeholder="Mật khẩu hiện tại"
                className={`w-full pr-10 px-3 py-2.5 rounded-xl outline-none text-sm transition-all ${
                  errors.oldPassword ? "ring-1 ring-red-500 border-red-500" : "border-gray-200"
                }`}
                style={{ 
                  border: errors.oldPassword ? "1.5px solid #ef4444" : "1.5px solid #e5e7eb", 
                  background: "#f9fafb" 
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowOldPass(!showOldPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:bg-transparent"
              >
                {showOldPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </Button>
            </div>
            {errors.oldPassword && <p className="text-red-500 text-[11px] ml-1 -mt-1">{errors.oldPassword.message}</p>}

            <div className="relative">
              <input
                type={showNewPass ? "text" : "password"}
                {...register("newPassword")}
                placeholder="Mật khẩu mới"
                className={`w-full pr-10 px-3 py-2.5 rounded-xl outline-none text-sm transition-all ${
                  errors.newPassword ? "ring-1 ring-red-500 border-red-500" : "border-gray-200"
                }`}
                style={{ 
                  border: errors.newPassword ? "1.5px solid #ef4444" : "1.5px solid #e5e7eb", 
                  background: "#f9fafb" 
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowNewPass(!showNewPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:bg-transparent"
              >
                {showNewPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </Button>
            </div>
            {errors.newPassword && <p className="text-red-500 text-[11px] ml-1 -mt-1">{errors.newPassword.message}</p>}

            <Button
              type="submit"
              disabled={isLoading}
              variant="gradient"
              className="mt-4 w-full py-3 rounded-xl text-white font-bold text-sm"
            >
              {isLoading ? "Đang xử lý..." : "Xác nhận đổi mật khẩu"}
            </Button>
          </div>
        </form>
    </div>
  );
}
