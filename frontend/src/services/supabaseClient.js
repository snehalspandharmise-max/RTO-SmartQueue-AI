import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL?.trim();
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const isRealtimeAvailable = Boolean(
  SUPABASE_URL && 
  SUPABASE_ANON_KEY && 
  SUPABASE_URL.startsWith('http') &&
  !SUPABASE_URL.includes('your-project')
);

export const supabase = isRealtimeAvailable 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

/**
 * Subscribe to status updates for a specific appointment.
 * Automatically cleans up on unmount or channel close.
 */
export function subscribeToAppointment(appointmentId, onUpdate) {
  if (!isRealtimeAvailable || !supabase || !appointmentId) {
    return {
      active: false,
      unsubscribe: () => {}
    };
  }

  try {
    const channel = supabase
      .channel(`appointment_realtime_${appointmentId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'appointments',
          filter: `id=eq.${appointmentId}`
        },
        (payload) => {
          if (typeof onUpdate === 'function') {
            onUpdate(payload.new);
          }
        }
      )
      .subscribe();

    return {
      active: true,
      unsubscribe: () => {
        supabase.removeChannel(channel);
      }
    };
  } catch (err) {
    console.warn('[Realtime] Failed to subscribe to appointment channel:', err.message);
    return {
      active: false,
      unsubscribe: () => {}
    };
  }
}
