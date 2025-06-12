// main.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Lógica para el header, carrusel y menú móvil (Tu código existente) ---
    const slides = document.querySelectorAll(".hero-section .slide");
    let currentSlide = 0;

    function showNextSlide() {
        if (slides.length === 0) return; // Evita errores si no hay slides
        slides[currentSlide].classList.remove("active");
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add("active");
    }
    // Solo inicia el intervalo si hay slides
    if (slides.length > 0) {
        setInterval(showNextSlide, 5000);
    }

    const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener("click", () => {
            const isExpanded = navLinks.classList.toggle("active");
            mobileMenuToggle.setAttribute('aria-expanded', isExpanded); // Actualiza el estado ARIA
        });
    }

    // --- Lógica para Cargar Resultados desde localStorage o API ---
    const resultsTableBody = document.querySelector('.results-table tbody');
    const categorySelect = document.getElementById('category-select'); // Si tienes un filtro por categoría en la vista pública

    // Definir una ruta por defecto para escudos si no se encuentra ninguno
    // Si quieres que no se muestre nada, deja la cadena vacía.
    const DEFAULT_SHIELD_PLACEHOLDER = '<div class="no-shield-placeholder-table">S/E</div>'; // Placeholder para "Sin Escudo"

    // Función para renderizar los resultados en la tabla
    function renderPublicResults(resultsToDisplay) {
        if (!resultsTableBody) return; // Asegúrate de que el cuerpo de la tabla existe
        resultsTableBody.innerHTML = ''; // Limpia resultados anteriores

        if (resultsToDisplay.length === 0) {
            resultsTableBody.innerHTML = '<tr><td colspan="5">No hay resultados disponibles.</td></tr>';
            return;
        }

        resultsToDisplay.forEach(result => {
            const row = document.createElement('tr');
            row.classList.add('result-row');
            // 'data-category' para el filtro público, usa la competición (competition) o la categoría (category) según necesites filtrar
            row.setAttribute('data-category', result.competition || result.category || 'general');

            // Usa el escudo guardado o el placeholder si no hay
            const homeShieldContent = result.homeShield ? `<img src="${result.homeShield}" alt="Escudo ${result.homeTeam}" class="shield-img">` : DEFAULT_SHIELD_PLACEHOLDER;
            const awayShieldContent = result.awayShield ? `<img src="${result.awayShield}" alt="Escudo ${result.awayTeam}" class="shield-img">` : DEFAULT_SHIELD_PLACEHOLDER;

            row.innerHTML = `
                <td>${result.date}</td>
                <td>
                    <span class="competition-tag ${result.competition ? result.competition.toLowerCase().replace(/\s/g, '-') : 'default'}">
                        ${result.competition ? result.competition.charAt(0).toUpperCase() + result.competition.slice(1) : 'N/D'}
                    </span>
                    <br>
                    <small>${result.category || ''}</small>
                </td>
                <td class="team-cell">
                    ${homeShieldContent}
                    <span class="team-name">${result.homeTeam}</span>
                </td>
                <td class="score">${result.homeScore} - ${result.awayScore}</td>
                <td class="team-cell">
                    ${awayShieldContent}
                    <span class="team-name">${result.awayTeam}</span>
                </td>
            `;
            resultsTableBody.appendChild(row);
        });
    }

    // Lógica principal para cargar resultados
    let allMatchesData = []; // Variable global para almacenar todos los partidos cargados

    function loadAndDisplayResults() {
        // 1. Intentar cargar desde localStorage
        const localStorageResults = JSON.parse(localStorage.getItem('matchResults'));

        if (localStorageResults && localStorageResults.length > 0) {
            // Si hay resultados en localStorage, úsalos
            allMatchesData = localStorageResults;
            console.log('Resultados cargados desde localStorage.');
            renderPublicResults(allMatchesData);
            updateCategoryFilter(allMatchesData); // Actualizar filtro de categorías con los resultados de localStorage
        } else {
            // 2. Si no hay resultados en localStorage, cargar desde la API
            console.log('No hay resultados en localStorage, intentando cargar desde API...');
            fetch('https://script.google.com/macros/s/AKfycbye4VbAEloIRDGzDhpqSLNxxnnJK3-g78y-dUJ8tcOaWJOPxBf805GuTYa8FMdQvg8/exec')
                .then(response => response.json())
                .then(data => {
                    // Adaptar los datos de la API para que coincidan con la estructura de localStorage
                    allMatchesData = data.map(apiResult => {
                        const scoreParts = apiResult["Resultado"] ? apiResult["Resultado"].split('-').map(s => parseInt(s.trim(), 10)) : [0, 0];
                        // Puedes añadir una lógica aquí para mapear nombres de equipos de la API a rutas de escudo si es necesario
                        // Por ejemplo, usando un objeto similar a `teamShields` en admin-script.js
                        return {
                            id: apiResult["id"] || Date.now().toString(),
                            homeTeam: apiResult["Local"] || 'N/D',
                            awayTeam: apiResult["Visitante"] || 'N/D',
                            homeScore: scoreParts[0],
                            awayScore: scoreParts[1],
                            competition: apiResult["Competición"] || 'N/D',
                            category: apiResult["Categoría"] || 'N/D',
                            date: apiResult["Fecha"] || 'N/D',
                            homeShield: apiResult["EscudoLocal"] || '', // Asume que la API puede tener un campo "EscudoLocal"
                            awayShield: apiResult["EscudoVisitante"] || '' // Asume que la API puede tener un campo "EscudoVisitante"
                        };
                    });
                    console.log('Resultados cargados desde API.');
                    renderPublicResults(allMatchesData);
                    updateCategoryFilter(allMatchesData); // Actualizar filtro de categorías con los resultados de la API
                })
                .catch(error => {
                    console.error("Error al cargar la API:", error);
                    if (resultsTableBody) {
                        resultsTableBody.innerHTML = "<tr><td colspan='5'>Error al cargar los datos.</td></tr>";
                    }
                });
        }
    }

    // Función para poblar el filtro de categoría (para la vista pública)
    function updateCategoryFilter(matches) {
        if (!categorySelect) return;
        const categories = [...new Set(matches.map(match => match.competition).filter(comp => comp && comp.trim() !== ""))];
        categorySelect.innerHTML = '<option value="all">Todas las Competiciones</option>'; // Opción para mostrar todo
        categories.sort().forEach(comp => {
            const option = document.createElement("option");
            option.value = comp;
            option.textContent = comp;
            categorySelect.appendChild(option);
        });
    }

    // Event Listener para el filtro de categoría (vista pública)
    if (categorySelect) {
        categorySelect.addEventListener("change", function () {
            const selectedCompetition = this.value;
            // Filtra sobre los datos que estén actualmente en `allMatchesData` (ya sean de localStorage o API)
            const filtered = selectedCompetition === 'all'
                ? allMatchesData
                : allMatchesData.filter(match => match.competition === selectedCompetition);
            renderPublicResults(filtered);
        });
    }

    // Cargar y mostrar los resultados al cargar la página
    loadAndDisplayResults();
});