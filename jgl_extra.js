// ===== JGL Construcciones · Portal según el Programa de Trabajo Preventivo (12-11-2026) =====
// El portal tiene la estructura completa, pero solo se habilitan las capacitaciones del programa de la empresa, cada una desde su mes.
// El servidor manda el programa (pestaña "Plan del portal" de la nómina). PUNTUAL = solo el programa; COMPLETO = todo.
// Lo que aún no corresponde se ve con "Desde <mes>"; lo que no está en el programa, con "No disponible". Daniel (administrador) abre todo.
(function () {
  if (window.__jglPlan) return; window.__jglPlan = true;
  const $ = id => document.getElementById(id);
  const PROG0 = [['induccion', '12-11-2026'], ['jgl_dif_miper', '12-11-2026'], ['jgl_epp', '12-11-2026'], ['jgl_riohs', '01-12-2026'], ['jgl_proc', '01-12-2026'], ['jgl_altura', '01-12-2026'], ['karin', '01-12-2026'], ['jgl_caliente', '01-02-2027'], ['jgl_izaje', '01-04-2027'], ['jgl_cargas', '01-06-2027']];
  const BASE = { tipo: 'PUNTUAL', vence: '', prog: PROG0.map(([id, desde]) => ({ id, desde })) };
  const MES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const fms = (f, fin) => { const m = String(f || '').match(/(\d{1,2})-(\d{1,2})-(\d{4})/); return m ? new Date(+m[3], +m[2] - 1, +m[1], fin ? 23 : 0, fin ? 59 : 0, 0).getTime() : 0; };
  const mesTxt = f => { const m = String(f || '').match(/(\d{1,2})-(\d{1,2})-(\d{4})/); return m ? MES[+m[2] - 1] + ' de ' + m[3] : ''; };
  const plan = () => { let p = null; try { p = (typeof RUTA !== 'undefined' && RUTA && RUTA.plan) || window.__jglPlanSrv; } catch (e) {} return p && p.prog ? p : BASE; };
  const esAdmin = () => { try { return !!(RUTA && RUTA.jefe === 'admin'); } catch (e) { return false; } };
  const vencido = () => { const v = fms(plan().vence, true); return !!v && Date.now() > v; };
  const completo = () => String(plan().tipo).toUpperCase() === 'COMPLETO';
  // estado de una capacitación: 'ok' (habilitada), 'prog' (del programa, aún no llega su mes) o 'no' (no está en el programa)
  window.jglEstado = function (id) {
    if (esAdmin()) return 'ok';
    if (vencido()) return 'fin';
    if (completo()) return 'ok';
    const x = (plan().prog || []).find(p => p.id === id); if (!x) return 'no';
    return !x.desde || Date.now() >= fms(x.desde) ? 'ok' : 'prog';
  };
  window.jglActiva = id => window.jglEstado(id) === 'ok';
  const desde = id => { const x = (plan().prog || []).find(p => p.id === id); return x ? x.desde : ''; };

  // el programa llega con la respuesta del servidor (historial): se guarda en RUTA.plan
  const F0 = window.fetch;
  window.fetch = function (u) {
    const pr = F0.apply(this, arguments);
    try { if (typeof u === 'string' && /[?&]historial=/.test(u)) pr.then(r => r.clone().json()).then(d => { if (d && d.plan) { window.__jglPlanSrv = d.plan; setTimeout(() => { try { if (RUTA) { RUTA.plan = d.plan; localStorage.setItem('jgl_cap_ruta', JSON.stringify(RUTA)); } if ($('s-home').classList.contains('on')) renderHome(); } catch (e) {} }, 0); } }).catch(() => {}); } catch (e) {}
    return pr;
  };

  // solo lo habilitado cuenta para "Mi plan" y "Su charla de ahora"
  const esMia0 = esMia;
  esMia = function (t) { return esMia0(t) && window.jglActiva(t.id); };
  const cA0 = calcAvance;
  calcAvance = function () { const A = cA0.apply(this, arguments); try { if (A && !window.jglActiva('ds44')) { A.ds44ok = true; A.ds44Atr = false; } } catch (e) {} return A; };

  const css = document.createElement('style');
  css.textContent = ['.tcard.jglLock, .tcard.jglProg { position:relative; }',
    '.tcard.jglLock { filter:grayscale(.85); opacity:.75; }',
    '.tcard .jglTag { position:absolute; left:8px; right:8px; top:38%; background:rgba(17,17,17,.88); color:#FFB228; font-weight:bold; font-size:12px; border-radius:10px; padding:6px; text-align:center; pointer-events:none; }',
    '.tcard.jglProg .jglTag { background:rgba(176,122,10,.95); color:#fff; }',
    'body.jglNoDS #bDS44 { filter:grayscale(.85); opacity:.85; position:relative; }',
    'body.jglNoDS #bDS44::after { content:\'🔒 No disponible\'; position:absolute; right:10px; bottom:8px; background:rgba(17,17,17,.88); color:#FFB228; font-weight:bold; font-size:11.5px; border-radius:10px; padding:5px 8px; }',
    '#jglModal { display:none; position:fixed; inset:0; background:rgba(10,10,10,.78); z-index:10001; align-items:center; justify-content:center; padding:16px; }',
    '#jglModal.on { display:flex; } #jglModal .bx { background:#fff; color:#1F2328; border-radius:18px; padding:20px; max-width:400px; width:100%; text-align:center; border-top:8px solid #FFB228; display:flex; flex-direction:column; gap:10px; }',
    '#jglModal .ic { font-size:44px; line-height:1; } #jglModal h3 { margin:0; font-size:21px; } #jglModal p { margin:0; color:#30363D; font-size:15.5px; line-height:1.4; }',
    '.jglPlanBox { background:#FFF7E6; border:2px solid #FFB228; border-radius:14px; padding:12px; color:#1F2328; margin:0 0 12px; }',
    '.jglPlanBox .pt { font-weight:bold; font-size:15px; margin-bottom:8px; }',
    '.jglPlanBox .pr { display:flex; align-items:center; gap:10px; padding:7px 0; border-top:1px dashed #E8D3A3; font-size:14px; line-height:1.3; }',
    '.jglPlanBox .pr:first-of-type { border-top:0; } .jglPlanBox .pm { flex:0 0 78px; font-weight:bold; color:#7A5200; font-size:12.5px; text-transform:capitalize; }',
    '.jglPlanBox .pn { flex:1; } .jglPlanBox .ps { flex:0 0 auto; font-size:12px; font-weight:bold; border-radius:10px; padding:3px 8px; }',
    '.jglPlanBox .ps.ok { background:#2E7D32; color:#fff; } .jglPlanBox .ps.ya { background:#FFB228; color:#161618; } .jglPlanBox .ps.prox { background:#ECEFF1; color:#4A5568; }'].join('\n');
  document.head.appendChild(css);

  function aviso(id) {
    const t = TOPICS.find(x => x.id === id), nombre = id === 'ds44' ? 'El Curso DS 44 (8 horas)' : (t ? t.title : 'Esta capacitación');
    const e = window.jglEstado(id);
    let m = $('jglModal'); if (!m) { m = document.createElement('div'); m.id = 'jglModal'; document.body.appendChild(m); }
    const h = e === 'fin' ? 'Acceso finalizado' : e === 'prog' ? 'Capacitación programada' : 'No disponible';
    const p = e === 'fin' ? 'El acceso de su empresa al portal de capacitación finalizó. Sus diplomas ya emitidos siguen siendo válidos.'
      : e === 'prog' ? '<b>' + nombre + '</b> está programada para <b>' + mesTxt(desde(id)) + '</b>. Ese mes se habilitará aquí para que la realice.'
      : '<b>' + nombre + '</b> no está habilitada para su empresa.';
    m.innerHTML = '<div class="bx"><div class="ic">' + (e === 'prog' ? '📅' : '🔒') + '</div><h3>' + h + '</h3><p>' + p + '</p>'
      + (e === 'prog' ? '' : '<p style="font-size:14px;color:#6B7280">Para más información, consulte con su jefatura.</p>')
      + '<button class="btn" id="jglOk">Entendido</button></div>';
    m.className = 'on'; $('jglOk').onclick = () => { m.className = ''; };
    try { VOZ.say(e === 'prog' ? 'Esta capacitación está programada para ' + mesTxt(desde(id)) + '.' : e === 'fin' ? 'El acceso de su empresa al portal finalizó.' : 'Esta capacitación no está habilitada para su empresa.'); } catch (x) {}
  }
  window.jglAviso = aviso;

  const pick0 = pickTopic;
  pickTopic = function (id) { if (!window.jglActiva(id)) return aviso(id); return pick0.apply(this, arguments); };
  const ds0 = openDS44;
  openDS44 = function () { if (!window.jglActiva('ds44')) return aviso('ds44'); return ds0.apply(this, arguments); };
  const bD = $('bDS44'); if (bD) bD.onclick = () => openDS44();

  const marcar = () => {
    try {
      document.querySelectorAll('.tcard[data-id]').forEach(b => {
        if (b.dataset.id === 'psicosocial') { b.style.display = 'none'; return; }   // a JGL no le aplica
        const e = window.jglEstado(b.dataset.id); b.classList.toggle('jglLock', e === 'no' || e === 'fin'); b.classList.toggle('jglProg', e === 'prog');
        let g = b.querySelector('.jglTag'); if (e === 'ok') { if (g) g.remove(); return; }
        if (!g) { g = document.createElement('span'); g.className = 'jglTag'; b.appendChild(g); }
        g.textContent = e === 'prog' ? '📅 Desde ' + mesTxt(desde(b.dataset.id)) : '🔒 No disponible';
        b.onclick = () => pickTopic(b.dataset.id);
      });
      document.body.classList.toggle('jglNoDS', !window.jglActiva('ds44'));
      const r = $('ruta'); let box = $('jglPlanBox');
      if (r && RUTA && RUTA.persona && !completo() && !esAdmin()) {
        if (!box) { box = document.createElement('div'); box.id = 'jglPlanBox'; box.className = 'jglPlanBox'; r.parentNode.insertBefore(box, r.nextSibling); }
        if (vencido()) box.innerHTML = '🔒 El acceso de su empresa al portal finalizó. Sus diplomas siguen siendo válidos.';
        else { const ap = (RUTA && RUTA.aprob) || {};
          box.innerHTML = '<div class="pt">📅 Su programa de capacitación</div>' + (plan().prog || []).map(x => { const t = TOPICS.find(y => y.id === x.id); if (!t) return '';
            const st = ap[x.id] ? '<span class="ps ok">✔ Realizada</span>' : window.jglActiva(x.id) ? '<span class="ps ya">Le toca</span>' : '<span class="ps prox">Próxima</span>';
            return '<div class="pr"><span class="pm">' + mesTxt(x.desde).replace(' de ', ' ') + '</span><span class="pn">' + t.title + '</span>' + st + '</div>'; }).join(''); }
      } else if (box) box.remove();
    } catch (e) {}
  };
  const rh0 = renderHome;
  renderHome = function () { const v = rh0.apply(this, arguments); marcar(); return v; };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', marcar); else setTimeout(marcar, 0);
})();
