import { apiClient } from "@/lib/axios";
import type { PaginatedResponse } from "@/shared/types";
import type { PendingCourt, GetPendingCourtsRequest, RejectCourtRequest } from "./types";

export const adminCourtService = {
  getAllPendingCourts: async (params: GetPendingCourtsRequest) => {
    return apiClient.get<PaginatedResponse<PendingCourt>>("/Admin/GetAllPendingCourts", {
      params: {
        PageIndex: params.pageIndex,
        PageSize: params.pageSize,
        Name: params.name,
      },
    }) as unknown as Promise<PaginatedResponse<PendingCourt>>;
  },

  approveCourt: async (courtId: string) => {
    return apiClient.patch(`/Admin/ApprovePendingCourt/${courtId}`);
  },

  rejectCourt: async (courtId: string, data: RejectCourtRequest) => {
    return apiClient.patch(`/Admin/RejectPendingCourt/${courtId}`, data);
  },
};
