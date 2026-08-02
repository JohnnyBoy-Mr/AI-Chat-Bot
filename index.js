import express from "express";
import dotenv from "dotenv";
import OpenAIApi from "openai";
import axios from "axios";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const openai = new OpenAIApi({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: message },
      ],
    });

    res.status(200).json({
      reply: response.choices[0].message.content,
      success: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
});

const HF_API_URL = "https://router.huggingface.co/v1/chat/completions";

app.post("/hf-chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await axios.post(
      HF_API_URL,
      {
        model: "openai/gpt-oss-120b",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: message },
        ],
      },
      {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        },
      },
    );

    res.status(200).json({
      reply: response.data.choices[0].message.content,
      success: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
