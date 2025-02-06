const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname + "/public")); // Carregar arxius HTML, CSS i JS

io.on("connection", (socket) => {
  console.log("Un usuari s'ha connectat");

  socket.on("nou usuari", (usuari) => {
    console.log(`${usuari} s'ha unit al xat.`);
    io.emit("missatge", {
      usuari: "Sistema",
      text: `${usuari} s'ha unit al xat!`,
    });
  });

  socket.on("missatge", (data) => {
    io.emit("missatge", data);
  });

  socket.on("disconnect", () => {
    console.log("Un usuari ha marxat.");
  });
});

server.listen(3000, () => {
  console.log("Servidor en funcionament a http://localhost:3000");
});
