package com.smartshop.smartshop.Controllers;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.smartshop.smartshop.Models.UrreaProduct;

public record UrreaProductRequest(
        @JsonProperty("codigo") String codigo,
        @JsonProperty("nombreLargo") String nombreLargo,
        @JsonProperty("DescripcionProducto") String descripcionProducto,
        @JsonProperty("Marca") String marca,
        @JsonProperty("Submarca") String submarca,
        @JsonProperty("familia") String familia,
        @JsonProperty("clase") String clase,
        @JsonProperty("Subclase") String subclase,
        @JsonProperty("Precio") Double precio,
        @JsonProperty("Moneda") String moneda,
        @JsonProperty("Multiplo") Integer multiplo,
        @JsonProperty("CodigoBarras") String codigoBarras,
        @JsonProperty("EstatusInventario") String estatusInventario,
        @JsonProperty("anexo20SAT") String anexo20SAT,
        @JsonProperty("claveUnidadSAT") String claveUnidadSAT,
        @JsonProperty("bullets") String bullets,
        @JsonProperty("esJuego") String esJuego,
        @JsonProperty("piezasJuego") Integer piezasJuego,
        @JsonProperty("contenidoJuego") String contenidoJuego,
        @JsonProperty("accesorios") String accesorios,
        @JsonProperty("garantia") String garantia,
        @JsonProperty("empaque") String empaque,
        @JsonProperty("keywords") String keywords,
        @JsonProperty("fotografia") String fotografia,
        @JsonProperty("video") String video,
        @JsonProperty("fichaTecnica") String fichaTecnica,
        @JsonProperty("manual") String manual,
        @JsonProperty("alto") Double alto,
        @JsonProperty("fondo") Double fondo,
        @JsonProperty("ancho") Double ancho,
        @JsonProperty("peso") Double peso,
        @JsonProperty("caracteristica") String caracteristica
) {
    public UrreaProduct toEntity() {
        return UrreaProduct.builder()
                .codigo(codigo)
                .nombreLargo(nombreLargo)
                .descripcionProducto(descripcionProducto)
                .marca(marca)
                .submarca(submarca)
                .familia(familia)
                .clase(clase)
                .subclase(subclase)
                .precio(precio)
                .moneda(moneda)
                .multiplo(multiplo)
                .codigoBarras(codigoBarras)
                .estatusInventario(estatusInventario)
                .anexo20SAT(anexo20SAT)
                .claveUnidadSAT(claveUnidadSAT)
                .bullets(bullets)
                .esJuego("si".equalsIgnoreCase(esJuego))
                .piezasJuego(piezasJuego)
                .contenidoJuego(contenidoJuego)
                .accesorios(accesorios)
                .garantia(garantia)
                .empaque(empaque)
                .keywords(keywords)
                .fotografia(fotografia)
                .video(video)
                .fichaTecnica(fichaTecnica)
                .manual(manual)
                .alto(alto)
                .fondo(fondo)
                .ancho(ancho)
                .peso(peso)
                .caracteristica(caracteristica)
                .build();
    }
}
