const form = document.querySelector('.input');
const searchInput = document.querySelector('.input_text');
const resultDiv = document.querySelector('.result');

// Escuchar el evento de input en el campo de búsqueda
searchInput.addEventListener('input', async function() {
    const inputValue = searchInput.value.trim().toLowerCase(); // Obtener el valor del campo de búsqueda y convertirlo a minúsculas
    
    // Mostrar el div de resultados si hay algún valor en el campo de búsqueda
    if (inputValue) {
        resultDiv.style.display = 'flex';
    } else {
        resultDiv.style.display = 'none';
        resultDiv.innerHTML = ''; // Limpiar resultados si el campo está vacío
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/search?query=${encodeURIComponent(inputValue)}`);
        if (!response.ok) {
            throw new Error('No se pudo obtener la respuesta del servidor.');
        }

        const data = await response.json(); // Leer la respuesta como JSON

        // Limpiar el div de resultados antes de mostrar nuevos resultados
        resultDiv.innerHTML = '';

        if (data.length === 0) {
            resultDiv.textContent = 'No hay ningún personaje.';
        } else {
            data.forEach(character => {
                const characterId = character[0]; // Supongamos que el ID del personaje está en la primera posición
                const characterName = character[1];
                const characterNameLower = characterName.toLowerCase();
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

                    await seleccionarPersonaje(characterId);
                });

                // Añadir la imagen y el nombre al contenedor de resultados
                resultContainer.appendChild(characterImg);
                resultContainer.appendChild(characterNameElement);

                // Añadir el contenedor de resultados al div principal de resultados
                resultDiv.appendChild(resultContainer);
            });
        }
    } catch (error) {
        console.error('Error al obtener datos:', error);
        resultDiv.textContent = 'Error al obtener datos. Inténtalo de nuevo más tarde.';
    }
});

// Función para seleccionar un personaje
async function seleccionarPersonaje(characterId) {
    try {
        // Mostrar el ID del personaje en la consola
        console.log('ID del personaje seleccionado:', characterId);

        const response = await fetch('http://localhost:5000/select-character', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ character_id: characterId })
        });

        if (!response.ok) {
            throw new Error('No se pudo seleccionar el personaje.');
        }

        // Limpiar el campo de búsqueda y ocultar los resultados
        searchInput.value = '';
        resultDiv.style.display = 'none';
        resultDiv.innerHTML = '';

        // Mostrar mensaje de éxito
        alert('Personaje seleccionado correctamente.');
    } catch (error) {
        console.error('Error al seleccionar personaje:', error);
        alert('Error al seleccionar personaje. Inténtalo de nuevo más tarde.');
    }
}

// Evitar el envío del formulario
form.addEventListener('submit', function(event) {
    event.preventDefault();
});
