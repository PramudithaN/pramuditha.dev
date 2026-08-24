import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { PortfolioContent } from './contentStore';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('placeholder')
  );
};

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const TABLE_NAME = 'portfolio_content';
const RECORD_ID = 'main';

/**
 * Fetch portfolio data from Supabase DB
 */
export async function fetchRemoteContent(): Promise<PortfolioContent | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('data')
      .eq('id', RECORD_ID)
      .maybeSingle();

    if (error) {
      console.warn('Supabase fetch notice:', error.message);
      return null;
    }
    if (data && data.data) {
      return data.data as PortfolioContent;
    }
    return null;
  } catch (err) {
    console.warn('Supabase fetch error:', err);
    return null;
  }
}

/**
 * Save portfolio data to Supabase DB
 */
export async function saveRemoteContent(
  content: PortfolioContent
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    return { success: false, error: 'Supabase is not configured yet.' };
  }
  try {
    const { error } = await supabase.from(TABLE_NAME).upsert(
      {
        id: RECORD_ID,
        data: content,
        updated_at: new Date().toISOString()
      },
      { onConflict: 'id' }
    );

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to save to Supabase' };
  }
}

/**
 * Admin Authentication via Supabase Auth (Email + Password)
 */
export async function loginWithSupabase(
  email: string,
  pass: string
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    return { success: false, error: 'Supabase is not configured' };
  }
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: pass
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: Boolean(data.session) };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to sign in with Supabase' };
  }
}

export async function checkSupabaseSession(): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { data } = await supabase.auth.getSession();
    return Boolean(data.session);
  } catch {
    return false;
  }
}

export async function logoutSupabase(): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.auth.signOut();
  } catch {}
}
