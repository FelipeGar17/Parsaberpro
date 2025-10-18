# Etapa 1: Construcción
FROM maven:3.9.5-eclipse-temurin-21 AS build
WORKDIR /app

# Copiar archivos de configuración de Maven
COPY pom.xml .
COPY mvnw .
COPY mvnw.cmd .
COPY .mvn .mvn

# Descargar dependencias
RUN mvn dependency:go-offline -B

# Copiar código fuente
COPY src ./src

# Compilar aplicación (sin ejecutar tests)
RUN mvn clean package -DskipTests

# Etapa 2: Ejecución
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copiar el JAR desde la etapa de construcción
COPY --from=build /app/target/parsaberpro-*.jar app.jar

# Exponer puerto (Render asigna dinámicamente)
EXPOSE 8080

# Variables de entorno por defecto
ENV JAVA_OPTS="-Xmx512m -Xms256m"

# Comando de inicio
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
