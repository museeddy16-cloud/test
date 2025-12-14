import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getApiUrl } from '../config/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'CLIENT' | 'HOST' | 'ADMIN' | 'AGENT';
  roles?: string[];
  avatar?: string;
  phone?: string;
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const res = await fetch(getApiUrl('/auth/me'), {
            headers: { Authorization: `Bearer ${storedToken}` }
          });
          if (res.ok) {
            const response = await res.json();
            const userData = response.data || response.user || response;
            const roles = userData.roles || [];
            const primaryRole = roles.includes('ADMIN') ? 'ADMIN' : 
                               roles.includes('AGENT') ? 'AGENT' :
                               roles.includes('HOST') ? 'HOST' : 'CLIENT';
            
            setUser({
              id: userData.id,
              email: userData.email,
              firstName: userData.firstName,
              lastName: userData.lastName,
              role: primaryRole,
              roles: roles,
              avatar: userData.photo,
              phone: userData.phoneNumber,
              isVerified: userData.isVerified || false
            });
            setToken(storedToken);
          } else {
            localStorage.removeItem('token');
            setToken(null);
          }
        } catch {
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const res = await fetch(getApiUrl('/auth/signin'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Login failed');
    }
    
    const response = await res.json();
    const data = response.data || response;
    const roles = data.roles || [];
    const primaryRole = roles.includes('ADMIN') ? 'ADMIN' : 
                       roles.includes('AGENT') ? 'AGENT' :
                       roles.includes('HOST') ? 'HOST' : 'CLIENT';
    
    const userData: User = {
      id: data.id,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: primaryRole as 'CLIENT' | 'HOST' | 'ADMIN' | 'AGENT',
      roles: roles,
      avatar: data.photo,
      isVerified: true
    };
    
    setUser(userData);
    setToken(data.token);
    localStorage.setItem('token', data.token);
    
    return userData;
  };

  const register = async (registerData: RegisterData) => {
    const res = await fetch(getApiUrl('/auth/signup'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: registerData.email,
        password: registerData.password,
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        phoneNumber: registerData.phone || '0781234567'
      })
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Registration failed');
    }
    
    const response = await res.json();
    const data = response.data || response;
    const roles = data.roles || ['CLIENT'];
    const primaryRole = roles.includes('ADMIN') ? 'ADMIN' : 
                       roles.includes('AGENT') ? 'AGENT' :
                       roles.includes('HOST') ? 'HOST' : 'CLIENT';
    
    setUser({
      id: data.id || '',
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: primaryRole,
      roles: roles,
      avatar: data.photo,
      isVerified: false
    });
    setToken(data.token);
    localStorage.setItem('token', data.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
