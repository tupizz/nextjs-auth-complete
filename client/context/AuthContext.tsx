import {createContext, ReactNode, useEffect, useState} from 'react'
import Router from 'next/router'
import { api } from '../services/api';
import { setCookie, parseCookies, destroyCookie } from 'nookies';

type User = {
   email:string;
   permissions: string[];
   roles: string[];
}

type SignInCredentials = {
  email: string;
  password: string;
}

type AuthContextData = {
  signIn(credentials: SignInCredentials): Promise<void>;
  isAuthenticated: boolean;
  user: User;
}

export const AuthContext = createContext({} as AuthContextData);

type AuthProviderProps = {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, userSet] = useState<User>(null);
  const isAuthenticated = !!user;

  useEffect(() => {
    // Hydration of the context on each refresh
    const { 'nextauth.token': token } = parseCookies();

    if(token) {
      api.get('/me')
      .then(response => {
        const { permissions, roles, email } = response.data;

        userSet({
          email,
          permissions,
          roles,
        });
      })
      .catch(() => {
        destroyCookie(undefined, 'nextauth.token');
        destroyCookie(undefined, 'nextauth.refreshToken');
        Router.push('/');
      });
    }
  }, []);

  async function signIn(credentials: SignInCredentials) {
    try {
      const response = await api.post('/sessions', credentials);

      const { token, refreshToken, permissions, roles } = response.data;

      setCookie(undefined, 'nextauth.token', token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/'
      });

      setCookie(undefined, 'nextauth.refreshToken', refreshToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/'
      });

      userSet({
        email: credentials.email,
        permissions,
        roles,
      });

      // We should update our api client using the token because now the api client is updated
      api.defaults.headers['Authorization'] = `Bearer ${token}`;

      Router.push('/private/dashboard');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, user, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}