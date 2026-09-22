/* Genera un index.html estático (sin React/CDN) a partir de "Jose Store.dc.html" */
const fs = require("fs");
const path = require("path");

const ROOT = "c:/Users/ednaj/Downloads/StreamShop";
const src = fs.readFileSync(path.join(ROOT, "Jose Store.dc.html"), "utf8");

/* ---- extraer y ejecutar la lógica del .dc.html para reutilizar sus datos ---- */
const m = src.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/);
const js = m[1];
const Base = function () { this.state = {}; };
Base.prototype.setState = function (u) { Object.assign(this.state, typeof u === "function" ? u(this.state) : u); };
const C = new Function("DCLogic", "StreamableLogic", "React", js + "\n;return Component;")(Base, Base, {});
const inst = Object.create(C.prototype);
inst.state = { carrito: [], nombre: "", abierto: false };
inst.setState = Base.prototype.setState;
const V = inst.renderVals();

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const attr = (s) => esc(s);

/* ---------- CSS ---------- */
const CSS = `
  *{box-sizing:border-box}
  body{margin:0;background:#efece7;color:#12100f;font-family:"Plus Jakarta Sans",system-ui,-apple-system,Segoe UI,Roboto,sans-serif;-webkit-font-smoothing:antialiased}
  a{color:#12100f;text-decoration:none}
  a:hover{color:#1d5fd8}
  ::selection{background:#1d5fd8;color:#fff}
  html{scroll-behavior:smooth}
  img{max-width:100%}
  /* Fondo de color = UN solo div con radial-gradients (sin filter:blur, sin
     animación, sin capas apiladas). Se pinta una vez y no cuesta nada al scrollear. */
  .bg-aurora{position:fixed;inset:0;z-index:0;pointer-events:none;
    background:
      radial-gradient(62vw 48vw at 4% -10%, rgba(229,9,20,0.42), transparent 62%),
      radial-gradient(58vw 46vw at 104% -6%, rgba(29,95,216,0.38), transparent 58%),
      radial-gradient(54vw 54vw at 14% 40%, rgba(240,135,31,0.28), transparent 56%),
      radial-gradient(56vw 46vw at 98% 76%, rgba(29,95,216,0.26), transparent 55%),
      radial-gradient(50vw 50vw at 50% 108%, rgba(217,48,142,0.18), transparent 60%);}
  @keyframes jsMarquee { from { transform: translate3d(0,0,0) } to { transform: translate3d(-50%,0,0) } }
  .marquee-track{will-change:transform}
  @media (prefers-reduced-motion: reduce){ .marquee-track{animation:none!important} html{scroll-behavior:auto} }

  .nav-link{transition:color .18s ease}
  .nav-link:hover{color:#1d5fd8}
  .btn-solid{transition:opacity .2s ease}
  .btn-solid:hover{opacity:.88;color:#fff}
  .link-arrow{transition:color .18s ease}
  .link-arrow:hover{color:#1d5fd8}
  .card-lift{transition:border-color .2s ease,transform .2s ease,box-shadow .2s ease}
  .card-lift:hover{border-color:#12100f;transform:translateY(-3px);box-shadow:0 26px 50px -34px rgba(18,16,15,0.45)}
  .card-lift-sm{transition:border-color .2s ease,transform .2s ease}
  .card-lift-sm:hover{border-color:#12100f;transform:translateY(-3px)}
  .chip-hover{transition:border-color .18s ease,color .18s ease}
  .chip-hover:hover{border-color:#1d5fd8;color:#1d5fd8}
  .plus-btn{transition:background .18s ease,color .18s ease}
  .plus-btn:hover{background:#1d5fd8;color:#fff}
  .cart-btn{transition:border-color .2s ease}
  .cart-btn:hover{border-color:#12100f}
  .wa-float{transition:transform .2s ease}
  .wa-float:hover{transform:translateY(-3px);color:#fff}
  .ghost-btn{transition:background .2s ease}
  .ghost-btn:hover{background:rgba(255,255,255,0.1);color:#fff}
  .qty-btn{transition:background .15s ease,color .15s ease}
  .qty-btn:hover{background:#12100f;color:#fff}
  .close-btn{transition:background .15s ease,color .15s ease}
  .close-btn:hover{background:#12100f;color:#fff}
  .remove-btn:hover{color:#1d5fd8}
  .link-soft{transition:color .18s ease}
  .link-soft:hover{color:#1d5fd8}
  .marquee:hover .marquee-track{animation-play-state:paused}

  html.js .reveal{opacity:0;transform:translateY(22px)}
  .reveal.in{opacity:1!important;transform:none!important;transition:opacity .6s cubic-bezier(.22,.61,.36,1),transform .6s cubic-bezier(.22,.61,.36,1)}
  @media (prefers-reduced-motion:reduce){ html.js .reveal{opacity:1;transform:none} }

  .overlay{position:fixed;inset:0;background:rgba(10,10,10,0.4);z-index:70;opacity:0;pointer-events:none;transition:opacity .25s ease}
  .overlay.open{opacity:1;pointer-events:auto}
  .panel{position:fixed;top:0;right:0;bottom:0;width:min(380px,100%);background:#fff;border-left:1px solid #e6e4e0;display:flex;flex-direction:column;z-index:80;transform:translateX(100%);transition:transform .3s cubic-bezier(.4,0,.2,1);box-shadow:-24px 0 60px -30px rgba(10,10,10,0.4)}
  .panel.open{transform:translateX(0)}
`;

/* ---------- helpers de markup ---------- */
const chip = (t) => `<span style="font-size:11px;font-weight:500;color:#6b6762;background:#f4f1ec;border-radius:7px;padding:4px 8px">${esc(t)}</span>`;
const chipFam = (t) => `<span style="font-size:11.5px;font-weight:500;color:#6b6762;background:#f4f1ec;border-radius:8px;padding:5px 10px">${esc(t)}</span>`;
const chipUni = (t) => `<span style="font-size:12px;font-weight:500;color:#fff;background:rgba(255,255,255,0.12);border-radius:8px;padding:5px 10px">${esc(t)}</span>`;

const addBtn = (item, cls, style, label) =>
  `<button type="button" class="js-add ${cls}" data-id="${attr(item.id)}" data-nombre="${attr(item.nombre)}" data-detalle="${attr(item.detalle)}" data-precio="${item.precio}" data-ahorro="${item.ahorro || 0}" style="${style}">${label}</button>`;

/* ---------- HERO ---------- */
const enlaceConsulta = V.enlaceConsulta;
const enlaceVip = V.enlaceVip;

