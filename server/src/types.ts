export type DispositionType = "unknown" | "friendly" | "hostile" | "neutral" | "caution";
export type MarkerDataObjectType = "tank" | "ground operator" | "radio tower" | "drone" | "aircraft" | "missile" | "rocket" | "vehicle" | "ship" | "submarine" | "satellite" | "unknown";

export type TankDiagnosticsHealthType = {
  engine: number; // Engine health level in percentage (0-100)
  tracks: number; // Tracks health level in percentage (0-100)
  turret: number; // Turret health level in percentage (0-100)
  hull: number; // Hull health level in percentage (0-100)
  radio: number; // Optics health level in percentage (0-100)
  electronics: number; // Electronics health level in percentage (0-100)
}

export type TankDiagnosticsType = {
  fuel: number; // Fuel level in percentage (0-100)
  ammo: number; // Ammo level in percentage (0-100)
  health: TankDiagnosticsHealthType; // Health diagnostics of the tank
  recommendations: string[]; // Array of recommendations for tank diagnostics
}

export type MarkerDataType = {
  name: string;
  description: string;
  disposition: DispositionType;
  type: MarkerDataObjectType;
  linkedTo?: string[]; // Array of IDs that this entity is linked to
  speed?: number; // Speed in miles per hour
  canChangeDisposition?: boolean; // Flag to indicate if the entity can change its disposition
  tankStatus?: TankDiagnosticsType; // Optional tank status for tank entities
}

export type MarkerType = {
  id: string;
  coordinates: [number, number];
  bearing: number;
  data: MarkerDataType
}

export type DispositionTypes = Record<string, DispositionType>;

export type RoomType = {
  dispositions: DispositionTypes;
  entities: MarkerType[];
}