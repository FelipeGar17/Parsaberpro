package com.saberpro.parsaberpro.service;

import com.saberpro.parsaberpro.dto.CrearEstudianteRequest;
import com.saberpro.parsaberpro.dto.LoginRequest;
import com.saberpro.parsaberpro.dto.LoginResponse;
import com.saberpro.parsaberpro.model.Puntaje;
import com.saberpro.parsaberpro.model.Usuario;
import com.saberpro.parsaberpro.repository.PuntajeRepository;
import com.saberpro.parsaberpro.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private PuntajeRepository puntajeRepository;
    
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    /**
     * Login para coordinador o estudiante
     */
    public LoginResponse login(LoginRequest request) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(request.getEmail());
        
        if (usuarioOpt.isEmpty()) {
            return LoginResponse.builder()
                    .exito(false)
                    .mensaje("Usuario no encontrado")
                    .build();
        }
        
        Usuario usuario = usuarioOpt.get();
        
        if (!usuario.isActivo()) {
            return LoginResponse.builder()
                    .exito(false)
                    .mensaje("Usuario inactivo")
                    .build();
        }
        
        // Verificar contraseña
        if (!passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
            return LoginResponse.builder()
                    .exito(false)
                    .mensaje("Contraseña incorrecta")
                    .build();
        }
        
        // Login exitoso
        return LoginResponse.builder()
                .exito(true)
                .mensaje("Login exitoso")
                .id(usuario.getId())
                .email(usuario.getEmail())
                .nombre(usuario.getNombre())
                .apellido(usuario.getApellido())
                .documento(usuario.getDocumento())
                .correoElectronico(usuario.getCorreoElectronico())
                .numeroTelefonico(usuario.getNumeroTelefonico())
                .numeroRegistro(usuario.getNumeroRegistro())
                .programa(usuario.getPrograma())
                .rol(usuario.getRol())
                .build();
    }
    
    /**
     * Crear coordinador (solo se hace una vez manualmente)
     */
    public Usuario crearCoordinador(String email, String password, String nombre, String apellido) {
        if (usuarioRepository.existsByEmail(email)) {
            throw new RuntimeException("El email ya está registrado");
        }
        
        Usuario coordinador = new Usuario();
        coordinador.setEmail(email);
        coordinador.setPassword(passwordEncoder.encode(password));
        coordinador.setNombre(nombre);
        coordinador.setApellido(apellido);
        coordinador.setRol("COORDINADOR");
        coordinador.setActivo(true);
        
        return usuarioRepository.save(coordinador);
    }
    
    /**
     * Crear estudiante (lo hace el coordinador)
     */
    public LoginResponse crearEstudiante(CrearEstudianteRequest request) {
        // Validar que no exista el email
        if (usuarioRepository.existsByEmail(request.getCorreoElectronico())) {
            return LoginResponse.builder()
                    .exito(false)
                    .mensaje("El correo electrónico ya está registrado")
                    .build();
        }
        
        // Validar que no exista el documento
        Optional<Usuario> usuarioExistente = usuarioRepository.findByDocumento(request.getNumeroDocumento());
        if (usuarioExistente.isPresent()) {
            return LoginResponse.builder()
                    .exito(false)
                    .mensaje("El número de documento ya está registrado")
                    .build();
        }
        
        // Validar que el número de registro no esté duplicado
        Optional<Usuario> usuarioConRegistro = usuarioRepository.findAll().stream()
                .filter(u -> request.getNumeroRegistro().equals(u.getNumeroRegistro()))
                .findFirst();
        
        if (usuarioConRegistro.isPresent()) {
            return LoginResponse.builder()
                    .exito(false)
                    .mensaje("El número de registro ya está en uso")
                    .build();
        }
        
        // Crear estudiante con documento como contraseña
        Usuario estudiante = new Usuario();
        
        // Nuevos campos
        estudiante.setTipoDocumento(request.getTipoDocumento());
        estudiante.setNumeroDocumento(request.getNumeroDocumento());
        estudiante.setPrimerNombre(request.getPrimerNombre());
        estudiante.setSegundoNombre(request.getSegundoNombre());
        estudiante.setPrimerApellido(request.getPrimerApellido());
        estudiante.setSegundoApellido(request.getSegundoApellido());
        estudiante.setCorreoElectronico(request.getCorreoElectronico());
        estudiante.setNumeroTelefonico(request.getNumeroTelefonico());
        estudiante.setNumeroRegistro(request.getNumeroRegistro()); // Ahora viene del request
        estudiante.setPrograma(request.getPrograma());
        
        // Campos principales
        estudiante.setEmail(request.getCorreoElectronico());
        estudiante.setPassword(passwordEncoder.encode(request.getNumeroDocumento())); // Contraseña = documento
        estudiante.setRol("ESTUDIANTE");
        estudiante.setActivo(true);
        
        // Campos legacy (compatibilidad)
        estudiante.setNombre(request.getPrimerNombre() + (request.getSegundoNombre() != null ? " " + request.getSegundoNombre() : ""));
        estudiante.setApellido(request.getPrimerApellido() + (request.getSegundoApellido() != null ? " " + request.getSegundoApellido() : ""));
        estudiante.setDocumento(request.getNumeroDocumento());
        
        Usuario guardado = usuarioRepository.save(estudiante);
        
        return LoginResponse.builder()
                .exito(true)
                .mensaje("Estudiante creado exitosamente")
                .id(guardado.getId())
                .email(guardado.getEmail())
                .nombre(guardado.getNombre())
                .apellido(guardado.getApellido())
                .documento(guardado.getDocumento())
                .programa(guardado.getPrograma())
                .rol(guardado.getRol())
                .build();
    }
    
    /**
     * Actualizar estudiante
     */
    public LoginResponse actualizarEstudiante(String id, CrearEstudianteRequest request) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);
        
        if (usuarioOpt.isEmpty()) {
            return LoginResponse.builder()
                    .exito(false)
                    .mensaje("Estudiante no encontrado")
                    .build();
        }
        
        Usuario estudiante = usuarioOpt.get();
        
        // Validar que no sea coordinador
        if ("COORDINADOR".equals(estudiante.getRol())) {
            return LoginResponse.builder()
                    .exito(false)
                    .mensaje("No se puede editar un coordinador como estudiante")
                    .build();
        }
        
        // Validar que el email no esté usado por otro usuario
        Optional<Usuario> usuarioConEmail = usuarioRepository.findByEmail(request.getCorreoElectronico());
        if (usuarioConEmail.isPresent() && !usuarioConEmail.get().getId().equals(id)) {
            return LoginResponse.builder()
                    .exito(false)
                    .mensaje("El correo electrónico ya está registrado por otro usuario")
                    .build();
        }
        
        // Validar que el documento no esté usado por otro usuario
        Optional<Usuario> usuarioConDocumento = usuarioRepository.findByDocumento(request.getNumeroDocumento());
        if (usuarioConDocumento.isPresent() && !usuarioConDocumento.get().getId().equals(id)) {
            return LoginResponse.builder()
                    .exito(false)
                    .mensaje("El número de documento ya está registrado por otro usuario")
                    .build();
        }
        
        // Validar que el número de registro no esté usado por otro usuario
        Optional<Usuario> usuarioConRegistro = usuarioRepository.findAll().stream()
                .filter(u -> request.getNumeroRegistro().equals(u.getNumeroRegistro()) && !u.getId().equals(id))
                .findFirst();
        
        if (usuarioConRegistro.isPresent()) {
            return LoginResponse.builder()
                    .exito(false)
                    .mensaje("El número de registro ya está en uso por otro usuario")
                    .build();
        }
        
        // Actualizar campos
        estudiante.setTipoDocumento(request.getTipoDocumento());
        estudiante.setNumeroDocumento(request.getNumeroDocumento());
        estudiante.setPrimerNombre(request.getPrimerNombre());
        estudiante.setSegundoNombre(request.getSegundoNombre());
        estudiante.setPrimerApellido(request.getPrimerApellido());
        estudiante.setSegundoApellido(request.getSegundoApellido());
        estudiante.setCorreoElectronico(request.getCorreoElectronico());
        estudiante.setNumeroTelefonico(request.getNumeroTelefonico());
        estudiante.setNumeroRegistro(request.getNumeroRegistro()); // Ahora se puede actualizar
        estudiante.setPrograma(request.getPrograma());
        
        // Actualizar campos principales
        estudiante.setEmail(request.getCorreoElectronico());
        
        // Actualizar contraseña si cambió el documento
        if (!estudiante.getDocumento().equals(request.getNumeroDocumento())) {
            estudiante.setPassword(passwordEncoder.encode(request.getNumeroDocumento()));
        }
        
        // Actualizar campos legacy
        estudiante.setNombre(request.getPrimerNombre() + (request.getSegundoNombre() != null ? " " + request.getSegundoNombre() : ""));
        estudiante.setApellido(request.getPrimerApellido() + (request.getSegundoApellido() != null ? " " + request.getSegundoApellido() : ""));
        estudiante.setDocumento(request.getNumeroDocumento());
        
        Usuario actualizado = usuarioRepository.save(estudiante);
        
        return LoginResponse.builder()
                .exito(true)
                .mensaje("Estudiante actualizado exitosamente")
                .id(actualizado.getId())
                .email(actualizado.getEmail())
                .nombre(actualizado.getNombre())
                .apellido(actualizado.getApellido())
                .documento(actualizado.getDocumento())
                .programa(actualizado.getPrograma())
                .rol(actualizado.getRol())
                .build();
    }
    
    /**
     * Eliminar estudiante (soft delete - cambiar a inactivo)
     */
    public LoginResponse eliminarEstudiante(String id) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);
        
        if (usuarioOpt.isEmpty()) {
            return LoginResponse.builder()
                    .exito(false)
                    .mensaje("Estudiante no encontrado")
                    .build();
        }
        
        Usuario estudiante = usuarioOpt.get();
        
        // Validar que no sea coordinador
        if ("COORDINADOR".equals(estudiante.getRol())) {
            return LoginResponse.builder()
                    .exito(false)
                    .mensaje("No se puede eliminar un coordinador")
                    .build();
        }
        
        // Soft delete - marcar como inactivo
        estudiante.setActivo(false);
        usuarioRepository.save(estudiante);
        
        // También desactivar sus puntajes (si tiene)
        Optional<Puntaje> puntajeOpt = puntajeRepository.findByEstudianteId(id);
        if (puntajeOpt.isPresent()) {
            Puntaje puntaje = puntajeOpt.get();
            puntaje.setActivo(false);
            puntajeRepository.save(puntaje);
        }
        
        return LoginResponse.builder()
                .exito(true)
                .mensaje("Estudiante eliminado exitosamente")
                .build();
    }
}
