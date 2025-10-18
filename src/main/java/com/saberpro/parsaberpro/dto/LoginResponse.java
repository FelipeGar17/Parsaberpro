package com.saberpro.parsaberpro.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LoginResponse {
    
    private String id;
    private String email;
    private String nombre;
    private String apellido;
    private String documento;
    private String correoElectronico;
    private String numeroTelefonico;
    private String numeroRegistro;
    private String programa;
    private String rol;
    private String mensaje;
    private boolean exito;
}
