// api/create-order.js
import { createClient } from '@supabase/supabase-js';
import Razorpay from 'razorpay';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get the JWT from the Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization header' });
  }
  const token = authHeader.replace('Bearer ', '');

  // Verify the token with Supabase
  const { data: { user }, error: userError } = await supabase.auth.getUser(token);
  if (userError || !user) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const { items, address, phone, paymentMethod } = req.body;

  // Recalculate total from items (use your product prices from DB to be safe)
  // For now, we'll assume items contain price – but you should fetch from DB
  let subtotal = 0;
  for (const item of items) {
    // Optionally, verify product exists and price matches
    const { data: product } = await supabase
      .from('uc_products')
      .select('price')
      .eq('id', item.id)
      .single();
    if (!product) {
      return res.status(400).json({ error: `Product ${item.id} not found` });
    }
    subtotal += product.price * item.quantity;
  }

  const deliveryCharge = subtotal >= (process.env.FREE_DELIVERY_ABOVE || 500) ? 0 : (process.env.DELIVERY_FEE || 49);
  const total = subtotal + deliveryCharge;

  let razorpayOrder = null;
  if (paymentMethod === 'razorpay') {
    // Create Razorpay order
    const options = {
      amount: total * 100, // in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    };
    razorpayOrder = await razorpay.orders.create(options);
  }

  // Generate a custom order ID (optional)
  const orderId = 'ORD-' + Date.now().toString(36).toUpperCase().slice(-6);

  // Save order to Supabase
  const { data: order, error } = await supabase
    .from('uc_orders')
    .insert({
      id: orderId,
      user_id: user.id,
      customer_name: user.user_metadata?.name || '',
      customer_email: user.email,
      items: items.map(i => ({ productId: i.id, name: i.name, quantity: i.quantity, unitPrice: i.price })),
      address,
      phone,
      payment_method: paymentMethod,
      payment_status: paymentMethod === 'razorpay' ? 'pending' : 'pending_verification',
      total,
      delivery_charge: deliveryCharge,
      status: paymentMethod === 'razorpay' ? 'pending' : 'pending_verification',
      created_at: Date.now(),
      updated_at: Date.now(),
      razorpay_order_id: razorpayOrder ? razorpayOrder.id : null,
    })
    .select()
    .single();

  if (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to create order' });
  }

  // Return to frontend: order details + razorpay order (if any)
  res.status(200).json({
    orderId: order.id,
    razorpayOrder,
  });
}