
import { supabase } from './supabase';
import { GeneratedWebProfile, BeekeeperInput } from '../types';

export const profileService = {
  async saveProfile(userId: string, profile: GeneratedWebProfile, inputData: BeekeeperInput) {
    if (!supabase) {
      console.warn("Supabase no está configurado. No se pudo guardar el perfil.");
      return null;
    }
    const { data, error } = await supabase
      .from('beekeepers')
      .upsert({
        user_id: userId,
        profile_data: profile,
        input_data: inputData,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (error) throw error;
    return data;
  },

  async getProfile(userId: string) {
    if (!supabase) {
      return null;
    }
    const { data, error } = await supabase
      .from('beekeepers')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
    return data;
  }
};
