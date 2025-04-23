import { createContext } from "react";
import { MarkerType } from "../types/Markers";

export const EntityDataContext = createContext({
  selectedEntity: null as MarkerType | null,
  roomCode: "" as string
  // allEntities: [] as MarkerType[],
});
