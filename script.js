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




// script.js - Slideshow automático para .banner

document.addEventListener("DOMContentLoaded", function () {
    const banner = document.querySelector(".banner");
    const staticImage = document.querySelector(".banner-image");

    // Si no hay imagen, salir
    if (!staticImage) return;

    // Rutas de las imágenes adicionales para el slideshow
    const slideImages = [
        "assets/images/bannerfutsal.jpg",
        "assets/images/photos/alevin/*.jpg",
        "assets/images/photos/prebenjamin/*.jpg"
        "assets/images/photos/senior/*.jpg"
    ];

    // Crear contenedor del slideshow
    const slideshow = document.createElement("div");
    slideshow.classList.add("slideshow");

    // Crear cada slide
    slideImages.forEach((src, index) => {
        const img = document.createElement("img");
        img.src = src;
        img.alt = "Banner Fútbol Sala";
        img.classList.add("slide");
        if (index === 0) img.classList.add("active"); // Mostrar la primera
        slideshow.appendChild(img);
    });

    // Reemplazar la imagen estática por el slideshow
    staticImage.replaceWith(slideshow);

    // Lógica del slideshow
    let currentSlide = 0;

    function showNextSlide() {
        const slides = document.querySelectorAll(".slide");
        slides[currentSlide].classList.remove("active");
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add("active");
    }

    // Cambia de imagen cada 5 segundos
    setInterval(showNextSlide, 5000);
});