import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminUserService } from "../services";
import type { FilterUserRequest, BanUnbanUserRequest } from "../types";
import { toast } from "sonner";

export const useAdminUsers = (params: FilterUserRequest) => {
  return useQuery({
    queryKey: ["admin-users", params],
    queryFn: () => adminUserService.filterUsers(params),
  });
};

export const useUserDetail = (id: string) => {
  return useQuery({
    queryKey: ["user-detail", id],
    queryFn: () => adminUserService.getUserDetail(id),
    enabled: !!id,
  });
};

export const useBanUnbanUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BanUnbanUserRequest) => adminUserService.banUnbanUser(data),
    onSuccess: (_, variables) => {
      toast.success(variables.status === "Active" ? "Đã mở khóa người dùng" : "Đã khóa người dùng");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["user-detail", variables.id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Thao tác thất bại");
    },
  });
};
