package com.saberpro.parsaberpro.controller;

import com.saberpro.parsaberpro.model.Estudiante;
import com.saberpro.parsaberpro.repository.EstudianteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/estudiantes")
public class EstudianteController {
    
    @Autowired
    private EstudianteRepository estudianteRepository;
    
    // Endpoint para verificar la conexión
    @GetMapping("/test")
    public ResponseEntity<String> testConnection() {
        try {
            long count = estudianteRepository.count();
            return ResponseEntity.ok("✅ Conexión exitosa! Total de estudiantes: " + count);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("❌ Error de conexión: " + e.getMessage());
        }
    }
    
    // Obtener todos los estudiantes
    @GetMapping
    public ResponseEntity<List<Estudiante>> getAllEstudiantes() {
        return ResponseEntity.ok(estudianteRepository.findAll());
    }
    
    // Crear un estudiante
    @PostMapping
    public ResponseEntity<Estudiante> createEstudiante(@RequestBody Estudiante estudiante) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(estudianteRepository.save(estudiante));
    }
    
    // Obtener estudiante por ID
    @GetMapping("/{id}")
    public ResponseEntity<Estudiante> getEstudianteById(@PathVariable String id) {
        return estudianteRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Actualizar estudiante
    @PutMapping("/{id}")
    public ResponseEntity<Estudiante> updateEstudiante(
            @PathVariable String id, 
            @RequestBody Estudiante estudiante) {
        return estudianteRepository.findById(id)
                .map(est -> {
                    estudiante.setId(id);
                    return ResponseEntity.ok(estudianteRepository.save(estudiante));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Eliminar estudiante
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEstudiante(@PathVariable String id) {
        if (estudianteRepository.existsById(id)) {
            estudianteRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
