
import * as turf from "@turf/turf";
import radioTowerIcon from "../assets/radio_tower_26.svg";
import droneIcon from "../assets/drone_26.svg";
import droneNeutralIcon from "../assets/drone_neutral_26.svg";
import droneHostileIcon from "../assets/drone_hostile_26.svg";
import droneFriendlyIcon from "../assets/drone_friendly_26.svg";
import jeepIcon from "../assets/jeep_26.svg";
import jeepNeutralIcon from "../assets/jeep_neutral_26.svg";
import jeepHostileIcon from "../assets/jeep_hostile_26.svg";
import jeepFriendlyIcon from "../assets/jeep_friendly_26.svg";
import jetFighterIcon from "../assets/jet_fighter_26.svg";
import tankIcon from "../assets/tank_26.svg";
import wifiIcon from "../assets/wifi_26.svg";
import unknownIcon from "../assets/unknown_26.svg";

import { DispositionType, MarkerDataObjectType } from "../types/Markers";

const INITIAL_CENTER: [number, number] = [-121.519146, 48.443526];

export const getIcon = (type: MarkerDataObjectType, disposition: DispositionType) => {
  switch (type) {
    case "radio tower":
      return radioTowerIcon;
    case "drone":
      if (disposition === "friendly") {
        return droneFriendlyIcon;
      } else if (disposition === "hostile") {
        return droneHostileIcon;
      }
      else if (disposition === "neutral") {
        return droneNeutralIcon;
      }
      return droneIcon;
    case "ground operator":
      return wifiIcon;
    case "aircraft":
      return jetFighterIcon;
    case "tank":
      return tankIcon;
    case "vehicle":
      if (disposition === "friendly") {
        return jeepFriendlyIcon;
      } else if (disposition === "hostile") {
        return jeepHostileIcon;
      }
      else if (disposition === "neutral") {
        return jeepNeutralIcon;
      }
      return jeepIcon;
    default:
      return unknownIcon; // Default icon for unknown types
  }
}

export const getDiagnosticStyle = (value: number) => {
  if (value > 75) {
    return { backgroundColor: "none", color: "white" };
  }
  if (value > 50) {
    return { backgroundColor: "#ffa600", color: "black" };
  }
  return { backgroundColor: "#FF0000", color: "black" };
}

export const setupMapPaint = (mapRef: any) => {
  const circle1 = turf.circle(INITIAL_CENTER, 10, { steps: 40, units: "miles" });
  const circle2 = turf.circle(INITIAL_CENTER, 20, { steps: 50, units: "miles" });
  const circle3 = turf.circle(INITIAL_CENTER, 30, { steps: 60, units: "miles" });

  const destination1 = turf.destination(INITIAL_CENTER, 10, -90, {
    units: "miles",
  }); // 10 miles to the west
  const destination2 = turf.destination(INITIAL_CENTER, 20, -90, {
    units: "miles",
  }); // 20 miles to the west
  const destination3 = turf.destination(INITIAL_CENTER, 30, -90, {
    units: "miles",
  }); // 30 miles to the west
  
  // Add a source for the circle
  mapRef.current?.addSource("circle", {
    type: "geojson",
    data: circle1,
  });

  // Add a layer to display the circle
  mapRef.current?.addLayer({
    id: "circle-layer",
    type: "line",
    source: "circle",
    layout: {},
    paint: {
      "line-color": "#000",
      "line-width": 4,
      "line-opacity": 0.75,
    },
  });

  mapRef.current?.addSource("circle2", {
    type: "geojson",
    data: circle2,
  });

  // Add a layer to display the circle
  mapRef.current?.addLayer({
    id: "circle-layer2",
    type: "line",
    source: "circle2",
    layout: {},
    paint: {
      "line-color": "#000",
      "line-width": 4,
      "line-opacity": 0.5,
    },
  });

  mapRef.current?.addSource("circle3", {
    type: "geojson",
    data: circle3,
  });

  // Add a layer to display the circle
  mapRef.current?.addLayer({
    id: "circle-layer3",
    type: "line",
    source: "circle3",
    layout: {},
    paint: {
      "line-color": "#000",
      "line-width": 4,
      "line-opacity": 0.5,
    },
  });

  mapRef.current?.addSource("textGeoJsonSource", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: destination1.geometry,
          properties: {
            t: "10 miles",
          },
        },
      ],
    },
  });

  mapRef.current?.addLayer({
    id: "sectionTextLayer",
    type: "symbol",
    source: "textGeoJsonSource",
    layout: {
      "text-field": ["get", "t"],
      "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
      "text-size": 16,
    },
  });

  mapRef.current?.addSource("textGeoJsonSource2", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: destination2.geometry,
          properties: {
            t: "20 miles",
          },
        },
      ],
    },
  });

  mapRef.current?.addLayer({
    id: "sectionTextLayer2",
    type: "symbol",
    source: "textGeoJsonSource2",
    layout: {
      "text-field": ["get", "t"],
      "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
      "text-size": 16,
    }
  });

  mapRef.current?.addSource("textGeoJsonSource3", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: destination3.geometry,
          properties: {
            t: "30 miles",
          },
        },
      ],
    },
  });

  mapRef.current?.addLayer({
    id: "sectionTextLayer3",
    type: "symbol",
    source: "textGeoJsonSource3",
    layout: {
      "text-field": ["get", "t"],
      "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
      "text-size": 16,
    }
  });
}

/**
 * Returns the endpoint URL for the API based on the environment.
 * @returns {string} The endpoint URL for the API.
 */
export const getEndpoint = () => {
  const env = import.meta.env.PROD;
  const endpoint = env ? import.meta.env.VITE_PROD_ENDPOINT : "http://localhost:8080";
  return endpoint;
}