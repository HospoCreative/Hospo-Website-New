import type { SocialFeedMetrics } from "@/types/digitalScan";

const SAMPLE_SIZE = 360;
const GRID_SIZE = 3;

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function standardDeviation(values: number[]) {
  if (!values.length) return 0;
  const average = values.reduce((total, value) => total + value, 0) / values.length;
  return Math.sqrt(values.reduce((total, value) => total + (value - average) ** 2, 0) / values.length);
}

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("The feed screenshot could not be read."));
    };
    image.src = url;
  });
}

type TileSignal = {
  red: number;
  green: number;
  blue: number;
  luminance: number;
  saturation: number;
  contrast: number;
  signature: number[];
};

function tileSignal(data: Uint8ClampedArray, width: number, xStart: number, yStart: number, size: number): TileSignal {
  let red = 0;
  let green = 0;
  let blue = 0;
  let saturation = 0;
  const luminances: number[] = [];
  const signature = Array.from({ length: 16 }, () => ({ total: 0, count: 0 }));
  let count = 0;

  for (let y = yStart; y < yStart + size; y += 4) {
    for (let x = xStart; x < xStart + size; x += 4) {
      const index = (y * width + x) * 4;
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      const localX = Math.min(3, Math.floor(((x - xStart) / size) * 4));
      const localY = Math.min(3, Math.floor(((y - yStart) / size) * 4));
      const bucket = signature[localY * 4 + localX];

      red += r;
      green += g;
      blue += b;
      saturation += max === 0 ? 0 : ((max - min) / max) * 100;
      luminances.push(luminance);
      bucket.total += luminance;
      bucket.count += 1;
      count += 1;
    }
  }

  return {
    red: red / count,
    green: green / count,
    blue: blue / count,
    luminance: luminances.reduce((total, value) => total + value, 0) / luminances.length,
    saturation: saturation / count,
    contrast: standardDeviation(luminances),
    signature: signature.map((bucket) => bucket.count ? bucket.total / bucket.count : 0)
  };
}

function signatureDistance(left: number[], right: number[]) {
  return left.reduce((total, value, index) => total + Math.abs(value - right[index]), 0) / left.length;
}

export async function analyseSocialFeedScreenshot(file: File): Promise<SocialFeedMetrics> {
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file.");
  if (file.size > 10 * 1024 * 1024) throw new Error("Please choose an image smaller than 10 MB.");

  const image = await loadImage(file);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("This browser could not analyse the screenshot.");

  canvas.width = SAMPLE_SIZE;
  canvas.height = SAMPLE_SIZE;
  const sourceSize = Math.min(image.naturalWidth, image.naturalHeight);
  const sourceX = (image.naturalWidth - sourceSize) / 2;
  const sourceY = (image.naturalHeight - sourceSize) / 2;
  context.drawImage(image, sourceX, sourceY, sourceSize, sourceSize, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE);

  const pixels = context.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE).data;
  const tileSize = SAMPLE_SIZE / GRID_SIZE;
  const tiles: TileSignal[] = [];
  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let column = 0; column < GRID_SIZE; column += 1) {
      tiles.push(tileSignal(pixels, SAMPLE_SIZE, column * tileSize, row * tileSize, tileSize));
    }
  }

  const colourSpread = (
    standardDeviation(tiles.map((tile) => tile.red)) +
    standardDeviation(tiles.map((tile) => tile.green)) +
    standardDeviation(tiles.map((tile) => tile.blue))
  ) / 3;
  const saturationSpread = standardDeviation(tiles.map((tile) => tile.saturation));
  const colourCohesion = clamp(100 - colourSpread * 1.05 - saturationSpread * 0.55);
  const exposureBalance = clamp(tiles.reduce((total, tile) => total + Math.max(0, 100 - Math.abs(tile.luminance - 132) * 0.9), 0) / tiles.length);
  const contrastBalance = clamp(tiles.reduce((total, tile) => total + Math.max(0, 100 - Math.abs(tile.contrast - 52) * 1.65), 0) / tiles.length);
  const imageQuality = clamp((Math.min(image.naturalWidth, 1440) / 1440) * 100);

  let similarPairs = 0;
  let pairCount = 0;
  for (let left = 0; left < tiles.length; left += 1) {
    for (let right = left + 1; right < tiles.length; right += 1) {
      if (signatureDistance(tiles[left].signature, tiles[right].signature) < 7) similarPairs += 1;
      pairCount += 1;
    }
  }

  return {
    source: "screenshot",
    width: image.naturalWidth,
    height: image.naturalHeight,
    tileCount: tiles.length,
    colourCohesion,
    exposureBalance,
    contrastBalance,
    imageQuality,
    repetitionRisk: clamp(pairCount ? (similarPairs / pairCount) * 100 : 0)
  };
}
