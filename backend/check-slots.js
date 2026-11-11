
import { supabase } from './src/config/db.js';

const officeId = 'a0000000-0000-0000-0000-000000000001';
const serviceId = 'b0000000-0000-0000-0000-000000000001';

const { data, error } = await supabase
  .from('appointment_slots')
  .select('id, slot_date, start_time, end_time, max_capacity, booked_count, is_active')
  .eq('office_id', officeId)
  .eq('service_id', serviceId)
  .order('slot_date')
  .order('start_time');

if (error) {
  console.error('Database error:', error.message);
  process.exitCode = 1;
} else {
  console.log('\nACTUAL SUPABASE APPOINTMENT SLOTS:\n');
  console.table(data);
}
