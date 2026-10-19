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

  // Determine target URL: cloud public URL if available, else localhost
  const getTargetUrl = () => {
    if (process.env.APP_URL) {
      return `${process.env.APP_URL.replace(/\/$/, "")}/api/products`;
    }
    if (process.env.RENDER_EXTERNAL_URL) {
      return `${process.env.RENDER_EXTERNAL_URL.replace(/\/$/, "")}/api/products`;
    }
    return `http://localhost:${port}/api/products`;
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
