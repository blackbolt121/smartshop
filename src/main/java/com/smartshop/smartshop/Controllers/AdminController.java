package com.smartshop.smartshop.Controllers;

import com.smartshop.smartshop.Models.Cart;
import com.smartshop.smartshop.Models.Producto;
import com.smartshop.smartshop.Models.Usuario;
import com.smartshop.smartshop.Repositories.ProductRepository;
import com.smartshop.smartshop.Services.AuthService;
import com.smartshop.smartshop.Services.CartService;
import com.smartshop.smartshop.Services.JwtService;
import com.smartshop.smartshop.Services.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

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


    @GetMapping("/dashboard")
    public String dashboard(@CookieValue(value = "adminId") String id, Model model, HttpServletResponse response, HttpServletRequest request) {
        Usuario u = userService.getUserByEmail(id);
        try{
            SecurityContext context = SecurityContextHolder.getContext();
            context.getAuthentication().getCredentials();
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


}
