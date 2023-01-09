import { Context, Hono } from "hono";
import { serve } from "server";

const app = new Hono();

app.get("/genesis/:id", async (c: Context) => {
  const number = c.req.param("id");
  const path = `${Deno.cwd()}/books/genesis/cap${number}.json`;
  const chapterGenesis = await Deno.readTextFile(path);

  return c.json(JSON.parse(chapterGenesis));
});

app.get("/", (c) => c.text("Hola Bible Api"));

if (import.meta.main) {
  serve(app.fetch);
}
