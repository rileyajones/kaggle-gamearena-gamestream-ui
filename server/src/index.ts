import express from 'express';
import cors from 'cors';
import path from 'path';
import { json as bodyParserJson } from 'body-parser';

const app = express();

app.use(cors());
app.use(bodyParserJson());

async function fetchEpisode(episodeId: string) {
    const url = `https://www.kaggleusercontent.com/episodes/${episodeId}.json`;
    const response = await fetch(url);
    return response.json();
}


app.get('/api/episode/:episodeId', async (req, res) => {
    res.json(await fetchEpisode(req.params.episodeId));
});

app.use('/static', express.static(path.join(__dirname, '../static')));

// Used for serving the ui in production mode
app.use('/', express.static(path.join(__dirname, '../../ui/dist')));

const port = process.env.PORT ?? 3001;

app.listen(port, () => {
    console.log(`express server listening on port ${port}`);
});
