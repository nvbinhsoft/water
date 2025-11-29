import api from './http';
import { PaginatedResponse, PostDetail, PostSummary, Tag, Settings } from '../types/api';

export interface GetPostsParams {
  page?: number;
  size?: number;
  tag?: string;
  q?: string;
  sort?: string;
}

export const getPosts = async (params: GetPostsParams = {}) => {
  const response = await api.get<PaginatedResponse<PostSummary>>('/posts', {
    params,
  });
  return response.data;
};

export const getPostBySlug = async (slug: string) => {
  const response = await api.get<PostDetail>(`/posts/${slug}`);
  return response.data;
};

export const getTags = async () => {
  const response = await api.get<Tag[]>('/tags');
  return response.data;
};

export const getPublicSettings = async () => {
  const response = await api.get<Settings>('/settings/public');
  return response.data;
};
