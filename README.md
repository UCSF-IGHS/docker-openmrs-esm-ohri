# OHRI ESM Docker Distribution

A Docker distribution for a custom microfrontend for OpenMRS HIV Reference Implementation (OHRI)

## Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop)
- Docker Image [histacohri/docker-openmrs-esm-ohri](https://hub.docker.com/repository/docker/histacoohri/docker-openmrs-esm-ohri)

## Installation

1. Download and install [Docker](https://www.docker.com/products/docker-desktop) on your machine
2. Clone this repo and enter the newly-created folder

```sh
git clone <repo> && cd <repo name>
```

## Running Docker Image

The docker image can be used in two ways: static (without code modifications) or dynamic (with code modifications).
After running any of the commands below, you can access the app at `localhost:8080/openmrs/spa`.

### Static

In the static mode, you will get to test the ESM without being able to make changes to its source code.

```sh
npm run docker
```

**Note:** You can also run the docker command directly, without using the npm script

```sh
docker run -p 8080:8080 -p 8081:8081 histacoohri/docker-openmrs-esm-ohri:v0.6.3 npx openmrs develop --backend https://ohri-dev.globalhealthapp.net
```

### Dynamic

In the dynamic mode, the folder `src` on your local machine gets mounted to the container so that changes you make locally are reflected in the container. The image has **live reload** enabled, so the changes are automatically applied to the container.

```sh
npm run docker:dev
```

**Note:** You can also run the docker command directly, without using the npm script

```sh
docker compose up
```

We're using `docker compose` to simplify the process of mounting the local `src` directory to the container.

## Build process

After running the commands, you will see

![Building module] 

![Screen Shot 2021-12-03 at 00 01 03](https://user-images.githubusercontent.com/4475142/144519142-f2955512-4a81-44ab-b6be-3bcf866efbcf.png)



After about 3mins, your build will complete and you can now access the application at `localhost:8080/openmrs/spa`

![Build complete] 

![Screen Shot 2021-12-03 at 00 03 52](https://user-images.githubusercontent.com/4475142/144519113-23128ca6-ccfc-49ec-8c47-3899ea9d84be.png)


