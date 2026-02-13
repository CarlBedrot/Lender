/**
 * ============================================
 * NOTE: Contains DEMO MODE code - search for "DEMO MODE" to find and remove
 * ============================================
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DEMO_USER, DEMO_ADMIN } from '../lib/demoData'; // DEMO MODE
import type { Profile } from '../lib/types';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  isDemoMode: boolean; // DEMO MODE
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    phone: string,
    fullName?: string
  ) => Promise<void>;
  signOut: () => Promise<void>;
  demoLogin: (asAdmin?: boolean) => void; // DEMO MODE
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // DEMO MODE - check if running without Supabase
  const isDemoMode = !isSupabaseConfigured;

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data as Profile;
  };

  useEffect(() => {
    // DEMO MODE - skip Supabase auth if not configured
    if (isDemoMode) {
      setIsLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id).then(setProfile);
      }
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        setProfile(profile);
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [isDemoMode]);

  const signIn = async (email: string, password: string) => {
    // DEMO MODE - use demo login instead
    if (isDemoMode) {
      throw new Error('Använd demo-inloggning i demo-läge');
    }
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signUp = async (
    email: string,
    password: string,
    phone: string,
    fullName?: string
  ) => {
    // DEMO MODE
    if (isDemoMode) {
      throw new Error('Registrering är inte tillgänglig i demo-läge');
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          phone,
          full_name: fullName,
        },
      },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    // DEMO MODE
    if (isDemoMode) {
      setUser(null);
      setProfile(null);
      setSession(null);
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  // DEMO MODE - fake login function
  const demoLogin = (asAdmin = false) => {
    const demoProfile = asAdmin ? DEMO_ADMIN : DEMO_USER;
    setProfile(demoProfile);
    setUser({ id: demoProfile.id, email: demoProfile.email } as User);
    setSession({} as Session);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        isLoading,
        isAdmin: profile?.is_admin ?? false,
        isDemoMode, // DEMO MODE
        signIn,
        signUp,
        signOut,
        demoLogin, // DEMO MODE
      }}
    >
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
