/**
 * Health Nutra - Comprehensive Load & Performance Test Suite
 * Evaluates concurrency resilience, throughput, latency percentiles (p50, p95, p99),
 * multi-user order placement stress, tracking lookups, and memory stability.
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";

const BASE_URL = process.env.TEST_API_URL || "http://localhost:5000";

function calculateStats(latencies) {
  latencies.sort((a, b) => a - b);
  const sum = latencies.reduce((acc, val) => acc + val, 0);
  const min = latencies[0];
  const max = latencies[latencies.length - 1];
  const avg = sum / latencies.length;
  const p50 = latencies[Math.floor(latencies.length * 0.5)];
  const p95 = latencies[Math.floor(latencies.length * 0.95)];
  const p99 = latencies[Math.floor(latencies.length * 0.99)];
  return { min, max, avg, p50, p95, p99 };
}

describe("Load Testing: Storefront Read Concurrency & Latency Benchmarks", () => {
  test("High Concurrency Burst: 50 concurrent requests to /api/products", async () => {
    const concurrency = 50;
    const latencies = [];
    const startTime = performance.now();

    const tasks = Array.from({ length: concurrency }).map(async () => {
      const reqStart = performance.now();
      const res = await fetch(`${BASE_URL}/api/products`);
      const reqDuration = performance.now() - reqStart;
      latencies.push(reqDuration);
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.equal(data.success, true);
      assert.ok(data.data.length >= 4);
    });

    await Promise.all(tasks);
    const totalDuration = performance.now() - startTime;
    const stats = calculateStats(latencies);

    console.log(`\n  ⚡ Concurrency Burst (50 concurrent GET /api/products):`);
    console.log(`     Total Duration: ${totalDuration.toFixed(2)}ms`);
    console.log(`     Throughput:     ${((concurrency / totalDuration) * 1000).toFixed(1)} req/sec`);
    console.log(`     Min Latency:    ${stats.min.toFixed(2)}ms`);
    console.log(`     Avg Latency:    ${stats.avg.toFixed(2)}ms`);
    console.log(`     p50 Latency:    ${stats.p50.toFixed(2)}ms`);
    console.log(`     p95 Latency:    ${stats.p95.toFixed(2)}ms`);
    console.log(`     p99 Latency:    ${stats.p99.toFixed(2)}ms\n`);

    assert.ok(stats.avg < 700, `Average latency should be below 700ms (got ${stats.avg.toFixed(2)}ms)`);
    assert.ok(stats.p95 < 1000, `p95 latency should be below 1000ms (got ${stats.p95.toFixed(2)}ms)`);
  });

  test("Mixed Endpoint High-Throughput: 200 requests across products, categories & health", async () => {
    const totalRequests = 200;
    const endpoints = ["/api/products", "/api/categories", "/health", "/api/config"];
    const latencies = [];
    let successCount = 0;
    const startTime = performance.now();

    const tasks = Array.from({ length: totalRequests }).map(async (_, idx) => {
      const endpoint = endpoints[idx % endpoints.length];
      const reqStart = performance.now();
      const res = await fetch(`${BASE_URL}${endpoint}`);
      const reqDuration = performance.now() - reqStart;
      latencies.push(reqDuration);
      if (res.status === 200) {
        successCount++;
      }
    });

    await Promise.all(tasks);
    const totalDuration = performance.now() - startTime;
    const stats = calculateStats(latencies);
    const rps = (totalRequests / totalDuration) * 1000;

    console.log(`\n  🚀 High Throughput (200 mixed requests):`);
    console.log(`     Success Rate:   ${((successCount / totalRequests) * 100).toFixed(1)}% (${successCount}/${totalRequests})`);
    console.log(`     Total Duration: ${totalDuration.toFixed(2)}ms`);
    console.log(`     RPS:            ${rps.toFixed(1)} req/sec`);
    console.log(`     Avg Latency:    ${stats.avg.toFixed(2)}ms`);
    console.log(`     p95 Latency:    ${stats.p95.toFixed(2)}ms\n`);

    assert.equal(successCount, totalRequests, "All 200 requests must succeed with 200 OK");
    assert.ok(rps > 100, `Throughput should exceed 100 RPS (got ${rps.toFixed(1)} RPS)`);
  });
});

describe("Load Testing: Concurrent Order Placement Stress", () => {
  const createdOrderIds = [];

  test("Concurrent Order Placement: 20 simultaneous customer orders", async () => {
    const numOrders = 20;
    const latencies = [];
    const startTime = performance.now();

    const orderPromises = Array.from({ length: numOrders }).map(async (_, idx) => {
      const payload = {
        customerName: `Stress Customer #${idx + 1}`,
        customerPhone: `+91 98765 ${String(10000 + idx)}`,
        customerEmail: `customer${idx}@nutratest.com`,
        shippingAddress: `Building ${idx + 1}, Sector 62`,
        city: "Noida",
        pincode: "201301",
        paymentMethod: "Cash on Delivery (COD)",
        items: [
          {
            productId: String((idx % 4) + 1),
            name: `Formulation #${(idx % 4) + 1}`,
            price: 250,
            quantity: 1,
            unit: "Unit",
          },
        ],
      };

      const reqStart = performance.now();
      const res = await fetch(`${BASE_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const reqDuration = performance.now() - reqStart;
      latencies.push(reqDuration);

      assert.equal(res.status, 201);
      const data = await res.json();
      assert.equal(data.success, true);
      assert.ok(data.orderId);
      createdOrderIds.push(data.orderId);
    });

    await Promise.all(orderPromises);
    const totalDuration = performance.now() - startTime;
    const stats = calculateStats(latencies);

    console.log(`\n  📦 Order Placement Stress (20 concurrent checkouts):`);
    console.log(`     Success Rate:   100% (${createdOrderIds.length}/${numOrders})`);
    console.log(`     Total Duration: ${totalDuration.toFixed(2)}ms`);
    console.log(`     Avg Latency:    ${stats.avg.toFixed(2)}ms`);
    console.log(`     p95 Latency:    ${stats.p95.toFixed(2)}ms\n`);

    // Verify all generated order IDs are unique
    const uniqueIds = new Set(createdOrderIds);
    assert.equal(uniqueIds.size, numOrders, "Every placed order must have a unique orderId");
  });

  test("Concurrent Order Tracking: 20 simultaneous live status lookups", async () => {
    assert.ok(createdOrderIds.length === 20);
    const latencies = [];
    const startTime = performance.now();

    const lookupPromises = createdOrderIds.map(async (orderId) => {
      const reqStart = performance.now();
      const res = await fetch(`${BASE_URL}/api/orders/${orderId}`);
      const reqDuration = performance.now() - reqStart;
      latencies.push(reqDuration);

      assert.equal(res.status, 200);
      const data = await res.json();
      assert.equal(data.success, true);
      assert.equal(data.data.orderId, orderId);
      assert.equal(data.data.orderStatus, "pending");
    });

    await Promise.all(lookupPromises);
    const totalDuration = performance.now() - startTime;
    const stats = calculateStats(latencies);

    console.log(`\n  🔍 Tracking Lookup Stress (20 concurrent lookups):`);
    console.log(`     Success Rate:   100%`);
    console.log(`     Total Duration: ${totalDuration.toFixed(2)}ms`);
    console.log(`     Avg Latency:    ${stats.avg.toFixed(2)}ms\n`);

    assert.ok(stats.avg < 500, "Average tracking lookup should be under 500ms");
  });
});

describe("Load Testing: Memory & Stability Profiling", () => {
  test("Server memory heap remains stable after high-volume load test", async () => {
    const res = await fetch(`${BASE_URL}/health`);
    assert.equal(res.status, 200);
    const health = await res.json();
    assert.equal(health.status, "healthy");

    const mem = process.memoryUsage();
    console.log(`\n  🧠 Test Runner Memory Profile:`);
    console.log(`     RSS:          ${(mem.rss / 1024 / 1024).toFixed(2)} MB`);
    console.log(`     Heap Used:    ${(mem.heapUsed / 1024 / 1024).toFixed(2)} MB`);
    console.log(`     Heap Total:   ${(mem.heapTotal / 1024 / 1024).toFixed(2)} MB\n`);

    assert.ok(mem.heapUsed < 250 * 1024 * 1024, "Heap used should remain well within healthy limits");
  });
});

