package com.smartshop.smartshop.Controllers;

import com.smartshop.smartshop.Models.Cart;
import com.smartshop.smartshop.Models.CartItem;
import com.smartshop.smartshop.Repositories.CartRepository;
import kong.unirest.core.HttpResponse;
import kong.unirest.core.Unirest;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Map;
import java.util.Optional;

@Slf4j
@Controller
@AllArgsConstructor
public class PaymentController {

    private final CartRepository cartRepository;
    @GetMapping("/checkout")
    public String checkout(@RequestParam("cart") String cart, Model model) {
        final JSONObject payload = new JSONObject("{}");

        Optional<Cart> opt_cart = cartRepository.findById(cart);
        if(opt_cart.isEmpty()) {
            return "redirect:/cart";
        }
        Cart carrito = opt_cart.get();
        Optional<Double> opt_price =  carrito.getItems().stream().map( item -> item.getProduct().getPrice() * item.getQuantity()).reduce( (a, b) -> a + b);
        if(opt_price.isEmpty()){
            return "redirect:/cart";
        }
        double subtotal = opt_price.get();
        double iva = subtotal * 0.16;
        double envio = 500;
        double total = subtotal + iva + envio;
        payload.put("amount", total);

        HttpResponse<String> request = Unirest.post("https://gateway-154.netpaydev.com/gateway-ecommerce/v3/token/amount")
                .header("Authorization", "sk_netpay_VcNiErfSqYMnxOZToQxxNYLFORdUHJZpyeFeZFoGsccny")
                .header("Content-Type", "application/json")
                .header("Accept", "application/json")
                .body(payload.toString()).asString();
        JSONObject response = new JSONObject(request.getBody());
        String token = response.getString("tokenAmount");

        model.addAttribute("token", token);
        model.addAttribute("cartSize", carrito.getItems().stream().mapToInt(CartItem::getQuantity).sum());
        model.addAttribute("price", total);
        model.addAttribute("iva", iva);
        model.addAttribute("envio", envio);
        model.addAttribute("subtotal", subtotal);
        model.addAttribute("cart", carrito);
        return "NetPay2";
    }

    @PostMapping("/checkout")
    public String checkoutConfirm(Map<String, Object> object, Model model) {
        log.info(object.toString());
        log.info("checkout confirmed");
        return "NetPay3";
    }
}

/*
Model model,
@RequestParam double amount,
@RequestParam String email) {

// Simula generación de token
String token = "tok_" + System.currentTimeMillis();

        model.addAttribute("token", token);
        model.addAttribute("amount", amount);
        model.addAttribute("email", email);

        return "checkout"; // Carga checkout.html desde /templates/
                }


 */