// ========================================
// INFORMACIÓN SABER PRO
// ========================================

let currentUser = null;

// ========================================
// INICIALIZACIÓN
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadUserData();
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
