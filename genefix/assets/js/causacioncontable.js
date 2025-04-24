function mostrarAlerta(mensaje, tipo) {
    const alerta = document.getElementById('alerta');
    alerta.textContent = mensaje;
    alerta.addClassList.remove('alert-success', 'alert-danger', 'alert-warning', 'alert-info', 'alert-primary', 'alert-secondary', 'alert-light', 'alert-dark');
    alerta.classList.add(`alert-${tipo}`); // Agregar la clase de tipo de alerta
    alerta.style.display = 'block';
    alerta.classList.add('fade-in');

    setTimeout(() => {
        alerta.classList.remove('fade-in');
        alerta.classList.add('fade-out');

        alerta.addEventListener('animationend', () => {
            alerta.style.display = 'none';
            alerta.classList.remove('fade-out');
        }, { once: true });

    }, 7000); // 7 segundos
}

// Puedes llamarlo cuando lo necesites



const inputNit = document.getElementById('id_nit');

inputNit.addEventListener('input', async function () {
    const valor = this.value;

    // Validar solo si tiene 6 caracteres
    if (valor.length > 3) {
        try {
            const response = await fetch(`http://begranda.com/equilibrium2/public/api/nits?key=${API_KEY}&f-nit_1=123&eq-nit_1=${valor}`);
            const result = await response.json();
            if (result.status == "success") {
                if (result.data.length > 0) {
                    // Encontrado
                    this.classList.remove('is-invalid');
                    this.classList.add('is-valid');
                    // console.log('NIT encontrado');

                    const data = result.data[0]?.id;
                    // console.log('ID NIT:', data);
                } else {
                    // No encontrado
                    this.classList.remove('is-valid');
                    this.classList.add('is-invalid');
                    console.log('NIT no encontrado: Si desea ingresarlo debe comunicarse con el administrador del sistema');
                }
                // Objeto con claves dinámicas "1", "2", "3"...


            } else {
                // No encontrado
                this.classList.remove('is-valid');
                this.classList.add('is-invalid');
            }

        } catch (error) {
            console.error('Error en la API', error);
            this.classList.remove('is-valid');
            this.classList.add('is-invalid');
        }

    } else {
        // Si no tiene 6 caracteres, limpiar estado
        this.classList.remove('is-valid');
        this.classList.remove('is-invalid');
    }
});

function formatCOP(value) {
    const number = parseInt(value.replace(/\D/g, '')) || 0;
    return number.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 });
}

const valorInput = document.getElementById('valor');

valorInput.addEventListener('blur', () => {
    valorInput.value = formatCOP(valorInput.value);
});

valorInput.addEventListener('focus', () => {
    // Al enfocar, remover el formato para que sea más fácil editar
    valorInput.value = valorInput.value.replace(/\D/g, '');
});

function mostrarVistaPrevia() {
    const input = document.getElementById('archivoInput');
    const vistaPrevia = document.getElementById('vistaPreviaArchivo');
    const nombreArchivo = document.getElementById('nombreArchivo');
    const archivo = input.files[0];

    if (archivo) {
        vistaPrevia.style.display = 'block';
        vistaPrevia.innerText = `Archivo seleccionado: ${archivo.name} (${(archivo.size / 1024).toFixed(1)} KB)`;
        nombreArchivo.innerText = archivo.name;
    } else {
        vistaPrevia.style.display = 'none';
        vistaPrevia.innerText = '';
        nombreArchivo.innerText = '';
    }
}

function enviarArchivo() {
    const input = document.getElementById('archivoInput');
    if (!input.files.length) {
        alert('Por favor seleccione un archivo antes de enviar.');
        return;
    }

    alert('Archivo enviado correctamente: ' + input.files[0].name);
    $('#adjuntarArchivoModal').modal('hide');
}

