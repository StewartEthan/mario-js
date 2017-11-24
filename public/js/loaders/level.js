import Level from '../Level.js';
import { Matrix } from '../math.js'
import { createBackgroundLayer, createSpriteLayer } from '../layers.js';
import { loadJson, loadSpriteSheet } from '../loaders.js';

export function loadLevel(name) {
  return loadJson(`./levels/${name}.json`)
    .then(levelSpec => Promise.all([ levelSpec, loadSpriteSheet(levelSpec.spriteSheet) ]))
    .then(([levelSpec, bkgdSprites]) => {
      const level = new Level();

      const mergedTiles = levelSpec.layers.reduce((merged, layerSpec) => {
        return merged.concat(layerSpec.tiles);
      }, []);

      const collisionGrid = createCollisionGrid(mergedTiles, levelSpec.patterns);
      level.setCollisionGrid(collisionGrid);

      levelSpec.layers.forEach(layer => {
        const bkgdGrid = createBkgdGrid(layer.tiles, levelSpec.patterns);
        const bkgdLayer = createBackgroundLayer(level, bkgdGrid, bkgdSprites);
        level.comp.layers.push(bkgdLayer);
      });

      const spriteLayer = createSpriteLayer(level.entities);
      level.comp.layers.push(spriteLayer);

      return level;
    });
}

function createBkgdGrid(tiles, patterns) {
  const grid = new Matrix();

  for (const { tile, x,y } of expandTiles(tiles, patterns)) {
    grid.set(x, y, { name: tile.name });
  }
  
  return grid;
}

function createCollisionGrid(tiles, patterns) {
  const grid = new Matrix();

  for (const { tile, x,y } of expandTiles(tiles, patterns)) {
    grid.set(x, y, { type: tile.type });
  }
  
  return grid;
}

function* expandSpan(xStart,xLen, yStart,yLen) {
  const xEnd = xStart + xLen;
  const yEnd = yStart + yLen;
  for (let x = xStart; x < xEnd; ++x) {
    for (let y = yStart; y < yEnd; ++y) {
      yield { x,y };
    }
  }
}

function expandRange(range) {
  if (range.length === 4) {
    const [ xStart,xLen, yStart,yLen ] = range;
    return expandSpan(xStart,xLen, yStart,yLen);
  } else if (range.length === 3) {
    const [ xStart, xLen, yStart ] = range;
    return expandSpan(xStart,xLen, yStart,1);
  } else if (range.length === 2) {
    const [ xStart, yStart ] = range;
    return expandSpan(xStart,1, yStart,1);
  }
}

function* expandRanges(ranges) {
  for (const range of ranges) {
    for (const item of expandRange(range)) {
      yield item;
    }
  }
}

function expandTiles(tiles, patterns) {
  const expandedTiles = [];

  function walkTiles(tiles, offX, offY) {
    for (const tile of tiles) {
      for (const { x,y } of expandRanges(tile.ranges)) {
        const derivedX = x + offX;
        const derivedY = y + offY;

        if (tile.pattern) {
          const tiles = patterns[tile.pattern].tiles;
          walkTiles(tiles, derivedX, derivedY);
        } else {
          expandedTiles.push({
            tile,
            x: derivedX,
            y: derivedY
          });
        }
      }
    }
  }

  walkTiles(tiles, 0, 0);
  return expandedTiles;
}