import { Context } from "hono";
import { Testament } from "$/scraping/books.ts";

export const getChapter = async (
  c: Context,
  testament: Testament,
): Promise<Response> => {
  const number = parseInt(c.req.param("chapter"));

  if (isNaN(number)) return c.notFound();

  const bookName = c.req.param("book") ?? c.req.param("bookName");
  const testamentFolder = testament === "Nuevo Testamento"
    ? "newTestament"
    : "oldTestament";

  const path = `${Deno.cwd()}/books/${testamentFolder}/${bookName}.json`;

  const book = await Deno.readTextFile(path);
  console.log(number);
  const chapter = number - 1;
  const numChapters = JSON.parse(book).length;

  if (numChapters < number || number === 0) {
    return c.notFound();
  }

  const chapterBook = JSON.parse(book).at(chapter);

  return c.json(chapterBook);
};
