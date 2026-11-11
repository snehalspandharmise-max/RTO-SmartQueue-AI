
import jwt from 'jsonwebtoken';
import { supabase, isSupabaseConfigured } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET;

export async function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.substring(7).trim()
    : null;

  if (!token) {
    req.user = null;
    return next();
  }

  if (!JWT_SECRET) {
    return res.status(503).json({
      error: {
        code: 'AUTH_CONFIGURATION_ERROR',
        message: 'Authentication is not properly configured.'
      }
    });
  }

  if (!isSupabaseConfigured || !supabase) {
    return res.status(503).json({
      error: {
        code: 'DATABASE_UNAVAILABLE',
        message: 'Authentication database is unavailable.'
      }
    });
  }

  try {
    // 1. Verify the backend API token.
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded.id) {
      return res.status(401).json({
        error: {
          code: 'INVALID_TOKEN',
          message: 'Authentication token is invalid.'
        }
      });
    }

    // 2. Retrieve the real profile from Supabase.
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, phone, role')
      .eq('id', decoded.id)
      .maybeSingle();

    if (error) {
      console.error('Authentication profile lookup failed:', error.message);

      return res.status(503).json({
        error: {
          code: 'PROFILE_LOOKUP_FAILED',
          message: 'Unable to verify your user profile. Please try again.'
        }
      });
    }

    // 3. Never silently create or assume a citizen profile.
    if (!profile) {
      return res.status(403).json({
        error: {
          code: 'PROFILE_NOT_FOUND',
          message: 'Your user profile does not exist in the database.'
        }
      });
    }

    // 4. Attach verified database profile to request.
    req.user = {
      id: profile.id,
      email: profile.email,
      full_name: profile.full_name,
      phone: profile.phone,
      role: profile.role
    };

    return next();

  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: {
          code: 'TOKEN_EXPIRED',
          message: 'Your session has expired. Please log in again.'
        }
      });
    }

    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: {
          code: 'INVALID_TOKEN',
          message: 'Authentication token is invalid.'
        }
      });
    }

    console.error('Authentication error:', err.message);

    return res.status(500).json({
      error: {
        code: 'AUTHENTICATION_ERROR',
        message: 'Unable to authenticate this request.'
      }
    });
  }
}

export function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required to access this resource.'
      }
    });
  }

  return next();
}

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

  return next();
}
