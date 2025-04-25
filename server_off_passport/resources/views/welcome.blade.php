<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simular JSON en HTML</title>
</head>
<body>
    <pre id="jsonDisplay"></pre>

    <script>
        // Simulación de un JSON dentro del script
        const jsonData = {
            "info": "GENEFIX",
            "welcome": "Bienvenido a GENEFIX API",
            "description": "Para ingresar debe solicitar apoyo al equipo técnico. wgestor@gmail.com",
        };

        // Convertir JSON a una cadena formateada y mostrarlo en la página
        document.getElementById("jsonDisplay").textContent = JSON.stringify(jsonData, null, 4);
    </script>
</body>
</html>