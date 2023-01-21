import { Hono } from "hono";
import { cors } from "middleware";
import { serve } from "server";
import { books } from "$/scraping/index.ts";
import router_rv60 from "$/routers/rv60.ts";
import router_rv09 from "$/routers/rv09.ts";
import router_tla from "$/routers/tla.ts";

const app = new Hono();

const oldTestamentbooks = books.filter((b) => {
  return b.testament === "Antiguo Testamento";
});
const newTestamentbooks = books.filter((b) => {
  return b.testament === "Nuevo Testamento";
});

export const isInOldTestament = (book: string) => {
  return oldTestamentbooks.some((b) => b.name.toLocaleLowerCase() === book);
};

export const isInNewTestament = (book: string) => {
  return newTestamentbooks.some((b) => b.name.toLocaleLowerCase() === book);
};

app.use("*", cors({ origin: "*" }));

app.get("/", (c) => {
  return c.json({
    versions: ["rv1960"],
    endpoints: [
      "/rv1960/book/genesis/1",
    ],
  });
});

// servir la version reina valera 1960
app.route("/rv1960", router_rv60);

// servir la version reina valera 1909
app.route("/rv1909", router_rv09);

// servir la  version traduccion lenguaje actual
app.route("/tla", router_tla);

app.notFound((c) => {
  const { pathname } = new URL(c.req.url);

  if (c.req.url.at(-1) === "/") {
    return c.redirect(pathname.slice(0, -1));
  }

  return c.json({ message: "Not Found" }, 404);
});

if (import.meta.main) {
  serve(app.fetch);
}
