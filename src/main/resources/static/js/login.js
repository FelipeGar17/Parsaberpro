// ========================================
// LÓGICA DEL LOGIN
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const btnLogin = document.getElementById('btnLogin');
    const btnText = btnLogin.querySelector('.btn-text');
    const btnLoader = btnLogin.querySelector('.btn-loader');
    const alertMessage = document.getElementById('alertMessage');

    // Focus automático en el email
    emailInput.focus();

    // Manejar el submit del formulario
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Validaciones
        if (!email || !password) {
            showAlert('Por favor completa todos los campos', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showAlert('Por favor ingresa un email válido', 'error');
            return;
        }

        // Realizar login
        await login(email, password);
    });

    // Función para realizar el login
    async function login(email, password) {
        // Mostrar loading
        setLoading(true);
        hideAlert();

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.exito) {
                // Login exitoso
                showAlert('¡Login exitoso! Redirigiendo...', 'success');
                
                // Guardar información del usuario en localStorage
                localStorage.setItem('usuario', JSON.stringify(data));
                
                // Redireccionar según el rol
                setTimeout(() => {
                    if (data.rol === 'COORDINADOR') {
                        window.location.href = '/coordinador-dashboard.html';
                    } else if (data.rol === 'ESTUDIANTE') {
                        window.location.href = '/estudiante/dashboard.html';
                    }
                }, 1500);
            } else {
                // Login fallido
                showAlert(data.mensaje || 'Error al iniciar sesión', 'error');
                setLoading(false);
            }
        } catch (error) {
            console.error('Error:', error);
            showAlert('Error de conexión. Verifica que el servidor esté activo.', 'error');
            setLoading(false);
        }
    }

    // Función para mostrar/ocultar loading
    function setLoading(loading) {
        if (loading) {
            btnLogin.disabled = true;
            btnText.style.display = 'none';
            btnLoader.style.display = 'inline';
        } else {
            btnLogin.disabled = false;
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
        }
    }

    // Función para mostrar alertas
    function showAlert(message, type) {
        alertMessage.textContent = message;
        alertMessage.className = 'alert';
        
        if (type === 'success') {
            alertMessage.classList.add('alert-success');
            alertMessage.textContent = '✅ ' + message;
        } else if (type === 'error') {
            alertMessage.classList.add('alert-error');
            alertMessage.textContent = '❌ ' + message;
        } else if (type === 'warning') {
            alertMessage.classList.add('alert-warning');
            alertMessage.textContent = '⚠️ ' + message;
        } else if (type === 'info') {
            alertMessage.classList.add('alert-info');
            alertMessage.textContent = 'ℹ️ ' + message;
        }
        
        alertMessage.style.display = 'block';
    }

    // Función para ocultar alertas
    function hideAlert() {
        alertMessage.style.display = 'none';
    }

    // Validar formato de email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Cerrar alerta al hacer click
    alertMessage.addEventListener('click', hideAlert);
});

// ========================================
// FUNCIÓN PARA VERIFICAR SI HAY SESIÓN
// ========================================
function checkSession() {
    const usuario = localStorage.getItem('usuario');
    
    if (usuario) {
        const userData = JSON.parse(usuario);
        
        // Si ya hay sesión, redirigir según el rol
        if (userData.rol === 'COORDINADOR') {
            window.location.href = '/coordinador-dashboard.html';
        } else if (userData.rol === 'ESTUDIANTE') {
            window.location.href = '/estudiante/dashboard.html';
        }
    }
}

// Verificar sesión al cargar la página
checkSession();
