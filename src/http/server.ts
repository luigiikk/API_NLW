import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { createGoal } from "../useCases/create-goal";
import z from "zod";
import { getWeekPendingGoals } from "../useCases/get-week-pending-goals";
import { createGoalCompletion } from "../useCases/create-goal-completion";

const app = fastify().withTypeProvider<ZodTypeProvider>();
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.get("/", (req, res) => {
  res.send("Ola mundo");
});
app.get("/pending-goals", async (req, res) => {
  const { pendingGoals } = await getWeekPendingGoals();

  return { pendingGoals };
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
app.post(
  "/goals-completions",
  {
    schema: {
      body: z.object({
        goalId: z.string(),
      }),
    },
  },
  async (req, res) => {
    const { goalId } = req.body;
    await createGoalCompletion({
      goalId,
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
