
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL?.trim();
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY?.trim();
const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY?.trim();

// Backend database client.
// This client uses the secret key and must NEVER be exposed to the frontend.
export const isSupabaseConfigured = Boolean(
  SUPABASE_URL &&
  SUPABASE_SECRET_KEY &&
  SUPABASE_URL.startsWith('https://') &&
  SUPABASE_SECRET_KEY.startsWith('sb_secret_')
);

// Public authentication client.
// This client uses the publishable key for signing users in.
export const isSupabaseAuthConfigured = Boolean(
  SUPABASE_URL &&
  SUPABASE_PUBLISHABLE_KEY &&
  SUPABASE_URL.startsWith('https://') &&
  SUPABASE_PUBLISHABLE_KEY.startsWith('sb_publishable_')
);

let supabaseInstance = null;
let supabaseAuthInstance = null;

let connectionVerified = false;
let lastConnectionCheck = null;
let lastConnectionError = null;

if (isSupabaseConfigured) {
  try {
    supabaseInstance = createClient(
      SUPABASE_URL,
      SUPABASE_SECRET_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
  } catch (err) {
    lastConnectionError = err.message;
  }
}

if (isSupabaseAuthConfigured) {
  try {
    supabaseAuthInstance = createClient(
      SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false
        }
      }
    );
  } catch (err) {
    console.error('Supabase authentication client initialization failed:', err.message);
  }
}

export async function verifySupabaseConnection() {
  if (!isSupabaseConfigured || !supabaseInstance) {
    connectionVerified = false;

    return {
      configured: false,
      connected: false,
      message: 'Supabase secret key is not configured.'
    };
  }

  try {
    const { error } = await supabaseInstance
      .from('rto_offices')
      .select('id')
      .limit(1);

    lastConnectionCheck = new Date().toISOString();

    if (error) {
      connectionVerified = false;
      lastConnectionError = error.message;

      return {
        configured: true,
        connected: false,
        error: error.message
      };
    }

    connectionVerified = true;
    lastConnectionError = null;

    return {
      configured: true,
      connected: true,
      url: SUPABASE_URL,
      message: 'Successfully connected to Supabase PostgreSQL.'
    };
  } catch (err) {
    connectionVerified = false;
    lastConnectionError = err.message;

    return {
      configured: true,
      connected: false,
      error: err.message
    };
  }
}

export function getDatabaseStatus() {
  return {
    configured: isSupabaseConfigured,
    authConfigured: isSupabaseAuthConfigured,
    connected: connectionVerified,
    mode: isSupabaseConfigured
      ? (
          connectionVerified
            ? 'Supabase PostgreSQL (Verified)'
            : 'Supabase Configured (Unverified)'
        )
      : 'Supabase Not Configured',
    url: isSupabaseConfigured ? SUPABASE_URL : null,
    lastCheck: lastConnectionCheck,
    error: lastConnectionError
  };
}

// Secret-key client for trusted backend database operations.
export const supabase = supabaseInstance;

// Publishable-key client for user sign-in.
export const supabaseAuth = supabaseAuthInstance;
