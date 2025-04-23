import { useEffect, useState } from 'react';
import { Map } from './components/Map';
import { ControlPanel } from './components/ControlPanel';
import { GroundOperator } from './components/GroundOperator';
import { WelcomeModal } from './components/WelcomeModal';
import { MarkerType } from './types/Markers';
import { EntityDataContext } from './libs/context';
import './App.css';

function App() {
  const [selectedEntity, setSelectedEntity] = useState<MarkerType | null>(null);
  const [roomCode, setRoomCode] = useState<string>("");
  const [displayMap, setDisplayMap] = useState(false);
  const [displayWelcomeModal, setDisplayWelcomeModal] = useState(false);

  useEffect(() => {
    const hideWelcomeMessage = localStorage.getItem('kovacsik-military-real-time-map-welcome');
    if (hideWelcomeMessage === 'true') {
      setDisplayWelcomeModal(false);
    } else {
      setDisplayWelcomeModal(true);
    }

    if (roomCode) return; // Prevent multiple fetch calls
    
    fetch("http://localhost:8080/api/command-center")
      .then(response => response.json())
      .then(data => {
        console.log("Command center room code:", data.roomCode);
        setRoomCode(data.roomCode);
        setDisplayMap(true);
      })
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <>
      {displayWelcomeModal && (<WelcomeModal setOpen={setDisplayWelcomeModal}/>)}
      {displayMap && (
        <EntityDataContext.Provider value={{ selectedEntity, roomCode}}>
          <ControlPanel
            clearMarker={() => {setSelectedEntity(null)}}
          />
          <GroundOperator />
          <Map
            setSelectedEntity={setSelectedEntity}
          />
        </EntityDataContext.Provider>
      )}
    </>
  );
}

export default App;
