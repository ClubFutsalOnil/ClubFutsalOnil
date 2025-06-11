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

const homeShieldHidden = document.getElementById('homeShield'); // Hidden input for shield path
const awayShieldHidden = document.getElementById('awayShield'); // Hidden input for shield path
const homeTeamHidden = document.getElementById('homeTeam');   // Hidden input for team name
const awayTeamHidden = document.getElementById('awayTeam');   // Hidden input for team name

const competitionInput = document.getElementById('competition');
const categoryInput = document.getElementById('category');
const dateInput = document.getElementById('date');
const homeScoreInput = document.getElementById('homeScore');
const awayScoreInput = document.getElementById('awayScore');
const saveResultButton = document.getElementById('saveResultButton');
const cancelEditButton = document.getElementById('cancelEditButton');

const resultsTableBody = document.getElementById('resultsTableBody');
const adminCategoryFilter = document.getElementById('adminCategoryFilter');
const clearAllResultsButton = document.getElementById('clearAllResults');

// Modal Elements
const shieldSelectionModal = document.getElementById('shieldSelectionModal');
const closeShieldModalButton = shieldSelectionModal.querySelector('.close-button');
const shieldList = document.getElementById('shieldList');
const selectTeamButtons = document.querySelectorAll('.select-team-button');

// --- Global Variables ---
const correctPassword = 'admin'; // Replace with a more secure method in a real app
let currentTeamTarget = ''; // 'home' or 'away'
const DEFAULT_SHIELD_PATH = 'assets/images/escudos/default.png';

console.log('Script admin-script.js cargado.'); // <-- AÑADIDO PARA DEPURACIÓN

// --- Functions ---

// Function to load shields
const shieldsData = [
    { name: 'Alfas', src: 'assets/images/escudos/alfas.png' },
    { name: 'Aspe', src: 'assets/images/escudos/aspe.png' },
    { name: 'Biar', src: 'assets/images/escudos/biar.png' },
    { name: 'Blas', src: 'assets/images/escudos/blas.png' },
    { name: 'Castalla', src: 'assets/images/escudos/castalla.png' },
    { name: 'Dinamita', src: 'assets/images/escudos/dinamita.png' },
    { name: 'Hercules', src: 'assets/images/escudos/hercules.png' },
    { name: 'Hoya', src: 'assets/images/escudos/hoya.png' },
    { name: 'Ibi', src: 'assets/images/escudos/ibi.png' },
    { name: 'Mutxamel', src: 'assets/images/escudos/mutxamel.png' },
    { name: 'Onil', src: 'assets/images/escudos/onil.png' },
    { name: 'Serelles', src: 'assets/images/escudos/serelles.png' },
    // Asegúrate de que 'default.png' también existe en la carpeta y su ruta es correcta si lo usas.
];

function loadShieldsIntoModal() {
    console.log('loadShieldsIntoModal() llamada. shieldsData:', shieldsData); // <-- AÑADIDO PARA DEPURACIÓN
    shieldList.innerHTML = ''; // Limpiar la lista existente
    if (shieldsData.length === 0) {
        console.warn('El array shieldsData está vacío. No se cargarán escudos.'); // <-- AÑADIDO PARA DEPURACIÓN
    }
    shieldsData.forEach(shield => {
        console.log('Intentando añadir escudo:', shield.name, 'con src:', shield.src); // <-- AÑADIDO PARA DEPURACIÓN
        const shieldItem = document.createElement('div');
        shieldItem.classList.add('shield-item');
        shieldItem.innerHTML = `
            <img src="${shield.src}" alt="${shield.name}">
            <span>${shield.name}</span>
        `;
        shieldItem.dataset.name = shield.name;
        shieldItem.dataset.src = shield.src;
        shieldList.appendChild(shieldItem);
    });
    console.log('Número de escudos añadidos al modal (children de shieldList):', shieldList.children.length); // <-- AÑADIDO PARA DEPURACIÓN
}

function openShieldSelectionModal(target) {
    currentTeamTarget = target;
    console.log('Abriendo modal para:', target); // <-- AÑADIDO PARA DEPURACIÓN
    shieldSelectionModal.style.display = 'flex';
    loadShieldsIntoModal(); // Ensure shields are loaded every time
    // Optional: Highlight current selected shield if any
    const currentShieldSrc = target === 'home' ? selectedHomeShield.src : selectedAwayShield.src;
    const shieldItems = shieldList.querySelectorAll('.shield-item');
    shieldItems.forEach(item => {
        if (item.dataset.src === currentShieldSrc) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });
}

