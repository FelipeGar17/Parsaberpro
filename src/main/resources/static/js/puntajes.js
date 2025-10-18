// ========================================
// GESTIÓN DE PUNTAJES
// ========================================

const API_BASE = '/api';
let currentUser = null;
let estudianteActual = null;
let todosLosEstudiantes = [];

// ========================================
// INICIALIZACIÓN
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadUserData();
    cargarEstudiantesTabla();
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
    
    if (currentUser.rol !== 'COORDINADOR') {
        window.location.href = '/estudiante-dashboard.html';
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
    return n + a || 'C';
}

function logout() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        localStorage.removeItem('usuario');
        window.location.href = '/login.html';
    }
}

// ========================================
// BUSCAR ESTUDIANTE
// ========================================
async function buscarEstudiante() {
    const numeroRegistro = document.getElementById('numeroRegistroBuscar').value.trim();
    
    if (!numeroRegistro) {
        showAlert('Por favor ingresa un número de registro', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/auth/estudiantes`);
        
        if (response.ok) {
            const usuarios = await response.json();
            
            // Buscar estudiante por número de registro
            const estudiante = usuarios.find(u => 
                u.numeroRegistro === numeroRegistro && 
                u.rol === 'ESTUDIANTE' && 
                u.activo === true
            );
            
            if (estudiante) {
                estudianteActual = estudiante;
                mostrarInfoEstudiante(estudiante);
                mostrarFormularioPuntajes();
            } else {
                showAlert('No se encontró estudiante activo con ese número de registro', 'error');
                ocultarInfoEstudiante();
            }
        }
    } catch (error) {
        console.error('Error al buscar estudiante:', error);
        showAlert('Error al buscar estudiante', 'error');
    }
}

function mostrarInfoEstudiante(estudiante) {
    const nombreCompleto = `${estudiante.primerNombre || ''} ${estudiante.segundoNombre || ''} ${estudiante.primerApellido || ''} ${estudiante.segundoApellido || ''}`.trim();
    
    document.getElementById('estudianteNombre').textContent = nombreCompleto;
    document.getElementById('estudianteDocumento').textContent = estudiante.numeroDocumento || estudiante.documento;
    document.getElementById('estudiantePrograma').textContent = estudiante.programa || 'Sin programa';
    
    const estadoBadge = document.getElementById('estudianteEstado');
    if (estudiante.tienePuntajes) {
        estadoBadge.textContent = '✅ Con puntajes';
        estadoBadge.className = 'badge badge-success';
    } else {
        estadoBadge.textContent = '⏳ Sin puntajes';
        estadoBadge.className = 'badge badge-warning';
    }
    
    document.getElementById('estudianteInfo').style.display = 'block';
    
    // Guardar IDs ocultos
    document.getElementById('estudianteId').value = estudiante.id;
    document.getElementById('numeroRegistro').value = estudiante.numeroRegistro;
}

function ocultarInfoEstudiante() {
    document.getElementById('estudianteInfo').style.display = 'none';
    document.getElementById('puntajesForm').style.display = 'none';
}

function mostrarFormularioPuntajes() {
    document.getElementById('puntajesForm').style.display = 'block';
}

// ========================================
// CALCULAR Y MOSTRAR NIVELES
// ========================================
function togglePuntajesFields() {
    const anulado = document.getElementById('anulado').checked;
    const puntajesFields = document.getElementById('puntajesFields');
    const inputs = puntajesFields.querySelectorAll('input[type="number"]');
    
    if (anulado) {
        // Deshabilitar todos los campos de puntaje
        inputs.forEach(input => {
            input.disabled = true;
            input.required = false;
            input.value = '';
        });
        // Limpiar badges de nivel
        document.querySelectorAll('.nivel-badge').forEach(badge => {
            badge.textContent = 'ANULADO';
            badge.className = 'nivel-badge anulado';
        });
    } else {
        // Habilitar todos los campos de puntaje
        inputs.forEach(input => {
            input.disabled = false;
            input.required = true;
        });
        // Limpiar badges de nivel
        document.querySelectorAll('.nivel-badge').forEach(badge => {
            badge.textContent = '';
            badge.className = 'nivel-badge';
        });
    }
}

function calcularNivel(puntaje) {
    puntaje = parseInt(puntaje);
    if (isNaN(puntaje) || puntaje < 0) return '';
    if (puntaje <= 125) return '1';
    if (puntaje <= 155) return '2';
    if (puntaje <= 190) return '3';
    if (puntaje <= 245) return '4';
    return '5';
}

function actualizarNivel(puntaje, elementoId) {
    const nivel = calcularNivel(puntaje);
    const badge = document.getElementById(elementoId);
    
    if (nivel) {
        badge.textContent = `Nivel ${nivel}`;
        badge.className = `nivel-badge nivel-${nivel}`;
    } else {
        badge.textContent = '';
        badge.className = 'nivel-badge';
    }
}

// Actualizar nivel global al cambiar
document.addEventListener('DOMContentLoaded', function() {
    const puntajeGlobalInput = document.getElementById('puntajeGlobal');
    if (puntajeGlobalInput) {
        puntajeGlobalInput.addEventListener('input', function() {
            actualizarNivel(this.value, 'nivelGlobal');
        });
    }
});

// ========================================
// REGISTRAR PUNTAJES
// ========================================
async function registrarPuntajes(event) {
    event.preventDefault();
    
    if (!estudianteActual) {
        showAlert('No hay estudiante seleccionado', 'error');
        return;
    }
    
    const anulado = document.getElementById('anulado').checked;
    
    const data = {
        numeroRegistro: document.getElementById('numeroRegistro').value,
        anulado: anulado
    };
    
    // Solo incluir puntajes si NO está anulado
    if (!anulado) {
        data.puntajeGlobal = parseInt(document.getElementById('puntajeGlobal').value);
        data.comunicacionEscrita = parseInt(document.getElementById('comunicacionEscrita').value);
        data.razonamientoCuantitativo = parseInt(document.getElementById('razonamientoCuantitativo').value);
        data.lecturaCritica = parseInt(document.getElementById('lecturaCritica').value);
        data.competenciasCiudadanas = parseInt(document.getElementById('competenciasCiudadanas').value);
        data.ingles = parseInt(document.getElementById('ingles').value);
    }
    
    try {
        const btnGuardar = document.getElementById('btnGuardar');
        btnGuardar.disabled = true;
        btnGuardar.textContent = '⏳ Guardando...';
        
        const response = await fetch(`${API_BASE}/puntajes/registrar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Coordinador-Id': currentUser.id || 'SYSTEM'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.exito) {
            showFormAlert('✅ ' + result.mensaje, 'success');
            
            setTimeout(() => {
                limpiarFormulario();
                cargarEstudiantesTabla();
            }, 2000);
        } else {
            showFormAlert('❌ ' + result.mensaje, 'error');
            btnGuardar.disabled = false;
            btnGuardar.textContent = '💾 Guardar Puntajes';
        }
    } catch (error) {
        console.error('Error:', error);
        showFormAlert('❌ Error al guardar puntajes', 'error');
        
        const btnGuardar = document.getElementById('btnGuardar');
        btnGuardar.disabled = false;
        btnGuardar.textContent = '💾 Guardar Puntajes';
    }
}

