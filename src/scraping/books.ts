import * as cherio from "cherio";

const Testaments = ["Antiguo Testamento", "Nuevo Testamento"] as const;
type Testament = typeof Testaments[number]

interface Book {
  name: string;
  chapters: number;
  testament: Testament;
}

/*
  * Array of Bible books
  * Elements
  * {string} name
  * {number} chapters
*/
export const books: Book[] = [
  {
    name: "Genesis",
    chapters: 50,
    testament: "Antiguo Testamento"
  },
  {
    name: "Exodo",
    chapters: 40,
    testament: "Antiguo Testamento"
  },
  {
    name: "Levitico",
    chapters: 27,
    testament: "Antiguo Testamento"
  },
  {
    name: "Deuteronomio",
    chapters: 34,
    testament: "Antiguo Testamento"
  },
  {
    name: "Josue",
    chapters: 24,
    testament: "Antiguo Testamento"
  },
  {
    name: "Jueces",
    chapters: 21,
    testament: "Antiguo Testamento"
  },
  {
    name: "Rut",
    chapters: 4,
    testament: "Antiguo Testamento"
  },
  {
    name: "1-Samuel",
    chapters: 31,
    testament: "Antiguo Testamento"
  },
  {
    name: "2-Samuel",
    chapters: 24,
    testament: "Antiguo Testamento"
  },
  {
    name: "1-Reyes",
    chapters: 22,
    testament: "Antiguo Testamento"
  },
  {
    name: "2-Reyes",
    chapters: 25,
    testament: "Antiguo Testamento"
  },
  {
    name: "1-Cronicas",
    chapters: 29,
    testament: "Antiguo Testamento"
  },
  {
    name: "2-Cronicas",
    chapters: 36,
    testament: "Antiguo Testamento"
  },
  {
    name: "Esdras",
    chapters: 10,
    testament: "Antiguo Testamento"
  },
  {
    name: "Nehemias",
    chapters: 13,
    testament: "Antiguo Testamento"
  },
  {
    name: "Ester",
    chapters: 10,
    testament: "Antiguo Testamento"
  },
  {
    name: "Job",
    chapters: 42,
    testament: "Antiguo Testamento"
  },
  {
    name: "Salmos",
    chapters: 150,
    testament: "Antiguo Testamento"
  },
  {
    name: "Proverbios",
    chapters: 31,
    testament: "Antiguo Testamento"
  },
  {
    name: "Eclesiastes",
    chapters: 12,
    testament: "Antiguo Testamento"
  },
  {
    name: "Cantares",
    chapters: 8,
    testament: "Antiguo Testamento"
  },
  {
    name: "Isaias",
    chapters: 66,
    testament: "Antiguo Testamento"
  },
  {
    name: "Lamentaciones",
    chapters: 5,
    testament: "Antiguo Testamento"
  },
  {
    name: "Ezequiel",
    chapters: 48,
    testament: "Antiguo Testamento"
  },
  {
    name: "Daniel",
    chapters: 12,
    testament: "Antiguo Testamento"
  },
  {
    name: "Oseas",
    chapters: 14,
    testament: "Antiguo Testamento"
  },
  {
    name: "Joel",
    chapters: 3,
    testament: "Antiguo Testamento"
  },
  {
    name: "Amos",
    chapters: 9,
    testament: "Antiguo Testamento"
  },
  {
    name: "Abdias",
    chapters: 1,
    testament: "Antiguo Testamento"
  },
  {
    name: "Jonas",
    chapters: 4,
    testament: "Antiguo Testamento"
  },

  {
    name: "Miqueas",
    chapters: 7,
    testament: "Antiguo Testamento"
  },
  {
    name: "Nahum",
    chapters: 3,
    testament: "Antiguo Testamento"
  },
  {
    name: "Habacuc",
    chapters: 3,
    testament: "Antiguo Testamento"
  },
  {
    name: "Sofonias",
    chapters: 3,
    testament: "Antiguo Testamento"
  },
  {
    name: "Hageo",
    chapters: 2,
    testament: "Antiguo Testamento"
  },
  {
    name: "Zacarias",
    chapters: 14,
    testament: "Antiguo Testamento"
  },
  {
    name: "Malaquias",
    chapters: 4,
    testament: "Antiguo Testamento"
  },

]

const getUrls = (book: string, chapters: number) => {
  const urls = []
  for (let i = 1; i <= chapters; i++) {
    urls.push(`https://www.biblia.es/biblia-buscar-libros-1.php?libro=${book}&capitulo=${i}&version=rv60`)
  }

  return urls
}

export default async function scrapeBook(book: Book) {

  const { name, chapters } = book
  const testamentFolder = book.testament === "Antiguo Testamento" ? "oldTestament" : "newTestament"

  const acc = [];
  const urls = getUrls(name, chapters)

  const requests = urls.map(url => fetch(url))

  const resps = await Promise.all(requests)

  let i = 1
  for (const resp of resps) {
    const page = await resp.text()

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
      book = `${rawTitle[0]} ${rawTitle[1]}`
      chapter = rawTitle[2];
    }

    console.log({ book, chapter, study });
    $("span.texto").each((indx, item) => {
      const verse = $(item).text();
      const number = indx + 1;
      vers.push({ verse, number });
    });

    acc.push({ chapter, vers })

    try {

      await Deno.writeTextFile(
        `books/${testamentFolder}/${name.toLowerCase()}/cap${i}.json`,
        JSON.stringify(vers, null, "\t"),
      )


    } catch {
      await Deno.mkdir(`${Deno.cwd()}/books/${testamentFolder}/${name.toLowerCase()}`)
      await Deno.writeTextFile(
        `books/oldTestament/${name.toLowerCase()}/cap${i}.json`,
        JSON.stringify(vers, null, "\t"),
      )
    }
    i++
  }


  return acc
}

const main = async () => {
  for await (const book of books) {
    const testamentFolder = book.testament === "Antiguo Testamento" ? "oldTestament" : "newTestament"
    let Bookverses;
    try {
      Bookverses = await scrapeBook(book)
      await Deno.writeTextFile(`${Deno.cwd()}/books/${testamentFolder}/${book.name.toLocaleLowerCase()}/${book.name.toLowerCase()}.json`, JSON.stringify(Bookverses, null, '\t'))
    } catch (_error) {
      await Deno.mkdir(`${Deno.cwd()}/books/${testamentFolder}/`)
      Bookverses = await scrapeBook(book)
      await Deno.writeTextFile(`${Deno.cwd()}/books/${testamentFolder}/${book.name.toLocaleLowerCase()}/${book.name.toLowerCase()}.json`, JSON.stringify(Bookverses, null, '\t'))
    }

    Bookverses = []
  }
}

if (import.meta.main) {
  main()
}