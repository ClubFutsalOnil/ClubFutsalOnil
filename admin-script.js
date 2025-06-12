// admin-script.js

// --- Element References ---
const loginContainer = document.getElementById('login-container');
const adminDashboard = document.getElementById('admin-dashboard');
const loginForm = document.getElementById('loginForm');
const passwordInput = document.getElementById('password');
const loginMessage = document.getElementById('login-message');
const logoutButton = document.getElementById('logoutButton');

const resultForm = document.getElementById('resultForm');
const resultIdInput = document.getElementById('resultId');

const homeTeamNameInput = document.getElementById('homeTeamNameInput');
const awayTeamNameInput = document.getElementById('awayTeamNameInput');

const selectedHomeShield = document.getElementById('selectedHomeShield');
const selectedAwayShield = document.getElementById('selectedAwayShield');
const displayedHomeTeamName = document.getElementById('displayedHomeTeamName');
const displayedAwayTeamName = document.getElementById('displayedAwayTeamName');

const homeShieldHidden = document.getElementById('homeShield');    // Hidden input for shield path
const awayShieldHidden = document.getElementById('awayShield');    // Hidden input for shield path
const homeTeamHidden = document.getElementById('homeTeam');        // Hidden input for team name
const awayTeamHidden = document.getElementById('awayTeam');        // Hidden input for team name

const competitionInput = document.getElementById('competition');
const categoryInput = document.getElementById('category');
const dateInput = document.getElementById('date');
const homeScoreInput = document.getElementById('homeScore');
const awayScoreInput = document.getElementById('awayScore');
const saveButton = document.getElementById('saveResultButton'); // Usar el ID correcto del botón
const cancelButton = document.getElementById('cancelButton');

const resultsTableBody = document.querySelector('.admin-results-table tbody'); // Selector más específico
const adminCategoryFilter = document.getElementById('adminCategoryFilter'); // Filtro de la tabla
const clearAllResultsButton = document.getElementById('clearAllResults'); // Botón de limpiar todo

const selectHomeShieldButton = document.getElementById('selectHomeShieldButton');
const selectAwayShieldButton = document.getElementById('selectAwayShieldButton');
const shieldGridContainer = document.getElementById('shield-grid-container');
const selectShieldModal = document.getElementById('selectShieldModal');
const closeModalButton = document.querySelector('.close-modal-button');

// --- Mapeo de nombres de equipos a sus URLs de escudo ---
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
    // ¡Añade aquí todos tus escudos con sus nombres y rutas correctas!
};

let currentShieldSelectionInput; // Para saber qué campo (homeShieldHidden o awayShieldHidden) se está actualizando

// --- Login Logic ---
if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const CORRECT_PASSWORD = 'admin';

        if (passwordInput.value === CORRECT_PASSWORD) {
            localStorage.setItem('isAdminLoggedIn', 'true');
            loginContainer.style.display = 'none';
            adminDashboard.style.display = 'block';
            populateShieldGrid(); // Carga la rejilla de escudos
            renderResults(); // Carga los resultados de la tabla
            resetFormShields(); // Asegúrate de que los previews se inicialicen correctamente
        } else {
            loginMessage.textContent = 'Contraseña incorrecta.';
            loginMessage.style.color = 'red';
        }
    });
}

// --- Logout Logic ---
if (logoutButton) {
    logoutButton.addEventListener('click', function() {
        localStorage.removeItem('isAdminLoggedIn');
        loginContainer.style.display = 'block';
        adminDashboard.style.display = 'none';
        loginMessage.textContent = ''; // Limpiar mensaje de login
        passwordInput.value = ''; // Limpiar campo de contraseña
    });
}

// --- Helper function to update team preview elements ---
function updateTeamPreview(isHomeTeam, teamName, shieldPath = '') {
    const shieldImg = isHomeTeam ? selectedHomeShield : selectedAwayShield;
    const teamNameDisplay = isHomeTeam ? displayedHomeTeamName : displayedAwayTeamName;
    const shieldHiddenInput = isHomeTeam ? homeShieldHidden : awayShieldHidden;
    const teamNameTextInput = isHomeTeam ? homeTeamNameInput : awayTeamNameInput;
    const teamNameHiddenInput = isHomeTeam ? homeTeamHidden : awayTeamHidden; // Reference to the hidden team name input

    if (shieldPath) {
        shieldImg.src = shieldPath;
        shieldImg.classList.remove('no-shield-placeholder');
        shieldImg.alt = `Escudo ${teamName}`;
    } else {
        shieldImg.src = '';
        shieldImg.classList.add('no-shield-placeholder');
        shieldImg.alt = 'Sin Escudo';
    }
    teamNameDisplay.textContent = teamName || (isHomeTeam ? 'Selecciona Equipo Local' : 'Selecciona Equipo Visitante');
    shieldHiddenInput.value = shieldPath;
    teamNameTextInput.value = teamName; // Keep text input updated with the name
    teamNameHiddenInput.value = teamName; // Crucial: Update hidden input for team name as well
}

