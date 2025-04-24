import React, { useState, useContext } from "react";
import { EntityDataContext } from "../libs/context";
import { getEndpoint } from "../libs/helpers";
import "./ControlPanel.scss";

type ControlPanelProps = {
  clearMarker: () => void;
};

export const ControlPanel: React.FC<ControlPanelProps> = ({ clearMarker }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isCoreDataVisible, setIsCoreDataVisible] = useState(true);
  const [isRulesVisible, setIsRulesVisible] = useState(false);
  const [updatingDisposition, setUpdatingDisposition] = useState(false);

  const { selectedEntity, roomCode } = useContext(EntityDataContext);

  const togglePanel = () => {
    setIsVisible(!isVisible);
  };

  const toggleCoreData = () => {
    setIsCoreDataVisible(!isCoreDataVisible);
  };

  const toggleRules = () => {
    setIsRulesVisible(!isRulesVisible);
  };

  const handleDispositionChange = (disposition: string) => {
    if (selectedEntity) {
      // Update the selected entity's disposition here
      console.log(
        `Updating disposition of ${selectedEntity.id} to ${disposition}`
      );
      setUpdatingDisposition(true);
      fetch(`${getEndpoint()}/api/update-disposition`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          room: roomCode,
          id: selectedEntity.id,
          disposition: disposition,
        }),
      })
        .then((response) => {
          console.log("updated disposition", response.statusText);
        })
        .catch((error) => console.error("Error:", error))
        .finally(() => {
          setUpdatingDisposition(false);
        });
    }
  };

  return (
    <div id="ControlPanel" style={{ left: isVisible ? "0" : "" }}>
      <button className="toggle-button" onClick={togglePanel}>
        {isVisible ? "▼" : "◀"}
      </button>
      {isVisible && (
        <>
          <div className="control-panel-header">
            <h2>Control Panel</h2>
            <button onClick={clearMarker}>Clear selection</button>
          </div>
          {/* TODO: Implement a chat room for ground}
          {/* <div>
            <h2>Room</h2>
            <p>
              <strong>C-{roomCode}</strong>
            </p>
            <p>
              Give above number to a ground operator for them to see map
              updates. This is to allow multiple instances of the same Command
              Center for this mock project to not overlap.
            </p>
          </div> */}
          <div className="object-information-title">
            <h2>Object Information</h2>
          </div>
          <div className="object-information">
            {selectedEntity && (
              <>
                <section className="section-title">
                  <div onClick={toggleCoreData} style={{ cursor: "pointer" }}>
                    Core Data {isCoreDataVisible ? "▼" : "▶"}
                  </div>
                  {isCoreDataVisible && (
                    <div>
                      <p>
                        <strong>ID:</strong> {selectedEntity.id}
                      </p>
                      <p>
                        <strong>Coordinates:</strong>{" "}
                        {selectedEntity.coordinates[0].toFixed(6)},{" "}
                        {selectedEntity.coordinates[1].toFixed(6)}
                      </p>
                      <div className="object-data">
                        <ul>
                          <li>
                            <strong>Name:</strong> {selectedEntity.data.name}
                          </li>
                          <li>
                            <strong>Description:</strong>{" "}
                            {selectedEntity.data.description}
                          </li>
                          <li>
                            <strong>Type:</strong> {selectedEntity.data.type}
                          </li>
                          {selectedEntity.data.linkedTo &&
                            selectedEntity.data.linkedTo.length > 0 && (
                              <li>
                                <strong>Linked To:</strong>{" "}
                                {selectedEntity.data.linkedTo.join(", ")}
                              </li>
                            )}
                          {selectedEntity.data.speed && (
                            <li>
                              <strong>Speed:</strong>{" "}
                              {selectedEntity.data.speed} mph
                            </li>
                          )}
                          <li>
                            <strong>Disposition:</strong>{" "}
                            {selectedEntity.data.disposition}
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </section>
                {selectedEntity.data.canChangeDisposition && (
                  <section className="section-title">
                    <div onClick={toggleRules} style={{ cursor: "pointer" }}>
                      Rules of engagement {isRulesVisible ? "▼" : "▶"}
                    </div>
                    {isRulesVisible && (
                      <div>
                        <p>
                          Mark disposition as (updates status of object for
                          everyone):
                        </p>
                        <div className="control-buttons">
                          <button
                            disabled={updatingDisposition}
                            className={`control-button neutral ${
                              updatingDisposition ? "disabled" : ""
                            }`}
                            onClick={() => handleDispositionChange("neutral")}
                          >
                            Neutral
                          </button>
                          <button
                            disabled={updatingDisposition}
                            className={`control-button friendly ${
                              updatingDisposition ? "disabled" : ""
                            }`}
                            onClick={() => handleDispositionChange("friendly")}
                          >
                            Friendly
                          </button>
                          <button
                            disabled={updatingDisposition}
                            className={`control-button hostile ${
                              updatingDisposition ? "disabled" : ""
                            }`}
                            onClick={() => handleDispositionChange("hostile")}
                          >
                            Hostile
                          </button>
                        </div>
                      </div>
                    )}
                  </section>
                )}
              </>
            )}
            {!selectedEntity && (
              <div className="object-information">
                <p>No object selected</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
