import { handleStripeWebhookRequest } from '@/lib/stripe_webhook_handler';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  return handleStripeWebhookRequest(request);
}
