# 🎓 PARSABERPRO - Sistema de Gestión de Resultados Saber PRO

Sistema web para la gestión y consulta de resultados de las pruebas Saber PRO del ITFIP, desarrollado con Spring Boot 3.5.6 y MongoDB Atlas.

---

## 📋 **Información del Proyecto**

- **Nombre:** PARSABERPRO
- **Versión:** 1.0
- **Autor:** Felipe Pabón González
- **Fecha:** Octubre 2025
- **Universidad:** ITFIP (Instituto Tolimense de Formación Profesional)

---

## 🎯 **Objetivos Cumplidos**

✅ **Levantar requerimientos funcionales y no funcionales** (Ver `REQUERIMIENTOS.txt`)
✅ **Diseñar historias de usuarios y plan de trabajo** (Sprint 1 y Sprint 2 documentados)
✅ **Desarrollar sistema web con MongoDB Atlas**
✅ **Entregar ejecutable y código fuente** (`target/parsaberpro-1.jar`)
✅ **Desplegar en Render.com**

---

## 🚀 **Características Principales**

### **Módulo Coordinador:**
- ✅ Dashboard con estadísticas generales
- ✅ Gestión completa de estudiantes (CRUD)
- ✅ **Carga masiva desde Excel** (36 estudiantes en segundos)
- ✅ Gestión de puntajes Saber PRO (5 competencias)
- ✅ Sistema de beneficios según Acuerdo No. 01-009
- ✅ Generación de reportes en Excel con filtros
- ✅ Visualización por programas académicos

### **Módulo Estudiante:**
- ✅ Dashboard personalizado con información del usuario
- ✅ Visualización de puntaje global y por competencias
- ✅ Cálculo automático de beneficios
- ✅ Información detallada sobre Saber PRO
- ✅ Niveles de desempeño (1-4) por competencia

---

## 🛠️ **Tecnologías Utilizadas**

### **Backend:**
- Java 21 (LTS)
- Spring Boot 3.5.6
- Spring Data MongoDB
- Spring Boot DevTools
- Lombok
- BCrypt (Seguridad)
- Apache POI 5.2.5 (Manejo de Excel)

### **Base de Datos:**
- MongoDB Atlas (Cloud)
- Cluster: cluster0.msnxvio.mongodb.net
- Base de datos: parsaberpro_db

### **Frontend:**
- HTML5
- CSS3 (Variables CSS, Gradientes)
- JavaScript (Vanilla)
- Diseño responsive
- Tema profesional gris

### **Herramientas:**
- Maven (Gestión de dependencias)
- Git (Control de versiones)
- VS Code (Desarrollo)

---

## 📦 **Instalación y Ejecución Local**

### **Prerrequisitos:**
- Java 21 o superior
- Maven 3.6+
- MongoDB Atlas (conexión configurada)

### **Pasos:**

1. **Clonar el repositorio:**
   ```bash
   git clone <tu-repositorio>
   cd parsaberpro
   ```

2. **Configurar MongoDB Atlas:**
   Editar `src/main/resources/application.properties`:
   ```properties
   spring.data.mongodb.uri=mongodb+srv://usuario:password@cluster0.msnxvio.mongodb.net/parsaberpro_db
   ```

3. **Compilar el proyecto:**
   ```bash
   ./mvnw clean package -DskipTests
   ```

4. **Ejecutar la aplicación:**
   ```bash
   java -jar target/parsaberpro-1.jar
   ```

5. **Acceder a la aplicación:**
   ```
   http://localhost:8080
   ```

---

## 🔐 **Usuarios de Prueba**

### **Coordinador:**
- **Email:** coordinador@saberpro.edu.co
- **Contraseña:** admin123

### **Estudiantes:**
- **Email:** Usar correo del estudiante
- **Contraseña:** Número de documento

---

## 📊 **Estructura del Proyecto**

```
parsaberpro/
├── src/
│   ├── main/
│   │   ├── java/com/saberpro/parsaberpro/
│   │   │   ├── controller/          # Controladores REST
│   │   │   ├── model/               # Modelos de datos
│   │   │   ├── repository/          # Repositorios MongoDB
│   │   │   ├── service/             # Lógica de negocio
│   │   │   └── ParsaberproApplication.java
│   │   └── resources/
│   │       ├── static/              # Archivos estáticos (HTML, CSS, JS)
│   │       │   ├── css/
│   │       │   ├── js/
│   │       │   ├── estudiante/      # Módulo estudiante
│   │       │   └── forms/           # Formularios
│   │       └── application.properties
│   └── test/                        # Tests unitarios
├── target/
│   └── parsaberpro-1.jar           # ⭐ EJECUTABLE
├── pom.xml                          # Configuración Maven
├── REQUERIMIENTOS.txt               # Requerimientos funcionales y no funcionales
├── PLANTILLA_ESTUDIANTES.txt       # Plantilla para carga masiva
└── README.md                        # Este archivo
```

