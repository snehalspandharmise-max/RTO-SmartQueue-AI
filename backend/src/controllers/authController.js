import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { inMemoryDB } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'rto-smartqueue-academic-jwt-secret-key-35619';

export class AuthController {
  /**
   * Health endpoint returning system status and database mode
   */
  static getHealth(req, res) {
    res.json({
      status: 'healthy',
      service: 'RTO SmartQueue AI Backend',
      version: '1.0.0',
      academicProject: true,
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      database: {
        mode: process.env.SUPABASE_URL ? 'Supabase PostgreSQL' : 'Built-in High-Fidelity Relational Store',
        status: 'connected'
      }
    });
  }

  /**
   * Public Citizen Registration
   * Role is STRICTLY locked to 'citizen' on the server.
   */
  static register(req, res) {
    const { email, password, full_name, phone } = req.body;

    if (!email || !password || !full_name) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Email, password, and full name are required.'
        }
      });
    }

    // Check if email already registered
    const existing = inMemoryDB.findOne('profiles', p => p.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(409).json({
        error: {
          code: 'EMAIL_ALREADY_REGISTERED',
          message: 'An account with this email address already exists.'
        }
      });
    }

    // Insert new profile with STRICT role = 'citizen'
    const newProfile = inMemoryDB.insert('profiles', {
      id: crypto.randomUUID(),
      email: email.toLowerCase(),
      password_hash: password, // In production hashed via bcrypt; simplified for academic demo
      full_name,
      phone: phone || null,
      role: 'citizen' // Never allow client-specified role!
    });

    const token = jwt.sign(
      { id: newProfile.id, email: newProfile.email, role: 'citizen', full_name: newProfile.full_name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Initial welcome notification
    inMemoryDB.insert('notifications', {
      user_id: newProfile.id,
      notification_type: 'WELCOME',
      title: 'Welcome to RTO SmartQueue AI',
      message: 'Your citizen account has been created. You can now book RTO appointments and track queues in real-time.',
      is_read: false
    });

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: newProfile.id,
        email: newProfile.email,
        full_name: newProfile.full_name,
        phone: newProfile.phone,
        role: newProfile.role
      }
    });
  }

  /**
   * User login (handles both citizen and bootstrapped admin)
   */
  static login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Email and password are required.'
        }
      });
    }

    const profile = inMemoryDB.findOne('profiles', p => p.email.toLowerCase() === email.toLowerCase());
    if (!profile || profile.password_hash !== password) {
      return res.status(401).json({
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password.'
        }
      });
    }

    const token = jwt.sign(
      { id: profile.id, email: profile.email, role: profile.role, full_name: profile.full_name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
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
  }

  /**
   * Get current authenticated user profile
   */
  static getMe(req, res) {
    if (!req.user) {
      return res.status(401).json({
        error: { code: 'UNAUTHORIZED', message: 'Not authenticated' }
      });
    }

    const profile = inMemoryDB.findById('profiles', req.user.id) || req.user;

    res.json({
      user: {
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        phone: profile.phone,
        role: profile.role
      }
    });
  }
}
