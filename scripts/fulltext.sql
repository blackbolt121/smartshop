ALTER TABLE producto ADD FULLTEXT INDEX ft_producto_search (id,name, description, category);
