/**
 * Section 2 — photo collage.
 */

import { CONFIG } from "./config.js";
import { assetUrl, qs } from "./utils.js";

export function initCollage() {
  const root = qs("[data-collage]");
  if (!root) return;

  const fragment = document.createDocumentFragment();

  CONFIG.collage.images.forEach((item) => {
    const cell = document.createElement("figure");
    cell.className = `collage__item collage__item--${item.aspect}`;

    const img = document.createElement("img");
    img.src = assetUrl(item.src);
    img.alt = item.alt;
    img.loading = "lazy";
    img.decoding = "async";

    cell.appendChild(img);
    fragment.appendChild(cell);
  });

  root.appendChild(fragment);
}
