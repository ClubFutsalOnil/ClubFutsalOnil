// Variables globales
let allMatches = [];

// Cargar datos del CSV
fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vQfwS96EPYPBFaHJc80g98zJ8HpMnLjTEf0JDzRCE4tdfpf6EYAMMPoEQ7kKvXLc9xEnoxMLBTFdear/pub?gid=1137432932&single=true&output=csv')
    .then(response => response.text())
    .then(data => {
        // Debug: Ver contenido completo
        console.log("Raw Data:", data);

        // Dividir por líneas y limpiar comillas internas
        const rows = data
            .trim()
            .split('\n')
            .map(row => 
                row
                .replace(/^"(.*)"$/, '$1') // Elimina comillas generales
                .split('","') // Divide evitando comas dentro de celdas
                .map(cell => cell.replace(/^"(.*)"$/, '$1').trim()) // Limpieza final
            );

        const tbody = document.getElementById("results-body");
        const categorySelect = document.getElementById("categoria-select");

        // Saltamos encabezado y filtramos filas válidas (con 6 columnas y no vacías)
        const matches = rows
            .slice(1)
            .filter(row => row.length === 6 && row[0] !== '');

        // Debug: Ver solo las filas útiles
        console.log("Valid Matches:", matches);

        // Guardamos globalmente
        allMatches = matches;

        // Extraer categorías únicas y rellenar el dropdown
        const categories = [...new Set(allMatches.map(match => match[5]))];

        categories.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat;
            option.textContent = cat;
            categorySelect.appendChild(option);
        });

        // Función para mostrar partidos
        function displayMatches(filteredMatches) {
            tbody.innerHTML = "";
            if (filteredMatches.length === 0) {
                const tr = document.createElement("tr");
                tr.innerHTML = "<td colspan='3'>No hay partidos en esta categoría</td>";
                tbody.appendChild(tr);
                return;
            }

            filteredMatches.forEach(match => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td><img src="${match[1]}" alt="${match[0]}" class="shield-img">${match[0]}</td>
                    <td>${match[2]}</td>
                    <td><img src="${match[4]}" alt="${match[3]}" class="shield-img">${match[3]}</td>
                `;
                tbody.appendChild(tr);
            });
        }

        // Mostrar todos al cargar
        displayMatches(allMatches);

        // Evento al cambiar categoría
        categorySelect.addEventListener("change", function () {
            const selectedCategory = this.value;
            const filtered = selectedCategory
                ? allMatches.filter(match => match[5] === selectedCategory)
                : allMatches;
            displayMatches(filtered);
        });
    })
    .catch(error => {
        console.error("Error al cargar el CSV:", error);
        const tbody = document.getElementById("results-body");
        if (tbody) {
            tbody.innerHTML = "<tr><td colspan='3'>Error al cargar resultados.csv</td></tr>";
        }
    });