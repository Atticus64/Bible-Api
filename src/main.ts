import { Context, Hono } from "hono";
import { cors } from "middleware";
import { serve } from "server";
import { books } from '$/scraping/books.ts';

const app = new Hono();
const oldTestamentbooks = books.filter(b => b.testament === "Antiguo Testamento")

app.use("*", cors({ origin: "*" }))

app.get("/", async (c: Context) => {

  const books = []

  for await (const entry of Deno.readDir(`${Deno.cwd()}/books/oldTestament`)) {
    const book = {
      name: entry.name,
      endpoint: `/book/${entry.name}/`,
      byChapter: `/book/${entry.name}/1`
    }
    books.push(book)
  }

  const byOldTestament = {
    oldTestament: '/oldTestament/:book',
    oldTestamentByChapter: '/oldTestament/:book/:chapter'
  }

  const byNewTestament = {
    oldTestament: '/newTestament/:book',
    oldTestamentByChapter: '/newTestament/:book/:chapter'
  }

  books.unshift(byOldTestament)
  books.unshift(byNewTestament)

  return c.json(
    books
  )

})


app.get("/oldTestament/:book", async (c: Context) => {
  try {
    const bookName = c.req.param("book")
    const path = `${Deno.cwd()}/books/oldTestament/${bookName}/${bookName}.json`;
    const book = await Deno.readTextFile(path);

    return c.json(JSON.parse(book));
  } catch (_error) {
    return c.notFound()
  }

})

app.get("/oldTestament/:book/:id", async (c: Context) => {
  try {
    const number = c.req.param("id");
    const book = c.req.param("book")
    const path = `${Deno.cwd()}/books/oldTestament/${book}/cap${number}.json`;
    const chapterBook = await Deno.readTextFile(path);

    return c.json(JSON.parse(chapterBook));
  } catch (_error) {
    return c.notFound()
  }
});

app.get("/newTestament/:book", async (c: Context) => {
  try {
    const bookName = c.req.param("book")
    const path = `${Deno.cwd()}/books/newTestament/${bookName}/${bookName}.json`;
    const book = await Deno.readTextFile(path);

    return c.json(JSON.parse(book));
  } catch (_error) {
    return c.notFound()
  }

})


app.get("/newTestament/:book/:id", async (c: Context) => {
  try {
    const number = c.req.param("id");
    const book = c.req.param("book")
    const path = `${Deno.cwd()}/books/newTestament/${book}/cap${number}.json`;
    const chapterBook = await Deno.readTextFile(path);

    return c.json(JSON.parse(chapterBook));
  } catch (_error) {
    return c.notFound()
  }
});

app.get("/book/:bookName", async (c: Context) => {
  try {

    const book = c.req.param("bookName");
    const isInOldTestament = oldTestamentbooks.some(b => b.name.toLocaleLowerCase() === book)
    let rawBook;
    if (isInOldTestament) {
      const path = `${Deno.cwd()}/books/oldTestament/${book}/${book}.json`;
      rawBook = await Deno.readTextFile(path);
    } else {
      const path = `${Deno.cwd()}/books/newTestament/${book}/${book}.json`;
      rawBook = await Deno.readTextFile(path);
    }

    return c.json(JSON.parse(rawBook));
  } catch (_error) {
    return c.notFound()
  }
});


app.get("/book/:bookName/:chapter", async (c: Context) => {
  try {

    const book = c.req.param("bookName");
    const chapter = c.req.param("chapter");
    const isInOldTestament = oldTestamentbooks.some(b => b.name.toLocaleLowerCase() === book)
    let chapterBook;
    if (isInOldTestament) {
      const path = `${Deno.cwd()}/books/oldTestament/${book}/cap${chapter}.json`;
      chapterBook = await Deno.readTextFile(path);
    } else {
      const path = `${Deno.cwd()}/books/newTestament/${book}/cap${chapter}.json`;
      chapterBook = await Deno.readTextFile(path);
    }

    return c.json(JSON.parse(chapterBook));
  } catch (_error) {
    return c.notFound()
  }
});


app.notFound((c) => {
  const { pathname } = new URL(c.req.url)

  if (c.req.url.at(-1) === '/') {
    return c.redirect(pathname.slice(0, -1))
  }

  return c.json({ message: 'Not Found' }, 404)
})


if (import.meta.main) {
  serve(app.fetch);
}
