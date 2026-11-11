
import jwt from 'jsonwebtoken';

import {
  supabase,
  supabaseAuth,
  isSupabaseConfigured,
  isSupabaseAuthConfigured,
  getDatabaseStatus
} from '../config/supabaseClient.js';

const JWT_SECRET = process.env.JWT_SECRET;

function createApiToken(profile) {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured in backend environment.');
  }

  return jwt.sign(
    {
      id: profile.id,
      email: profile.email,
      role: profile.role,
      full_name: profile.full_name
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function sendServerError(res, message = 'An unexpected server error occurred.') {
  return res.status(500).json({
    error: {
      code: 'SERVER_ERROR',
      message
    }
  });
}

export class AuthController {

  static getHealth(req, res) {
    res.json({
      status: 'healthy',
      service: 'RTO SmartQueue AI Backend',
      version: '1.0.0',
      academicProject: true,
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      database: getDatabaseStatus()
    });
  }

  // REGISTER NEW CITIZEN USING SUPABASE AUTHENTICATION
  static async register(req, res) {
    try {
      const { email, password, full_name, phone } = req.body;

      if (!email || !password || !full_name) {
        return res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Email, password, and full name are required.'
          }
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Password must contain at least 6 characters.'
          }
        });
      }

      if (!isSupabaseConfigured || !isSupabaseAuthConfigured || !supabase || !supabaseAuth) {
        return res.status(503).json({
          error: {
            code: 'DATABASE_UNAVAILABLE',
            message: 'Supabase authentication is not configured. Please contact the administrator.'
          }
        });
      }

      const normalizedEmail = email.trim().toLowerCase();
      const normalizedName = full_name.trim();

      if (!normalizedName) {
        return res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Full name cannot be empty.'
          }
        });
      }

      // 1. Create the actual Supabase Authentication user.
      const { data: authData, error: authError } =
        await supabase.auth.admin.createUser({
          email: normalizedEmail,
          password,
          email_confirm: true,
          user_metadata: {
            full_name: normalizedName,
            phone: phone || null
          }
        });

      if (authError) {
        const alreadyExists =
          authError.message?.toLowerCase().includes('already') ||
          authError.message?.toLowerCase().includes('registered');

        return res.status(alreadyExists ? 409 : 400).json({
          error: {
            code: alreadyExists
              ? 'EMAIL_ALREADY_REGISTERED'
              : 'REGISTRATION_FAILED',
            message: alreadyExists
              ? 'An account with this email address already exists.'
              : authError.message
          }
        });
      }

      const authUser = authData.user;

      if (!authUser) {
        return sendServerError(res, 'Supabase did not return the newly created user.');
      }

      // 2. Create the matching PostgreSQL profile.
      const newProfile = {
        id: authUser.id,
        email: normalizedEmail,
        full_name: normalizedName,
        phone: phone || null,
        role: 'citizen'
      };

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert(newProfile)
        .select()
        .single();

      if (profileError) {
        // Remove the Auth user if profile creation fails.
        await supabase.auth.admin.deleteUser(authUser.id);

        console.error('Profile creation failed:', profileError.message);

        return res.status(500).json({
          error: {
            code: 'PROFILE_CREATION_FAILED',
            message: 'Your profile could not be created. Please try registering again.'
          }
        });
      }

      // 3. Sign in the new user through Supabase Auth.
      const { error: signInError } =
        await supabaseAuth.auth.signInWithPassword({
          email: normalizedEmail,
          password
        });

      if (signInError) {
        console.error('New user sign-in failed:', signInError.message);

        return res.status(201).json({
          message: 'Registration successful. Please sign in using your new account.',
          user: {
            id: profile.id,
            email: profile.email,
            full_name: profile.full_name,
            phone: profile.phone,
            role: profile.role
          }
        });
      }

      // 4. Create the backend API session token.
      const token = createApiToken(profile);

      // 5. Add a welcome notification.
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: profile.id,
          notification_type: 'WELCOME',
          title: 'Welcome to RTO SmartQueue AI',
          message: 'Your citizen account has been created. You can now book RTO appointments and track queues in real-time.',
          is_read: false
        });

      if (notificationError) {
        console.warn('Welcome notification could not be created:', notificationError.message);
      }

      return res.status(201).json({
        message: 'Registration successful',
        token,
        user: {
          id: profile.id,
          email: profile.email,
          full_name: profile.full_name,
          phone: profile.phone,
          role: profile.role
        }
      });

    } catch (err) {
      console.error('Registration error:', err.message);
      return sendServerError(res, err.message);
    }
  }

  // LOGIN THROUGH SUPABASE AUTHENTICATION
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Email and password are required.'
          }
        });
      }

      if (!isSupabaseConfigured || !isSupabaseAuthConfigured || !supabase || !supabaseAuth) {
        return res.status(503).json({
          error: {
            code: 'DATABASE_UNAVAILABLE',
            message: 'Supabase authentication is not configured.'
          }
        });
      }

      // 1. Verify credentials with Supabase Auth.
      const { data: authData, error: authError } =
        await supabaseAuth.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password
        });

      if (authError || !authData.user) {
        return res.status(401).json({
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password.'
          }
        });
      }

      // 2. Retrieve the matching PostgreSQL profile.
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, full_name, phone, role')
        .eq('id', authData.user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Profile lookup failed:', profileError.message);
        return sendServerError(res, 'Unable to retrieve your user profile.');
      }

      if (!profile) {
        return res.status(403).json({
          error: {
            code: 'PROFILE_NOT_FOUND',
            message: 'Your authentication account exists, but its user profile is missing. Please contact the administrator.'
          }
        });
      }

      // 3. Issue the API token.
      const token = createApiToken(profile);

      return res.json({
        message: 'Login successful',
        token,
        user: {
          id: profile.id,
          email: profile.email,
          full_name: profile.full_name,
          phone: profile.phone,
          role: profile.role
        }
      });

    } catch (err) {
      console.error('Login error:', err.message);
      return sendServerError(res, err.message);
    }
  }

  // GET CURRENT USER PROFILE FROM SUPABASE
  static async getMe(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: {
            code: 'UNAUTHORIZED',
            message: 'Not authenticated.'
          }
        });
      }

      if (!supabase) {
        return res.status(503).json({
          error: {
            code: 'DATABASE_UNAVAILABLE',
            message: 'Database connection is unavailable.'
          }
        });
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, phone, role')
        .eq('id', req.user.id)
        .maybeSingle();

      if (error) {
        console.error('Get profile error:', error.message);
        return sendServerError(res, 'Unable to retrieve your profile.');
      }

      if (!profile) {
        return res.status(404).json({
          error: {
            code: 'PROFILE_NOT_FOUND',
            message: 'Your user profile could not be found.'
          }
        });
      }

      return res.json({ user: profile });

    } catch (err) {
      console.error('Get current user error:', err.message);
      return sendServerError(res, err.message);
    }
  }
}