const hero = `
    <section id="inicio" style="position:relative;background:linear-gradient(150deg,rgba(255,255,255,0.62),rgba(250,248,245,0.74) 46%,rgba(250,248,245,0.8) 100%);backdrop-filter:blur(22px) saturate(1.15);border-radius:34px;padding:clamp(22px,3vw,42px);overflow:hidden">
      <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:14px 28px">
        <a href="#inicio" style="font-size:22px;font-weight:800;letter-spacing:-0.04em">Jose<span style="color:#1d5fd8">.</span>store</a>
        <nav style="display:flex;flex-wrap:wrap;align-items:center;gap:10px 26px;font-size:14px;font-weight:500;flex:1 1 auto;margin-left:clamp(0px,3vw,44px)">
          <a href="#combos" class="nav-link" style="color:#3b3936">Combos</a>
          <a href="#catalogo" class="nav-link" style="color:#3b3936">Catálogo</a>
          <a href="#bajo-pedido" class="nav-link" style="color:#3b3936">Bajo pedido</a>
          <a href="#garantia" class="nav-link" style="color:#3b3936">Garantía</a>
          <a href="#vip" class="nav-link" style="color:#3b3936">VIP</a>
        </nav>
        <button type="button" id="open-cart" class="cart-btn" style="display:inline-flex;align-items:center;gap:9px;background:#fff;border:1px solid #e3ded7;color:#12100f;border-radius:999px;padding:9px 9px 9px 20px;font:inherit;font-size:13.5px;font-weight:600;cursor:pointer">
          Carrito
          <span id="cart-count" style="width:24px;height:24px;display:inline-flex;align-items:center;justify-content:center;border-radius:999px;background:#1d5fd8;color:#fff;font-size:11.5px;font-weight:700">0</span>
        </button>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(330px,1fr));gap:clamp(26px,4vw,54px);align-items:center;padding-top:clamp(40px,6vw,86px)">
        <div style="min-width:0">
          <h1 style="font-size:clamp(42px,6.4vw,84px);font-weight:800;letter-spacing:-0.055em;line-height:0.98;margin:0">Ve más,<br />paga menos</h1>
          <p style="font-size:15px;line-height:1.7;color:#6b6762;margin:26px 0 0;max-width:44ch;text-wrap:pretty">Jose Store reúne tus plataformas favoritas en un solo pedido, con precios especiales, activación rápida y garantía de 24 horas.</p>
          <div style="display:flex;flex-wrap:wrap;align-items:center;gap:22px;margin-top:34px">
            <a href="#combos" class="btn-solid" style="display:inline-flex;align-items:center;justify-content:center;background:#1d5fd8;color:#fff;border-radius:999px;padding:15px 30px;font-size:14px;font-weight:600">Ver combos</a>
            <a href="${attr(enlaceConsulta)}" target="_blank" rel="noopener" class="link-arrow" style="display:inline-flex;align-items:center;gap:11px;font-size:14px;font-weight:600">
              <span style="width:30px;height:30px;display:inline-flex;align-items:center;justify-content:center;border-radius:8px;background:#12100f;color:#fff;font-size:12px">▶</span>
              Escríbenos
            </a>
          </div>
          <p style="font-size:22px;color:#b4afa8;margin:clamp(40px,6vw,84px) 0 0">↓</p>
        </div>

        <div style="position:relative;min-width:0;display:flex;align-items:center;justify-content:center;min-height:clamp(420px,46vw,600px);perspective:1400px">
          <div aria-hidden="true" style="position:absolute;width:78%;aspect-ratio:1/1;border-radius:50% 50% 46% 46%;background:radial-gradient(circle at 50% 42%,rgba(255,255,255,0.75),rgba(238,235,231,0.32) 62%,rgba(238,235,231,0) 74%)"></div>
          <div style="position:relative;width:min(100%,600px);aspect-ratio:1/0.98;transform-style:preserve-3d">
            <div role="img" aria-label="Paramount+" style="position:absolute;left:0%;top:7%;width:30%;aspect-ratio:3/2;border-radius:20px;background-image:url('img/b-paramount.png');background-size:cover;background-position:center;transform:rotateY(19deg) rotateZ(-7deg) rotateX(6deg);box-shadow:0 24px 60px -18px rgba(29,95,216,0.65),0 0 42px -6px rgba(41,109,255,0.5),inset 0 1px 0 rgba(255,255,255,0.4)"></div>
            <div role="img" aria-label="Disney+" style="position:absolute;left:0%;top:52%;width:30%;aspect-ratio:3/2;border-radius:20px;background-image:url('img/b-disney.png');background-size:cover;background-position:center;transform:rotateY(17deg) rotateZ(6deg) rotateX(-4deg);box-shadow:0 26px 62px -18px rgba(16,42,110,0.7),0 0 40px -6px rgba(58,124,255,0.45),inset 0 1px 0 rgba(255,255,255,0.28)"></div>
            <div role="img" aria-label="HBO Max" style="position:absolute;right:0%;top:30%;width:30%;aspect-ratio:3/2;border-radius:20px;background-image:url('img/b-hbomax.png');background-size:cover;background-position:center;transform:rotateY(-19deg) rotateZ(4deg) rotateX(-3deg);box-shadow:0 26px 62px -18px rgba(84,20,160,0.7),0 0 42px -6px rgba(140,60,230,0.5),inset 0 1px 0 rgba(255,255,255,0.3)"></div>
            <div style="position:absolute;left:50%;top:50%;width:35%;aspect-ratio:1/2.05;transform:translate(-50%,-50%) rotateY(-13deg) rotateZ(2deg);border-radius:34px;padding:5px;background:linear-gradient(120deg,#8e9299 0%,#3d4147 26%,#c9ccd1 52%,#41454b 76%,#8b8f96 100%);box-shadow:0 50px 90px -34px rgba(18,16,15,0.62)">
              <div style="position:relative;width:100%;height:100%;border-radius:29px;overflow:hidden;background:radial-gradient(120% 80% at 50% 48%,#241014 0%,#120a0c 44%,#08070a 100%);display:flex;align-items:center;justify-content:center">
                <div style="position:absolute;top:3.2%;left:50%;transform:translateX(-50%);width:30%;height:3.4%;border-radius:999px;background:#000"></div>
                <p aria-label="Netflix" style="margin:0;font-family:Helvetica,Arial,sans-serif;font-weight:900;font-size:min(9.4vw,74px);line-height:0.8;color:#e50914;transform:scaleY(1.5);filter:drop-shadow(0 0 40px rgba(229,9,20,0.6))">N</p>
              </div>
            </div>
          </div>
          <div style="position:absolute;left:clamp(-6px,0.5vw,14px);bottom:clamp(-14px,-0.8vw,-6px);background:rgba(255,255,255,0.9);backdrop-filter:blur(12px);border-radius:999px;padding:11px 20px;display:flex;align-items:center;gap:11px;box-shadow:0 18px 40px -24px rgba(18,16,15,0.5)">
            <span style="width:8px;height:8px;border-radius:999px;background:#1db954;flex-shrink:0"></span>
            <p style="font-size:12.5px;margin:0;color:#3b3936">Activación en minutos, garantía de 24 horas.</p>
          </div>
          <div style="position:absolute;right:clamp(-8px,-0.5vw,2px);top:clamp(-6px,0.4vw,10px);background:rgba(255,255,255,0.92);backdrop-filter:blur(12px);border-radius:18px;padding:14px 18px;box-shadow:0 18px 40px -24px rgba(18,16,15,0.5)">
            <p style="font-size:26px;font-weight:800;letter-spacing:-0.04em;margin:0 0 2px">30%</p>
            <p style="font-size:11.5px;line-height:1.4;color:#7e7a74;margin:0;max-width:13ch">Ahorro máximo en combos</p>
          </div>
        </div>
      </div>
    </section>`;

