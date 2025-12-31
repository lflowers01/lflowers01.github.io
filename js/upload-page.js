const API_URL = 'http://localhost:3001';

document.addEventListener('DOMContentLoaded', async () => {
  const uploadForm = document.getElementById('uploadForm');
  const messageDiv = document.getElementById('message');
  const imagesListDiv = document.getElementById('imagesList');
  const imageCountSpan = document.getElementById('imageCount');
  
  let draggedElement = null;

  // Check if server is running
  const checkServer = async () => {
    try {
      const response = await fetch(`${API_URL}/api/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  // Load existing carousel images
  const loadImages = async () => {
    try {
      const serverRunning = await checkServer();
      if (!serverRunning) {
        imagesListDiv.innerHTML = `
          <div style="background: #ffe6e6; padding: 15px; border-radius: 4px; color: #c33;">
            <strong>⚠️ Upload server is not running!</strong>
            <p>Open a new terminal and run:</p>
            <code style="background: #333; color: #0f0; padding: 8px; display: block; margin-top: 10px; border-radius: 3px;">npm run upload-server</code>
            <p style="margin-top: 10px; font-size: 12px;">The dev server (npm run dev) and upload server must run in separate terminals.</p>
          </div>
        `;
        return;
      }

      const response = await fetch(`${API_URL}/api/carousel`);
      if (!response.ok) throw new Error('Failed to load images');
      
      const images = await response.json();
      
      imageCountSpan.textContent = images.length;
      imagesListDiv.innerHTML = '';
      
      if (images.length === 0) {
        imagesListDiv.innerHTML = '<p>No carousel images yet. Upload one to get started!</p>';
        return;
      }

      images.forEach((image, index) => {
        const imageDiv = document.createElement('div');
        imageDiv.className = 'image-item';
        imageDiv.draggable = true;
        imageDiv.dataset.id = image.id;
        imageDiv.dataset.index = index;
        
        imageDiv.innerHTML = `
          <img src="/assets/carousel/${image.filename}" alt="${image.description}" />
          <div class="image-info">
            <div class="image-description">${image.description}</div>
            <div style="font-size: 11px; color: gray;">Uploaded: ${new Date(image.uploadedAt).toLocaleDateString()}</div>
          </div>
          <div class="image-controls">
            <button class="edit-btn" type="button">✎ Edit</button>
            <button class="delete-btn" type="button">✕ Delete</button>
          </div>
        `;
        
        // Edit button
        const editBtn = imageDiv.querySelector('.edit-btn');
        editBtn.addEventListener('click', async (e) => {
          e.preventDefault();
          const password = prompt('Enter password to edit:');
          if (password) {
            const newDescription = prompt('Enter new description:', image.description);
            if (newDescription !== null && newDescription !== image.description) {
              image.description = newDescription;
              const allImages = Array.from(imagesListDiv.querySelectorAll('[data-id]')).map(el => {
                const id = el.dataset.id;
                const img = images.find(i => i.id === id);
                return img;
              });
              await saveReorder(allImages, password);
              loadImages();
            }
          }
        });
        
        // Delete button
        const deleteBtn = imageDiv.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', async (e) => {
          e.preventDefault();
          if (confirm(`Delete "${image.description}"?`)) {
            const password = prompt('Enter password to delete:');
            if (password) {
              await deleteImage(image.id, password);
            }
          }
        });

        // Drag and drop handlers
        imageDiv.addEventListener('dragstart', (e) => {
          draggedElement = imageDiv;
          imageDiv.classList.add('dragging');
          e.dataTransfer.effectAllowed = 'move';
        });

        imageDiv.addEventListener('dragend', () => {
          imageDiv.classList.remove('dragging');
          document.querySelectorAll('.image-item').forEach(item => {
            item.classList.remove('drag-over');
          });
          draggedElement = null;
        });

        imageDiv.addEventListener('dragover', (e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          if (imageDiv !== draggedElement) {
            imageDiv.classList.add('drag-over');
          }
        });

        imageDiv.addEventListener('dragleave', () => {
          imageDiv.classList.remove('drag-over');
        });

        imageDiv.addEventListener('drop', async (e) => {
          e.preventDefault();
          imageDiv.classList.remove('drag-over');
          
          if (draggedElement && draggedElement !== imageDiv) {
            // Swap positions
            const allItems = Array.from(imagesListDiv.querySelectorAll('.image-item'));
            const draggedIndex = allItems.indexOf(draggedElement);
            const targetIndex = allItems.indexOf(imageDiv);
            
            // Reorder in UI
            if (draggedIndex < targetIndex) {
              imageDiv.parentNode.insertBefore(draggedElement, imageDiv.nextSibling);
            } else {
              imageDiv.parentNode.insertBefore(draggedElement, imageDiv);
            }

            // Save new order to server
            const newOrder = Array.from(imagesListDiv.querySelectorAll('.image-item')).map(item => item.dataset.id);
            const password = prompt('Enter password to confirm reorder:');
            if (password) {
              await saveReorder(newOrder, password);
            } else {
              // Reload if user cancels
              loadImages();
            }
          }
        });

        imagesListDiv.appendChild(imageDiv);
      });
    } catch (error) {
      console.error('Error loading images:', error);
      imagesListDiv.innerHTML = '<p style="color: red;">Error loading images. Make sure the upload server is running!</p>';
    }
  };

  // Delete image
  const deleteImage = async (imageId, password) => {
    try {
      const response = await fetch(`${API_URL}/api/delete/${imageId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const result = await response.json();

      if (response.ok) {
        showMessage('Image deleted successfully!', 'success');
        loadImages();
      } else {
        showMessage(result.error || 'Failed to delete image', 'error');
      }
    } catch (error) {
      showMessage('Error deleting image: ' + error.message, 'error');
    }
  };

  // Save reorder
  const saveReorder = async (newOrder, password) => {
    try {
      const response = await fetch(`${API_URL}/api/reorder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newOrder, password })
      });

      const result = await response.json();

      if (response.ok) {
        showMessage('Images reordered successfully!', 'success');
        await loadImages();
      } else {
        showMessage(result.error || 'Failed to reorder images', 'error');
      }
    } catch (error) {
      showMessage('Error reordering images: ' + error.message, 'error');
    }
  };

  // Show message
  const showMessage = (text, type) => {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    setTimeout(() => {
      messageDiv.className = 'message';
    }, 4000);
  };

  // Handle form submission
  uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const password = document.getElementById('password').value;
    const imageInput = document.getElementById('image');
    const description = document.getElementById('description').value;

    if (!imageInput.files.length) {
      showMessage('Please select an image', 'error');
      return;
    }

    // Check if server is running
    const serverRunning = await checkServer();
    if (!serverRunning) {
      showMessage('Upload server is not running. Run: npm run upload-server in a new terminal', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('image', imageInput.files[0]);
    formData.append('password', password);
    formData.append('description', description);

    try {
      const response = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        showMessage('Image uploaded and optimized successfully!', 'success');
        uploadForm.reset();
        loadImages();
      } else {
        showMessage(result.error || 'Upload failed', 'error');
      }
    } catch (error) {
      showMessage('Error uploading image: ' + error.message, 'error');
    }
  });

  // Initial load
  loadImages();
});