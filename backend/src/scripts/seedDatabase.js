import { inMemoryDB } from '../config/db.js';

console.log('Resetting and seeding demonstration database records...');
inMemoryDB.reset();
console.log('✅ Demonstration database seeded successfully.');
console.log(`   - ${inMemoryDB.findAll('rto_offices').length} Offices`);
console.log(`   - ${inMemoryDB.findAll('services').length} Configured Services`);
console.log(`   - ${inMemoryDB.findAll('counters').length} Active Counters`);
console.log(`   - ${inMemoryDB.findAll('appointment_slots').length} Scheduled Slots`);
console.log(`   - ${inMemoryDB.findAll('appointments').length} Seed Appointments`);
