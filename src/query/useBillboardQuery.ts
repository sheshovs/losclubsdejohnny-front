import { useQuery } from "@tanstack/react-query";
import { API_QUERY_KEYS } from "./keys";
import API from "../api";

export const useActiveBillboardQuery = ()=> 
  useQuery({
    queryKey: API_QUERY_KEYS.billboard.active(),
    queryFn: () => API.billboard.getActive(),
  });

export const useGetBillboardsQuery = () => 
  useQuery({
    queryKey: API_QUERY_KEYS.billboard.all(),
    queryFn: () => API.billboard.getAll(),
  });

export const useBillboardByUuidQuery = (billboardId: string) => 
  useQuery({
    queryKey: API_QUERY_KEYS.billboard.byUuid(billboardId),
    queryFn: () => API.billboard.getByUuid(billboardId),
    enabled: !!billboardId,
  });