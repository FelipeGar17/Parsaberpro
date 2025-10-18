// ========================================
// RESULTADOS DETALLADOS DE ESTUDIANTE
// ========================================

const API_BASE = '/api';
let currentUser = null;
let puntajes = null;
let mostrandoTodas = false;

// ========================================
// INICIALIZACIÓN
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadUserData();
    loadPuntajes();
});

// ========================================
// AUTENTICACIÓN
// ========================================
function checkAuth() {
    const usuario = localStorage.getItem('usuario');
    
    if (!usuario) {
        window.location.href = '/login.html';
        return;
    }
    
    currentUser = JSON.parse(usuario);
    
    if (currentUser.rol !== 'ESTUDIANTE') {
        window.location.href = '/coordinador-dashboard.html';
        return;
    }
}

function loadUserData() {
    if (!currentUser) return;
    
    const userFullName = document.getElementById('userFullName');
    const userAvatar = document.getElementById('userAvatar');
    
    if (userFullName) {
        userFullName.textContent = `${currentUser.nombre || ''} ${currentUser.apellido || ''}`.trim();
    }
    
    if (userAvatar) {
        const iniciales = getIniciales(currentUser.nombre, currentUser.apellido);
        userAvatar.textContent = iniciales;
    }
}

function getIniciales(nombre, apellido) {
    const n = nombre ? nombre.charAt(0).toUpperCase() : '';
    const a = apellido ? apellido.charAt(0).toUpperCase() : '';
    return n + a || 'E';
}

function logout() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        localStorage.removeItem('usuario');
        window.location.href = '/login.html';
    }
}

