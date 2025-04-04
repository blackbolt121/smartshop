package com.smartshop.smartshop.Scheduled;

import com.smartshop.smartshop.Controllers.UrreaProductRequest;
import com.smartshop.smartshop.Models.Producto;
import com.smartshop.smartshop.Models.UrreaProduct;
import com.smartshop.smartshop.Models.Vendor;
import com.smartshop.smartshop.Repositories.ProductRepository;
import com.smartshop.smartshop.Repositories.UrreaProductRepository;
import com.smartshop.smartshop.Repositories.VendorRepository;
import kong.unirest.core.HttpResponse;
import kong.unirest.core.Unirest;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.util.Optional;

@Slf4j
@Service  // ✅ Ahora es un servicio
@AllArgsConstructor
public class UrreaProductFetch {

    private final UrreaProductRepository urreaProductRepository;
    private final ProductRepository productRepository;
    private final VendorRepository vendorRepository;

    @EventListener(ApplicationReadyEvent.class)
    public void runOnStartup() {
        log.info("Ejecutando tarea de Urrea en el inicio...");
        this.fetchUrreaProductsAsync();
    }

    @Scheduled(cron = "0 0 */2 * * *")
    public void fetchUrreaProductsScheduled() {
        log.info("Ejecutando tarea programada de Urrea...");
        this.fetchUrreaProductsAsync();
    }

    @Async
    public void fetchUrreaProductsAsync() {
        log.info("Iniciando la sincronización de productos Urrea en segundo plano...");

        final JSONObject payload = new JSONObject()
                .put("opcion", 4)
                .put("usuario", "COAIM")
                .put("password", "D1037300");

        HttpResponse<String> request = Unirest.post("https://www.urreanet.com/urreanetnuevo/wsInformacionProducto.php")
                .header("Content-Type", "application/json")
                .header("Accept", "application/json")
                .body(payload.toString())
                .asString();

        if (request.getStatus() != 200) {
            log.error("Error al obtener productos Urrea: HTTP {}", request.getStatus());
            return;
        }

        log.info("Productos Urrea obtenidos correctamente.");

        try {
            JSONObject response = new JSONObject(request.getBody());
            log.debug("Keys en respuesta: {}", response.keySet());

            JSONArray products = response.optJSONArray("resultadoDispMasiva");
            if (products == null || !"OK".equals(response.optString("status"))) {
                log.warn("No se encontraron productos en la respuesta.");
                return;
            }

            for (int i = 0; i < products.length(); i++) {
                JSONObject productJson = products.getJSONObject(i);
                try {
                    Double precio = productJson.isNull("Precio") ? null : productJson.optDouble("Precio", 0);
                    if (precio == null || precio.isNaN()) {
                        precio = 0.0; // O usa null si la columna permite valores nulos
                    }
                    UrreaProductRequest productRequest = new UrreaProductRequest(
                            productJson.optString("codigo"),
                            productJson.optString("nombreLargo"),
                            productJson.optString("DescripcionProducto"),
                            productJson.optString("Marca"),
                            productJson.optString("Submarca"),
                            productJson.optString("familia"),
                            productJson.optString("clase"),
                            productJson.optString("Subclase"),
                            precio,
                            productJson.optString("Moneda"),
                            productJson.optInt("Multiplo", 0),
                            productJson.optString("CodigoBarras"),
                            productJson.optString("EstatusInventario"),
                            productJson.optString("anexo20SAT"),
                            productJson.optString("claveUnidadSAT"),
                            productJson.optString("bullets"),
                            productJson.optString("esJuego"),
                            productJson.optInt("piezasJuego", 0),
                            productJson.optString("contenidoJuego"),
                            productJson.optString("accesorios"),
                            productJson.optString("garantia"),
                            productJson.optString("empaque"),
                            productJson.optString("keywords"),
                            productJson.optString("fotografia"),
                            productJson.optString("video"),
                            productJson.optString("fichaTecnica"),
                            productJson.optString("manual"),
                            productJson.optDouble("alto", 0),
                            productJson.optDouble("fondo", 0),
                            productJson.optDouble("ancho", 0),
                            productJson.optDouble("peso", 0),
                            productJson.optString("caracteristica")
                    );

                    UrreaProduct urreaProduct = productRequest.toEntity();
                    urreaProductRepository.save(urreaProduct);
                } catch (Exception e) {
                    log.error("No se pudo guardar el producto Urrea: {}", productJson.optString("codigo"), e);
                }
            }

            log.info("Sincronización de productos Urrea completada.");
        } catch (Exception e) {
            log.error("Error inesperado en la sincronización de productos Urrea", e);
        }

        urreaProductRepository.flush();

        urreaProductRepository.getMarcas().forEach(marca -> {
            Optional<Vendor> vendor = vendorRepository.findByVendorName(marca);
            if(vendor.isEmpty()){
                Vendor vendorCreate = Vendor
                        .builder()
                        .vendorName(marca)
                        .vendorAddress("")
                        .vendorCity("")
                        .vendorEmail("")
                        .vendorAddress("")
                        .vendorFaxUrl("")
                        .vendorPhone("")
                        .vendorState("")
                        .vendorZipCode("")
                        .vendorWebsiteUrl("")
                        .build();
                vendorRepository.saveAndFlush(vendorCreate);
            }
        });

        urreaProductRepository.findByProductosDisponible().forEach(urreaProduct -> {
            Producto producto = Producto
                    .builder()
                    .price(urreaProduct.getPrecio())
                    .description(urreaProduct.getDescripcionProducto())
                    .Id(urreaProduct.getCodigo())
                    .vendor(vendorRepository.findByVendorName(urreaProduct.getMarca()).orElse(null))
                    .name(urreaProduct.getNombreLargo())
                    .imageUrl(urreaProduct.getFotografia())
                    .build();
            productRepository.save(producto);
            productRepository.flush();
        });
    }
}
