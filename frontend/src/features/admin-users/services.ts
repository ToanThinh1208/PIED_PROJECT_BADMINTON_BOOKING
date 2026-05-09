import { apiClient } from "@/lib/axios";
import type { PaginatedResponse } from "@/shared/types";
import type { 
  UserListItem, 
  UserDetail, 
  FilterUserRequest, 
  BanUnbanUserRequest 
} from "./types";

export const adminUserService = {
  filterUsers: async (params: FilterUserRequest) => {
    return apiClient.get<PaginatedResponse<UserListItem>>("/Admin/FilterUser", {
      params: {
        Search: params.search,
        Id: params.id,
        Role: params.role,
        Status: params.status,
        PageIndex: params.pageIndex,
        PageSize: params.pageSize,
      },
    }) as unknown as Promise<PaginatedResponse<UserListItem>>;
  },

  getUserDetail: async (id: string) => {
    return apiClient.get<UserDetail>("/Admin/getUserDetailById", {
      params: { Id: id },
    }) as unknown as Promise<UserDetail>;
  },

  banUnbanUser: async (data: BanUnbanUserRequest) => {
    return apiClient.patch("/Admin/BanAndUnbanUser", data);
  },
};