/* ---------- HITOS ---------- */
const hitos = `
    <section style="background:rgba(250,248,245,0.72);backdrop-filter:blur(22px) saturate(1.2);border-radius:30px;padding:clamp(24px,3vw,40px);display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:clamp(20px,2.6vw,34px)">
      ${V.hitos.map((h) => `<div>
        <p style="font-size:12px;font-weight:700;letter-spacing:0.12em;color:#1d5fd8;margin:0 0 14px">${esc(h.n)}</p>
        <p style="font-size:16px;font-weight:700;letter-spacing:-0.025em;margin:0 0 7px">${esc(h.titulo)}</p>
        <p style="font-size:13px;line-height:1.6;color:#7e7a74;margin:0;text-wrap:pretty">${esc(h.desc)}</p>
      </div>`).join("\n      ")}
    </section>`;

/* ---------- COMBOS ---------- */
const comboCard = (c) => `<article class="reveal card-lift" style="display:flex;flex-direction:column;background:#fff;border:1px solid #ece7e0;border-radius:22px;padding:18px">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:4px">
            <span style="font-size:10.5px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#a8a29a">${esc(c.grupo)}</span>
            <span style="font-size:10.5px;font-weight:700;background:#eef3fd;color:#1d5fd8;border-radius:999px;padding:4px 8px;white-space:nowrap">-${c.pct}%</span>
          </div>
          <h4 style="font-size:17px;font-weight:700;letter-spacing:-0.035em;line-height:1.2;margin:0 0 10px">${esc(c.nombre)}</h4>
          <div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:14px;min-height:46px;align-content:flex-start">${c.chips.map(chip).join("")}</div>
          <div style="margin-top:auto">
            <div style="display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;margin-bottom:14px">
              <p style="font-size:28px;font-weight:800;letter-spacing:-0.055em;line-height:1;margin:0">${esc(c.precioTxt)}</p>
              <p style="font-size:12px;color:#b4afa8;text-decoration:line-through;margin:0">${esc(c.baseTxt)}</p>
            </div>
            ${addBtn({ id: c.id, nombre: c.nombre, detalle: c.chips.join(" + "), precio: c.precio, ahorro: c.ahorro }, "btn-solid", "width:100%;background:#1d5fd8;color:#fff;border:none;border-radius:999px;padding:11px;font:inherit;font-size:12.5px;font-weight:600;cursor:pointer", "Agregar · ahorras " + esc(c.ahorroTxt))}
          </div>
        </article>`;

const famCard = (c) => `<article class="card-lift-sm" style="display:flex;flex-direction:column;background:#fff;border:1px solid #ece7e0;border-radius:26px;padding:24px">
            <h4 style="font-size:19px;font-weight:700;letter-spacing:-0.035em;margin:0 0 16px">${esc(c.nombre)}</h4>
            <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:24px">${c.chips.map(chipFam).join("")}</div>
            <div style="margin-top:auto">
              <p style="font-size:13px;color:#b4afa8;text-decoration:line-through;margin:0 0 2px">${esc(c.baseTxt)}</p>
              <p style="font-size:36px;font-weight:800;letter-spacing:-0.055em;line-height:1;margin:0 0 8px">${esc(c.precioTxt)}</p>
              <p style="font-size:13px;font-weight:600;color:#1d5fd8;margin:0 0 20px">Ahorras ${esc(c.ahorroTxt)}</p>
              ${addBtn({ id: c.id, nombre: c.nombre, detalle: c.chips.join(" + "), precio: c.precio, ahorro: c.ahorro }, "btn-solid", "width:100%;background:#1d5fd8;color:#fff;border:none;border-radius:999px;padding:14px;font:inherit;font-size:13.5px;font-weight:600;cursor:pointer", "Agregar al carrito")}
            </div>
          </article>`;

const combos = `
    <section id="combos" style="background:rgba(250,248,245,0.72);backdrop-filter:blur(22px) saturate(1.2);border-radius:30px;padding:clamp(26px,3.2vw,46px)">
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:36px;align-items:end;margin-bottom:clamp(28px,3.4vw,46px)">
        <h2 style="font-size:clamp(32px,4.6vw,58px);font-weight:800;letter-spacing:-0.055em;line-height:1;margin:0">Combos que te<br />hacen ahorrar</h2>
        <p style="font-size:14.5px;line-height:1.7;color:#7e7a74;margin:0;max-width:42ch">Combina tus plataformas favoritas y disfruta de un mejor precio. El descuento es fijo según el número de plataformas del combo.</p>
      </div>

      <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;padding-bottom:16px;margin-bottom:18px;border-bottom:1px solid #e8e3dc">
        <span style="font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#8b867f;margin-right:6px">Escala de descuento</span>
        ${V.escala.map((e) => `<span style="display:inline-flex;align-items:baseline;gap:6px;background:#fff;border:1px solid #ece7e0;border-radius:999px;padding:5px 12px">
          <span style="font-size:12px;color:#8b867f">${esc(e.n)}</span>
          <span style="font-size:12.5px;font-weight:700;color:#1d5fd8">${esc(e.pct)}</span>
        </span>`).join("\n        ")}
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(226px,1fr));gap:12px;margin-bottom:34px">
        ${V.todosCombos.map(comboCard).join("\n        ")}
      </div>

      <div style="position:relative;background:#12100f;color:#fff;border-radius:30px;padding:clamp(28px,3.6vw,48px);display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:40px;align-items:center;margin-bottom:38px;overflow:hidden">
        <div aria-hidden="true" style="position:absolute;inset:0;pointer-events:none;background:radial-gradient(42% 60% at 88% -6%, rgba(240,135,31,0.42), transparent 60%),radial-gradient(40% 58% at 104% 20%, rgba(229,9,20,0.34), transparent 58%),radial-gradient(46% 64% at 82% 128%, rgba(29,95,216,0.30), transparent 60%),radial-gradient(40% 60% at -8% 120%, rgba(29,95,216,0.22), transparent 58%)"></div>
        <div style="position:relative">
          <p style="font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.6);margin:0 0 16px">El paquete completo</p>
          <h3 style="font-size:clamp(32px,4.2vw,52px);font-weight:800;letter-spacing:-0.055em;line-height:0.98;margin:0 0 16px">Combo<br />Universo</h3>
          <p style="font-size:14.5px;line-height:1.65;color:rgba(255,255,255,0.7);margin:0 0 22px;max-width:38ch">Siete plataformas activas al mismo tiempo. Es el ahorro más alto de toda la tienda.</p>
          <div style="display:flex;flex-wrap:wrap;gap:7px">${V.universoChips.map(chipUni).join("")}</div>
        </div>
        <div style="position:relative;background:#fff;color:#12100f;border-radius:24px;padding:32px">
          <p style="font-size:13px;color:#b4afa8;text-decoration:line-through;margin:0 0 4px">${esc(V.universoBase)}</p>
          <p style="font-size:clamp(44px,5.2vw,60px);font-weight:800;letter-spacing:-0.055em;line-height:1;margin:0 0 8px">${esc(V.universoPrecio)}</p>
          <p style="font-size:14px;font-weight:600;color:#1d5fd8;margin:0 0 26px">Ahorras ${esc(V.universoAhorro)} · 30%</p>
          ${addBtn({ id: "c-universo", nombre: "Combo Universo", detalle: "7 plataformas", precio: parseInt(V.universoPrecio.replace(/\D/g, ""), 10), ahorro: parseInt(V.universoAhorro.replace(/\D/g, ""), 10) }, "btn-solid", "width:100%;background:#1d5fd8;color:#fff;border:none;border-radius:999px;padding:16px;font:inherit;font-size:14px;font-weight:600;cursor:pointer", "Agregar al carrito")}
        </div>
      </div>

      <div>
        <div style="display:flex;align-items:baseline;justify-content:space-between;gap:16px;padding-bottom:12px;margin-bottom:18px;border-bottom:1px solid #e8e3dc">
          <h3 style="font-size:17px;font-weight:700;letter-spacing:-0.03em;margin:0">Planes para compartir</h3>
          <span style="font-size:12px;font-weight:600;color:#1d5fd8">Netflix 5 pantallas</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:14px">
          ${V.familiares.map(famCard).join("\n          ")}
        </div>
      </div>
    </section>`;

