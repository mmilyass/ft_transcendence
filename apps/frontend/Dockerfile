FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# This used to be `next dev` in the container that's actually deployed —
# unoptimized dev-mode bundles, exposed source maps, and (the reason this
# specifically broke) Next's dev server enforces an allowed-origins check
# on its HMR/asset endpoints to guard against DNS-rebinding attacks; access
# it from anything other than the host it expects (e.g. a LAN IP instead
# of "localhost") and the dev server silently degrades — the HMR websocket
# fails and the client bundle never fully takes over, so forms fall back
# to plain HTML submission (login turns into a GET with the password in
# the query string) instead of the real React submit handler running.
# A real production build has none of this.
RUN npx next build

EXPOSE 3000

CMD npx next start -H 0.0.0.0 -p ${PORT:-3000}
