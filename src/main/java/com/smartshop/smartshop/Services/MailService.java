package com.smartshop.smartshop.Services;

import com.resend.*;
import com.resend.services.emails.model.SendEmailRequest;
import com.resend.services.emails.model.SendEmailResponse;
import com.smartshop.smartshop.Models.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MailService {

    public void sendEmail(Usuario usuario, String subjetct, String html) {
        Resend resend = new Resend("re_fcfqJaWG_4VdJr8KzpWSwPX82y2gxw2ng");
        SendEmailRequest sendEmailRequest = SendEmailRequest.builder()
                .from("cotizacion@mercadourrea.com.mx")
                .to(usuario.getEmail())
                .subject(subjetct)
                .html(html)
                .build();

        SendEmailResponse data = resend.emails().send(sendEmailRequest);
    }
}
