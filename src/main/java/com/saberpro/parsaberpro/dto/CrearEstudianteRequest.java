package com.saberpro.parsaberpro.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CrearEstudianteRequest {
    
    @NotBlank(message = "El tipo de documento es obligatorio")
    private String tipoDocumento;
    
    @NotBlank(message = "El número de documento es obligatorio")
    private String numeroDocumento;
    
    @NotBlank(message = "El primer nombre es obligatorio")
    private String primerNombre;
    
    private String segundoNombre; // Opcional
    
    @NotBlank(message = "El primer apellido es obligatorio")
    private String primerApellido;
    
    private String segundoApellido; // Opcional
    
    @Email(message = "Email inválido")
    @NotBlank(message = "El correo electrónico es obligatorio")
    private String correoElectronico;
    
    private String numeroTelefonico; // Opcional
    
    @NotBlank(message = "El número de registro es obligatorio")
    private String numeroRegistro;
    
    @NotBlank(message = "El programa es obligatorio")
    private String programa;
}
