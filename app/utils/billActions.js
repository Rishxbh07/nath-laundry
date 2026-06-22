import { createClient } from '@/app/utils/supabase/client';

export async function deliverBill(orderId) {
  const supabase = createClient();

  try {
    // 1. Fetch current order data to read its current state flags
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('payment_status, final_amount, payment_method')
      .eq('id', orderId)
      .single();

    if (fetchError || !order) {
      return { success: false, error: 'Order record could not be found.' };
    }

    // 2. Fetch the current logged-in user profile session
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized: No active worker session found.' };
    }

    // 3. Align state rules for payment tracking
    const updatedPaymentStatus = (order.payment_status === 'PRE-PAID' || order.payment_status === 'PAID')
      ? order.payment_status 
      : 'PAID';

    // 4. Default the payment method to 'UPI' if it hasn't been defined yet
    const finalPaymentMethod = order.payment_method || 'UPI';

    // 5. Update the record cleanly using only your standard schema columns
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'DELIVERED',          // Switches order tracker status to DELIVERED
        bill_status: 'CLOSED',        // Closes main billing lifecycle state string
        is_open: false,               // Strictly false: hides from active dashboard queues
        payment_status: updatedPaymentStatus,
        payment_method: finalPaymentMethod, 
        
        // Relational Audit Tracking Parameters
        closed_by: user.id,           // Saves the logged-in staff member's true UUID
        completed_at: new Date().toISOString() // Trace when the bill was closed
      })
      .eq('id', orderId);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Handover Exception Tracker:', err);
    return { success: false, error: 'Unexpected communication failure with the backend database.' };
  }
}