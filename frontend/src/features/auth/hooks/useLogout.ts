import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "../store";

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const logoutStore = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logoutStore();
    queryClient.clear(); // Xóa sạch cache React Query
    toast.success("Đã đăng xuất");
    navigate("/login");
  };

  return { mutate: handleLogout, isLoading: false };
};
