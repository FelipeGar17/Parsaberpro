package com.saberpro.parsaberpro.controller;

import com.saberpro.parsaberpro.dto.LoginResponse;
import com.saberpro.parsaberpro.dto.RegistrarPuntajeRequest;
import com.saberpro.parsaberpro.model.Puntaje;
import com.saberpro.parsaberpro.service.PuntajeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/puntajes")
@CrossOrigin(origins = "*")
public class PuntajeController {
    
    @Autowired
    private PuntajeService puntajeService;
    
    /**
     * Registrar o actualizar puntajes de un estudiante
     */
    @PostMapping("/registrar")
    public ResponseEntity<LoginResponse> registrarPuntaje(
            @Valid @RequestBody RegistrarPuntajeRequest request,
            @RequestHeader(value = "Coordinador-Id", required = false, defaultValue = "SYSTEM") String coordinadorId) {
        
        LoginResponse response = puntajeService.registrarPuntaje(request, coordinadorId);
        
        if (response.isExito()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Listar todos los puntajes
     */
    @GetMapping
    public ResponseEntity<List<Puntaje>> listarPuntajes() {
        List<Puntaje> puntajes = puntajeService.listarPuntajes();
        return ResponseEntity.ok(puntajes);
    }
    
    /**
     * Obtener puntaje de un estudiante
     */
    @GetMapping("/estudiante/{estudianteId}")
    public ResponseEntity<Puntaje> obtenerPuntajePorEstudiante(@PathVariable String estudianteId) {
        return puntajeService.obtenerPuntajePorEstudiante(estudianteId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Obtener puntaje por número de registro
     */
    @GetMapping("/registro/{numeroRegistro}")
    public ResponseEntity<Puntaje> obtenerPuntajePorRegistro(@PathVariable String numeroRegistro) {
        return puntajeService.obtenerPuntajePorNumeroRegistro(numeroRegistro)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Eliminar puntaje
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<LoginResponse> eliminarPuntaje(@PathVariable String id) {
        LoginResponse response = puntajeService.eliminarPuntaje(id);
        
        if (response.isExito()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
}
