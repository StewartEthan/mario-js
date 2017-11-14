export default class TileResolver {
  constructor(matrix, tileSize = 16) {
    this.matrix = matrix;
    this.tileSize = tileSize;
  }

  toIndex(pos) {
    return Math.floor(pos / this.tileSize);
  }

  getByIndex(x, y) {
    const tile = this.matrix.get(x, y);
    if (tile) {
      const y1 = y * this.tileSize;
      return {
        tile,
        y1
      };
    }
  }

  matchByPosition(x, y) {
    return this.getByIndex(this.toIndex(x), this.toIndex(y));
  }
}