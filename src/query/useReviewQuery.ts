import { useQuery } from "@tanstack/react-query";
import { API_QUERY_KEYS } from "./keys";
import API from "../api";

export const useGetReviewsQuery = () => 
  useQuery({
    queryKey: API_QUERY_KEYS.review.all(),
    queryFn: () => API.review.getAll(),
  });

export const useReviewByUuidQuery = (reviewId: string) => 
  useQuery({
    queryKey: API_QUERY_KEYS.review.byUuid(reviewId),
    queryFn: () => API.review.getByUuid(reviewId),
    enabled: !!reviewId,
  });