import type { Component } from "vue";
import type { LandmarkId } from "@/features/memo-world/types";
import EiffelTower from "./EiffelTower.vue";
import EmpireStateBuilding from "./EmpireStateBuilding.vue";
import BrandenburgGate from "./BrandenburgGate.vue";
import BerlinTvTower from "./BerlinTvTower.vue";
import Colosseum from "./Colosseum.vue";
import BigBen from "./BigBen.vue";
import BurjKhalifa from "./BurjKhalifa.vue";
import SagradaFamilia from "./SagradaFamilia.vue";
import SydneyOperaHouse from "./SydneyOperaHouse.vue";
import TajMahal from "./TajMahal.vue";

// Maps each landmark id to its line-art SVG component. Kept exhaustive by the
// `Record<LandmarkId, Component>` type: adding a landmark id forces an entry here.
export const LANDMARK_ILLUSTRATIONS: Readonly<Record<LandmarkId, Component>> = {
  "eiffel-tower": EiffelTower,
  "empire-state-building": EmpireStateBuilding,
  "brandenburg-gate": BrandenburgGate,
  "berlin-tv-tower": BerlinTvTower,
  colosseum: Colosseum,
  "big-ben": BigBen,
  "burj-khalifa": BurjKhalifa,
  "sagrada-familia": SagradaFamilia,
  "sydney-opera-house": SydneyOperaHouse,
  "taj-mahal": TajMahal,
};
