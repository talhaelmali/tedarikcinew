import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();

const GOOGLE_TRANSLATE_API_KEY = 'YOUR_GOOGLE_TRANSLATE_API_KEY'; // Google Translate API anahtarını buraya koy

app.use(cors());
app.use(express.json());

app.post('/translate', async (req, res) => {
  const { text, targetLang } = req.body;

  try {
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`,
      {
        method: 'POST',
        body: JSON.stringify({
          q: text,
          target: targetLang,
          format: 'text',
        }),
        headers: { 'Content-Type': 'application/json' },
      }
    );

    const data = await response.json();
    const translatedText = data.data.translations[0].translatedText;
    res.json({ translatedText });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: 'Translation failed' });
  }
});

const PORT = 5000; // Sunucu 5000 portunda çalışacak
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
