// ========== TABS NAVIGATION ==========
function switchTab(tabName) {
  document.querySelectorAll('.tab-btn, .tab-btn-footer').forEach(btn => {
    if (btn.dataset.tab === tabName) btn.classList.add('active'); else btn.classList.remove('active');
  });
  document.querySelectorAll('.tab-section').forEach(sec => {
    if (sec.id === tabName) {
      sec.classList.add('active');
      window.scrollTo({top: 0, behavior: 'smooth'});
    } else {
      sec.classList.remove('active');
    }
  });
}

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});
document.querySelectorAll('.tab-btn-footer').forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

// HAMBURGER
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
if (hamburger && nav) {
  hamburger.addEventListener('click', () => {
    nav.classList.toggle('open');
    const expanded = nav.classList.contains('open');
    hamburger.setAttribute('aria-expanded', expanded);
  });
}

// ESC global close behavior
document.addEventListener('keydown', function(e){
  if (e.key === 'Escape') {
    if (nav) nav.classList.remove('open');
    closeModalIfOpen();
    document.body.style.overflow = '';
  }
});

// HERO ANIM
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const hero = document.querySelector('.hero-content');
    if (hero) hero.classList.add('visible');
  }, 350);
});

// ON-SCROLL FADE INS
function handleFadeIns() {
  const fadeEls = document.querySelectorAll('.fade-in');
  fadeEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60) el.classList.add('visible');
  });
}
window.addEventListener('scroll', handleFadeIns);
window.addEventListener('DOMContentLoaded', handleFadeIns);

// EMERGENCY MODAL
const emergenciaBtn = document.getElementById('emergencia-btn');
const reportarBtn = document.getElementById('reportar-btn');
const emergenciaModal = document.getElementById('emergencia-modal');
const modalOverlay = document.getElementById('modal-overlay');
const emergenciaModalClose = document.getElementById('emergencia-modal-close');

function openModal() {
  if (!emergenciaModal || !modalOverlay) return;
  emergenciaModal.setAttribute('aria-hidden','false');
  modalOverlay.style.display = 'block';
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  if (!emergenciaModal || !modalOverlay) return;
  emergenciaModal.setAttribute('aria-hidden','true');
  modalOverlay.style.display = 'none';
  document.body.style.overflow = '';
}
function closeModalIfOpen() {
  // close any open modal overlays
  if (emergenciaModal && emergenciaModal.getAttribute('aria-hidden') === 'false') closeModal();
  const openModals = document.querySelectorAll('.modal[aria-hidden="false"]');
  openModals.forEach(m => { m.setAttribute('aria-hidden','true'); });
  if (modalOverlay) modalOverlay.style.display = 'none';
}
if(emergenciaBtn) emergenciaBtn.addEventListener('click', openModal);
if(reportarBtn) reportarBtn.addEventListener('click', openModal);
if(emergenciaModalClose) emergenciaModalClose.addEventListener('click', closeModal);
if(modalOverlay) modalOverlay.addEventListener('click', closeModal);

// VOLUNTARIO CTA
const voluntarioBtn = document.getElementById('voluntario-btn');
if(voluntarioBtn) voluntarioBtn.addEventListener('click', () => switchTab('contacto'));

// JOIN FORM VALIDATION
const joinForm = document.getElementById('join-form');
const successMsg = document.getElementById('form-success');
if(joinForm) {
  joinForm.addEventListener('submit', function(e){
    e.preventDefault();
    let valid = true;

    const nombre = this.nombre;
    const nombreError = nombre.nextElementSibling;
    if (!nombre.value.trim()) { nombreError.textContent = 'Ingresa tu nombre.'; valid = false; } else { nombreError.textContent = ''; }

    const correo = this.correo;
    const correoError = correo.nextElementSibling;
    if (!correo.value.trim() || !/\S+@\S+\.\S+/.test(correo.value)) { correoError.textContent = 'Correo electrónico inválido.'; valid = false; } else { correoError.textContent = ''; }

    const telefono = this.telefono;
    const telError = telefono.nextElementSibling;
    if (!telefono.value.trim() || !telefono.value.match(/^[0-9\s\-+()]{8,}$/)) { telError.textContent = 'Teléfono inválido.'; valid = false; } else { telError.textContent = ''; }

    const delegacion = this.delegacion;
    const delegError = delegacion.nextElementSibling;
    if (!delegacion.value) { delegError.textContent = 'Selecciona delegación.'; valid = false; } else { delegError.textContent = ''; }

    const dispChecks = joinForm.querySelectorAll('input[name="disp[]"]:checked');
    const dispError = joinForm.querySelector('.disponibilidad .error-msg');
    if (dispChecks.length === 0) { dispError.textContent = 'Selecciona al menos una opción.'; valid = false; } else { dispError.textContent = ''; }

    if (valid) {
      joinForm.reset();
      if(successMsg) { successMsg.style.display = 'block'; setTimeout(() => { successMsg.style.display = 'none'; }, 5500); }
    }
  });
}

