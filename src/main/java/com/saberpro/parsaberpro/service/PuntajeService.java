package com.saberpro.parsaberpro.service;

import com.saberpro.parsaberpro.dto.LoginResponse;
import com.saberpro.parsaberpro.dto.RegistrarPuntajeRequest;
import com.saberpro.parsaberpro.model.Puntaje;
import com.saberpro.parsaberpro.model.Usuario;
import com.saberpro.parsaberpro.repository.PuntajeRepository;
import com.saberpro.parsaberpro.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PuntajeService {
    
    @Autowired
    private PuntajeRepository puntajeRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    /**
     * Registrar o actualizar puntajes de un estudiante
     */
    public LoginResponse registrarPuntaje(RegistrarPuntajeRequest request, String coordinadorId) {
        // Buscar estudiante por número de registro
        Optional<Usuario> estudianteOpt = usuarioRepository.findAll().stream()
                .filter(u -> request.getNumeroRegistro().equals(u.getNumeroRegistro()))
                .findFirst();
        
        if (estudianteOpt.isEmpty()) {
            return LoginResponse.builder()
                    .exito(false)
                    .mensaje("No se encontró estudiante con el número de registro: " + request.getNumeroRegistro())
                    .build();
        }
        
        Usuario estudiante = estudianteOpt.get();
        
        // Verificar si ya existe un puntaje para este estudiante
        Optional<Puntaje> puntajeExistente = puntajeRepository.findByEstudianteId(estudiante.getId());
        
        Puntaje puntaje;
        boolean esActualizacion = false;
        
        if (puntajeExistente.isPresent()) {
            // Actualizar puntaje existente
            puntaje = puntajeExistente.get();
            esActualizacion = true;
        } else {
            // Crear nuevo puntaje
            puntaje = new Puntaje();
            puntaje.setEstudianteId(estudiante.getId());
            puntaje.setNumeroRegistro(request.getNumeroRegistro());
            puntaje.setRegistradoPor(coordinadorId);
            puntaje.setFechaRegistro(LocalDateTime.now());
        }
        
        // Actualizar valores
        puntaje.setAnulado(request.getAnulado() != null && request.getAnulado());
        
        // Si está anulado, limpiar los puntajes y niveles
        if (puntaje.isAnulado()) {
            puntaje.setPuntajeGlobal(null);
            puntaje.setNivelGlobal("ANULADO");
            puntaje.setComunicacionEscrita(null);
            puntaje.setComunicacionEscritaNivel("ANULADO");
            puntaje.setRazonamientoCuantitativo(null);
            puntaje.setRazonamientoCuantitativoNivel("ANULADO");
            puntaje.setLecturaCritica(null);
            puntaje.setLecturaCriticaNivel("ANULADO");
            puntaje.setCompetenciasCiudadanas(null);
            puntaje.setCompetenciasCiudadanasNivel("ANULADO");
            puntaje.setIngles(null);
            puntaje.setInglesNivel("ANULADO");
        } else {
            // Solo si NO está anulado, registrar los puntajes normalmente
            puntaje.setPuntajeGlobal(request.getPuntajeGlobal());
            puntaje.setNivelGlobal(Puntaje.calcularNivel(request.getPuntajeGlobal()));
            
            puntaje.setComunicacionEscrita(request.getComunicacionEscrita());
            puntaje.setComunicacionEscritaNivel(Puntaje.calcularNivel(request.getComunicacionEscrita()));
            
            puntaje.setRazonamientoCuantitativo(request.getRazonamientoCuantitativo());
            puntaje.setRazonamientoCuantitativoNivel(Puntaje.calcularNivel(request.getRazonamientoCuantitativo()));
            
            puntaje.setLecturaCritica(request.getLecturaCritica());
            puntaje.setLecturaCriticaNivel(Puntaje.calcularNivel(request.getLecturaCritica()));
            
            puntaje.setCompetenciasCiudadanas(request.getCompetenciasCiudadanas());
            puntaje.setCompetenciasCiudadanasNivel(Puntaje.calcularNivel(request.getCompetenciasCiudadanas()));
            
            puntaje.setIngles(request.getIngles());
            puntaje.setInglesNivel(Puntaje.calcularNivel(request.getIngles()));
        }
        
        puntaje.setFechaActualizacion(LocalDateTime.now());
        puntaje.setActivo(true);
        
        Puntaje guardado = puntajeRepository.save(puntaje);
        
        // Marcar al estudiante como que ya tiene puntajes registrados
        estudiante.setTienePuntajes(true);
        usuarioRepository.save(estudiante);
        
        String mensaje;
        if (puntaje.isAnulado()) {
            mensaje = esActualizacion
                ? "Examen marcado como ANULADO para " + estudiante.getPrimerNombre() + " " + estudiante.getPrimerApellido()
                : "Examen registrado como ANULADO para " + estudiante.getPrimerNombre() + " " + estudiante.getPrimerApellido();
        } else {
            mensaje = esActualizacion 
                ? "Puntaje actualizado exitosamente para " + estudiante.getPrimerNombre() + " " + estudiante.getPrimerApellido()
                : "Puntaje registrado exitosamente para " + estudiante.getPrimerNombre() + " " + estudiante.getPrimerApellido();
        }
        
        return LoginResponse.builder()
                .exito(true)
                .mensaje(mensaje)
                .id(guardado.getId())
                .build();
    }
    
    /**
     * Obtener todos los puntajes
     */
    public List<Puntaje> listarPuntajes() {
        return puntajeRepository.findByActivoTrue();
    }
    
    /**
     * Obtener puntaje de un estudiante por su ID
     */
    public Optional<Puntaje> obtenerPuntajePorEstudiante(String estudianteId) {
        return puntajeRepository.findByEstudianteId(estudianteId);
    }
    
    /**
     * Obtener puntaje por número de registro
     */
    public Optional<Puntaje> obtenerPuntajePorNumeroRegistro(String numeroRegistro) {
        return puntajeRepository.findByNumeroRegistro(numeroRegistro);
    }
    
    /**
     * Eliminar puntaje (soft delete)
     */
    public LoginResponse eliminarPuntaje(String id) {
        Optional<Puntaje> puntajeOpt = puntajeRepository.findById(id);
        
        if (puntajeOpt.isEmpty()) {
            return LoginResponse.builder()
                    .exito(false)
                    .mensaje("Puntaje no encontrado")
                    .build();
        }
        
        Puntaje puntaje = puntajeOpt.get();
        puntaje.setActivo(false);
        puntajeRepository.save(puntaje);
        
        return LoginResponse.builder()
                .exito(true)
                .mensaje("Puntaje eliminado exitosamente")
                .build();
    }
}
