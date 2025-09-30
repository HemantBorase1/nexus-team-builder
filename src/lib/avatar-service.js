import { uploadImageBuffer, deleteByPublicId } from "./cloudinary";
import getSupabaseClient from "./supabaseClient";

export async function updateUserAvatar({ userId, file }) {
  if (!file) throw new Error('No file');
  if (!file.type?.startsWith('image/')) throw new Error('Invalid image');
  if (file.size > 5 * 1024 * 1024) throw new Error('File too large');

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const publicId = `user_${userId}`;
  const result = await uploadImageBuffer(buffer, {
    folder: 'nexus/avatars',
    format: 'webp',
    transformation: [{ width: 256, height: 256, crop: 'fill', gravity: 'face', fetch_format: 'auto', quality: 'auto' }]
  });

  const supabase = getSupabaseClient();
  const { error } = await supabase.from('profiles').update({ avatar_url: result.secure_url }).eq('id', userId);
  if (error) throw new Error(error.message);
  return { url: result.secure_url, public_id: result.public_id };
}


