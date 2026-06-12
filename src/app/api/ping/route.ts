// Route segment config — always dynamic, never cached
export const dynamic = "force-dynamic";
export const runtime = "edge";

export async function GET() {
  // Keep the response body minimal — we want to measure network RTT,
  // not JSON serialization overhead.
  return new Response(
    JSON.stringify({ ts: Date.now(), ok: 1 }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    }
  );
}
