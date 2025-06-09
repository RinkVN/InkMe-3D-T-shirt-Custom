// routes/ai.js
const express = require("express");
const router = express.Router();
const { OpenAI } = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/chat", async (req, res) => {
  const { thread_id, message, images = [] } = req.body;

  try {
    // 1. Tạo hoặc lấy thread
    const thread = thread_id
      ? await openai.beta.threads.retrieve(thread_id)
      : await openai.beta.threads.create();

    // 2. Upload ảnh nếu có
    const fileIds = [];
    for (const img of images) {
      const buffer = Buffer.from(img.dataUrl.split(",")[1], "base64");
      const upload = await openai.files.create({
        purpose: "assistants",
        file: buffer,
        filename: img.name,
      });
      fileIds.push(upload.id);
    }

    // 3. Gửi message vào thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: message,
      attachments: fileIds.map((id) => ({
        file_id: id,
        tools: [{ type: "file" }],
      })),
    });

    // 4. Tạo "run" để Assistant trả lời, và stream kết quả
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const stream = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: process.env.OPENAI_ASSISTANT_ID,
      stream: true,
    });

    for await (const event of stream) {
      if (event.event === "thread.message.delta") {
        const delta = event.data.delta.content?.[0]?.text?.value || "";
        res.write(`data:${delta}\n\n`);
      } else if (event.event === "thread.run.completed") {
        res.write(`event:done\ndata:${thread.id}\n\n`);
        res.end();
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
