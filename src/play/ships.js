export const shipTypes = [
  { id: "destroyer", name: "Destroyer", size: 2 },
  { id: "submarine", name: "Submarine", size: 3 },
  { id: "cruiser", name: "Cruiser", size: 3 },
  { id: "battleship", name: "Battleship", size: 4 },
  { id: "carrier", name: "Aircraft Carrier", size: 5 },
];

export function createShips() {
  return shipTypes.map((ship) => ({
    ...ship,
    hits: 0,
  }));
}

export function takeHit(ship) {
  if (ship.health <= 0) return ship;

  return {
    ...ship,
    health: ship.health - 1,
  };
}

export function isSunk(ship) {
  return ship.health <= 0;
}