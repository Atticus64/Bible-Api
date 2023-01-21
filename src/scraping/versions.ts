import * as cherio from "cherio";
import { Book, books } from "$/scraping/index.ts";
import { existDir } from "$/scraping/reinaValera60.ts";

const url = `https://www.bible.com/bible`;

interface Version {
  urlNumber: number;
  name: string;
  folderName: string;
}

interface Logger {
  color: string,
  name: string
}

interface Loggers {
  info: Logger
  error: Logger
}

const loggers = {
  info: {
    color: "#82E0AA",
    name: "INFO"
  },
  error: {
    color: "#F93610",
    name: "ERROR"
  },
};

interface Versions {
  TLA: Version;
  RVR09: Version;
  RVR60: Version;
}

export const versions: Versions = {
  "TLA": {
    urlNumber: 52,
    folderName: "tla",
    name: "TLA",
  },
  "RVR09": {
    urlNumber: 1718,
    folderName: "rv1909",
    name: "RVR09",
  },
  "RVR60": {
    urlNumber: 149,
    folderName: "rv1960",
    name: "RVR60",
  },
};

const getColor = (key: string) => {

  const logger: Logger = loggers[key as keyof Loggers];

  return logger;
};

export const log = (message: string, type: keyof Loggers) => {
  const logger = getColor(type);

  console.log(`%c[${logger.name}] %c${message}`, `color: ${logger.color}`, 'color: #ffffff');
};

const sleep = (secs: number) => {
  const milis = secs * 1000;
  setTimeout(() => { }, milis);
};

const isUpperCase = (str: string) => {
  return str == str.toUpperCase() && str != str.toLowerCase();
};
const formatString = (str: string) => {
  return str[0] + str.slice(1, str.length).toLowerCase();
};

const getBookUrls = (book: Book, version: string) => {
  const urls = [];
  const versionData = versions[version as keyof Versions];
  for (let i = 1; i <= book.chapters; i++) {
    urls.push(
      `${url}/${versionData.urlNumber}/${book.abrev}.${i}.${versionData.name}`,
    );
  }

  return urls;
};

const scrapeBook = async (book: Book, version: string) => {
  const urls = getBookUrls(book, version);

  const requests = urls.map((u) => fetch(u));

  const responses = await Promise.all(requests);

  const rawBook = [];
  let j = 1;
  for (const resp of responses) {
    const html = await resp.text();
    const chapter = getChapter(html);
    rawBook.push({ chapter: j, verses: chapter });
    j++;
  }

  return rawBook;
};

const getChapter = (html: string) => {
  const $ = cherio.load(html);

  const verses: string[] = [];
  $(".content").each((_idx, el) => {
    const verse = $(el).text();
    verses.push(verse);
  });

  const chapter: { verse: string; number: number }[] = [];
  let i = 1;
  let verse = "";
  for (let v of verses) {
    if (v === "  " && verse !== "") {
      // delete trailing spaces in begin of verse "  "
      if (verse[0] === " ") {
        verse = verse.slice(2);
      }
      // push verse and number
      const arr = verse.split(" ");
      const oneWordUpper = arr[0];
      const twoWordsUpper = arr[0] + arr[1];
      if (isUpperCase(oneWordUpper)) {
        verse = formatString(verse);
      }
      if (isUpperCase(twoWordsUpper)) {
        const two1 = formatString(arr[0]);
        const two2 = formatString(arr[1]);
        verse = `${two1} ${two2} ${arr.slice(2, verse.length).join(" ")}`;
      }

      chapter.push({ verse, number: i });

      // reset verse
      verse = "";
      // increase verse num
      i++;
      continue;
    }
    if (v.at(-1) === " ") {
      v = v.slice(0, -1);
    }

    if (v[0] === " " && v[1] === " ") {
      v = v.slice(2);
    }
    if (v[0] === " ") {
      v = v.slice(1);
    }
    // add space between large verse
    if (verse !== "") {
      verse += " ";
    }
    // add slice of a verse
    verse += v;
  }

  if (verse[0] === " ") {
    verse = verse.slice(1);
  }

  chapter.push({ verse, number: i });

  i++;
  return chapter;
};

export default async function scrapeVersion(version: Version) {
  const dir = `${Deno.cwd()}/db`;
  const existPath = existDir(dir);
  if (!existPath) {
    Deno.mkdir(dir);
  }
  const versionPath = `${Deno.cwd()}/db/${version.folderName}`;
  const existVersionFolder = existDir(versionPath);
  if (!existVersionFolder) {
    Deno.mkdir(versionPath);
  }

  for await (const book of books) {
    const testamentFolder = book.testament === "Antiguo Testamento"
      ? "oldTestament"
      : "newTestament";
    let Bookverses;
    try {
      if (book.name === "Salmos" && version.name !== versions.RVR60.name) {
        const rawBook = [];
        const urls = [];
        for (let j = 1; j <= 140; j++) {
          urls.push(
            `${url}/${version.urlNumber}/${book.abrev}.${j}.${version.name}`,
          );
        }

        const reqs = urls.map((u) => fetch(u));

        const res = await Promise.all(reqs);

        let k = 1;
        for (const r of res) {
          const html = await r.text();
          const chapter = getChapter(html);
          rawBook.push({ chapter: k, verses: chapter });
          k++;
        }

        sleep(1);

        for (let i = 140; i <= 150; i++) {
          const resp = await fetch(
            `${url}/${version.urlNumber}/${book.abrev}.${i}.${version.name}`,
          );
          const html = await resp.text();
          const chapter = getChapter(html);
          rawBook.push({ chapter: k, verses: chapter });
          k++;
        }

        await Deno.writeTextFile(
          `${Deno.cwd()}/db/${version.folderName}/${testamentFolder}/${book.name.toLowerCase()}.json`,
          JSON.stringify(rawBook, null, "\t"),
        );
        log(`Scraped ${book.name}`, "info");
        continue;
      }
      Bookverses = await scrapeBook(book, version.name);
      await Deno.writeTextFile(
        `${Deno.cwd()}/db/${version.folderName}/${testamentFolder}/${book.name.toLowerCase()}.json`,
        JSON.stringify(Bookverses, null, "\t"),
      );
    } catch (error) {
      if (!(error instanceof Deno.errors.NotFound)) {
        throw error;
      }
      await Deno.mkdir(
        `${Deno.cwd()}/db/${version.folderName}/${testamentFolder}/`,
      );
      Bookverses = await scrapeBook(book, version.name);
      await Deno.writeTextFile(
        `${Deno.cwd()}/db/${version.folderName}/${testamentFolder}/${book.name.toLowerCase()}.json`,
        JSON.stringify(Bookverses, null, "\t"),
      );
    }
    log(`Scraped ${book.name}`, "info");

    Bookverses = [];
  }
}

if (import.meta.main) {
  scrapeVersion(versions.TLA);
}
