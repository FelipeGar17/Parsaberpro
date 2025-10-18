// ========================================
// GESTIÓN DE ESTUDIANTES - PÁGINA PRINCIPAL
// ========================================

const API_BASE = '/api';
let currentUser = null;
let allStudents = [];

// ========================================
// INICIALIZACIÓN
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación
    checkAuth();
    
    // Cargar datos del usuario
    loadUserData();
    
    // Cargar estudiantes
    loadStudents();
    
    // Escuchar mensajes del iframe
    window.addEventListener('message', handleFormMessage);
});

// ========================================
// AUTENTICACIÓN Y DATOS DEL USUARIO
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
// CARGAR ESTUDIANTES
// ========================================
async function loadStudents() {
    try {
        const response = await fetch(`${API_BASE}/auth/estudiantes`);
        
        if (response.ok) {
            const usuarios = await response.json();
            
            // Filtrar solo estudiantes ACTIVOS
            allStudents = usuarios.filter(u => u.rol === 'ESTUDIANTE' && u.activo === true);
            
            console.log(`📊 Total de estudiantes activos: ${allStudents.length}`);
            displayStudents(allStudents);
        }
    } catch (error) {
        console.error('Error al cargar estudiantes:', error);
        showAlert('Error al cargar estudiantes', 'error');
    }
}

