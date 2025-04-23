import React, { useState, useEffect, useContext } from "react";
import { EntityDataContext } from "../libs/context";
import { getIcon } from "../libs/helpers";
import { GroundVehicleDiagnostics } from "./GroundVehicleDiagnostics";
import { TankDiagnosticsType } from "../types/Markers";
import "./GroundOperator.scss";

export const GroundOperator: React.FC = () => {
  const { selectedEntity } = useContext(EntityDataContext);
  const [isDiagnostics, setIsDiagnostics] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const togglePanel = () => {
    setIsVisible(!isVisible);
  };
  useEffect(() => {
    if (selectedEntity) {
      if (selectedEntity.data.type === "tank") {
        setIsDiagnostics(true);
      } else {
      setIsDiagnostics(false);
    }
    } else {
      setIsDiagnostics(false);
    }
  }, [selectedEntity]);

  const sampleDiagnostics: TankDiagnosticsType = {
    fuel: 25,
    ammo: 80,
    recommendations: [
      "Check fuel levels",
    ],
    health: {
      engine: 90,
      tracks: 85,
      turret: 80,
      hull: 95,
      radio: 70,
      electronics: 60,
    },
  };
  return (
    <div id="GroundOperator" style={{ right: isVisible ? "0" : "" }}>
      <button className="toggle-button" onClick={togglePanel}>
        {isVisible ? "▼" : "▶"}
      </button>
      {isVisible && (
        <>
          {isDiagnostics && <GroundVehicleDiagnostics {...sampleDiagnostics} />}
          {!isDiagnostics && (
            <>
              <div className="header">
                <h2>Ground Operator Panel</h2>
              </div>
              <div className="no-selection">
                <p>Select an operator vehicle to see diagnostics</p>
                <div className="no-selection-icon">
                  <img src={getIcon("tank", "friendly")} alt="Operator Icon" />
                  <div>Select this icon to view vehicle diagnostics</div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};
