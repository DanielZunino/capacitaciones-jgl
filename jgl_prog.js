// ===== JGL Construcciones · Programa de capacitación del pack (12-11-2026) =====
// Basado en el "Programa de Trabajo Preventivo Constructora JGL 2026-2027": Inducción IRL (nov), charla 1 y Ley Karin (dic),
// charla 2 (feb), charla 3 (abr), charla 4 (jun). Cada charla del programa se arma con las láminas y preguntas de las charlas del portal.
(function () {
  if (window.__jglProg) return; window.__jglProg = true;
  const T = id => TOPICS.find(x => x.id === id);
  const L = (id, idx) => { const t = T(id); return t ? (idx ? idx.map(i => t.learn[i]).filter(Boolean) : t.learn.slice()) : []; };
  const Q = (id, n) => { const t = T(id); return t ? t.quiz.slice(0, n || t.quiz.length) : []; };
  const O = (q, o, w) => ({ q, o, a: 0, w }), V = (q, vf, w) => ({ q, vf, w });
  const clima = [
    { s: 'emergencias_tipos', t: 'Viento, lluvia y tormenta', x: 'Con <b>viento fuerte, lluvia o tormenta eléctrica</b> se suspende el trabajo en altura, el izaje y el montaje de estructuras. Revisa el pronóstico al empezar la jornada y <b>baja de la estructura</b> ante cualquier cambio brusco del clima.' },
    { s: 'pz_acopio', t: 'Estructuras aseguradas', x: 'Las estructuras que quedan sin terminar se aseguran con <b>arriostres, vientos y anclajes provisorios</b>. Planchas y materiales sueltos se amarran o se bajan: el viento los convierte en proyectiles.' }];
  const climaQ = [
    Object.assign({ s: 'emergencias_tipos' }, O('Estás montando una cercha y empieza un viento muy fuerte. ¿Qué se hace?', ['Se suspende el montaje y se baja de la estructura', 'Se termina rápido la pieza', 'Se sigue con más cuidado', 'Se sigue si el arnés está conectado'], 'Con viento fuerte se suspende el montaje y el trabajo en altura.'),
      { v: [O('Comienza una tormenta eléctrica mientras trabajas en altura. ¿Qué haces?', ['Bajo de la estructura de inmediato', 'Me quedo quieto arriba', 'Sigo soldando', 'Me abrazo a la viga'], 'Ante tormenta eléctrica se baja de inmediato.'),
        O('¿Qué haces al inicio de cada jornada de montaje?', ['Reviso el pronóstico del clima', 'Nada especial', 'Solo reviso el celular', 'Pregunto la hora'], 'Revisar el pronóstico permite planificar y suspender a tiempo.')] }),
    Object.assign({ s: 'pz_acopio' }, O('Al final del día una estructura quedó sin terminar. ¿Cómo se deja?', ['Asegurada con arriostres, vientos y anclajes provisorios', 'Suelta, se termina mañana', 'Apoyada en el andamio', 'Amarrada con alambre delgado'], 'Se asegura provisoriamente para que el viento no la derribe.'),
      { v: [O('Hay planchas sueltas en la estructura y se anuncia viento fuerte. ¿Qué haces?', ['Las amarro o las bajo', 'Las dejo, pesan mucho', 'Las apilo en el borde', 'Les pongo una piedra encima'], 'El viento convierte el material suelto en proyectil.'),
        V('El viento fuerte puede derribar una estructura que no está arriostrada.', true, 'Verdadero: por eso se asegura con arriostres y vientos.')] })];
  const P = [
    { id: 'jgl_altura', title: 'Trabajo en altura, andamios y arnés', thumb: 'pz_alt_arnes', dur: 45, learn: () => L('altura').concat(L('andamios')), quiz: () => Q('altura').concat(Q('andamios')),
      obj: 'Prevenir caídas de altura en el montaje de galpones y obras: protección colectiva, andamios, escalas y uso del arnés.', n: ['D.S. 594/1999 MINSAL.', 'Ley 16.744.', 'NCh 1258 (sistemas de detención de caídas) y NCh 998 (andamios).', 'Procedimiento de trabajo en altura de la empresa.'] },
    { id: 'jgl_caliente', title: 'Trabajos en caliente e incendio', thumb: 'pz_cal_ok', dur: 40, learn: () => L('caliente').concat(L('incendios', [0, 3, 4, 5, 6, 7, 8])), quiz: () => Q('caliente').concat(Q('incendios')),
      obj: 'Prevenir quemaduras, incendios y explosiones en soldadura y oxicorte, y saber actuar ante un amago de incendio.', n: ['D.S. 594/1999 MINSAL, arts. 44 a 52 (prevención y protección contra incendios).', 'Ley 16.744.', 'Procedimiento de trabajos en caliente de la empresa.'] },
    { id: 'jgl_izaje', title: 'Izaje, maquinaria, excavaciones y líneas eléctricas', thumb: 'pz_izaje_ok', dur: 50,
      learn: () => L('izaje').concat(L('maquinaria', [0, 3, 4, 5, 7]), L('excavaciones', [0, 2, 3, 4, 7]), L('electrico', [0, 1, 3, 6, 7])),
      quiz: () => Q('izaje', 6).concat(Q('maquinaria', 4), Q('excavaciones', 4), Q('electrico', 4)),
      obj: 'Controlar los riesgos críticos del izaje con camión pluma, la maquinaria, las excavaciones y la cercanía de líneas eléctricas.', n: ['D.S. 594/1999 MINSAL.', 'Ley 16.744.', 'NCh 349 (excavaciones) y NCh 4 Elec. (instalaciones eléctricas).', 'Procedimientos de izaje, excavaciones, líneas eléctricas y maquinaria de la empresa.'] },
    { id: 'jgl_cargas', title: 'Manejo manual de cargas, radiación UV y clima', thumb: 'c5ca_limites', dur: 40, learn: () => L('cargas').concat(L('uv'), clima), quiz: () => Q('cargas').concat(Q('uv', 6), climaQ),
      obj: 'Prevenir lesiones por manejo manual de cargas, daños por radiación UV y accidentes por condiciones climáticas adversas.', n: ['Código del Trabajo, arts. 211-F a 211-J (Ley 20.949).', 'Ley 20.096 y D.S. 594 (radiación UV).', 'Guía técnica de manejo manual de carga y protocolo de radiación UV (MINSAL).'] }];
  const armar = () => {
    P.forEach(p => {
      const learn = p.learn(), quiz = p.quiz(); if (!learn.length || !quiz.length) return;
      let t = T(p.id);
      if (!t) { t = { id: p.id, sec: 'todos', title: p.title, thumb: p.thumb, dur: p.dur, learn, quiz }; nuevoTema(t, { obj: p.obj, n: p.n }); }
      else { t.learn = learn; t.quiz = quiz; }
    });
  };
  try { armar(); } catch (e) { console.warn('[JGL programa]', e && e.message); }
  // las charlas de origen se actualizan con el contenido nuevo al terminar de cargar: se rearman igual
  const otra = () => { try { armar(); if (document.getElementById('s-home').classList.contains('on') && typeof renderHome === 'function') renderHome(); } catch (e) {} };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(otra, 50)); else setTimeout(otra, 50);
})();
