package com.saberpro.parsaberpro.repository;

import com.saberpro.parsaberpro.model.Puntaje;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PuntajeRepository extends MongoRepository<Puntaje, String> {
    
    // Buscar por número de registro
    Optional<Puntaje> findByNumeroRegistro(String numeroRegistro);
    
    // Buscar por estudiante ID
    Optional<Puntaje> findByEstudianteId(String estudianteId);
    
    // Listar todos los puntajes activos
    List<Puntaje> findByActivoTrue();
    
    // Verificar si existe puntaje para un estudiante
    boolean existsByEstudianteId(String estudianteId);
    
    boolean existsByNumeroRegistro(String numeroRegistro);
}
