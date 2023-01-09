import scrapeGenesis from '$/scraping/genesis.ts'

Deno.bench(function test() {
  scrapeGenesis()
});
