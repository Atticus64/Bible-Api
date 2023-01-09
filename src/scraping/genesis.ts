import * as cherio from "cherio";

const getUrls = (): string[] => {
  const urls = []
  for (let i = 1; i <= 50; i++) {
    urls.push(`https://www.biblia.es/biblia-buscar-libros-1.php?libro=genesis&capitulo=${i}&version=rv60`)
  }

  return urls
}

export default async function scrapeGenesis() {

  const urls = getUrls()

  const requests = urls.map(url => fetch(url))

  const resps = await Promise.all(requests)

  let i = 1
  for (const resp of resps) {
    const page = await resp.text()

    const $ = cherio.load(page);

    const vers: { verse: string; number: number }[] = [];
    const rawTitle = $("div.caja_980").text().split("-")[1].replace(
      "Reina Valera 1960",
      "",
    );

    const book = rawTitle.split(" ")[1];
    const chapter = rawTitle.split(" ")[2];
    const study = $("h2.estudio").text();

    console.log({ book, chapter, study });
    // console.log(verArr[0].split('1')[1])
    // console.log(verArr)
    $("span.texto").each((indx, item) => {
      const verse = $(item).text();
      const number = indx + 1;
      vers.push({ verse, number });
    });

    await Deno.writeTextFile(
      `books/genesis/cap${i}.json`,
      JSON.stringify(vers, null, "\t"),
    );

    i++
  }

}

await scrapeGenesis()
