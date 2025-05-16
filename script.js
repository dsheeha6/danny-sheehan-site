document.addEventListener('DOMContentLoaded', function() {
    // Initialize image loading
    initializeImageLoading();
    
    // Accordion functionality
    document.querySelectorAll('.accordion-button').forEach(button => {
        button.addEventListener('click', () => {
            // Toggle active state for the button
            button.classList.toggle('active');
            
            // Get the content section
            const content = button.nextElementSibling;
            
            // Toggle the content visibility
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
                content.classList.remove('active');
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
                content.classList.add('active');
            }
        });
    });

    // Course card functionality
    window.toggleCourseDetails = function(card) {
        const details = card.querySelector('.course-details');
        card.classList.toggle('active');
        
        // Smooth height transition
        if (details.style.maxHeight) {
            details.style.maxHeight = null;
        } else {
            details.style.maxHeight = details.scrollHeight + "px";
        }
    }

    // Check if user has already subscribed
    const subscribers = JSON.parse(localStorage.getItem('subscribers') || '[]');
    if (subscribers.length === 0) {
        setTimeout(showModal, 1500);
    }

    // Music Player functionality
    const bgMusic = document.getElementById('bgMusic');
    const playIcon = document.getElementById('playIcon');
    const volumeSlider = document.getElementById('volumeSlider');
    let isPlaying = false;

    // Check if audio element exists and is loaded
    if (bgMusic) {
        bgMusic.volume = 0.5; // Set initial volume to 50%
        
        // Add loading event listener
        bgMusic.addEventListener('loadeddata', () => {
            console.log('Music file loaded successfully');
            document.querySelector('.music-player').style.opacity = '1';
        });

        // Add error handling
        bgMusic.addEventListener('error', (e) => {
            console.error('Error loading music file:', e);
            document.querySelector('.music-player').style.display = 'none';
        });
    }

    window.togglePlay = function() {
        if (!bgMusic) return;

        try {
            if (isPlaying) {
                bgMusic.pause();
                playIcon.className = 'fas fa-play';
            } else {
                const playPromise = bgMusic.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        playIcon.className = 'fas fa-pause';
                    }).catch(error => {
                        console.error('Error playing music:', error);
                    });
                }
            }
            isPlaying = !isPlaying;
        } catch (error) {
            console.error('Error toggling play state:', error);
        }
    }

    window.updateVolume = function(value) {
        if (!bgMusic) return;
        bgMusic.volume = value / 100;
    }

    // Save and restore volume preference
    if (volumeSlider) {
        const savedVolume = localStorage.getItem('musicVolume');
        if (savedVolume !== null) {
            volumeSlider.value = savedVolume;
            bgMusic.volume = savedVolume / 100;
        }

        volumeSlider.addEventListener('change', (e) => {
            localStorage.setItem('musicVolume', e.target.value);
        });
    }
});

// Image loading functionality
function initializeImageLoading() {
    const imageWrappers = document.querySelectorAll('.image-wrapper');
    
    const observerOptions = {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
    };
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const wrapper = entry.target;
                const fullImg = wrapper.querySelector('.full-img');
                
                if (!fullImg.classList.contains('loaded')) {
                    fullImg.addEventListener('load', () => {
                        fullImg.classList.add('loaded');
                    });
                    
                    fullImg.src = wrapper.dataset.src;
                }
                
                observer.unobserve(wrapper);
            }
        });
    }, observerOptions);
    
    imageWrappers.forEach(wrapper => {
        imageObserver.observe(wrapper);
    });
}

// Enhanced lightbox functionality
function openLightbox(event, imageSrc, caption) {
    event.stopPropagation(); // Prevent course card click
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    
    // Set image and caption
    lightboxImg.src = imageSrc;
    lightboxCaption.textContent = caption;
    
    // Show lightbox with animation
    lightbox.classList.add('show');
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
    
    // Add keyboard navigation
    document.addEventListener('keydown', handleLightboxKeyPress);
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('show');
    
    // Restore body scrolling
    document.body.style.overflow = '';
    
    // Remove keyboard navigation
    document.removeEventListener('keydown', handleLightboxKeyPress);
    
    // Clear image src after animation
    setTimeout(() => {
        document.getElementById('lightbox-img').src = '';
        document.getElementById('lightbox-caption').textContent = '';
    }, 300);
}

function handleLightboxKeyPress(event) {
    if (event.key === 'Escape') {
        closeLightbox();
    }
}

// Email collection functionality
async function handleEmailSubmit(event) {
    event.preventDefault();
    
    const emailInput = document.getElementById('emailInput');
    const email = emailInput.value;
    const submitBtn = document.querySelector('.submit-btn');
    
    if (!email) {
        alert('Please enter your email address.');
        return;
    }

    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Subscribing...';

    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbyLD_17oRiDJZ-I0TNf1CPHeN4_VDSJUd42fVDXgj-mEKJ7PoBtf9cWVM9MIOnb6I4CAQ/exec', {
            method: 'POST',
            body: JSON.stringify({ email: email }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        if (result.result === 'success') {
            alert('Thank you for subscribing!');
            closeModal();
            emailInput.value = '';
        } else {
            throw new Error('Subscription failed');
        }
    } catch (error) {
        alert('Sorry, there was an error. Please try again later.');
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Subscribe';
    }
}

// Function to validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Email modal functionality
function showModal() {
    const modal = document.getElementById('emailModal');
    modal.style.display = 'flex';
    // Force reflow
    modal.offsetHeight;
    modal.classList.add('show');
}

function closeModal() {
    const modal = document.getElementById('emailModal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Blog functionality
function showPost() {
    const fullPost = document.getElementById('full-post');
    fullPost.classList.add('show');
    
    // Scroll to full post
    fullPost.scrollIntoView({ behavior: 'smooth' });
}

// Comment functionality
function submitComment() {
    const name = document.getElementById('name').value.trim();
    const commentText = document.getElementById('comment').value.trim();
    
    if (!name || !commentText) {
        alert('Please fill in both name and comment fields.');
        return;
    }
    
    const commentsList = document.getElementById('comment-section');
    const date = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const commentHTML = `
        <div class="comment">
            <div class="comment-header">
                <span class="comment-author">${escapeHtml(name)}</span>
                <span class="comment-date">${date}</span>
            </div>
            <p class="comment-text">${escapeHtml(commentText)}</p>
        </div>
    `;
    
    commentsList.insertAdjacentHTML('afterbegin', commentHTML);
    
    // Clear the form
    document.getElementById('name').value = '';
    document.getElementById('comment').value = '';
}

// Helper function to escape HTML and prevent XSS
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
} 