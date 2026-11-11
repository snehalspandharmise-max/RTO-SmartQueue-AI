import app from './app.js';
import dotenv from 'dotenv';
import { isSupabaseConfigured } from './config/db.js';
import { verifySupabaseConnection, getDatabaseStatus } from './config/supabaseClient.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, async () => {
  console.log('\n================================================================');
  console.log('   🏛️  RTO SmartQueue AI — Backend REST API & Prediction Engine');
  console.log('================================================================');
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log(`🩺 Health endpoint:   http://localhost:${PORT}/api/health`);
  
  if (isSupabaseConfigured) {
    const check = await verifySupabaseConnection();
    if (check.connected) {
      console.log(`💾 Database:          Supabase PostgreSQL (VERIFIED CONNECTED)`);
    } else {
      console.warn(`⚠️  Database Warning:  Supabase configured but unverified (${check.message})`);
    }
  } else {
    console.log(`💾 Database Mode:     Built-in High-Fidelity Relational Store (Local Academic Demo)`);
  }
  console.log('----------------------------------------------------------------');
  console.log('🎓 Academic Demonstration Accounts:');
  console.log('   👑 Administrator : admin@smartqueue.demo    (pass: admin123)');
  console.log('   👤 Demo Citizen  : citizen@smartqueue.demo  (pass: citizen123)');
  console.log('================================================================\n');
});

// Graceful termination
function shutdown() {
  console.log('\nClosing RTO SmartQueue AI HTTP server...');
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
