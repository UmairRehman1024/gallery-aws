import { POST } from '@/app/api/getPresignedURL/route';
import { NextRequest } from 'next/server';
import { describe, beforeEach, it, expect, vi, type Mock } from 'vitest';

// Mock AWS SDK
vi.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: vi.fn().mockResolvedValue('https://mock-s3-url'),
}));
vi.mock('@aws-sdk/client-s3', () => ({
  S3Client: vi.fn(),
  PutObjectCommand: vi.fn(),
}));

// Mock env
vi.mock('@/env', () => ({
  env: {
    AWS_REGION: 'us-east-1',
    AWS_ACCESS_KEY_ID: 'test-key',
    AWS_SECRET_ACCESS_KEY: 'test-secret',
    NEXT_PUBLIC_S3_BUCKET_NAME: 'test-bucket',
  },
}));

// Helper to mock Clerk auth
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
}));
import { auth } from '@clerk/nextjs/server';

function createRequest(body: any) {
  return {
    json: async () => body,
  } as unknown as NextRequest;
}

describe('POST /api/getPresignedURL', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 if not authenticated', async () => {
    (auth as unknown as Mock).mockResolvedValue({ userId: null });
    const req = createRequest({ filename: 'test.png', filetype: 'image/png' });
    const res = await POST(req);

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toBe('Unauthorized');
  });

  it('returns 400 if missing filename', async () => {
    (auth as unknown as Mock).mockResolvedValue({ userId: 'user_123' });
    const req = createRequest({ filetype: 'image/png' });
    const res = await POST(req);

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe('Missing filename or filetype');
  });

  it('returns 400 if missing filetype', async () => {
    (auth as unknown as Mock).mockResolvedValue({ userId: 'user_123' });
    const req = createRequest({ filename: 'test.png' });
    const res = await POST(req);

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe('Missing filename or filetype');
  });

  it('returns 400 if empty body', async () => {
    (auth as unknown as Mock).mockResolvedValue({ userId: 'user_123' });
    const req = createRequest({});
    const res = await POST(req);

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe('Missing filename or filetype');
  });

  it('returns presigned URL and key for valid request', async () => {
    (auth as unknown as Mock).mockResolvedValue({ userId: 'user_123' });
    const req = createRequest({ filename: 'test.png', filetype: 'image/png' });
    const res = await POST(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.url).toBe('https://mock-s3-url');
    expect(json.key).toMatch(/^uploads\/\d+-test\.png$/);
  });
}); 