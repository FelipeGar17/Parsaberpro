package com.saberpro.parsaberpro.controller;

import com.saberpro.parsaberpro.dto.CrearEstudianteRequest;
import com.saberpro.parsaberpro.dto.LoginRequest;
import com.saberpro.parsaberpro.dto.LoginResponse;
import com.saberpro.parsaberpro.model.Usuario;
import com.saberpro.parsaberpro.repository.UsuarioRepository;
import com.saberpro.parsaberpro.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    /**
     * Login - Para coordinador y estudiantes
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        
        if (response.isExito()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Crear coordinador - Solo para inicializar el sistema
     * En producción, esto debería estar protegido o ser un script
     */
    @PostMapping("/crear-coordinador")
    public ResponseEntity<Usuario> crearCoordinador(
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam String nombre,
            @RequestParam String apellido) {
        try {
            Usuario coordinador = authService.crearCoordinador(email, password, nombre, apellido);
            return ResponseEntity.ok(coordinador);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Crear estudiante - Solo puede hacerlo el coordinador
     */
    @PostMapping("/crear-estudiante")
    public ResponseEntity<LoginResponse> crearEstudiante(@Valid @RequestBody CrearEstudianteRequest request) {
        LoginResponse response = authService.crearEstudiante(request);
        
        if (response.isExito()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Obtener todos los usuarios (para dashboard del coordinador)
     */
    @GetMapping("/estudiantes")
    public ResponseEntity<List<Usuario>> getAllUsuarios() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        return ResponseEntity.ok(usuarios);
    }
    
    /**
     * Obtener un estudiante por ID
     */
    @GetMapping("/estudiantes/{id}")
    public ResponseEntity<Usuario> getEstudianteById(@PathVariable String id) {
        return usuarioRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Actualizar estudiante
     */
    @PutMapping("/estudiantes/{id}")
    public ResponseEntity<LoginResponse> actualizarEstudiante(
            @PathVariable String id,
            @Valid @RequestBody CrearEstudianteRequest request) {
        LoginResponse response = authService.actualizarEstudiante(id, request);
        
        if (response.isExito()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Eliminar estudiante
     */
    @DeleteMapping("/estudiantes/{id}")
    public ResponseEntity<LoginResponse> eliminarEstudiante(@PathVariable String id) {
        LoginResponse response = authService.eliminarEstudiante(id);
        
        if (response.isExito()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
}
