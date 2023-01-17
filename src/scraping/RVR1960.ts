import { Book, books } from "./books.ts";

import * as cherio from "cherio";
const RVR1960 = "https://www.biblia.es/biblia-buscar-libros-1.php";

const getRv60Urls = (book: string, chapters: number) => {
  const urls = [];
  for (let i = 1; i <= chapters; i++) {
    urls.push(
      `${RVR1960}?libro=${book}&capitulo=${i}&version=rv60`,
    );
  }

  return urls;
};

const scrapeRv60Book = async (book: Book) => {
  const { name, chapters } = book;

  const acc = [];
  const urls = getRv60Urls(name, chapters);

  const requests = urls.map((url) => fetch(url));

  const resps = await Promise.all(requests);

  let i = 1;
  for (const resp of resps) {
    const page = await resp.text();

    const $ = cherio.load(page);

    const vers: { verse: string; number: number }[] = [];
    const rawTitle = $("h3.capitulo").text().split(" ");
    let book = "";
    let chapter = "";
    const study = $("h2.estudio").text();

    if (rawTitle[0].length > 1) {
      book = rawTitle[0];
      chapter = rawTitle[1];
    } else {
      book = `${rawTitle[0]} ${rawTitle[1]}`;
      chapter = rawTitle[2];
    }

    $("span.texto").each((indx: number, item) => {
      const verse = $(item).text();
      const number = indx + 1;
      vers.push({ verse, number });
    });

    acc.push({ chapter, vers });
    console.log({ chapter, study, book });

    i++;
  }

  return acc;
};

export async function scrapeRV60() {
  for await (const book of books) {
    const testamentFolder = book.testament === "Antiguo Testamento"
      ? "oldTestament"
      : "newTestament";
    let Bookverses;
    try {
      Bookverses = await scrapeRv60Book(book);
      await Deno.writeTextFile(
        `${Deno.cwd()}/books/${testamentFolder}/${book.name.toLowerCase()}.json`,
        JSON.stringify(Bookverses, null, "\t"),
      );
    } catch (_error) {
      await Deno.mkdir(`${Deno.cwd()}/books/${testamentFolder}/`);
      Bookverses = await scrapeRv60Book(book);
      await Deno.writeTextFile(
        `${Deno.cwd()}/books/${testamentFolder}/${book.name.toLowerCase()}.json`,
        JSON.stringify(Bookverses, null, "\t"),
      );
    }

    Bookverses = [];
  }
}