const cargarComprobantes = async () => {
    try {
        const response = await fetch(`https://begranda.com/equilibrium2/public/api/proof?key=${API_KEY}`);
        const result = await response.json();
        // console.log(result);
        const data = result.data; // Objeto con claves dinámicas "1", "2", "3"...

        const select = document.getElementById('selectComprobantes');

        // Limpiar select (por si vuelves a cargar)
        select.innerHTML = '<option value="">Seleccione un comprobante</option>';

        Object.keys(data).forEach(key => {
            const item = data[key];

            const option = document.createElement('option');
            option.value = item.id;
            option.text = `${item.codigo} - ${item.nombre}`;

            select.appendChild(option);
        });

    } catch (error) {
        console.error('Error al cargar comprobantes', error);
    }
}

const buscarCuenta = async () => {
    const cuenta = document.getElementById('f_cuenta').value;
    const nombre = document.getElementById('f_nombre').value;
    // console.log(cuenta, nombre);
    if (cuenta === "" && nombre === "") {
        alert('Por favor, ingrese un valor para buscar');
        return;
    }

    let url = `http://begranda.com/equilibrium2/public/api/account?eq-auxiliar=1&&key=${API_KEY}&`;

    if (cuenta) {
        url += `f-cuenta=${cuenta}&`;
    }

    if (nombre) {
        url += `f-nombre=${nombre}`;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.status !== "success") {
            alert('Error al buscar cuentas contables');
            return;
        }
        mostrarResultadosCuenta(data.data);
    } catch (error) {
        console.error('Error en la búsqueda:', error);
    }
};

const mostrarResultadosCuenta = (data) => {
    const div = document.getElementById('resultadosCuenta');
    div.innerHTML = '';

    if (!data || Object.keys(data).length === 0) {
        div.innerHTML = '<p>No se encontraron resultados.</p>';
        return;
    }

    let tabla = '<table class="table table-hover">';
    tabla += '<thead><tr><th>ID</th><th>Cuenta</th><th>Nombre</th><th>Acción</th></tr></thead><tbody>';

    Object.values(data).forEach(item => {
        console.log(item);
        tabla += `
            <tr>
                <td>${item.id}</td>
                <td>${item.cuenta}</td>
                <td class="infoCuenta">${item.nombre}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="seleccionarCuenta(${item.id})">Agregar</button>
                </td>
            </tr>
        `;
    });

    tabla += '</tbody></table>';

    div.innerHTML = tabla;
};

const seleccionarCuenta = (id) => {
    document.getElementById('id_cuenta').value = id;
    $('#modalBuscarCuenta').modal('hide');
};

function obtenerFechaActual() {
    const fecha = new Date();

    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    const horas = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');
    const segundos = String(fecha.getSeconds()).padStart(2, '0');

    return `${anio}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
}



const API_KEY = "ybb0jhtlcug4Dhbpi6CEP7Up68LriYcPc4209786b008c6327dbe47644f133aadVlJUB0iK5VXzg0CIM8JNNHfU7EoHzU2X";

// Función genérica para validar campos
function validarCampo(id, mensaje, tipo = 'text') {
    const campo = document.getElementById(id);
    const valor = campo.value.trim();

    // Eliminar comentario previo si existe
    const errorPrevio = document.querySelector(`#${id} + .invalid-feedback`);
    if (errorPrevio) errorPrevio.remove();

    if (valor === "" || (tipo === 'num' && isNaN(valor))) {
        campo.classList.add('is-invalid');

        const divError = document.createElement('div');
        divError.className = 'invalid-feedback';
        divError.innerText = mensaje;

        campo.after(divError);
        return false;
    } else {
        campo.classList.remove('is-invalid');
        campo.classList.add('is-valid');
        return true;
    }
}


function validarConcepto() {
    const campo = document.getElementById("concepto");
    const mensajeError = document.getElementById("conceptoError");
    const texto = campo.value.trim();
    const palabras = texto.split(/\s+/).filter(Boolean);
    const cantidadPalabras = palabras.length;

    let error = "";

    if (cantidadPalabras < 20) {
        error = "Debe tener al menos 20 palabras.";
    } else if (cantidadPalabras > 200) {
        error = "No puede tener más de 200 palabras.";
    } else if (texto === "") {
        error = "Este campo es obligatorio.";
    }

    if (error !== "") {
        campo.classList.add("is-invalid");
        mensajeError.textContent = error;
        return false;
    } else {
        campo.classList.remove("is-invalid");
        campo.classList.add("is-valid");
        mensajeError.textContent = "";
        return true;
    }
}


