package com.smartshop.smartshop.Controllers;

import com.resend.services.emails.model.SendEmailRequest;
import com.resend.services.emails.model.SendEmailResponse;
import com.smartshop.smartshop.Models.*;
import com.smartshop.smartshop.Repositories.CotizacionRepository;
import com.smartshop.smartshop.Repositories.ProductRepository;
import com.smartshop.smartshop.Services.AuthService;
import com.smartshop.smartshop.Services.CartService;
import com.smartshop.smartshop.Services.JwtService;
import com.smartshop.smartshop.Services.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import com.resend.*;

import java.util.*;

@Slf4j
@Controller
@RequestMapping(path = "/admin")
@AllArgsConstructor
public class AdminController {

    private final AuthService authService;
    private final UserService userService;
    private final JwtService jwtService;
    private final CartService cartService;
    private final ProductRepository productRepository;
    private final CotizacionRepository cotizacionRepository;

    @GetMapping("")
    public String index(){
        try{
            userService.getUserByContext();
            log.info("Redirecting to dashboard");
            return "redirect:/admin/dashboard";
        }catch(Exception e){
            log.info("Redirecting to login...");
            return "redirect:/admin/login";
        }
    }

    @GetMapping("login")
    public String login(@RequestParam(required = false, defaultValue = "false") boolean error, Model model, @CookieValue(value = "access_token", required = false) String token, HttpServletRequest request, HttpServletResponse response) {

        if(token == null){
            log.info("Redirecting to login...");
        }

        if(token != null){
            log.info(token);
            String username = jwtService.extractUsername(token);
            Usuario usuario = userService.getUserByEmail(username);
            if(!jwtService.isTokenValid(token, usuario)){
                if (request.getCookies() != null) {
                    for (Cookie cookie : request.getCookies()) {
                        cookie.setValue("");
                        cookie.setPath("/");
                        cookie.setMaxAge(0);
                        response.addCookie(cookie);
                    }
                }
                return "redirect:/admin/login";
            };

            log.info(username);
            Usuario u = userService.getUserByEmail(username);
            if(u != null){
                jwtService.isTokenValid(token, u);
                return "redirect:/admin/dashboard";
            }
        }
        log.info("Login Request");
        model.addAttribute("error", error);
        return "login";
    }

    @PostMapping("login")
    public String login(@RequestParam String email, @RequestParam String password, HttpServletResponse response) {
        try{

            AuthRequest authRequest = new AuthRequest(email, password);
            TokenResponse tr = authService.authenticate(authRequest);
            Usuario user = userService.getUserByEmail(authRequest.email());
            Cookie cookie = new Cookie("access_token", tr.accessToken());
            cookie.setMaxAge(60 * 60 * 24); // 1 día
            cookie.setPath("/"); // Disponible en toda la app
            cookie.setHttpOnly(true); // No accesible desde JS
            cookie.setSecure(false); // Cámbialo a true si usas HTTPS
            response.addCookie(cookie);

            cookie = new Cookie("adminId", user.getId());
            cookie.setMaxAge(60 * 60 * 24); // 1 día
            cookie.setPath("/"); // Disponible en toda la app
            cookie.setHttpOnly(true); // No accesible desde JS
            cookie.setSecure(false); // Cámbialo a true si usas HTTPS
            response.addCookie(cookie);

            return "redirect:/admin/dashboard";
        }catch (Exception e){
            return "redirect:/login?error=true";
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/dashboard")
    public String dashboard(@CookieValue(value = "adminId") String id, Model model, HttpServletResponse response, HttpServletRequest request) {
        Usuario u = userService.getUserByEmail(id);
        try{
            SecurityContext context = SecurityContextHolder.getContext();
            Usuario usuario = userService.getUserByContext();
            boolean isAdmin = usuario.getRoles().stream().anyMatch(role -> role.getName().equals("ROLE_ADMIN"));
            log.info(isAdmin ? "Admin" : "User");
            if(!isAdmin){
                throw new Exception("You do not have permission to access this page");
            }
        }catch(Exception e){
            Cookie[] cookies = request.getCookies();
            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    Cookie deleteCookie = new Cookie(cookie.getName(), "");
                    deleteCookie.setMaxAge(0); // Expira inmediatamente
                    deleteCookie.setPath("/"); // Asegúrate de que coincida con el path usado para setearla
                    deleteCookie.setHttpOnly(cookie.isHttpOnly());
                    deleteCookie.setSecure(cookie.getSecure());
                    response.addCookie(deleteCookie);
                }
            }
            log.info("Redirecting to Login");
            return "login";
        }



        model.addAttribute("usuario", u);
        return "panel";
    }