/* ---------- CATALOGO ---------- */
const brandCell = (mk) => {
  const media = mk.tieneImg
    ? `<div role="img" aria-label="${attr(mk.nombre)}" style="height:118px;background-image:url('${attr(mk.img)}');background-size:cover;background-repeat:no-repeat;background-position:center;background-color:#faf8f5"></div>`
    : `<div style="height:118px;background:#faf8f5;display:flex;align-items:center;justify-content:center"><span style="display:block;width:14px;height:14px;border-radius:999px;background:${attr(mk.color)}"></span></div>`;
  return `<div style="flex:0 0 auto;width:212px;background:#fff;border:1px solid #ece7e0;border-radius:22px;overflow:hidden">
              ${media}
              <div style="padding:15px 18px 17px;border-top:1px solid #f2ede6">
                <p style="font-size:14.5px;font-weight:700;letter-spacing:-0.025em;margin:0 0 3px">${esc(mk.nombre)}</p>
                <p style="font-size:12.5px;color:#8b867f;margin:0">${esc(mk.desde)}</p>
              </div>
            </div>`;
};
const brandRow = V.marcasHero.map(brandCell).join("\n            ");

const planRow = (pf, pl) => `<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:11px 0;border-top:1px solid #f2ede6">
                <div style="min-width:0">
                  <p style="font-size:13px;font-weight:500;margin:0 0 2px">${esc(pl.etiqueta)}</p>
                  <p style="font-size:11.5px;color:#a8a29a;margin:0">${esc(pl.duracion)}</p>
                </div>
                <div style="display:flex;align-items:center;gap:10px;flex-shrink:0">
                  <span style="font-size:15px;font-weight:700;letter-spacing:-0.03em;font-variant-numeric:tabular-nums">${esc(pl.precioTxt)}</span>
                  ${addBtn({ id: pl.id, nombre: pf.nombre, detalle: pl.etiqueta + " · " + pl.duracion, precio: pl.precio, ahorro: 0 }, "plus-btn", "width:28px;height:28px;flex-shrink:0;border-radius:999px;border:1px solid #dfe6f7;background:#eef3fd;color:#1d5fd8;font:inherit;font-size:15px;line-height:1;cursor:pointer", "+")}
                </div>
              </div>`;

const pfCard = (pf) => {
  const media = pf.tieneImg
    ? `<span role="img" aria-label="${attr(pf.nombre)}" style="width:64px;height:38px;flex-shrink:0;border-radius:10px;background-image:url('${attr(pf.imgUrl.replace(/^url\(["']?|["']?\)$/g, ""))}');background-size:cover;background-repeat:no-repeat;background-position:center;background-color:#faf8f5;display:inline-block"></span>`
    : `<span style="width:64px;height:38px;flex-shrink:0;border-radius:10px;background:#faf8f5;display:inline-flex;align-items:center;justify-content:center"><span style="width:10px;height:10px;border-radius:999px;display:block;background:${attr(pf.color)}"></span></span>`;
  return `<article class="reveal" style="break-inside:avoid;background:#fff;border:1px solid #ece7e0;border-radius:22px;padding:18px;margin-bottom:14px">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
              ${media}
              <div style="min-width:0">
                <p style="font-size:15px;font-weight:700;letter-spacing:-0.03em;margin:0 0 2px">${esc(pf.nombre)}</p>
                <p style="font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#b4afa8;margin:0">${esc(pf.categoria)}</p>
              </div>
            </div>
            <div style="display:flex;flex-direction:column">
              ${pf.planes.map((pl) => planRow(pf, pl)).join("\n              ")}
            </div>
          </article>`;
};

const catalogo = `
    <section id="catalogo" style="background:rgba(250,248,245,0.72);backdrop-filter:blur(22px) saturate(1.2);border-radius:30px;padding:clamp(26px,3.2vw,46px)">
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:36px;align-items:end;margin-bottom:clamp(26px,3vw,42px)">
        <h2 style="font-size:clamp(32px,4.6vw,58px);font-weight:800;letter-spacing:-0.055em;line-height:1;margin:0">Elige tu<br />plataforma</h2>
        <p style="font-size:14.5px;line-height:1.7;color:#7e7a74;margin:0;max-width:40ch">Pantallas sueltas por 30 días, salvo que el plan indique otra duración.</p>
      </div>

      <div class="marquee" style="position:relative;margin-bottom:clamp(26px,3vw,40px);margin-inline:calc(clamp(26px,3.2vw,46px) * -1);padding-inline:clamp(26px,3.2vw,46px);overflow:hidden;-webkit-mask-image:linear-gradient(90deg,transparent 0,#000 6%,#000 94%,transparent 100%);mask-image:linear-gradient(90deg,transparent 0,#000 6%,#000 94%,transparent 100%)">
        <div class="marquee-track" style="display:flex;width:max-content;gap:14px;animation:jsMarquee 46s linear infinite">
            ${brandRow}
            ${brandRow}
        </div>
      </div>

      <div style="column-width:290px;column-gap:14px">
        ${V.plataformasTodas.map(pfCard).join("\n        ")}
      </div>
    </section>`;

