import MockAdapter from 'axios-mock-adapter';
import { AxiosHeaders, type AxiosRequestConfig } from 'axios';
import api from '../api/http';
import {
  AuthResponse,
  PaginatedResponse,
  PostAdminDetail,
  PostCreateRequest,
  PostDetail,
  Settings,
  Tag,
  TagCreateRequest,
  UploadResponse,
} from '../types/api';

let mock: MockAdapter | null = null;

const tags: Tag[] = [
  { id: 1, name: 'React', slug: 'react' },
  { id: 2, name: 'TypeScript', slug: 'typescript' },
  { id: 3, name: 'DevOps', slug: 'devops' },
];

let posts: PostAdminDetail[] = [
  {
    id: 1,
    title: 'Building a Substack-like Blog Frontend with React',
    slug: 'substack-like-blog-react',
    excerpt:
      'A walkthrough of creating a Substack-inspired blog experience using React, Vite, and Tailwind.',
    body:
      '# Building a Substack-like Blog\n\nThis post shows how to wire **React Router**, **React Query**, and Markdown rendering together.\n\n```ts\nconst hello = () => console.log("hi");\nhello();\n```\n\n![diagram](https://placehold.co/800x400?text=Architecture+Diagram)\n\nMore text after the image to confirm ordering.',
    tags: [tags[0], tags[1]],
    coverImageUrl: 'https://placehold.co/1200x630?text=Cover+Image',
    publishedAt: new Date().toISOString(),
    readTimeMinutes: 6,
    status: 'PUBLISHED',
  },
  {
    id: 2,
    title: 'CI/CD Basics for Personal Projects',
    slug: 'ci-cd-basics',
    excerpt:
      'Lightweight pipelines, preview environments, and sensible defaults for shipping personal apps.',
    body:
      '## CI/CD Basics\n\nUse GitHub Actions to lint, test, and build your app.\n\n```yaml\nname: ci\n\non: [push]\n\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n      - run: npm ci\n      - run: npm test\n```',
    tags: [tags[2]],
    readTimeMinutes: 4,
    status: 'DRAFT',
  },
];

let settings: Settings = {
  title: 'DevNotes',
  subtitle: 'Notes on building, deploying, and learning in public.',
  authorName: 'Alex Developer',
  authorBio:
    'Engineer sharing write-ups on frontend architecture, DX, and operating personal projects end-to-end.',
  profileImageUrl: 'https://placehold.co/200x200?text=Profile',
  socialLinks: {
    twitter: 'https://twitter.com/example',
    github: 'https://github.com/example',
    linkedin: 'https://www.linkedin.com/in/example',
  },
};

function paginate<T>(items: T[], page = 0, size = 10): PaginatedResponse<T> {
  const start = page * size;
  const pageItems = items.slice(start, start + size);
  return {
    content: pageItems,
    page,
    size,
    totalPages: Math.max(1, Math.ceil(items.length / size)),
    totalElements: items.length,
  };
}

function extractAuthHeader(headers?: AxiosRequestConfig['headers']): string | undefined {
  if (!headers) return undefined;
  if (headers instanceof AxiosHeaders) {
    const header = headers.get('Authorization') ?? headers.get('authorization');
    if (Array.isArray(header)) return header.join(', ');
    return header ? String(header) : undefined;
  }

  if (typeof headers === 'object') {
    const record = headers as Record<string, unknown>;
    const raw = record.Authorization ?? record.authorization;
    if (Array.isArray(raw)) return raw.join(', ');
    if (raw == null) return undefined;
    return String(raw);
  }

  return undefined;
}

function matchAuth(headers?: AxiosRequestConfig['headers']): boolean {
  const authHeader = extractAuthHeader(headers);
  return Boolean(authHeader?.startsWith('Bearer'));
}

function nextId(collection: { id: number }[]): number {
  return collection.length ? Math.max(...collection.map((item) => item.id)) + 1 : 1;
}

