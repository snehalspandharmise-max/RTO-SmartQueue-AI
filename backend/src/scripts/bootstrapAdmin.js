
import dotenv from 'dotenv';
import { supabase, isSupabaseConfigured } from '../config/supabaseClient.js';

dotenv.config();

function getArgument(name) {
  const args = process.argv.slice(2);
  const index = args.indexOf(`--${name}`);

  return index === -1 ? null : args[index + 1];
}

async function findAuthUserByEmail(email) {
  let page = 1;
  const perPage = 1000;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage
    });

    if (error) {
      throw new Error(`Unable to search Supabase users: ${error.message}`);
    }

    const users = data.users || [];

    const existingUser = users.find(
      user => user.email?.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
      return existingUser;
    }

    if (users.length < perPage) {
      return null;
    }

    page++;
  }
}

async function bootstrapAdmin() {
  const email = getArgument('email')?.trim().toLowerCase();
  const name = getArgument('name')?.trim();
  const password = getArgument('password');
  const suppliedSecret = getArgument('secret');

  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured. Check the backend .env file.');
  }

  if (!email || !name || !password || !suppliedSecret) {
    throw new Error(
      'Required arguments: --email, --name, --password, and --secret.'
    );
  }

  if (!process.env.ADMIN_BOOTSTRAP_SECRET) {
    throw new Error('ADMIN_BOOTSTRAP_SECRET is missing from backend .env.');
  }

  if (suppliedSecret !== process.env.ADMIN_BOOTSTRAP_SECRET) {
    throw new Error('Invalid admin bootstrap secret.');
  }

  if (password.length < 8) {
    throw new Error('Admin password must contain at least 8 characters.');
  }

  console.log('Connecting to Supabase...');

  const existingUser = await findAuthUserByEmail(email);
  let authUser;

  if (existingUser) {
    console.log('Existing authentication account found. Updating it...');

    const { data, error } = await supabase.auth.admin.updateUserById(
      existingUser.id,
      {
        password,
        email_confirm: true,
        user_metadata: {
          full_name: name
        }
      }
    );

    if (error) {
      throw new Error(`Unable to update admin account: ${error.message}`);
    }

    authUser = data.user;
  } else {
    console.log('Creating a new administrator account...');

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: name
      }
    });

    if (error) {
      throw new Error(`Unable to create admin account: ${error.message}`);
    }

    authUser = data.user;
  }

  if (!authUser?.id) {
    throw new Error('Supabase did not return an administrator user ID.');
  }

  const { data: existingProfile, error: lookupError } = await supabase
    .from('profiles')
    .select('id, email')
    .eq('email', email)
    .maybeSingle();

  if (lookupError) {
    throw new Error(`Unable to check admin profile: ${lookupError.message}`);
  }

  if (existingProfile && existingProfile.id !== authUser.id) {
    throw new Error(
      'A profile with this email belongs to a different user ID. Resolve that existing account before continuing.'
    );
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .upsert(
      {
        id: authUser.id,
        email,
        full_name: name,
        role: 'admin'
      },
      { onConflict: 'id' }
    );

  if (profileError) {
    throw new Error(`Unable to save admin profile: ${profileError.message}`);
  }

  console.log('');
  console.log('ADMIN ACCOUNT READY');
  console.log('Email:', email);
  console.log('Role: admin');
  console.log('Authentication: Supabase Auth');
  console.log('Profile: Supabase PostgreSQL');
  console.log('');
  console.log('The administrator account is ready for login.');
}

bootstrapAdmin().catch(error => {
  console.error('');
  console.error('ADMIN SETUP FAILED');
  console.error(error.message);
  process.exitCode = 1;
});