function displayStudents(students) {
    const tbody = document.getElementById('studentsTableBody');
    
    if (!tbody) return;
    
    if (students.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" class="empty-state-cell">
                    <div class="empty-icon">📭</div>
                    <p>No hay estudiantes registrados</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = students.map(student => `
        <tr>
            <td>${student.tipoDocumento || '-'}</td>
            <td>${student.numeroDocumento || student.documento || '-'}</td>
            <td>${student.primerApellido || '-'}</td>
            <td>${student.segundoApellido || '-'}</td>
            <td>${student.primerNombre || '-'}</td>
            <td>${student.segundoNombre || '-'}</td>
            <td>${student.correoElectronico || student.email || '-'}</td>
            <td>${student.numeroTelefonico || '-'}</td>
            <td>${student.numeroRegistro || '-'}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-action btn-edit" onclick="editStudent('${student.id}')" title="Editar">
                        ✏️
                    </button>
                    <button class="btn-action btn-delete" onclick="deleteStudent('${student.id}', '${student.primerNombre || student.nombre}')" title="Eliminar">
                        🗑️
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// ========================================
// BÚSQUEDA
// ========================================
function searchStudents() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    // Solo buscar en estudiantes ACTIVOS (allStudents ya está filtrado)
    const filtered = allStudents.filter(student => {
        // Asegurarse de que el estudiante esté activo
        if (student.activo === false) return false;
        
        const fullName = `${student.primerNombre || ''} ${student.segundoNombre || ''} ${student.primerApellido || ''} ${student.segundoApellido || ''} ${student.nombre || ''} ${student.apellido || ''}`.toLowerCase();
        const doc = (student.numeroDocumento || student.documento || '').toLowerCase();
        const email = (student.correoElectronico || student.email || '').toLowerCase();
        
        return fullName.includes(searchTerm) || 
               doc.includes(searchTerm) || 
               email.includes(searchTerm);
    });
    
    console.log(`🔍 Búsqueda: "${searchTerm}" - ${filtered.length} resultados`);
    displayStudents(filtered);
}

// ========================================
// MODAL Y COMUNICACIÓN CON IFRAME
// ========================================
function openCreateModal() {
    console.log('🔵 Abriendo modal de crear estudiante...');
    const modal = document.getElementById('studentModal');
    const iframe = document.getElementById('studentFormFrame');
    
    if (!modal) {
        console.error('❌ No se encontró el modal');
        return;
    }
    
    if (!iframe) {
        console.error('❌ No se encontró el iframe');
        return;
    }
    
    // IMPORTANTE: Resetear el src para cargar el formulario de creación
    iframe.src = '/forms/crear-estudiante.html';
    iframe.style.display = 'block';
    modal.classList.add('show');
    console.log('✅ Modal de creación abierto');
}

function closeModal() {
    console.log('🔵 Cerrando modal...');
    const modal = document.getElementById('studentModal');
    const iframe = document.getElementById('studentFormFrame');
    
    if (modal) {
        modal.classList.remove('show');
    }
    
    if (iframe) {
        iframe.style.display = 'none';
        // IMPORTANTE: Limpiar completamente el src para evitar reutilizar datos
        iframe.src = 'about:blank';
    }
    console.log('✅ Modal cerrado y reseteado');
}

// Manejar mensajes del formulario en el iframe
function handleFormMessage(event) {
    // Verificar origen (en producción, validar el origen)
    if (event.data.action === 'closeModal') {
        closeModal();
    } else if (event.data.action === 'studentCreated') {
        closeModal();
        loadStudents();
        showAlert('✅ Estudiante creado exitosamente', 'success');
    } else if (event.data.action === 'studentUpdated') {
        closeModal();
        loadStudents();
        showAlert('✅ Estudiante actualizado exitosamente', 'success');
    }
}

// Cerrar modal al hacer click fuera
window.onclick = function(event) {
    const modal = document.getElementById('studentModal');
    if (event.target === modal) {
        closeModal();
    }
}

// ========================================
// EDITAR ESTUDIANTE
// ========================================
function editStudent(id) {
    console.log('🔵 Editando estudiante:', id);
    const modal = document.getElementById('studentModal');
    const iframe = document.getElementById('studentFormFrame');
    
    if (!modal || !iframe) {
        console.error('❌ No se encontró el modal o iframe');
        return;
    }
    
    // Cargar el formulario de edición con el ID del estudiante
    iframe.src = `/forms/editar-estudiante.html?id=${id}`;
    iframe.style.display = 'block';
    modal.classList.add('show');
    console.log('✅ Modal de edición abierto');
}

// ========================================
// ELIMINAR ESTUDIANTE
// ========================================
async function deleteStudent(id, nombre) {
    console.log('🔵 Intentando eliminar estudiante:', id, nombre);
    
    // Confirmación con Bootstrap modal si está disponible, sino usar confirm nativo
    if (!confirm(`¿Estás seguro de eliminar al estudiante ${nombre}?\n\n⚠️ Esta acción marcará al estudiante como inactivo.`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/auth/estudiantes/${id}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.exito) {
            console.log('✅ Estudiante eliminado');
            showAlert('✅ Estudiante eliminado exitosamente', 'success');
            loadStudents();
        } else {
            console.error('❌ Error:', result.mensaje);
            showAlert('❌ ' + result.mensaje, 'error');
        }
    } catch (error) {
        console.error('❌ Error al eliminar:', error);
        showAlert('❌ Error al eliminar estudiante', 'error');
    }
}

// ========================================
// UTILIDADES
// ========================================
function showAlert(message, type = 'info') {
    // Crear alerta temporal en la página
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

// ========================================
// CARGA MASIVA DESDE EXCEL
// ========================================
function openUploadModal() {
    console.log('🔵 Abriendo modal de carga masiva...');
    const modal = document.getElementById('uploadModal');
    if (modal) {
        modal.classList.add('show');
        // Resetear el estado del modal
        document.getElementById('uploadResult').style.display = 'none';
        document.getElementById('uploadStatus').style.display = 'none';
        document.getElementById('excelFile').value = '';
    }
}

function closeUploadModal() {
    console.log('🔵 Cerrando modal de carga masiva...');
    const modal = document.getElementById('uploadModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function descargarPlantilla() {
    console.log('📥 Descargando plantilla Excel...');
    
    // Crear un Excel simple con la estructura esperada
    const csvContent = `Tipo Documento,Número Documento,Primer Apellido,Segundo Apellido,Primer Nombre,Segundo Nombre,Correo Electrónico,Teléfono,Número Registro,Programa Académico
CC,1234567890,García,López,Juan,Carlos,juan.garcia@ejemplo.com,3001234567,REG001,Ingeniería de Sistemas
CC,0987654321,Rodríguez,Martínez,María,Fernanda,maria.rodriguez@ejemplo.com,3009876543,REG002,Administración de Empresas`;
    
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'plantilla_estudiantes.csv';
    link.click();
    
    showAlert('📥 Plantilla descargada. Ábrela con Excel y guárdala como .xlsx', 'info');
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    
    if (!file) return;
    
    console.log('📁 Archivo seleccionado:', file.name);
    
    // Validar extensión
    if (!file.name.endsWith('.xlsx')) {
        showAlert('❌ El archivo debe ser formato .xlsx (Excel)', 'error');
        return;
    }
    
    // Subir archivo
    uploadExcelFile(file);
}

async function uploadExcelFile(file) {
    const uploadStatus = document.getElementById('uploadStatus');
    const uploadResult = document.getElementById('uploadResult');
    
    // Mostrar estado de carga
    uploadStatus.style.display = 'block';
    uploadResult.style.display = 'none';
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
        const response = await fetch(`${API_BASE}/excel/cargar-estudiantes`, {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        // Ocultar estado de carga
        uploadStatus.style.display = 'none';
        
        // Mostrar resultado
        uploadResult.style.display = 'block';
        
        if (result.exito) {
            uploadResult.innerHTML = `
                <div class="alert alert-success">
                    <h3>✅ Carga exitosa</h3>
                    <p>${result.mensaje}</p>
                    <div class="upload-stats">
                        <div class="stat-item">
                            <span class="stat-label">Total procesados:</span>
                            <span class="stat-value">${result.totalProcesados}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Exitosos:</span>
                            <span class="stat-value success">${result.totalExitosos}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Errores:</span>
                            <span class="stat-value error">${result.totalErrores}</span>
                        </div>
                    </div>
                    ${result.errores && result.errores.length > 0 ? `
                        <div class="error-details">
                            <h4>⚠️ Detalles de errores:</h4>
                            <ul>
                                ${result.errores.map(error => `<li>${error}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            `;
            
            // Recargar la tabla de estudiantes
            setTimeout(() => {
                loadStudents();
                closeUploadModal();
            }, 3000);
            
        } else {
            uploadResult.innerHTML = `
                <div class="alert alert-error">
                    <h3>❌ Error en la carga</h3>
                    <p>${result.mensaje}</p>
                </div>
            `;
        }
        
    } catch (error) {
        console.error('❌ Error al cargar archivo:', error);
        uploadStatus.style.display = 'none';
        uploadResult.style.display = 'block';
        uploadResult.innerHTML = `
            <div class="alert alert-error">
                <h3>❌ Error de conexión</h3>
                <p>No se pudo procesar el archivo. Intenta nuevamente.</p>
            </div>
        `;
    }
}

// Soporte para drag & drop
const uploadZone = document.getElementById('uploadZone');
if (uploadZone) {
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('drag-over');
    });
    
    uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('drag-over');
    });
    
    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('drag-over');
        
        const file = e.dataTransfer.files[0];
        if (file) {
            document.getElementById('excelFile').files = e.dataTransfer.files;
            handleFileSelect({ target: { files: [file] } });
        }
    });
}

