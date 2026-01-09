// script.js — versión con soporte para link de Facebook por delegación
// - Al hacer clic en una delegación, el modal mostrará (si existe)
//   un enlace de Facebook específico para esa delegación antes de la lista de miembros.
// - Si quieres, reemplaza las cadenas vacías en delegacionesData.[KEY].facebook
//   con las URLs reales de Facebook (ej. "https://facebook.com/mi-delegacion").
// - El resto de comportamiento (modal, galería, formulario, etc.) se mantiene.

(function () {
  'use strict';

  try {

  /* ---------------------------
     Utilidades para modales/overlay
     --------------------------- */
  const modalOverlay = document.getElementById('modal-overlay');

  function showOverlay() { if (modalOverlay) modalOverlay.style.display = 'block'; }
  function hideOverlay() { if (modalOverlay) modalOverlay.style.display = 'none'; }

  function openModalById(id) {
    const m = document.getElementById(id);
    if (!m) return;
    m.style.display = 'flex';
    m.setAttribute('aria-hidden', 'false');
    showOverlay();
    document.body.style.overflow = 'hidden';
    const focusable = m.querySelector('a, button, input, [tabindex]');
    if (focusable) focusable.focus();
  }

  function closeModalById(id) {
    const m = document.getElementById(id);
    if (!m) return;
    m.style.display = 'none';
    m.setAttribute('aria-hidden', 'true');
    hideOverlay();
    document.body.style.overflow = '';
  }

  function closeAllModals() {
    document.querySelectorAll('.modal[aria-hidden="false"]').forEach(m => {
      m.style.display = 'none';
      m.setAttribute('aria-hidden', 'true');
    });
    hideOverlay();
    document.body.style.overflow = '';
  }

  /* ---------------------------
     Tabs navigation & hamburger
     --------------------------- */
  function switchTab(tabName) {
    document.querySelectorAll('.tab-btn, .tab-btn-footer').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    document.querySelectorAll('.tab-section').forEach(sec => {
      sec.classList.toggle('active', sec.id === tabName);
      if (sec.id === tabName) {
        setTimeout(()=> { window.scrollTo({ top: 0, behavior: 'smooth' }); }, 10);
      }
    });
  }

  function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabBtnsFooter = document.querySelectorAll('.tab-btn-footer');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const t = btn.dataset.tab;
        if (t) switchTab(t);
      });
    });
    tabBtnsFooter.forEach(btn => {
      btn.addEventListener('click', () => {
        const t = btn.dataset.tab;
        if (t) switchTab(t);
      });
    });
  }

  function initHamburger() {
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    if (!hamburger || !nav) return;
    hamburger.addEventListener('click', () => {
      nav.classList.toggle('open');
      const expanded = nav.classList.contains('open');
      hamburger.setAttribute('aria-expanded', expanded);
    });
  }

  /* ---------------------------
     Hero animation + fade-ins
     --------------------------- */
  function initHeroAndFade() {
    setTimeout(() => {
      const hero = document.querySelector('.hero-content');
      if (hero) hero.classList.add('visible');
    }, 350);

    function handleFadeIns() {
      const fadeEls = document.querySelectorAll('.fade-in');
      fadeEls.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 60) el.classList.add('visible');
      });
    }
    window.addEventListener('scroll', handleFadeIns);
    handleFadeIns();
  }

  /* ---------------------------
     Emergency modal (unificado)
     --------------------------- */
  function initEmergency() {
    const emergenciaBtn = document.getElementById('emergencia-btn');
    const reportarBtn = document.getElementById('reportar-btn');
    const emergenciaModal = document.getElementById('emergencia-modal');
    const emergenciaModalClose = document.getElementById('emergencia-modal-close');

    if (emergenciaModal && emergenciaModal.getAttribute('aria-hidden') === 'true') emergenciaModal.style.display = 'none';

    function openEmergencia(e) {
      if (e) e.preventDefault();
      openModalById('emergencia-modal');
    }
    function closeEmergencia() {
      closeModalById('emergencia-modal');
    }

    if (emergenciaBtn) emergenciaBtn.addEventListener('click', openEmergencia);
    if (reportarBtn) reportarBtn.addEventListener('click', openEmergencia);
    if (emergenciaModalClose) emergenciaModalClose.addEventListener('click', closeEmergencia);
  }

  /* ---------------------------
     Join form: validación y envío a correo
     --------------------------- */
  function initJoinForm() {
    const joinForm = document.getElementById('join-form');
    const successMsg = document.getElementById('form-success');
    if (!joinForm) return;

    joinForm.addEventListener('submit', function (e) {
      e.preventDefault();

      this.querySelectorAll('.error-msg').forEach(el => el.textContent = '');

      let valid = true;
      const nombre = this.nombre;
      const correo = this.correo;
      const telefono = this.telefono;
      const delegacion = this.delegacion;
      const dispChecks = Array.from(this.querySelectorAll('input[name="disp[]"]:checked'));

      if (!nombre.value.trim()) { nombre.nextElementSibling.textContent = 'Ingresa tu nombre.'; valid = false; }
      if (!correo.value.trim() || !/\S+@\S+\.\S+/.test(correo.value)) { correo.nextElementSibling.textContent = 'Correo electrónico inválido.'; valid = false; }
      if (!telefono.value.trim() || !telefono.value.match(/^[0-9\s\-+()]{8,}$/)) { telefono.nextElementSibling.textContent = 'Teléfono inválido.'; valid = false; }
      if (!delegacion.value) { delegacion.nextElementSibling.textContent = 'Selecciona delegación.'; valid = false; }
      const dispError = this.querySelector('.disponibilidad .error-msg');
      if (dispChecks.length === 0) { if (dispError) dispError.textContent = 'Selecciona al menos una opción.'; valid = false; }

      if (!valid) return;

      const payload = {
        nombre: nombre.value.trim(),
        correo: correo.value.trim(),
        telefono: telefono.value.trim(),
        delegacion: delegacion.value,
        disponibilidad: dispChecks.map(i => i.value),
        mensaje: 'Solicitud de incorporación (formulario web)'
      };

      const to = 'cne.cen07@gmail.com';
      const subject = 'Solicitud de incorporación - CNE';
      const bodyLines = [
        `Nombre: ${payload.nombre}`,
        `Correo: ${payload.correo}`,
        `Teléfono: ${payload.telefono}`,
        `Delegación: ${payload.delegacion}`,
        `Disponibilidad: ${payload.disponibilidad.join(', ')}`,
        '',
        `Mensaje: ${payload.mensaje}`
      ];
      const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;

      try { window.open(mailto); } catch (err) { console.warn('No se pudo abrir mailto:', err); }

      this.reset();
      if (successMsg) { successMsg.style.display = 'block'; setTimeout(()=> successMsg.style.display = 'none', 5000); }

      fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      }).then(res => {
        if (!res.ok) return res.json().then(j => Promise.reject(j));
        return res.json();
      }).then(j => {
        console.info('POST /api/contact OK', j);
      }).catch(err => {
        console.warn('POST /api/contact falló (opcional):', err);
      });
    });
  }

  /* ---------------------------
     FAQ toggles
     --------------------------- */
  function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(btn => {
      btn.addEventListener('click', function() {
        const item = btn.parentElement;
        const open = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!open) item.classList.add('open');
      });
    });
  }

  /* ==========================================================================
     Delegaciones data (añadí campo opcional "facebook" a cada delegación)
     Rellena cada facebook: '' con la URL real si la tienes.
     ========================================================================== */
  const delegacionesData = {
    PETO: {
      nombre: "Peto, Yucatán",
      foto: "img/peto.jpg",
      facebook: "", // ej: "https://facebook.com/cne.peto"
      miembros: [
        { numeral: "301", cargo: "DELEGADO", nombre: "JOSÉ ANTONIO CIAU BRICEÑO" },
        { numeral: "302", cargo: "SUBDELEGADO", nombre: "JOSÉ ISAURO HOIL PAT" },
        { numeral: "303", cargo: "SECRETARIO", nombre: "VICTOR MANUEL CABRERA QUINTAL" },
        { numeral: "304", cargo: "TESORERO", nombre: "WILLIAM SANTOS CAACH" },
        { numeral: "305", cargo: "COMANDANTE", nombre: "CORNELIO CANUL PÉREZ" },
        { numeral: "306", cargo: "SUBCOMANDANTE", nombre: "JOSÉ EMMANUEL CIAU ARANA" },
        { numeral: "307", cargo: "COMUNICACIONES", nombre: "GUIMEL ANTONIO CIAU ARANA" },
        { numeral: "308", cargo: "SOCIO ACTIVO", nombre: "RODOLFO SÁNCHEZ CRUZ" },
        { numeral: "310", cargo: "SOCIO ACTIVO", nombre: "MARLENE MOGUEL UC" },
        { numeral: "313", cargo: "SOCIO ACTIVO", nombre: "EMERZON ÁVALOS SARABIA" },
        { numeral: "314", cargo: "SOCIO ACTIVO", nombre: "ÁNGEL AUGUSTO RIVERO ESQUIVEL" },
        { numeral: "315", cargo: "SOCIO ACTIVO", nombre: "LUIS FERNANDO CASTILLO ESQUIVEL" }
      ]
    },
    PROGRESO: {
      nombre: "Progreso, Yucatán",
      foto: "img/progreso.jpg",
      facebook: "",
      miembros: [
        { numeral: "501", cargo: "DELEGADO", nombre: "ARTURO VALENTE PEREZ NUÑEZ" },
        { numeral: "503", cargo: "SECRETARIA", nombre: "PATRICIA ESTEFANY POOL SULUB" },
        { numeral: "504", cargo: "TESORERA", nombre: "ADDY ROSAURA NUÑEZ GONZALEZ" },
        { numeral: "505", cargo: "COMANDANTE", nombre: "JOSUE ARMANDO BLEE ALCAZAR" },
        { numeral: "507", cargo: "COMUNICACIONES", nombre: "JUAN RODRIGO RODRIGUEZ GOMEZ" },
        { numeral: "508", cargo: "VIALIDAD", nombre: "RICARDO ANTONIO FLORES TREJO" },
        { numeral: "510", cargo: "SOCORRISTA", nombre: "CARMEN MARISOL CHAVEZ IBARRA" },
        { numeral: "509", cargo: "PARAMEDICO", nombre: "CARLOS JESUS MOJON LUNA" },
        { numeral: "551", cargo: "ALFA", nombre: "CRISTIAN ARTURO PEREZ POOL" },
        { numeral: "553", cargo: "ALFA", nombre: "WENDY BEATRIZ FLORES MOLINA" }
      ]
    },
    PISTE: {
      nombre: "Pisté, Yucatán",
      foto: "img/piste.jpg",
      facebook: "",
      miembros: [
        { numeral: "601", cargo: "DELEGADA", nombre: "GLADEMI MARGARITA TUN PECH" },
        { numeral: "602", cargo: "SUBDELEGADO", nombre: "JESUS FRANCISCO TUN HERRERA" },
        { numeral: "603", cargo: "SECRETARIO", nombre: "JORGE EMMANUEL GONZALEZ MARRUFO" },
        { numeral: "563", cargo: "BRIGADA JUVENIL", nombre: "JAVIER DE JESUS DZIB PECH" },
        { numeral: "652", cargo: "BRIGADA JUVENIL", nombre: "MELISSA SAYURI DZIB TUN" }
      ]
    },
    FCP: {
      nombre: "Felipe Carrillo Puerto, Q. Roo",
      foto: "img/felipe_carrillo.jpg",
      facebook: "https://www.facebook.com/share/1CA6rXicPy/?mibextid=wwXIfr",
      miembros: [
        { numeral: "3001", cargo: "DELEGADO", nombre: "MARTIN JAVIER SAUCEDO AVILES" },
        { numeral: "3002", cargo: "SUBDELEGADO", nombre: "ANDY ADAM SULUB HERNÁNDEZ" },
        { numeral: "3003", cargo: "SECRETARIA", nombre: "CLAUDIA GUADALUPE UC PASOS" },
        { numeral: "3004", cargo: "TESORERO", nombre: "RIGEL FERNANDO HAU UEX" },
        { numeral: "3005", cargo: "COMANDANTE", nombre: "JUAN CARLOS MEDINA NOVELO" },
        { numeral: "3006", cargo: "SUBCOMANDANTE", nombre: "CESAR MARTINEZ SOSA" },
        { numeral: "3007", cargo: "RADIOCOMUNICACION", nombre: "ARNULFO MAY TZUC" },
        { numeral: "3008", cargo: "Vialidad", nombre: "Andy J. SULUB MARTIN" },
        { numeral: "3010", cargo: "SOCORRISTA", nombre: "MANUEL ANTONIO MUKUL NOH" },
        { numeral: "3011", cargo: "RESCATE", nombre: "RITA YANET MARTIN VAZQUEZ" },
        { numeral: "3012", cargo: "COMUNICACIONES", nombre: "JOSE EDILBERTO XIU YAM" },
        { numeral: "3013", cargo: "SOCIO ACTIVO", nombre: "ALEJANDRO ABRAHAM PUC" },
        { numeral: "3014", cargo: "SOCIO ACTIVO", nombre: "JUSTINO XUI CHAN" },
        { numeral: "3015", cargo: "SOCIO ACTIVO", nombre: "LOURDES DEL ROSARIO MENDOZA BRICEÑO" },
        { numeral: "3016", cargo: "SOCIO ACTIVO", nombre: "NOEMI DE LA CRUZ CASTILLO MOO" },
        { numeral: "3017", cargo: "SOCIO ACTIVO", nombre: "ZACARIAS PECH WITZIL" },
        { numeral: "3018", cargo: "SOCIO ACTIVO", nombre: "FRANCISCO EMMANUEL UC PASOS" },
        { numeral: "3019", cargo: "SOCIO ACTIVO", nombre: "CAROLINA ARACELI HOIL HEREDIA" },
        { numeral: "3020", cargo: "SOCIO ACTIVO", nombre: "KARLA SANABRIA ALBOR" },
        { numeral: "3021", cargo: "SOCIO ACTIVO", nombre: "JOSUE EFRAIN MONTALVO IBARRA" },
        { numeral: "3022", cargo: "SOCIO ACTIVO", nombre: "CESAR DOMINGO LOPEZ SALAZAR" },
        { numeral: "3023", cargo: "SOCIO ACTIVO", nombre: "JUAN CARLOS CHE SABA" },
        { numeral: "3024", cargo: "SOCIO ACTIVO", nombre: "RAUL ENRIQUE LOPEZ MORALES" },
        { numeral: "3025", cargo: "SOCIO ACTIVO", nombre: "RAUL EFRAIN LOPEZ MENDEZ" },
        { numeral: "3026", cargo: "SOCIO ACTIVO", nombre: "ANGELA GUADALUPE MAY GUZMAN" },
        { numeral: "3027", cargo: "SOCIO ACTIVO", nombre: "ISIDORA GUZMAN JIMENEZ" },
        { numeral: "3028", cargo: "SOCIO ACTIVO", nombre: "INGRID ESMERALDA PEREZ SOLIS" },
        { numeral: "3051", cargo: "BRIGADA JUVENIL", nombre: "PAOLY SIMEONE SAUCEDO UC" },
        { numeral: "3052", cargo: "BRIGADA JUVENIL", nombre: "ANDRE MIGUEL SULUB MARTIN" },
        { numeral: "3053", cargo: "BRIGADA JUVENIL", nombre: "YARETZY DAEMY GONZALEZ CASTILLO" },
        { numeral: "3054", cargo: "BRIGADA JUVENIL", nombre: "GABRIEL ELADIO UC DIAZ" }
      ]
    },
    CANCUN: {
      nombre: "Cancún, Q. Roo",
      foto: "img/cancun.jpg",
      facebook: "",
      miembros: [
        { numeral: "3101", cargo: "DELEGADO", nombre: "ROGER ALONSO OSORIO SALAZAR" },
        { numeral: "3102", cargo: "SUBDELEGADO", nombre: "ROBERTO JOEL FERNÁNDEZ ARREOLA" },
        { numeral: "3103", cargo: "SECRETARIA", nombre: "RAFAEL DZUL CHI" },
        { numeral: "3105", cargo: "COMANDANTE", nombre: "SILVIO FRANCISCO ONTIVEROS" },
        { numeral: "3106", cargo: "SUBCOMANDANTE", nombre: "BERNARDO CAAMAL POOT" },
        { numeral: "3107", cargo: "RADIOCOMUNICACION", nombre: "GUIDO MENDIBURU SOLIS" },
        { numeral: "3108", cargo: "VIALIDAD", nombre: "DAVID MUÑOZ RIVERA" },
        { numeral: "3112", cargo: "SOCIO ACTIVO", nombre: "WALTER FRANCISCO ONTIVEROS" },
        { numeral: "3113", cargo: "SOCIO ACTIVO", nombre: "FREDDY ANTHONY VAZQUEZ MORALES " },
        { numeral: "3114", cargo: "SOCIO ACTIVO", nombre: "CARLOS RUBEN ORDOÑES AGUILANDO" },
        { numeral: "3115", cargo: "SOCIO ACTIVO", nombre: "LEONARDO ERMILO VASQUEZ LORIAI" },
        { numeral: "3116", cargo: "SOCIO ACTIVO", nombre: "LUIS ALBERTO KAUIL PUC" },
        { numeral: "3151", cargo: "MOVILES EN TRANSITO", nombre: "AMILCAR ALONZO KUYOC CAB" }
      ]
    },
    BACALAR: {
      nombre: "Bacalar, Q. Roo",
      foto: "img/bacalar.jpg",
      facebook: "",
      miembros: [
        { numeral: "3201", cargo: "DELEGADO", nombre: "BRAULIO FRITZ AGUILAR" },
        { numeral: "3202", cargo: "SUBDELEGADO", nombre: "PEDRO FERNANDO SOLIS PANTI" },
        { numeral: "3203", cargo: "SECRETARIO", nombre: "MARCO ANTONIO CERVANTES MARIN" },
        { numeral: "3204", cargo: "TESORERO", nombre: "FREDY EDUARDO LEONIDES CANUL" },
        { numeral: "3205", cargo: "COMANDANTE", nombre: "TEODOCIO CRUZ MAY SALAS" },
        { numeral: "3206", cargo: "SUBCOMANDANTE", nombre: "BRENDA MARGARITA CHAN MOO" },
        { numeral: "3207", cargo: "RADIOCOMUNICACION", nombre: "RUFINO VERGARA AGUILERA" },
        { numeral: "3208", cargo: "VIALIDAD", nombre: "JASSIEL DE JESUS ROSADO BORGES" },
        { numeral: "3209", cargo: "JEFE AUXILIO MECANICO", nombre: "FELIPE JORGE THOMAS GUZMAN" },
        { numeral: "3210", cargo: "SOCORRISMO", nombre: "VICTOR ALEXANDER VELAZQUEZ" },
        { numeral: "3212", cargo: "COMUNICACIONES", nombre: "JOANA ARLET VERGARA QUIÑONEZ" },
        { numeral: "3213", cargo: "SOCIO ACTIVO", nombre: "FACUNDO RIVERA RAMIREZ" },
        { numeral: "3214", cargo: "SOCIO ACTIVO", nombre: "JAIME ORTEGA GARCIA " },
        { numeral: "3215", cargo: "SOCIO ACTIVO", nombre: "IVAN ROMERO DEL ANGEL" },
        { numeral: "3216", cargo: "SOCIO ACTIVO", nombre: "GUSTAVO ANTONIO POOL CAMARA" },
        { numeral: "3217", cargo: "SOCIO ACTIVO", nombre: "LAZARO RANGEL CELIS" },
        { numeral: "3218", cargo: "SOCIO ACTIVO", nombre: "JOSHUA ROMAN ROSADO BORGES " },
        { numeral: "3219", cargo: "SOCIO ACTIVO", nombre: "JAIRO ALBERTO PEREZ CAHUM" },
        { numeral: "3220", cargo: "SOCIO ACTIVO", nombre: "MARIA DEL CARMEN POMOL CANUL" },
        { numeral: "3221", cargo: "SOCIO ACTIVO", nombre: "LUIS ENRIQUE HERNANDEZ MIXTEGA" },
        { numeral: "3222", cargo: "SOCIO ACTIVO", nombre: "LLUVIA SARAI FERNANDEZ RANGEL" },
        { numeral: "3223", cargo: "SOCIO ACTIVO", nombre: "ANGELGABRIEL PABLO ARTUNAL" },
        { numeral: "3224", cargo: "SOCIO ACTIVO", nombre: "LUIS HERNANDEZ PABLO" },
        { numeral: "3225", cargo: "SOCIO ACTIVO", nombre: "MARIO ERNESTO RAMOS CRUZ" },
        { numeral: "3226", cargo: "SOCIO ACTIVO", nombre: "JAVIER JESUS SALGADO CHAVEZ" },
        { numeral: "3251", cargo: "BRIGADA JUVENIL", nombre: "JADE ADILENE VERGARA QUIÑONEZ" }
      ]
    },
    COZUMEL: {
      nombre: "Cozumel, Q. Roo",
      foto: "img/cozumel.jpg",
      facebook: "",
      miembros: [
        { numeral: "3301", cargo: "DELEGADO", nombre: "NOE GUADALUPE SAMARRIPA EUAN" },
        { numeral: "3302", cargo: "SUBDELEGADO", nombre: "TEDDY DE JESUS TUN ORTIZ" },
        { numeral: "3303", cargo: "SECRETARIO", nombre: "NESTOR ADRIAN LOEZA VAZQUEZ" },
        { numeral: "3304", cargo: "TESORERO", nombre: "WILIAM GABRIEL GUEMEZ VIDAL" },
        { numeral: "3305", cargo: "COMANDANTE", nombre: "MANUEL ROMAN ROSADO ZAVALEGUI" },
        { numeral: "3306", cargo: "SUBCOMANDANTE", nombre: "JULIO CESAR VILLAFAÑA GUTIERREZ" },
        { numeral: "3307", cargo: "RADIOCOMUNICACION", nombre: "ELIGIO CHAN MORENO" },
        { numeral: "3309", cargo: "AUXILIO MECANICO", nombre: "SAMUEL PEREZ DE LA ROSA" },
        { numeral: "3310", cargo: "SOCORRISMO", nombre: "DAVID JESUS TAH LARA" },
        { numeral: "3312", cargo: "COMUNICACIONES", nombre: "NELIA VICTORIA ARGAEZ AZCORRA" },
        { numeral: "3313", cargo: "SOCIO ACTIVO", nombre: "ANGEL BENITO VILLAFANIA GUTIERREZ" },
        { numeral: "3314", cargo: "SOCIO ACTIVO", nombre: "LEYVI SILIA AZCORRA CHAN" },
        { numeral: "3315", cargo: "SOCIO ACTIVO", nombre: "MARTIN ADRIAN JIMENEZ RAMIREZ" },
        { numeral: "3316", cargo: "SOCIO ACTIVO", nombre: "ROGER GASPAR SERRANO RODRIGUEZ" },
        { numeral: "3317", cargo: "SOCIO ACTIVO", nombre: "JUAN CARLOS ESTRADA GARCIA" },
        { numeral: "3318", cargo: "SOCIO ACTIVO", nombre: "JOSE ANTONIO CORAL ZAPATA" },
        { numeral: "3319", cargo: "SOCIO ACTIVO", nombre: "JENIFER ALEXA VILLAFAÑA MARTIN" },
        { numeral: "3320", cargo: "SOCIO ACTIVO", nombre: "FAUSTO ARIEL VALDES SOBERANIS" },
        { numeral: "3321", cargo: "SOCIO ACTIVO", nombre: "JANETTE MARLENE VILLAFAÑA MARTIN" },
        { numeral: "3322", cargo: "SOCIO ACTIVO", nombre: "JOEL GALAN JIMENEZ" },
        { numeral: "3351", cargo: "BRIGADA JUVENIL", nombre: "SAMUEL ABIEL PEREZ PACHECO" }
      ]
    },
    CHETUMAL: {
      nombre: "Chetumal, Q. Roo",
      foto: "img/chetumal.jpg",
      facebook: "",
      miembros: [
        { numeral: "3401", cargo: "DELEGADO", nombre: "JORGE ARIEL RIVERO JIMENEZ" },
        { numeral: "3402", cargo: "SUBDELEGADO", nombre: "ROMAN ROGERIO CHULIN DZUL" },
        { numeral: "3403", cargo: "SECRETARIO", nombre: "MARIA ELIDE MOO POOL" },
        { numeral: "3404", cargo: "TESORERO", nombre: "PERFECTO JESUS REYES ROSADO" },
        { numeral: "3405", cargo: "COMANDANTE", nombre: "MIGUEL ARCANGEL MEDINA PANTI" },
        { numeral: "3406", cargo: "SUBCOMANDANTE", nombre: "CLARA ALEJANDRA REYES CHULIN" },
        { numeral: "3407", cargo: "RADIOCOMUNICACION", nombre: "IRIS CECILIA AREVALO COCOM" },
        { numeral: "3408", cargo: "VIALIDAD", nombre: "LUIS ANGEL RIVERO JIMENEZ" },
        { numeral: "3409", cargo: "AUXILIO MECANICO", nombre: "JOSUE ROMAN CHULIN RIVERO" },
        { numeral: "3410", cargo: "SOCORRISTA", nombre: "DAVID EMMANUEL VAZQUEZ VERA" },
        { numeral: "3411", cargo: "RESCATE", nombre: "CARLOS ALBERTO CARDOZO COSGALLA" },
        { numeral: "3412", cargo: "COMUNICACIONES", nombre: "RAMIRO MATA CRUZ" },
        { numeral: "3413", cargo: "SOCIO ACTIVO", nombre: "ANA BERTHA RIVERO JIMENEZ" },
        { numeral: "3414", cargo: "SOCIO ACTIVO", nombre: "ELPIDIO GUTIERREZ NICOLAS" },
        { numeral: "3451", cargo: "BRIGADA JUVENIL", nombre: "DEREK ZAHIR VAZQUEZ AREVALO" },
        { numeral: "3452", cargo: "BRIGADA JUVENIL", nombre: "NOEMI ROSALBAKU CAB" },
        { numeral: "3453", cargo: "BRIGADA JUVENIL", nombre: "CARLA ALEJANDRA CAMBRANO MAYO" }
      ]
    },
    MERIDA: {
      nombre: "Mérida, Yucatán",
      foto: "img/merida.jpg",
      facebook: "",
      miembros: [
        { numeral: "UA1", cargo: "UNIDAD DE APOYO", nombre: "JUAN LUIS VERA LORIA" },
        { numeral: "UA2", cargo: "UNIDAD DE APOYO", nombre: "WILLIAM HAAS CHAVEZ" }
      ]
    },
    JMM: {
      nombre: "José María Morelos, Q. Roo",
      foto: "img/jmm.jpg",
      facebook: "https://www.facebook.com/share/17h7bMVkB8/?mibextid=wwXIfr",
      miembros: [
        { numeral: "3701", cargo: "DELEGADO", nombre: "SAMUEL JAVIER CHAN CETINA" },
        { numeral: "3702", cargo: "SUBDELEGADO", nombre: "VICTOR ALBERTO MAY CANTO" },
        { numeral: "3703", cargo: "SECRETARIO", nombre: "HENRRY JAVIER CHAN CARRILLO" },
        { numeral: "3704", cargo: "TESORERO", nombre: "JAIRO HERNANDEZ SANTOS" },
        { numeral: "3705", cargo: "COMANDANTE", nombre: "SERGIO SUAREZ CAAMAL" },
        { numeral: "3750", cargo: "Elemento Honorario", nombre: "LEOPOLDO NAREZ MACIE" }
      ]
    },
    KANTUNILKIN: {
      nombre: "Kantunilkin, Q. Roo",
      foto: "img/kantunilkin.jpg",
      facebook: "",
      miembros: [
        { numeral: "3501", cargo: "DELEGADO", nombre: "JOSE GASPAR CAUICH IUIT" },
        { numeral: "3502", cargo: "SUBDELEGADO", nombre: "ADOLFO ABEL HERNÁNDEZ ROMAN" },
        { numeral: "3503", cargo: "SECRETARIO", nombre: "JOSE IDELFONSO TUN AYALA" },
        { numeral: "3504", cargo: "TESORERO", nombre: "HILBERT JEOVANI KOYOC TUT" },
        { numeral: "3505", cargo: "COMANDANTE", nombre: "HONORIO BALAM BALAM" },
        { numeral: "3506", cargo: "SUBCOMANDANTE", nombre: "JAVIER ELIEZER CHI UCAN" },
        { numeral: "3509", cargo: "AUXILIO MECANICO", nombre: "JORGE ANTONIO CHI UCAN" },
        { numeral: "3510", cargo: "SOCORRISMO", nombre: "LUIS FELIPE CANUL POOT" },
        { numeral: "3511", cargo: "RESCATE", nombre: "DESIDERIO PECH PECH" },
        { numeral: "3512", cargo: "SOCIO ACTIVO", nombre: "JORGE EDUARDO CHI PECH" },
        { numeral: "3551", cargo: "BRIGADA JUVENIL", nombre: "ALEXIS GAEL CAUICH CONTRERAS" },
        { numeral: "3552", cargo: "BRIGADA JUVENIL", nombre: "AARON BLADIMIR CAUICH CONTRERAS" }
      ]
    },
    RIO_HONDO: {
      nombre: "Río Hondo, Q. Roo",
      foto: "img/riohondo.jpg",
      facebook: "",
      miembros: [
        { numeral: "3601", cargo: "DELEGADO", nombre: "JOSE DE JESUS MENDEZ LAINEZ" },
        { numeral: "3602", cargo: "SUBDELEGADO", nombre: "ARACELI HERNÁNDEZ VERA" },
        { numeral: "3603", cargo: "SECRETARIO", nombre: "ABRAHAM ROMERO TRUJILLO" },
        { numeral: "3604", cargo: "TESORERA", nombre: "JORGE HERNANDEZ MARTINEZ" },
        { numeral: "3605", cargo: "COMANDANTE", nombre: "ABEL MENDEZ HERNANDEZ" },
        { numeral: "3606", cargo: "SUBCOMANDANTE", nombre: "JESUS URIEL MENDEZ HERNANDEZ" },
        { numeral: "3607", cargo: "RADIOCOMUNICACION", nombre: "LAURO LEON MEDINA" },
        { numeral: "3612", cargo: "SOCIO ACTIVO", nombre: "VALENTIN UTRERA VERGARA" },
        { numeral: "3613", cargo: "SOCIO ACTIVO", nombre: "MARIO ROBERTO LUNA MARTINEZ" }
      ]
    },
    CALKINI: {
      nombre: "Calkiní, Campeche",
      foto: "img/calkini.jpg",
      facebook: "",
      miembros: [
        { numeral: "4001", cargo: "DELEGADO", nombre: "WILLIAM RAFAEL PUC UC" },
        { numeral: "4002", cargo: "SUBDELEGADO", nombre: "MATEO ORDOÑEZ KANTUN" },
        { numeral: "4003", cargo: "SECRETARIO", nombre: "CARLOS ANTONIO CHE OROZCO" },
        { numeral: "4004", cargo: "TESORERO", nombre: "ATOCHA DE LA CRUZ PECH BALAM" },
        { numeral: "4005", cargo: "COMANDANTE", nombre: "WILIAN SANTIAGO PUC TUN" },
        { numeral: "4006", cargo: "SUBCOMANDANTE", nombre: "VICTOR GABRIEL BALAM CIH" },
        { numeral: "4007", cargo: "RADIOCOMUNICACION", nombre: "JUAN PORFIRIO REYNA HUCHIN" },
        { numeral: "4008", cargo: "SOCIO ACTIVO", nombre: "SERGIO RAUL ALEGRIA FERRERA" },
        { numeral: "4009", cargo: "AUXILIO MECANICO", nombre: "ENRIQUE MANUEL LOPEZ SOSA" },
        { numeral: "4010", cargo: "SOCORRISMO", nombre: "MARIA CANDELARIA UC HUCHIN" },
        { numeral: "4011", cargo: "RESCATE", nombre: "FREDY ALFONSO CHAN AKE" },
        { numeral: "4012", cargo: "SOCIO ACTIVO", nombre: "REYNALDO ISAIAS GONZALEZ NOH" },
        { numeral: "4013", cargo: "SOCIO ACTIVO", nombre: "VANESSA DEL ROSARIO AVILA CEN" },
        { numeral: "4014", cargo: "SOCIO ACTIVO", nombre: "ROSENDA DEL ROCIO COB HUCHIN" },
        { numeral: "4051", cargo: "BRIGADA JUVENIL", nombre: "MARICARMEN CHE AVILA" },
        { numeral: "4052", cargo: "BRIGADA JUVENIL", nombre: "RENATA YAZURY CHE AVILA" },
        { numeral: "4053", cargo: "BRIGADA JUVENIL", nombre: "JUAN PABLO PECH COB" }
      ]
    },
    DIVISION_FENIX: {
      nombre: "División Fénix",
      foto: "img/fenix.jpg",
      facebook: "https://www.facebook.com/share/1Ua2vCGmSQ/?mibextid=wwXIfr",
      miembros: [
        { numeral: "F1", cargo: "COORDINADOR DE AMBULANCIAS", nombre: "JOSUE EMMANUEL AGUILAR CEBALLOS" },
        { numeral: "F2", cargo: "PARAMEDICO", nombre: "ADAN TAPIA AGUILAR" },
        { numeral: "F3", cargo: "OPERADOR - PARAMEDICO", nombre: "MISAEL ALEXIS BACELIS BALAM" },
        { numeral: "F4", cargo: "OPERADOR - PARAMEDICO", nombre: "JOSE MARIA URZAIZ MONTES DE OCA" },
        { numeral: "F5", cargo: "PARAMEDICO", nombre: "JOSÉ LUIS KANTÚ PAT" },
        { numeral: "F6", cargo: "OPERADOR - PARAMEDICO", nombre: "JORGE ABRAHAM MARTINEZ CHAVEZ" },
        { numeral: "F7", cargo: "PARAMEDICO", nombre: "SILVIA CAROLINA CANUL NAH" }
      ]
    },
    MOVILES: {
      nombre: "Moviles en Transito",
      foto: "img/moviles.jpg",
      facebook: "",
      miembros: [
        { numeral: "5003", cargo: "MOVILES EN TRANSITO", nombre: "JUAN JOSE PASOS ECHAVARRIA" }
      ]
    }
  };

  /* ---------------------------
     Tooltip y eventos en puntos del mapa
     --------------------------- */
  function initDelegacionesUI() {
    const delegTooltip = document.getElementById('deleg-tooltip');

    document.querySelectorAll('.deleg-dot').forEach(dot => {
      dot.addEventListener('mouseenter', function() {
        const key = dot.dataset.deleg;
        if (!delegTooltip) return;
        delegTooltip.textContent = key || '';
        delegTooltip.style.display = 'block';
        delegTooltip.setAttribute('aria-hidden','false');
        const svgRect = dot.ownerSVGElement.getBoundingClientRect();
        const dotRect = dot.getBoundingClientRect();
        let left = dotRect.left - svgRect.left + svgRect.width/2 - 60;
        if (window.innerWidth < 600) left = 10;
        delegTooltip.style.left = left + 'px';
      });
      dot.addEventListener('mouseleave', function() {
        if (!delegTooltip) return;
        delegTooltip.style.display = 'none';
        delegTooltip.setAttribute('aria-hidden','true');
      });
      dot.addEventListener('click', function() {
        showDelegModal(dot.dataset.deleg);
      });
    });

    document.querySelectorAll('.deleg-link').forEach(btn => {
      btn.addEventListener('click', function() {
        showDelegModal(btn.dataset.deleg);
      });
    });

    const delegModal = document.getElementById('deleg-modal');
    const delegModalBody = document.getElementById('deleg-modal-body');
    const delegModalClose = document.getElementById('deleg-modal-close');

    function showDelegModal(key) {
      const data = delegacionesData[key];
      if (!data || !delegModalBody || !delegModal) return;

      // Build header: photo, name, optional Facebook link
      let html = '';
      html += `<div class="deleg-modal-cabecera">
        <img src="${escapeAttr(data.foto)}" alt="${escapeAttr(data.nombre)}" onerror="this.onerror=null;this.src='img/default-deleg.jpg'">
        <h2>${escapeHtml(data.nombre)}</h2>`;

      if (data.facebook && typeof data.facebook === 'string' && data.facebook.trim() !== '') {
        const fb = data.facebook.trim();
        // show link below the name
        html += `<p style="margin-top:6px;"><a href="${escapeAttr(fb)}" target="_blank" rel="noopener noreferrer" style="color:#1b74e4;font-weight:600;text-decoration:none;">🔵 Ver en Facebook</a></p>`;
      }

      html += `</div>`;

      // Members list
      html += `<ul class="deleg-modal-miembros">`;
      (data.miembros || []).forEach(m => {
        html += `<li>
          <img src="img/delegado1.jpg" alt="${escapeAttr(m.cargo)}" onerror="this.onerror=null;this.src='img/default-person.jpg'">
          <div><strong>${escapeHtml(m.cargo)}${m.numeral ? ' (' + escapeHtml(m.numeral) + ')' : ''}:</strong> ${escapeHtml(m.nombre)}</div>
        </li>`;
      });
      html += `</ul>`;

      delegModalBody.innerHTML = html;
      delegModal.style.display = 'flex';
      delegModal.setAttribute('aria-hidden','false');
      if (modalOverlay) modalOverlay.style.display = 'block';
      document.body.style.overflow = 'hidden';
    }

    if (delegModalClose) delegModalClose.addEventListener('click', function() {
      if (!delegModal) return;
      delegModal.style.display = 'none';
      delegModal.setAttribute('aria-hidden','true');
      if (modalOverlay) modalOverlay.style.display = 'none';
      document.body.style.overflow = '';
    });

    // expose
    window.showDelegModal = showDelegModal;
  }

  /* ---------------------------
     Galería / Lightbox
     --------------------------- */
  function initGallery() {
    const thumbs = document.querySelectorAll('.gallery-thumb');
    const modal = document.getElementById('gallery-modal');
    const modalImg = document.getElementById('gallery-modal-img');
    const captionEl = document.getElementById('gallery-caption');
    const btnClose = modal ? modal.querySelector('.gallery-close') : null;
    const btnPrev = modal ? modal.querySelector('.gallery-prev') : null;
    const btnNext = modal ? modal.querySelector('.gallery-next') : null;
    if (!thumbs.length || !modal) return;

    const images = Array.from(thumbs).map((btn, i) => {
      const img = btn.querySelector('img');
      return { src: img.getAttribute('src'), alt: img.getAttribute('alt') || '', index: i };
    });

    let current = 0;

    function openAt(index) {
      if (index < 0) index = images.length - 1;
      if (index >= images.length) index = 0;
      current = index;
      modalImg.src = images[current].src;
      modalImg.alt = images[current].alt;
      captionEl.textContent = images[current].alt;
      modal.setAttribute('aria-hidden', 'false');
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      if (btnClose) btnClose.focus();
    }

    function closeGallery() {
      modal.setAttribute('aria-hidden', 'true');
      modal.style.display = 'none';
      document.body.style.overflow = '';
      modalImg.src = '';
    }

    thumbs.forEach(btn => btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index, 10) || 0;
      openAt(idx);
    }));

    if (btnClose) btnClose.addEventListener('click', closeGallery);
    if (btnPrev) btnPrev.addEventListener('click', () => openAt(current - 1));
    if (btnNext) btnNext.addEventListener('click', () => openAt(current + 1));

    document.addEventListener('keydown', (e) => {
      if (modal.getAttribute('aria-hidden') === 'false') {
        if (e.key === 'Escape') closeGallery();
        if (e.key === 'ArrowLeft') openAt(current - 1);
        if (e.key === 'ArrowRight') openAt(current + 1);
      }
    });

    modal.addEventListener('click', (e) => { if (e.target === modal) closeGallery(); });

    let startX = 0;
    if (modalImg) {
      modalImg.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, {passive:true});
      modalImg.addEventListener('touchend', (e) => {
        const dx = (e.changedTouches[0].clientX - startX);
        if (dx > 40) openAt(current - 1);
        else if (dx < -40) openAt(current + 1);
      }, {passive:true});
    }
  }

  /* ---------------------------
     Global overlay/escape behavior
     --------------------------- */
  function initGlobalClosers() {
    if (modalOverlay) modalOverlay.addEventListener('click', closeAllModals);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAllModals(); });
  }

  /* ---------------------------
     Helpers
     --------------------------- */
  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, function (s) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[s];
    });
  }
  function escapeAttr(str) {
    // for attributes: reuse escapeHtml (safe for simple cases)
    return escapeHtml(str);
  }

  /* ---------------------------
     Inicialización al DOM ready
     --------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    initTabs();
    initHamburger();
    initHeroAndFade();
    initEmergency();
    initJoinForm();
    initFAQ();
    initDelegacionesUI();
    initGallery();
    initGlobalClosers();

    const voluntarioBtn = document.getElementById('voluntario-btn');
    if (voluntarioBtn) voluntarioBtn.addEventListener('click', () => switchTab('contacto'));
  });

  } catch (err) {
    console.error('Error initializing script.js:', err);
  }

})();


