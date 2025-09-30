import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

export function configureCloudinary() {
  if (!cloudinary.config().cloud_name) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
  }
}

export async function uploadAvatar(buffer, { folder = "nexus/avatars", publicId } = {}) {
  try {
    configureCloudinary();
    const res = await cloudinary.uploader.upload_stream({
      folder,
      public_id: publicId,
      resource_type: "image",
      overwrite: true,
      format: "webp",
      transformation: [
        { width: 256, height: 256, crop: "fill", gravity: "face", fetch_format: "auto", quality: "auto" },
      ],
    });
    // Note: using upload_stream requires wrapping; for simplicity, use a Promise
  } catch (e) {
    throw e;
  }
}

export async function uploadImageBuffer(buffer, opts = {}) {
  configureCloudinary();
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: opts.folder || "nexus/uploads",
        resource_type: "image",
        overwrite: true,
        format: opts.format || "auto",
        transformation: opts.transformation || [{ fetch_format: "auto", quality: "auto" }],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
}

export async function deleteByPublicId(publicId) {
  try {
    configureCloudinary();
    const res = await cloudinary.uploader.destroy(publicId);
    return res;
  } catch (e) {
    return null;
  }
}


