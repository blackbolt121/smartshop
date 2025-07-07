package com.smartshop.smartshop.Scheduled;

import com.smartshop.smartshop.Controllers.UrreaProductRequest;
import com.smartshop.smartshop.Models.Producto;
import com.smartshop.smartshop.Models.Role;
import com.smartshop.smartshop.Models.UrreaProduct;
import com.smartshop.smartshop.Models.Vendor;
import com.smartshop.smartshop.Repositories.ProductRepository;
import com.smartshop.smartshop.Repositories.RoleRepository;
import com.smartshop.smartshop.Repositories.UrreaProductRepository;
import com.smartshop.smartshop.Repositories.VendorRepository;
import com.smartshop.smartshop.Services.ProductoService;
import kong.unirest.core.HttpResponse;
import kong.unirest.core.Unirest;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Slf4j
@Service
public class UrreaProductFetch {

    private final UrreaProductRepository urreaProductRepository;
    private final ProductRepository productRepository;
    private final VendorRepository vendorRepository;
    private final boolean enableLoadData;
    private final boolean loadRoles;
    private final ProductoService productoService;
    private final RoleRepository roleRepository;

    // --- Constructor Mejorado ---
    // Se inyectan todas las dependencias, incluyendo el valor desde application.properties.
    // Esto es una mejor práctica que la inyección por campo y evita errores de autowiring.
    public UrreaProductFetch(
            UrreaProductRepository urreaProductRepository,
            ProductRepository productRepository,
            VendorRepository vendorRepository,
            @Value("${smartshop.loaddata:false}") boolean enableLoadData, // Se añade :false como valor por defecto seguro
            @Value("${smartshop.loadroles:true}") boolean loadRoles,
            ProductoService productoService,
            RoleRepository roleRepository
    ) {
        this.urreaProductRepository = urreaProductRepository;
        this.productRepository = productRepository;
        this.vendorRepository = vendorRepository;
        this.enableLoadData = enableLoadData;
        this.loadRoles = loadRoles;
        this.productoService = productoService;
        this.roleRepository = roleRepository;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void runOnStartup() {
        // --- Lógica de Habilitación ---
        // Ahora la tarea solo se ejecuta si la propiedad en application.properties es 'true'.
        if (enableLoadData) {
            log.info("La carga de datos está habilitada. Ejecutando tarea de Urrea en el inicio...");
            fetchUrreaProductsAsync();
        } else {
            log.info("La carga de datos está deshabilitada (smartshop.loaddata=false). Omitiendo tarea.");
        }

        if (loadRoles) {
            log.info("Cargando roles");
            loadInitialRoles();
        }

        loadMarcas();
    }

    private void loadMarcas() {
        urreaProductRepository.getMarcas().forEach(marca -> {
            if (marca != null && !marca.trim().isEmpty()) {
                vendorRepository.findByVendorName(marca.trim()).orElseGet(() -> {
                    Vendor nuevoVendor = Vendor.builder().vendorName(marca.trim()).build();
                    log.info("Creando nueva marca: {}", marca.trim());
                    return vendorRepository.save(nuevoVendor);
                });
            }
        });
    }

    @Transactional
    public void loadInitialRoles() {
        createOrUpdateRole("ROLE_ADMIN");
        createOrUpdateRole("ROLE_USER");
        createOrUpdateRole("ROLE_SALES");
        createOrUpdateRole("ROLE_OPERATOR");
        log.info("Verificación de roles iniciales completada.");
    }

    /**
     * Método auxiliar para crear o actualizar un rol específico de forma idiomática y segura.
     * @param id El ID del rol.
     * @param name El nombre del rol.
     */
    private void createOrUpdateRole(String name) {
        // Busca el rol. Si no existe, crea una nueva instancia con el ID asignado.
        Role role = roleRepository.findByName(name)
                .orElseGet(() -> {
                    Role newRole = new Role();
                    newRole.setName(name);
                    return newRole;
                });

        // Guarda la entidad. JPA gestionará si es un INSERT (nuevo) o un UPDATE (existente).
        roleRepository.save(role);
    }
    //@Scheduled(cron = "0 0 */2 * * *") // Descomentar para activar la programación regular
    public void fetchUrreaProductsScheduled() {
        if (enableLoadData) {
            log.info("Ejecutando tarea programada de Urrea...");
            fetchUrreaProductsAsync();
        }



    }

    @Async
    @Transactional // Asegura que todas las operaciones de la base de datos se ejecuten en una sola transacción.
    public void fetchUrreaProductsAsync() {
        log.info("Iniciando la sincronización de productos Urrea en segundo plano...");

        // ... (Tu código para llamar a la API de Urrea permanece igual) ...
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

        try {
            JSONObject response = new JSONObject(request.getBody());
            JSONArray products = response.optJSONArray("resultadoDispMasiva");
            if (products == null || !"OK".equals(response.optString("status"))) {
                log.warn("No se encontraron productos en la respuesta o el estado no es OK.");
                return;
            }

            log.info("Se procesarán {} productos de Urrea.", products.length());

            for (int i = 0; i < products.length(); i++) {
                JSONObject productJson = products.getJSONObject(i);

                // Usamos la clase UrreaProductRequest mejorada
                UrreaProductRequest productRequest = new UrreaProductRequest(
                        productJson.optString("codigo"), productJson.optString("nombreLargo"),
                        productJson.optString("DescripcionProducto"), productJson.optString("Marca"),
                        productJson.optString("Submarca"), productJson.optString("familia"),
                        productJson.optString("clase"), productJson.optString("Subclase"),
                        productJson.optString("Precio"), productJson.optString("Moneda"),
                        productJson.optString("Multiplo"), productJson.optString("CodigoBarras"),
                        productJson.optString("EstatusInventario"), productJson.optString("anexo20SAT"),
                        productJson.optString("claveUnidadSAT"), productJson.optString("bullets"),
                        productJson.optString("esJuego"), productJson.optString("piezasJuego"),
                        productJson.optString("contenidoJuego"), productJson.optString("accesorios"),
                        productJson.optString("garantia"), productJson.optString("empaque"),
                        productJson.optString("keywords"), productJson.optString("fotografia"),
                        productJson.optString("video"), productJson.optString("fichaTecnica"),
                        productJson.optString("manual"), productJson.optString("alto"),
                        productJson.optString("fondo"), productJson.optString("ancho"),
                        productJson.optString("peso"), productJson.optString("caracteristica")
                );

                // --- LÓGICA CRUCIAL DE ACTUALIZAR O INSERTAR (UPSERT) ---
                Optional<UrreaProduct> urreaProductOpt = urreaProductRepository.findByCodigoOrCodigoBarras(productJson.optString("codigo", ""), productJson.optString("CodigoBarras"));
                if (urreaProductOpt.isPresent()) {
                    // SI EXISTE: Actualizamos los datos del producto existente
                    UrreaProduct productoExistente = urreaProductOpt.get();
                    actualizarDatosProducto(productoExistente, productRequest.toEntity());
                    urreaProductRepository.save(productoExistente);
                } else {
                    // NO EXISTE: Guardamos el nuevo producto
                    urreaProductRepository.save(productRequest.toEntity());
                }
                productoService.saveUrreaProductToProduct(productRequest.toEntity());
            }

            // Sincronizar Marcas y Productos después de procesar todo el lote
            sincronizarMarcasYProductos();

            log.info("Sincronización de productos Urrea completada.");
        } catch (Exception e) {
            log.error("Error inesperado en la sincronización de productos Urrea", e);
        }
    }

    /**
     * Método auxiliar para actualizar los campos de una entidad existente
     * con los datos de una nueva entidad.
     */
    private void actualizarDatosProducto(UrreaProduct existente, UrreaProduct nuevo) {
        existente.setNombreLargo(nuevo.getNombreLargo());
        existente.setDescripcionProducto(nuevo.getDescripcionProducto());
        existente.setMarca(nuevo.getMarca());
        existente.setPrecio(nuevo.getPrecio());
        existente.setFotografia(nuevo.getFotografia());
        existente.setEstatusInventario(nuevo.getEstatusInventario());
    }

    /**
     * Sincroniza las marcas (Vendors) y los productos disponibles en la tabla principal.
     */
    private void sincronizarMarcasYProductos() {
        log.info("Iniciando sincronización de Marcas y Productos finales...");

        // Sincronizar Marcas (Vendors)
        loadMarcas();

        // Sincronizar Productos Disponibles
        urreaProductRepository.findByProductosDisponible().forEach(urreaProduct -> {
            Vendor vendor = vendorRepository.findByVendorName(urreaProduct.getMarca().trim()).orElse(null);
            Producto producto = Producto.builder()// ID del producto principal es el mismo código de Urrea
                    .price(urreaProduct.getPrecio())
                    .description(urreaProduct.getDescripcionProducto())
                    .vendor(vendor)
                    .name(urreaProduct.getNombreLargo())
                    .category(urreaProduct.getFamilia())
                    .imageUrl(urreaProduct.getFotografia())
                    .urreaProduct(urreaProduct)
                    .build();
            productRepository.save(producto); // save también actualiza si ya existe por el ID
        });

        log.info("Sincronización de Marcas y Productos finalizada.");
    }
}