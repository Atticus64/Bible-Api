# Bible API

## Enpoints

### Reina Valera 1960

*Get all book*

`/rv1960/book/<book>`

`/rv1960/oldtestament/<book>`

`/rv1960/newTestament/<book>`

- Example 

GET `/rv1960/book/genesis`

GET `/rv1960/oldTestament/genesis`

*Get chapter book*

`/rv1960/book/<book>/<chapter>`

`/rv1960/oldtestament/<book>/<chapter>`

`/rv1960/newTestament/<book>/<chapter>`

- Examples

GET `/rv1960/book/genesis/1`

GET `/rv1960/oldTestament/genesis/1`

## Dev server

```
deno task dev
```

## Scrape

```
deno task scrape
```

