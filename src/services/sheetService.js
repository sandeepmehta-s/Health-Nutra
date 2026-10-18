// Saves rows to Google Sheets through an Apps Script web app (see README).
const URL = import.meta.env.VITE_SHEET_URL;

export const saveToSheet = (type, data) => {
  if (!URL) return Promise.resolve();
  return fetch(URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({ type, data: { date: new Date().toLocaleString("en-IN"), ...data } }),
  }).catch(() => {});
};
