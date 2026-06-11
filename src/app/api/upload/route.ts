// Route segment config — always dynamic, never cached
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  // Stream the body instead of buffering via arrayBuffer().
  // This avoids memory spikes for large payloads and allows the server
  // to respond with bytes-received while data is still flowing.
  let bytesReceived = 0;

  if (request.body) {
    const reader = request.body.getReader();
    // Drain the stream — we only need to count bytes, not store them
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytesReceived += value.byteLength;
    }
  }

  return Response.json(
    {
      success: true,
      bytesReceived,
      // Server-side timestamp allows the client to compute one-way propagation
      serverTimestamp: Date.now(),
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "Pragma": "no-cache",
      },
    }
  );
}
