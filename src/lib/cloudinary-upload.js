// Client-side upload to Cloudinary via unsigned/signed preset

export async function uploadToCloudinary(file, { onProgress, folder = "nexus/avatars" } = {}) {
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  if (!cloud || !preset) throw new Error('Cloudinary is not configured');
  const endpoint = `https://api.cloudinary.com/v1_1/${cloud}/image/upload`;

  const form = new FormData();
  form.append('file', file);
  form.append('upload_preset', preset);
  form.append('folder', folder);
  form.append('tags', 'avatar');
  form.append('context', 'alt=User Avatar');
  // Let cloudinary auto-format and compress
  form.append('quality', 'auto');
  form.append('fetch_format', 'auto');

  const xhr = new XMLHttpRequest();
  const p = new Promise((resolve, reject) => {
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        try {
          const json = JSON.parse(xhr.responseText || '{}');
          if (xhr.status >= 200 && xhr.status < 300) resolve(json);
          else reject(new Error(json?.error?.message || 'Upload failed'));
        } catch (e) {
          reject(new Error('Upload failed'));
        }
      }
    };
    xhr.onerror = () => reject(new Error('Network error'));
    xhr.open('POST', endpoint, true);
    xhr.send(form);
  });
  return p;
}

export default uploadToCloudinary;


