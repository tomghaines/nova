import { describe, test, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/wander/route';

global.fetch = vi.fn(); // Mock fetch globally

describe('POST /wander', () => {
  const validRequest = {
    /* json: vi.fn().mockReturnValue({ newsContent: 'Latest in Web3 trends' }), */
    json: () => { return {newsContent: 'Latest in Web3 trends'} },
    headers: new Headers ({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }),
    url: 'http://localhost:3000/api/wander',
  };  

/*   console.log('Mocked Request:', validRequest); */
  
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test.skip('should return 400 if newsContent is missing', async () => {
    const request = {
      ...validRequest,
      json: vi.fn().mockResolvedValue({}), // Simulate missing newsContent
    };
  
    const response = await POST(request as any);
  
    expect(response.status).toBe(400);
    const jsonResponse = await response.json();
    expect(jsonResponse.error).toBe('News content is required');
  });
  

  test.skip('should handle network errors', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const response = await POST(validRequest as any);

    expect(response.status).toBe(500);
    const jsonResponse = await response.json();
    expect(jsonResponse.error).toBe('Network error occurred');
  });

  test.skip('should handle non-200 responses from wander API', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      text: vi.fn().mockResolvedValue('Error details'),
    });

    const response = await POST(validRequest as any);

    expect(response.status).toBe(500);
    const jsonResponse = await response.json();
    expect(jsonResponse.error).toContain('API returned an error');
  });

  test.skip('should handle JSON parsing errors', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
    });

    const response = await POST(validRequest as any);

    expect(response.status).toBe(500);
    const jsonResponse = await response.json();
    expect(jsonResponse.error).toBe('Failed to parse response from Perplexity API');
    expect(jsonResponse.details).toBe('Invalid JSON');
  });

  test.skip('should return recommendations as JSON', async () => {
    const jsonRequest = {
      ...validRequest,
      headers: new Headers({ Accept: 'application/json' }),
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue({
        choices: [{ message: { content: 'Recommended articles on Web3 trends' } }],
      }),
    });

    const response = await POST(jsonRequest as any);

    expect(response.status).toBe(200);
    const jsonResponse = await response.json();
    expect(jsonResponse.recommendations).toBe('Recommended articles on Web3 trends');
  });

  test.skip('should return recommendations as HTML', async () => {
    const htmlRequest = {
      ...validRequest,
      headers: new Headers({ Accept: 'text/html' }),
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue({
        choices: [{ message: { content: 'Recommended articles on Web3 trends' } }],
      }),
    });

    const response = await POST(htmlRequest as any);

    expect(response.status).toBe(200);
    const textResponse = await response.text();
    expect(textResponse).toContain('<h1>Recommended Readings</h1>');
    expect(textResponse).toContain('<p>Recommended articles on Web3 trends</p>');
  });

  test('should handle unsupported Accept headers', async () => {
    const unsupportedRequest = {
      ...validRequest,
      headers: new Headers({ Accept: 'application/xml' }), // Unsupported format
    };

    const response = await POST(unsupportedRequest as any);

    expect(response.status).toBe(500);
    const jsonResponse = await response.json();
    expect(jsonResponse.error).toBe('Network error occurred');
  });
});
