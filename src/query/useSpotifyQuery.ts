import { useQuery } from "@tanstack/react-query";
import { API_QUERY_KEYS } from "./keys";
import API from "../api";

export const useSpotifyToken = ()=> 
  useQuery({
    queryKey: [`spotify`, `token`],
    queryFn: () => API.getSpotifyToken(),
  });

export const useSpotifyAlbumsByArtist = ({
  artist
}: {
  artist: string;
})=> 
  useQuery({
    queryKey: API_QUERY_KEYS.spotifyAlbumsByArtist(artist),
    queryFn: () => API.getSpotifyAlbumsByArtist(artist),
    enabled: artist.length >= 3,
    select: (data) => {
      return {
        ...data.albums,
        items: data.albums.items.filter(album => album.album_type === `album`),
      }
    },
  });

export const useSpotifyAlbumById = ({
  albumId
}: {
  albumId: string;
})=> 
  useQuery({
    queryKey: API_QUERY_KEYS.spotifyAlbumById(albumId),
    queryFn: () => API.getSpotifyAlbumById(albumId),
    enabled: !!albumId
  });