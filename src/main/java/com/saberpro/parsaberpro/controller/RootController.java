package com.saberpro.parsaberpro.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Controlador para redirigir la raíz del sitio hacia login.html
 */
@Controller
public class RootController {
    
    /**
     * Redirige la raíz "/" hacia la página de login
     * Así cuando entren a https://parsaberpro.onrender.com/
     * automáticamente van a login.html
     */
    @GetMapping("/")
    public String redirectToLogin() {
        return "redirect:/login.html";
    }
}
