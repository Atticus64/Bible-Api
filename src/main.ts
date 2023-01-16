import { Context, Hono } from "hono";
import { cors } from "middleware";
import { serve } from "server";
import { books } from "$/scraping/books.ts";
import { getChapter } from "./getChapter.ts";

const app = new Hono();

const oldTestamentbooks = books.filter((b) => {
  return b.testament === "Antiguo Testamento";
});
const newTestamentbooks = books.filter((b) => {
  return b.testament === "Nuevo Testamento";
});

const isInOldTestament = (book: string) => {
  return oldTestamentbooks.some((b) => b.name.toLocaleLowerCase() === book);
};

const isInNewTestament = (book: string) => {
  return newTestamentbooks.some((b) => b.name.toLocaleLowerCase() === book);
};

app.use("*", cors({ origin: "*" }));

app.get("/", async (c: Context) => {
  const books = [];

  for await (const entry of Deno.readDir(`${Deno.cwd()}/books/oldTestament`)) {
    const name = entry.name.replaceAll(".json", "");
    const book = {
      name,
      endpoint: `/book/${name}/`,
      byChapter: `/book/${name}/1`,
    };
    books.push(book);
  }

  const byOldTestament = {
    oldTestament: "/oldTestament/:book",
    oldTestamentByChapter: "/oldTestament/:book/:chapter",
  };

  const byNewTestament = {
    oldTestament: "/newTestament/:book",
    oldTestamentByChapter: "/newTestament/:book/:chapter",
  };

  books.unshift(byOldTestament);
  books.unshift(byNewTestament);

  return c.json(
    books,
  );
});

app.get("/oldTestament/:book", async (c: Context) => {
  try {
    const bookName = c.req.param("book");
    const path = `${Deno.cwd()}/books/oldTestament/${bookName}.json`;
    const book = await Deno.readTextFile(path);

    return c.json(JSON.parse(book));
  } catch (_error) {
    return c.notFound();
  }
});

app.get("/oldTestament/:book/:id", async (c: Context) => {
  try {
    const chapterBook: Response = await getChapter(c, "Antiguo Testamento");

    return chapterBook;
  } catch (_error) {
    return c.notFound();
  }
});

app.get("/newTestament/:book", async (c: Context) => {
  try {
    const bookName = c.req.param("book");
    const path = `${Deno.cwd()}/books/newTestament/${bookName}.json`;
    const book = await Deno.readTextFile(path);

    if (isInNewTestament(book)) {
      return c.json({
        "error": "Not found",
        "try to endpoints": "/newTestament/:book",
      }, 400);
    }

    return c.json(JSON.parse(book));
  } catch (_error) {
    return c.notFound();
  }
});

app.get("/newTestament/:book/:chapter", async (c: Context) => {
  try {
    const book = c.req.param("book");
    if (isInOldTestament(book)) {
      return c.json({
        "error": "Not found",
        "try to endpoints": "/oldTestament/:book",
      }, 400);
    }

    const chapterBook = await getChapter(c, "Nuevo Testamento");

    return chapterBook;
  } catch (_error) {
    return c.notFound();
  }
});

app.get("/book/:bookName", async (c: Context) => {
  try {
    const book = c.req.param("bookName");

    let rawBook;
    if (isInOldTestament(book)) {
      const path = `${Deno.cwd()}/books/oldTestament/${book}.json`;
      rawBook = await Deno.readTextFile(path);
    } else {
      const path = `${Deno.cwd()}/books/newTestament/${book}.json`;
      rawBook = await Deno.readTextFile(path);
    }

    return c.json(JSON.parse(rawBook));
  } catch (_error) {
    return c.notFound();
  }
});

app.get("/book/:bookName/:chapter", async (c: Context) => {
  try {
    const book = c.req.param("bookName");
    const isInOldTestament = oldTestamentbooks.some((b) =>
      b.name.toLocaleLowerCase() === book
    );
    let chapterBook;
    if (isInOldTestament) {
      chapterBook = await getChapter(c, "Antiguo Testamento");
    } else {
      chapterBook = await getChapter(c, "Nuevo Testamento");
    }

    return chapterBook;
  } catch (_error) {
    return c.notFound();
  }
});

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
