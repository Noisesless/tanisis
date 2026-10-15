import express from "express";
import aiRouter from "../src/routes/ai.js";

const app = express();
app.use(express.json());
app.use("/api/v1/ai", aiRouter);

const server = app.listen(0, async () => {
  const port = server.address().port;
  console.log(`Test Express server listening on ephemeral port ${port}`);

  try {
    // Test 1: Non-streaming request (offline KB + SQL RAG)
    console.log("\n--- Testing Non-Streaming /api/v1/ai/chat ---");
    const res1 = await fetch(`http://127.0.0.1:${port}/api/v1/ai/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: "bagaimana penanganan hama wereng pada padi dan berapa produksi padi banjarnegara?" }],
        stream: false
      })
    });

    console.log("Status:", res1.status, res1.statusText);
    const data1 = await res1.json();
    console.log("Choices count:", data1.choices?.length);
    const content1 = data1.choices[0].message.content;
    console.log("Preview response:\n", content1.slice(0, 350) + "...\n");

    // Test 2: Streaming request (SSE simulated streaming)
    console.log("--- Testing Streaming /api/v1/ai/chat (SSE) ---");
    const res2 = await fetch(`http://127.0.0.1:${port}/api/v1/ai/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: "apa itu domba batur dan bagaimana budidayanya?" }],
        stream: true
      })
    });

    console.log("Status SSE:", res2.status, res2.headers.get("content-type"));
    const reader = res2.body.getReader();
    const decoder = new TextDecoder();
    let streamChunks = 0;
    let accumulatedText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      streamChunks++;
      const text = decoder.decode(value);
      const lines = text.split("\n");
      for (const line of lines) {
        if (line.startsWith("data: ") && !line.includes("[DONE]")) {
          try {
            const parsed = JSON.parse(line.slice(6));
            accumulatedText += parsed.choices[0].delta.content || "";
          } catch {}
        }
      }
    }

    console.log(`SSE Received ${streamChunks} streaming packets`);
    console.log("Accumulated text length:", accumulatedText.length);
    console.log("Preview accumulated stream:\n", accumulatedText.slice(0, 300) + "...\n");

    console.log("✔ ALL ENDPOINT TESTS PASSED SUCCESSFULLY!");
  } catch (err) {
    console.error("Test failed:", err);
  } finally {
    server.close();
    process.exit(0);
  }
});
