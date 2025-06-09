// Filtrar partidos por categoría
const categoriaSelect = document.getElementById("categoria-select");

if (categoriaSelect) {
    categoriaSelect.addEventListener("change", function () {
        const selectedCategory = this.value;

        const partidos = document.querySelectorAll(".partido-card");

        partidos.forEach(partido => {
            const categoria = partido.getAttribute("data-categoria");
            if (!selectedCategory || categoria === selectedCategory) {
                partido.style.display = "block";
            } else {
                partido.style.display = "none";
            }
        });
    });
} else {
    console.warn("No se encontró el filtro de categorías");
}