// FAQ toggles
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', function() {
    const item = btn.parentElement;
    const open = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!open) item.classList.add('open');
  });
});

// ========== DELEGACIONES MAP TOOLTIP Y MODAL ==========
// delegacionesData (completo, normalizado; CAMPECHE eliminado)
const delegacionesData = {
  PETO: {
    nombre: "Peto, Yucatán",
    foto: "img/peto.jpg",
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
    miembros: [
      { numeral: "3001", cargo: "DELEGADO", nombre: "MARTIN JAVIER SAUCEDO AVILES" },
      { numeral: "3002", cargo: "SUBDELEGADO", nombre: "ANDY ADAM SULUB HERNÁNDEZ" },
      { numeral: "3003", cargo: "SECRETARIA", nombre: "CLAUDIA GUADALUPE UC PASOS" },
      { numeral: "3004", cargo: "TESORERO", nombre: "RIGEL FERNANDO HAU UEX" },
      { numeral: "3005", cargo: "COMANDANTE", nombre: "JUAN CARLOS MEDINA NOVELO" },
      { numeral: "3006", cargo: "SUBCOMANDANTE", nombre: "CESAR MARTINEZ SOSA" },
      { numeral: "3007", cargo: "RADIOCOMUNICACION", nombre: "ARNULFO MAY TZUC" },
      { numeral: "3010", cargo: "SOCORRISTA", nombre: "MANUEL ANTONIO MUKUL NOH" },
      { numeral: "3011", cargo: "RESCATE", nombre: "RITA YANET MARTIN VAZQUEZ" },
      { numeral: "3012", cargo: "COMUNICACIONES", nombre: "JUSTINO XIU CHAN" },
      { numeral: "3013", cargo: "SOCIO ACTIVO", nombre: "ALEJANDRO ABRAHAM PUC" },
      { numeral: "3014", cargo: "SOCIO ACTIVO", nombre: "JOSE EDILBERTO XIU YAM" },
      { numeral: "3015", cargo: "SOCIO ACTIVO", nombre: "LOURDES DEL ROSARIO MENDOZA BRICEÑO" },
      { numeral: "3016", cargo: "SOCIO ACTIVO", nombre: "NOEMI DE LA CRUZ CASTILLO MOO" },
      { numeral: "3017", cargo: "SOCIO ACTIVO", nombre: "ZACARIAS PECH WITZIL" },
      { numeral: "3018", cargo: "SOCIO ACTIVO", nombre: "FRANCISCO EMMANUEL UC PASOS" },
      { numeral: "3019", cargo: "SOCIO ACTIVO", nombre: "CAROLINA ARACELI HOIL HEREDIA" },
      { numeral: "3020", cargo: "SOCIO ACTIVO", nombre: "KARLA SANABRIA ALBOR" },
      { numeral: "3021", cargo: "SOCIO ACTIVO", nombre: "JOSUE EFRAIN MONTALVO IBARRA" },
      { numeral: "3022", cargo: "SOCIO ACTIVO", nombre: "JONHY ALEJANDRO ALBA HERNANDEZ" },
      { numeral: "3023", cargo: "SOCIO ACTIVO", nombre: "CESAR DOMINGO LOPEZ SALAZAR" },
      { numeral: "3024", cargo: "SOCIO ACTIVO", nombre: "JUAN CARLOS CHE SABA" },
      { numeral: "3025", cargo: "SOCIO ACTIVO", nombre: "RAUL ENRIQUE LOPEZ MORALES" },
      { numeral: "3026", cargo: "SOCIO ACTIVO", nombre: "RAUL EFRAIN LOPEZ MENDEZ" },
      { numeral: "3027", cargo: "SOCIO ACTIVO", nombre: "ANGELA GUADALUPE MAY GUZMAN" },
      { numeral: "3051", cargo: "BRIGADA JUVENIL", nombre: "PAOLY SIMEONE SAUCEDO UC" },
      { numeral: "3052", cargo: "BRIGADA JUVENIL", nombre: "ANDY JESUS SULUB MARTIN" },
      { numeral: "3053", cargo: "BRIGADA JUVENIL", nombre: "ANDRE MIGUEL SULUB MARTIN" },
      { numeral: "3054", cargo: "BRIGADA JUVENIL", nombre: "GABRIEL ELADIO UC DIAZ" },
      { numeral: "3055", cargo: "BRIGADA JUVENIL", nombre: "YARETZY DAEMY GONZALEZ CASTILLO" }
    ]
  },
  CANCUN: {
    nombre: "Cancún, Q. Roo",
    foto: "img/cancun.jpg",
    miembros: [
      { numeral: "3101", cargo: "DELEGADO", nombre: "ROGER ALONSO OSORIO SALAZAR" },
      { numeral: "3102", cargo: "SUBDELEGADO", nombre: "ROBERTO JOEL FERNÁNDEZ ARREOLA" },
      { numeral: "3103", cargo: "SECRETARIA", nombre: "ANA MONSERRAT SEGOVIA CAMPOS" },
      { numeral: "3106", cargo: "SUBCOMANDANTE", nombre: "BERNARDO CAAMAL POOT" },
      { numeral: "3107", cargo: "RADIOCOMUNICACION", nombre: "GUIDO MENDIBURU SOLIS" },
      { numeral: "3110", cargo: "SOCORRISMO", nombre: "GILBERT RAMON BERRON REJON" },
      { numeral: "3111", cargo: "JEFE DE RESCATE", nombre: "EDNA GABRIEL MENDIOLA ARGUELLO" },
      { numeral: "3109", cargo: "JEFE DE MECANICA", nombre: "FREDDY ANTHONY VAZQUEZ MORALES" },
      { numeral: "3108", cargo: "JEFE DE VIALIDAD", nombre: "DAVID MUÑOZ RIVERA" },
      { numeral: "3112", cargo: "BRIGADA JUVENIL", nombre: "NICHOLAS SANTANA SEGOVIA" },
      { numeral: "3150", cargo: "MOVILES EN TRANSITO", nombre: "CARLOS ALBERTO OSORIO SALAZAR" },
      { numeral: "3152", cargo: "MOVILES EN TRANSITO", nombre: "RAFAEL DZUL CHI" },
      { numeral: "3151", cargo: "MOVILES EN TRANSITO", nombre: "AMILCAR ALONZO KUYOC CAB" }
    ]
  },
  BACALAR: {
    nombre: "Bacalar, Q. Roo",
    foto: "img/bacalar.jpg",
    miembros: [
      { numeral: "3201", cargo: "DELEGADO", nombre: "JAVIER JESUS SALGADO CHAVEZ" },
      { numeral: "3202", cargo: "SUBDELEGADO", nombre: "PEDRO FERNANDO SOLIS PANTI" },
      { numeral: "3203", cargo: "SECRETARIO", nombre: "MARCO ANTONIO CERVANTES MARIN" },
      { numeral: "3204", cargo: "TESORERO", nombre: "FLAVIO TOLENTINO MAR GREGORIO" },
      { numeral: "3205", cargo: "COMANDANTE", nombre: "DANIEL IVAN TUT AVIÑA" },
      { numeral: "3206", cargo: "SUBCOMANDANTE", nombre: "BRENDA MARGARITA CHAN MOO" },
      { numeral: "3207", cargo: "RADIOCOMUNICACION", nombre: "RUFINO VERGARA AGUILERA" },
      { numeral: "3208", cargo: "VIALIDAD", nombre: "MIGUEL ORLANDO HERNANDEZ MENDEZ" },
      { numeral: "3209", cargo: "JEFE AUXILIO MECANICO", nombre: "FELIPE JORGE THOMAS GUZMAN" },
      { numeral: "3210", cargo: "SOCORRISMO", nombre: "VICTOR ALEXANDER VELAZQUEZ" },
      { numeral: "3211", cargo: "RESCATE", nombre: "BRAULIO FRITZ AGUILAR" },
      { numeral: "3212", cargo: "COMUNICACIONES", nombre: "JOANA ARLET VERGARA QUIÑONEZ" },
      { numeral: "3213", cargo: "SOCIO ACTIVO", nombre: "GUSTAVO ANTONIO POOL CAMARA" },
      { numeral: "3214", cargo: "SOCIO ACTIVO", nombre: "RICARDO TUT AVIÑA" },
      { numeral: "3215", cargo: "SOCIO ACTIVO", nombre: "JAIME ORTEGA GARCIA" },
      { numeral: "3216", cargo: "SOCIO ACTIVO", nombre: "DANIEL GUSTAVO QUIÑONES NOVELO" },
      { numeral: "3217", cargo: "SOCIO ACTIVO", nombre: "BRAYAN OSVALDO CARDENAS RODRIGUEZ" },
      { numeral: "3218", cargo: "SOCIO ACTIVO", nombre: "FREDY EDUARDO LEONIDES CANUL" },
      { numeral: "3219", cargo: "SOCIO ACTIVO", nombre: "IVAN ROMERO DEL ANGEL" },
      { numeral: "3220", cargo: "SOCIO ACTIVO", nombre: "MARIO ERNESTO RAMOS CRUZ" },
      { numeral: "3221", cargo: "SOCIO ACTIVO", nombre: "EDUARDO BARAHONA SANCHEZ" },
      { numeral: "3222", cargo: "SOCIO ACTIVO", nombre: "SALOMON BAUTISTA GARCIA" },
      { numeral: "3223", cargo: "SOCIO ACTIVO", nombre: "JASSIEL DE JESUS ROSADO BORGES" },
      { numeral: "3224", cargo: "SOCIO ACTIVO", nombre: "JOB DOMINGUEZ DE LOS SANTOS" },
      { numeral: "3225", cargo: "SOCIO ACTIVO", nombre: "TEODOCIO CRUZ MAY SALAS" },
      { numeral: "3226", cargo: "SOCIO ACTIVO", nombre: "JAIRO ALBERTO PEREZ CAHUM" },
      { numeral: "3227", cargo: "SOCIO ACTIVO", nombre: "MARIA DEL CARMEN POMOL CANUL" },
      { numeral: "3251", cargo: "BRIGADA JUVENIL", nombre: "IAN ENRIQUE MAR CORNELIO" },
      { numeral: "3252", cargo: "BRIGADA JUVENIL", nombre: "WILLIAM ALBERTO MAR CORNELIO" },
      { numeral: "3253", cargo: "BRIGADA JUVENIL", nombre: "JADE ADILENE VERGARA QUIÑONEZ" },
      { numeral: "3254", cargo: "BRIGADA JUVENIL", nombre: "MARTHA CITLALY CHAN MOO" },
      { numeral: "3255", cargo: "BRIGADA JUVENIL", nombre: "JOSHUA ROMAN ROSADO BORGES" }
    ]
  },
  COZUMEL: {
    nombre: "Cozumel, Q. Roo",
    foto: "img/cozumel.jpg",
    miembros: [
      { numeral: "3301", cargo: "DELEGADO", nombre: "NOE GUADALUPE SAMARRIPA EUAN" },
      { numeral: "3302", cargo: "SUBDELEGADO", nombre: "TEDDY DE JESUS TUN ORTIZ" },
      { numeral: "3303", cargo: "SECRETARIO", nombre: "WILLIAM GABRIEL GUEMEZ" },
      { numeral: "3304", cargo: "TESORERO", nombre: "NESTOR ADRIAN LOEZA VAZQUEZ" },
      { numeral: "3305", cargo: "COMANDANTE", nombre: "SAMUEL PEREZ DE LA ROSA" },
      { numeral: "3306", cargo: "SUBCOMANDANTE", nombre: "JULIO CESAR CORONADO RODRIGUEZ" },
      { numeral: "3307", cargo: "RADIOCOMUNICACION", nombre: "MARTIN ADRIAN JIMENEZ RAMIREZ" },
      { numeral: "3309", cargo: "AUXILIO MECANICO", nombre: "MANUEL ROMAN ROSADO ZAVALEGUI" },
      { numeral: "3312", cargo: "COMUNICACIONES", nombre: "ANGEL BENITO VILLAFAÑA GUTIERREZ" },
      { numeral: "3313", cargo: "SOCIO ACTIVO", nombre: "RUSSEL ARIEL COHUO UITZ" },
      { numeral: "3314", cargo: "SOCIO ACTIVO", nombre: "MANUEL ARTURO PERAZA MAY" },
      { numeral: "3315", cargo: "SOCIO ACTIVO", nombre: "NELIA VICTORIA ARGAEZ AZCORRA" },
      { numeral: "3316", cargo: "SOCIO ACTIVO", nombre: "LEYVI SILIA AZCORRA CHAN" },
      { numeral: "3317", cargo: "SOCIO ACTIVO", nombre: "JULIO VILLAFAÑA GUTIERREZ" },
      { numeral: "3318", cargo: "SOCIO ACTIVO", nombre: "ABRAHAM DE JESUS MENDOZA QUIJANO" },
      { numeral: "3319", cargo: "SOCIO ACTIVO", nombre: "ISAIAS PAT BUENFIL" },
      { numeral: "3320", cargo: "SOCIO ACTIVO", nombre: "MANUEL ALEJANDRO PAT PISTE" },
      { numeral: "3321", cargo: "SOCIO ACTIVO", nombre: "MARIA DEL CARMEN LOPEZ BERMON" },
      { numeral: "3322", cargo: "SOCIO ACTIVO", nombre: "ERMINIO TOVAR RAMOS" },
      { numeral: "3323", cargo: "SOCIO ACTIVO", nombre: "ARGELIA GUADALUPE MOO MARTINEZ" },
      { numeral: "3324", cargo: "SOCIO ACTIVO", nombre: "JUAN CARLOS ESTRADA GARCIA" },
      { numeral: "3325", cargo: "SOCIO ACTIVO", nombre: "CECILIO ERMILO JIMENEZ BASTARRACHEA" },
      { numeral: "3326", cargo: "SOCIO ACTIVO", nombre: "ANDRES IVAN CANUL LOPEZ" },
      { numeral: "3327", cargo: "SOCIO ACTIVO", nombre: "JOSE ARIEL BRITO GARCIA" },
      { numeral: "3351", cargo: "BRIGADA JUVENIL", nombre: "ALEXANDRA ABIGAIL PERERA PAT" },
      { numeral: "3352", cargo: "BRIGADA JUVENIL", nombre: "SAMUEL ABIEL PEREZ PACHECO" }
    ]
  },
  CHETUMAL: {
    nombre: "Chetumal, Q. Roo",
    foto: "img/chetumal.jpg",
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
    miembros: [
      { numeral: "UA1", cargo: "UNIDAD DE APOYO", nombre: "JUAN LUIS VERA LORIA" },
      { numeral: "UA2", cargo: "UNIDAD DE APOYO", nombre: "WILLIAM HAAS CHAVEZ" }
    ]
  },
  JMM: {
    nombre: "José María Morelos, Q. Roo",
    foto: "img/jmm.jpg",
    miembros: [
      { numeral: "3701", cargo: "DELEGADO", nombre: "SAMUEL JAVIER CHAN CETINA" },
      { numeral: "3702", cargo: "SUBDELEGADO", nombre: "OMAR ALEXANDER UC KU" },
      { numeral: "3703", cargo: "SECRETARIO", nombre: "HENRRY JAVIER CHAN CARRILLO" },
      { numeral: "3704", cargo: "TESORERO", nombre: "JAIRO HERNANDEZ SANTOS" },
      { numeral: "3705", cargo: "COMANDANTE", nombre: "VICTOR ALBERTO MAY CANTO" }
    ]
  },
  KANTUNILKIN: {
    nombre: "Kantunilkin, Q. Roo",
    foto: "img/kantunilkin.jpg",
    miembros: [
      { numeral: "3501", cargo: "DELEGADO", nombre: "JOSE GASPAR CAUICH IUIT" },
      { numeral: "3502", cargo: "SUBDELEGADO", nombre: "JAVIER ELIEZER CHI UCAN" },
      { numeral: "3503", cargo: "SECRETARIO", nombre: "JOSE IDELFONSO TUN AYALA" },
      { numeral: "3504", cargo: "TESORERO", nombre: "CESAR IVAN PECH CHI" },
      { numeral: "3505", cargo: "COMANDANTE", nombre: "HONORIO BALAM BALAM" },
      { numeral: "3506", cargo: "SUBCOMANDANTE", nombre: "LUIS ANGEL PUC CUPUL" },
      { numeral: "3508", cargo: "JEFE DE VIALIDAD", nombre: "ALBINO CORTEZ CANO" },
      { numeral: "3509", cargo: "JEFE DE AUXILIO MECANICO", nombre: "JORGE ANTONIO CHI UCAN" },
      { numeral: "3511", cargo: "JEFE DE RESCATE", nombre: "FELIPE DE JESUS PECH DZUL" },
      { numeral: "3512", cargo: "SOCIO ACTIVO", nombre: "JORGE EDUARDO CHI PECH" },
      { numeral: "3513", cargo: "SOCIO ACTIVO", nombre: "ADOLFO ABEL HERNANDEZ ROMAN" },
      { numeral: "3514", cargo: "SOCIO ACTIVO", nombre: "RENE ARIEL IZMAEL POOL PUGA" },
      { numeral: "3551", cargo: "BRIGADA JUVENIL", nombre: "ALEXIS GAEL CAUICH CONTRERAS" },
      { numeral: "3552", cargo: "BRIGADA JUVENIL", nombre: "AARON BLADIMIR CAUICH CONTRERAS" }
    ]
  },
  RIO_HONDO: {
    nombre: "Río Hondo, Q. Roo",
    foto: "img/riohondo.jpg",
    miembros: [
      { numeral: "3601", cargo: "DELEGADO", nombre: "JOSE DE JESUS MENDEZ LAINEZ" },
      { numeral: "3602", cargo: "SUBDELEGADO", nombre: "ARACELI HERNÁNDEZ VERA" },
      { numeral: "3603", cargo: "SECRETARIO", nombre: "VALENTIN UTRERA VERGARA" },
      { numeral: "3604", cargo: "TESORERA", nombre: "DALIA CRISTEL MENDEZ SANCHEZ" },
      { numeral: "3605", cargo: "COMANDANTE", nombre: "ABEL MENDEZ HERNANDEZ" },
      { numeral: "3606", cargo: "SUBCOMANDANTE", nombre: "EVARISTO GOMEZ DIAS" },
      { numeral: "3607", cargo: "SOCIO ACTIVO", nombre: "ABRAHAN ROMERO TRUJILLO" },
      { numeral: "3608", cargo: "SOCIO ACTIVO", nombre: "RIGOBERTO UCAN DZIB" }
    ]
  },
  CALKINI: {
    nombre: "Calkiní, Campeche",
    foto: "img/calkini.jpg",
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
    miembros: [
      { numeral: "F1", cargo: "PARAMEDICO", nombre: "ADAN TAPIA AGUILAR" },
      { numeral: "F2", cargo: "PARAMEDICO", nombre: "JOSE GUILLERMO AKE GAMBOA" },
      { numeral: "F3", cargo: "PARAMEDICO", nombre: "MISAEL ALEXIS BACELIS BALAM" },
      { numeral: "F4", cargo: "PARAMEDICO", nombre: "ABRAHAM MARTINEZ" },
      { numeral: "F5", cargo: "PARAMEDICO", nombre: "SERGIO MANUEL GAMBOA PECH" },
      { numeral: "F6", cargo: "PARAMEDICO", nombre: "SILVIA CAROLINA CANUL NAH" },
      { numeral: "F7", cargo: "PARAMEDICO", nombre: "ISMAEL CANUL" }
    ]
  },
  MOVILES: {
    nombre: "Moviles en Transito",
    foto: "img/moviles.jpg",
    miembros: [
      { numeral: "5003", cargo: "MOVILES EN TRANSITO", nombre: "JUAN JOSE PASOS ECHAVARRIA" }
    ]
  }
};

