// admin-script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos de la UI de Login ---
    const loginContainer = document.getElementById('login-container');
    const adminDashboard = document.getElementById('admin-dashboard');
    const loginForm = document.getElementById('loginForm');
    const passwordInput = document.getElementById('password');
    const loginMessage = document.getElementById('login-message');
    const logoutButton = document.getElementById('logoutButton');

    // --- Configuración de la Contraseña (¡IMPORTANTE!) ---
    const CORRECT_PASSWORD = 'adminclub2025'; // ¡CÁMBIALA A UNA CONTRASEÑA SEGURA!

    const SESSION_KEY = 'clubAdminLoggedIn'; // Clave para la sesión en localStorage

    // --- Base de datos de escudos (¡ACTUALIZADO CON TUS EQUIPOS Y RUTA CORRECTA!) ---
    // Mapeo de nombres de equipos a sus URLs de escudo
    // Asegúrate de que estas rutas sean correctas y existan en tu proyecto en 'assets/images/escudos/'
    const teamShields = {
        'Alfas': 'assets/images/escudos/alfas.png',
        'Aspe': 'assets/images/escudos/aspe.png',
        'Biar': 'assets/images/escudos/biar.png',
        'Blas': 'assets/images/escudos/blas.png',
        'Castalla': 'assets/images/escudos/castalla.png',
        'Dinamita': 'assets/images/escudos/dinamita.png',
        'Hercules': 'assets/images/escudos/hercules.png',
        'Hoya': 'assets/images/escudos/hoya.png',
        'Ibi': 'assets/images/escudos/ibi.png',
        'Mutxamel': 'assets/images/escudos/mutxamel.png',
        'Onil': 'assets/images/escudos/onil.png',
        'Serelles': 'assets/images/escudos/serelles.png',
        // Añade cualquier otro equipo que puedas tener en el futuro
    };
    const DEFAULT_SHIELD_PATH = 'assets/images/escudos/default.png'; // Ruta a un escudo por defecto si no se encuentra
    // Asegúrate de crear un archivo 'default.png' en 'assets/images/escudos/' si no existe.

    // --- Funciones de autenticación ---
    function checkLoginStatus() {
        if (localStorage.getItem(SESSION_KEY) === 'true') {
            showAdminDashboard();
        } else {
            showLoginForm();
        }
    }

    function showAdminDashboard() {
        loginContainer.style.display = 'none';
        adminDashboard.style.display = 'block';
        loadResults(); // Cargar y renderizar resultados una vez logueado
    }

    function showLoginForm() {
        loginContainer.style.display = 'block';
        adminDashboard.style.display = 'none';
        loginMessage.textContent = ''; // Limpiar mensaje de login
        passwordInput.value = ''; // Limpiar campo de contraseña
    }

    // Manejar el envío del formulario de login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const enteredPassword = passwordInput.value;

        if (enteredPassword === CORRECT_PASSWORD) {
            localStorage.setItem(SESSION_KEY, 'true'); // Marcar como logueado
            showAdminDashboard();
        } else {
            loginMessage.textContent = 'Contraseña incorrecta. Inténtalo de nuevo.';
            passwordInput.value = '';
        }
    });

    // Manejar el cierre de sesión
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem(SESSION_KEY); // Eliminar la marca de logueado
        showLoginForm();
        alert('Sesión cerrada.');
    });

    // --- Lógica de administración de resultados ---
    const resultForm = document.getElementById('resultForm');
    const resultIdInput = document.getElementById('resultId');
    const dateInput = document.getElementById('date');
    const competitionInput = document.getElementById('competition');
    const categoryInput = document.getElementById('category'); // NUEVO: para la categoría
    const homeTeamInput = document.getElementById('homeTeam'); // Ahora hidden
    const homeScoreInput = document.getElementById('homeScore');
    const awayTeamInput = document.getElementById('awayTeam'); // Ahora hidden
    const awayScoreInput = document.getElementById('awayScore');
    const homeShieldInput = document.getElementById('homeShield'); // Ahora hidden
    const awayShieldInput = document.getElementById('awayShield'); // Ahora hidden

    // Elementos para mostrar la selección de escudo
    const selectedHomeShieldImg = document.getElementById('selectedHomeShield');
    const selectedHomeTeamNameSpan = document.getElementById('selectedHomeTeamName');
    const selectedAwayShieldImg = document.getElementById('selectedAwayShield');
    const selectedAwayTeamNameSpan = document.getElementById('selectedAwayTeamName');

    const resultsTableBody = document.getElementById('resultsTableBody');
    const saveResultButton = document.getElementById('saveResultButton');
    const cancelEditButton = document.getElementById('cancelEditButton');
    const adminCategoryFilter = document.getElementById('adminCategoryFilter'); // Este es para el filtro de tabla
    const clearAllResultsButton = document.getElementById('clearAllResults');

    let results = [];

    // --- Lógica del Modal de Selección de Escudos ---
    const shieldSelectionModal = document.getElementById('shieldSelectionModal');
    const closeButton = shieldSelectionModal.querySelector('.close-button');
    const shieldListDiv = document.getElementById('shieldList');
    let currentTargetInput = null; // Para saber si estamos seleccionando para home o away

    // Abre el modal
    document.querySelectorAll('.select-team-button').forEach(button => {
        button.addEventListener('click', (e) => {
            currentTargetInput = e.currentTarget.dataset.target; // 'home' o 'away'
            renderShieldsInModal();
            shieldSelectionModal.style.display = 'flex'; // Usar flex para centrar
        });
    });

    // Cierra el modal
    closeButton.addEventListener('click', () => {
        shieldSelectionModal.style.display = 'none';
    });

    // Cierra el modal si se hace clic fuera de su contenido
    window.addEventListener('click', (e) => {
        if (e.target === shieldSelectionModal) {
            shieldSelectionModal.style.display = 'none';
        }
    });

    // Renderiza los escudos en el modal
    function renderShieldsInModal() {
        shieldListDiv.innerHTML = ''; // Limpiar la lista existente
        for (const teamName in teamShields) {
            const shieldUrl = teamShields[teamName];
            const shieldItem = document.createElement('div');
            shieldItem.classList.add('shield-item');
            shieldItem.innerHTML = `
                <img src="${shieldUrl}" alt="Escudo ${teamName}">
                <span>${teamName}</span>
            `;
            shieldItem.setAttribute('data-team-name', teamName);
            shieldItem.setAttribute('data-shield-url', shieldUrl);

            // Resaltar el escudo si ya está seleccionado para el equipo actual
            let currentSelectedTeamName;
            if (currentTargetInput === 'home') {
                currentSelectedTeamName = homeTeamInput.value;
            } else if (currentTargetInput === 'away') {
                currentSelectedTeamName = awayTeamInput.value;
            }

            if (currentSelectedTeamName === teamName) {
                shieldItem.classList.add('selected');
            }

            shieldItem.addEventListener('click', (e) => {
                // Eliminar la clase 'selected' de los demás
                shieldListDiv.querySelectorAll('.shield-item.selected').forEach(item => {
                    item.classList.remove('selected');
                });
                // Añadir 'selected' al clicado
                e.currentTarget.classList.add('selected');

                const selectedTeamName = e.currentTarget.dataset.teamName;
                const selectedShieldUrl = e.currentTarget.dataset.shieldUrl;

                if (currentTargetInput === 'home') {
                    homeTeamInput.value = selectedTeamName;
                    homeShieldInput.value = selectedShieldUrl;
                    selectedHomeTeamNameSpan.textContent = selectedTeamName;
                    selectedHomeShieldImg.src = selectedShieldUrl;
                } else if (currentTargetInput === 'away') {
                    awayTeamInput.value = selectedTeamName;
                    awayShieldInput.value = selectedShieldUrl;
                    selectedAwayTeamNameSpan.textContent = selectedTeamName;
                    selectedAwayShieldImg.src = selectedShieldUrl;
                }
                shieldSelectionModal.style.display = 'none'; // Cierra el modal después de la selección
            });
            shieldListDiv.appendChild(shieldItem);
        }
    }


    // Cargar resultados desde localStorage
    function loadResults() {
        const storedResults = localStorage.getItem('clubResults');
        if (storedResults) {
            results = JSON.parse(storedResults);
            renderResultsTable(results);
        } else {
            results = []; // Si no hay resultados guardados, inicializa un array vacío
            renderResultsTable(results);
        }
    }

    // Guardar resultados en localStorage
    function saveResults() {
        localStorage.setItem('clubResults', JSON.stringify(results));
    }

    // Renderizar la tabla de resultados en el panel de administración
    function renderResultsTable(filteredResults) {
        resultsTableBody.innerHTML = ''; // Limpiar tabla
        if (filteredResults.length === 0) {
            resultsTableBody.innerHTML = '<tr><td colspan="6">No hay resultados que mostrar.</td></tr>';
            return;
        }

        filteredResults.sort((a, b) => new Date(b.date) - new Date(a.date)); // Ordenar por fecha, más reciente primero

        filteredResults.forEach(result => {
            const row = document.createElement('tr');
            row.setAttribute('data-id', result.id);
            // Asegúrate de que 'competition' y 'category' se usen correctamente aquí
            row.setAttribute('data-competition', result.competition);
            row.setAttribute('data-category', result.category || 'N/A'); // Usar 'category' para filtro si existe

            row.classList.add('result-row');

            // Usamos el escudo guardado o el por defecto si no hay uno definido
            const displayHomeShield = result.homeShield || DEFAULT_SHIELD_PATH;
            const displayAwayShield = result.awayShield || DEFAULT_SHIELD_PATH;

            row.innerHTML = `
                <td>${result.date}</td>
                <td><span class="competition-tag ${result.competition}">${result.competition.charAt(0).toUpperCase() + result.competition.slice(1)}</span><br><small>${result.category || ''}</small></td>
                <td>
                    <img src="${displayHomeShield}" alt="Escudo ${result.homeTeam}" class="shield-img admin-shield-img">
                    ${result.homeTeam}
                </td>
                <td>${result.homeScore} - ${result.awayScore}</td>
                <td>
                    <img src="${displayAwayShield}" alt="Escudo ${result.awayTeam}" class="shield-img admin-shield-img">
                    ${result.awayTeam}
                </td>
                <td class="actions-cell">
                    <button class="edit-button" data-id="${result.id}" aria-label="Editar resultado"><i class="fas fa-edit"></i></button>
                    <button class="delete-button" data-id="${result.id}" aria-label="Eliminar resultado"><i class="fas fa-trash-alt"></i></button>
                </td>
            `;
            resultsTableBody.appendChild(row);
        });
        addTableEventListeners();
    }

    // Añadir event listeners a los botones de editar y eliminar
    function addTableEventListeners() {
        resultsTableBody.querySelectorAll('.edit-button').forEach(button => {
            button.onclick = (e) => editResult(e.currentTarget.dataset.id);
        });
        resultsTableBody.querySelectorAll('.delete-button').forEach(button => {
            button.onclick = (e) => deleteResult(e.currentTarget.dataset.id);
        });
    }

    // Manejar el envío del formulario (Añadir o Editar)
    resultForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validar que ambos equipos estén seleccionados
        if (!homeTeamInput.value || !awayTeamInput.value) {
            alert('Por favor, selecciona tanto el equipo local como el visitante.');
            return; // Detiene el envío del formulario
        }
        // Validar que la categoría no esté vacía
        if (!categoryInput.value.trim()) {
            alert('Por favor, ingresa la categoría del partido.');
            return;
        }

        const id = resultIdInput.value;
        const newResult = {
            id: id || Date.now().toString(),
            date: dateInput.value,
            competition: competitionInput.value,
            category: categoryInput.value.trim(), // Guardar la nueva categoría
            homeTeam: homeTeamInput.value,
            homeScore: parseInt(homeScoreInput.value),
            awayTeam: awayTeamInput.value,
            awayScore: parseInt(awayScoreInput.value),
            homeShield: homeShieldInput.value,
            awayShield: awayShieldInput.value,
        };

        if (id) {
            const index = results.findIndex(r => r.id === id);
            if (index !== -1) {
                results[index] = newResult;
            }
        } else {
            results.push(newResult);
        }

        saveResults();
        renderResultsTable(results);
        resultForm.reset(); // Limpiar el formulario
        resultIdInput.value = ''; // Limpiar el ID oculto
        saveResultButton.textContent = 'Guardar Resultado'; // Restaurar texto del botón
        cancelEditButton.style.display = 'none'; // Ocultar botón de cancelar
        resetTeamSelectionDisplay(); // Resetear la visualización de escudos seleccionados
        alert('Resultado guardado correctamente.');
    });

    // Cargar datos en el formulario para edición
    function editResult(id) {
        const resultToEdit = results.find(r => r.id === id);
        if (resultToEdit) {
            resultIdInput.value = resultToEdit.id;
            dateInput.value = resultToEdit.date;
            competitionInput.value = resultToEdit.competition;
            categoryInput.value = resultToEdit.category || ''; // Cargar categoría al editar
            homeScoreInput.value = resultToEdit.homeScore;
            awayScoreInput.value = resultToEdit.awayScore;

            // Rellenar los inputs hidden y actualizar la visualización para el equipo local
            homeTeamInput.value = resultToEdit.homeTeam;
            homeShieldInput.value = resultToEdit.homeShield;
            selectedHomeTeamNameSpan.textContent = resultToEdit.homeTeam;
            selectedHomeShieldImg.src = resultToEdit.homeShield || DEFAULT_SHIELD_PATH;

            // Rellenar los inputs hidden y actualizar la visualización para el equipo visitante
            awayTeamInput.value = resultToEdit.awayTeam;
            awayShieldInput.value = resultToEdit.awayShield;
            selectedAwayTeamNameSpan.textContent = resultToEdit.awayTeam;
            selectedAwayShieldImg.src = resultToEdit.awayShield || DEFAULT_SHIELD_PATH;

            saveResultButton.textContent = 'Actualizar Resultado';
            cancelEditButton.style.display = 'inline-block';
        }
    }

    // Función para resetear la visualización de los equipos seleccionados en el formulario
    function resetTeamSelectionDisplay() {
        homeTeamInput.value = '';
        homeShieldInput.value = '';
        selectedHomeTeamNameSpan.textContent = 'Selecciona Equipo Local';
        selectedHomeShieldImg.src = DEFAULT_SHIELD_PATH;

        awayTeamInput.value = '';
        awayShieldInput.value = '';
        selectedAwayTeamNameSpan.textContent = 'Selecciona Equipo Visitante';
        selectedAwayShieldImg.src = DEFAULT_SHIELD_PATH;
    }

    // Cancelar edición
    cancelEditButton.addEventListener('click', () => {
        resultForm.reset();
        resultIdInput.value = '';
        saveResultButton.textContent = 'Guardar Resultado';
        cancelEditButton.style.display = 'none';
        resetTeamSelectionDisplay(); // Resetear la visualización de escudos seleccionados
    });

    // Eliminar resultado
    function deleteResult(id) {
        if (confirm('¿Estás seguro de que quieres eliminar este resultado?')) {
            results = results.filter(r => r.id !== id);
            saveResults();
            renderResultsTable(results);
            alert('Resultado eliminado.');
        }
    }

    // Filtrar resultados en la tabla de administración
    adminCategoryFilter.addEventListener('change', (e) => {
        const selectedCategory = e.target.value;
        if (selectedCategory === 'all') {
            renderResultsTable(results);
        } else {
            // Asumiendo que el filtro es por 'competition' en la tabla
            const filtered = results.filter(result => result.competition === selectedCategory);
            renderResultsTable(filtered);
        }
    });

    // Limpiar todos los resultados
    clearAllResultsButton.addEventListener('click', () => {
        if (confirm('¡ADVERTENCIA! Esto eliminará TODOS los resultados permanentemente. ¿Estás seguro?')) {
            results = [];
            saveResults();
            renderResultsTable(results);
            alert('Todos los resultados han sido eliminados.');
        }
    });

    // --- Ejecutar la comprobación de login al cargar la página ---
    checkLoginStatus();
    // Asegurar que la visualización de equipos se inicialice con el default shield
    resetTeamSelectionDisplay();
});



const homeTeamNameInput = document.getElementById('homeTeamNameInput');
const awayTeamNameInput = document.getElementById('awayTeamNameInput');
const displayedHomeTeamName = document.getElementById('displayedHomeTeamName');
const displayedAwayTeamName = document.getElementById('displayedAwayTeamName');
const homeTeamHidden = document.getElementById('homeTeam'); // El input hidden que guarda el nombre final
const awayTeamHidden = document.getElementById('awayTeam');   // El input hidden que guarda el nombre final




