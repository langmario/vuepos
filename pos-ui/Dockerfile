FROM node:20-slim@sha256:dcb9e35d8afca163a231cdfad9657d2360947f212faf0fab647f8d11cb1e63a9 AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
COPY package.json ./
COPY pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM base AS build
COPY . /app
RUN pnpm run build

FROM steebchen/nginx-spa:stable@sha256:320153b55b94fe63600ac1174e7370d5c4e4ba344e0ed51f0c42e72b131595a1
COPY --from=build /app/dist /app
EXPOSE 80
CMD [ "nginx" ]