function closeShieldSelectionModal() {
    console.log('Cerrando modal de selección de escudo.'); // <-- AÑADIDO PARA DEPURACIÓN
    shieldSelectionModal.style.display = 'none';
}

// Function to render results in the table (simplified)
function renderResults(filter = 'all') {
    const results = JSON.parse(localStorage.getItem('matchResults')) || [];
    resultsTableBody.innerHTML = ''; // Clear existing rows

    const filteredResults = results.filter(result => {
        return filter === 'all' || result.competition === filter;
    });

    filteredResults.forEach(result => {
        const row = resultsTableBody.insertRow();
        row.dataset.id = result.id; // Store ID for editing/deleting

        const formattedDate = new Date(result.date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });

        row.innerHTML = `
            <td>${formattedDate}</td>
            <td>${result.competition} (${result.category})</td>
            <td class="team-cell">
                <img src="${result.homeShield || DEFAULT_SHIELD_PATH}" alt="${result.homeTeam}" class="table-shield">
                ${result.homeTeam}
            </td>
            <td class="result-score">${result.homeScore} - ${result.awayScore}</td>
            <td class="team-cell">
                <img src="${result.awayShield || DEFAULT_SHIELD_PATH}" alt="${result.awayTeam}" class="table-shield">
                ${result.awayTeam}
            </td>
            <td class="actions-cell">
                <button class="edit-button" data-id="${result.id}" aria-label="Editar resultado"><i class="fas fa-edit"></i></button>
                <button class="delete-button" data-id="${result.id}" aria-label="Eliminar resultado"><i class="fas fa-trash-alt"></i></button>
            </td>
        `;
    });
    console.log('Resultados renderizados. Total:', results.length, 'Filtrados:', filteredResults.length); // <-- AÑADIDO PARA DEPURACIÓN
}

// Function to clear form
function clearForm() {
    console.log('Limpiando formulario.'); // <-- AÑADIDO PARA DEPURACIÓN
    resultIdInput.value = '';
    homeTeamNameInput.value = '';
    awayTeamInput.value = ''; // Assuming awayTeamInput is a text input for manual entry
    homeScoreInput.value = '';
    awayScoreInput.value = '';
    competitionInput.value = '';
    categoryInput.value = '';
    dateInput.value = '';

    // Reset displayed shields and names to default
    selectedHomeShield.src = DEFAULT_SHIELD_PATH;
    selectedAwayShield.src = DEFAULT_SHIELD_PATH;
    displayedHomeTeamName.textContent = 'Selecciona Equipo Local';
    displayedAwayTeamName.textContent = 'Selecciona Equipo Visitante';
    homeShieldHidden.value = DEFAULT_SHIELD_PATH;
    awayShieldHidden.value = DEFAULT_SHIELD_PATH;
    homeTeamHidden.value = ''; // Clear hidden team names
    awayTeamHidden.value = '';

    saveResultButton.textContent = 'Guardar Resultado';
    cancelEditButton.style.display = 'none';
}

// Function to load result for editing
function loadResultForEdit(id) {
    console.log('Cargando resultado para edición con ID:', id); // <-- AÑADIDO PARA DEPURACIÓN
    const results = JSON.parse(localStorage.getItem('matchResults')) || [];
    const resultToEdit = results.find(result => result.id == id);

    if (resultToEdit) {
        resultIdInput.value = resultToEdit.id;
        homeScoreInput.value = resultToEdit.homeScore;
        awayScoreInput.value = resultToEdit.awayScore;
        competitionInput.value = resultToEdit.competition;
        categoryInput.value = resultToEdit.category;
        dateInput.value = resultToEdit.date;

        // Load home team details
        selectedHomeShield.src = resultToEdit.homeShield || DEFAULT_SHIELD_PATH;
        displayedHomeTeamName.textContent = resultToEdit.homeTeam;
        homeTeamNameInput.value = resultToEdit.homeTeam; // Populate manual input
        homeShieldHidden.value = resultToEdit.homeShield || DEFAULT_SHIELD_PATH;
        homeTeamHidden.value = resultToEdit.homeTeam;

        // Load away team details
        selectedAwayShield.src = resultToEdit.awayShield || DEFAULT_SHIELD_PATH;
        displayedAwayTeamName.textContent = resultToEdit.awayTeam;
        awayTeamNameInput.value = resultToEdit.awayTeam; // Populate manual input
        awayShieldHidden.value = resultToEdit.awayShield || DEFAULT_SHIELD_PATH;
        awayTeamHidden.value = resultToEdit.awayTeam;

        saveResultButton.textContent = 'Actualizar Resultado';
        cancelEditButton.style.display = 'inline-block';
    } else {
        console.warn('No se encontró resultado para editar con ID:', id); // <-- AÑADIDO PARA DEPURACIÓN
    }
}

