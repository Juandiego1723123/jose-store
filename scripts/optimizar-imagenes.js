/* Convierte img/b-*.png  ->  jose-store/img/b-*.webp  (redimensionadas + comprimidas)
 *
 * Solo hace falta correr esto si cambiaste alguna imagen de marca en img/.
 * Requiere sharp:   npm i sharp        (una sola vez, en esta carpeta)
 * Uso:              node scripts/optimizar-imagenes.js
 */
const fs = require("fs");
const path = require("path");
let sharp;
try {
  sharp = require("sharp");
} catch (e) {
  console.error("Falta 'sharp'. Instalalo con:  npm i sharp");
  process.exit(1);
}

const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "img");
const DEST = path.join(ROOT, "jose-store", "img");

const BRANDS = ["b-paramount", "b-disney", "b-hbomax", "b-netflix", "b-primevideo", "b-spotify", "b-youtube", "b-crunchyroll", "b-vix", "b-canvapro"];

(async () => {
  fs.mkdirSync(DEST, { recursive: true });
  let total = 0;
  for (const n of BRANDS) {
    const src = path.join(SRC, n + ".png");
    if (!fs.existsSync(src)) { console.error("no existe", src); continue; }
    const out = path.join(DEST, n + ".webp");
    await sharp(src).resize({ width: 520, withoutEnlargement: true }).webp({ quality: 80 }).toFile(out);
    const kb = fs.statSync(out).size / 1024;
    total += kb;
    console.log(n.padEnd(14), kb.toFixed(1).padStart(6) + " KB");
  }
  console.log("\nTotal:", total.toFixed(0) + " KB");
})();