/* ---------- BAJO PEDIDO ---------- */
const bajoPedido = `
    <section id="bajo-pedido" style="background:rgba(250,248,245,0.72);backdrop-filter:blur(22px) saturate(1.2);border-radius:30px;padding:clamp(26px,3.2vw,46px);display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:38px;align-items:start">
      <div>
        <h2 style="font-size:clamp(30px,4vw,48px);font-weight:800;letter-spacing:-0.055em;line-height:1;margin:0 0 18px">¿Buscas<br />algo más?</h2>
        <p style="font-size:14.5px;line-height:1.7;color:#7e7a74;margin:0 0 28px;max-width:38ch;text-wrap:pretty">Si no encuentras el servicio que buscas, escríbenos. Podemos consultar disponibilidad y precio para ti.</p>
        <a href="${attr(enlaceConsulta)}" target="_blank" rel="noopener" class="btn-solid" style="display:inline-flex;align-items:center;justify-content:center;background:#1d5fd8;color:#fff;border-radius:999px;padding:15px 30px;font-size:14px;font-weight:600">Consultar por WhatsApp</a>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;align-content:flex-start">
        ${V.bajoPedido.map((b) => `<span class="chip-hover" style="font-size:13px;font-weight:500;color:#3b3936;background:#fff;border:1px solid #ece7e0;border-radius:999px;padding:10px 17px">${esc(b)}</span>`).join("\n        ")}
      </div>
    </section>`;

/* ---------- PASOS ---------- */
const pasos = `
    <section style="background:rgba(250,248,245,0.72);backdrop-filter:blur(22px) saturate(1.2);border-radius:30px;padding:clamp(26px,3.2vw,46px)">
      <h2 style="font-size:clamp(30px,4vw,48px);font-weight:800;letter-spacing:-0.055em;line-height:1;margin:0 0 38px">Compra en pocos pasos</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px">
        ${V.pasos.map((p) => `<div class="reveal" style="background:#fff;border:1px solid #ece7e0;border-radius:24px;padding:26px">
          <p style="font-size:13px;font-weight:700;letter-spacing:0.1em;color:#1d5fd8;margin:0 0 24px">${esc(p.n)}</p>
          <p style="font-size:19px;font-weight:700;letter-spacing:-0.035em;margin:0 0 9px">${esc(p.titulo)}</p>
          <p style="font-size:13px;line-height:1.6;color:#8b867f;margin:0;text-wrap:pretty">${esc(p.desc)}</p>
        </div>`).join("\n        ")}
      </div>
    </section>`;

/* ---------- BENEFICIOS ---------- */
const beneficios = `
    <section style="background:rgba(250,248,245,0.72);backdrop-filter:blur(22px) saturate(1.2);border-radius:30px;padding:clamp(26px,3.2vw,46px);display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px">
      ${V.beneficios.map((b) => `<div class="reveal" style="background:#fff;border:1px solid #ece7e0;border-radius:24px;padding:26px">
        <span style="display:block;width:26px;height:4px;border-radius:999px;background:#1d5fd8;margin-bottom:22px"></span>
        <p style="font-size:16px;font-weight:700;letter-spacing:-0.03em;margin:0 0 9px">${esc(b.titulo)}</p>
        <p style="font-size:13px;line-height:1.6;color:#8b867f;margin:0;text-wrap:pretty">${esc(b.desc)}</p>
      </div>`).join("\n      ")}
    </section>`;

/* ---------- GARANTIA ---------- */
const garantia = `
    <section id="garantia" style="background:rgba(250,248,245,0.72);backdrop-filter:blur(22px) saturate(1.2);border-radius:30px;padding:clamp(26px,3.2vw,46px)">
      <h2 style="font-size:clamp(30px,4vw,48px);font-weight:800;letter-spacing:-0.055em;line-height:1;margin:0 0 34px">Tu compra cuenta con garantía</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:14px;align-items:start">
        <div style="position:relative;background:#12100f;color:#fff;border-radius:26px;padding:36px;overflow:hidden">
          <div style="position:absolute;bottom:-140px;left:-100px;width:420px;height:420px;filter:blur(70px);opacity:0.45;pointer-events:none;background:radial-gradient(circle at 40% 50%,#d9308e 0%,rgba(217,48,142,0) 52%),radial-gradient(circle at 70% 40%,#f0871f 0%,rgba(240,135,31,0) 52%)"></div>
          <div style="position:relative">
            <p style="font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.6);margin:0 0 18px">Garantía de 24 horas</p>
            <p style="font-size:16.5px;line-height:1.65;margin:0 0 24px;text-wrap:pretty">Si tu cuenta presenta algún inconveniente dentro de las primeras 24 horas después de la entrega, la reponemos sin costo. Repórtalo por WhatsApp con tu comprobante de pago.</p>
            <p style="font-size:12.5px;line-height:1.55;color:rgba(255,255,255,0.55);margin:0">La garantía aplica durante las primeras 24 horas posteriores a la entrega.</p>
          </div>
        </div>
        <div style="background:#fff;border:1px solid #ece7e0;border-radius:26px;padding:36px">
          <p style="font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#8b867f;margin:0 0 22px">La garantía cubre</p>
          <div style="display:flex;flex-direction:column;gap:14px">
            ${V.cubre.map((c) => `<div style="display:flex;gap:12px;align-items:flex-start">
              <span style="width:6px;height:6px;border-radius:999px;background:#1d5fd8;flex-shrink:0;margin-top:8px"></span>
              <p style="font-size:14.5px;line-height:1.55;margin:0">${esc(c)}</p>
            </div>`).join("\n            ")}
          </div>
        </div>
      </div>
      <div style="margin-top:14px;background:#fff;border:1px solid #ece7e0;border-radius:26px;padding:36px">
        <p style="font-size:21px;font-weight:700;letter-spacing:-0.035em;margin:0 0 24px">Para mantener tu acceso funcionando</p>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:18px;margin-bottom:24px">
          ${V.reglas.map((r) => `<div style="border-top:1px solid #ece7e0;padding-top:15px">
            <p style="font-size:13.5px;line-height:1.6;color:#3b3936;margin:0">${esc(r)}</p>
          </div>`).join("\n          ")}
        </div>
        <p style="font-size:12.5px;line-height:1.55;color:#8b867f;margin:0;padding-top:16px;border-top:1px solid #ece7e0">El incumplimiento de estas reglas puede anular la garantía.</p>
      </div>
    </section>`;

