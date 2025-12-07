// File: app/utils/billActions.js
import { createClient } from '@/app/utils/supabase/client'; // <--- FIXED PATH

/**
 * Marks a bill as delivered, paid, and closed.
 * Uses the 'mark_bill_as_delivered' RPC function in Supabase.
 * @param {string} billId - The UUID of the bill to close.
 * @returns {Promise<{success: boolean, data: any, error: any}>}
 */
export const deliverBill = async (billId) => {
  const supabase = createClient();

  try {
    // 1. Call the Database Function (RPC)
    const { data, error } = await supabase
      .rpc('mark_bill_as_delivered', { 
        target_bill_id: billId 
      });

    if (error) {
      console.error('Error in mark_bill_as_delivered:', error.message);
      return { success: false, error: error.message };
    }

    console.log('Bill closed successfully:', data);
    return { success: true, data };

  } catch (err) {
    console.error('Unexpected error:', err);
    return { success: false, error: err.message };
  }
};