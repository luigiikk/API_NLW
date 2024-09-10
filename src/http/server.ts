import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { createGoal } from "../useCases/create-goal";
import z from "zod";

const app = fastify().withTypeProvider<ZodTypeProvider>();
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.get("/", (req, res) => {
  res.send("Ola mundo");
});
app.post(
  "/goals",
  {
    schema: {
      body: z.object({
        title: z.string(),
        desiredWeeklyFrequency: z.number().int().min(1).max(7),
      }),
    },
  },
  async (req, res) => {
    const { title, desiredWeeklyFrequency } = req.body;
    await createGoal({
      title,
      desiredWeeklyFrequency,
    });
  }
);
app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log("Estou conectado na porta 3333");
  });
