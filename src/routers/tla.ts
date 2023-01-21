import { Context, Hono } from "hono";
import { getChapter } from "$/getChapter.ts";
import { isInNewTestament, isInOldTestament } from "$/main.ts";
import { versions } from "../scraping/versions.ts";

const router_tla = new Hono();

router_tla.get("/", async (c: Context) => {
  const books = [];

  for await (
    const entry of Deno.readDir(`${Deno.cwd()}/db/tla/oldTestament`)
  ) {
    const name = entry.name.replaceAll(".json", "");
    const book = {
      name,
      endpoint: `/tla/book/${name}/`,
      byChapter: `/tla/book/${name}/1`,
    };
    books.push(book);
  }

  const byOldTestament = {
    oldTestament: "Reina Valera 1960 Old Testament books endpoint",
    oldTestamentByChapter: "/tla/oldTestament/:book/:chapter",
  };

  const byNewTestament = {
    oldTestament: "Reina Valera 1960 New Testament books endpoint",
    oldTestamentByChapter: "/tla/newTestament/:book/:chapter",
  };

  books.unshift(byOldTestament);
  books.unshift(byNewTestament);

  return c.json(
    books,
  );
});

router_tla.get("/oldTestament/:book", async (c: Context) => {
  try {
    const bookName = c.req.param("book");

    if (isInNewTestament(bookName)) {
      return c.json({
        "error": "Not found",
        "try to endpoints": "/tla/newTestament/:book",
      }, 400);
    }
    const path = `${Deno.cwd()}/db/tla/oldTestament/${bookName}.json`;
    const book = await Deno.readTextFile(path);

    return c.json(JSON.parse(book));
  } catch (_error) {
    return c.notFound();
  }
});

router_tla.get("/oldTestament/:book/:chapter", async (c: Context) => {
  try {
    const book = c.req.param("book");
    if (isInNewTestament(book)) {
      return c.json({
        "error": "Not found",
        "try to endpoints": "/tla/newTestament/:book",
      }, 400);
    }

    const chapterBook = await getChapter(c, "Antiguo Testamento", versions.TLA);

    return chapterBook;
  } catch (_error) {
    return c.notFound();
  }
});

router_tla.get("/newTestament/:book", async (c: Context) => {
  try {
    const bookName = c.req.param("book");

    if (isInOldTestament(bookName)) {
      return c.json({
        "error": "Not found",
        "try to endpoints": "/tla/oldTestament/:book",
      }, 400);
    }

    const path = `${Deno.cwd()}/db/tla/newTestament/${bookName}.json`;
    const book = await Deno.readTextFile(path);

    return c.json(JSON.parse(book));
  } catch (_error) {
    return c.notFound();
  }
});

router_tla.get("/newTestament/:book/:chapter", async (c: Context) => {
  try {
    const book = c.req.param("book");
    if (isInOldTestament(book)) {
      return c.json({
        "error": "Not found",
        "try to endpoints": "/tla/oldTestament/:book",
      }, 400);
    }

    const chapterBook = await getChapter(c, "Nuevo Testamento", versions.TLA);

    return chapterBook;
  } catch (_error) {
    return c.notFound();
  }
});

router_tla.get("/book/:bookName", async (c: Context) => {
  try {
    const book = c.req.param("bookName");

    let rawBook;
    if (isInOldTestament(book)) {
      const path = `${Deno.cwd()}/db/tla/oldTestament/${book}.json`;
      rawBook = await Deno.readTextFile(path);
    } else {
      const path = `${Deno.cwd()}/db/tla/newTestament/${book}.json`;
      rawBook = await Deno.readTextFile(path);
    }

    return c.json(JSON.parse(rawBook));
  } catch (_error) {
    return c.notFound();
  }
});

router_tla.get("/book/:bookName/:chapter", async (c: Context) => {
  try {
    const book = c.req.param("bookName");
    let chapterBook;
    if (isInOldTestament(book)) {
      chapterBook = await getChapter(c, "Antiguo Testamento", versions.TLA);
    } else {
      chapterBook = await getChapter(c, "Nuevo Testamento", versions.TLA);
    }

    return chapterBook;
  } catch (_error) {
    return c.notFound();
  }
});

export default router_tla;



