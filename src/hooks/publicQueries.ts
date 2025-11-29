import { useQuery } from '@tanstack/react-query';
import { getPostBySlug, getPosts, getPublicSettings, getTags, GetPostsParams } from '../api/public';

export const usePosts = (params: GetPostsParams) =>
  useQuery({
    queryKey: ['posts', params],
    queryFn: () => getPosts(params),
    keepPreviousData: true,
  });

export const usePost = (slug: string) =>
  useQuery({
    queryKey: ['post', slug],
    queryFn: () => getPostBySlug(slug),
    enabled: Boolean(slug),
  });

export const useTags = () =>
  useQuery({
    queryKey: ['tags'],
    queryFn: getTags,
  });

export const usePublicSettings = () =>
  useQuery({
    queryKey: ['settings', 'public'],
    queryFn: getPublicSettings,
  });
