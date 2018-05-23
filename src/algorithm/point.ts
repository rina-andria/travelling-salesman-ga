export class Point {
  constructor(public x: number, public y: number) {}

  distance(point: Point): number {
    return Math.sqrt(
      Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2)
    );
  }
}
