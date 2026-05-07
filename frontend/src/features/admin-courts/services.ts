import { apiClient } from "@/lib/axios";
import type { PaginatedResponse } from "@/shared/types";
import type { PendingCourt, GetPendingCourtsRequest, RejectCourtRequest } from "./types";

export const adminCourtService = {
  getAllPendingCourts: async (params: GetPendingCourtsRequest) => {
    return apiClient.get<PaginatedResponse<PendingCourt>>("/api/Admin/GetAllPendingCourts", {
      params: {
        PageIndex: params.pageIndex,
        PageSize: params.pageSize,
        Name: params.name,
      },
    });
  },

  approveCourt: async (courtId: string) => {
    return apiClient.patch(`/api/Admin/ApprovePendingCourt/${courtId}`);
  },

  rejectCourt: async (courtId: string, data: RejectCourtRequest) => {
    return apiClient.patch(`/api/Admin/RejectPendingCourt/${courtId}`, data);
  },
};
