import { Box, FormControl, FormLabel, Input, Button, Typography, Textarea} from "@mui/joy";

const ContactPage = () => {
  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 5, p: 3, boxShadow: "md", borderRadius: "md" }}>
      <Typography level="h3" sx={{ mb: 2 }}>Contáctanos</Typography>

      <FormControl sx={{ mb: 2 }}>
        <FormLabel>Nombre</FormLabel>
        <Input placeholder="Tu nombre" />
      </FormControl>

      <FormControl sx={{ mb: 2 }}>
        <FormLabel>Correo electrónico</FormLabel>
        <Input type="email" placeholder="tu@email.com" />
      </FormControl>

      <FormControl sx={{ mb: 2 }}>
        <FormLabel>Mensaje</FormLabel>
        <Textarea placeholder="Escribe tu mensaje" minRows={3} />
      </FormControl>

      <Button variant="solid" color="primary" fullWidth>
        Enviar
      </Button>
    </Box>
  );
};

export default ContactPage;
