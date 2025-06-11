document.addEventListener("DOMContentLoaded", function () {
    // Código existente para el slider de imágenes
    const slides = document.querySelectorAll(".hero-section .slide");
    let currentSlide = 0;
    function showNextSlide() {
        slides[currentSlide].classList.remove("active");
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add("active");
    }
    setInterval(showNextSlide, 5000);

    // Código existente para la carga de datos de la API de resultados
    let allMatches = [];
    fetch('https://script.google.com/macros/s/AKfycbye4VbAEloIRDGzDhpqSLNxxnnJK3-g78y-dUJ8tcOaWJOPxBf805GuTYa8FMdQvg8/exec')
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById("results-body");
            const categorySelect = document.getElementById("categoria-select");

            allMatches = data;
            const categories = [...new Set(allMatches.map(match => match["Categoría"]).filter(cat => cat && cat.trim() !== ""))];

            categorySelect.innerHTML = '<option value="">Todas</option>';
            categories.forEach(cat => {
                const option = document.createElement("option");
                option.value = cat;
                option.textContent = cat;
                categorySelect.appendChild(option);
            });

            function displayMatches(filteredMatches) {
                tbody.innerHTML = "";
                if (filteredMatches.length === 0) {
                    tbody.innerHTML = "<tr><td colspan='3'>No hay partidos en esta categoría</td></tr>";
                    return;
                }

                filteredMatches.forEach(match => {
                    const hora = match["Hora"] || match["Resultado"] || "N/A";
                    const escudoLocal = match["Escudo Local"] || "";
                    const escudoVisitante = match["Escudo Visitante"] || "";
                    const tr = document.createElement("tr");
                    tr.innerHTML = `
                        <td>${escudoLocal ? `<img src="${escudoLocal}" alt="${match["Local"]}" class="shield-img">` : ""}${match["Local"] || "N/D"}</td>
                        <td>${hora}</td>
                        <td>${escudoVisitante ? `<img src="${escudoVisitante}" alt="${match["Visitante"]}" class="shield-img">` : ""}${match["Visitante"] || "N/D"}</td>
                    `;
                    tbody.appendChild(tr);
                });
            }

            displayMatches(allMatches);
            categorySelect.addEventListener("change", function () {
                const selectedCategory = this.value;
                const filtered = selectedCategory ? allMatches.filter(match => match["Categoría"] === selectedCategory) : allMatches;
                displayMatches(filtered);
            });
        })
        .catch(error => {
            console.error("Error al cargar la API:", error);
            // Asegúrate de que results-body exista si ocurre un error
            const tbody = document.getElementById("results-body");
            if (tbody) {
                tbody.innerHTML = "<tr><td colspan='3'>Error al cargar los datos</td></tr>";
            }
        });

    // Lógica para el menú móvil (nuevo añadido)
    const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });
    }
});