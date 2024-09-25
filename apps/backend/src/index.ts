import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";

const app = new Elysia()
  .use(cors())
  .use(swagger())
  .get("/ping", () => {
    return {
      message: "pong !"
    };
  })
  .listen(process.env.PORT ?? 3000);

console.log(
  `Elysia server running at ${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app;
