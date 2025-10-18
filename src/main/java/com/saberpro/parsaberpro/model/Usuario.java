package com.saberpro.parsaberpro.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "usuarios")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Usuario {
    
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String email;
    
    private String password;
    
    private String rol; // "COORDINADOR" o "ESTUDIANTE"
    
    // Estado
    private boolean activo = true;
    
    // Indicador de si tiene puntajes registrados
    private boolean tienePuntajes = false;
    
    // Datos personales completos
    private String tipoDocumento;      // CC, TI, CE, PA, etc.
    private String numeroDocumento;
    private String primerNombre;
    private String segundoNombre;
    private String primerApellido;
    private String segundoApellido;
    private String correoElectronico;  // Mismo que email
    private String numeroTelefonico;
    private String numeroRegistro;     // Número de registro único
    private String programa;
    
    // Campos legacy (para compatibilidad)
    private String nombre;             // Se puede combinar primerNombre + segundoNombre
    private String apellido;           // Se puede combinar primerApellido + segundoApellido
    private String documento;          // Mismo que numeroDocumento
}