// --- Event Listeners ---

// Login Form Submission
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    console.log('Intento de login.'); // <-- AÑADIDO PARA DEPURACIÓN
    if (passwordInput.value === correctPassword) {
        loginContainer.style.display = 'none';
        adminDashboard.style.display = 'block';
        localStorage.setItem('isAdminLoggedIn', 'true');
        renderResults(); // Load results when logged in
        console.log('Login exitoso.'); // <-- AÑADIDO PARA DEPURACIÓN
    } else {
        loginMessage.textContent = 'Contraseña incorrecta.';
        console.log('Login fallido: Contraseña incorrecta.'); // <-- AÑADIDO PARA DEPURACIÓN
    }
});

// Logout Button
logoutButton.addEventListener('click', function() {
    console.log('Botón de logout clicado.'); // <-- AÑADIDO PARA DEPURACIÓN
    localStorage.removeItem('isAdminLoggedIn');
    loginContainer.style.display = 'block';
    adminDashboard.style.display = 'none';
    passwordInput.value = ''; // Clear password field
    loginMessage.textContent = ''; // Clear login message
    clearForm(); // Clear the form
});

// Form Submission (Add/Edit Result)
resultForm.addEventListener('submit', function(e) {
    e.preventDefault();
    console.log('Formulario de resultado enviado.'); // <-- AÑADIDO PARA DEPURACIÓN

    const id = resultIdInput.value || Date.now(); // Use existing ID or generate new
    
    // Determine final team name and shield based on user input or shield selection
    const finalHomeTeamName = homeTeamNameInput.value.trim() || displayedHomeTeamName.textContent;
    const finalHomeShield = homeShieldHidden.value; // This will hold shield path or default
    const finalAwayTeamName = awayTeamNameInput.value.trim() || displayedAwayTeamName.textContent;
    const finalAwayShield = awayShieldHidden.value; // This will hold shield path or default

    const newResult = {
        id: id,
        homeTeam: finalHomeTeamName,
        homeScore: parseInt(homeScoreInput.value),
        awayScore: parseInt(awayScoreInput.value),
        awayTeam: finalAwayTeamName,
        competition: competitionInput.value,
        category: categoryInput.value,
        date: dateInput.value,
        homeShield: finalHomeShield,
        awayShield: finalAwayShield,
    };

    let results = JSON.parse(localStorage.getItem('matchResults')) || [];

    if (resultIdInput.value) {
        // Edit existing result
        results = results.map(result => result.id == id ? newResult : result);
        console.log('Resultado actualizado:', newResult); // <-- AÑADIDO PARA DEPURACIÓN
    } else {
        // Add new result
        results.push(newResult);
        console.log('Nuevo resultado añadido:', newResult); // <-- AÑADIDO PARA DEPURACIÓN
    }

    localStorage.setItem('matchResults', JSON.stringify(results));
    renderResults(adminCategoryFilter.value);
    clearForm();
});

// Cancel Edit Button
cancelEditButton.addEventListener('click', clearForm);

// Event Delegation for Edit/Delete buttons in the table
resultsTableBody.addEventListener('click', function(e) {
    if (e.target.closest('.edit-button')) {
        const id = e.target.closest('.edit-button').dataset.id;
        console.log('Botón Editar clicado para ID:', id); // <-- AÑADIDO PARA DEPURACIÓN
        loadResultForEdit(id);
    } else if (e.target.closest('.delete-button')) {
        const id = e.target.closest('.delete-button').dataset.id;
        console.log('Botón Eliminar clicado para ID:', id); // <-- AÑADIDO PARA DEPURACIÓN
        if (confirm('¿Estás seguro de que quieres eliminar este resultado?')) {
            let results = JSON.parse(localStorage.getItem('matchResults')) || [];
            results = results.filter(result => result.id != id);
            localStorage.setItem('matchResults', JSON.stringify(results));
            renderResults(adminCategoryFilter.value);
            clearForm(); // Clear form just in case
            console.log('Resultado eliminado con ID:', id); // <-- AÑADIDO PARA DEPURACIÓN
        }
    }
});

// Filter by Category
adminCategoryFilter.addEventListener('change', function() {
    console.log('Filtro de categoría cambiado a:', this.value); // <-- AÑADIDO PARA DEPURACIÓN
    renderResults(this.value);
});

