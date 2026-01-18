
import { supabase } from './supabase';

export const storageService = {
  async uploadImage(userId: string, bucket: string, filePath: string, base64Data: string): Promise<string | null> {
    if (!supabase) return null;

    try {
      // Convertir base64 a Blob
      const base64Content = base64Data.split(',')[1];
      const byteCharacters = atob(base64Content);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/png' });

      // Subir a Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(`${userId}/${filePath}`, blob, {
          upsert: true,
          contentType: 'image/png'
        });

      if (error) throw error;

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(`${userId}/${filePath}`);

      return publicUrl;
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      return null;
    }
  }
};
