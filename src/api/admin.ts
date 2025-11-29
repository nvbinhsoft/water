import api from './http';
import {
  AuthResponse,
  PaginatedResponse,
  PostAdminDetail,
  PostCreateRequest,
  PostUpdateRequest,
  Settings,
  Tag,
  TagCreateRequest,
  UploadResponse,
} from '../types/api';

export const login = async (email: string, password: string) => {
  const response = await api.post<AuthResponse>('/auth/login', { email, password });
  return response.data;
};

export const getAdminPosts = async () => {
  const response = await api.get<PaginatedResponse<PostAdminDetail>>('/admin/posts');
  return response.data;
};

export const getAdminPost = async (id: number) => {
  const response = await api.get<PostAdminDetail>(`/admin/posts/${id}`);
  return response.data;
};

export const createPost = async (payload: PostCreateRequest) => {
  const response = await api.post<PostAdminDetail>('/admin/posts', payload);
  return response.data;
};

export const updatePost = async (id: number, payload: PostUpdateRequest) => {
  const response = await api.put<PostAdminDetail>(`/admin/posts/${id}`, payload);
  return response.data;
};

export const deletePost = async (id: number) => api.delete(`/admin/posts/${id}`);
export const publishPost = async (id: number) => api.post(`/admin/posts/${id}/publish`);
export const unpublishPost = async (id: number) => api.post(`/admin/posts/${id}/unpublish`);

export const getAdminTags = async () => {
  const response = await api.get<Tag[]>('/admin/tags');
  return response.data;
};

export const createTag = async (payload: TagCreateRequest) => {
  const response = await api.post<Tag>('/admin/tags', payload);
  return response.data;
};

export const updateTag = async (id: number, payload: TagCreateRequest) => {
  const response = await api.put<Tag>(`/admin/tags/${id}`, payload);
  return response.data;
};

export const deleteTag = async (id: number) => api.delete(`/admin/tags/${id}`);

export const getAdminSettings = async () => {
  const response = await api.get<Settings>('/admin/settings');
  return response.data;
};

export const updateAdminSettings = async (payload: Settings) => {
  const response = await api.put<Settings>('/admin/settings', payload);
  return response.data;
};

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post<UploadResponse>('/admin/uploads', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
