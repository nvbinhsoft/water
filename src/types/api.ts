export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export type PostStatus = 'DRAFT' | 'PUBLISHED';

export interface PostSummary {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  tags: Tag[];
  coverImageUrl?: string;
  publishedAt?: string;
  readTimeMinutes?: number;
  status?: PostStatus;
}

export interface PostDetail extends PostSummary {
  body: string;
}

export interface PostAdminDetail extends PostDetail {
  status: PostStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn?: number;
}

export interface PostCreateRequest {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  tagIds: number[];
  coverImageUrl?: string;
  status?: PostStatus;
}

export interface PostUpdateRequest extends PostCreateRequest {}

export interface TagCreateRequest {
  name: string;
  slug: string;
}

export interface Settings {
  title: string;
  subtitle?: string;
  authorName?: string;
  authorBio?: string;
  profileImageUrl?: string;
  socialLinks?: Record<string, string>;
}

export interface UploadResponse {
  url: string;
}

export interface ErrorResponse {
  message: string;
  status?: number;
}
