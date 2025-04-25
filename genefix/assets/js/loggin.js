
document.getElementById('btn_login').addEventListener('click', async () => {
    const documento = document.getElementById('documento').value;
    const pass = document.getElementById('pass').value;

    if (!documento || !pass) {
        alert('Debes ingresar un usuario y una contraseña');
        return;
    } else {
        // Simulamos el JSON donde validamos
        try {
            const response = await fetch("http://localhost:8000/api/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "document": documento,
                    "password": pass
                })
            });

            if (!response.ok) {
                throw new Error('Error al iniciar sesión');
            }

            const data = await response.json();

            localStorage.setItem('access_token', data.access_token);
            console.log('Token guardado en localStorage:', data.access_token);

            setTimeout(() => {
                alert('Bienvenido a la app');
                localStorage.setItem('user', JSON.stringify(datosGuardados));
                // Redireccionas a donde necesites
                location.href = './home.html';
            }, 1000);
            // Guardar token en localStorage
            

            // También podrías guardar los datos del usuario si los necesitás
            localStorage.setItem('user', JSON.stringify(data.user));

        } catch (error) {
            console.error('Hubo un problema con el login:', error);
        }
    }
});