/* ---------- RENOVACION ---------- */
const renovacion = `
    <section style="background:rgba(250,248,245,0.72);backdrop-filter:blur(22px) saturate(1.2);border-radius:30px;padding:clamp(26px,3.2vw,46px)">
      <div style="max-width:620px;margin-bottom:34px">
        <h2 style="font-size:clamp(28px,3.6vw,44px);font-weight:800;letter-spacing:-0.055em;line-height:1.02;margin:0 0 14px;text-wrap:balance">¿Quieres seguir disfrutando del servicio?</h2>
        <p style="font-size:14.5px;line-height:1.65;color:#7e7a74;margin:0">Renueva anticipadamente y mantén tu misma cuenta y perfil.</p>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:14px">
        ${V.renovacion.map((r) => `<div class="reveal" style="background:#fff;border:1px solid #ece7e0;border-radius:24px;padding:26px">
          <p style="font-size:16px;font-weight:700;letter-spacing:-0.03em;margin:0 0 9px">${esc(r.titulo)}</p>
          <p style="font-size:13px;line-height:1.6;color:#8b867f;margin:0;text-wrap:pretty">${esc(r.desc)}</p>
        </div>`).join("\n        ")}
      </div>
    </section>`;

/* ---------- VIP ---------- */
const vip = `
    <section id="vip" style="background:rgba(250,248,245,0.72);backdrop-filter:blur(22px) saturate(1.2);border-radius:30px;padding:clamp(26px,3.2vw,46px)">
      <div style="text-align:center;max-width:620px;margin:0 auto 36px">
        <h2 style="font-size:clamp(30px,4vw,48px);font-weight:800;letter-spacing:-0.055em;line-height:1;margin:0">Más compras, mejores beneficios</h2>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px;align-items:stretch">
        <div style="background:#fff;border:1px solid #ece7e0;border-radius:26px;padding:32px">
          <p style="font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#8b867f;margin:0 0 22px">Cliente</p>
          <p style="font-size:30px;font-weight:800;letter-spacing:-0.05em;margin:0 0 10px">Catálogo</p>
          <p style="font-size:14px;line-height:1.6;color:#7e7a74;margin:0">Precios normales del catálogo.</p>
        </div>
        <div style="background:#12100f;color:#fff;border-radius:26px;padding:32px">
          <p style="font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.6);margin:0 0 22px">VIP</p>
          <p style="font-size:30px;font-weight:800;letter-spacing:-0.05em;margin:0 0 10px">5% extra</p>
          <p style="font-size:14px;line-height:1.6;color:rgba(255,255,255,0.7);margin:0">Desde 5 pantallas activas. Descuento adicional sobre combos.</p>
        </div>
        <div style="background:#fff;border:1px solid #ece7e0;border-radius:26px;padding:32px">
          <p style="font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#8b867f;margin:0 0 22px">Revendedor</p>
          <p style="font-size:30px;font-weight:800;letter-spacing:-0.05em;margin:0 0 10px">Mayorista</p>
          <p style="font-size:14px;line-height:1.6;color:#7e7a74;margin:0">Desde 15 pantallas activas. Lista mayorista y soporte prioritario.</p>
        </div>
      </div>
      <div style="display:flex;justify-content:center;margin-top:28px">
        <a href="${attr(enlaceVip)}" target="_blank" rel="noopener" class="btn-solid" style="display:inline-flex;align-items:center;justify-content:center;background:#1d5fd8;color:#fff;border-radius:999px;padding:15px 32px;font-size:14px;font-weight:600">Quiero ser VIP</a>
      </div>
    </section>`;

/* ---------- CTA FINAL ---------- */
const cta = `
    <section style="position:relative;background:#12100f;color:#fff;border-radius:34px;padding:clamp(52px,6.4vw,96px) clamp(26px,3.2vw,46px);text-align:center;overflow:hidden">
      <div style="position:absolute;top:-200px;left:50%;transform:translateX(-50%);width:820px;height:560px;filter:blur(80px);opacity:0.5;pointer-events:none;background:radial-gradient(circle at 30% 45%,#f0871f 0%,rgba(240,135,31,0) 46%),radial-gradient(circle at 55% 55%,#d9308e 0%,rgba(217,48,142,0) 46%),radial-gradient(circle at 76% 45%,#6b45e0 0%,rgba(107,69,224,0) 48%)"></div>
      <div style="position:relative">
        <h2 style="font-size:clamp(34px,5.4vw,70px);font-weight:800;letter-spacing:-0.06em;line-height:0.98;margin:0 auto 18px;max-width:18ch;text-wrap:balance">Disfruta más por menos</h2>
        <p style="font-size:15px;line-height:1.65;color:rgba(255,255,255,0.68);margin:0 auto 32px;max-width:50ch;text-wrap:pretty">Elige tus plataformas favoritas, arma tu combo y realiza tu pedido en pocos minutos.</p>
        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
          <a href="#combos" class="btn-solid" style="display:inline-flex;align-items:center;justify-content:center;background:#1d5fd8;color:#fff;border-radius:999px;padding:15px 32px;font-size:14px;font-weight:600">Ver combos</a>
          <a href="${attr(V.enlacePedido)}" target="_blank" rel="noopener" class="js-pedido ghost-btn" style="display:inline-flex;align-items:center;justify-content:center;border:1px solid rgba(255,255,255,0.28);color:#fff;border-radius:999px;padding:15px 32px;font-size:14px;font-weight:600">Pedir por WhatsApp</a>
        </div>
      </div>
    </section>`;

/* ---------- FOOTER ---------- */
const footer = `
    <footer style="background:rgba(250,248,245,0.72);backdrop-filter:blur(22px) saturate(1.2);border-radius:30px;padding:clamp(26px,3.2vw,46px)">
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:36px">
        <div>
          <p style="font-size:22px;font-weight:800;letter-spacing:-0.04em;margin:0 0 14px">Jose<span style="color:#1d5fd8">.</span>store</p>
          <p style="font-size:14px;line-height:1.65;color:#7e7a74;margin:0;max-width:28ch">Streaming y servicios digitales al mejor precio.</p>
        </div>
        <div>
          <p style="font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#8b867f;margin:0 0 18px">Atención</p>
          <p style="font-size:13.5px;line-height:1.65;color:#3b3936;margin:0 0 10px">Lunes a sábado<br />8:00 a. m. – 9:00 p. m.</p>
          <p style="font-size:13.5px;line-height:1.65;color:#3b3936;margin:0">Domingos y festivos<br />10:00 a. m. – 6:00 p. m.</p>
        </div>
        <div>
          <p style="font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#8b867f;margin:0 0 18px">Contacto</p>
          <p style="font-size:13px;color:#8b867f;margin:0 0 4px">WhatsApp</p>
          <a href="${attr(enlaceConsulta)}" target="_blank" rel="noopener" class="link-soft" style="font-size:20px;font-weight:700;letter-spacing:-0.03em">300 383 8830</a>
        </div>
        <div>
          <p style="font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#8b867f;margin:0 0 18px">Navegación</p>
          <div style="display:flex;flex-direction:column;gap:10px">
            <a href="#inicio" class="link-soft" style="font-size:13.5px;color:#3b3936">Inicio</a>
            <a href="#combos" class="link-soft" style="font-size:13.5px;color:#3b3936">Combos</a>
            <a href="#catalogo" class="link-soft" style="font-size:13.5px;color:#3b3936">Catálogo</a>
            <a href="#bajo-pedido" class="link-soft" style="font-size:13.5px;color:#3b3936">Bajo pedido</a>
            <a href="#garantia" class="link-soft" style="font-size:13.5px;color:#3b3936">Garantía</a>
            <a href="#vip" class="link-soft" style="font-size:13.5px;color:#3b3936">VIP</a>
          </div>
        </div>
      </div>
      <p style="font-size:12px;color:#b4afa8;margin:42px 0 0;padding-top:20px;border-top:1px solid #ece7e0">© 2026 Jose Store. Todos los derechos reservados.</p>
    </footer>`;

