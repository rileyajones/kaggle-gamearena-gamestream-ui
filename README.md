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
