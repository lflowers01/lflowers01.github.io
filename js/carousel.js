document.addEventListener("DOMContentLoaded", async function () {
  console.log("DOM loaded");
  
  const carouselDiv = document.getElementById("carousel");
  const prevButton = document.querySelector(".prev");
  const nextButton = document.querySelector(".next");
  const description = document.querySelector(".carousel-description");
  const counter = document.querySelector(".carousel-counter");
  const imageCarousel = document.querySelector(".image-carousel");
  
  let currentIndex = 0;
  let images = [];

  // Load carousel metadata and create image elements
  const loadCarouselImages = async () => {
    try {
      // Try multiple paths to find the metadata file
      let metadata = null;
      const paths = [
        '/carousel-metadata.json',
        './carousel-metadata.json',
        '../carousel-metadata.json'
      ];

      for (const path of paths) {
        try {
          const response = await fetch(path);
          if (response.ok) {
            metadata = await response.json();
            console.log(`Loaded metadata from: ${path}`);
            break;
          }
        } catch (e) {
          // Try next path
        }
      }

      if (!metadata || !Array.isArray(metadata) || metadata.length === 0) {
        console.log('No carousel images found');
        carouselDiv.innerHTML = '<p style="padding: 20px; text-align: center; color: gray;">No carousel images yet.</p>';
        // Still need to show carousel controls even if no images
        images = [];
        return;
      }

      // Create image elements from metadata
      carouselDiv.innerHTML = '';
      metadata.forEach((imageData, index) => {
        const img = document.createElement('img');
        img.src = `./assets/carousel/${imageData.filename}`;
        img.alt = imageData.description;
        img.className = 'carousel-image';
        if (index === 0) {
          img.classList.add('active');
        }
        img.loading = index === 0 ? 'eager' : 'lazy';
        carouselDiv.appendChild(img);
      });

      images = carouselDiv.querySelectorAll(".carousel-image");
      console.log(`Loaded ${images.length} carousel images`);
      updateCarouselSize();
      updateCarousel(currentIndex);
    } catch (error) {
      console.error('Error loading carousel metadata:', error);
      carouselDiv.innerHTML = '<p style="padding: 20px; text-align: center; color: red;">Error loading carousel images. Check console.</p>';
    }
  };

  // Calculate dimensions based on number of images
  const updateCarouselSize = () => {
    const imageCount = images.length;
    
    if (imageCount === 0) return;
    
    // Base dimensions (4:3 aspect ratio)
    const baseWidth = 200;
    const baseHeight = 150;
    
    // Scale based on number of images (more images = larger carousel)
    const scaleFactor = Math.max(0.8, Math.min(2, imageCount / 5));
    const width = baseWidth * scaleFactor;
    const height = baseHeight * scaleFactor;
    
    // Update image dimensions
    images.forEach((img) => {
      img.style.width = width + 'px';
      img.style.height = height + 'px';
      img.style.objectFit = 'cover';
    });
    
    // Update carousel legend/fieldset
    if (imageCarousel) {
      imageCarousel.style.width = width + 'px';
    }
  };

  function updateCarousel(index) {
    if (images.length === 0) return;
    
    images.forEach((img, i) => {
      img.classList.remove("active");
      if (i === index) {
        img.classList.add("active");
        description.textContent = img.alt;
      }
    });
    counter.textContent = `${index + 1}/${images.length}`;
  }

  prevButton.addEventListener("click", () => {
    if (images.length === 0) return;
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateCarousel(currentIndex);
  });

  nextButton.addEventListener("click", () => {
    if (images.length === 0) return;
    currentIndex = (currentIndex + 1) % images.length;
    updateCarousel(currentIndex);
  });

  // Add click event listener to open images in full screen
  carouselDiv.addEventListener("click", (e) => {
    if (e.target.classList.contains("carousel-image")) {
      const img = e.target;
      if (img.requestFullscreen) {
        img.requestFullscreen();
      } else if (img.webkitRequestFullscreen) {
        img.webkitRequestFullscreen();
      } else if (img.msRequestFullscreen) {
        img.msRequestFullscreen();
      }
    }
  });

  // Load carousel images on page load
  await loadCarouselImages();
});