export function setupMockApi() {
  if (mock) {
    return;
  }

  mock = new MockAdapter(api, { delayResponse: 300 });

  // Public endpoints
  mock.onGet('/posts').reply((config) => {
    const url = new URL(config.url ?? '', 'http://localhost');
    const tagSlug = url.searchParams.get('tag');
    const query = url.searchParams.get('q')?.toLowerCase();
    const page = Number(url.searchParams.get('page') ?? 0);
    const size = Number(url.searchParams.get('size') ?? 10);

    let filtered = posts.filter((post) => post.status === 'PUBLISHED');

    if (tagSlug) {
      filtered = filtered.filter((post) => post.tags.some((tag) => tag.slug === tagSlug));
    }

    if (query) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.body.toLowerCase().includes(query)
      );
    }

    const summaries = filtered.map<PostDetail>(({ body, ...rest }) => ({ ...rest, body }));
    return [200, paginate(summaries, page, size)];
  });

  mock.onGet(/\/posts\/[^/]+$/).reply((config) => {
    const slug = config.url?.split('/').pop();
    const post = posts.find((p) => p.slug === slug && p.status === 'PUBLISHED');
    if (!post) return [404, { message: 'Post not found' }];
    return [200, post];
  });

  mock.onGet('/tags').reply(200, tags);
  mock.onGet('/settings/public').reply(200, settings);

  // Auth
  mock.onPost('/auth/login').reply((config) => {
    const credentials = config.data ? JSON.parse(config.data) : {};
    const { username, email, password } = credentials;
    const identifier = username ?? email;
    if (identifier === 'admin@example.com' && password === 'password') {
      const response: AuthResponse = {
        accessToken: 'mock-token',
        tokenType: 'Bearer',
        expiresIn: 3600,
      };
      return [200, response];
    }
    return [401, { message: 'Invalid credentials' }];
  });

  // Admin endpoints
  mock.onGet('/admin/posts').reply((config) => {
    if (!matchAuth(config.headers)) return [401, { message: 'Unauthorized' }];
    const url = new URL(config.url ?? '', 'http://localhost');
    const page = Number(url.searchParams.get('page') ?? 0);
    const size = Number(url.searchParams.get('size') ?? 10);
    return [200, paginate(posts, page, size)];
  });

  mock.onGet(/\/admin\/posts\/\d+$/).reply((config) => {
    if (!matchAuth(config.headers)) return [401, { message: 'Unauthorized' }];
    const id = Number(config.url?.split('/').pop());
    const post = posts.find((p) => p.id === id);
    if (!post) return [404, { message: 'Post not found' }];
    return [200, post];
  });

  mock.onPost('/admin/posts').reply((config) => {
    if (!matchAuth(config.headers)) return [401, { message: 'Unauthorized' }];
    const payload: PostCreateRequest = JSON.parse(config.data);
    const newPost: PostAdminDetail = {
      ...payload,
      id: nextId(posts),
      tags: tags.filter((tag) => payload.tagIds.includes(tag.id)),
      status: payload.status ?? 'DRAFT',
    };
    posts = [newPost, ...posts];
    return [201, newPost];
  });

  mock.onPut(/\/admin\/posts\/\d+$/).reply((config) => {
    if (!matchAuth(config.headers)) return [401, { message: 'Unauthorized' }];
    const id = Number(config.url?.split('/').pop());
    const payload: PostCreateRequest = JSON.parse(config.data);
    const index = posts.findIndex((p) => p.id === id);
    if (index === -1) return [404, { message: 'Post not found' }];
    const updated: PostAdminDetail = {
      ...posts[index],
      ...payload,
      tags: tags.filter((tag) => payload.tagIds.includes(tag.id)),
      status: payload.status ?? posts[index].status,
    };
    posts[index] = updated;
    return [200, updated];
  });

  mock.onDelete(/\/admin\/posts\/\d+$/).reply((config) => {
    if (!matchAuth(config.headers)) return [401, { message: 'Unauthorized' }];
    const id = Number(config.url?.split('/').pop());
    posts = posts.filter((p) => p.id !== id);
    return [204];
  });

  mock.onPost(/\/admin\/posts\/\d+\/publish$/).reply((config) => {
    if (!matchAuth(config.headers)) return [401, { message: 'Unauthorized' }];
    const id = Number(config.url?.split('/').slice(-2, -1)[0]);
    const index = posts.findIndex((p) => p.id === id);
    if (index === -1) return [404, { message: 'Post not found' }];
    posts[index] = {
      ...posts[index],
      status: 'PUBLISHED',
      publishedAt: new Date().toISOString(),
    };
    return [200, posts[index]];
  });

  mock.onPost(/\/admin\/posts\/\d+\/unpublish$/).reply((config) => {
    if (!matchAuth(config.headers)) return [401, { message: 'Unauthorized' }];
    const id = Number(config.url?.split('/').slice(-2, -1)[0]);
    const index = posts.findIndex((p) => p.id === id);
    if (index === -1) return [404, { message: 'Post not found' }];
    posts[index] = {
      ...posts[index],
      status: 'DRAFT',
      publishedAt: undefined,
    };
    return [200, posts[index]];
  });

  mock.onGet('/admin/tags').reply((config) => {
    if (!matchAuth(config.headers)) return [401, { message: 'Unauthorized' }];
    return [200, tags];
  });

  mock.onPost('/admin/tags').reply((config) => {
    if (!matchAuth(config.headers)) return [401, { message: 'Unauthorized' }];
    const payload: TagCreateRequest = JSON.parse(config.data);
    const newTag: Tag = { id: nextId(tags), ...payload };
    tags.push(newTag);
    return [201, newTag];
  });

  mock.onPut(/\/admin\/tags\/\d+$/).reply((config) => {
    if (!matchAuth(config.headers)) return [401, { message: 'Unauthorized' }];
    const id = Number(config.url?.split('/').pop());
    const payload: TagCreateRequest = JSON.parse(config.data);
    const index = tags.findIndex((t) => t.id === id);
    if (index === -1) return [404, { message: 'Tag not found' }];
    tags[index] = { id, ...payload };
    return [200, tags[index]];
  });

  mock.onDelete(/\/admin\/tags\/\d+$/).reply((config) => {
    if (!matchAuth(config.headers)) return [401, { message: 'Unauthorized' }];
    const id = Number(config.url?.split('/').pop());
    const index = tags.findIndex((t) => t.id === id);
    if (index === -1) return [404, { message: 'Tag not found' }];
    tags.splice(index, 1);
    posts = posts.map((post) => ({
      ...post,
      tags: post.tags.filter((tag) => tag.id !== id),
    }));
    return [204];
  });

  mock.onGet('/admin/settings').reply((config) => {
    if (!matchAuth(config.headers)) return [401, { message: 'Unauthorized' }];
    return [200, settings];
  });

  mock.onPut('/admin/settings').reply((config) => {
    if (!matchAuth(config.headers)) return [401, { message: 'Unauthorized' }];
    settings = { ...settings, ...JSON.parse(config.data) } as Settings;
    return [200, settings];
  });

  mock.onPost('/admin/uploads').reply((config) => {
    if (!matchAuth(config.headers)) return [401, { message: 'Unauthorized' }];
    const response: UploadResponse = {
      url: `https://placehold.co/800x400?text=Uploaded+${Date.now()}`,
    };
    return [200, response];
  });
}
