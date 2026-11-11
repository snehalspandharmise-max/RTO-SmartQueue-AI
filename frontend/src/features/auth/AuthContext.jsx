
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from 'react';

import { api } from '../../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    localStorage.getItem('rto_auth_token') || null
  );
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('rto_auth_token');
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    let active = true;

    async function loadUser() {
      if (!token) {
        if (active) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        const data = await api.get('/me');

        if (active) {
          setUser(data.user);
        }
      } catch (err) {
        console.warn('Session invalid. Please sign in again:', err.message);

        if (active) {
          logout();
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      active = false;
    };
  }, [token, logout]);

  const login = async (email, password) => {
    const data = await api.post('/auth/login', {
      email,
      password
    });

    if (!data.token || !data.user) {
      throw new Error(
        'Login did not return a valid session. Please try again.'
      );
    }

    localStorage.setItem('rto_auth_token', data.token);
    setToken(data.token);
    setUser(data.user);

    return data.user;
  };

  const register = async ({
    email,
    password,
    full_name,
    phone
  }) => {
    const data = await api.post('/auth/register', {
      email,
      password,
      full_name,
      phone
    });

    if (!data.token || !data.user) {
      throw new Error(
        data.message ||
        'Account created, but automatic login was unsuccessful. Please sign in.'
      );
    }

    localStorage.setItem('rto_auth_token', data.token);
    setToken(data.token);
    setUser(data.user);

    return data.user;
  };

  const demoLogin = async (role) => {
    if (role === 'admin') {
      return login('admin@smartqueue.demo', 'admin123');
    }

    return login('citizen@smartqueue.demo', 'citizen123');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        demoLogin,
        logout,
        isAuthenticated: Boolean(user)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider'
    );
  }

  return context;
}
