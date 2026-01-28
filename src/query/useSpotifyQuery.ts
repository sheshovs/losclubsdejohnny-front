import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
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
  useInfiniteQuery({
    queryKey: API_QUERY_KEYS.spotifyAlbumsByArtist(artist),
    queryFn: ({ pageParam = 0 }) => API.getSpotifyAlbumsByArtist(artist, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.albums.next) return undefined;
      // Calculate next offset based on current pages loaded
      return allPages.length * 20;
    },
    enabled: artist.length >= 3,
    select: (data) => {
      // Filter out single track albums from each page
      const filteredPages = data.pages.map(page => ({
        ...page,
        albums: {
          ...page.albums,
          items: page.albums.items.filter(album => album.total_tracks !== 1)
        }
      }));
      
      return {
        pages: filteredPages,
        pageParams: data.pageParams
      };
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