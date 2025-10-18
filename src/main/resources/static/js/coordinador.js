// ========================================
// LÓGICA DEL DASHBOARD DEL COORDINADOR
// ========================================

// Constantes
const API_BASE = '/api';

// Variables globales
let currentUser = null;

// ========================================
// INICIALIZACIÓN
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación
    checkAuth();
    
    // Cargar datos del usuario
    loadUserData();
    
    // Cargar estadísticas
    loadStatistics();
    
    // Cargar estudiantes recientes
    loadRecentStudents();
    
    // Verificar conexión a la BD
    checkDatabaseConnection();
});

// ========================================
// AUTENTICACIÓN Y USUARIO
// ========================================
function checkAuth() {
    const usuario = localStorage.getItem('usuario');
    
    if (!usuario) {
        // No hay sesión, redirigir al login
        window.location.href = '/login.html';
        return;
    }
    
    currentUser = JSON.parse(usuario);
    
    // Verificar que sea coordinador
    if (currentUser.rol !== 'COORDINADOR') {
        // Si es estudiante, redirigir a su dashboard
        window.location.href = '/estudiante-dashboard.html';
        return;
    }
}

function loadUserData() {
    if (!currentUser) return;
    
    // Actualizar nombre en el header
    const userName = document.getElementById('userName');
    const userFullName = document.getElementById('userFullName');
    const userAvatar = document.getElementById('userAvatar');
    
    if (userName) {
        userName.textContent = currentUser.nombre || 'Coordinador';
    }
    
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
    // Confirmar logout
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        localStorage.removeItem('usuario');
        window.location.href = '/login.html';
    }
}

// ========================================
// ESTADÍSTICAS
// ========================================
async function loadStatistics() {
    try {
        // Obtener todos los usuarios
        const response = await fetch(`${API_BASE}/auth/estudiantes`);
        
        if (response.ok) {
            const usuarios = await response.json();
            
            // Filtrar SOLO estudiantes ACTIVOS (no coordinadores ni inactivos)
            const estudiantes = usuarios.filter(u => u.rol === 'ESTUDIANTE' && u.activo === true);
            
            // Total de estudiantes ACTIVOS
            const totalEstudiantes = document.getElementById('totalEstudiantes');
            if (totalEstudiantes) {
                totalEstudiantes.textContent = estudiantes.length;
            }
            
            // Estudiantes activos (es el mismo que el total ahora)
            const estudiantesActivos = document.getElementById('estudiantesActivos');
            if (estudiantesActivos) {
                estudiantesActivos.textContent = estudiantes.length;
            }
            
            // Por ahora, puntajes y promedio en 0 (lo implementaremos después)
            const puntajesRegistrados = document.getElementById('puntajesRegistrados');
            if (puntajesRegistrados) {
                puntajesRegistrados.textContent = '0';
            }
            
            const promedioGeneral = document.getElementById('promedioGeneral');
            if (promedioGeneral) {
                promedioGeneral.textContent = '0';
            }
        }
    } catch (error) {
        console.error('Error al cargar estadísticas:', error);
    }
}

// ========================================
// ESTUDIANTES RECIENTES
// ========================================
async function loadRecentStudents() {
    try {
        const response = await fetch(`${API_BASE}/auth/estudiantes`);
        
        if (response.ok) {
            const estudiantes = await response.json();
            
            // Filtrar solo estudiantes ACTIVOS (no coordinadores ni inactivos)
            const soloEstudiantes = estudiantes.filter(e => e.rol === 'ESTUDIANTE' && e.activo === true);
            
            // Obtener los últimos 5
            const recientes = soloEstudiantes.slice(-5).reverse();
            
            displayRecentStudents(recientes);
        }
    } catch (error) {
        console.error('Error al cargar estudiantes recientes:', error);
    }
}

function displayRecentStudents(estudiantes) {
    const lista = document.getElementById('recentStudentsList');
    
    if (!lista) return;
    
    if (estudiantes.length === 0) {
        lista.innerHTML = `
            <li class="empty-state">
                <div class="empty-icon">📭</div>
                <p>No hay estudiantes registrados aún</p>
            </li>
        `;
        return;
    }
    
    lista.innerHTML = estudiantes.map(estudiante => {
        const iniciales = getIniciales(estudiante.nombre, estudiante.apellido);
        
        return `
            <li class="student-item">
                <div class="student-avatar">${iniciales}</div>
                <div class="student-info">
                    <p class="student-name">${estudiante.nombre} ${estudiante.apellido}</p>
                    <p class="student-details">
                        ${estudiante.email} • ${estudiante.programa || 'Sin programa'}
                    </p>
                </div>
            </li>
        `;
    }).join('');
}

// ========================================
// VERIFICAR CONEXIÓN A BASE DE DATOS
// ========================================
async function checkDatabaseConnection() {
    const connectionStatus = document.getElementById('connectionStatus');
    
    if (!connectionStatus) return;
    
    try {
        // Hacer una petición simple para verificar que el servidor responda
        const response = await fetch(`${API_BASE}/estudiantes/test`);
        
        if (response.ok) {
            connectionStatus.className = 'connection-status connected';
            connectionStatus.innerHTML = `
                <span class="status-dot connected"></span>
                <span>Conectado a BD</span>
            `;
        } else {
            throw new Error('No conectado');
        }
    } catch (error) {
        connectionStatus.className = 'connection-status disconnected';
        connectionStatus.innerHTML = `
            <span class="status-dot disconnected"></span>
            <span>Sin conexión</span>
        `;
    }
}

// ========================================
// UTILIDADES
// ========================================
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}
