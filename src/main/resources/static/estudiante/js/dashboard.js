// ========================================
// DASHBOARD DE ESTUDIANTE
// ========================================

const API_BASE = '/api';
let currentUser = null;
let puntajes = null;

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
    
    // Debug: ver qué datos tenemos
    console.log('Datos del usuario:', currentUser);
    
    // Actualizar nombre en header
    const userName = document.getElementById('userName');
    const userFullName = document.getElementById('userFullName');
    const userAvatar = document.getElementById('userAvatar');
    
    if (userName) {
        userName.textContent = currentUser.nombre || currentUser.primerNombre || 'Estudiante';
    }
    
    if (userFullName) {
        const nombreCompleto = `${currentUser.primerNombre || currentUser.nombre || ''} ${currentUser.segundoNombre || ''} ${currentUser.primerApellido || currentUser.apellido || ''} ${currentUser.segundoApellido || ''}`.trim().replace(/\s+/g, ' ');
        userFullName.textContent = nombreCompleto;
    }
    
    if (userAvatar) {
        const iniciales = getIniciales(currentUser.primerNombre || currentUser.nombre, currentUser.primerApellido || currentUser.apellido);
        userAvatar.textContent = iniciales;
    }
    
    // Llenar información personal
    document.getElementById('infoDocumento').textContent = currentUser.documento || currentUser.numeroDocumento || '-';
    document.getElementById('infoCorreo').textContent = currentUser.correoElectronico || currentUser.email || '-';
    document.getElementById('infoTelefono').textContent = currentUser.numeroTelefonico || currentUser.telefono || '-';
    document.getElementById('infoPrograma').textContent = currentUser.programa || '-';
    document.getElementById('infoRegistro').textContent = currentUser.numeroRegistro || currentUser.registro || '-';
    
    console.log('Teléfono:', currentUser.numeroTelefonico, currentUser.telefono);
    console.log('Registro:', currentUser.numeroRegistro, currentUser.registro);
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
                mostrarAlertaAnulado();
                return;
            }
            
            // Obtener puntaje global (ya viene calculado)
            const total = puntajes.puntajeGlobal || 0;
            
            // Verificar puntaje bajo (< 80)
            if (total < 80) {
                mostrarAlertaPuntajeBajo();
            }
            
            // Mostrar resumen
            mostrarResumenPuntaje(total);
            mostrarBeneficios(total);
            
        } else if (response.status === 404) {
            // No tiene puntajes registrados
            mostrarAlertaSinPuntajes();
        } else {
            console.error('Error al cargar puntajes');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Ya no necesitamos calcular, usamos puntajeGlobal directamente

// ========================================
// MOSTRAR ALERTAS
// ========================================
function mostrarAlertaSinPuntajes() {
    document.getElementById('alertSinPuntajes').style.display = 'flex';
}

function mostrarAlertaAnulado() {
    document.getElementById('alertAnulado').style.display = 'flex';
}

function mostrarAlertaPuntajeBajo() {
    document.getElementById('alertPuntajeBajo').style.display = 'flex';
}

// ========================================
// MOSTRAR RESUMEN
// ========================================
function mostrarResumenPuntaje(total) {
    document.getElementById('resumenPuntaje').style.display = 'block';
    document.getElementById('puntajeTotal').textContent = total;
}

function mostrarBeneficios(total) {
    const container = document.getElementById('beneficiosContainer');
    
    if (total < 180) {
        // Sin beneficios
        container.innerHTML = `
            <div class="no-beneficios">
                <div class="no-beneficios-icon">📋</div>
                <h3>Sin beneficios disponibles</h3>
                <p>Tu puntaje actual no cumple con los requisitos para acceder a beneficios institucionales.</p>
                <p style="margin-top: 1rem;">
                    <a href="informacion.html" class="btn btn-outline">
                        Ver información sobre beneficios
                    </a>
                </p>
            </div>
        `;
    } else {
        const beneficios = obtenerBeneficios(total);
        let html = '';
        
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
        
        html += `
            <div style="text-align: center; margin-top: 1rem;">
                <a href="informacion.html" class="btn btn-outline">
                    ℹ️ Ver proceso completo de beneficios
                </a>
            </div>
        `;
        
        container.innerHTML = html;
    }
}

function obtenerBeneficios(total) {
    const beneficios = [];
    
    if (total >= 180 && total <= 210) {
        beneficios.push({
            icon: '📝',
            titulo: 'Exoneración de Trabajo de Grado / Seminario IV',
            descripcion: 'Nota de cuatro punto cinco (4.5)'
        });
    } else if (total >= 211 && total <= 240) {
        beneficios.push({
            icon: '📝',
            titulo: 'Exoneración de Trabajo de Grado / Seminario IV',
            descripcion: 'Nota de cuatro punto siete (4.7)'
        });
        beneficios.push({
            icon: '🎓',
            titulo: 'Beca del 50% en Derechos de Grado',
            descripcion: 'Reducción del 50% en el costo de los derechos de grado'
        });
    } else if (total >= 241) {
        beneficios.push({
            icon: '📝',
            titulo: 'Exoneración de Trabajo de Grado / Seminario IV',
            descripcion: 'Nota de cinco punto cero (5.0)'
        });
        beneficios.push({
            icon: '🎓',
            titulo: 'Beca del 100% en Derechos de Grado',
            descripcion: 'Exoneración total del costo de los derechos de grado'
        });
    }
    
    return beneficios;
}
