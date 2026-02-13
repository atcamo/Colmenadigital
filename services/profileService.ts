
import { supabase } from './supabase';
import { GeneratedWebProfile, BeekeeperInput } from '../types';

export const profileService = {
  async saveProfile(userId: string, profile: GeneratedWebProfile, inputData: BeekeeperInput) {
    if (!supabase) {
      console.warn("Supabase no está configurado. No se pudo guardar el perfil.");
      return null;
    }

    // Generamos un slug básico basado en el nombre de la granja
    const slug = inputData.farmName.toLowerCase().trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const { data, error } = await supabase
      .from('beekeepers')
      .upsert({
        user_id: userId,
        profile_data: profile,
        input_data: inputData,
        slug: slug,
        // Al guardar por primera vez el usuario, queda pendiente de aprobación
        // a menos que ya exista y mantengamos su estado.
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (error) throw error;
    return data;
  },

  async getProfile(userId: string) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('beekeepers')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async getAllProfiles() {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('beekeepers')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async approveProfile(userId: string, isApproved: boolean) {
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('beekeepers')
      .update({ is_approved: isApproved })
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  }
};
