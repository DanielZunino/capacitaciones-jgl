// ===== JGL Construcciones · Pack por suscripción (12-11-2026) =====
// El portal tiene la estructura completa, pero solo funcionan las capacitaciones que la empresa tiene contratadas.
// El plan lo manda el servidor (pestaña "Suscripción" de la nómina): PUNTUAL = solo las habilitadas (hoy, la Inducción); COMPLETO = todo.
// Las demás charlas y el curso DS 44 se ven, pero con candado: "Disponible con suscripción".
// Daniel (administrador) ve y puede abrir todo, para revisar las charlas.
(function () {
  if (window.__jglPlan) return; window.__jglPlan = true;
  const $ = id => document.getElementById(id);
  const BASE = { tipo: 'PUNTUAL', activas: ['induccion'], vence: '' };
  const fms = f => { const m = String(f || '').match(/(\d{1,2})-(\d{1,2})-(\d{4})/); return m ? new Date(+m[3], +m[2] - 1, +m[1], 23, 59, 59).getTime() : 0; };
  const plan = () => { try { return (typeof RUTA !== 'undefined' && RUTA && RUTA.plan) || window.__jglPlanSrv || BASE; } catch (e) { return BASE; } };
  const esAdmin = () => { try { return !!(RUTA && RUTA.jefe === 'admin'); } catch (e) { return false; } };
  const vencido = () => { const v = fms(plan().vence); return !!v && Date.now() > v; };
  window.jglActiva = function (id) {
    if (esAdmin()) return true;
    const p = plan(); if (vencido()) return false;
    if (String(p.tipo).toUpperCase() === 'COMPLETO') return true;
    return (p.activas || []).indexOf(id) >= 0;
  };

  // el plan llega con la respuesta del servidor (historial): se guarda en RUTA.plan
  const F0 = window.fetch;
  window.fetch = function (u) {
    const pr = F0.apply(this, arguments);
    try { if (typeof u === 'string' && /[?&]historial=/.test(u)) pr.then(r => r.clone().json()).then(d => { if (d && d.plan) { window.__jglPlanSrv = d.plan; setTimeout(() => { try { if (RUTA) { RUTA.plan = d.plan; localStorage.setItem('jgl_cap_ruta', JSON.stringify(RUTA)); } if ($('s-home').classList.contains('on')) renderHome(); } catch (e) {} }, 0); } }).catch(() => {}); } catch (e) {}
    return pr;
  };

  // solo las charlas habilitadas cuentan para "Mi plan" y "Su charla de ahora"
  const esMia0 = esMia;
  esMia = function (t) { return esMia0(t) && window.jglActiva(t.id); };
  // sin el DS 44 contratado, el curso no aparece como pendiente en "Lo que te toca este mes"
  const cA0 = calcAvance;
  calcAvance = function () { const A = cA0.apply(this, arguments); try { if (A && !window.jglActiva('ds44')) { A.ds44ok = true; A.ds44Atr = false; } } catch (e) {} return A; };

  const css = document.createElement('style');
  css.textContent = ['.tcard.jglLock { position:relative; filter:grayscale(.85); opacity:.78; }',
    '.tcard.jglLock::after { content:\'🔒 Disponible con suscripción\'; position:absolute; left:8px; right:8px; top:38%; background:rgba(17,17,17,.88); color:#FFB228; font-weight:bold; font-size:11.5px; border-radius:10px; padding:6px 6px; text-align:center; }',
    'body.jglNoDS #bDS44 { filter:grayscale(.85); opacity:.85; position:relative; }',
    'body.jglNoDS #bDS44::after { content:\'🔒 Disponible con suscripción\'; position:absolute; right:10px; bottom:8px; background:rgba(17,17,17,.88); color:#FFB228; font-weight:bold; font-size:11.5px; border-radius:10px; padding:5px 8px; }',
    '#jglModal { display:none; position:fixed; inset:0; background:rgba(10,10,10,.78); z-index:10001; align-items:center; justify-content:center; padding:16px; }',
    '#jglModal.on { display:flex; } #jglModal .bx { background:#fff; color:#1F2328; border-radius:18px; padding:20px; max-width:400px; width:100%; text-align:center; border-top:8px solid #FFB228; display:flex; flex-direction:column; gap:10px; }',
    '#jglModal .ic { font-size:44px; line-height:1; } #jglModal h3 { margin:0; font-size:21px; } #jglModal p { margin:0; color:#30363D; font-size:15.5px; line-height:1.4; }',
    '.jglPlanBox { background:#FFF7E6; border:2px solid #FFB228; border-radius:14px; padding:10px 12px; color:#1F2328; font-size:14px; line-height:1.35; margin:0 0 12px; }'].join('\n');
  document.head.appendChild(css);

  function avisoLock(nombre) {
    let m = $('jglModal'); if (!m) { m = document.createElement('div'); m.id = 'jglModal'; document.body.appendChild(m); }
    const fin = vencido();
    m.innerHTML = '<div class="bx"><div class="ic">🔒</div><h3>' + (fin ? 'Acceso finalizado' : 'Disponible con suscripción') + '</h3>'
      + '<p>' + (fin ? 'El acceso de su empresa al portal de capacitación finalizó. Sus diplomas ya emitidos siguen siendo válidos.' : '<b>' + (nombre || 'Esta capacitación') + '</b> forma parte del Programa de Capacitación completo. Por ahora su empresa tiene habilitada la <b>Inducción de Prevención de Riesgos</b>.') + '</p>'
      + '<p style="font-size:14px;color:#6B7280">Para más información, consulte con su jefatura.</p>'
      + '<button class="btn" id="jglOk">Entendido</button></div>';
    m.className = 'on'; $('jglOk').onclick = () => { m.className = ''; };
    try { VOZ.say(fin ? 'El acceso de su empresa al portal finalizó.' : 'Esta capacitación está disponible con la suscripción. Por ahora su empresa tiene habilitada la inducción.'); } catch (e) {}
  }
  window.jglAvisoLock = avisoLock;

  // abrir una charla bloqueada o el DS 44 muestra el aviso
  const pick0 = pickTopic;
  pickTopic = function (id) {
    if (!window.jglActiva(id)) { const t = TOPICS.find(x => x.id === id); return avisoLock(t && t.title); }
    return pick0.apply(this, arguments);
  };
  const ds0 = openDS44;
  openDS44 = function () { if (!window.jglActiva('ds44')) return avisoLock('El Curso DS 44 (8 horas)'); return ds0.apply(this, arguments); };
  const bD = $('bDS44'); if (bD) bD.onclick = () => openDS44();

  // candados en las tarjetas después de cada dibujo del inicio
  const marcar = () => {
    try {
      document.querySelectorAll('.tcard[data-id]').forEach(b => { const on = window.jglActiva(b.dataset.id); b.classList.toggle('jglLock', !on); if (!on) b.onclick = () => pickTopic(b.dataset.id); });
      document.body.classList.toggle('jglNoDS', !window.jglActiva('ds44'));
      const r = $('ruta'); let box = $('jglPlanBox');
      const p = plan(), completo = String(p.tipo).toUpperCase() === 'COMPLETO';
      if (r && RUTA && RUTA.persona && !completo && !esAdmin()) {
        if (!box) { box = document.createElement('div'); box.id = 'jglPlanBox'; box.className = 'jglPlanBox'; r.parentNode.insertBefore(box, r.nextSibling); }
        box.innerHTML = vencido() ? '🔒 El acceso de su empresa al portal finalizó. Sus diplomas siguen siendo válidos.'
          : '✅ Su empresa tiene habilitada la <b>Inducción de Prevención de Riesgos</b>. Las demás capacitaciones aparecen con 🔒 y se habilitan con la suscripción al Programa de Capacitación.';
      } else if (box) box.remove();
    } catch (e) {}
  };
  const rh0 = renderHome;
  renderHome = function () { const v = rh0.apply(this, arguments); marcar(); return v; };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', marcar); else setTimeout(marcar, 0);
})();
