package com.saberpro.parsaberpro.service;

import com.saberpro.parsaberpro.model.Usuario;
import com.saberpro.parsaberpro.repository.UsuarioRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Service
public class ExcelService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    /**
     * Procesa un archivo Excel y carga estudiantes masivamente
     */
    public ResultadoCarga procesarExcelEstudiantes(MultipartFile file) {
        ResultadoCarga resultado = new ResultadoCarga();
        List<String> errores = new ArrayList<>();
        int procesados = 0;
        int exitosos = 0;

        try (InputStream is = file.getInputStream();
             Workbook workbook = new XSSFWorkbook(is)) {

            Sheet sheet = workbook.getSheetAt(0);
            
            // Saltar la fila de encabezados (fila 0)
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                
                if (row == null) continue;
                
                procesados++;
                
                try {
                    // Leer datos de la fila
                    String tipoDocumento = getCellValueAsString(row.getCell(0));
                    String numeroDocumento = getCellValueAsString(row.getCell(1));
                    String primerApellido = getCellValueAsString(row.getCell(2));
                    String segundoApellido = getCellValueAsString(row.getCell(3));
                    String primerNombre = getCellValueAsString(row.getCell(4));
                    String segundoNombre = getCellValueAsString(row.getCell(5));
                    String correoElectronico = getCellValueAsString(row.getCell(6));
                    String numeroTelefonico = getCellValueAsString(row.getCell(7));
                    String numeroRegistro = getCellValueAsString(row.getCell(8));
                    String programaAcademico = getCellValueAsString(row.getCell(9));

                    // Validaciones básicas
                    if (numeroDocumento == null || numeroDocumento.trim().isEmpty()) {
                        errores.add("Fila " + (i + 1) + ": Número de documento vacío");
                        continue;
                    }

                    if (primerNombre == null || primerNombre.trim().isEmpty()) {
                        errores.add("Fila " + (i + 1) + ": Primer nombre vacío");
                        continue;
                    }

                    if (primerApellido == null || primerApellido.trim().isEmpty()) {
                        errores.add("Fila " + (i + 1) + ": Primer apellido vacío");
                        continue;
                    }

                    // Verificar si el estudiante ya existe
                    if (usuarioRepository.findByDocumento(numeroDocumento).isPresent()) {
                        errores.add("Fila " + (i + 1) + ": El documento " + numeroDocumento + " ya existe");
                        continue;
                    }

                    // Crear nuevo estudiante
                    Usuario estudiante = new Usuario();
                    estudiante.setTipoDocumento(tipoDocumento != null ? tipoDocumento : "CC");
                    estudiante.setNumeroDocumento(numeroDocumento.trim());
                    estudiante.setDocumento(numeroDocumento.trim()); // Campo legacy
                    estudiante.setPrimerApellido(primerApellido.trim());
                    estudiante.setSegundoApellido(segundoApellido != null ? segundoApellido.trim() : "");
                    estudiante.setPrimerNombre(primerNombre.trim());
                    estudiante.setSegundoNombre(segundoNombre != null ? segundoNombre.trim() : "");
                    estudiante.setCorreoElectronico(correoElectronico != null ? correoElectronico.trim() : "");
                    estudiante.setEmail(correoElectronico != null ? correoElectronico.trim() : numeroDocumento + "@estudiante.com"); // Campo requerido
                    estudiante.setNumeroTelefonico(numeroTelefonico != null ? numeroTelefonico.trim() : "");
                    estudiante.setNumeroRegistro(numeroRegistro != null ? numeroRegistro.trim() : "");
                    estudiante.setPrograma(programaAcademico != null ? programaAcademico.trim() : "");
                    
                    // Campos legacy combinados
                    estudiante.setNombre(primerNombre.trim() + (segundoNombre != null ? " " + segundoNombre.trim() : ""));
                    estudiante.setApellido(primerApellido.trim() + (segundoApellido != null ? " " + segundoApellido.trim() : ""));
                    
                    // Configuración por defecto para estudiantes
                    estudiante.setRol("ESTUDIANTE");
                    estudiante.setActivo(true);
                    estudiante.setTienePuntajes(false);
                    
                    // Contraseña por defecto: número de documento
                    estudiante.setPassword(passwordEncoder.encode(numeroDocumento.trim()));

                    // Guardar en la base de datos
                    usuarioRepository.save(estudiante);
                    exitosos++;

                } catch (Exception e) {
                    errores.add("Fila " + (i + 1) + ": Error al procesar - " + e.getMessage());
                }
            }

        } catch (Exception e) {
            resultado.setExito(false);
            resultado.setMensaje("Error al procesar el archivo Excel: " + e.getMessage());
            return resultado;
        }

        // Preparar resultado
        resultado.setExito(true);
        resultado.setTotalProcesados(procesados);
        resultado.setTotalExitosos(exitosos);
        resultado.setTotalErrores(errores.size());
        resultado.setErrores(errores);
        
        String mensaje = String.format("Proceso completado: %d estudiantes cargados exitosamente de %d procesados", 
                                       exitosos, procesados);
        
        if (!errores.isEmpty()) {
            mensaje += ". " + errores.size() + " errores encontrados.";
        }
        
        resultado.setMensaje(mensaje);

        return resultado;
    }

    /**
     * Convierte el valor de una celda a String
     */
    private String getCellValueAsString(Cell cell) {
        if (cell == null) return null;

        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                // Si es numérico, convertir a String sin decimales
                return String.valueOf((long) cell.getNumericCellValue());
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                return cell.getCellFormula();
            default:
                return null;
        }
    }

    /**
     * Clase interna para el resultado de la carga
     */
    public static class ResultadoCarga {
        private boolean exito;
        private String mensaje;
        private int totalProcesados;
        private int totalExitosos;
        private int totalErrores;
        private List<String> errores;

        public ResultadoCarga() {
            this.errores = new ArrayList<>();
        }

        // Getters y Setters
        public boolean isExito() { return exito; }
        public void setExito(boolean exito) { this.exito = exito; }

        public String getMensaje() { return mensaje; }
        public void setMensaje(String mensaje) { this.mensaje = mensaje; }

        public int getTotalProcesados() { return totalProcesados; }
        public void setTotalProcesados(int totalProcesados) { this.totalProcesados = totalProcesados; }

        public int getTotalExitosos() { return totalExitosos; }
        public void setTotalExitosos(int totalExitosos) { this.totalExitosos = totalExitosos; }

        public int getTotalErrores() { return totalErrores; }
        public void setTotalErrores(int totalErrores) { this.totalErrores = totalErrores; }

        public List<String> getErrores() { return errores; }
        public void setErrores(List<String> errores) { this.errores = errores; }
    }
}
