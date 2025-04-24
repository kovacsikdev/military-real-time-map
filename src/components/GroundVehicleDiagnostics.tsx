import { useState } from "react";
import { GroundVehicleViewer } from "./GroundVehicleViewer";
import { TankDiagnosticsType } from "../types/Markers";
import { getDiagnosticStyle } from "../libs/helpers";
import "./GroundVehicleDiagnostics.scss";

export const GroundVehicleDiagnostics = (props: TankDiagnosticsType) => {
  const { fuel, ammo, recommendations, health } = props;
  const [displayHealthDiagnostics, setDisplayHealthDiagnostics] =
    useState(true);
  const [displayRecommendations, setDisplayRecommendations] = useState(false);

  const toggleHealthDiagnostics = () => {
    setDisplayHealthDiagnostics(!displayHealthDiagnostics);
  };
  const toggleRecommendations = () => {
    setDisplayRecommendations(!displayRecommendations);
  };

  return (
    <div id="GroundVehicleDiagnostics">
      <div className="header">
        <h2>Diagnostics</h2>
      </div>
      <div className="diagnostics-content">
        <div className="vehicle-info">
          <GroundVehicleViewer />
        </div>
        <div className="diagnostics-info">
          <h3>Diagnostics Information</h3>
          <div className="fuel-info" style={getDiagnosticStyle(fuel)}>
            Fuel Level: {fuel}%
          </div>
          <div className="ammo-info" style={getDiagnosticStyle(ammo)}>
            Ammo Level: {ammo}%
          </div>
          <section>
            <div className="health-info">
              <h4
                onClick={toggleHealthDiagnostics}
                style={{ cursor: "pointer" }}
              >
                Health Diagnostics {displayHealthDiagnostics ? "▼" : "▶"}
              </h4>
              {displayHealthDiagnostics && (
                <ul>
                  {Object.entries(health).map(([key, value]) => (
                    <li key={key} style={getDiagnosticStyle(value)}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}: {value}%
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
          <section>
            <div className="recommendations-info">
              <h4 onClick={toggleRecommendations} style={{ cursor: "pointer" }}>
                Recommendations {displayRecommendations ? "▼" : "▶"}
              </h4>
              {displayRecommendations && (
                <ul>
                  {recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
