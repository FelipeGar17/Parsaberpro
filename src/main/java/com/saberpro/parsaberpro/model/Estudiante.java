package com.saberpro.parsaberpro.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "estudiantes")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Estudiante {
    
    @Id
    private String id;
    
    private String nombre;
    private String apellido;
    private String email;
    private int edad;
}
