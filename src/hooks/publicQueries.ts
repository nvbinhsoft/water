import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getPostBySlug, getPosts, getPublicSettings, getTags, GetPostsParams } from '../api/public';
import { PaginatedResponse, PostDetail, PostSummary, Tag, Settings } from '../types/api';

export const usePosts = (params: GetPostsParams) =>
  useQuery<PaginatedResponse<PostSummary>>({
    queryKey: ['posts', params],
    queryFn: () => getPosts(params),
    placeholderData: keepPreviousData,
  });

export const usePost = (slug: string) =>
  useQuery<PostDetail>({
    queryKey: ['post', slug],
    queryFn: () => getPostBySlug(slug),
    enabled: Boolean(slug),
  });

export const useTags = () =>
  useQuery<Tag[]>({
    queryKey: ['tags'],
    queryFn: getTags,
  });

export const usePublicSettings = () =>
  useQuery<Settings>({
    queryKey: ['settings', 'public'],
    queryFn: getPublicSettings,
  });
