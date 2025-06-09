fetch('resultados.csv')
    .then(response => response.text())
    .then(data => {
        const rows = data.trim().split('\n').map(row => row.split(',').map(cell => cell.trim()));
        const tbody = document.getElementById("results-body");
        const categorySelect = document.getElementById("categoria-select");

        // Saltamos encabezado
        const matches = rows.slice(1).filter(row => row.length >= 6 && row[0] !== '');

        // Guardamos globalmente
        allMatches = matches;

        // Extraer categorías únicas
        const categories = [...new Set(allMatches.map(match => match[5]))];

        categories.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat;
            option.textContent = cat;
            categorySelect.appendChild(option);
        });

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

        displayMatches(allMatches);

        categorySelect.addEventListener("change", function () {
            const selectedCategory = this.value;
            const filtered = selectedCategory
                ? allMatches.filter(match => match[5] === selectedCategory)
                : allMatches;
            displayMatches(filtered);
        });
    })
    .catch(error => {
        console.error("Error al cargar CSV:", error);
    });