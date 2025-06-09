// Variables globales
let allMatches = [];

// Cargar datos del CSV
fetch('resultados.csv')
    .then(response => response.text())
    .then(data => {
        const rows = data.split("\n").map(row => row.split(","));
        const tbody = document.getElementById("results-body");
        const categorySelect = document.getElementById("categoria-select");

        // Saltamos encabezado
        const matches = rows.slice(1).filter(row => row.length >= 6);

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
        document.getElementById("results-body").innerHTML = "<td colspan='3'>Error al cargar resultados.csv</td>";
        console.error("Error al cargar el CSV:", error);
    });