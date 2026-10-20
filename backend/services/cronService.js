import cron from "node-cron";

/**
 * Backend Keep-Alive Cron Service
 * Hits the application API every 5 minutes (or configured interval)
 * to keep cloud instances (e.g. Render, Railway, Glitch) active and prevent cold starts.
 */
export function startKeepAliveCron(port) {
  if (process.env.NODE_ENV === "test" || process.env.DISABLE_CRON === "true") {
    return; // Don't run background timers in test runs
  }

  const intervalMinutes = parseInt(process.env.PING_INTERVAL_MINUTES || "5", 10);
  const cronExpression = `*/${intervalMinutes} * * * *`;

  console.log(`[Cron] Initializing Lightweight Keep-Alive Ping (Every ${intervalMinutes} minutes).`);

  // Determine target URL: prioritize ultra-lightweight /api/ping endpoint
  const getTargetUrl = () => {
    if (process.env.RENDER_EXTERNAL_URL) {
      return `${process.env.RENDER_EXTERNAL_URL.replace(/\/$/, "")}/api/ping`;
    }
    if (process.env.APP_URL && !process.env.APP_URL.includes("localhost") && !process.env.APP_URL.includes("127.0.0.1")) {
      return `${process.env.APP_URL.replace(/\/$/, "")}/api/ping`;
    }
    const host = process.env.HOST && process.env.HOST !== "0.0.0.0" ? process.env.HOST : "127.0.0.1";
    return `http://${host}:${port}/api/ping`;
  };

  const pingApi = async () => {
    const url = getTargetUrl();
    const timestamp = new Date().toISOString();
    try {
      const response = await fetch(url, {
        headers: { "User-Agent": "HealthNutra-KeepAlive/1.0" },
      });
      if (process.env.NODE_ENV !== "production") {
        console.log(`[Keep-Alive] [${timestamp}] Ping ${url} -> Status ${response.status}`);
      }
    } catch (err) {
      console.warn(`[Keep-Alive] [${timestamp}] Ping notice: ${err.message}`);
    }
  };

  cron.schedule(cronExpression, pingApi);
  setTimeout(pingApi, 10000);
}

