import { scrapeRV60 } from "./RVR1960.ts";

const Testaments = ["Antiguo Testamento", "Nuevo Testamento"] as const;
export type Testament = typeof Testaments[number];

export interface Book {
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
    testament: "Antiguo Testamento",
  },
  {
    name: "Exodo",
    chapters: 40,
    testament: "Antiguo Testamento",
  },
  {
    name: "Levitico",
    chapters: 27,
    testament: "Antiguo Testamento",
  },
  {
    name: "Deuteronomio",
    chapters: 34,
    testament: "Antiguo Testamento",
  },
  {
    name: "Josue",
    chapters: 24,
    testament: "Antiguo Testamento",
  },
  {
    name: "Jueces",
    chapters: 21,
    testament: "Antiguo Testamento",
  },
  {
    name: "Rut",
    chapters: 4,
    testament: "Antiguo Testamento",
  },
  {
    name: "1-Samuel",
    chapters: 31,
    testament: "Antiguo Testamento",
  },
  {
    name: "2-Samuel",
    chapters: 24,
    testament: "Antiguo Testamento",
  },
  {
    name: "1-Reyes",
    chapters: 22,
    testament: "Antiguo Testamento",
  },
  {
    name: "2-Reyes",
    chapters: 25,
    testament: "Antiguo Testamento",
  },
  {
    name: "1-Cronicas",
    chapters: 29,
    testament: "Antiguo Testamento",
  },
  {
    name: "2-Cronicas",
    chapters: 36,
    testament: "Antiguo Testamento",
  },
  {
    name: "Esdras",
    chapters: 10,
    testament: "Antiguo Testamento",
  },
  {
    name: "Nehemias",
    chapters: 13,
    testament: "Antiguo Testamento",
  },
  {
    name: "Ester",
    chapters: 10,
    testament: "Antiguo Testamento",
  },
  {
    name: "Job",
    chapters: 42,
    testament: "Antiguo Testamento",
  },
  {
    name: "Salmos",
    chapters: 150,
    testament: "Antiguo Testamento",
  },
  {
    name: "Proverbios",
    chapters: 31,
    testament: "Antiguo Testamento",
  },
  {
    name: "Eclesiastes",
    chapters: 12,
    testament: "Antiguo Testamento",
  },
  {
    name: "Cantares",
    chapters: 8,
    testament: "Antiguo Testamento",
  },
  {
    name: "Isaias",
    chapters: 66,
    testament: "Antiguo Testamento",
  },
  {
    name: "Lamentaciones",
    chapters: 5,
    testament: "Antiguo Testamento",
  },
  {
    name: "Ezequiel",
    chapters: 48,
    testament: "Antiguo Testamento",
  },
  {
    name: "Daniel",
    chapters: 12,
    testament: "Antiguo Testamento",
  },
  {
    name: "Oseas",
    chapters: 14,
    testament: "Antiguo Testamento",
  },
  {
    name: "Joel",
    chapters: 3,
    testament: "Antiguo Testamento",
  },
  {
    name: "Amos",
    chapters: 9,
    testament: "Antiguo Testamento",
  },
  {
    name: "Abdias",
    chapters: 1,
    testament: "Antiguo Testamento",
  },
  {
    name: "Jonas",
    chapters: 4,
    testament: "Antiguo Testamento",
  },

  {
    name: "Miqueas",
    chapters: 7,
    testament: "Antiguo Testamento",
  },
  {
    name: "Nahum",
    chapters: 3,
    testament: "Antiguo Testamento",
  },
  {
    name: "Habacuc",
    chapters: 3,
    testament: "Antiguo Testamento",
  },
  {
    name: "Sofonias",
    chapters: 3,
    testament: "Antiguo Testamento",
  },
  {
    name: "Hageo",
    chapters: 2,
    testament: "Antiguo Testamento",
  },
  {
    name: "Zacarias",
    chapters: 14,
    testament: "Antiguo Testamento",
  },
  {
    name: "Malaquias",
    chapters: 4,
    testament: "Antiguo Testamento",
  },
  {
    name: "Mateo",
    chapters: 28,
    testament: "Nuevo Testamento",
  },
  {
    name: "Marcos",
    chapters: 16,
    testament: "Nuevo Testamento",
  },
  {
    name: "Lucas",
    chapters: 24,
    testament: "Nuevo Testamento",
  },
  {
    name: "Juan",
    chapters: 21,
    testament: "Nuevo Testamento",
  },
  {
    name: "Hechos",
    chapters: 28,
    testament: "Nuevo Testamento",
  },
  {
    name: "Romanos",
    chapters: 16,
    testament: "Nuevo Testamento",
  },
  {
    name: "1-Corintios",
    chapters: 16,
    testament: "Nuevo Testamento",
  },
  {
    name: "2-Corintios",
    chapters: 13,
    testament: "Nuevo Testamento",
  },
  {
    name: "Galatas",
    chapters: 6,
    testament: "Nuevo Testamento",
  },
  {
    name: "Efesios",
    chapters: 6,
    testament: "Nuevo Testamento",
  },
  {
    name: "Filipenses",
    chapters: 4,
    testament: "Nuevo Testamento",
  },
  {
    name: "Colosenses",
    chapters: 4,
    testament: "Nuevo Testamento",
  },
  {
    name: "1-Tesalonicenses",
    chapters: 5,
    testament: "Nuevo Testamento",
  },
  {
    name: "2-Tesalonicenses",
    chapters: 3,
    testament: "Nuevo Testamento",
  },
  {
    name: "1-Timoteo",
    chapters: 6,
    testament: "Nuevo Testamento",
  },
  {
    name: "2-Timoteo",
    chapters: 4,
    testament: "Nuevo Testamento",
  },
  {
    name: "Tito",
    chapters: 3,
    testament: "Nuevo Testamento",
  },
  {
    name: "Filemon",
    chapters: 1,
    testament: "Nuevo Testamento",
  },
  {
    name: "Hebreos",
    chapters: 13,
    testament: "Nuevo Testamento",
  },
  {
    name: "Santiago",
    chapters: 5,
    testament: "Nuevo Testamento",
  },
  {
    name: "1-Pedro",
    chapters: 5,
    testament: "Nuevo Testamento",
  },
  {
    name: "2-Pedro",
    chapters: 3,
    testament: "Nuevo Testamento",
  },
  {
    name: "1-Juan",
    chapters: 5,
    testament: "Nuevo Testamento",
  },
  {
    name: "2-Juan",
    chapters: 1,
    testament: "Nuevo Testamento",
  },
  {
    name: "3-Juan",
    chapters: 1,
    testament: "Nuevo Testamento",
  },
  {
    name: "Judas",
    chapters: 1,
    testament: "Nuevo Testamento",
  },
  {
    name: "Apocalipsis",
    chapters: 22,
    testament: "Nuevo Testamento",
  },
];

if (import.meta.main) {
  scrapeRV60();
}