    @GetMapping("/users")
    public String users(Model model) {
        List<Usuario> usuario = userService.getAllUsers();
        model.addAttribute("usuarios", usuario);
        return "usuarios";
    }

    @GetMapping("/orders")
    public String orders(Model model) {
        model.addAttribute("orders", cartService.getAllCarts());
        return "pedidos";
    }

    @GetMapping("/logout")
    public String logout(@CookieValue(name = "access_token") String token, HttpServletResponse response, HttpServletRequest request) {
        jwtService.revokeToken(token, userService.getUserByContext());
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                Cookie deleteCookie = new Cookie(cookie.getName(), "");
                deleteCookie.setMaxAge(0); // Expira inmediatamente
                deleteCookie.setPath("/"); // Asegúrate de que coincida con el path usado para setearla
                deleteCookie.setHttpOnly(cookie.isHttpOnly());
                deleteCookie.setSecure(cookie.getSecure());
                response.addCookie(deleteCookie);
            }
        }
        return "redirect:/admin/login";
    }

    @GetMapping("/rest/logout")
    public ResponseEntity<String> logoutAPI(@CookieValue(name = "access_token") String token, HttpServletResponse response, HttpServletRequest request) {
        jwtService.revokeToken(token, userService.getUserByContext());
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                Cookie deleteCookie = new Cookie(cookie.getName(), "");
                deleteCookie.setMaxAge(0); // Expira inmediatamente
                deleteCookie.setPath("/"); // Asegúrate de que coincida con el path usado para setearla
                deleteCookie.setHttpOnly(cookie.isHttpOnly());
                deleteCookie.setSecure(cookie.getSecure());
                response.addCookie(deleteCookie);
            }
        }
        JSONObject obj = new JSONObject();
        obj.put("status", "ok");
        return ResponseEntity.ok(obj.toString());
    }

    @GetMapping("/order/{id}")
    public String order(@PathVariable String id, Model model) {
        Cart cart = cartService.getCartById(id);
        Double price = cart.getItems().stream().map(cartItem -> cartItem.getProduct().getPrice()).reduce(0.0, Double::sum);
        String title = String.format("Pedido %s", id);
        model.addAttribute("cart", cart);
        model.addAttribute("price", price);
        model.addAttribute("title", title);
        model.addAttribute("usuario", cart.getUsuario());

        return "pedido";
    }

    @GetMapping("/usuario/{id}")
    public String usuario(@PathVariable String id, Model model) {
        Usuario usuario = userService.getUsuario(id).orElse(null);
        model.addAttribute("usuario", usuario);
        return "usuario";
    }

    @GetMapping("/usuario/edit/{id}")
    public String usuarioEdit(@PathVariable String id, Model model) {
        Usuario usuario = userService.getUsuario(id).orElse(null);
        model.addAttribute("usuario", usuario);

        return "usuario-editar";
    }

    @GetMapping("/quotes")
    public String showQuotesForm(Model model) {
        List<Producto> productos = productRepository.findAll();
        model.addAttribute("productos", productos);
        return "cotizador";
    }

    @PostMapping("/quotes")
    public String sendQuote(@RequestParam String correo, @RequestParam String nombre, @RequestParam String productoSeleccionados, Model model) {

        Resend resend = new Resend("");

        JSONObject obj = new JSONObject(productoSeleccionados);


        // Crear nueva cotización
        Cotizacion cotizacion = new Cotizacion();
        cotizacion.setNombre(nombre);
        cotizacion.setCorreo(correo);
        cotizacion.setItems(new ArrayList<>());

        // Parsear JSON con los productos seleccionados

        obj.keys().forEachRemaining(key -> {
            Producto producto = productRepository.findById(key).orElse(null);
            if (producto != null) {
                Integer quantity = obj.getJSONObject(key).getInt("cantidad");
                QuoteItem quoteItem = QuoteItem.builder()
                        .product(producto)
                        .quantity(quantity)
                        .cotizacion(cotizacion) // importante para la relación
                        .build();
                cotizacion.getItems().add(quoteItem);
            }
        });

        // Guardar cotización y sus items en cascada
        cotizacionRepository.save(cotizacion);

        String html = this.generarHtmlCotizacion(cotizacion);

        SendEmailRequest sendEmailRequest = SendEmailRequest.builder()
                .from("onboarding@resend.dev")
                .to("rego199903@gmail.com")
                .subject(String.format("Cotizacion: %s", cotizacion.getId()))
                .html(html)
                .build();

        SendEmailResponse data = resend.emails().send(sendEmailRequest);

        List<Producto> productos = productRepository.findAll();
        model.addAttribute("productos", productos);

        return "cotizador";
    }

    @GetMapping("/quotes/all")
    public String showAllQuotes(Model model) {


        return "cotizaciones";
    }

    @PostMapping("/users/save")
    public String actualizarUsuario(@ModelAttribute Usuario usuario) {

        Usuario usuarioExistente = userService.getUsuario(usuario.getId()).orElse(null);

        if (usuarioExistente == null) {
            // Manejar caso en que el usuario no exista
            return "redirect:/admin/users";
        }

        // Solo actualizamos los campos que vienen del formulario
        usuarioExistente.setName(usuario.getName());
        usuarioExistente.setEmail(usuario.getEmail());
        usuarioExistente.setCalle(usuario.getCalle());
        usuarioExistente.setCodigoPostal(usuario.getCodigoPostal());
        usuarioExistente.setCiudad(usuario.getCiudad());
        usuarioExistente.setEstado(usuario.getEstado());
        usuarioExistente.setActivo(usuario.getActivo());
        usuarioExistente.setPais(usuario.getPais());
        usuarioExistente.setTelefono(usuario.getTelefono());
        userService.save(usuarioExistente);
        return "redirect:/admin/users";
    }

    public String generarHtmlCotizacion(Cotizacion cotizacion) {
        StringBuilder html = new StringBuilder();

        double subtotal = 0;
        double envio = 500;

        html.append("<div style=\"font-family: Arial, sans-serif; max-width: 700px; margin: auto;\">");
        html.append("<h2 style=\"color: #1d4ed8;\">Cotización de Productos</h2>");
        html.append("<table style=\"width: 100%; border-collapse: collapse; margin-top: 20px;\">");
        html.append("<thead><tr>")
                .append("<th style=\"text-align: left; border-bottom: 1px solid #ccc; padding: 8px;\">Imagen</th>")
                .append("<th style=\"text-align: left; border-bottom: 1px solid #ccc; padding: 8px;\">Producto</th>")
                .append("<th style=\"text-align: center; border-bottom: 1px solid #ccc; padding: 8px;\">Cantidad</th>")
                .append("<th style=\"text-align: right; border-bottom: 1px solid #ccc; padding: 8px;\">Precio</th>")
                .append("<th style=\"text-align: right; border-bottom: 1px solid #ccc; padding: 8px;\">Total</th>")
                .append("</tr></thead><tbody>");

        for (QuoteItem p : cotizacion.getItems()) {
            double totalProducto = p.getProduct().getPrice() * p.getQuantity();
            subtotal += totalProducto;

            html.append("<tr>")
                    .append("<td style=\"padding: 8px;\"><img src=\"").append(p.getProduct().getImageUrl()).append("\" width=\"60\"/></td>")
                    .append("<td style=\"padding: 8px;\">").append(p.getProduct().getName()).append("<br/><small>").append(p.getProduct().getDescription()).append("</small></td>")
                    .append("<td style=\"padding: 8px; text-align: center;\">").append(p.getQuantity()).append("</td>")
                    .append("<td style=\"padding: 8px; text-align: right;\">$").append(String.format("%.2f", p.getProduct().getPrice())).append("</td>")
                    .append("<td style=\"padding: 8px; text-align: right;\">$").append(String.format("%.2f", totalProducto)).append("</td>")
                    .append("</tr>");
        }

        double iva = subtotal * 0.16;
        double total = subtotal + iva + envio;

        html.append("</tbody></table>");

        // Totales
        html.append("<div style=\"margin-top: 30px; text-align: right;\">")
                .append("<p style=\"margin: 4px 0;\">Subtotal: <strong>$").append(String.format("%.2f", subtotal)).append("</strong></p>")
                .append("<p style=\"margin: 4px 0;\">IVA (16%): <strong>$").append(String.format("%.2f", iva)).append("</strong></p>")
                .append("<p style=\"margin: 4px 0;\">Envío: <strong>$").append(String.format("%.2f", envio)).append("</strong></p>")
                .append("<p style=\"margin: 8px 0; font-size: 18px; color: #10b981;\">Total: <strong>$").append(String.format("%.2f", total)).append("</strong></p>")
                .append("</div>");

        html.append("</div>");
        return html.toString();
    }
}