// ========================================
// CARGAR PUNTAJES
// ========================================
async function loadPuntajes() {
    try {
        const response = await fetch(`${API_BASE}/puntajes/estudiante/${currentUser.id}`);
        
        if (response.ok) {
            puntajes = await response.json();
            console.log('Puntajes cargados:', puntajes);
            
            // Verificar si el examen está anulado
            if (puntajes.anulado) {
                document.getElementById('alertAnulado').style.display = 'flex';
                return;
            }
            
            // Mostrar resultados
            mostrarResultados();
            
        } else if (response.status === 404) {
            // No tiene puntajes registrados
            document.getElementById('sinPuntajes').style.display = 'block';
        } else {
            console.error('Error al cargar puntajes');
            document.getElementById('sinPuntajes').style.display = 'block';
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('sinPuntajes').style.display = 'block';
    }
}

// ========================================
// MOSTRAR RESULTADOS
// ========================================
function mostrarResultados() {
    document.getElementById('resultadosContent').style.display = 'block';
    
    // Obtener puntaje global (ya viene calculado)
    const total = puntajes.puntajeGlobal || 0;
    document.getElementById('puntajeGlobal').textContent = total;
    
    // Mostrar competencias
    mostrarCompetencias();
    
    // Mostrar beneficios
    mostrarBeneficios(total);
}

function mostrarCompetencias() {
    const competencias = [
        {
            nombre: 'Lectura Crítica',
            puntaje: puntajes.lecturaCritica,
            nivel: puntajes.lecturaCriticaNivel
        },
        {
            nombre: 'Razonamiento Cuantitativo',
            puntaje: puntajes.razonamientoCuantitativo,
            nivel: puntajes.razonamientoCuantitativoNivel
        },
        {
            nombre: 'Competencias Ciudadanas',
            puntaje: puntajes.competenciasCiudadanas,
            nivel: puntajes.competenciasCiudadanasNivel
        },
        {
            nombre: 'Comunicación Escrita',
            puntaje: puntajes.comunicacionEscrita,
            nivel: puntajes.comunicacionEscritaNivel
        },
        {
            nombre: 'Inglés',
            puntaje: puntajes.ingles,
            nivel: puntajes.inglesNivel
        }
    ];
    
    // Mostrar primeras 3 competencias
    const principales = document.getElementById('competenciasPrincipales');
    principales.innerHTML = '';
    
    for (let i = 0; i < 3 && i < competencias.length; i++) {
        principales.innerHTML += crearCardCompetencia(competencias[i]);
    }
    
    // Guardar las restantes
    const restantes = document.getElementById('competenciasRestantes');
    restantes.innerHTML = '';
    
    for (let i = 3; i < competencias.length; i++) {
        restantes.innerHTML += crearCardCompetencia(competencias[i]);
    }
}

function crearCardCompetencia(competencia) {
    return `
        <div class="competencia-card">
            <p class="competencia-nombre">${competencia.nombre}</p>
            <div class="competencia-puntaje">${competencia.puntaje || 0}</div>
            <span class="competencia-nivel nivel-${competencia.nivel || 1}">
                Nivel ${competencia.nivel || 1}
            </span>
        </div>
    `;
}

function toggleCompetencias() {
    const adicionales = document.getElementById('competenciasAdicionales');
    const btn = document.getElementById('btnVerMas');
    
    if (mostrandoTodas) {
        adicionales.style.display = 'none';
        btn.innerHTML = 'Ver más resultados ▼';
        mostrandoTodas = false;
    } else {
        adicionales.style.display = 'block';
        btn.innerHTML = 'Ver menos resultados ▲';
        mostrandoTodas = true;
    }
}

// ========================================
// MOSTRAR BENEFICIOS
// ========================================
function mostrarBeneficios(total) {
    const container = document.getElementById('beneficiosDisponibles');
    
    if (total < 180) {
        // Sin beneficios
        container.innerHTML = `
            <div class="no-beneficios">
                <div class="no-beneficios-icon">📋</div>
                <h3>Sin beneficios disponibles</h3>
                <p>Tu puntaje actual (${total} puntos) no cumple con los requisitos mínimos para acceder a beneficios institucionales.</p>
                <p style="margin-top: 1rem; color: #6b7280;">
                    Se requiere un puntaje mínimo de 180 puntos para acceder a beneficios.
                </p>
            </div>
        `;
    } else {
        const beneficios = obtenerBeneficios(total);
        let html = '<div style="margin-top: 1rem;">';
        
        beneficios.forEach(beneficio => {
            html += `
                <div class="beneficio-item">
                    <div class="beneficio-icon">${beneficio.icon}</div>
                    <div class="beneficio-content">
                        <h4>${beneficio.titulo}</h4>
                        <p>${beneficio.descripcion}</p>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
    }
}

function obtenerBeneficios(total) {
    const beneficios = [];
    
    if (total >= 180 && total <= 210) {
        beneficios.push({
            icon: '📝',
            titulo: 'Exoneración de Trabajo de Grado / Seminario IV',
            descripcion: 'Te exoneras de la entrega del informe final de trabajo de grado o de realizar Seminario de grado IV, con nota de cuatro punto cinco (4.5).'
        });
    } else if (total >= 211 && total <= 240) {
        beneficios.push({
            icon: '📝',
            titulo: 'Exoneración de Trabajo de Grado / Seminario IV',
            descripcion: 'Te exoneras de la entrega del informe final de trabajo de grado o de realizar Seminario de grado IV, con nota de cuatro punto siete (4.7).'
        });
        beneficios.push({
            icon: '🎓',
            titulo: 'Beca del 50% en Derechos de Grado',
            descripcion: 'Obtienes una beca del 50% en el valor de los derechos de grado.'
        });
    } else if (total >= 241) {
        beneficios.push({
            icon: '📝',
            titulo: 'Exoneración de Trabajo de Grado / Seminario IV',
            descripcion: 'Te exoneras de la entrega del informe final de trabajo de grado o de realizar Seminario de grado IV, con nota de cinco punto cero (5.0).'
        });
        beneficios.push({
            icon: '🎓',
            titulo: 'Beca del 100% en Derechos de Grado',
            descripcion: 'Obtienes una beca del 100% en el valor de los derechos de grado (exoneración total).'
        });
    }
    
    return beneficios;
}
