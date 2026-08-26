export const POINTS_PER_DOLLAR = 1000;

export function maxRedeemablePoints(
  balance: number,
  totalCents: number,
): number {
  return Math.min(balance, totalCents * 10);
}

export function pointsDiscountCents(points: number): number {
  return Math.floor(points / 10);
}

export function earnedPoints(paidCents: number): number {
  return Math.floor(paidCents / 100);
}

export function pointsValue(points: number): number {
  return pointsDiscountCents(points) / 100;
}