function centroCostos() {
    const select = document.getElementById('extra');
    const descripcion = document.getElementById('descripcionText');

    fetch('/assets/js/centroCostos.json')
        .then((res) => res.json())
        .then((res) => {
            console.log(res);
            res.forEach(item => {
                const option = document.createElement('option');
                option.value = item.codigo;
                option.textContent = `${item.codigo} - ${item.nombre}`;
                select.appendChild(option);
            });

            select.addEventListener('change', function () {
                const seleccionado = res.find(item => item.codigo === this.value);
                descripcion.textContent = seleccionado ? seleccionado.descripcion : 'Descripción no disponible.';
            });
        })
        .catch((e) => {
            console.error('Error al cargar los centros de costos:', e);
        });
} centroCostos();


document.getElementById("btn_guardar").addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validarConcepto()) {
        e.preventDefault(); // Evita que se envíe el formulario
    }

    const camposValidos =
        validarCampo('id_nit', 'El NIT es obligatorio', 'num') &
        validarCampo('fecha_manual', 'La fecha manual es obligatoria') &
        validarCampo('valor', 'El valor es obligatorio', 'num') &
        validarCampo('concepto', 'El concepto es obligatorio') &
        validarCampo('extra', 'El extra es obligatorio');

    if (!camposValidos) {
        console.log("Hay errores en el formulario.");
        return;
    }

    // Capturar valores solo si pasó la validación
    const datos = {
        documents: [
            {
                // id_documento: document.getElementById("id_documento").value.trim(),
                // id_comprobante: document.getElementById("selectComprobantes").value.trim(),
                id_nit: document.getElementById("id_nit").value.trim(),
                fecha: obtenerFechaActual().trim(),
                fecha_manual: document.getElementById("fecha_manual").value.trim(),
                // id_cuenta: document.getElementById("id_cuenta").value.trim(), //6068094  110510	CAJAS MENORES
                valor: document.getElementById("valor").value.trim(),
                tipo: 1,
                concepto: document.getElementById("concepto").value.trim(),
                // documento_referencia: document.getElementById("documento_referencia").value.trim(),
                // token: document.getElementById("token").value.trim(),
                extra: document.getElementById("extra").value.trim()
            }
        ]
    };

    console.log("Datos listos para enviar:", datos);
    /*
    "id_documento": "00000004",
                "id_comprobante": 65,
                "id_nit": 1,
                "fecha": "2024-03-19 08:00:00",
                "fecha_manual": "2024-03-19",
                "id_cuenta": 6068239,
                "valor": "100",
                "tipo": 1,
                "concepto": "ABONO CUENTA TEST VENTAS MOSTRADOR",
                "documento_referencia": "000001-3",
                "token": "f55932f7d912352222457841asasas",
                "extra": "RECIBO_GENERADO_VIA_API"
                */
    mensaje = "Este es un mensaje de alerta de ejemplo.";
    mostrarAlerta(mensaje, "success");
    // await enviarDatos(datos);

})


document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('.loader-wrapper').classList.add('d-none');
    // Aquí inicias tus funciones
    cargarComprobantes();
});



const enviarDatos = async (datos) => {
    const formData = new FormData();
    formData.append('documents', JSON.stringify(datos.documents));

    /* for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
    }*/

    try {
        const response = await fetch(`ttp://begranda.com/equilibrium2/public/api/document?key=${API_KEY}`, {
            method: 'POST',
            body: formData,
        });

        if (response.ok && response.status === 200) {
            const data = await response.json();
            if (data.status == "success") {
                console.log('Respuesta del servidor:', data.data);
            } else {
                console.error('Error en la respuesta del servidor');
            }
        } else {
            console.error('Error en la petición');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};


