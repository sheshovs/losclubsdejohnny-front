import { Dayjs } from "dayjs"
import { SpotifyAlbumDetailResponse } from "./spotify"

export interface BillboardPayload {
  startDate: Dayjs | null
  endDate: Dayjs | null
  albums: {
    date: Dayjs | null
    albumId: string
  }[]
}

export interface BillboardResponse {
  albums: {
    uuid: string
    date: string
    albumId: string
    albumData: SpotifyAlbumDetailResponse
  }[]
  uuid: string
  startDate: string
  endDate: string
  isActive: boolean
}