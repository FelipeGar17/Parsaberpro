# 🚀 GUÍA DE DESPLIEGUE EN RENDER.COM

Esta guía te ayudará a desplegar **PARSABERPRO** en Render.com paso a paso.

---

## ✅ **Prerrequisitos**

1. ✅ Cuenta en [Render.com](https://render.com) (gratis)
2. ✅ Cuenta en GitHub/GitLab (para subir el código)
3. ✅ MongoDB Atlas configurado y accesible
4. ✅ Código fuente del proyecto

---

## 📋 **PASO 1: Preparar el Proyecto**

### 1.1 Verificar archivo `application.properties`

Asegúrate de que esté configurado para producción:

```properties
# MongoDB Atlas
spring.data.mongodb.uri=${MONGODB_URI:mongodb+srv://usuario:password@cluster0.msnxvio.mongodb.net/parsaberpro_db}

# Puerto (Render lo asigna automáticamente)
server.port=${PORT:8080}

# Nombre de la aplicación
spring.application.name=parsaberpro

# DevTools deshabilitado en producción
spring.devtools.restart.enabled=false
```

### 1.2 Crear archivo `system.properties` (Opcional)

En la raíz del proyecto, crea este archivo para especificar la versión de Java:

```properties
java.runtime.version=21
```

---

## 📤 **PASO 2: Subir el Proyecto a GitHub**

### 2.1 Inicializar Git (si no lo has hecho):

```bash
git init
git add .
git commit -m "Initial commit - PARSABERPRO"
```

### 2.2 Crear repositorio en GitHub:

1. Ve a [github.com](https://github.com)
2. Click en "New repository"
3. Nombre: `parsaberpro`
4. Visibilidad: Público o Privado
5. Click "Create repository"

### 2.3 Conectar y subir:

```bash
git remote add origin https://github.com/TU_USUARIO/parsaberpro.git
git branch -M main
git push -u origin main
```

---

## 🌐 **PASO 3: Crear Web Service en Render**

### 3.1 Acceder a Render:

1. Ve a [dashboard.render.com](https://dashboard.render.com)
2. Click en "New +" → "Web Service"

### 3.2 Conectar repositorio:

1. Click en "Connect account" para GitHub
2. Selecciona tu repositorio `parsaberpro`
3. Click "Connect"

### 3.3 Configurar el servicio:

#### **Información básica:**
- **Name:** `parsaberpro` (o el nombre que prefieras)
- **Region:** Oregon (US West) o la más cercana a Colombia
- **Branch:** `main`
- **Root Directory:** (dejar vacío)

#### **Build & Deploy:**
- **Runtime:** `Java`
- **Build Command:**
  ```bash
  ./mvnw clean package -DskipTests
  ```
- **Start Command:**
  ```bash
  java -jar target/parsaberpro-1.jar
  ```

#### **Plan:**
- Selecciona **Free** (gratis, pero con limitaciones)
- O **Starter** ($7/mes, más estable)

---

## 🔐 **PASO 4: Configurar Variables de Entorno**

En la sección "Environment Variables", agrega:

### 4.1 MongoDB URI:

```
MONGODB_URI = mongodb+srv://TU_USUARIO:TU_PASSWORD@cluster0.msnxvio.mongodb.net/parsaberpro_db?retryWrites=true&w=majority
```

**⚠️ IMPORTANTE:** Reemplaza `TU_USUARIO` y `TU_PASSWORD` con tus credenciales reales de MongoDB Atlas.

### 4.2 Puerto (Opcional):

Render asigna el puerto automáticamente, pero puedes definirlo:

```
PORT = 8080
```

---

## 🔒 **PASO 5: Configurar MongoDB Atlas**

### 5.1 Permitir acceso desde Render:

1. Ve a [MongoDB Atlas](https://cloud.mongodb.com)
2. En tu cluster, click en "Network Access"
3. Click "Add IP Address"
4. Selecciona **"Allow Access from Anywhere"** (0.0.0.0/0)
5. Click "Confirm"

**⚠️ Nota:** En producción, deberías usar la IP específica de Render, pero para desarrollo esto es suficiente.

---

## 🚀 **PASO 6: Desplegar**

1. Click en **"Create Web Service"**
2. Render comenzará a:
   - ✅ Clonar el repositorio
   - ✅ Detectar Java y Maven
   - ✅ Ejecutar el build command
   - ✅ Iniciar la aplicación

3. **Espera 5-10 minutos** mientras se despliega

4. Una vez completado, verás el estado **"Live"** en verde

---

## 🌍 **PASO 7: Acceder a tu Aplicación**

Tu URL será algo como:

```
https://parsaberpro.onrender.com
```

O el nombre que hayas elegido:

```
https://TU-NOMBRE.onrender.com
```

---

## 🧪 **PASO 8: Probar la Aplicación**

1. **Login como coordinador:**
   - Email: `coordinador@saberpro.edu.co`
   - Password: `admin123`

2. **Verificar funcionalidades:**
   - ✅ Dashboard carga correctamente
   - ✅ Listar estudiantes
   - ✅ Crear estudiante
   - ✅ Carga masiva Excel
   - ✅ Gestión de puntajes
   - ✅ Generación de reportes

3. **Login como estudiante:**
   - Email: Correo de estudiante cargado
   - Password: Número de documento

---

## ⚙️ **Configuraciones Adicionales en Render**

### Reinicio automático:

Render reinicia automáticamente si la app crashea.

### Logs en tiempo real:

1. En el dashboard de Render
2. Click en tu servicio
3. Ve a la pestaña "Logs"
4. Verás todos los logs en tiempo real

### Variables de entorno:

Puedes agregar/editar en "Environment" → "Environment Variables"

### Dominio personalizado (Opcional):

1. Ve a "Settings" → "Custom Domains"
2. Agrega tu dominio
3. Configura DNS según instrucciones

---

## 🐛 **Solución de Problemas**

### Error: "Build failed"

**Causa:** Error en la compilación de Maven

**Solución:**
1. Verifica que el Build Command sea correcto
2. Revisa los logs de build
3. Asegúrate de que `pom.xml` esté en la raíz

### Error: "Application failed to start"

**Causa:** Error en la conexión a MongoDB o en el inicio de Spring Boot

**Solución:**
1. Verifica la variable `MONGODB_URI`
2. Verifica que MongoDB Atlas permita acceso desde 0.0.0.0/0
3. Revisa los logs en Render

### Error: "Connection timeout"

**Causa:** MongoDB no es accesible

**Solución:**
1. Ve a MongoDB Atlas → Network Access
2. Agrega 0.0.0.0/0 en la whitelist
3. Verifica que el cluster esté activo

### La app funciona pero es lenta:

**Causa:** Plan Free de Render tiene limitaciones

**Solución:**
- El plan Free "duerme" después de 15 minutos de inactividad
- Considera upgrade a plan Starter ($7/mes)
- Primera carga puede tardar 30-60 segundos

---

## 💰 **Planes de Render**

### **Free (Gratis):**
- ✅ 750 horas/mes
- ⚠️ Se "duerme" después de 15 min sin uso
- ⚠️ Arranque lento después de dormir
- ✅ Perfecto para demos y proyectos académicos

### **Starter ($7/mes):**
- ✅ Siempre activo (no se duerme)
- ✅ Arranque rápido
- ✅ Mejor para producción

---

## 📊 **Monitoreo**

### Ver métricas:

1. Dashboard de Render → Tu servicio
2. Pestaña "Metrics"
3. Verás:
   - CPU usage
   - Memory usage
   - Request count
   - Response times

### Health checks:

Render hace health checks automáticos en `/` cada 60 segundos.

---

## 🔄 **Actualizar la Aplicación**

### Método automático (recomendado):

1. Haz cambios en tu código local
2. Commit y push a GitHub:
   ```bash
   git add .
   git commit -m "Actualización: descripción"
   git push origin main
   ```
3. Render detectará el push y **desplegará automáticamente**

### Método manual:

1. En Render dashboard → Tu servicio
2. Click "Manual Deploy" → "Deploy latest commit"

---

## ✅ **Checklist Final**

Antes de considerar el despliegue completo, verifica:

- [ ] ✅ Código subido a GitHub
- [ ] ✅ Web Service creado en Render
- [ ] ✅ Build Command configurado
- [ ] ✅ Start Command configurado
- [ ] ✅ Variable MONGODB_URI configurada
- [ ] ✅ MongoDB Atlas permite acceso desde 0.0.0.0/0
- [ ] ✅ Aplicación desplegada y en estado "Live"
- [ ] ✅ URL funcional y accesible
- [ ] ✅ Login de coordinador funciona
- [ ] ✅ Todas las funcionalidades probadas

---

## 📧 **Recursos Adicionales**

- **Documentación Render:** https://render.com/docs
- **MongoDB Atlas Docs:** https://docs.atlas.mongodb.com
- **Spring Boot on Render:** https://render.com/docs/deploy-spring-boot

---

## 🎉 **¡Listo!**

Tu aplicación **PARSABERPRO** ahora está desplegada en Render y accesible desde cualquier parte del mundo. 🌍

**URL de ejemplo:** `https://parsaberpro.onrender.com`

---

**¿Problemas?** Revisa los logs en Render o verifica la conexión con MongoDB Atlas.
