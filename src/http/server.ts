import fastify from "fastify";

const app = fastify();

app.get("/", (req, res) => {
  res.send("Ola mundo");
});

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log("Estou conectado na porta 3333");
  });
