import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createPost,
  createTag,
  deletePost,
  deleteTag,
  getAdminPost,
  getAdminPosts,
  getAdminSettings,
  getAdminTags,
  login,
  publishPost,
  unpublishPost,
  updateAdminSettings,
  updatePost,
  updateTag,
  uploadImage,
} from '../api/admin';
import { PostCreateRequest, PostUpdateRequest, Settings, TagCreateRequest } from '../types/api';
import { setAuthToken } from '../utils/auth';

export const useAdminPosts = () =>
  useQuery({
    queryKey: ['admin', 'posts'],
    queryFn: getAdminPosts,
  });

export const useAdminPost = (id?: number) =>
  useQuery({
    queryKey: ['admin', 'post', id],
    queryFn: () => getAdminPost(id as number),
    enabled: Boolean(id),
  });

export const useAdminTags = () =>
  useQuery({
    queryKey: ['admin', 'tags'],
    queryFn: getAdminTags,
  });

export const useAdminSettings = () =>
  useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: getAdminSettings,
  });

export const useLogin = () =>
  useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => login(email, password),
    onSuccess: (data) => setAuthToken(data.accessToken, data.tokenType),
  });

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PostCreateRequest) => createPost(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'posts'] }),
  });
};

export const useUpdatePost = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PostUpdateRequest) => updatePost(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'posts'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'post', id] });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deletePost(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'posts'] }),
  });
};

export const usePublishPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => publishPost(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'posts'] }),
  });
};

export const useUnpublishPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => unpublishPost(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'posts'] }),
  });
};

export const useCreateTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: TagCreateRequest) => createTag(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'tags'] }),
  });
};

export const useUpdateTag = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: TagCreateRequest) => updateTag(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'tags'] }),
  });
};

export const useDeleteTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTag(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'tags'] }),
  });
};

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Settings) => updateAdminSettings(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] }),
  });
};

export const useUploadImage = () =>
  useMutation({
    mutationFn: uploadImage,
  });
