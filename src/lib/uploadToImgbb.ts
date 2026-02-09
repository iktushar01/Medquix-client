// lib/uploadToImgbb.ts
export const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "";

export const uploadToImgbb = async (file: File): Promise<string> => {
  if (!IMGBB_API_KEY) throw new Error("IMGBB API key is missing");

  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (!data.success) throw new Error("Image upload failed");

  return data.data.url; // This is the URL you can send to your server
};