// ========================================
// LIMPIAR FORMULARIO
// ========================================
function limpiarFormulario() {
    document.getElementById('numeroRegistroBuscar').value = '';
    document.getElementById('puntajesForm').reset();
    document.getElementById('anulado').checked = false;
    togglePuntajesFields(); // Resetear estado de campos
    document.getElementById('estudianteInfo').style.display = 'none';
    document.getElementById('puntajesForm').style.display = 'none';
    hideFormAlert();
    estudianteActual = null;
    
    // Limpiar badges de nivel
    document.querySelectorAll('.nivel-badge').forEach(badge => {
        badge.textContent = '';
        badge.className = 'nivel-badge';
    });
    
    const btnGuardar = document.getElementById('btnGuardar');
    btnGuardar.disabled = false;
    btnGuardar.textContent = '💾 Guardar Puntajes';
}

// ========================================
// CARGAR TABLA DE ESTUDIANTES
// ========================================
async function cargarEstudiantesTabla() {
    try {
        const response = await fetch(`${API_BASE}/auth/estudiantes`);
        
        if (response.ok) {
            const usuarios = await response.json();
            
            // Filtrar solo estudiantes activos
            todosLosEstudiantes = usuarios.filter(u => 
                u.rol === 'ESTUDIANTE' && u.activo === true
            );
            
            mostrarEstudiantesEnTabla(todosLosEstudiantes);
            actualizarContadores(todosLosEstudiantes);
        }
    } catch (error) {
        console.error('Error al cargar estudiantes:', error);
    }
}

function mostrarEstudiantesEnTabla(estudiantes) {
    const tbody = document.getElementById('estudiantesTableBody');
    
    if (estudiantes.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-state-cell">
                    <div class="empty-icon">📭</div>
                    <p>No hay estudiantes registrados</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = estudiantes.map(est => {
        const nombreCompleto = `${est.primerNombre || ''} ${est.primerApellido || ''}`.trim();
        const estadoBadge = est.tienePuntajes 
            ? '<span class="badge badge-success">✅ Con puntajes</span>'
            : '<span class="badge badge-warning">⏳ Sin puntajes</span>';
        
        const btnAccion = est.tienePuntajes
            ? '<button class="btn btn-outline btn-action-table" disabled>✅ Registrado</button>'
            : `<button class="btn btn-primary btn-action-table" onclick="cargarEstudianteEnFormulario('${est.numeroRegistro}')">📝 Registrar</button>`;
        
        return `
            <tr>
                <td>${est.numeroRegistro || '-'}</td>
                <td>${nombreCompleto}</td>
                <td>${est.programa || 'Sin programa'}</td>
                <td>${estadoBadge}</td>
                <td>${btnAccion}</td>
            </tr>
        `;
    }).join('');
}

function actualizarContadores(estudiantes) {
    const conPuntajes = estudiantes.filter(e => e.tienePuntajes).length;
    const sinPuntajes = estudiantes.length - conPuntajes;
    
    document.getElementById('countConPuntajes').textContent = conPuntajes;
    document.getElementById('countSinPuntajes').textContent = sinPuntajes;
}

function cargarEstudianteEnFormulario(numeroRegistro) {
    document.getElementById('numeroRegistroBuscar').value = numeroRegistro;
    buscarEstudiante();
    
    // Scroll al formulario
    document.querySelector('.puntajes-form-card').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

// ========================================
// ALERTAS
// ========================================
function showFormAlert(message, type) {
    const alert = document.getElementById('formAlert');
    
    if (!alert) return;
    
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    alert.style.display = 'block';
}

function hideFormAlert() {
    const alert = document.getElementById('formAlert');
    if (alert) {
        alert.style.display = 'none';
    }
}

function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '10000';
    alertDiv.style.minWidth = '300px';
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}
