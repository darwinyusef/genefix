document.getElementById('btn_login').addEventListener('click', async () => {
    const documento = document.getElementById('documento').value;
    const pass = document.getElementById('pass').value;

    if (!documento || !pass) {
        alert('Debes ingresar un usuario y una contraseña');
        return;
    } else {
        // Simulamos el JSON donde validamos
        try {
            const response = await fetch("http://localhost:8000/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "document": documento, // O usa "email" si eso es lo que espera tu backend
                    "password": pass
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al iniciar sesión');
            }

            const data = await response.json();

            localStorage.setItem('access_token', data.access_token);
            console.log('Token guardado en localStorage:', data.access_token);

            // Aquí, guardamos los datos del usuario en localStorage
            localStorage.setItem('user', JSON.stringify(data.user));

            setTimeout(() => {
                alert('Bienvenido a la app');
                // Limpiar formulario si es necesario
                document.getElementById('documento').value = '';
                document.getElementById('pass').value = '';
                // Redireccionamos a la página principal
                location.href = './home.html';
            }, 1000);
        } catch (error) {
            console.error('Hubo un problema con el login:', error);
            alert(error.message);
        }
    }
});
