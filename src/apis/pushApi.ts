import baseApi from '@/apis/baseApi';

export interface PushSubscriptionPayload {
  endpoint: string;
  keys: { p256dh: string; auth: string };
  userAgent?: string;
}

export const getPushPublicKeyAPI = async () => {
  const { data } = await baseApi.get<{ data: { publicKey: string | null } }>('/push/public-key');
  return data;
};

export const subscribePushAPI = async (payload: PushSubscriptionPayload) => {
  const { data } = await baseApi.post('/push/subscribe', payload);
  return data;
};

export const unsubscribePushAPI = async (endpoint: string) => {
  const { data } = await baseApi.post('/push/unsubscribe', { endpoint });
  return data;
};
