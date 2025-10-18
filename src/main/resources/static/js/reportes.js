// ========================================
// GESTIÓN DE REPORTES
// ========================================

const API_BASE = '/api';
let currentUser = null;

// ========================================
// INICIALIZACIÓN
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadUserData();
    cargarEstadisticas();
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
// CARGAR ESTADÍSTICAS
// ========================================
async function cargarEstadisticas() {
    try {
        const response = await fetch(`${API_BASE}/auth/estudiantes`);
        
        if (response.ok) {
            const usuarios = await response.json();
            
            const estudiantes = usuarios.filter(u => 
                u.rol === 'ESTUDIANTE' && u.activo === true
            );
            
            const conPuntajes = estudiantes.filter(e => e.tienePuntajes).length;
            const sinPuntajes = estudiantes.length - conPuntajes;
            
            document.getElementById('totalEstudiantes').textContent = estudiantes.length;
            document.getElementById('conPuntajes').textContent = conPuntajes;
            document.getElementById('totalPuntajes').textContent = conPuntajes;
            document.getElementById('sinPuntajes').textContent = sinPuntajes;
        }
    } catch (error) {
        console.error('Error al cargar estadísticas:', error);
    }
}

// ========================================
// DESCARGAR REPORTES
// ========================================
async function descargarReporteEstudiantes() {
    const btn = document.getElementById('btnEstudiantes');
    const originalContent = btn.innerHTML;
    
    try {
        btn.disabled = true;
        btn.innerHTML = '<div class="loading-spinner"></div><span>Generando...</span>';
        
        const response = await fetch(`${API_BASE}/reportes/estudiantes/excel`);
        
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            
            // Obtener el nombre del archivo del header o usar uno por defecto
            const contentDisposition = response.headers.get('content-disposition');
            let filename = 'Reporte_Estudiantes.xlsx';
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/i);
                if (filenameMatch && filenameMatch[1]) {
                    filename = filenameMatch[1].replace(/['"]/g, '').trim();
                }
            }
            
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            showNotification('✅ Reporte descargado exitosamente', 'success');
        } else {
            showNotification('❌ Error al generar el reporte', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('❌ Error al descargar el reporte', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalContent;
    }
}

async function descargarReportePuntajes() {
    const btn = document.getElementById('btnPuntajes');
    const originalContent = btn.innerHTML;
    
    try {
        btn.disabled = true;
        btn.innerHTML = '<div class="loading-spinner"></div><span>Generando...</span>';
        
        const response = await fetch(`${API_BASE}/reportes/puntajes/excel`);
        
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            
            // Obtener el nombre del archivo del header o usar uno por defecto
            const contentDisposition = response.headers.get('content-disposition');
            let filename = 'Reporte_Puntajes_SaberPRO.xlsx';
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/i);
                if (filenameMatch && filenameMatch[1]) {
                    filename = filenameMatch[1].replace(/['"]/g, '').trim();
                }
            }
            
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            showNotification('✅ Reporte descargado exitosamente', 'success');
        } else {
            showNotification('❌ Error al generar el reporte', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('❌ Error al descargar el reporte', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalContent;
    }
}

// ========================================
// NOTIFICACIONES
// ========================================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type}`;
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '10000';
    notification.style.minWidth = '300px';
    notification.style.animation = 'slideIn 0.3s ease-out';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Agregar estilos para las animaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