// --- Form Logic: Save Result ---
if (resultForm) {
    resultForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const id = resultIdInput.value || Date.now().toString();
        const homeTeam = homeTeamNameInput.value.trim(); // Get from text input
        const awayTeam = awayTeamNameInput.value.trim(); // Get from text input
        const competition = competitionInput.value.trim();
        const category = categoryInput.value.trim();
        const date = dateInput.value;
        const homeScore = parseInt(homeScoreInput.value, 10);
        const awayScore = parseInt(awayScoreInput.value, 10);
        const homeShield = homeShieldHidden.value; // Get from hidden input
        const awayShield = awayShieldHidden.value; // Get from hidden input

        if (!homeTeam || !awayTeam || isNaN(homeScore) || isNaN(awayScore) || !competition || !category || !date) {
            alert('Por favor, rellena todos los campos obligatorios y asegúrate de que las puntuaciones son números.');
            return;
        }

        const newResult = { id, homeTeam, awayTeam, homeScore, awayScore, competition, category, date, homeShield, awayShield };

        let results = JSON.parse(localStorage.getItem('matchResults')) || [];
        const existingIndex = results.findIndex(r => r.id === id);

        if (existingIndex > -1) {
            results[existingIndex] = newResult; // Update existing result
        } else {
            results.push(newResult); // Add new result
        }

        localStorage.setItem('matchResults', JSON.stringify(results));
        resultForm.reset();
        resetFormShields(); // Resetea las previsualizaciones de escudo
        renderResults();
        resultIdInput.value = ''; // Clear ID after saving
    });
}

// --- Form Logic: Cancel Button ---
if (cancelButton) {
    cancelButton.addEventListener('click', function() {
        resultForm.reset();
        resultIdInput.value = '';
        resetFormShields(); // Resetea las previsualizaciones de escudo
    });
}

// --- Shield Selection Logic ---
function populateShieldGrid() {
    if (!shieldGridContainer) return;
    shieldGridContainer.innerHTML = ''; // Limpia el contenedor antes de añadir nuevos escudos

    // Añadir la opción "Sin Escudo"
    const noShieldItem = document.createElement('div');
    noShieldItem.classList.add('shield-item', 'no-shield-option');
    noShieldItem.innerHTML = '<span>Sin Escudo</span>';
    noShieldItem.addEventListener('click', () => selectShield('', '')); // Ruta vacía y nombre vacío para "Sin Escudo"
    shieldGridContainer.appendChild(noShieldItem);

    // Añadir los escudos de los equipos
    for (const teamName in teamShields) {
        const shieldPath = teamShields[teamName];
        const shieldItem = document.createElement('div');
        shieldItem.classList.add('shield-item');
        shieldItem.innerHTML = `<img src="${shieldPath}" alt="${teamName}"><span>${teamName}</span>`;
        shieldItem.addEventListener('click', () => selectShield(shieldPath, teamName));
        shieldGridContainer.appendChild(shieldItem);
    }
}

// Función para manejar la selección de un escudo desde la rejilla
function selectShield(shieldPath, teamName) {
    if (currentShieldSelectionInput) {
        const isHomeTeam = (currentShieldSelectionInput === homeShieldHidden);
        updateTeamPreview(isHomeTeam, teamName, shieldPath);
        // Cerrar el modal
        if (selectShieldModal) {
            selectShieldModal.style.display = 'none';
        }
    }
}

// Restablecer las previsualizaciones de escudo al estado inicial
function resetFormShields() {
    updateTeamPreview(true, ''); // Resetea equipo local
    updateTeamPreview(false, ''); // Resetea equipo visitante
}

// --- Event Listeners para los botones de selección de escudo ---
if (selectHomeShieldButton) {
    selectHomeShieldButton.addEventListener('click', () => {
        currentShieldSelectionInput = homeShieldHidden; // Asigna el input oculto de home
        if (selectShieldModal) selectShieldModal.style.display = 'block';
    });
}

if (selectAwayShieldButton) {
    selectAwayShieldButton.addEventListener('click', () => {
        currentShieldSelectionInput = awayShieldHidden; // Asigna el input oculto de away
        if (selectShieldModal) selectShieldModal.style.display = 'block';
    });
}

if (closeModalButton) {
    closeModalButton.addEventListener('click', () => {
        if (selectShieldModal) selectShieldModal.style.display = 'none';
    });
}

// Cerrar modal al presionar ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' || event.keyCode === 27) {
        if (selectShieldModal && selectShieldModal.style.display === 'block') {
            selectShieldModal.style.display = 'none';
        }
    }
});


