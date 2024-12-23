const express = require('express');
const ytdl = require('ytdl-core');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/download', async (req, res) => {
  const { videoUrl } = req.body;

  if (!ytdl.validateURL(videoUrl)) {
    return res.status(400).json({ error: 'URL invalide.' });
  }

  try {
    const videoInfo = await ytdl.getInfo(videoUrl);
    const title = videoInfo.videoDetails.title.replace(/[^\w\s]/gi, '_');

    res.setHeader('Content-Disposition', `attachment; filename="${title}.mp4"`);
    ytdl(videoUrl, { format: 'mp4' }).pipe(res);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors du téléchargement.' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
