package com.saberpro.parsaberpro.repository;

import com.saberpro.parsaberpro.model.Usuario;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends MongoRepository<Usuario, String> {
    
    Optional<Usuario> findByEmail(String email);
    
    Optional<Usuario> findByDocumento(String documento);
    
    List<Usuario> findByRol(String rol);
    
    boolean existsByEmail(String email);
    
    boolean existsByDocumento(String documento);
}