/* ---------- DRAWER ---------- */
const drawer = `
  <a href="${attr(enlaceConsulta)}" target="_blank" rel="noopener" class="wa-float" style="position:fixed;right:clamp(16px,3vw,30px);bottom:clamp(16px,3vw,30px);z-index:55;display:inline-flex;align-items:center;gap:10px;background:#12100f;color:#fff;border-radius:999px;padding:14px 24px;font-size:13.5px;font-weight:600;box-shadow:0 20px 44px -20px rgba(18,16,15,0.7)">WhatsApp</a>

  <div id="overlay" class="overlay"></div>

  <aside id="panel" class="panel" aria-label="Carrito">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:24px;border-bottom:1px solid #ece7e0;flex-shrink:0">
      <p style="font-size:19px;font-weight:700;letter-spacing:-0.035em;margin:0">Tu pedido</p>
      <button type="button" id="close-cart" class="close-btn" aria-label="Cerrar" style="width:30px;height:30px;border-radius:999px;border:none;background:#f4f1ec;color:#6b6762;font:inherit;font-size:16px;line-height:1;cursor:pointer">×</button>
    </div>
    <div id="cart-items" style="flex:1;overflow-y:auto;padding:18px 24px;display:flex;flex-direction:column;gap:10px"></div>
    <div style="border-top:1px solid #ece7e0;padding:18px 24px 24px;flex-shrink:0;display:flex;flex-direction:column;gap:14px">
      <div style="display:flex;flex-direction:column;gap:6px">
        <label for="js-nombre" style="font-size:11.5px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#8b867f">Tu nombre (opcional)</label>
        <input id="js-nombre" type="text" placeholder="Escribe tu nombre" style="width:100%;box-sizing:border-box;font:inherit;font-size:14px;color:#12100f;background:#faf8f5;border:1px solid #ece7e0;border-radius:12px;padding:12px 14px;outline:none" />
      </div>
      <div id="cart-savings-row" style="display:none;justify-content:space-between;align-items:baseline">
        <span style="font-size:13.5px;font-weight:500;color:#6b6762">Ahorro</span>
        <span id="cart-savings" style="font-size:15px;font-weight:700;color:#1d5fd8"></span>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:baseline;padding-top:12px;border-top:1px solid #ece7e0">
        <span style="font-size:11.5px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#8b867f">Total</span>
        <span id="cart-total" style="font-size:30px;font-weight:800;letter-spacing:-0.055em">$0</span>
      </div>
      <a id="cart-checkout" class="js-pedido btn-solid" href="${attr(V.enlacePedido)}" target="_blank" rel="noopener" style="display:flex;align-items:center;justify-content:center;background:#1d5fd8;color:#fff;border-radius:999px;padding:16px;font-size:14px;font-weight:600">Pedir por WhatsApp</a>
    </div>
  </aside>`;

/* ---------- SCRIPT (vanilla) ---------- */
const SCRIPT = `
(function(){
  var WHATSAPP = "573003838830";
  var cop = function(n){ return "$" + Math.round(n).toLocaleString("es-CO"); };
  var carrito = [];
  var nombre = "";
  try { var g = localStorage.getItem("josestore-carrito"); if (g) carrito = JSON.parse(g) || []; } catch(e){}
  if (!Array.isArray(carrito)) carrito = [];

  var $ = function(id){ return document.getElementById(id); };
  var overlay = $("overlay"), panel = $("panel");

  function persist(){ try { localStorage.setItem("josestore-carrito", JSON.stringify(carrito)); } catch(e){} }
  function abrir(){ overlay.classList.add("open"); panel.classList.add("open"); }
  function cerrar(){ overlay.classList.remove("open"); panel.classList.remove("open"); }

  function mensaje(){
    var total = carrito.reduce(function(a,x){ return a + x.precio * x.cantidad; }, 0);
    if (carrito.length === 0) return "\u00A1Hola Jose Store! Quiero informaci\u00F3n sobre sus planes.";
    var lineas = carrito.map(function(x){ return "\u2022 " + x.nombre + " (" + x.detalle + ") x" + x.cantidad + " \u2014 " + cop(x.precio * x.cantidad); });
    var out = ["\u00A1Hola Jose Store! Quiero hacer este pedido:", ""].concat(lineas, ["", "*TOTAL: " + cop(total) + "*", nombre ? ("Mi nombre: " + nombre) : "", "", "Quedo atento a los datos de pago"]);
    return out.filter(Boolean).join("\\n");
  }
  function pedidoUrl(){ return "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(mensaje()); }

  function itemHTML(x){
    return '<div style="background:#faf8f5;border-radius:18px;padding:15px">'
      + '<div style="display:flex;justify-content:space-between;gap:10px;margin-bottom:10px">'
      +   '<div><p style="font-size:14px;font-weight:700;letter-spacing:-0.03em;margin:0 0 2px">' + esc(x.nombre) + '</p>'
      +   '<p style="font-size:11.5px;color:#8b867f;margin:0">' + esc(x.detalle) + '</p></div>'
      +   '<button type="button" class="remove-btn" data-act="rm" data-id="' + esc(x.id) + '" style="border:none;background:transparent;color:#b4afa8;font:inherit;font-size:12px;font-weight:600;cursor:pointer;flex-shrink:0;height:fit-content">Quitar</button>'
      + '</div>'
      + '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px">'
      +   '<div style="display:flex;align-items:center;gap:8px">'
      +     '<button type="button" class="qty-btn" data-act="minus" data-id="' + esc(x.id) + '" aria-label="Restar" style="width:26px;height:26px;border-radius:999px;border:none;background:#fff;color:#12100f;font:inherit;font-size:14px;line-height:1;cursor:pointer">\u2212</button>'
      +     '<span style="font-size:13.5px;font-weight:700;min-width:16px;text-align:center">' + x.cantidad + '</span>'
      +     '<button type="button" class="qty-btn" data-act="plus" data-id="' + esc(x.id) + '" aria-label="Sumar" style="width:26px;height:26px;border-radius:999px;border:none;background:#fff;color:#12100f;font:inherit;font-size:14px;line-height:1;cursor:pointer">+</button>'
      +   '</div>'
      +   '<span style="font-size:15.5px;font-weight:700;letter-spacing:-0.03em">' + cop(x.precio * x.cantidad) + '</span>'
      + '</div></div>';
  }
  function esc(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }

  function render(){
    var count = carrito.reduce(function(a,x){ return a + x.cantidad; }, 0);
    var total = carrito.reduce(function(a,x){ return a + x.precio * x.cantidad; }, 0);
    var ahorro = carrito.reduce(function(a,x){ return a + (x.ahorro || 0) * x.cantidad; }, 0);
    $("cart-count").textContent = count;
    var box = $("cart-items");
    if (carrito.length === 0){
      box.innerHTML = '<p style="font-size:14.5px;line-height:1.65;color:#b4afa8;text-align:center;padding:70px 0;margin:0">Tu carrito est\u00E1 vac\u00EDo.<br />Agrega un combo o una pantalla suelta.</p>';
    } else {
      box.innerHTML = carrito.map(itemHTML).join("");
    }
    $("cart-total").textContent = cop(total);
    var sr = $("cart-savings-row");
    if (ahorro > 0){ sr.style.display = "flex"; $("cart-savings").textContent = cop(ahorro); }
    else { sr.style.display = "none"; }
    var url = pedidoUrl();
    var links = document.querySelectorAll(".js-pedido");
    for (var i = 0; i < links.length; i++) links[i].setAttribute("href", url);
  }

  document.addEventListener("click", function(ev){
    var add = ev.target.closest(".js-add");
    if (add){
      var item = { id: add.dataset.id, nombre: add.dataset.nombre, detalle: add.dataset.detalle, precio: +add.dataset.precio, ahorro: +add.dataset.ahorro };
      var f = carrito.filter(function(x){ return x.id === item.id; })[0];
      if (f) f.cantidad += 1; else { item.cantidad = 1; carrito.push(item); }
      persist(); render(); abrir();
      return;
    }
    var b = ev.target.closest("[data-act]");
    if (b){
      var id = b.dataset.id, act = b.dataset.act;
      if (act === "rm") carrito = carrito.filter(function(x){ return x.id !== id; });
      else {
        var it = carrito.filter(function(x){ return x.id === id; })[0];
        if (it){ it.cantidad += (act === "plus" ? 1 : -1); if (it.cantidad <= 0) carrito = carrito.filter(function(x){ return x.id !== id; }); }
      }
      persist(); render();
    }
  });

  $("open-cart").addEventListener("click", abrir);
  $("close-cart").addEventListener("click", cerrar);
  overlay.addEventListener("click", cerrar);
  document.addEventListener("keydown", function(e){ if (e.key === "Escape") cerrar(); });
  $("js-nombre").addEventListener("input", function(e){ nombre = e.target.value; render(); });

  // reveal on scroll
  var rev = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)){
    for (var i = 0; i < rev.length; i++) rev[i].classList.add("in");
  } else {
    var io = new IntersectionObserver(function(ents){
      ents.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.06 });
    for (var j = 0; j < rev.length; j++) io.observe(rev[j]);
    setTimeout(function(){ for (var k = 0; k < rev.length; k++) rev[k].classList.add("in"); }, 2500);
  }

  render();
})();`;

