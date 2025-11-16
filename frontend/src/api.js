const API_BASE = "http://127.0.0.1:8000/api";

export const uploadCSV = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch(`${API_BASE}/upload/`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      let message = await res.text();
      throw new Error("Upload failed → " + message);
    }

    return await res.json();

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return { error: err.message };
  }
};

export const getHistory = async () => {
  try {
    const res = await fetch(`${API_BASE}/history/`);
    return await res.json();
  } catch (err) {
    console.error("HISTORY ERROR:", err);
    return [];
  }
};
