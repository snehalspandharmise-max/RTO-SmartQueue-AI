import jwt from 'jsonwebtoken';
import { inMemoryDB, supabase, isSupabaseConfigured } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'rto-smartqueue-academic-jwt-secret-key-35619';

/**
 * Extract and verify authentication token
 */
export async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') 
    ? authHeader.substring(7).trim() 
    : null;

  if (!token) {
    req.user = null;
    return next();
  }

  // 1. Check for Academic Viva / Demo Convenience Tokens
  if (token === 'demo-admin-token') {
    const adminUser = inMemoryDB.findOne('profiles', p => p.role === 'admin');
    req.user = adminUser || {
      id: '11111111-1111-1111-1111-111111111111',
      email: 'admin@smartqueue.demo',
      role: 'admin',
      full_name: 'Demonstration Administrator'
    };
    return next();
  }

  if (token === 'demo-citizen-token') {
    const citizenUser = inMemoryDB.findOne('profiles', p => p.email === 'citizen@smartqueue.demo');
    req.user = citizenUser || {
      id: '22222222-2222-2222-2222-222222222222',
      email: 'citizen@smartqueue.demo',
      role: 'citizen',
      full_name: 'Aarav Sharma (Demo Citizen)'
    };
    return next();
  }

  // 2. Try Supabase Auth verification if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (user && !error) {
        // Look up profile to check role
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        req.user = {
          id: user.id,
          email: user.email,
          role: profile?.role || 'citizen',
          full_name: profile?.full_name || user.user_metadata?.full_name || 'Citizen'
        };
        return next();
      }
    } catch (sbErr) {
      // Continue to local JWT fallback
    }
  }

  // 3. Fallback standard local JWT verification
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Fetch profile from database to ensure up-to-date role
    const profile = inMemoryDB.findById('profiles', decoded.id) || decoded;
    req.user = {
      id: profile.id,
      email: profile.email,
      role: profile.role,
      full_name: profile.full_name
    };
    return next();
  } catch (jwtErr) {
    req.user = null;
    return res.status(401).json({
      error: {
        code: 'INVALID_TOKEN',
        message: 'Authentication token is invalid or has expired.'
      }
    });
  }
}

/**
 * Strict middleware requiring an authenticated user
 */
export function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required to access this resource.'
      }
    });
  }
  next();
}

/**
 * Strict middleware enforcing administrator role
 * Rejects citizens with 403 Forbidden
 */
export function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required.'
      }
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      error: {
        code: 'FORBIDDEN',
        message: 'Access denied. Administrator privileges are required.'
      }
    });
  }

  next();
}
