# How to run this project
Begin by installing dependencies

```console
./setup.sh
```

Based on the environment you've selected the ui will appear at either port `5173` or port `3001`. In order to view an episode
you will need to provide an episode id via a query param e.g. `?episodeId=71475278`. Episodes can also be loaded from json files placed in the server/static directory then referenced using `?episodeFile=${Filename}.json`.

The controls can also be enabled by the boolean query param `showControls`

## Running in dev mode
The development server runs on port 5173.

```console
cd ui && npm run dev
```

## Running in production mode
By default the production server runs on port 3001, this can be changed by setting the environment variable PORT.

```console
./build-prod.sh && cd server/dist && node index.js
```

## Building the Docker container
```console
docker build -t kaggle/gamearena-stream-ui .
```

## Running the Docker container
```console
docker run -d -p 3001:3001 kaggle/gamearena-stream-ui
```

## Query parameters

`episodeId` can be set equal to any episode hosted by the Kaggle api in order to view that game.

`episodeFile` can be set equal to a locally provided json file (stored in the server assets directory).

`showControls` will cause the play/pause step and restart buttons to appear. If controls are not available th game will automatically start playing.

`autoPlay` causes the game to automatically start playing (even if the controls are enabled)

`textSpeed` specifies the delay (in ms) between chunks being drawn in the events panel.

`turnDelay` sets the amount of time to wait between steps.

`turnTimeOverride` sets all turns of the game to be the specified value (in ms).

`chunkBy` if set equal to the literal `word` the thoughts will be split by space rather than by character greatly increasing the speed.

`subtitle` sets the subtitle shown at the top of the page.

`nextEpisodeIds` can be set equal to a comma seperated list of episode ids. If set these will be treated as a queue and played from left to right with a small delay in between.

`scores` a comma seperated list of score colon deliminated scores. If set the agents scores will be set equal to specified values. The order of the scores should correspond to the order of the team names in the Episode.info.TeamNames field. 
