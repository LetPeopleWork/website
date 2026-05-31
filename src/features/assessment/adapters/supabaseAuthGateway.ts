import { supabase } from "@/integrations/supabase/client";
import type { AuthGateway, AuthSession } from "../ports";

const toSession = (email: string | undefined | null): AuthSession | null =>
  email ? { email } : null;

export const createSupabaseAuthGateway = (
  client = supabase,
): AuthGateway => ({
  async currentSession() {
    const { data } = await client.auth.getSession();
    return toSession(data.session?.user.email);
  },
  async signIn(email, password) {
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      return { ok: false, error: error.message };
    }
    const session = toSession(data.user?.email);
    if (!session) {
      return { ok: false, error: "Sign in did not return a session." };
    }
    return { ok: true, session };
  },
  async signOut() {
    await client.auth.signOut();
  },
  onChange(callback) {
    const { data } = client.auth.onAuthStateChange((_event, session) => {
      callback(toSession(session?.user.email));
    });
    return () => data.subscription.unsubscribe();
  },
});
