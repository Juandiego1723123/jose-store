# jose-store

Tienda web de suscripciones digitales: Netflix, Disney+, HBO Max, Spotify, Prime Video, Crunchyroll, Paramount+, Vix, YouTube Premium y Canva Pro.

**Sitio en vivo:** https://jose-store.vercel.app

## Como esta armado

- `Jose Store.dc.html` — la fuente: diseno + datos (precios, combos, textos), editado con Claude Design.
- `build.js` — convierte el `.dc.html` en un sitio estatico (sin frameworks) y genera `jose-store/index.html`.
- `jose-store/` — lo que se publica: `index.html` + imagenes optimizadas (`.webp`) + `vercel.json`.
- `img/` — imagenes originales en alta resolucion, usadas por `scripts/optimizar-imagenes.js` para generar los .webp.
- `deploy.ps1` — genera el sitio y lo publica en Vercel en un solo paso.

## Stack

- HTML / CSS / JavaScript estatico, sin backend ni framework
- Imagenes optimizadas a WebP con sharp
- Despliegue en Vercel

## Publicar un cambio

```powershell
pwsh ./deploy.ps1
```

Genera `jose-store/index.html` a partir del diseno y lo publica en produccion.