// Map para tooltip (coincide con las claves normalizadas arriba)
const delegNames = {
  PETO: "Peto, Yucatán: Peto",
  PROGRESO: "Progreso, Yucatán: Progreso",
  PISTE: "Pisté, Yucatán: Pisté",
  FCP: "Felipe Carrillo Puerto, Q. Roo: FCP",
  CANCUN: "Cancún, Q. Roo: Cancún",
  BACALAR: "Bacalar, Q. Roo: Bacalar",
  COZUMEL: "Cozumel, Q. Roo: Cozumel",
  CHETUMAL: "Chetumal, Q. Roo: Chetumal",
  MERIDA: "Mérida, Yucatán: Mérida",
  JMM: "José María Morelos, Q. Roo: JMM",
  KANTUNILKIN: "Kantunilkin, Q. Roo: Kantunilkin",
  RIO_HONDO: "Río Hondo, Q. Roo: Río Hondo",
  CALKINI: "Calkiní, Campeche: Calkiní",
  DIVISION_FENIX: "División Fénix",
  MOVILES: "Moviles en Transito"
};

// Tooltip y eventos en puntos del mapa
const delegTooltip = document.getElementById('deleg-tooltip');
document.querySelectorAll('.deleg-dot').forEach(dot => {
  dot.addEventListener('mouseenter', function() {
    const key = dot.dataset.deleg;
    if (!delegTooltip) return;
    delegTooltip.textContent = delegNames[key] || '';
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

// Muestra modal con miembros de la delegación (con fallback de imagen)
const delegModal = document.getElementById('deleg-modal');
const delegModalBody = document.getElementById('deleg-modal-body');
const delegModalClose = document.getElementById('deleg-modal-close');

function showDelegModal(key) {
  const data = delegacionesData[key];
  if (!data || !delegModalBody || !delegModal) return;
  let html = '';
  html += `<div class="deleg-modal-cabecera">
    <img src="${data.foto}" alt="${data.nombre}" onerror="this.onerror=null;this.src='img/default-deleg.jpg'">
    <h2>${data.nombre}</h2>
  </div>`;
  html += `<ul class="deleg-modal-miembros">`;
  data.miembros.forEach(m => {
    html += `<li>
      <img src="img/delegado1.jpg" alt="${m.cargo}" onerror="this.onerror=null;this.src='img/default-person.jpg'">
      <div><strong>${m.cargo}${m.numeral ? ' (' + m.numeral + ')' : ''}:</strong> ${m.nombre}</div>
    </li>`;
  });
  html += `</ul>`;
  delegModalBody.innerHTML = html;
  delegModal.setAttribute('aria-hidden','false');
  if (modalOverlay) modalOverlay.style.display = 'block';
  document.body.style.overflow = 'hidden';
}
if (delegModalClose) delegModalClose.addEventListener('click', function() {
  if (!delegModal) return;
  delegModal.setAttribute('aria-hidden','true');
  if (modalOverlay) modalOverlay.style.display = 'none';
  document.body.style.overflow = '';
});

// Login modal
const loginBtn = document.getElementById('login-btn');
const loginModal = document.getElementById('login-modal');
const loginModalClose = document.getElementById('login-modal-close');
if(loginBtn && loginModal && loginModalClose) {
  loginBtn.addEventListener('click', function() {
    loginModal.setAttribute('aria-hidden','false');
    if (modalOverlay) modalOverlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
  });
  loginModalClose.addEventListener('click', function() {
    loginModal.setAttribute('aria-hidden','true');
    if (modalOverlay) modalOverlay.style.display = 'none';
    document.body.style.overflow = '';
  });
}

/* ===== Galeria Quiénes Somos: lightbox simple ===== */
(function(){
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
    return {
      src: img.getAttribute('src'),
      alt: img.getAttribute('alt') || '',
      index: i
    };
  });

  let current = 0;

  function openAt(index){
    if (index < 0) index = images.length - 1;
    if (index >= images.length) index = 0;
    current = index;
    modalImg.src = images[current].src;
    modalImg.alt = images[current].alt;
    captionEl.textContent = images[current].alt;
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (btnClose) btnClose.focus();
  }

  function closeGallery(){
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    modalImg.src = '';
  }

  thumbs.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(btn.dataset.index, 10) || 0;
      openAt(idx);
    });
  });

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

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeGallery();
  });

  // touch swipe
  let startX = 0;
  if (modalImg) {
    modalImg.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, {passive:true});
    modalImg.addEventListener('touchend', (e) => {
      const dx = (e.changedTouches[0].clientX - startX);
      if (dx > 40) openAt(current - 1);
      else if (dx < -40) openAt(current + 1);
    }, {passive:true});
  }
  // >>> Abrir/cerrar emergencia, capacitación y submit del formulario
