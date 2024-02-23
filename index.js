// npm i express socket.io @titaniumnetwork-dev/ultraviolet @tomphttp/bare-server-node
import { createBareServer } from '@tomphttp/bare-server-node';
import express from "express";
import { createServer } from "node:http";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { join } from "node:path";
import { hostname, type } from "node:os";
import { fileURLToPath } from "url";
import fs from 'fs';
import path from 'path';

const USERNAME = 'dev';
const PASSWORD = 'bsfr_you_aint_dev';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicPath = fileURLToPath(new URL("./public/", import.meta.url));

const bare = createBareServer("/bare/");
const app = express();

app.get('/', (req, res) => {
  res.type("text/html");
  fs.readFile(__dirname + '/public/index.html', (err, data) => {
    if (err) throw err;
    res.write(data);

    fs.readFile(__dirname + '/motd.txt', (err, data) => {
      if (err) throw err;
      res.end(data);
    });
  });
});

app.use(express.static(publicPath));
app.use("/uv/", express.static(uvPath));

app.get('/chat', (req, res) => {
  res.sendFile(__dirname + "/chat/index.html");
});

app.get('/chat/school123', (req, res) => {
  fs.readFile(__dirname + '/chat/1.html', (err, data) => {
    if (err) throw err;
    res.write(data);

    fs.readFile(__dirname + '/chat/db1.txt', (err, data) => {
      if (err) throw err;
      res.end(data+"</script>");
    });
  });
});

app.get('/chat/nont', (req, res) => {
  fs.readFile(__dirname + '/chat/2.html', (err, data) => {
    if (err) throw err;
    res.write(data);

    fs.readFile(__dirname + '/chat/db2.txt', (err, data) => {
      if (err) throw err;
      res.end(data+"</script>");
    });
  });
});

app.get('/chat/main_gc', (req, res) => {
  fs.readFile(__dirname + '/chat/3.html', (err, data) => {
    if (err) throw err;
    res.write(data);

    fs.readFile(__dirname + '/chat/db3.txt', (err, data) => {
      if (err) throw err;
      res.end(data+"</script>");
    });
  });
});

app.get('/chat/support', (req, res) => {
  fs.readFile(__dirname + '/chat/4.html', (err, data) => {
    if (err) throw err;
    res.write(data);

    fs.readFile(__dirname + '/chat/db4.txt', (err, data) => {
      if (err) throw err;
      res.end(data+"</script>");
    });
  });
});

app.use((req, res) => {
  res.status(404); 
  res.sendFile(join(publicPath, "404.html"));
});

const server = createServer();

server.on("request", (req, res) => {
  if (bare.shouldRoute(req)) {
    bare.routeRequest(req, res);
  } else {
    app(req, res);
  }
});


import { Server } from 'socket.io';
const io = new Server(server);

io.on('connection', (socket) => {
  socket.on('chat message 1', (msg) => {
    fs.appendFileSync(__dirname + '/chat/db1.txt', `a({name:'${msg.name}',message:'${msg.message}',date:'${msg.date}'});`); // Puts Message In File
    console.log(msg);
    io.emit('chat message 1', msg);
  });

  socket.on('image 1', (image) => {
    fs.appendFileSync(__dirname + '/chat/db1.txt', `i(\'${image}\');`);
    io.emit('image 1', image);
  });

  socket.on('chat message 2', (msg) => {
    fs.appendFileSync(__dirname + '/chat/db2.txt', `a({name:'${msg.name}',message:'${msg.message}',date:'${msg.date}'});`); // Puts Message In File
    console.log(msg);
    io.emit('chat message 2', msg);
  });

  socket.on('image 2', (image) => {
    fs.appendFileSync(__dirname + '/chat/db2.txt', `i(\'${image}\');`);
    io.emit('image 2', image);
  });

  socket.on('chat message 3', (msg) => {
    fs.appendFileSync(__dirname + '/chat/db3.txt', `a({name:'${msg.name}',message:'${msg.message}',date:'${msg.date}'});`); // Puts Message In File
    console.log(msg);
    io.emit('chat message 3', msg);
  });

  socket.on('image 3', (image) => {
    fs.appendFileSync(__dirname + '/chat/db3.txt', `i(\'${image}\');`);
    io.emit('image 3', image);
  });

  socket.on('chat message 4', (msg) => {
    fs.appendFileSync(__dirname + '/chat/db4.txt', `a({name:'${msg.name}',message:'${msg.message}',date:'${msg.date}'});`); // Puts Message In File
    console.log(msg);
    io.emit('chat message 4', msg);
  });

  socket.on('image 4', (image) => {
    fs.appendFileSync(__dirname + '/chat/db4.txt', `i(\'${image}\');`);
    io.emit('image 4', image);
  });

  socket.on('changeMOTD', (txt, username, password) => {
    if(username != USERNAME || password != PASSWORD) {return;}
    fs.writeFile('motd.txt', `<script>motd('${txt}')</script>`, function (err) {
      if (err) throw err;
      console.log(`MOTD changed to ${txt}`);
    });
  });

  socket.on('school123Clear', (username, password) => {
    if(username != USERNAME || password != PASSWORD) {return;}
    fs.writeFile('./chat/db1.txt', `<script>`, function (err) {
      if (err) throw err;
      console.log(`school123 cleared`);
    });
  });

  socket.on('nontClear', (username, password) => {
    if(username != USERNAME || password != PASSWORD) {return;}
    fs.writeFile('./chat/db2.txt', `<script>`, function (err) {
      if (err) throw err;
      console.log(`nont cleared`);
    });
  });

  socket.on('main_gcClear', (username, password) => {
    if(username != USERNAME || password != PASSWORD) {return;}
    fs.writeFile('./chat/db3.txt', `<script>`, function (err) {
      if (err) throw err;
      console.log(`main_gc cleared`);
    });
  });

  socket.on('supportClear', (username, password) => {
    if(username != USERNAME || password != PASSWORD) {return;}
    fs.writeFile('./chat/db4.txt', `<script>`, function (err) {
      if (err) throw err;
      console.log(`support cleared`);
    });
  });
});

server.on("upgrade", (req, socket, head) => {
  if (bare.shouldRoute(req)) {
    bare.routeUpgrade(req, socket, head);
  } else {
    socket.end();
  }
});

let port = parseInt(process.env.PORT || "");

if(isNaN(port)) port = 3000;

server.on("listening", () => {
  const address = server.address();

  // by default we are listening on 0.0.0.0 (every interface)
  // we just need to list a few
  console.log("Listening on:");
  console.log(`\thttp://localhost:${address.port}`);
  console.log(`\thttp://${hostname()}:${address.port}`);
  console.log(
    `\thttp://${
      address.family === "IPv6" ? `[${address.address}]` : address.address
    }:${address.port}`
  );
});

// https://expressjs.com/en/advanced/healthcheck-graceful-shutdown.html
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function shutdown() {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close();
  bare.close();
  process.exit(0);
}

server.listen({
  port,
});