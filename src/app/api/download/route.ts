import { type NextRequest } from "next/server";

// Route segment config — always dynamic, never cached
export const dynamic = "force-dynamic";

// Pre-generate a pseudo-random seed buffer that is NOT compressible.
// We reuse this across calls to avoid per-request allocation overhead.
// 64 KB of pseudo-random bytes acts as a repeating pattern — fast to produce
// and guaranteed to be incompressible (no gzip/brotli inflation).
const SEED_CHUNK_SIZE = 64 * 1024; // 64 KB
const seedBuffer = (() => {
  const buf = new Uint8Array(SEED_CHUNK_SIZE);
  // Fill with pseudo-random data using a LCG so it's fast but incompressible
  let state = 0xdeadbeef;
  for (let i = 0; i < buf.length; i++) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    buf[i] = state & 0xff;
  }
  return buf;
})();

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const sizeParam = searchParams.get("size") || "10";
  // Allow up to 200 MB for very fast connections
  const sizeMB = Math.min(Math.max(parseInt(sizeParam, 10) || 10, 1), 200);
  const totalBytes = sizeMB * 1024 * 1024;

  let bytesSent = 0;

  // ReadableStream: starts pushing bytes immediately — no buffering on server.
  // The client's reader receives the first chunk as soon as the stream starts,
  // which is the correct moment to begin timing transfer speed.
  const stream = new ReadableStream({
    pull(controller) {
      if (bytesSent >= totalBytes) {
        controller.close();
        return;
      }

      const remaining = totalBytes - bytesSent;
      const chunkSize = Math.min(SEED_CHUNK_SIZE, remaining);

      // Re-use the pre-allocated seed buffer slice — no new allocation per chunk
      const chunk =
        chunkSize === SEED_CHUNK_SIZE
          ? seedBuffer
          : seedBuffer.slice(0, chunkSize);

      controller.enqueue(chunk);
      bytesSent += chunkSize;
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Length": totalBytes.toString(),
      // Hard no-cache + no-transform prevents Vercel/Cloudflare from applying gzip/Brotli
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0, no-transform",
      "Pragma": "no-cache",
      "Expires": "0",
      // Tell the client the exact payload size so it can track progress
      "X-Content-Size": totalBytes.toString(),
    },
  });
}
