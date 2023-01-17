import { Context, Hono } from "hono";
import { getChapter } from "$/getChapter.ts";
import { isInNewTestament, isInOldTestament } from "$/main.ts";

const reinaValera1960 = new Hono();

reinaValera1960.get("/", async (c: Context) => {
  const books = [];

  for await (
    const entry of Deno.readDir(`${Deno.cwd()}/db/rv1960/oldTestament`)
  ) {
    const name = entry.name.replaceAll(".json", "");
    const book = {
      name,
      endpoint: `/rv1960/book/${name}/`,
      byChapter: `/rv1960/book/${name}/1`,
    };
    books.push(book);
  }

  const byOldTestament = {
    oldTestament: "Reina Valera 1960 Old Testament books endpoint",
    oldTestamentByChapter: "/rv1960/oldTestament/:book/:chapter",
  };

  const byNewTestament = {
    oldTestament: "Reina Valera 1960 New Testament books endpoint",
    oldTestamentByChapter: "/rv1960/newTestament/:book/:chapter",
  };

  books.unshift(byOldTestament);
  books.unshift(byNewTestament);

  return c.json(
    books,
  );
});

reinaValera1960.get("/oldTestament/:book", async (c: Context) => {
  try {
    const bookName = c.req.param("book");

    if (isInNewTestament(bookName)) {
      return c.json({
        "error": "Not found",
        "try to endpoints": "/rv1960/newTestament/:book",
      }, 400);
    }
    const path = `${Deno.cwd()}/db/rv1960/oldTestament/${bookName}.json`;
    const book = await Deno.readTextFile(path);

    return c.json(JSON.parse(book));
  } catch (_error) {
    return c.notFound();
  }
});

reinaValera1960.get("/oldTestament/:book/:chapter", async (c: Context) => {
  try {
    const book = c.req.param("book");
    if (isInNewTestament(book)) {
      return c.json({
        "error": "Not found",
        "try to endpoints": "/rv1960/newTestament/:book",
      }, 400);
    }

    const chapterBook = await getChapter(c, "Antiguo Testamento");

    return chapterBook;
  } catch (_error) {
    return c.notFound();
  }
});

reinaValera1960.get("/newTestament/:book", async (c: Context) => {
  try {
    const bookName = c.req.param("book");

    if (isInOldTestament(bookName)) {
      return c.json({
        "error": "Not found",
        "try to endpoints": "/rv1960/oldTestament/:book",
      }, 400);
    }

    const path = `${Deno.cwd()}/db/rv1960/newTestament/${bookName}.json`;
    const book = await Deno.readTextFile(path);

    return c.json(JSON.parse(book));
  } catch (_error) {
    return c.notFound();
  }
});

reinaValera1960.get("/newTestament/:book/:chapter", async (c: Context) => {
  try {
    const book = c.req.param("book");
    if (isInOldTestament(book)) {
      return c.json({
        "error": "Not found",
        "try to endpoints": "/rv1960/oldTestament/:book",
      }, 400);
    }

    const chapterBook = await getChapter(c, "Nuevo Testamento");

    return chapterBook;
  } catch (_error) {
    return c.notFound();
  }
});

reinaValera1960.get("/book/:bookName", async (c: Context) => {
  try {
    const book = c.req.param("bookName");

    let rawBook;
    if (isInOldTestament(book)) {
      const path = `${Deno.cwd()}/db/rv1960/oldTestament/${book}.json`;
      rawBook = await Deno.readTextFile(path);
    } else {
      const path = `${Deno.cwd()}/db/rv1960/newTestament/${book}.json`;
      rawBook = await Deno.readTextFile(path);
    }

    return c.json(JSON.parse(rawBook));
  } catch (_error) {
    return c.notFound();
  }
});

reinaValera1960.get("/book/:bookName/:chapter", async (c: Context) => {
  try {
    const book = c.req.param("bookName");
    let chapterBook;
    if (isInOldTestament(book)) {
      chapterBook = await getChapter(c, "Antiguo Testamento");
    } else {
      chapterBook = await getChapter(c, "Nuevo Testamento");
    }

    return chapterBook;
  } catch (_error) {
    return c.notFound();
  }
});

export default reinaValera1960;