// Clear All Results
clearAllResultsButton.addEventListener('click', function() {
    console.log('Botón Borrar Todos los Resultados clicado.'); // <-- AÑADIDO PARA DEPURACIÓN
    if (confirm('¿Estás SEGURO de que quieres borrar TODOS los resultados? Esta acción es irreversible.')) {
        localStorage.removeItem('matchResults');
        renderResults();
        clearForm();
        console.log('Todos los resultados borrados.'); // <-- AÑADIDO PARA DEPURACIÓN
    }
});


// --- Modal Shield Selection Logic ---

// Event listener for opening the shield selection modal
selectTeamButtons.forEach(button => {
    button.addEventListener('click', function() {
        console.log('Botón "Seleccionar Escudo" clicado para:', this.dataset.target); // <-- AÑADIDO PARA DEPURACIÓN
        openShieldSelectionModal(this.dataset.target); // 'home' or 'away'
    });
});

// Event listener for selecting a shield in the modal
shieldList.addEventListener('click', function(event) {
    const shieldItem = event.target.closest('.shield-item');
    if (shieldItem) {
        console.log('Item de escudo clicado:', shieldItem.dataset.name); // <-- AÑADIDO PARA DEPURACIÓN
        // Remove 'selected' class from previously selected item
        const previouslySelected = shieldList.querySelector('.shield-item.selected');
        if (previouslySelected) {
            previouslySelected.classList.remove('selected');
        }
        // Add 'selected' class to the clicked item
        shieldItem.classList.add('selected');

        const selectedTeamName = shieldItem.dataset.name;
        const selectedShieldSrc = shieldItem.dataset.src;

        if (currentTeamTarget === 'home') {
            displayedHomeTeamName.textContent = selectedTeamName;
            selectedHomeShield.src = selectedShieldSrc;
            homeTeamNameInput.value = selectedTeamName; // Populate manual input with selected name
            homeShieldHidden.value = selectedShieldSrc; // Store shield path
            homeTeamHidden.value = selectedTeamName; // Store team name
            console.log('Escudo Home seleccionado:', selectedTeamName, selectedShieldSrc); // <-- AÑADIDO PARA DEPURACIÓN
        } else if (currentTeamTarget === 'away') {
            displayedAwayTeamName.textContent = selectedTeamName;
            selectedAwayShield.src = selectedShieldSrc;
            awayTeamNameInput.value = selectedTeamName; // Populate manual input with selected name
            awayShieldHidden.value = selectedShieldSrc; // Store shield path
            awayTeamHidden.value = selectedTeamName; // Store team name
            console.log('Escudo Away seleccionado:', selectedTeamName, selectedShieldSrc); // <-- AÑADIDO PARA DEPURACIÓN
        }
        closeShieldSelectionModal();
    }
});

// Event listener for closing the modal (X button)
closeShieldModalButton.addEventListener('click', closeShieldSelectionModal);

// Event listener for closing the modal by clicking outside
window.addEventListener('click', function(event) {
    if (event.target == shieldSelectionModal) {
        console.log('Clic fuera del modal detectado.'); // <-- AÑADIDO PARA DEPURACIÓN
        closeShieldSelectionModal();
    }
});

// --- Input Manual Logic ---
// When user types in the manual input, update the displayed name and set default shield
homeTeamNameInput.addEventListener('input', function() {
    const inputValue = this.value.trim();
    displayedHomeTeamName.textContent = inputValue || 'Selecciona Equipo Local';
    selectedHomeShield.src = DEFAULT_SHIELD_PATH;
    homeShieldHidden.value = DEFAULT_SHIELD_PATH;
    homeTeamHidden.value = inputValue; // Update hidden input for team name
    console.log('Input manual Home Team. Nombre:', inputValue, 'Escudo por defecto.'); // <-- AÑADIDO PARA DEPURACIÓN
});

awayTeamNameInput.addEventListener('input', function() {
    const inputValue = this.value.trim();
    displayedAwayTeamName.textContent = inputValue || 'Selecciona Equipo Visitante';
    selectedAwayShield.src = DEFAULT_SHIELD_PATH;
    awayShieldHidden.value = DEFAULT_SHIELD_PATH;
    awayTeamHidden.value = inputValue; // Update hidden input for team name
    console.log('Input manual Away Team. Nombre:', inputValue, 'Escudo por defecto.'); // <-- AÑADIDO PARA DEPURACIÓN
});


// --- Initial Load ---
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded disparado. Estado de login:', localStorage.getItem('isAdminLoggedIn')); // <-- AÑADIDO PARA DEPURACIÓN
    if (localStorage.getItem('isAdminLoggedIn') === 'true') {
        loginContainer.style.display = 'none';
        adminDashboard.style.display = 'block';
        renderResults(); // Load results if already logged in
    } else {
        loginContainer.style.display = 'block';
        adminDashboard.style.display = 'none';
    }
});