document.addEventListener('DOMContentLoaded', function(){
  // EMERGENCIA modal
  const reportBtn = document.getElementById('reportar-btn');
  const emergenciaModal = document.getElementById('emergencia-modal');
  const emergenciaClose = document.getElementById('emergencia-modal-close');
  const overlay = document.getElementById('modal-overlay');

  function openEmergencia(){
    if(!emergenciaModal) return;
    emergenciaModal.style.display = 'block';
    emergenciaModal.setAttribute('aria-hidden','false');
    if (overlay) overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
    // mover foco al modal para accesibilidad
    const firstFocusable = emergenciaModal.querySelector('a, button, input, [tabindex]');
    if (firstFocusable) firstFocusable.focus();
  }
  function closeEmergencia(){
    if(!emergenciaModal) return;
    emergenciaModal.style.display = 'none';
    emergenciaModal.setAttribute('aria-hidden','true');
    if (overlay) overlay.style.display = 'none';
    document.body.style.overflow = '';
  }

  if (reportBtn) reportBtn.addEventListener('click', openEmergencia);
  if (emergenciaClose) emergenciaClose.addEventListener('click', closeEmergencia);
  if (overlay) overlay.addEventListener('click', closeEmergencia);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeEmergencia(); });

  // CAPACITACIÓN modal (si existe)
  const capBtn = document.getElementById('capacitacion-link');
  const capModal = document.getElementById('capacitacion-modal');
  const capClose = document.getElementById('capacitacion-modal-close');
  if (capBtn && capModal) {
    capBtn.addEventListener('click', function(e){
      e.preventDefault();
      capModal.style.display = 'block';
      capModal.setAttribute('aria-hidden','false');
      if (overlay) overlay.style.display = 'block';
      document.body.style.overflow = 'hidden';
      const f = capModal.querySelector('a,button,input,[tabindex]');
      if (f) f.focus();
    });
  }
  if (capClose) capClose.addEventListener('click', function(){
    if (!capModal) return;
    capModal.style.display = 'none';
    capModal.setAttribute('aria-hidden','true');
    if (overlay) overlay.style.display = 'none';
    document.body.style.overflow = '';
  });

  // FORMULARIO: enviar a /api/contact
  const joinForm = document.getElementById('join-form');
  const successMsg = document.getElementById('form-success');
  if (joinForm) {
    joinForm.addEventListener('submit', async function(e){
      e.preventDefault();
      const payload = {
        nombre: this.nombre?.value || '',
        correo: this.correo?.value || '',
        telefono: this.telefono?.value || '',
        delegacion: this.delegacion?.value || '',
        mensaje: 'Solicitud de incorporación (formulario web)'
      };
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify(payload)
        });
        const j = await res.json();
        if (!res.ok) throw new Error(j.error || 'Error enviando');
        this.reset();
        if (successMsg) { successMsg.style.display = 'block'; setTimeout(()=> successMsg.style.display='none',5000); }
        alert('Solicitud enviada correctamente.');
      } catch (err) {
        alert('Error enviando formulario: ' + (err.message || err));
      }
    });
  }
});

})();
