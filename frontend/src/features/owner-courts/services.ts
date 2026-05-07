import { apiClient } from "@/lib/axios";
import type { CreateCourtRequest, MyCourtListItem, GetMyCourtsRequest } from "./types";
import type { PaginatedResponse } from "@/shared/types";

export const ownerCourtService = {
  createCourt: async (data: CreateCourtRequest) => {
    const formData = new FormData();
    formData.append("Name", data.name);
    formData.append("OpenTime", data.openTime);
    formData.append("CloseTime", data.closeTime);
    formData.append("Address", data.address);
    formData.append("Latitude", data.latitude.toString());
    formData.append("Longitude", data.longitude.toString());
    formData.append("MapUrl", data.mapUrl);
    if (data.pictureUrl) {
      formData.append("PictureUrl", data.pictureUrl);
    }

    return apiClient.post("/api/Owner/CreateCourt", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  getAllMyCourts: async (params: GetMyCourtsRequest) => {
    return apiClient.get<PaginatedResponse<MyCourtListItem>>("/api/Owner/GetPendingCourts", {
      params: {
        PageIndex: params.pageIndex,
        PageSize: params.pageSize,
        Name: params.name,
      },
    }) as unknown as Promise<PaginatedResponse<MyCourtListItem>>;
  },
};
