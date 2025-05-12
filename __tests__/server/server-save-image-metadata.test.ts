

import { describe, beforeEach, it, expect, vi, type Mock } from 'vitest';
import { saveImageMetadata } from '@/server/actions/save-image-metadata';
import { ddb } from '@/server/db';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { auth } from '@clerk/nextjs/server';


vi.mock('@/env', () => ({
  env: {
    AWS_DYNAMO_DB_TABLE: 'test-table',
  },
}));

vi.mock('@aws-sdk/lib-dynamodb', () => ({
  PutCommand: vi.fn(),
}));
vi.mock('@/server/db', () => ({
  ddb: {
    send: vi.fn(),
  },
}));
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
}));

vi.mock('nanoid', () => ({
  nanoid: () => 'test-nanoid-id',
}));

describe('saveImageMetadata action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('saves valid metadata to DynamoDB', async () => {
    // Mock authentication
    (auth as unknown as Mock).mockResolvedValue({ userId: 'user_123' });

    // Mock valid input
    const validInput = {
      key: 'test-key',
      url: 'https://example.com/image.png',
      filename: 'image.png',
      userID: 'user_123',
    };

    // Call the function
    await saveImageMetadata(validInput);

    // Check if the PutCommand was called with the correct parameters
    expect(ddb.send).toHaveBeenCalledWith(expect.any(PutCommand));
    expect(PutCommand).toHaveBeenCalledWith({
      TableName: expect.any(String),
      Item: expect.objectContaining({
        key: 'test-key',
        url: 'https://example.com/image.png',
        filename: 'image.png',
        userID: 'user_123',
      }),
    });
  });

  it('throws error if not authenticated', async () => {
    // Mock authentication failure
    (auth as unknown as Mock).mockResolvedValue({ userId: null });

    // Mock valid input
    const validInput = {
      key: 'test-key',
      url: 'https://example.com/image.png',
      filename: 'image.png',
      userID: 'user_123',
    };

    // Expect the function to throw an error
    await expect(saveImageMetadata(validInput)).rejects.toThrow('Not authenticated');
  });

  it('validates input schema', async () => {
    // Mock authentication
    (auth as unknown as Mock).mockResolvedValue({ userId: 'user_123' });

    // Mock invalid input with missing or incorrect fields
    const invalidInput = {
      key: 'test-key',
      url: 'https://example.com/image.png',
      filename: '', // Invalid or empty filename
      userID: '',   // Invalid or empty userID
    };

    // Expect the function to throw a validation error
    await expect(saveImageMetadata(invalidInput)).rejects.toThrow();
  });
});  