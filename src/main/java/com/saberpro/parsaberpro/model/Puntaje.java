package com.saberpro.parsaberpro.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * Modelo de Puntajes del Saber PRO
 * Almacena los resultados de cada estudiante en las diferentes competencias
 */
@Data
@Document(collection = "puntajes")
public class Puntaje {
    
    @Id
    private String id;
    
    // Relación con el estudiante
    private String estudianteId;
    private String numeroRegistro;
    
    // Puntaje global
    private Integer puntajeGlobal;
    private String nivelGlobal; // Bajo, Medio, Alto, Superior
    
    // Comunicación Escrita
    private Integer comunicacionEscrita;
    private String comunicacionEscritaNivel;
    
    // Razonamiento Cuantitativo
    private Integer razonamientoCuantitativo;
    private String razonamientoCuantitativoNivel;
    
    // Lectura Crítica
    private Integer lecturaCritica;
    private String lecturaCriticaNivel;
    
    // Competencias Ciudadanas
    private Integer competenciasCiudadanas;
    private String competenciasCiudadanasNivel;
    
    // Inglés
    private Integer ingles;
    private String inglesNivel;
    
    // Metadatos
    private LocalDateTime fechaRegistro;
    private LocalDateTime fechaActualizacion;
    private String registradoPor; // ID del coordinador que registró
    
    // Estado
    private boolean activo = true;
    private boolean anulado = false; // Si está anulado, no tiene puntajes válidos
    
    /**
     * Método helper para calcular el nivel según el puntaje
     * Rangos oficiales del Saber PRO (5 niveles):
     * - Nivel 1: 0-125
     * - Nivel 2: 126-155
     * - Nivel 3: 156-190
     * - Nivel 4: 191-245
     * - Nivel 5: 246-300
     */
    public static String calcularNivel(Integer puntaje) {
        if (puntaje == null) return "Sin datos";
        if (puntaje <= 125) return "1";
        if (puntaje <= 155) return "2";
        if (puntaje <= 190) return "3";
        if (puntaje <= 245) return "4";
        return "5";
    }
}
