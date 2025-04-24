import { useEffect, useState, useContext } from "react";
import { MarkerType, DispositionTypes } from "../types/Markers";
import { EntityDataContext } from "../libs/context";
import { getEndpoint } from "../libs/helpers";

export const useEntityData = () => {
  const [entityData, setEntityData] = useState<MarkerType[]>([]);
  const [dispositionData, setDispositionData] = useState<DispositionTypes>({} as DispositionTypes);
  const { roomCode } = useContext(EntityDataContext);

  useEffect(() => {
    console.log(`Connecting to SSE stream with room code ${roomCode}...`);
    const eventSource = new EventSource(
      `${getEndpoint()}/api/location-stream?room=${roomCode}&role=command-center`
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setEntityData(data.entities);
      setDispositionData(data.dispositions);
    };

    eventSource.onerror = () => {
      console.error("Error with SSE connection");
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return { entityData, dispositionData };
};
