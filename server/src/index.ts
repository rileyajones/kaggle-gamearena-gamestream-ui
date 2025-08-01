import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

const app = express();

app.use(cors());
app.use(express.json());

async function fetchEpisode(episodeId: string) {
    const url = `https://www.kaggleusercontent.com/episodes/${episodeId}.json`;
    const response = await fetch(url);
    return response.json();
}

function getRecodingPath(episodeId: string) {
  return `static/${episodeId}_recording.txt`;
}

function recordEpisodeMove(episodeId: string) {
  const recordingPath = getRecodingPath(episodeId);
  const file = fs.existsSync(recordingPath) ?
    fs.readFileSync(recordingPath) :
    '';
  fs.writeFileSync(recordingPath, Buffer.from(file + Date.now().toString() + '\n'));
}

function clearEpisodeRecording(episodeId: string) {
  const recordingPath = getRecodingPath(episodeId);
  if (fs.existsSync(recordingPath)) {
    fs.rmSync(recordingPath, {force: true});
  }
}

app.get('/api/episode/:episodeId', async (req, res) => {
    res.json(await fetchEpisode(req.params.episodeId));
});

app.post('/api/episode/:episodeId/move', (req, res) => {
  if (req.body.initialize) {
    clearEpisodeRecording(req.params.episodeId);
  }
  recordEpisodeMove(req.params.episodeId);

  res.status(200);
  res.json({message: 'recorded'});
});

app.use('/static', express.static(path.join(__dirname, '../static')));

// Used for serving the ui in production mode
if (process.env.NODE_ENV) {
    app.use('/', express.static(path.join(__dirname, '../../ui/dist')));
}

const port = process.env.PORT ?? 3001;

app.listen(port, () => {
    console.log(`express server listening on port ${port}`);
});
