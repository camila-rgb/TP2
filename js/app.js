const CAP = 50, MAXQ = 6, B = [2026, 9, 12];
const GEN = ["Ciencia ficción", "Drama", "Suspenso", "Comedia", "Romance", "Aventura", "Crimen", "Animación", "Thriller"];
const F = [
    ["Casablanca", 1942, "Michael Curtiz", "Romance", 210, "Un bar en Marruecos, un amor imposible y una decisión que cuesta todo.", 4.8, 312],
    ["Metrópolis", 1927, "Fritz Lang", "Ciencia ficción", 35, "Una ciudad del futuro dividida entre quienes mandan y quienes la sostienen.", 4.5, 148],
    ["Psicosis", 1960, "Alfred Hitchcock", "Suspenso", 0, "Una huida, un motel al costado de la ruta y un secreto familiar.", 4.7, 270],
    ["Los siete samuráis", 1954, "Akira Kurosawa", "Aventura", 30, "Una aldea contrata a siete guerreros para defenderse de los bandidos.", 4.9, 201],
    ["2001: Odisea del espacio", 1968, "Stanley Kubrick", "Ciencia ficción", 250, "Un viaje a Júpiter y una computadora que empieza a dudar.", 4.4, 260],
    ["El padrino", 1972, "Francis Ford Coppola", "Drama", 15, "El heredero reticente de una familia mafiosa asume el poder.", 4.9, 355],
    ["Taxi Driver", 1976, "Martin Scorsese", "Drama", 45, "Un taxista insomne recorre una Nueva York cada vez más oscura.", 4.5, 190],
    ["Blade Runner", 1982, "Ridley Scott", "Ciencia ficción", 190, "Un cazador de androides persigue réplicas que quieren más tiempo de vida.", 4.6, 244],
    ["Volver al futuro", 1985, "Robert Zemeckis", "Comedia", 25, "Un adolescente viaja a 1955 y arriesga el noviazgo de sus propios padres.", 4.8, 330],
    ["Pulp Fiction", 1994, "Quentin Tarantino", "Crimen", 50, "Historias cruzadas de gánsters, un boxeador y una maleta misteriosa.", 4.7, 298],
    ["Cinema Paradiso", 1988, "Giuseppe Tornatore", "Drama", 20, "Un director recuerda al proyeccionista que le enseñó a amar el cine.", 4.8, 176],
    ["Nueve reinas", 2000, "Fabián Bielinsky", "Thriller", 160, "Dos estafadores se asocian por un día en Buenos Aires. Nada es lo que parece.", 4.6, 221],
    ["El viaje de Chihiro", 2001, "Hayao Miyazaki", "Animación", 340, "Una niña queda atrapada en un mundo de espíritus y casas de baños.", 4.8, 239],
    ["El secreto de sus ojos", 2009, "Juan José Campanella", "Thriller", 5, "Un exsecretario judicial revisa un crimen que nunca pudo cerrar.", 4.7, 205]
].map((a, i) => ({ i, t: a[0], y: a[1], d: a[2], g: a[3], h: a[4], s: a[5], r: a[6], v: a[7], taken: 8 + (i * 7) % 24 }));
let db = { acc: {}, ses: null }; try { db = JSON.parse(localStorage.getItem("ps_db")) || db } catch (e) { }
const save = () => { try { localStorage.setItem("ps_db", JSON.stringify(db)) } catch (e) { } };
const U = () => db.ses && db.acc[db.ses];
const S = { view: "home", wk: 0, open: null, q: 2, busy: false, cf: null, tab: "new", err: "", why: "", f: { gen: [] } };
const $ = s => document.querySelector(s), app = $("#app");
const esc = s => String(s || "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const dt = i => new Date(B[0], B[1], B[2] + i, 19, 0);
const fd = (i, o) => dt(i).toLocaleDateString("es-AR", o || { weekday: "long", day: "numeric", month: "long" });
const left = i => { const u = U(); return CAP - F[i].taken - (u ? u.res : []).filter(r => r.i === i && r.st === "Confirmada").reduce((a, r) => a + r.q, 0) };
const avg = i => { const u = U(), m = u && u.votes[i]; return m ? ((F[i].r * F[i].v + m) / (F[i].v + 1)).toFixed(1) : F[i].r.toFixed(1) };
const past = i => dt(i) < new Date();
const lvl = v => v >= 10 ? ["Palco", 0] : v >= 5 ? ["Platea", 10 - v] : ["Butaca", 5 - v];
function toast(m) { const t = $("#toast"); t.textContent = m; t.hidden = false; clearTimeout(toast.k); toast.k = setTimeout(() => t.hidden = true, 2800) }
function need(why) { if (U()) return true; S.view = "auth"; S.why = why; S.open = null; S.tab = "new"; S.err = ""; return false }
function act(t) { U().act.unshift([t, "ahora"]) }
function seed(name, email, gen) {
    return {
        name, email, since: "marzo de 2026", gen, visits: 9, fav: [3, 5, 12], no: [6], votes: { 0: 5, 2: 4, 5: 5, 8: 4 },
        res: [{ id: 1, i: 0, q: 2, st: "Asistió" }, { id: 2, i: 11, q: 2, st: "Confirmada" }],
        recs: [{ i: 3, txt: "Para ver en pantalla grande y con silencio total.", d: "2 oct" }, { i: 12, txt: "Ideal para ir en familia.", d: "21 sep" }],
        act: [["Votó 5 ★ a El padrino", "hace 2 días"], ["Reservó 2 entradas para Nueve reinas", "hace 4 días"], ["Recomendó Los siete samuráis", "hace 2 semanas"], ["Se unió a Planos Secuencias", "marzo de 2026"]], rid: 3
    }
}
const MO = ['<circle cx="40" cy="18" r="10"/><path d="M4 46q13-8 26 0t26 0M12 34l14-4 8-8 4 1-5 9"/>', '<path d="M6 54V30h10V18h10v36M26 54V8h12v46M38 54V24h10v30M48 54V34h8v20M4 54h52"/>', '<path d="M8 32L30 10l22 22M14 28v26h32V28M24 54V38h12v16"/><path class="f" d="M40 14h5v8h-5z"/>', '<circle cx="30" cy="30" r="14"/><path d="M8 8l44 44M52 8L8 52"/>', '<rect class="f" x="24" y="6" width="12" height="34"/><circle cx="30" cy="50" r="6"/><ellipse cx="30" cy="50" rx="22" ry="5"/>', '<circle cx="30" cy="20" r="12"/><path d="M30 20m-6 0a6 6 0 1 1 6 6M30 32v24M30 46l-10-6M30 42l10-6"/>', '<rect x="20" y="6" width="20" height="8" rx="2"/><path d="M6 44l6-14h36l6 14zM6 44v8h48v-8"/><circle class="f" cx="18" cy="52" r="4"/><circle class="f" cx="42" cy="52" r="4"/>', '<path d="M4 30C14 12 46 12 56 30 46 48 14 48 4 30z"/><circle cx="30" cy="30" r="9"/><circle class="f" cx="30" cy="30" r="3"/>', '<circle cx="30" cy="30" r="22"/><path d="M30 14v16l10 6"/>', '<rect x="8" y="20" width="44" height="30" rx="3"/><path d="M22 20v-6h16v6M8 32h44"/><rect class="f" x="27" y="29" width="6" height="6"/>', '<circle cx="30" cy="30" r="22"/><circle cx="30" cy="16" r="4"/><circle cx="30" cy="44" r="4"/><circle cx="16" cy="30" r="4"/><circle cx="44" cy="30" r="4"/><circle class="f" cx="30" cy="30" r="3"/>', '<path d="M8 46L12 18l12 14 6-18 6 18 12-14 4 28zM8 54h44"/>', '<ellipse cx="30" cy="30" rx="18" ry="24"/><circle class="f" cx="23" cy="26" r="2.5"/><circle class="f" cx="37" cy="26" r="2.5"/><path d="M22 40q8 6 16 0"/>', '<circle cx="26" cy="26" r="16"/><path d="M38 38l16 16"/>'];
const poster = f => `<div class="po" style="--h:${f.h}" role="img" aria-label="Póster de ${f.t}"><small>${f.y}</small><svg class="mo" viewBox="0 0 60 60" aria-hidden="true">${MO[f.i]}</svg><b>${f.t}</b><i>${f.g}</i></div>`;
function card(f, mini) { const u = U(), no = u && u.no.includes(f.i); return `<article class="card ${mini ? "mini" : ""} ${no ? "off" : ""}">${mini ? `<div class="day">${fd(f.i, { weekday: "short", day: "numeric", month: "short" })} · 19:00</div>` : ""}${poster(f)}<h3 style="font-size:1.1rem">${f.t}</h3><div class="meta">${f.y} · ${f.g}</div>${mini ? `<p class="meta" style="margin:0">${f.s}</p>` : ""}${no ? '<span class="tag">Descartada por vos</span>' : ""}${past(f.i) ? '<span class="tag">Función finalizada</span>' : ""}<button class="btn p" data-a="open" data-i="${f.i}" style="margin-top:auto">Ver ficha</button></article>` }
const grid = a => a.length ? `<div class="grid">${a.map(i => card(F[i])).join("")}</div>` : null;
function home() {
    return `<section class="hero"><div><h1>Cine bajo <span>las estrellas</span>. Cada noche.</h1><p>Una película por día, a las 19:00. Reservá tu lugar, votá lo que se proyecta y armá tu historia de espectador.</p><div class="row"><button class="btn p" data-a="go" data-v="cart">Ver cartelera</button><button class="btn" data-a="go" data-v="mem">Hacerme socio</button></div></div><div class="ticket"><small>Función de hoy · 19:00 h</small><h3>${F[3].t}</h3><div>${F[3].d} · ${F[3].y}</div><div class="meta" style="color:#111;margin-top:6px">Entrada general · Cupo ${CAP}</div></div></section>
<h2>Películas destacadas</h2>${grid([0, 3, 5, 11]).replace(/^/, "")}
<div class="cta"><div><h2 style="margin:0 0 6px">Sumate a la comunidad</h2><div>Votá, recomendá y decidí las próximas funciones.</div></div><span class="row" style="margin:0"><button class="btn" data-a="go" data-v="mem">Quiero ser socio</button><button class="btn" data-a="go" data-v="vot">Votar la próxima función</button></span></div>`}
function cart() { const a = S.wk * 7, d = [...Array(7)].map((_, k) => F[a + k]); return `<div class="wk"><h2 style="margin:0">Cartelera</h2><div class="row" style="margin:0"><button class="btn" data-a="wk" data-d="-1" ${S.wk === 0 ? "disabled" : ""} aria-label="Semana anterior">←</button><span style="align-self:center;font-weight:700">${fd(a, { day: "numeric", month: "short" })} – ${fd(a + 6, { day: "numeric", month: "short" })}</span><button class="btn" data-a="wk" data-d="1" ${S.wk === 1 ? "disabled" : ""} aria-label="Semana siguiente">→</button></div></div><p class="meta">Una película por día, todas a las 19:00. Las que descartes se atenúan solo para vos.</p><div class="grid" style="margin-top:12px">${d.map(f => card(f, true)).join("")}</div>` }
function authv() {
    const t = S.tab, v = k => esc(S.f[k]); return `<section class="auth"><div><h1>${S.why ? "Primero, tu usuario" : "Sumate a la membresía"}</h1><p style="color:var(--mut);font-size:1.1rem">${S.why || "Creá tu usuario para reservar, votar, guardar favoritas y armar tu perfil de espectador."}</p><ul><li>Entradas y reservas a tu nombre</li><li>Votos, favoritas y recomendaciones</li><li>Filtro personal de películas</li></ul></div>
<div class="box" style="margin-top:0"><div class="row" style="margin:0 0 14px"><button class="chip" data-a="tab" data-t="new" aria-pressed="${t === "new"}">Crear usuario</button><button class="chip" data-a="tab" data-t="in" aria-pressed="${t === "in"}">Ya tengo usuario</button></div>
${t === "new" ? `<label>Nombre<input name="name" value="${v("name")}" autocomplete="name"></label><label>Email<input name="email" type="email" value="${v("email")}" autocomplete="email"></label><div class="meta">Géneros que más te gustan</div><div class="row" style="margin:6px 0 14px">${GEN.map(g => `<button class="chip" data-a="sg" data-g="${g}" aria-pressed="${S.f.gen.includes(g)}">${g}</button>`).join("")}</div><button class="btn p" data-a="signup">Crear mi usuario</button>` : `<label>Email con el que te registraste<input name="lemail" type="email" value="${v("lemail")}"></label><button class="btn p" data-a="login">Ingresar</button>`}
${S.err ? `<p role="alert" style="color:var(--err);font-weight:700">${S.err}</p>` : ""}<p class="meta">Prototipo: tus datos se guardan en este navegador. En la versión real, Firebase Authentication (anónima) te identifica y tu perfil vive en Firestore.</p></div></section>`
}
function mem() { const u = U(); if (!u) return authv(); const [l, n] = lvl(u.visits); return `<h2>Membresía</h2><div class="carnet"><small>CARNET DE SOCIO</small><h3 style="font-size:1.8rem;margin:8px 0 2px">${esc(u.name)}</h3><div>Nivel <b>${l}</b> · ${u.visits} funciones</div><div class="meta" style="color:#B5B0A5">Socio desde ${u.since}</div></div><p>${n ? `Te ${n === 1 ? "falta 1 función" : "faltan " + n + " funciones"} para el próximo nivel.` : "Llegaste al nivel máximo."}</p><h2 style="font-size:1.3rem">Beneficios</h2><ul><li>Votar y calificar las películas que viste</li><li>Recomendar películas con comentarios</li><li>Filtro personal de “No me interesa”</li><li>Reservas con historial y cancelación hasta 24 h antes</li></ul><button class="btn p" data-a="go" data-v="me">Ir a mi perfil</button>` }
function me() {
    const u = U(); if (!u) return authv(); const [l] = lvl(u.visits), ini = u.name.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join("").toUpperCase(), up = u.res.filter(r => r.st === "Confirmada" && !past(r.i)).length;
    const H = t => `<h2 style="font-size:1.35rem">${t}</h2>`;
    return `<section class="prof"><div class="av" aria-hidden="true">${esc(ini)}</div><div><h1>${esc(u.name)}</h1><div class="meta">${esc(u.email)} · Socio desde ${u.since}</div><span class="tag">${l}</span></div><button class="btn" data-a="out">Cerrar sesión</button></section>
<div class="stats"><div><b>${u.visits}</b>funciones vistas</div><div><b>${Object.keys(u.votes).length}</b>votos</div><div><b>${u.fav.length}</b>favoritas</div><div><b>${up}</b>reservas próximas</div></div>
${H("Mis preferencias")}<div class="row" style="margin-top:0">${GEN.map(g => `<button class="chip" data-a="pg" data-g="${g}" aria-pressed="${u.gen.includes(g)}">${g}</button>`).join("")}</div>
${H("Mis reservas")}${u.res.length ? u.res.map(r => `<div class="res"><div><b>${F[r.i].t}</b><div class="meta">${fd(r.i)} · 19:00 · ${r.q} entrada${r.q > 1 ? "s" : ""} · <b style="color:${r.st === "Cancelada" ? "var(--err)" : "var(--ok)"}">${r.st}</b></div></div>${r.st === "Confirmada" && !past(r.i) ? (dt(r.i) - new Date() >= 864e5 ? (S.cf === r.id ? `<span><button class="btn" data-a="cok" data-id="${r.id}">Sí, cancelar</button> <button class="btn" data-a="cno">Volver</button></span>` : `<button class="btn" data-a="cx" data-id="${r.id}">Cancelar</button>`) : `<span class="meta">No cancelable (menos de 24 h)</span>`) : ""}</div>`).join("") : '<div class="empty">Todavía no reservaste. Elegí una función en la cartelera.</div>'}
${H("Favoritas")}${grid(u.fav) || '<div class="empty">Guardá películas con el botón ♥ de la ficha.</div>'}
${H("Mis votos")}${Object.keys(u.votes).length ? Object.entries(u.votes).map(([i, v]) => `<div class="res"><b>${F[i].t}</b><span style="color:var(--btn);font-size:1.2rem" aria-label="${v} de 5">${"★".repeat(v)}${"☆".repeat(5 - v)}</span></div>`).join("") : '<div class="empty">Calificá las películas que ya viste.</div>'}
${H("Mis recomendaciones")}${u.recs.map((r, x) => `<div class="res"><div><b>${F[r.i].t}</b><div class="meta">“${esc(r.txt)}” · ${r.d}</div></div><button class="btn" data-a="drec" data-x="${x}" aria-label="Eliminar recomendación">Eliminar</button></div>`).join("")}
<div class="box"><label>Recomendar una película<select name="rf">${F.map(f => `<option value="${f.i}" ${S.f.rf == f.i ? "selected" : ""}>${f.t}</option>`).join("")}</select></label><label>Tu comentario<textarea name="rt" rows="2" maxlength="140">${esc(S.f.rt)}</textarea></label>${S.err ? `<p role="alert" style="color:var(--err);font-weight:700;margin:0 0 8px">${S.err}</p>` : ""}<button class="btn p" data-a="rec">Publicar recomendación</button></div>
${H("Descartadas por mí")}${grid(u.no) || '<div class="empty">Las que marques como “No me interesa” aparecen acá. Solo vos las ves atenuadas.</div>'}
${H("Mi actividad")}<ul class="tl">${u.act.slice(0, 8).map(a => `<li><span>${esc(a[0])}</span><span class="meta">${a[1]}</span></li>`).join("")}</ul>`
}
const POLL = [["Alien, el octavo pasajero", 1979, "Ciencia ficción", 34], ["Cantando bajo la lluvia", 1952, "Musical", 27], ["Tiempos modernos", 1936, "Comedia", 41], ["La naranja mecánica", 1971, "Drama", 19]];
const COM = { 0: [["Lucía", "Una joya. Verla de noche al aire libre es otra cosa."], ["Martín", "El final sigue funcionando perfecto."]], 3: [["Camila", "Épica, y el silencio del público la hace mejor."]], 5: [["Nicolás", "Nunca la había visto en pantalla grande."]], 8: [["Joaquín", "Fui con mi familia y la disfrutamos todos."]], 11: [["Sofía", "Con el cielo de Buenos Aires de fondo, un plan ideal."]] };
const cms = i => [...(COM[i] || []), ...(U() ? U().recs.filter(r => r.i === i).map(r => ["Vos", r.txt]) : [])];
function votv() {
    const u = U(), mine = u && u.pv, tot = POLL.reduce((a, p, k) => a + p[3] + (mine === k ? 1 : 0), 0);
    return `<h2>Votación comunitaria</h2><p class="meta">Elegí qué película se proyecta el lunes 26/10. La votación cierra el domingo 25/10 a las 19:00. Un voto por socio: podés cambiarlo hasta el cierre.</p>${POLL.map((p, k) => { const n = p[3] + (mine === k ? 1 : 0), pc = Math.round(n * 100 / tot); return `<div class="res" style="display:block"><div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;align-items:center"><div><b>${p[0]}</b><div class="meta">${p[1]} · ${p[2]}</div></div><button class="btn ${mine === k ? "" : "p"}" data-a="pv" data-k="${k}">${mine === k ? "✓ Tu voto" : "Votar"}</button></div><div class="bar2" role="img" aria-label="${pc}% de los votos"><i style="width:${pc}%"></i></div><div class="meta">${n} votos · ${pc}%</div></div>` }).join("")}<p class="meta">Total: ${tot} votos${u ? "" : ". Para votar necesitás tu usuario."}</p>`
}
function esp() {
    const C = [["Puertas y horario", "Abrimos a las 18:00. La película empieza a las 19:00, todos los días."], ["Qué llevar", "Abrigo, almohadón o reposera y, si querés, repelente. El piso es de césped."], ["Comida y bebida", "Hay buffet en el predio. También podés traer tu mate y tu termo."], ["Accesibilidad", "Acceso sin escalones y lugares reservados. Avisanos al reservar."], ["Subtítulos y sonido", "Todas las funciones tienen subtítulos en español y sonido pensado para el aire libre."]];
    return `<h2>El espacio</h2><p class="meta">Todo lo que conviene saber antes de venir.</p><div class="grid">${C.map(c => `<article class="card"><h3 style="font-size:1.3rem">${c[0]}</h3><p style="margin:0">${c[1]}</p></article>`).join("")}</div><div class="cta" style="margin-top:28px"><div><h2 style="margin:0 0 6px">Si llueve</h2><div>Si a las 17:00 hay lluvia fuerte, la función se suspende y lo avisamos acá. Tu reserva queda reprogramable a otra función, sin costo.</div></div></div><p class="meta">Dirección: a completar con los datos reales del predio.</p>`
}
function modal() {
    const u = U(), f = F[S.open], i = f.i, mine = u && u.votes[i], l = left(i), pa = past(i), fv = u && u.fav.includes(i), no = u && u.no.includes(i);
    return `<div class="modal" data-a="bg"><div class="sheet" role="dialog" aria-modal="true" aria-label="${f.t}"><div>${poster(f)}</div><div><button class="btn" data-a="close" style="float:right" aria-label="Cerrar">✕</button><h2 style="margin:0">${f.t}</h2><div class="meta">${f.y} · ${f.d} · ${f.g}</div><p>${f.s}</p><div class="day">${fd(i)} · 19:00 h</div><p style="margin:6px 0"><b style="font-size:1.3rem">★ ${avg(i)}</b> <span class="meta">promedio de la comunidad</span></p>
<div class="stars" role="group" aria-label="Tu calificación">${[1, 2, 3, 4, 5].map(n => `<button data-a="vote" data-n="${n}" class="${mine >= n ? "on" : ""}" aria-label="${n} estrellas">★</button>`).join("")}</div>
<div class="row" style="margin-top:4px"><button class="chip" data-a="fav" aria-pressed="${!!fv}">${fv ? "♥ En favoritas" : "♡ Guardar"}</button><button class="chip" data-a="no" aria-pressed="${!!no}">${no ? "Volver a mostrar" : "No me interesa"}</button></div>
<h3 style="font-size:1.2rem;margin:16px 0 6px">Comentarios de la comunidad</h3>${cms(i).length ? cms(i).map(c => `<div class="meta" style="margin-bottom:6px"><b style="color:var(--fg)">${esc(c[0])}:</b> ${esc(c[1])}</div>`).join("") : '<div class="meta">Todavía no hay comentarios. ¡Escribí el primero!</div>'}<label style="margin-top:8px">Dejá tu comentario<textarea name="mc" rows="2" maxlength="140">${esc(S.f.mc)}</textarea></label><button class="btn" data-a="mcom">Publicar comentario</button>
<div class="box"><b>Reservar entradas</b>${pa ? '<p class="meta">Esta función ya finalizó.</p>' : l <= 0 ? '<p class="meta">Función agotada.</p>' : `<div class="meta">Quedan ${l} de ${CAP} lugares</div><div class="q"><button data-a="q" data-d="-1" aria-label="Menos">−</button><b aria-live="polite">${S.q}</b><button data-a="q" data-d="1" aria-label="Más">+</button><span class="meta">máx. ${Math.min(MAXQ, l)}</span></div><div class="meta">Resumen: ${S.q} × ${f.t}, ${fd(i, { weekday: "short", day: "numeric", month: "short" })}, 19:00. Sin pago online: se abona en puerta. Cancelable hasta 24 h antes.</div><button class="btn p" data-a="book" style="margin-top:10px" ${S.busy ? "disabled" : ""}>${S.busy ? "Guardando…" : "Confirmar reserva"}</button>`}</div></div></div></div>`
}
function render() {
    const u = U(), v = [["home", "Inicio"], ["cart", "Cartelera"], ["vot", "Votación"], ["esp", "El espacio"], ["mem", "Membresía"], ["me", u ? "Mi perfil" : "Ingresar"]];
    $("#nav").innerHTML = v.map(([k, n]) => `<button data-a="go" data-v="${k}" ${(S.view === k || (S.view === "auth" && k === "mem")) ? 'aria-current="page"' : ""}>${n}</button>`).join("");
    app.innerHTML = ({ home, cart, vot: votv, esp, mem, me, auth: authv })[S.view]() + (S.open != null ? modal() : "")
}
const tg = (a, x) => { const k = a.indexOf(x); k < 0 ? a.push(x) : a.splice(k, 1) };
document.addEventListener("input", e => { if (e.target.name) S.f[e.target.name] = e.target.value });
document.addEventListener("click", e => {
    const el = e.target.closest("[data-a]"); if (!el) return; const a = el.dataset.a, d = el.dataset, u = U();
    if (a === "bg" && e.target !== el) return;
    if (a === "go") { S.view = d.v; S.open = null; S.err = ""; S.why = ""; scrollTo(0, 0) }
    else if (a === "wk") S.wk += +d.d;
    else if (a === "open") { S.open = +d.i; S.q = Math.min(2, Math.max(1, left(+d.i))) }
    else if (a === "close" || a === "bg") S.open = null;
    else if (a === "tab") { S.tab = d.t; S.err = "" }
    else if (a === "sg") tg(S.f.gen, d.g);
    else if (a === "signup") {
        const n = (S.f.name || "").trim(), m = (S.f.email || "").trim().toLowerCase();
        if (n.length < 2) S.err = "Ingresá tu nombre (mínimo 2 letras)."; else if (!/^\S+@\S+\.\S+$/.test(m)) S.err = "Ingresá un email válido."; else if (db.acc[m]) S.err = "Ese email ya tiene usuario. Probá con “Ya tengo usuario”.";
        else { db.acc[m] = seed(n, m, S.f.gen.length ? [...S.f.gen] : ["Drama", "Ciencia ficción"]); db.ses = m; save(); S.err = ""; S.why = ""; S.view = "me"; S.f = { gen: [] }; toast("¡Bienvenido/a, " + n.split(" ")[0] + "! Tu perfil está listo.") }
    }
    else if (a === "login") { const m = (S.f.lemail || "").trim().toLowerCase(); if (db.acc[m]) { db.ses = m; save(); S.err = ""; S.why = ""; S.view = "me"; toast("Sesión iniciada") } else S.err = "No encontramos ese email. ¿Querés crear tu usuario?" }
    else if (a === "out") { db.ses = null; save(); S.view = "home"; toast("Sesión cerrada") }
    else if (a === "vote") { if (need("Para votar necesitamos saber quién sos: tu voto queda guardado en tu perfil.")) { u.votes[S.open] = +d.n; act(`Votó ${d.n} ★ a ${F[S.open].t}`); save(); toast("Voto guardado: " + d.n + " ★") } }
    else if (a === "fav") { if (need("Para guardar favoritas necesitás tu usuario: así las ves en tu perfil.")) { const i = S.open; tg(u.fav, i); act((u.fav.includes(i) ? "Guardó en favoritas " : "Quitó de favoritas ") + F[i].t); save(); toast(u.fav.includes(i) ? "Guardada en favoritas" : "Quitada de favoritas") } }
    else if (a === "no") { if (need("El filtro “No me interesa” es personal: necesitamos tu usuario para recordarlo.")) { const i = S.open; tg(u.no, i); save(); toast(u.no.includes(i) ? "Descartada solo para vos" : "Vuelve a mostrarse") } }
    else if (a === "q") S.q = Math.max(1, Math.min(MAXQ, left(S.open), S.q + +d.d));
    else if (a === "book") {
        if (!need("Para reservar necesitás tu usuario: así guardamos tus entradas y podés consultarlas o cancelarlas.")) return render();
        S.busy = true; render(); setTimeout(() => { const u = U(); S.busy = false; u.res.push({ id: u.rid++, i: S.open, q: S.q, st: "Confirmada" }); act(`Reservó ${S.q} entrada${S.q > 1 ? "s" : ""} para ${F[S.open].t}`); save(); toast("Reserva confirmada ✓"); S.open = null; S.view = "me"; render() }, 700); return
    }
    else if (a === "pv") { if (need("Para votar la próxima función necesitás tu usuario: hay un voto por socio.")) { u.pv = +d.k; act("Votó " + POLL[+d.k][0] + " en la votación comunitaria"); save(); toast("Voto registrado") } }
    else if (a === "mcom") { if (need("Para comentar necesitás tu usuario: tu comentario queda asociado a tu perfil.")) { const t = (S.f.mc || "").trim(); if (t.length < 10) toast("Escribí un comentario de al menos 10 caracteres"); else { u.recs.unshift({ i: S.open, txt: t, d: "hoy" }); act("Comentó " + F[S.open].t); S.f.mc = ""; save(); toast("Comentario publicado") } } }
    else if (a === "cx") S.cf = +d.id; else if (a === "cno") S.cf = null;
    else if (a === "cok") { const r = u.res.find(r => r.id === +d.id); r.st = "Cancelada"; act("Canceló la reserva de " + F[r.i].t); S.cf = null; save(); toast("Reserva cancelada") }
    else if (a === "pg") { tg(u.gen, d.g); save() }
    else if (a === "rec") { const t = (S.f.rt || "").trim(); if (t.length < 10) S.err = "Escribí un comentario de al menos 10 caracteres."; else { const i = +(S.f.rf || 0); u.recs.unshift({ i, txt: t, d: "hoy" }); act("Recomendó " + F[i].t); S.f.rt = ""; S.err = ""; save(); toast("Recomendación publicada") } }
    else if (a === "drec") { u.recs.splice(+d.x, 1); save(); toast("Recomendación eliminada") }
    render()
});
document.addEventListener("keydown", e => { if (e.key === "Escape" && S.open != null) { S.open = null; render() } });
render();
