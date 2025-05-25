package com.smartshop.smartshop.Controllers;

import kong.unirest.core.HttpResponse;
import kong.unirest.core.Unirest;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Map;

@Slf4j
@Controller
public class PaymentController {

    @GetMapping("/checkout")
    public String checkout(@RequestParam("price") String price, Model model) {
        final JSONObject payload = new JSONObject("{}");
        payload.put("amount", price);

        HttpResponse<String> request = Unirest.post("https://gateway-154.netpaydev.com/gateway-ecommerce/v3/token/amount")
                .header("Authorization", "sk_netpay_VcNiErfSqYMnxOZToQxxNYLFORdUHJZpyeFeZFoGsccny")
                .header("Content-Type", "application/json")
                .header("Accept", "application/json")
                .body(payload.toString()).asString();


        JSONObject response = new JSONObject(request.getBody());

        String token = response.getString("tokenAmount");

        model.addAttribute("token", token);
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