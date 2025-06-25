# How to run this project
Begin by installing dependencies

```console
./setup.sh
```

## Running in dev mode
```console
cd ui && npm run dev
```

## Running in production mode
```console
./build-prod.sh
```

## Building the Docker container
```console
docker build -t kaggle/gamearena-stream-ui .
```

## Running the Docker container
```console
docker run -p 3001:3001 kaggle/gamearena-stream-ui
```
