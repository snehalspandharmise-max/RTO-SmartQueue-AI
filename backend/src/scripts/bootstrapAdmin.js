import dotenv from 'dotenv';
import crypto from 'node:crypto';
import { inMemoryDB } from '../config/db.js';

dotenv.config();

/**
 * Secure Administrator Bootstrap Script
 * Allows authorized system maintainers to bootstrap or promote an admin account.
 */
function bootstrap() {
  const args = process.argv.slice(2);
  const getArg = (key) => {
    const idx = args.indexOf(`--${key}`);
    return idx !== -1 ? args[idx + 1] : null;
  };

  const email = getArg('email') || 'superadmin@rto.demo';
  const name = getArg('name') || 'Super Administrator';
  const password = getArg('password') || 'AdminSecurePass2026!';
  const secret = getArg('secret') || process.env.ADMIN_BOOTSTRAP_SECRET;

  console.log('====================================================');
  console.log('  RTO SmartQueue AI — Admin Role Bootstrap Procedure');
  console.log('====================================================');

  if (secret !== process.env.ADMIN_BOOTSTRAP_SECRET) {
    console.error('❌ Error: Invalid ADMIN_BOOTSTRAP_SECRET. Access denied.');
    process.exit(1);
  }

  const existing = inMemoryDB.findOne('profiles', p => p.email.toLowerCase() === email.toLowerCase());

  if (existing) {
    inMemoryDB.update('profiles', existing.id, {
      role: 'admin',
      full_name: name,
      password_hash: password
    });
    console.log(`✅ User '${email}' successfully promoted to 'admin' role.`);
  } else {
    const newAdmin = inMemoryDB.insert('profiles', {
      id: crypto.randomUUID(),
      email: email.toLowerCase(),
      full_name: name,
      password_hash: password,
      role: 'admin'
    });
    console.log(`✅ New Administrator '${newAdmin.email}' created with ID: ${newAdmin.id}`);
  }

  inMemoryDB.insert('audit_logs', {
    actor_id: 'SYSTEM_BOOTSTRAP',
    action: 'BOOTSTRAP_ADMIN_ROLE',
    target_type: 'profile',
    target_id: email,
    change_summary: { email, role: 'admin', bootstrapped_at: new Date().toISOString() },
    ip_address: '127.0.0.1'
  });

  console.log('🔒 Action logged to audit_logs.');
  console.log('====================================================\n');
}

bootstrap();