---

## 🎓 **Competencias Evaluadas (Saber PRO)**

1. **Lectura Crítica**
2. **Razonamiento Cuantitativo**
3. **Competencias Ciudadanas**
4. **Comunicación Escrita**
5. **Inglés**

### **Niveles de Desempeño:**
- **Nivel 1:** 0-30 puntos
- **Nivel 2:** 31-70 puntos
- **Nivel 3:** 71-100 puntos
- **Nivel 4:** > 100 puntos

---

## 🏆 **Sistema de Beneficios (Acuerdo No. 01-009)**

### **Rango 1:** 180-210 puntos
- Apoyo económico para matrícula en posgrado

### **Rango 2:** 211-240 puntos
- Prioridad en convocatorias de empleo ITFIP
- Apoyo para programas de formación

### **Rango 3:** 241+ puntos (Mejores puntajes)
- Condonación de deuda ICETEX (hasta 25% del capital)
- Participación en "Noche de los Mejores"
- Reconocimiento público

---

## 📱 **Funcionalidades Destacadas**

### **Carga Masiva de Estudiantes:**
1. Descargar plantilla Excel desde la interfaz
2. Completar datos de hasta 1000+ estudiantes
3. Validación automática de datos
4. Reporte detallado de éxitos y errores
5. Contraseñas encriptadas automáticamente

### **Reportes Excel:**
- Filtrado por programa académico
- Filtrado por rango de beneficios
- Filtrado por puntaje mínimo
- Descarga con nombre descriptivo y fecha

---

## 🔒 **Seguridad**

- ✅ Contraseñas encriptadas con BCrypt (factor 10)
- ✅ Validación de sesiones
- ✅ Roles de usuario (COORDINADOR/ESTUDIANTE)
- ✅ Validación de datos en backend
- ✅ Índices únicos en MongoDB (email, documento)

---

## 🌐 **Despliegue en Render**

### **Configuración:**

1. **Build Command:**
   ```bash
   ./mvnw clean package -DskipTests
   ```

2. **Start Command:**
   ```bash
   java -jar target/parsaberpro-1.jar
   ```

3. **Variables de Entorno:**
   ```env
   MONGODB_URI=mongodb+srv://usuario:password@cluster0.msnxvio.mongodb.net/parsaberpro_db
   PORT=8080
   ```

4. **Puerto:** 8080 (HTTP)

---

## 📝 **Requerimientos del Sistema**

### **Funcionales:** (20 requerimientos)
- RF-01 a RF-20 documentados en `REQUERIMIENTOS.txt`

### **No Funcionales:** (20 requerimientos)
- RNF-01 a RNF-20 documentados en `REQUERIMIENTOS.txt`

---

## 🐛 **Solución de Problemas**

### **Error de conexión a MongoDB:**
- Verificar credenciales en `application.properties`
- Verificar IP en MongoDB Atlas Whitelist (0.0.0.0/0)

### **Puerto 8080 ocupado:**
```bash
# Windows
netstat -ano | findstr :8080
taskkill /F /PID <PID>
```

### **Error al cargar Excel:**
- Verificar formato .xlsx
- Verificar estructura de columnas
- Revisar logs en consola

---

## 📚 **Documentación Adicional**

- **Historias de Usuario:** Sprint 1 y Sprint 2
- **Acuerdo de Beneficios:** Acuerdo No. 01-009 de 2019
- **Guía de Carga Masiva:** `PLANTILLA_ESTUDIANTES.txt`

---

## 🤝 **Contribuciones**

Este proyecto fue desarrollado como proyecto académico para el curso de Spring Boot en ITFIP.

---

## 📄 **Licencia**

Proyecto académico - ITFIP 2025

---

## 📧 **Contacto**

- **Desarrollador:** Felipe Pabón González
- **Institución:** ITFIP
- **Año:** 2025

---

## ✨ **Agradecimientos**

- ITFIP por el apoyo académico
- MongoDB Atlas por el servicio cloud
- Apache POI por el manejo de Excel
- Spring Boot Framework

---

**¡Sistema 100% funcional y listo para producción!** 🚀
