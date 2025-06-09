// Variables globales
let allMatches = [];

// Cargar datos del CSV
fetch('/resultados.csv') // ← Ruta absoluta para GitHub Pages
    .then(response => response.text())
    .then(data => {
        // Debug: Ver contenido completo
        console.log("Raw Data:", data);

        // Dividir por líneas y limpiar celdas
        const rows = data.trim().split("\n")
            .map(row => row.trim().split(",").map(cell => cell.trim()));

        // Debug: Ver todas las filas parseadas
        console.log("Parsed Rows:", rows);

        const tbody = document.getElementById("results-body");
        const categorySelect = document.getElementById("categoria-select");

        // Saltamos encabezado y filtramos filas completas
        const matches = rows
            .slice(1)
            .filter(row => row.length === 6 && row[0] !== '');

        // Debug: Ver solo las filas útiles
        console.log("Valid Matches:", matches);

        // Guardamos los datos globalmente para filtrar después
        allMatches = matches;

        // Extraer categorías únicas y rellenar el dropdown
        const categories = [...new Set(matches.map(match => match[5]))];

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
            const tr = document.createElement("tr");
            tr.innerHTML = "<td colspan='3'>Error al cargar resultados.csv</td>";
            tbody.innerHTML = "";
            tbody.appendChild(tr);
        }
    });