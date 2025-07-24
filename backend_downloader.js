const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/download', async (req, res) => {
  const { url, format } = req.body;

  if (!ytdl.validateURL(url)) {
    return res.status(400).json({ error: 'Invalid YouTube URL' });
  }

  try {
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title.replace(/[^a-zA-Z0-9]/g, '_');
    const extension = format === 'audio' ? 'mp3' : 'mp4';

    res.header('Content-Disposition', `attachment; filename="${title}.${extension}"`);
    const filter = format === 'audio' ? 'audioonly' : 'videoandaudio';
    ytdl(url, { filter }).pipe(res);
  } catch (error) {
    console.error('Error during download:', error);
    res.status(500).json({ error: 'Failed to process video' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
