package com.smartshop.smartshop.DTO;

public record CartItemDto(
        String id,
        String name,
        Integer quantity
) {}