import { Book, books } from "./index.ts";
import * as cherio from "cherio";
const RVR1960 = "https://www.biblia.es/biblia-buscar-libros-1.php";

export const existDir = (dir: string): boolean => {
  try {
    const _entries = Deno.readDirSync(dir);
    return true;
  } catch (_err) {
    return false;
  }
};

const getReinaValera60Urls = (book: string, chapters: number) => {
  const urls = [];
  for (let i = 1; i <= chapters; i++) {
    urls.push(
      `${RVR1960}?libro=${book}&capitulo=${i}&version=rv60`,
    );
  }

  return urls;
};

const scrapeReinaValera60Book = async (book: Book) => {
  const { name, chapters } = book;

  const acc = [];
  const urls = getReinaValera60Urls(name, chapters);

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

export async function scrapeReinaValera60() {
  const dir = `${Deno.cwd()}/db`;
  const existPath = existDir(dir);
  if (!existPath) {
    Deno.mkdir(dir);
  }
  const rv60Path = `${Deno.cwd()}/db/rv1960`;
  const existRv60Folder = existDir(rv60Path);
  if (!existRv60Folder) {
    Deno.mkdir(rv60Path);
  }

  for await (const book of books) {
    const testamentFolder = book.testament === "Antiguo Testamento"
      ? "oldTestament"
      : "newTestament";
    let Bookverses;
    try {
      Bookverses = await scrapeReinaValera60Book(book);
      await Deno.writeTextFile(
        `${Deno.cwd()}/db/rv1960/${testamentFolder}/${book.name.toLowerCase()}.json`,
        JSON.stringify(Bookverses, null, "\t"),
      );
    } catch (_error) {
      await Deno.mkdir(`${Deno.cwd()}/db/rv1960/${testamentFolder}/`);
      Bookverses = await scrapeReinaValera60Book(book);
      await Deno.writeTextFile(
        `${Deno.cwd()}/db/rv1960/${testamentFolder}/${book.name.toLowerCase()}.json`,
        JSON.stringify(Bookverses, null, "\t"),
      );
    }

    Bookverses = [];
  }
}

if (import.meta.main) {
  scrapeReinaValera60();
}
