import express from 'express';
import cors from 'cors';
import { aircraftBots } from './bots';
import { MarkerType, RoomType } from './types';
import bodyParser from 'body-parser';

const app = express();
const INITIAL_CENTER: [number, number] = [-121.519146, 48.443526];
const PORT = process.env.PORT || 8080;
const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ["GET", "POST"]
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

const commandCenterIds: Record<string, RoomType> = {};

/**
 * Initial setup for command center and ground control chat rooms for real time communication.
 */

const generateCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

app.get('/api/location-stream', (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  const { room, role } = req.query;

  if (!room) {
    res.status(400).send('Room code is required');
    return;
  }

  if (!commandCenterIds[room as string]) {
    res.status(404).send('Room not found');
    return;
  }

  console.log(`SSE connection established for room: ${room} at ${new Date().toISOString()}`);

  const intervalId = setInterval(() => {
    const entities = commandCenterIds[room as string];
    res.write(`data: ${JSON.stringify(entities)}\n\n`);
  }, 100);

  req.on('close', () => {
    console.log(`SSE connection closed for room: ${room} at ${new Date().toISOString()}`);
    clearInterval(intervalId);
    if (role === 'command-center') {
      delete commandCenterIds[room as string];
    }
  });
});

app.get('/api/command-center', (req, res) => {
  const roomCode = generateCode();
  commandCenterIds[roomCode] = {
    dispositions: {
      d6: "unknown",
      d7: "unknown",
      j1: "hostile"
    },
    entities: [],
  };

  console.log(`New command center created with room code: ${roomCode} at ${new Date().toISOString()}`);

  let jetBot1Index = 0;
  let jetBot2Index = 0;
  let jetBot3Index = 0;
  let drone1Index = 0;
  let drone2Index = 0;
  let drone3Index = 0;

  const intervalId = setInterval(() => {
    try {
      const entities: MarkerType[] = [
        {
          id: "r1",
          coordinates: INITIAL_CENTER,
          bearing: 90,
          data: {
            name: "Tower 752",
            description: "Radio tower with a 30 mile radius",
            disposition: "friendly",
            type: "radio tower",
          },
        },
        {
          id: "g2",
          coordinates: [-121.519146, 48.4],
          bearing: 90,
          data: {
            name: "Operator g2",
            description: "Ground operators with 4 man crew",
            disposition: "friendly",
            type: "ground operator",
            linkedTo: ["t4", "d8"],
          },
        },
        {
          id: "t4",
          coordinates: [-121.445, 48.45],
          bearing: 90,
          data: {
            name: "M1 Abrams",
            description: "Tank with 120 mm smoothbore gun, fires various rounds including armor-piercing, high-explosive, and depleted uranium projectiles",
            disposition: "friendly",
            type: "tank",
            linkedTo: ["g2"],
            tankStatus: {
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
            },
            issue: true
          },
        },
        {
          id: "j1",
          coordinates: [-121.7518, 48.4253],
          bearing: 90,
          data: {
            name: "UAZ-469",
            description: "Jeep with possible surveillance capabilities",
            disposition: commandCenterIds[roomCode]?.dispositions?.j1 || "hostile",
            type: "vehicle",
            canChangeDisposition: true,
          },
        },
      ];
  
      if (jetBot1Index === aircraftBots.jetBot1.coordinates.length) {
        jetBot1Index = 0;
      }
      if (jetBot1Index < aircraftBots.jetBot1.coordinates.length) {
        const newCoordinates = aircraftBots.jetBot1.coordinates[jetBot1Index];
        if (newCoordinates) {
          entities.push({
            id: "a7",
            coordinates: newCoordinates,
            bearing: aircraftBots.jetBot1.bearing,
            data: {
              name: "F-22",
              description: "Fifth-generation stealth fighter aircraft",
              disposition: "friendly",
              type: "aircraft",
              speed: 800,
            },
          });
        }
        jetBot1Index++;
      }
  
      if (jetBot2Index === aircraftBots.jetBot2.coordinates.length) {
        jetBot2Index = 0;
      }
      if (jetBot2Index < aircraftBots.jetBot2.coordinates.length) {
        const newCoordinates = aircraftBots.jetBot2.coordinates[jetBot2Index];
        if (newCoordinates) {
          entities.push({
            id: "a8",
            coordinates: newCoordinates,
            bearing: aircraftBots.jetBot2.bearing,
            data: {
              name: "F-18",
              description: "All-weather, twin-engine, carrier-capable, multirole combat aircraft designed for both fighter and attack roles",
              disposition: "friendly",
              type: "aircraft",
              speed: 800,
            },
          });
        }
        jetBot2Index++;
      }
  
      if (jetBot3Index === aircraftBots.jetBot3.coordinates.length) {
        jetBot3Index = 0;
      }
      if (jetBot3Index < aircraftBots.jetBot3.coordinates.length) {
        const newCoordinates = aircraftBots.jetBot3.coordinates[jetBot3Index];
        if (newCoordinates) {
          entities.push({
            id: "a9",
            coordinates: newCoordinates,
            bearing: aircraftBots.jetBot3.bearing,
            data: {
              name: "A/V-8B Harrier II",
              description: "Ground-attack aircraft capable of vertical or short takeoff and landing (V/STOL)",
              disposition: "friendly",
              type: "aircraft",
              speed: 800,
            },
          });
        }
        jetBot3Index++;
      }
  
      if (drone1Index === aircraftBots.drone1.coordinates.length) {
        drone1Index = 0;
      }
      if (drone1Index < aircraftBots.drone1.coordinates.length) {
        const newCoordinates = aircraftBots.drone1.coordinates[drone1Index];
        if (newCoordinates) {
          entities.push({
            id: "d6",
            coordinates: newCoordinates,
            bearing: 0,
            data: {
              name: "Drone",
              description: "Drone with surveillance capabilities",
              disposition: commandCenterIds[roomCode]?.dispositions?.d6 || "unknown",
              type: "drone",
              canChangeDisposition: true,
            },
          });
        }
        drone1Index++;
      }

      if (drone2Index === aircraftBots.drone2.coordinates.length) {
        drone2Index = 0;
      }
      if (drone2Index < aircraftBots.drone2.coordinates.length) {
        const newCoordinates = aircraftBots.drone2.coordinates[drone2Index];
        if (newCoordinates) {
          entities.push({
            id: "d7",
            coordinates: newCoordinates,
            bearing: 0,
            data: {
              name: "Drone",
              description: "Drone with surveillance capabilities",
              disposition: commandCenterIds[roomCode]?.dispositions?.d7 || "unknown",
              type: "drone",
              canChangeDisposition: true,
            },
          });
        }
        drone2Index++;
      }
      if (drone3Index === aircraftBots.drone3.coordinates.length) {
        drone3Index = 0;
      }
      if (drone3Index < aircraftBots.drone3.coordinates.length) {
        const newCoordinates = aircraftBots.drone3.coordinates[drone3Index];
        if (newCoordinates) {
          entities.push({
            id: "d8",
            coordinates: newCoordinates,
            bearing: 0,
            data: {
              name: "Bolt",
              description: "Rapid response capability with real-time situational awareness",
              disposition: "friendly",
              type: "drone",
              linkedTo: ["g2"],
            },
          });
        }
        drone3Index++;
      }

      commandCenterIds[roomCode].entities = entities;
    } catch (error) {
      clearInterval(intervalId);
    }
  }, 100);

  res.send(JSON.stringify({ roomCode }));
});

app.post('/api/update-disposition', (req, res) => {
  const { room, id, disposition } = req.body;

  if (!room || !id || !disposition) {
    res.status(400).send('Room, ID, and disposition are required');
    return;
  }

  if (!commandCenterIds[room]) {
    res.status(404).send('Room not found');
    return;
  }

  if (!["friendly", "hostile", "neutral"].includes(disposition)) {
    res.status(400).send('Invalid disposition value');
    return;
  }

  if (!commandCenterIds[room].dispositions[id]) {
    res.status(404).send('Entity not found in room');
    return;
  }
  
  commandCenterIds[room].dispositions[id] = disposition;

  res.status(200).send('Disposition updated successfully');
});

app.use((req, res) => {
  res.status(404).send('Not Found');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
