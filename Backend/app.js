import OpenAI from "openai";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
const corsOptions = {
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true, 
};
app.use(cors(corsOptions));
app.use(express.json());
const openai = new OpenAI({
  apiKey: "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", 
});

let conversationHistory = [
  { role: "system", content: "You are a helpful assistant." },
];
app.post("/ask", async (req, res) => {
  const userMessage = req.body.message;
  conversationHistory.push({ role: "user", content: userMessage });
  try {
    const completion = await openai.chat.completions.create({
      messages: conversationHistory,
      model: "gpt-3.5-turbo",
    });
    const botResponse = completion.choices[0].message.content;
    conversationHistory.push({ role: "assistant", content: botResponse });
    res.json({ message: botResponse });
  } catch (error) {
    console.error("Error calling OpenAI: ", error);
    res.status(500).send("Error generating response from OpenAI");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});