import React, { useState, useEffect, useContext } from "react";
import { EntityDataContext } from "../libs/context";
import { getIcon } from "../libs/helpers";
import { GroundVehicleDiagnostics } from "./GroundVehicleDiagnostics";
import "./GroundOperator.scss";

type GroundOperatorProps = {
  autoOpenPanel?: boolean;
};

export const GroundOperator: React.FC<GroundOperatorProps> = ({
  autoOpenPanel,
}) => {
  const { selectedEntity } = useContext(EntityDataContext); // auto open once if the window is large enough
  const [isDiagnostics, setIsDiagnostics] = useState(false);
  const [isVisible, setIsVisible] = useState(autoOpenPanel);

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

  return (
    <div id="GroundOperator" style={{ right: isVisible ? "0" : "" }}>
      <button className="toggle-button" onClick={togglePanel}>
        {isVisible ? "▼" : "▶"}
      </button>
      {isVisible && (
        <>
          {isDiagnostics && selectedEntity?.data?.tankStatus && (
            <GroundVehicleDiagnostics {...selectedEntity?.data?.tankStatus} />
          )}
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
