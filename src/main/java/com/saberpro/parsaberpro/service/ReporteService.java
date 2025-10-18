package com.saberpro.parsaberpro.service;

import com.saberpro.parsaberpro.model.Puntaje;
import com.saberpro.parsaberpro.model.Usuario;
import com.saberpro.parsaberpro.repository.PuntajeRepository;
import com.saberpro.parsaberpro.repository.UsuarioRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class ReporteService {
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private PuntajeRepository puntajeRepository;
    
    /**
     * Genera un archivo Excel con todos los estudiantes registrados
     */
    public byte[] generarReporteEstudiantes() throws IOException {
        List<Usuario> estudiantes = usuarioRepository.findAll().stream()
                .filter(u -> "ESTUDIANTE".equals(u.getRol()) && u.isActivo())
                .toList();
        
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Estudiantes");
            
            // Estilo para encabezado
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);
            
            // Crear encabezado
            Row headerRow = sheet.createRow(0);
            String[] columnas = {
                "N° Registro", "Tipo Doc", "N° Documento", "Primer Nombre", 
                "Segundo Nombre", "Primer Apellido", "Segundo Apellido", 
                "Correo Electrónico", "Teléfono", "Programa", "Tiene Puntajes"
            };
            
            for (int i = 0; i < columnas.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columnas[i]);
                cell.setCellStyle(headerStyle);
            }
            
            // Llenar datos
            int rowNum = 1;
            for (Usuario est : estudiantes) {
                Row row = sheet.createRow(rowNum++);
                
                row.createCell(0).setCellValue(est.getNumeroRegistro() != null ? est.getNumeroRegistro() : "");
                row.createCell(1).setCellValue(est.getTipoDocumento() != null ? est.getTipoDocumento() : "");
                row.createCell(2).setCellValue(est.getNumeroDocumento() != null ? est.getNumeroDocumento() : "");
                row.createCell(3).setCellValue(est.getPrimerNombre() != null ? est.getPrimerNombre() : "");
                row.createCell(4).setCellValue(est.getSegundoNombre() != null ? est.getSegundoNombre() : "");
                row.createCell(5).setCellValue(est.getPrimerApellido() != null ? est.getPrimerApellido() : "");
                row.createCell(6).setCellValue(est.getSegundoApellido() != null ? est.getSegundoApellido() : "");
                row.createCell(7).setCellValue(est.getCorreoElectronico() != null ? est.getCorreoElectronico() : "");
                row.createCell(8).setCellValue(est.getNumeroTelefonico() != null ? est.getNumeroTelefonico() : "");
                row.createCell(9).setCellValue(est.getPrograma() != null ? est.getPrograma() : "");
                row.createCell(10).setCellValue(est.isTienePuntajes() ? "Sí" : "No");
            }
            
            // Ajustar ancho de columnas
            for (int i = 0; i < columnas.length; i++) {
                sheet.autoSizeColumn(i);
            }
            
            // Convertir a bytes
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            return outputStream.toByteArray();
        }
    }
    
    /**
     * Genera un archivo Excel con estudiantes y sus puntajes
     */
    public byte[] generarReportePuntajes() throws IOException {
        List<Usuario> estudiantes = usuarioRepository.findAll().stream()
                .filter(u -> "ESTUDIANTE".equals(u.getRol()) && u.isActivo())
                .toList();
        
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Puntajes Saber PRO");
            
            // Estilo para encabezado
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.DARK_GREEN.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);
            
            // Crear encabezado
            Row headerRow = sheet.createRow(0);
            String[] columnas = {
                "N° Registro", "Nombre Completo", "Programa", "Estado",
                "Puntaje Global", "Nivel Global", 
                "Comunicación Escrita", "Nivel", 
                "Razonamiento Cuantitativo", "Nivel",
                "Lectura Crítica", "Nivel",
                "Competencias Ciudadanas", "Nivel",
                "Inglés", "Nivel",
                "Fecha Registro"
            };
            
            for (int i = 0; i < columnas.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columnas[i]);
                cell.setCellStyle(headerStyle);
            }
            
            // Estilo para anulados
            CellStyle anuladoStyle = workbook.createCellStyle();
            Font anuladoFont = workbook.createFont();
            anuladoFont.setColor(IndexedColors.RED.getIndex());
            anuladoFont.setBold(true);
            anuladoStyle.setFont(anuladoFont);
            
            // Llenar datos
            int rowNum = 1;
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
            
            for (Usuario est : estudiantes) {
                Row row = sheet.createRow(rowNum++);
                
                String nombreCompleto = String.format("%s %s %s %s",
                    est.getPrimerNombre() != null ? est.getPrimerNombre() : "",
                    est.getSegundoNombre() != null ? est.getSegundoNombre() : "",
                    est.getPrimerApellido() != null ? est.getPrimerApellido() : "",
                    est.getSegundoApellido() != null ? est.getSegundoApellido() : ""
                ).trim().replaceAll("\\s+", " ");
                
                row.createCell(0).setCellValue(est.getNumeroRegistro() != null ? est.getNumeroRegistro() : "");
                row.createCell(1).setCellValue(nombreCompleto);
                row.createCell(2).setCellValue(est.getPrograma() != null ? est.getPrograma() : "");
                
                // Buscar puntajes
                Optional<Puntaje> puntajeOpt = puntajeRepository.findByEstudianteId(est.getId());
                
                if (puntajeOpt.isPresent()) {
                    Puntaje p = puntajeOpt.get();
                    
                    if (p.isAnulado()) {
                        Cell estadoCell = row.createCell(3);
                        estadoCell.setCellValue("ANULADO");
                        estadoCell.setCellStyle(anuladoStyle);
                        
                        for (int i = 4; i < 16; i++) {
                            Cell cell = row.createCell(i);
                            cell.setCellValue("ANULADO");
                            cell.setCellStyle(anuladoStyle);
                        }
                    } else {
                        row.createCell(3).setCellValue("Con puntajes");
                        row.createCell(4).setCellValue(p.getPuntajeGlobal() != null ? p.getPuntajeGlobal() : 0);
                        row.createCell(5).setCellValue(p.getNivelGlobal() != null ? "Nivel " + p.getNivelGlobal() : "");
                        row.createCell(6).setCellValue(p.getComunicacionEscrita() != null ? p.getComunicacionEscrita() : 0);
                        row.createCell(7).setCellValue(p.getComunicacionEscritaNivel() != null ? "Nivel " + p.getComunicacionEscritaNivel() : "");
                        row.createCell(8).setCellValue(p.getRazonamientoCuantitativo() != null ? p.getRazonamientoCuantitativo() : 0);
                        row.createCell(9).setCellValue(p.getRazonamientoCuantitativoNivel() != null ? "Nivel " + p.getRazonamientoCuantitativoNivel() : "");
                        row.createCell(10).setCellValue(p.getLecturaCritica() != null ? p.getLecturaCritica() : 0);
                        row.createCell(11).setCellValue(p.getLecturaCriticaNivel() != null ? "Nivel " + p.getLecturaCriticaNivel() : "");
                        row.createCell(12).setCellValue(p.getCompetenciasCiudadanas() != null ? p.getCompetenciasCiudadanas() : 0);
                        row.createCell(13).setCellValue(p.getCompetenciasCiudadanasNivel() != null ? "Nivel " + p.getCompetenciasCiudadanasNivel() : "");
                        row.createCell(14).setCellValue(p.getIngles() != null ? p.getIngles() : 0);
                        row.createCell(15).setCellValue(p.getInglesNivel() != null ? "Nivel " + p.getInglesNivel() : "");
                    }
                    
                    row.createCell(16).setCellValue(p.getFechaRegistro() != null ? p.getFechaRegistro().format(formatter) : "");
                } else {
                    row.createCell(3).setCellValue("Sin puntajes");
                    for (int i = 4; i < 17; i++) {
                        row.createCell(i).setCellValue("");
                    }
                }
            }
            
            // Ajustar ancho de columnas
            for (int i = 0; i < columnas.length; i++) {
                sheet.autoSizeColumn(i);
            }
            
            // Convertir a bytes
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            return outputStream.toByteArray();
        }
    }
}
