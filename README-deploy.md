# Jose Store — sitio web

**En vivo:** https://jose-store.vercel.app
**Cuenta Vercel:** `josestore1723-8403` (plan Hobby, gratis) — proyecto `jose-store`

## Cómo está armado

| Archivo / carpeta | Qué es |
|---|---|
| `Jose Store.dc.html` | **La fuente.** Diseño + datos (precios, combos, textos). Se edita en Claude Design. |
| `build.js` | Convierte el `.dc.html` en un sitio estático (sin React) → escribe `jose-store/index.html`. |
| `jose-store/` | **Lo que se publica.** `index.html` + `img/*.webp` + `vercel.json`. |
| `img/` | Imágenes originales (PNG grandes). Solo las usa `scripts/optimizar-imagenes.js`. |
| `deploy.ps1` | Genera + publica en un paso. |
| `.vercel-token` | Token de Vercel (NO se sube a ningún lado). Si se pierde, se genera otro. |
| `support.js`, `image-slot.js`, `scraps/`, `uploads/` | Solo para editar el `.dc.html` en Claude Design. No se publican. |

## Publicar un cambio

1. Editar el contenido en `Jose Store.dc.html` (o pedirle el cambio a Claude).
2. Vista previa local: Live Server → `http://127.0.0.1:5500/jose-store/`
3. Publicar:
   ```powershell
   pwsh ./deploy.ps1
   ```
   Toma ~15 s. El link no cambia: https://jose-store.vercel.app

## Si cambian las imágenes de marca

```powershell
npm i sharp          # una sola vez
node scripts/optimizar-imagenes.js
pwsh ./deploy.ps1
```

## Token de Vercel

- Vive en `.vercel-token` (texto plano, solo en esta PC).
- Da acceso total a la cuenta `josestore1723-8403`. Si se filtra, revocalo en
  https://vercel.com/account/settings/tokens y generá otro.
- No afecta la cuenta `ednajuan96` — son cuentas separadas.
