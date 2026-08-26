export interface PlacedNote {
  earnedPoints: number;
  redeemedPoints: number;
}

const key = (orderId: string) => `placed:${orderId}`;

export function savePlacedNote(orderId: string, note: PlacedNote): void {
  sessionStorage.setItem(key(orderId), JSON.stringify(note));
}

export function takePlacedNote(orderId: string): PlacedNote | null {
  const raw = sessionStorage.getItem(key(orderId));
  if (!raw) return null;
  sessionStorage.removeItem(key(orderId));
  return JSON.parse(raw) as PlacedNote;
}
