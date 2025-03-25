import z from 'zod';

const schema = z.object({
  VITE_AUTHORIZATION_TOKEN: z.string(),
  VITE_API_URL: z.string(),
  VITE_SOCKET_URL: z.string(),
});

const envResult = schema.safeParse({
  VITE_AUTHORIZATION_TOKEN: import.meta.env.VITE_AUTHORIZATION_TOKEN,
  VITE_API_URL: import.meta.env.VITE_API_URL,
  VITE_SOCKET_URL: import.meta.env.VITE_SOCKET_URL,
});

if (envResult.error) {
  throw new Error('Invalid environment variables');
}

export default envResult.data;
