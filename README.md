# [koma.li](https://koma.li): A simple URL shortener made with Node.js
I got bored one day so decided to build a url shortener with the semi-short _koma.li_ domain I had bought a while ago. It uses [Fastify](http://npmjs.com/package/fastify) as its web server and [better-sqlite3](https://www.npmjs.com/package/better-sqlite3) as its database
## Setup
```bash
git clone https://github.com/PrinceKomali/koma.li
cd koma.li
npm i
node index.js # Open http://localhost:3000 in your browser
```
## API
**This project was made mainly for personal use so there is no ratelimiting/authentication for this API. Please don't go nuts with it, as the server is self-hosted off of an ancient Dell I got for free over the summer**

```bash
curl https://koma.li/_add \
  -H 'Content-Type: application/json' \
  -X POST \
  -d '{"url": "https://komali.dev"}'
# {"success":true,"data":"koma.li/0"} 
```