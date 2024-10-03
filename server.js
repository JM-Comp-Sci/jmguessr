/*
                    _     _
JmGuessr Server
*/

import fs from 'fs';
import { parse } from 'url';
import next from 'next';
import { config } from 'dotenv';
import colors from 'colors';

config();

import { createServer } from 'http';
import { createServer as createHttpsServer } from 'https';



let httpEnabled = true;

const dev = process.env.NODE_ENV !== 'production'

const hostname = 'localhost'
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

const handlers = {};
function registerHandler(path, method, handler) {
  handlers[path] = {
    method,
    handler
  }
}

app.prepare().then(() => {

  const useHttps = process.env.SSL_KEY_PATH && process.env.SSL_KEY_PATH.length > 0 && process.env.SSL_CERT_PATH && process.env.SSL_CERT_PATH.length > 0;
  const sslOptions = useHttps ? {
    key: fs.readFileSync(process.env.SSL_KEY_PATH),
    cert: fs.readFileSync(process.env.SSL_CERT_PATH),
    ca: process.env.SSL_CA_PATH ? fs.readFileSync(process.env.SSL_CA_PATH) : undefined,
  } : null;

  if(useHttps) {
    console.log(`Using SSL`.green);
  } else {
    console.log(`Not using SSL`.yellow);
  }

  const callback = async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      const { pathname, query } = parsedUrl

      if (handlers[pathname] && req.method === handlers[pathname].method) {
        return handlers[pathname].handler(req, res, query);
      }


      if(!httpEnabled) {
        // send 404
        return app.render(req, res, '/404', query);
      }

      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  };
  let createServerFunction = sslOptions ? createHttpsServer : createServer;

  // if https enabled, create a http that redirects to https
  if (useHttps) {
    createServerFunction(
      (req, res) => {
        res.writeHead(301, {
          Location: `https://${req.headers.host}${req.url}`
        });
        res.end();
      }
    )
      .listen(80, () => {
        console.log(`> Forwarder on http://${hostname}:80`);
      });
  }

  const server = createServerFunction(sslOptions ? sslOptions : callback, !sslOptions ? callback : null)
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      setTimeout(() => {
      console.log(`> Ready on http${useHttps ? 's' : ''}://${hostname}:${port}`)
      }, 100);
    })


});
