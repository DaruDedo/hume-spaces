import { cookies } from 'next/headers';
import { createHmac } from 'node:crypto';
import { matchesSecret } from './payments';

const cookieName = 'hume_staff';
const ttl = 120 * 24 * 60 * 60;
export function adminConfigured() {
  const passwordLength = process.env.COMMERCE_ADMIN_PASSWORD?.length ?? 0;
  return passwordLength > 0 && passwordLength <= 256
    && (process.env.COMMERCE_SESSION_SECRET?.length ?? 0) >= 32;
}

function signature(value: string) {
  return createHmac('sha256', process.env.COMMERCE_SESSION_SECRET!)
    .update(value).update(':').update(process.env.COMMERCE_ADMIN_PASSWORD!).digest('hex');
}

export async function isAdmin() {
  if (!adminConfigured()) return false;
  const value = (await cookies()).get(cookieName)?.value;
  if (!value) return false;
  const [expires, proof] = value.split('.');
  return Number(expires) > Date.now() / 1000 && Boolean(proof) && matchesSecret(proof, signature(expires));
}

export async function adminLogin(password: string) {
  if (!adminConfigured() || !matchesSecret(password, process.env.COMMERCE_ADMIN_PASSWORD!)) return false;
  const expires = String(Math.floor(Date.now() / 1000) + ttl);
  (await cookies()).set(cookieName, expires + '.' + signature(expires), {
    httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: ttl,
  });
  return true;
}

export async function adminLogout() {
  (await cookies()).delete(cookieName);
}
