import cron from "node-cron";

/**
 * Backend Keep-Alive Cron Service
 * Hits the application API every 5 minutes (or configured interval)
 * to keep cloud instances (e.g. Render, Railway, Glitch) active and prevent cold starts.
 */
export function startKeepAliveCron(port) {
  const intervalMinutes = parseInt(process.env.PING_INTERVAL_MINUTES || "5", 10);
  const cronExpression = `*/${intervalMinutes} * * * *`;

  console.log(`[Cron] Initializing Keep-Alive Cron (Every ${intervalMinutes} minutes: "${cronExpression}").`);

  // Determine target URL from cloud external URL (Render), non-local .env, or fallback host
  const getTargetUrl = () => {
    // 1. Prioritize Render external URL for public ping to prevent free tier cold starts
    if (process.env.RENDER_EXTERNAL_URL) {
      return `${process.env.RENDER_EXTERNAL_URL.replace(/\/$/, "")}/api/products`;
    }
    // 2. Use APP_URL if not localhost
    if (process.env.APP_URL && !process.env.APP_URL.includes("localhost") && !process.env.APP_URL.includes("127.0.0.1")) {
      return `${process.env.APP_URL.replace(/\/$/, "")}/api/products`;
    }
    // 3. Use API_URL if not localhost
    if (process.env.API_URL && !process.env.API_URL.includes("localhost") && !process.env.API_URL.includes("127.0.0.1")) {
      return `${process.env.API_URL.replace(/\/$/, "")}/products`;
    }
    // 4. Fallback for local development
    const host = process.env.HOST && process.env.HOST !== "0.0.0.0" ? process.env.HOST : "127.0.0.1";
    return `http://${host}:${port}/api/products`;
  };

  const pingApi = async () => {
    const url = getTargetUrl();
    const timestamp = new Date().toISOString();
    try {
      const response = await fetch(url, {
        headers: { "User-Agent": "HealthNutra-KeepAliveCron/1.0" },
      });
      const data = await response.json();
      const count = data.count !== undefined ? data.count : "ok";
      console.log(`[Cron Keep-Alive] [${timestamp}] Pinged ${url} -> Status ${response.status} (Active Products: ${count})`);
    } catch (err) {
      console.warn(`[Cron Keep-Alive] [${timestamp}] Ping warning to ${url}: ${err.message}`);
    }
  };

  // Schedule the recurring task
  cron.schedule(cronExpression, pingApi);

  // Initial ping 8 seconds after boot
  setTimeout(pingApi, 8000);
}