// Manejo del input manual del nombre del equipo:
// Si el usuario escribe un nombre, el escudo se restablece a "Sin Escudo" o busca coincidencia.
homeTeamNameInput.addEventListener('input', function() {
    const inputValue = this.value.trim();
    let shieldPath = '';
    // Intenta encontrar el escudo si el nombre coincide con uno conocido
    if (teamShields[inputValue]) {
        shieldPath = teamShields[inputValue];
    }
    updateTeamPreview(true, inputValue, shieldPath);
});

awayTeamNameInput.addEventListener('input', function() {
    const inputValue = this.value.trim();
    let shieldPath = '';
    // Intenta encontrar el escudo si el nombre coincide con uno conocido
    if (teamShields[inputValue]) {
        shieldPath = teamShields[inputValue];
    }
    updateTeamPreview(false, inputValue, shieldPath);
});


// --- Table Rendering Logic ---
function renderResults() {
    if (!resultsTableBody) return;
    resultsTableBody.innerHTML = '';

    const results = JSON.parse(localStorage.getItem('matchResults')) || [];
    const filterValue = adminCategoryFilter ? adminCategoryFilter.value : 'all';

    const filteredResults = results.filter(result => {
        return filterValue === 'all' || result.competition === filterValue;
    });

    filteredResults.forEach(result => {
        const row = document.createElement('tr');
        row.dataset.id = result.id;

        // Determinar qué escudo mostrar (guardado o placeholder)
        // Usa result.homeShield directamente ya que es lo que guardamos en localStorage
        const homeShieldSrc = result.homeShield;
        const awayShieldSrc = result.awayShield;

        const homeShieldContent = homeShieldSrc
            ? `<img src="${homeShieldSrc}" alt="Escudo ${result.homeTeam}" class="shield-img">`
            : `<div class="no-shield-placeholder-table">S/E</div>`;

        const awayShieldContent = awayShieldSrc
            ? `<img src="${awayShieldSrc}" alt="Escudo ${result.awayTeam}" class="shield-img">`
            : `<div class="no-shield-placeholder-table">S/E</div>`;

        row.innerHTML = `
            <td>${result.date}</td>
            <td>${result.competition}</td>
            <td>${result.category}</td>
            <td class="team-cell">
                ${homeShieldContent}
                <span class="team-name">${result.homeTeam}</span>
            </td>
            <td class="score">${result.homeScore} - ${result.awayScore}</td>
            <td class="team-cell">
                ${awayShieldContent}
                <span class="team-name">${result.awayTeam}</span>
            </td>
            <td class="action-buttons">
                <button class="admin-button edit-button" onclick="loadResultForEdit('${result.id}')">Editar</button>
                <button class="admin-button delete-button" onclick="deleteResult('${result.id}')">Eliminar</button>
            </td>
        `;
        resultsTableBody.appendChild(row);
    });
}

// --- Filter Results Logic ---
if (adminCategoryFilter) {
    adminCategoryFilter.addEventListener('change', renderResults);
}

// --- Clear All Results Logic ---
if (clearAllResultsButton) {
    clearAllResultsButton.addEventListener('click', function() {
        if (confirm('¿Estás seguro de que quieres ELIMINAR TODOS los resultados? Esta acción no se puede deshacer.')) {
            localStorage.removeItem('matchResults');
            renderResults();
            alert('Todos los resultados han sido eliminados.');
        }
    });
}


// --- Edit Result Logic ---
function loadResultForEdit(id) {
    const results = JSON.parse(localStorage.getItem('matchResults')) || [];
    const resultToEdit = results.find(r => r.id === id);

    if (resultToEdit) {
        resultIdInput.value = resultToEdit.id;
        competitionInput.value = resultToEdit.competition;
        categoryInput.value = resultToEdit.category;
        dateInput.value = resultToEdit.date;
        homeScoreInput.value = resultToEdit.homeScore;
        awayScoreInput.value = resultToEdit.awayScore;

        // Cargar escudo y nombre del equipo local usando la función unificada
        updateTeamPreview(true, resultToEdit.homeTeam, resultToEdit.homeShield);

        // Cargar escudo y nombre del equipo visitante usando la función unificada
        updateTeamPreview(false, resultToEdit.awayTeam, resultToEdit.awayShield);
    }
}

// --- Delete Result Logic ---
function deleteResult(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este resultado?')) {
        let results = JSON.parse(localStorage.getItem('matchResults')) || [];
        results = results.filter(r => r.id !== id);
        localStorage.setItem('matchResults', JSON.stringify(results));
        renderResults();
    }
}

// Exponer funciones globales para onclick en la tabla (alternativa a delegación de eventos)
window.loadResultForEdit = loadResultForEdit;
window.deleteResult = deleteResult;

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('isAdminLoggedIn') === 'true') {
        loginContainer.style.display = 'none';
        adminDashboard.style.display = 'block';
        populateShieldGrid(); // Importante: Carga la rejilla ANTES de renderResults
        renderResults();
    } else {
        loginContainer.style.display = 'block';
        adminDashboard.style.display = 'none';
    }
    resetFormShields(); // Asegura que los previews se inicialicen correctamente al cargar la página
});