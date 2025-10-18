package com.saberpro.parsaberpro.repository;

import com.saberpro.parsaberpro.model.Estudiante;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EstudianteRepository extends MongoRepository<Estudiante, String> {
    
    Optional<Estudiante> findByEmail(String email);
}
