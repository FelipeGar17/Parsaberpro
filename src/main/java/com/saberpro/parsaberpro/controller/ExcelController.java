package com.saberpro.parsaberpro.controller;

import com.saberpro.parsaberpro.service.ExcelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/excel")
public class ExcelController {

    @Autowired
    private ExcelService excelService;

    /**
     * Endpoint para cargar estudiantes masivamente desde Excel
     */
    @PostMapping("/cargar-estudiantes")
    public ResponseEntity<Map<String, Object>> cargarEstudiantes(
            @RequestParam("file") MultipartFile file) {
        
        Map<String, Object> response = new HashMap<>();

        try {
            // Validar que se envió un archivo
            if (file.isEmpty()) {
                response.put("exito", false);
                response.put("mensaje", "No se ha seleccionado ningún archivo");
                return ResponseEntity.badRequest().body(response);
            }

            // Validar extensión del archivo
            String filename = file.getOriginalFilename();
            if (filename == null || !filename.endsWith(".xlsx")) {
                response.put("exito", false);
                response.put("mensaje", "El archivo debe ser un Excel (.xlsx)");
                return ResponseEntity.badRequest().body(response);
            }

            // Procesar el archivo
            ExcelService.ResultadoCarga resultado = excelService.procesarExcelEstudiantes(file);

            response.put("exito", resultado.isExito());
            response.put("mensaje", resultado.getMensaje());
            response.put("totalProcesados", resultado.getTotalProcesados());
            response.put("totalExitosos", resultado.getTotalExitosos());
            response.put("totalErrores", resultado.getTotalErrores());
            response.put("errores", resultado.getErrores());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("exito", false);
            response.put("mensaje", "Error al procesar el archivo: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
