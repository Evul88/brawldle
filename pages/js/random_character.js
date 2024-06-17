document.addEventListener('DOMContentLoaded', async function() {
    const searchInput = document.querySelector('.input_text');
    const resultDiv = document.querySelector('.result');
    const mainContainer = document.querySelector('.main_container');
    const title = document.querySelector('.title');
    const leyenda = document.querySelector('.leyend');
    const random_number = Math.floor(Math.random() * 62) + 1; // Generar número aleatorio entre 1 y 62

    // Función para buscar un personaje por ID y devolver un objeto JSON
    async function buscarPersonajePorId(id) {
        try {
            const response = await fetch(`http://0.0.0.0:65090/search?query=${encodeURIComponent(id)}`);
            if (!response.ok) {
                throw new Error('No se pudo obtener la respuesta del servidor.');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al buscar personaje por ID:', error);
            throw error;
        }
    }

    const guess = await buscarPersonajePorId(random_number);
    console.log(guess)

    const guessGender = guess.gender;
    const guessPrimary = guess.primary_weapon;
    const guessSecondary = guess.secondary_weapon;
    const guessRelease = guess.release_date;

    // Array para almacenar los nombres de personajes seleccionados
    let charactersSelected = [];

    // Función para limpiar los resultados mostrados
    function limpiarResultados() {
        searchInput.value = '';
        resultDiv.style.display = 'none';
    }

    // Función para mostrar un mensaje en el div de resultados
    function mostrarMensaje(mensaje) {
        resultDiv.textContent = mensaje;
        resultDiv.style.display = 'flex';
    }

    // Función para crear la tabla y mostrar los datos del personaje seleccionado
    function mostrarDatosEnTabla(characterData) {
        // Verificar si la tabla ya existe; si no existe, crearla
        let table = document.getElementById('data');
        if (!table) {
            // Crear la estructura de la tabla
            table = document.createElement('table');
            table.id = 'data';
            table.style.display = 'table'; // Mostrar la tabla
            table.style.marginTop = '20px'; // Margen superior
            table.style.width = '80%'; // Ancho de la tabla
            table.style.maxWidth = '800px'; // Ancho máximo de la tabla
            table.style.borderSpacing = '1em'; // Espacio entre bordes

            // Crear el encabezado (thead)
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            const headers = ['Avatar', 'Gender', 'Primary Weapon', 'Secondary Weapon', 'Release Date'];

            headers.forEach(headerText => {
                const th = document.createElement('th');
                th.textContent = headerText;
                th.style.padding = '8px'; // Relleno de la celda
                th.style.textAlign = 'center'; // Centrar texto
                headerRow.appendChild(th);
            });

            thead.appendChild(headerRow);
            table.appendChild(thead);

            // Crear el cuerpo de la tabla (tbody)
            const tbody = document.createElement('tbody');
            table.appendChild(tbody);

            // Agregar la tabla al contenedor principal
            mainContainer.appendChild(table);
        }

        // Crear una fila para el personaje seleccionado
        const row = document.createElement('tr');

        // Crear celdas para cada propiedad del personaje
        const avatarCell = document.createElement('td');
        const characterName = characterData.name;
        const characterNameLower = characterName.toLowerCase().replace(/\s+/g, '');
        const characterImage = `../images/characters/${characterNameLower}.png`;
        const avatarImg = document.createElement('img');
        avatarImg.src = characterImage;
        avatarImg.alt = characterData.name;
        avatarImg.style.width = '50px'; // Ajustar el tamaño de la imagen según sea necesario
        avatarImg.style.height = '50px'; // Ajustar el tamaño de la imagen según sea necesario
        avatarCell.appendChild(avatarImg);
        avatarCell.style.padding = '8px'; // Relleno de la celda
        avatarCell.style.textAlign = 'center'; // Centrar contenido de la celda
        row.appendChild(avatarCell);

        const genderCell = document.createElement('td');
        genderCell.textContent = characterData.gender || ''; // Mostrar género o dejar vacío si no está definido
        genderCell.style.padding = '8px'; // Relleno de la celda
        genderCell.style.textAlign = 'center'; // Centrar contenido de la celda
        if (characterData.gender == guessGender) {
            genderCell.style.backgroundColor = '#008000'; // Establecer un estilo especial para coincidencia con guess
        } else {
            genderCell.style.backgroundColor = '#ff0000';
        }
        row.appendChild(genderCell);

        const primaryWeaponCell = document.createElement('td');
        primaryWeaponCell.textContent = characterData.primary_weapon || ''; // Mostrar arma principal o dejar vacío si no está definido
        primaryWeaponCell.style.padding = '8px'; // Relleno de la celda
        primaryWeaponCell.style.textAlign = 'center'; // Centrar contenido de la celda
        if (characterData.primary_weapon == guessPrimary) {
            primaryWeaponCell.style.backgroundColor = '#008000'; // Establecer un estilo especial para coincidencia con guess
        } else {
            primaryWeaponCell.style.backgroundColor = '#ff0000';
        }
        row.appendChild(primaryWeaponCell);

        const secondaryWeaponCell = document.createElement('td');
        secondaryWeaponCell.textContent = characterData.secondary_weapon || ''; // Mostrar arma secundaria o dejar vacío si no está definido
        secondaryWeaponCell.style.padding = '8px'; // Relleno de la celda
        secondaryWeaponCell.style.textAlign = 'center'; // Centrar contenido de la celda
        if (characterData.secondary_weapon == guessSecondary) {
            secondaryWeaponCell.style.backgroundColor = '#008000'; // Establecer un estilo especial para coincidencia con guess
        } else {
            secondaryWeaponCell.style.backgroundColor = '#ff0000';
        }
        row.appendChild(secondaryWeaponCell);

        const releaseDateCell = document.createElement('td');
        releaseDateCell.textContent = characterData.release_date || ''; // Mostrar fecha de lanzamiento o dejar vacío si no está definido
        releaseDateCell.style.padding = '8px'; // Relleno de la celda
        releaseDateCell.style.textAlign = 'center'; // Centrar contenido de la celda
        if (characterData.release_date == guessRelease) {
            releaseDateCell.style.backgroundColor = '#008000'; // Establecer un estilo especial para coincidencia con guess
        } else {
            releaseDateCell.style.backgroundColor = '#ff0000';
        }
        row.appendChild(releaseDateCell);

        // Obtener la primera fila de datos (después del encabezado)
        const firstDataRow = table.querySelector('tbody tr:first-of-type');

        // Insertar la nueva fila después de la primera fila de datos (o al final si no hay filas de datos aún)
        if (firstDataRow) {
            firstDataRow.parentNode.insertBefore(row, firstDataRow);
        } else {
            table.querySelector('tbody').appendChild(row);
        }

        // Mostrar la tabla
        table.style.display = 'table';

        // Verificar si el personaje adivinado es correcto
        if (characterData.name.toLowerCase() === guess.name.toLowerCase()) {
            setTimeout(() => {
                searchInput.style.display = 'none'; // Ocultar el campo de búsqueda
                title.style.display = 'none'; // Ocultar el título
                mostrarBotones(); // Mostrar botones de acción
            }, 750); // Esperar 2 segundos antes de realizar el cambio
        }
    }

    function mostrarBotones() {
        const inputContainer = document.querySelector('.input');

        if (inputContainer && title && leyenda) {
            inputContainer.style.display = 'none'; // Ocultar el contenedor de input
            title.style.display = 'none'; // Ocultar el título

            // Crear el botón para volver al inicio
            const homeButton = document.createElement('button');
            homeButton.textContent = 'Go Back Home';
            homeButton.classList.add('boton');
            homeButton.addEventListener('click', function() {
                window.location.href = '../index.html'; // Redirigir al inicio
            });

            // Crear el botón para recargar la página (Volver a jugar)
            const reloadButton = document.createElement('button');
            reloadButton.textContent = 'Play Again!';
            reloadButton.classList.add('boton');
            reloadButton.addEventListener('click', function() {
                location.reload(); // Recargar la página actual
            });

            // Añadir los botones después de leyenda
            leyenda.parentNode.appendChild(homeButton);
            leyenda.parentNode.appendChild(reloadButton);
        }
    }
    

    // Función para realizar una búsqueda de personajes
async function buscarPersonajes(query) {
    try {
        const response = await fetch(`http://0.0.0.0:65090/search?query=${encodeURIComponent(query.toLowerCase())}`);
        if (!response.ok) {
            throw new Error('No se pudo obtener la respuesta del servidor.');
        }

        const data = await response.json(); // Leer la respuesta como JSON

        // Filtrar los personajes ya seleccionados
        const filteredData = data.filter(character => !charactersSelected.includes(character.name));

        // Renderizar resultados
        renderizarResultados(filteredData);

    } catch (error) {
        console.error('Error al obtener datos:', error);
        mostrarMensaje('Error al obtener datos. Inténtalo de nuevo más tarde.');
    }
}

// Función para seleccionar un personaje
async function seleccionarPersonaje(characterName) {
    try {
        // Realizar la búsqueda del personaje por nombre completo
        const response = await fetch(`http://0.0.0.0:65090/search?query=${encodeURIComponent(characterName)}`);
        if (!response.ok) {
            throw new Error('No se pudo obtener la respuesta del servidor.');
        }
        const data = await response.json(); // Leer la respuesta como JSON

        if (data.length === 0) {
            throw new Error('No se encontró el personaje.');
        }

        const characterData = data[0]; // Asegurarse de obtener el primer elemento

        // Mostrar los datos del personaje seleccionado en la consola (simulado)
        console.log('Datos del personaje seleccionado:', characterData);

        // Vaciar el contenido del input
        limpiarResultados();

        // Añadir el personaje seleccionado al array
        charactersSelected.push(characterName);

        // Mostrar los datos del personaje en la tabla
        mostrarDatosEnTabla(characterData);
        resultDiv.style.left = '12em';
        resultDiv.style.top = '13.1em';

    } catch (error) {
        console.error('Error al seleccionar personaje:', error);
        console.error('Personaje:', characterName);
    }
}

// Función para renderizar los resultados de búsqueda
function renderizarResultados(data) {
    if (data.length === 0) {
        mostrarMensaje('No hay ningún personaje.');
    } else {
        resultDiv.style.display = 'flex'; // Asegúrate de que el div de resultados esté visible
        resultDiv.innerHTML = ''; // Limpiar el contenido previo

        data.forEach(character => {
            const characterName = character.name;

            // Verificar si el personaje ya ha sido seleccionado
            if (charactersSelected.includes(characterName)) {
                return; // Salir de la iteración actual si ya ha sido seleccionado
            }

            const characterNameLower = characterName.toLowerCase().replace(/\s+/g, '');
            const characterImage = `../images/characters/${characterNameLower}.png`;

            // Crear el contenedor de resultados para cada personaje
            const resultContainer = document.createElement('div');
            resultContainer.classList.add('results_container');

            // Crear la imagen del personaje
            const characterImg = document.createElement('img');
            characterImg.classList.add('results_img');
            characterImg.src = characterImage;
            characterImg.alt = characterName;

            // Crear el nombre del personaje
            const characterNameElement = document.createElement('p');
            characterNameElement.classList.add('results_name');
            characterNameElement.textContent = characterName;

            // Añadir evento de clic al contenedor de resultados
            resultContainer.addEventListener('click', async function(event) {
                event.stopPropagation(); // Detener la propagación del evento para evitar que active el formulario
                await seleccionarPersonaje(characterName); // Cambio aquí: pasar el nombre del personaje en lugar de la ID
            });

            // Añadir la imagen y el nombre al contenedor de resultados
            resultContainer.appendChild(characterImg);
            resultContainer.appendChild(characterNameElement);

            // Añadir el contenedor de resultados al div principal de resultados
            resultDiv.appendChild(resultContainer);
        });
    }
}

// Escuchar el evento de input en el campo de búsqueda
searchInput.addEventListener('input', function() {
    const inputValue = searchInput.value.trim().replace(/[^a-zA-Z]/g, ''); // Validar y limpiar el valor de entrada

    if (inputValue) {
        buscarPersonajes(inputValue);
    } else {
        limpiarResultados();
    }
});

// Evitar el envío del formulario al presionar Enter
searchInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
    }
});

});
