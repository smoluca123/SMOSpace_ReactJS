import { getPushPublicKeyAPI, subscribePushAPI, unsubscribePushAPI } from '@/apis/pushApi';

const PUSH_PREF_KEY = 'push:enabled';

/** Convert a base64url VAPID key into the Uint8Array the Push API expects. */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = window.atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) output[i] = raw.charCodeAt(i);
  return output;
}

export function isPushSupported(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

/** User's explicit preference: null = undecided, true/false = opted in/out. */
export function getPushPreference(): boolean | null {
  const v = localStorage.getItem(PUSH_PREF_KEY);
  return v === null ? null : v === 'true';
}

export function setPushPreference(enabled: boolean): void {
  localStorage.setItem(PUSH_PREF_KEY, String(enabled));
}

async function getActiveSubscription(): Promise<PushSubscription | null> {
  if (!isPushSupported()) return null;
  const registration = await navigator.serviceWorker.getRegistration();
  return (await registration?.pushManager.getSubscription()) ?? null;
}

/** True when the browser currently has an active push subscription. */
export async function isPushEnabled(): Promise<boolean> {
  if (!isPushSupported() || Notification.permission !== 'granted') return false;
  return !!(await getActiveSubscription());
}

export type EnablePushError = 'unsupported' | 'server-disabled' | 'denied' | 'failed';

/**
 * Register the service worker, request permission, subscribe and persist the
 * subscription on the server. Throws an {@link EnablePushError} string on
 * failure so callers can show a precise message.
 */
export async function enablePush(): Promise<void> {
  if (!isPushSupported()) throw 'unsupported' as EnablePushError;

  const keyRes = await getPushPublicKeyAPI();
  const publicKey = keyRes?.data?.publicKey;
  if (!publicKey) throw 'server-disabled' as EnablePushError;

  if (Notification.permission !== 'granted') {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') throw 'denied' as EnablePushError;
  }

  const registration = await navigator.serviceWorker.register('/sw.js');
  await navigator.serviceWorker.ready;

  const existing = await registration.pushManager.getSubscription();
  const subscription =
    existing ??
    (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    }));

  const json = subscription.toJSON();
  if (!json.endpoint || !json.keys) throw 'failed' as EnablePushError;

  await subscribePushAPI({
    endpoint: json.endpoint,
    keys: { p256dh: json.keys.p256dh, auth: json.keys.auth },
    userAgent: navigator.userAgent,
  });

  setPushPreference(true);
}

/** Unsubscribe locally and on the server, and remember the opt-out. */
export async function disablePush(): Promise<void> {
  const subscription = await getActiveSubscription();
  if (subscription) {
    const { endpoint } = subscription;
    await subscription.unsubscribe().catch(() => undefined);
    await unsubscribePushAPI(endpoint).catch(() => undefined);
  }
  setPushPreference(false);
}
