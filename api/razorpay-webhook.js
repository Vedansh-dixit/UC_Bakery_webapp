// api/razorpay-webhook.js
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  // Verify webhook signature
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const shasum = crypto.createHmac('sha256', webhookSecret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest('hex');

  if (digest !== req.headers['x-razorpay-signature']) {
    return res.status(400).json({ error: 'Invalid signature' });
  }

  const event = req.body.event;
  if (event === 'payment.captured') {
    const payment = req.body.payload.payment.entity;
    const razorpayOrderId = payment.order_id;

    // Update order status
    const { error } = await supabase
      .from('uc_orders')
      .update({
        payment_status: 'paid',
        status: 'confirmed',
        razorpay_payment_id: payment.id,
        updated_at: Date.now(),
      })
      .eq('razorpay_order_id', razorpayOrderId);

    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Database update failed' });
    }
  }

  res.status(200).json({ received: true });
}