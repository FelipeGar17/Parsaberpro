package com.saberpro.parsaberpro.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegistrarPuntajeRequest {
    
    @NotBlank(message = "El número de registro es requerido")
    private String numeroRegistro;
    
    // Estado de anulación
    private Boolean anulado = false;
    
    // Puntaje global (0-300 aprox)
    @Min(value = 0, message = "El puntaje global debe ser mayor o igual a 0")
    @Max(value = 300, message = "El puntaje global no puede exceder 300")
    private Integer puntajeGlobal;
    
    // Comunicación Escrita
    @Min(value = 0, message = "El puntaje debe ser mayor o igual a 0")
    @Max(value = 300, message = "El puntaje no puede exceder 300")
    private Integer comunicacionEscrita;
    
    // Razonamiento Cuantitativo
    @Min(value = 0, message = "El puntaje debe ser mayor o igual a 0")
    @Max(value = 300, message = "El puntaje no puede exceder 300")
    private Integer razonamientoCuantitativo;
    
    // Lectura Crítica
    @Min(value = 0, message = "El puntaje debe ser mayor o igual a 0")
    @Max(value = 300, message = "El puntaje no puede exceder 300")
    private Integer lecturaCritica;
    
    // Competencias Ciudadanas
    @Min(value = 0, message = "El puntaje debe ser mayor o igual a 0")
    @Max(value = 300, message = "El puntaje no puede exceder 300")
    private Integer competenciasCiudadanas;
    
    // Inglés
    @Min(value = 0, message = "El puntaje debe ser mayor o igual a 0")
    @Max(value = 300, message = "El puntaje no puede exceder 300")
    private Integer ingles;
}
