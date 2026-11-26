/* Nombre de pila para saludos y voz. Reconoce si el nombre guardado viene como "Nombre Apellido" o "Apellido Apellido Nombre Nombre". Los diplomas y planillas no cambian. */
(function () {
  var N = ('adolfo adriana agustin agustina alan albert alberto alejandra alejandro alexander alexandra alexis alfonso alfredo alicia alison alonso alvaro amanda amaya ana andrea andres angel angela angelica anibal antonella antonia antonio arturo barbara beatriz belen benjamin bernardo bianca blanca brayan brian camila camilo carla carlos carmen carolina catalina cecilia cesar claudia claudio cristian cristina cristobal damian daniel daniela dario david débora debora denisse diego dominique eduardo elena eliana elias eliseo elisa eliset elizabeth emilia emilio enrique erica erika ernesto esteban estefania eugenio eva evelyn fabian fabiola felipe fernanda fernando flavio florencia francisca francisco franco gabriel gabriela gaspar georgina gerardo german giuliano gladys gloria gonzalo graciela guillermo gustavo hector hernan hugo humberto ignacio ignacia ingrid irene isabel isabella ivan ivette jaime jacqueline javier javiera jeannette jenny jeremias jesus joaquin johana johanna jonathan jonny jorge jose josefa josefina juan judith julia julian juliana julio karen karina karla katherine katherina katia kevin lorena lorenzo lucas lucia luciano luis luisa luz macarena manuel marcela marcelo marcial marco marcos margarita maria mariana mariano marianela mario marisol marta martin martina mateo matias mauricio maximiliano maximo mayra melanie melissa mercedes michael miguel mirta mirko monica nadia natalia nataly natalie nelson nestor nicolas nicole noelia norma olga oliver oscar pablo pamela paola patricio patricia paula paulina pedro priscila rafael rafaela ramon raul rebeca renato ricardo roberto robinson rocio rodolfo rodrigo rolando romina ronald rosa rosario ruben salvador samuel sandra santiago sara sebastian sergio silvana silvia sofia soledad sonia stefany susana tamara tatiana teresa tomas valentina valentin valeria vanessa veronica vicente victor victoria viviana waldo walter wilson ximena yanet yasna yessica yolanda yuri zoila').split(' ');
  var S = {}; N.forEach(function (n) { if (n) S[n] = 1; });
  function sin(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }
  function es(w) { return !!S[sin(w)]; }
  /* orden: 'AN' = Apellido Nombre, 'NA' = Nombre Apellido, 'auto' = deducirlo */
  window.NOMBRE_ORDEN = window.NOMBRE_ORDEN || 'auto';
  window.nombrePila = function (full) {
    var t = String(full || '').trim().split(/\s+/).filter(Boolean);
    if (!t.length) return '';
    if (t.length === 1) return t[0];
    var o = window.NOMBRE_ORDEN, L = t.length;
    var primeroAN = function () { return L >= 4 ? t[L - 2] : t[L - 1]; };   /* Ap Ap Nom Nom | Ap Ap Nom | Ap Nom */
    if (o === 'AN') return primeroAN();
    if (o === 'NA') return t[0];
    var a = es(t[0]);
    var b = es(t[L - 1]) || (L >= 4 && es(t[L - 2]));
    if (a && !b) return t[0];
    if (b && !a) return primeroAN();
    return window.NOMBRE_ORDEN_BASE === 'AN' ? primeroAN() : t[0];
  };
})();
