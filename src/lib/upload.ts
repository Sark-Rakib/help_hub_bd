export async function uploadFile(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || "Upload failed");
  }
  return json.data.secure_url as string;
}