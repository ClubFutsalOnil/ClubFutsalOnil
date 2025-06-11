<script>
  // ==== SLIDESHOW DEL BANNER ====
  document.addEventListener("DOMContentLoaded", () => {
    const slides = document.querySelectorAll('.slide');
    let current = 0;

    if (slides.length > 0) {
      slides[current].classList.add('active');

      setInterval(() => {
        slides[current].classList.remove('active');
        current = (current + 1) % slides.length;
        slides[current].classList.add('active');
      }, 4000);
    }

    // ==== FILTRO POR CATEGORÍA ====
    const categoriaSelect = document.getElementById("categoria-select");

    if (categoriaSelect) {
      categoriaSelect.addEventListener("change", function () {
        const selectedCategory = this.value;
        const partidos = document.querySelectorAll(".partido-card");

        partidos.forEach(partido => {
          const categoria = partido.getAttribute("data-categoria");
          partido.style.display =
            !selectedCategory || categoria === selectedCategory ? "block" : "none";
        });
      });
    } else {
      console.warn("No se encontró el filtro de categorías");
    }
  });
</script>
