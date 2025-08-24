// file: pages/api/search-history.js

import { HfInference } from '@huggingface/inference';

// Inisialisasi dengan API Token dari .env.local
const hf = new HfInference(process.env.HUGGINGFACE_TOKEN);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  try {
    const result = await hf.chatCompletion({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      messages: [
        {
          role: "system",
          // PERUBAHAN DI SINI: Tambahkan perintah untuk menjawab dalam Bahasa Indonesia
          content: "Anda adalah seorang ahli sejarah Islam dan Hukum Islam yang akurat dan terpercaya. Jawab pertanyaan hanya jika berkaitan dengan sejarah Islam. Jika tidak, tolak dengan sopan. Selalu jawab dalam Bahasa Indonesia."
        },
        {
          role: "user",
          content: query,
        }
      ],
      max_tokens: 500,
    });

    const answer = result.choices[0].message.content;
    res.status(200).json({ answer: answer });

  } catch (error) {
    console.error("Error calling Hugging Face API:", error);
    res.status(500).json({ error: "Gagal berkomunikasi dengan AI" });
  }
}