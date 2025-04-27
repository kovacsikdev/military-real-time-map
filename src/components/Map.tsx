import { useEffect, useState, useRef, useContext } from "react";
import mapboxgl from "mapbox-gl";
import * as turf from "@turf/turf";
import { EntityDataContext } from "../libs/context";
import { useEntityData } from "../libs/hooks";
import { getIcon, setupMapPaint } from "../libs/helpers";
import "mapbox-gl/dist/mapbox-gl.css";
import "./Map.scss";

import { MarkerType } from "../types/Markers";

type MapProps = {
  setSelectedEntity: (entity: MarkerType | null) => void;
};

export const Map = (props: MapProps) => {
  const { setSelectedEntity } = props;

  const INITIAL_CENTER: [number, number] = [-121.519146, 48.443526];
  const INITIAL_BOUNDS: [number, number, number, number] = [-124, 46, -119, 51];
  const INITIAL_ZOOM = 9;

  const { entityData, dispositionData } = useEntityData();
  const { selectedEntity } = useContext(EntityDataContext);
  const [center, setCenter] = useState<[number, number]>(INITIAL_CENTER);
  const [zoom, setZoom] = useState(INITIAL_ZOOM);

  const mapContainer = useRef(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const existingMarkers = useRef<{ [key: string]: mapboxgl.Marker }>({});

  const handleButtonClick = () => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: INITIAL_CENTER,
        zoom: INITIAL_ZOOM,
      });
    }
    setSelectedEntity(null);
  };

  const addEntityMarker = (data: MarkerType) => {
    const currentZoom = mapRef.current?.getZoom() || 0;
      const markerSize = currentZoom < 10 ? 32 : 48; // smaller size for zoom < 10
      const div = document.createElement("div");
      div.className = "custom-marker";
      div.style.width = `${markerSize}px`;
      div.style.height = `${markerSize}px`;

      const img = document.createElement("img");
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.transform = `rotate(${
        turf.bearingToAzimuth(data.bearing) - 90
      }deg)`;

      switch (data.data.type) {
        case "drone":
          img.src = getIcon("drone", data.data.disposition);
          break;
        case "vehicle":
          img.src = getIcon("vehicle", data.data.disposition);
          break;
        case "aircraft":
          img.src = getIcon("aircraft", data.data.disposition);
          break;
        case "tank":
          img.src = getIcon("tank", data.data.disposition);
          break;
        case "radio tower":
          img.src = getIcon("radio tower", data.data.disposition);
          break;
        case "ground operator":
          img.src = getIcon("ground operator", data.data.disposition);
          break;
        default:
          return;
      }

      div.appendChild(img);
      div.appendChild(document.createElement("div"));

      div.addEventListener("click", (e) => {
        e.stopPropagation();
        setSelectedEntity(data);
        const allMarkers = document.querySelectorAll(".custom-marker");
        allMarkers.forEach((marker) =>
          marker.classList.remove("custom-marker-selected")
        );
        div.classList.add("custom-marker-selected");
      }, false);

      const marker = new mapboxgl.Marker({ element: div })
        .setLngLat([data.coordinates[0], data.coordinates[1]])
        .addTo(mapRef.current!);

      existingMarkers.current[data.id] = marker;
  }

  const updateEntityMarker = (data: MarkerType) => {
    // Update marker coordinates if it already exists
    existingMarkers.current[data.id].setLngLat([
      data.coordinates[0],
      data.coordinates[1],
    ]);

    const markerElement = existingMarkers.current[data.id]._element
      .children[0] as HTMLElement;
    markerElement.style.transform = `rotate(${
      turf.bearingToAzimuth(data.bearing) - 90
    }deg)`;

    // Update issue mark if entity has an issue
    if (data.data.issue) {
      existingMarkers.current[data.id]._element.children[1].classList.add(
        "issue-mark"
      );
    } else {
      existingMarkers.current[
        data.id
      ]._element.children[1].classList.remove("issue-mark");
    }
  }
  
  const updateMarkers = () => {
    entityData.forEach((data) => {
      const markerId = data.id;
      if (existingMarkers.current[markerId]) {
        updateEntityMarker(data);
      } else {
        addEntityMarker(data);
      }
    });
  };

  useEffect(() => {
    if (selectedEntity === null) {
      const allMarkers = document.querySelectorAll(".custom-marker");
      allMarkers.forEach((marker) =>
        marker.classList.remove("custom-marker-selected")
      );
    } else {
      entityData.forEach((data) => {
        const markerId = data.id;
        // Update selectedMarker if it matches the current marker
        if (selectedEntity?.id === markerId) {
          setSelectedEntity(data);
        }
      });
    }
  }, [selectedEntity, entityData]);

  useEffect(() => {
    if (mapRef.current) return; // initialize map only once

    mapboxgl.accessToken =
      "pk.eyJ1Ijoia292YWNzaWsiLCJhIjoiY205azkxNDdtMGh0bDJrb29zNHo0aG9raCJ9.pOBRlnG-d73NfEFTNYH3Yw";
    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current as unknown as HTMLElement,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: center, // starting position [lng, lat]
      zoom: zoom, // starting zoom
      maxBounds: INITIAL_BOUNDS, // [w, s, e, n]
      minZoom: 6,
      maxZoom: 15,
      dragRotate: false,
      touchZoomRotate: false,
    });

    mapRef.current.on('click', (e) => {
      e.preventDefault();
      setSelectedEntity(null); // Deselect marker on map click
    });

    mapRef.current.on("move", () => {
      if (mapRef.current) {
        // get the current center coordinates and zoom level from the map
        const mapCenter = mapRef.current.getCenter();
        const mapZoom = mapRef.current.getZoom();

        setCenter([mapCenter.lng, mapCenter.lat]);
        setZoom(mapZoom);
      }
    });

    mapRef.current.on("zoom", () => {
      const currentZoom = mapRef.current?.getZoom() || 0;
      const markerSize = currentZoom < 10 ? 32 : 48; // smaller size for zoom < 10
      const markers = document.querySelectorAll(".custom-marker");
      for (let i = 0; i < markers.length; i++) {
        const marker = markers[i] as HTMLElement;
        marker.style.width = `${markerSize}px`;
        marker.style.height = `${markerSize}px`;
      }
    });

    mapRef.current.on("load", () => {
      setupMapPaint(mapRef);
    });

    return () => {
      if (mapRef.current) mapRef.current.remove();
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return; // wait for map to initialize
    if (Object.keys(dispositionData).length === 0) return; // wait for disposition data to load

    //update marker img icon based on disposition data
    Object.keys(existingMarkers.current).forEach((markerId) => {
      const marker = existingMarkers.current[markerId];
      const markerElement = marker._element.children[0] as HTMLImageElement;
      const entity = entityData.find((data) => data.id === markerId);
      if (entity?.data.canChangeDisposition) {
        const newIcon = getIcon(entity.data.type, dispositionData[markerId]);
        markerElement.src = newIcon;
      }
    });
  }, [dispositionData]);

  useEffect(() => {
    if (!mapRef.current) return; // wait for map to initialize
    if (entityData.length === 0) return; // wait for entity data to load

    const currentMarkerIds = new Set(entityData.map((data) => data.id));

    // Remove markers that are no longer in locationData
    Object.keys(existingMarkers.current).forEach((markerId) => {
      if (!currentMarkerIds.has(markerId)) {
        if (selectedEntity?.id === markerId) {
          setSelectedEntity(null); // Reset selected marker if it was removed
        }
        existingMarkers.current[markerId].remove();
        delete existingMarkers.current[markerId];
      }
    });

    // Use requestAnimationFrame to batch updates
    requestAnimationFrame(updateMarkers);
  }, [entityData, selectedEntity]);

  return (
    <div id="Map">
      <div className="sidebar">
        Longitude: {center[0].toFixed(4)} | Latitude: {center[1].toFixed(4)} |
        Zoom: {zoom.toFixed(2)}
      </div>
      <button className="reset-button" onClick={handleButtonClick}>
        Reset
      </button>
      <div
        ref={mapContainer}
        style={{ width: "100%" }}
        className="map-container"
      />
    </div>
  );
};
