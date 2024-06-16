import '../sass/random_character.scss';

const form = document.querySelector('.input');
const searchInput = document.querySelector('.input_text');
const resultDiv = document.querySelector('.result');

// Escuchar el evento de input en el campo de búsqueda
searchInput.addEventListener('input', async function() {
    const inputValue = searchInput.value.trim().toLowerCase(); // Obtener el valor del campo de búsqueda y convertirlo a minúsculas
    
    // Mostrar el div de resultados si hay algún valor en el campo de búsqueda
    if (inputValue) {
        resultDiv.style.display = 'inline';
    } else {
        resultDiv.style.display = 'none';
        resultDiv.innerHTML = ''; // Limpiar resultados si el campo está vacío
        return;
    }

    try {
        const response = await fetch(`./script/search.py?query=${encodeURIComponent(inputValue)}`);
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
                const characterName = character[1]; // Suponiendo que el nombre está en la segunda columna
                const characterImage = `../../images/characters/${character[2]}`; // Suponiendo que la imagen está en la tercera columna

                const characterElement = document.createElement('div');
                characterElement.classList.add('character');
                characterElement.innerHTML = `
                    <img src="${characterImage}" alt="${characterName}" />
                    <p>${characterName}</p>
                `;
                resultDiv.appendChild(characterElement);
            });
        }
    } catch (error) {
        console.error('Error al obtener datos:', error);
        resultDiv.textContent = 'Error al obtener datos. Inténtalo de nuevo más tarde.';
    }
});

// Evitar el envío del formulario
form.addEventListener('submit', function(event) {
    event.preventDefault();
});

