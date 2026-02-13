const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export async function uploadResume(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_BASE_URL}/upload-resume`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to upload resume");
  return res.json();
}

export async function selectRole(role: string) {
  const res = await fetch(`${API_BASE_URL}/select-role`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role }),
  });
  if (!res.ok) throw new Error("Failed to select role");
  return res.json();
}

export async function getJob() {
  const res = await fetch(`${API_BASE_URL}/job`);
  if (!res.ok) throw new Error("Failed to fetch job");
  return res.json();
}

export async function swipeJob(action: "like" | "reject") {
  const res = await fetch(`${API_BASE_URL}/swipe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action }),
  });
  if (!res.ok) throw new Error("Failed to swipe");
  return res.json();
}

export async function getResumeSuggestions() {
  const res = await fetch(`${API_BASE_URL}/resume-suggestions`);
  if (!res.ok) throw new Error("Failed to get suggestions");
  return res.json();
}

export async function approveResume() {
  const res = await fetch(`${API_BASE_URL}/approve-resume`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to approve resume");
  return res.json();
}

export async function applyToJob() {
  const res = await fetch(`${API_BASE_URL}/apply`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to apply");
  return res.json();
}
