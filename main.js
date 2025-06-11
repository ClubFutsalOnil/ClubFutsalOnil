// main.js

document.addEventListener('DOMContentLoaded', () => {
    // ... (Tu código existente para el header, carrusel y menú móvil) ...

    // --- Lógica para Cargar Resultados desde localStorage ---
    const resultsTableBody = document.querySelector('.results-table tbody');
    const categorySelect = document.getElementById('category-select'); // Si tienes un filtro por categoría en la vista pública

    // Mapeo de nombres de equipos a sus URLs de escudo (para usar en los resultados por defecto)
    const teamShieldsPublic = {
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
        // Asegúrate de que este mapeo sea idéntico al de admin-script.js
    };
    const DEFAULT_SHIELD_PATH_PUBLIC = 'assets/images/escudos/default.png'; // Ruta a un escudo por defecto para la vista pública

    function loadAndRenderResults() {
        const storedResults = localStorage.getItem('clubResults');
        let results = [];
        if (storedResults) {
            results = JSON.parse(storedResults);
        } else {
            // Si no hay resultados guardados, cargamos algunos por defecto
            results = [
                // Añade la propiedad 'category' a tus resultados de ejemplo
                { id: '1', date: '2025-05-25', competition: 'liga', category: 'Senior A', homeTeam: 'Alfas', homeScore: 3, awayTeam: 'Biar', awayScore: 1, homeShield: teamShieldsPublic['Alfas'], awayShield: teamShieldsPublic['Biar'] },
                { id: '2', date: '2025-05-18', competition: 'copa', category: 'Juvenil', homeTeam: 'Aspe', homeScore: 0, awayTeam: 'Castalla', awayScore: 2, homeShield: teamShieldsPublic['Aspe'], awayShield: teamShieldsPublic['Castalla'] },
                { id: '3', date: '2025-05-10', competition: 'champions', category: 'Femenino', homeTeam: 'Dinamita', homeScore: 2, awayTeam: 'Hercules', awayScore: 2, homeShield: teamShieldsPublic['Dinamita'], awayShield: teamShieldsPublic['Hercules'] },
                { id: '4', date: '2025-05-03', competition: 'liga', category: 'Senior B', homeTeam: 'Hoya', homeScore: 1, awayTeam: 'Ibi', awayScore: 4, homeShield: teamShieldsPublic['Hoya'], awayShield: teamShieldsPublic['Ibi'] },
                { id: '5', date: '2025-04-28', competition: 'liga', category: 'Cadete', homeTeam: 'Mutxamel', homeScore: 1, awayTeam: 'Onil', awayScore: 0, homeShield: teamShieldsPublic['Mutxamel'], awayShield: teamShieldsPublic['Onil'] },
                { id: '6', date: '2025-04-20', competition: 'copa', category: 'Infantil', homeTeam: 'Serelles', homeScore: 1, awayTeam: 'Alfas', awayScore: 3, homeShield: teamShieldsPublic['Serelles'], awayShield: teamShieldsPublic['Alfas'] },
            ];
            // Guardar estos resultados por defecto en localStorage para que el admin los vea
            localStorage.setItem('clubResults', JSON.stringify(results));
        }
        renderPublicResults(results);
    }

    function renderPublicResults(resultsToRender) {
        resultsTableBody.innerHTML = ''; // Limpiar la tabla existente

        // Ordenar resultados por fecha, más reciente primero
        resultsToRender.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Limitar a los 10 últimos resultados si hay muchos
        const recentResults = resultsToRender.slice(0, 10);

        if (recentResults.length === 0) {
            resultsTableBody.innerHTML = '<tr><td colspan="5">No hay resultados disponibles en este momento.</td></tr>';
            return;
        }

        recentResults.forEach(result => {
            const row = document.createElement('tr');
            row.classList.add('result-row');
            row.setAttribute('data-category', result.competition); // Asumiendo que el filtro público es por competición

            // Usa el escudo guardado o el por defecto para la visualización pública
            const displayHomeShield = result.homeShield || DEFAULT_SHIELD_PATH_PUBLIC;
            const displayAwayShield = result.awayShield || DEFAULT_SHIELD_PATH_PUBLIC;

            row.innerHTML = `
                <td>${result.date}</td>
                <td><span class="competition-tag ${result.competition}">${result.competition.charAt(0).toUpperCase() + result.competition.slice(1)}</span><br><small>${result.category || ''}</small></td>
                <td class="team-cell">
                    <img src="${displayHomeShield}" alt="Escudo ${result.homeTeam}" class="shield-img">
                    <span class="team-name">${result.homeTeam}</span>
                </td>
                <td class="score">${result.homeScore} - ${result.awayScore}</td>
                <td class="team-cell">
                    <img src="${displayAwayShield}" alt="Escudo ${result.awayTeam}" class="shield-img">
                    <span class="team-name">${result.awayTeam}</span>
                </td>
            `;
            resultsTableBody.appendChild(row);
        });
    }

    // ... (El resto de tu código de main.js, incluyendo el filtro de categoría si lo tienes) ...
});