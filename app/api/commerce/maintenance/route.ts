import { matchesSecret, reconcileExpired } from '@/lib/commerce/payments';
import { sendPendingNotifications } from '@/lib/commerce/notifications';

export async function POST(request: Request) {
  const secret = process.env.COMMERCE_MAINTENANCE_TOKEN;
  if (!secret || !matchesSecret(request.headers.get('authorization') ?? '', 'Bearer ' + secret)) {
    return new Response(null, { status: 401 });
  }
  const results = await Promise.allSettled([reconcileExpired(), sendPendingNotifications()]);
  return new Response(null, { status: results.some(result => result.status === 'rejected') ? 503 : 204 });
}