/* ---------- PAGE ---------- */
const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Jose Store — Streaming al mejor precio</title>
<meta name="description" content="Jose Store reúne tus plataformas de streaming favoritas en un solo pedido, con combos, precios especiales y garantía de 24 horas.">
<script>document.documentElement.className="js";</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>${CSS}</style>
</head>
<body>
<div style="background:#efece7;position:relative;overflow-x:hidden;padding:clamp(14px,2.4vw,34px)">
  <div class="bg-aurora" aria-hidden="true"></div>

  <div style="position:relative;display:flex;flex-direction:column;gap:clamp(14px,2vw,26px)">
${hero}
${hitos}
${combos}
${catalogo}
${bajoPedido}
${pasos}
${beneficios}
${garantia}
${renovacion}
${vip}
${cta}
${footer}
  </div>
${drawer}
</div>
<script>${SCRIPT}</script>
</body>
</html>
`;

/* ---------- pase de rendimiento ----------
   backdrop-filter sobre ~12 secciones grandes + un fondo animado detrás =
   re-blur del backdrop en cada frame de scroll. Se quita y se sube la opacidad
   del fondo de sección (el blur apenas se notaba al 72%). */
let out = html;
out = out.replace(/;?backdrop-filter:[^;"]+/g, "");
out = out.replace(/rgba\(250,248,245,0\.72\)/g, "rgba(251,249,247,0.90)");
out = out.replace(
  "linear-gradient(150deg,rgba(255,255,255,0.62),rgba(250,248,245,0.74) 46%,rgba(250,248,245,0.8) 100%)",
  "linear-gradient(150deg,rgba(255,255,255,0.93),rgba(250,248,245,0.96) 46%,rgba(250,248,245,0.98) 100%)"
);
out = out.replace(/rgba\(255,255,255,0\.9\)/g, "rgba(255,255,255,0.97)");
out = out.replace(/rgba\(255,255,255,0\.92\)/g, "rgba(255,255,255,0.97)");
// quitar TODO filter:blur() decorativo (glows de garantía y CTA) — los gradientes
// radiales ya se difuminan solos; un blur de 70-80px sobre un div grande obliga a
// re-rasterizar en cada frame en GPUs integradas.
out = out.replace(/;?filter:blur\([^)]*\)/g, "");
// el mask-image de degradado en los bordes del carrusel obliga a renderizar la
// tira a un buffer aparte en cada frame de su animación — se quita.
out = out.replace(/;?(-webkit-)?mask-image:linear-gradient\([^)]*\)/g, "");
const stripped = (html.match(/backdrop-filter/g) || []).length;
const blursLeft = (out.match(/filter:blur/g) || []).length;

/* ---------- imágenes: usar los .webp optimizados que viven en jose-store/img ---- */
const BRANDS = ["b-paramount", "b-disney", "b-hbomax", "b-netflix", "b-primevideo", "b-spotify", "b-youtube", "b-crunchyroll", "b-vix", "b-canvapro"];
for (const n of BRANDS) out = out.split(n + ".png").join(n + ".webp");

const DIST = path.join(ROOT, "jose-store");
const missing = BRANDS.filter((n) => !fs.existsSync(path.join(DIST, "img", n + ".webp")));
if (missing.length) {
  console.error("FALTAN webp en jose-store/img:", missing.join(", "));
  console.error("(regenerá con scripts/optimizar-imagenes.js si cambiaste las imágenes)");
  process.exit(1);
}

fs.writeFileSync(path.join(DIST, "index.html"), out, "utf8");
const pngLeft = (out.match(/\.png/g) || []).length;
console.log("jose-store/index.html:", out.length, "bytes | backdrop-filter:", stripped, "quitados | filter:blur restantes:", blursLeft, "| refs .png:", pngLeft);
console.log("combos:", V.todosCombos.length, "| plataformas:", V.plataformasTodas.length, "| familiares:", V.familiares.length);
