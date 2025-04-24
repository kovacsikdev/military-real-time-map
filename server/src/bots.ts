import * as turf from '@turf/turf';

const INITIAL_CENTER: [number, number] = [-121.519146, 48.443526];
const COORD_STREAM_RATE = 0.1;

/**
 * Bearings:
 * 0 = North
 * 90 = East
 * 180 = South
 * -90 = West
 * -180 = South
 * 
 * Coordinates fill with empty seconds
 * 1 second = 10
 * 2 seconds = 20
 */

type CoordinatesType = [number, number][][];
type CoordinatesResultType = [number, number][];

/**
 * Jet bot function to generate coordinates between start and end points.
 * @param start [number, number]
 * @param end [number, number]
 * @param speed number
 * @param streamRate number
 * @returns Array of coordinates
 */
const aircraftBot = (coordinates: CoordinatesType, speed: number, streamRate: number, initialSleepSeconds: number) => {
  // Determine how many coordinates to generate based on the speed and stream rate
  const milesPerMinute = speed / 60;
  const milesPerSecond = milesPerMinute / 60;
  const milesPerStreamRate = milesPerSecond * streamRate; // Distance covered in {streamRate} seconds

  let allCoordinates: CoordinatesResultType = [];
  if (initialSleepSeconds > 0) {
    // Fill with empty coordinates for the initial sleep time
    allCoordinates = new Array(initialSleepSeconds * 10).fill(null);
  }

  for (let i = 0; i < coordinates.length; i++) {
    const coordinate = coordinates[i];
    const start = coordinate[0];
    const end = coordinate[1];

    const distance = turf.distance(start, end, { units: 'miles' });

    // Determine the number of coordinates to generate {streamRate} per second going {speed} miles per hour
    const totalSteps = distance / milesPerStreamRate;

    let startPoint = turf.point(start);
    const bearing = turf.bearing(start, end);
    for (let i = 0; i < totalSteps; i++) {
      const destination = turf.destination(startPoint, milesPerStreamRate, bearing, { units: 'miles' });
      allCoordinates.push([destination.geometry.coordinates[0], destination.geometry.coordinates[1]]);
      startPoint = destination;
    }
  }

  return allCoordinates;
}

// Initialize jet1 coordinates
const jetBot1Start = turf.destination(INITIAL_CENTER, 30, 32, { units: 'miles' }).geometry.coordinates as [number, number];
const jetBot1End = turf.destination(INITIAL_CENTER, 30, -122, { units: 'miles' }).geometry.coordinates as [number, number];
const jetBot1Results = aircraftBot([[jetBot1Start, jetBot1End]], 800, COORD_STREAM_RATE, 2);
const jetBot1Bearing = turf.bearing(jetBot1Start, jetBot1End);

// Initialize jet2 coordinates
const jetBot2Start = turf.destination(INITIAL_CENTER, 30, 52, { units: 'miles' }).geometry.coordinates as [number, number];
const jetBot2End = turf.destination(INITIAL_CENTER, 30, -142, { units: 'miles' }).geometry.coordinates as [number, number];
const jetBot2Results = aircraftBot([[jetBot2Start, jetBot2End]], 800, COORD_STREAM_RATE, 3);
const jetBot2Bearing = turf.bearing(jetBot2Start, jetBot2End);

// Initialize jet3 coordinates
const jetBot3Start = turf.destination(INITIAL_CENTER, 30, 175, { units: 'miles' }).geometry.coordinates as [number, number];
const jetBot3End = turf.destination(INITIAL_CENTER, 30, -90, { units: 'miles' }).geometry.coordinates as [number, number];
const jetBot3Results = aircraftBot([[jetBot3Start, jetBot3End]], 800, COORD_STREAM_RATE, 5);
const jetBot3Bearing = turf.bearing(jetBot3Start, jetBot3End);

// Initialize drone1 coordinates
const drone1Start1 = turf.destination(INITIAL_CENTER, 5, -45, { units: 'miles' }).geometry.coordinates as [number, number];
const drone1End1 = turf.destination(INITIAL_CENTER, 3, -45, { units: 'miles' }).geometry.coordinates as [number, number];
const drone1Start2 = turf.destination(INITIAL_CENTER, 3, -45, { units: 'miles' }).geometry.coordinates as [number, number];
const drone1End2 = turf.destination(INITIAL_CENTER, 4, -90, { units: 'miles' }).geometry.coordinates as [number, number];
const drone1Start3 = turf.destination(INITIAL_CENTER, 4, -90, { units: 'miles' }).geometry.coordinates as [number, number];
const drone1End3 = turf.destination(INITIAL_CENTER, 5, -45, { units: 'miles' }).geometry.coordinates as [number, number];
const drone1Results = aircraftBot([[drone1Start1, drone1End1], [drone1Start2, drone1End2], [drone1Start3, drone1End3]], 80, COORD_STREAM_RATE, 0);

// Initialize drone2 coordinates
const drone2Start1 = turf.destination(INITIAL_CENTER, 24, -80, { units: 'miles' }).geometry.coordinates as [number, number];
const drone2End1 = turf.destination(INITIAL_CENTER, 22, -80, { units: 'miles' }).geometry.coordinates as [number, number];
const drone2Start2 = turf.destination(INITIAL_CENTER, 22, -80, { units: 'miles' }).geometry.coordinates as [number, number];
const drone2End2 = turf.destination(INITIAL_CENTER, 23, -90, { units: 'miles' }).geometry.coordinates as [number, number];
const drone2Start3 = turf.destination(INITIAL_CENTER, 23, -90, { units: 'miles' }).geometry.coordinates as [number, number];
const drone2End3 = turf.destination(INITIAL_CENTER, 24, -80, { units: 'miles' }).geometry.coordinates as [number, number];
const drone2Results = aircraftBot([[drone2Start1, drone2End1], [drone2Start2, drone2End2], [drone2Start3, drone2End3]], 80, COORD_STREAM_RATE, 0);

// Initialize drone3 coordinates
const drone3Start1 = turf.destination(INITIAL_CENTER, 5, -125, { units: 'miles' }).geometry.coordinates as [number, number];
const drone3End1 = turf.destination(INITIAL_CENTER, 10, -125, { units: 'miles' }).geometry.coordinates as [number, number];
const drone3Start2 = turf.destination(INITIAL_CENTER, 10, -125, { units: 'miles' }).geometry.coordinates as [number, number];
const drone3End2 = turf.destination(INITIAL_CENTER, 10, -90, { units: 'miles' }).geometry.coordinates as [number, number];
const drone3Start3 = turf.destination(INITIAL_CENTER, 10, -90, { units: 'miles' }).geometry.coordinates as [number, number];
const drone3End3 = turf.destination(INITIAL_CENTER, 5, -125, { units: 'miles' }).geometry.coordinates as [number, number];
const drone3Results = aircraftBot([[drone3Start1, drone3End1], [drone3Start2, drone3End2], [drone3Start3, drone3End3]], 80, COORD_STREAM_RATE, 0);

export const aircraftBots = {
  jetBot1: {
    coordinates: jetBot1Results,
    bearing: jetBot1Bearing,
  },
  jetBot2: {
    coordinates: jetBot2Results,
    bearing: jetBot2Bearing,
  },
  jetBot3: {
    coordinates: jetBot3Results,
    bearing: jetBot3Bearing,
  },
  drone1: {
    coordinates: drone1Results,
  },
  drone2: {
    coordinates: drone2Results,
  },
  drone3: {
    coordinates: drone3Results,
  }
}