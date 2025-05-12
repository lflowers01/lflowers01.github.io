document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded");
  let currentIndex = 0;
  const images = document.querySelectorAll(".carousel-image");
  const prevButton = document.querySelector(".prev");
  const nextButton = document.querySelector(".next");
  const description = document.querySelector(".carousel-description");
  const counter = document.querySelector(".carousel-counter"); // Counter element

  function updateCarousel(index) {
    images.forEach((img, i) => {
      img.classList.remove("active");
      if (i === index) {
        img.classList.add("active");
        description.textContent = img.alt; // Set description to the alt of the active image
      }
    });
    counter.textContent = `${index + 1}/${images.length}`; // Update the counter
  }

  prevButton.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateCarousel(currentIndex);
  });

  nextButton.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % images.length;
    updateCarousel(currentIndex);
  });

  // Add click event listener to open images in full screen
  images.forEach((img) => {
    img.addEventListener("click", () => {
      if (img.requestFullscreen) {
        img.requestFullscreen();
      } else if (img.webkitRequestFullscreen) {
        img.webkitRequestFullscreen(); // For Safari
      } else if (img.msRequestFullscreen) {
        img.msRequestFullscreen(); // For IE/Edge
      }
    });
  });

  updateCarousel(currentIndex); // Initialize the carousel
});
