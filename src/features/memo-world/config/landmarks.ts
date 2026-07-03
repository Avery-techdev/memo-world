import type { Landmark } from "@/features/memo-world/types";

// The 10 landmark motifs. The hard level uses all of them; easier levels use the
// first N entries. Order is stable so deck building is deterministic per level.

export const LANDMARKS: readonly Landmark[] = [
  { id: "eiffel-tower", name: "Eiffel Tower", city: "Paris" },
  { id: "empire-state-building", name: "Empire State Building", city: "New York" },
  { id: "brandenburg-gate", name: "Brandenburg Gate", city: "Berlin" },
  { id: "berlin-tv-tower", name: "TV Tower", city: "Berlin" },
  { id: "colosseum", name: "Colosseum", city: "Rome" },
  { id: "big-ben", name: "Big Ben", city: "London" },
  { id: "burj-khalifa", name: "Burj Khalifa", city: "Dubai" },
  { id: "sagrada-familia", name: "Sagrada Família", city: "Barcelona" },
  { id: "sydney-opera-house", name: "Opera House", city: "Sydney" },
  { id: "taj-mahal", name: "Taj Mahal", city: "Agra" },
] as const;
