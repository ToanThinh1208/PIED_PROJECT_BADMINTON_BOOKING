import { useQuery } from "@tanstack/react-query";
import { bookingsService } from "../services";

export const useSubCourts = (courtId: string) => {
  return useQuery({
    queryKey: ["sub-courts", courtId],
    queryFn: () => bookingsService.getSubCourts(courtId),
    enabled: !!courtId,
  });
};
