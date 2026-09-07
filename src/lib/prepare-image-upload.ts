/** Max upload size for Vercel serverless (request body ~4.5MB). */
const MAX_BYTES = 4 * 1024 * 1024;

/**
 * Resize/compress phone photos before upload so admin uploads work on mobile + Vercel.
 */
export async function prepareImageForUpload(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file (JPG, PNG, or WebP).");
  }

  if (file.size <= 900_000 && file.type === "image/jpeg") {
    return file;
  }

  const bitmap = await createImageBitmap(file);
  const maxEdge = 1600;
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    return file;
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  let quality = 0.88;
  let blob = await canvasToBlob(canvas, quality);

  while (blob.size > MAX_BYTES && quality > 0.45) {
    quality -= 0.08;
    blob = await canvasToBlob(canvas, quality);
  }

  if (blob.size > MAX_BYTES) {
    throw new Error(
      "Image is too large even after compression. Try a smaller photo or crop it first."
    );
  }

  const base = file.name.replace(/\.[^.]+$/, "") || "product";
  return new File([blob], `${base}.jpg`, { type: "image/jpeg" });
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Could not compress image"))),
      "image/jpeg",
      quality
    );
  });
}

export async function uploadAdminImage(file: File): Promise<{
  url: string;
  publicId?: string;
  demo?: boolean;
}> {
  const prepared = await prepareImageForUpload(file);
  const fd = new FormData();
  fd.append("file", prepared);

  let res: Response;
  try {
    res = await fetch("/api/upload", {
      method: "POST",
      body: fd,
      credentials: "same-origin",
    });
  } catch {
    throw new Error(
      "Network error — check your connection, stay on the same site (www), and try again."
    );
  }

  let data: { error?: string; url?: string; publicId?: string; demo?: boolean } = {};
  try {
    data = await res.json();
  } catch {
    throw new Error("Upload failed — server did not respond. Try a smaller photo.");
  }

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Session expired — please log in to Studio Admin again.");
    }
    throw new Error(data.error || "Upload failed");
  }

  if (!data.url) {
    throw new Error("Upload failed — no image URL returned.");
  }

  return {
    url: data.url,
    publicId: data.publicId,
    demo: data.demo,
  };
}

export async function adminFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  try {
    return await fetch(input, { ...init, credentials: "same-origin" });
  } catch {
    throw new Error(
      "Network error — check connection or log in again at Studio Admin."
    );
  }
}
