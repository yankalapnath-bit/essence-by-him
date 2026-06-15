// Navigation active link highlighting
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (!this.classList.contains('cart-icon')) {
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // Set active link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // Cart icon click handler
    const cartIcon = document.getElementById('cartIcon');
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            showCartSummary();
        });
    }
});

// Update cart count in navigation
function updateCartCount() {
    const cart = db.getCart();
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        cartCountElement.textContent = cart.length;
    }
}

// Perfume search and display functionality
function loadPerfumes(searchTerm = '') {
    const perfumeGallery = document.getElementById('perfumeGallery');
    const noResults = document.getElementById('noResults');

    if (!perfumeGallery) return;

    let filteredPerfumes = perfumeProducts;

    if (searchTerm.trim() !== '') {
        filteredPerfumes = perfumeProducts.filter(perfume => 
            perfume.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            perfume.scent.toLowerCase().includes(searchTerm.toLowerCase()) ||
            perfume.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    if (filteredPerfumes.length === 0) {
        perfumeGallery.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }

    noResults.style.display = 'none';
    perfumeGallery.innerHTML = filteredPerfumes.map(perfume => `
        <div class="perfume-item">
            <div class="perfume-item-image">
                <img src="${perfume.image}" alt="${perfume.name}">
            </div>
            <div class="perfume-item-content">
                <h3>${perfume.name}</h3>
                <p class="perfume-price">$${perfume.price.toFixed(2)}</p>
                <p>${perfume.description}</p>
                <button class="add-to-cart-btn" data-product-id="${perfume.id}">Add to Cart</button>
            </div>
        </div>
    `).join('');

    // Add event listeners to "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-product-id'));
            const product = perfumeProducts.find(p => p.id === productId);
            if (product) {
                addToCartAndShowCard(product);
            }
        });
    });
}

// Add to cart and show floating card
function addToCartAndShowCard(product) {
    db.addToCart(product);
    updateCartCount();
    showFloatingCart(product);
}

// Show floating cart card
function showFloatingCart(product) {
    const floatingCart = document.getElementById('floatingCart');
    const cartItemDetails = document.getElementById('cartItemDetails');

    if (!floatingCart || !cartItemDetails) return;

    cartItemDetails.innerHTML = `
        <div style="text-align: center;">
            <img src="${product.image}" alt="${product.name}" style="width: 100%; max-width: 150px; border-radius: 8px; margin-bottom: 15px;">
            <h4 style="color: #2c1810; margin: 10px 0;">${product.name}</h4>
            <p style="color: #d4af37; font-size: 1.5rem; font-weight: bold; margin: 10px 0;">$${product.price.toFixed(2)}</p>
            <p style="color: #555; font-size: 0.9rem; margin: 10px 0;">${product.description}</p>
            <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-top: 15px; text-align: left;">
                <p><strong>Size:</strong> ${product.concentration}</p>
                <p><strong>Longevity:</strong> ${product.longevity}</p>
                <p><strong>Top Notes:</strong> ${product.topNotes}</p>
            </div>
        </div>
    `;

    floatingCart.style.display = 'block';

    // Close button
    const closeBtn = document.getElementById('closeCart');
    if (closeBtn) {
        closeBtn.onclick = () => {
            floatingCart.style.display = 'none';
        };
    }

    // Continue shopping
    const continueBtn = document.getElementById('continueShopping');
    if (continueBtn) {
        continueBtn.onclick = () => {
            floatingCart.style.display = 'none';
        };
    }
}

// Show cart summary
function showCartSummary() {
    const cart = db.getCart();
    const floatingCart = document.getElementById('floatingCart');
    const cartItemDetails = document.getElementById('cartItemDetails');

    if (!floatingCart || !cartItemDetails) return;

    if (cart.length === 0) {
        cartItemDetails.innerHTML = '<p style="text-align: center; color: #999;">Your cart is empty</p>';
    } else {
        const cartHTML = cart.map(item => `
            <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 10px; border-left: 4px solid #d4af37;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h5 style="color: #2c1810; margin: 0 0 5px 0;">${item.name}</h5>
                        <p style="color: #d4af37; font-weight: bold; margin: 0;">$${item.price.toFixed(2)}</p>
                    </div>
                    <button onclick="removeFromCartUI(${item.id})" style="background: #ff6b6b; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">Remove</button>
                </div>
            </div>
        `).join('');

        const total = db.getCartTotal();
        cartItemDetails.innerHTML = cartHTML + `
            <div style="background: #d4af37; padding: 15px; border-radius: 8px; margin-top: 15px; text-align: center;">
                <p style="margin: 0; color: #2c1810; font-weight: bold; font-size: 1.1rem;">Total: $${total.toFixed(2)}</p>
            </div>
        `;
    }

    floatingCart.style.display = 'block';
}

// Remove from cart
function removeFromCartUI(productId) {
    db.removeFromCart(productId);
    updateCartCount();
    showCartSummary();
}

// Search functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.querySelector('.search-btn');

    if (searchInput && searchBtn) {
        // Load all perfumes on page load
        loadPerfumes();

        // Search on button click
        searchBtn.addEventListener('click', function() {
            loadPerfumes(searchInput.value);
        });

        // Search on Enter key
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                loadPerfumes(searchInput.value);
            }
        });

        // Real-time search
        searchInput.addEventListener('input', function() {
            loadPerfumes(this.value);
        });
    }

    // Initialize cart count
    updateCartCount();
});

// Contact form submission
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            // Validate form
            if (!name || !email || !subject || !message) {
                alert('Please fill in all required fields');
                return;
            }

            // Add contact to database
            const contact = db.addContact(name, email, phone, subject, message);

            // Show success message
            alert('Thank you for contacting us! We will get back to you soon.');
            
            // Reset form
            contactForm.reset();

            // Log to console for verification
            console.log('Contact submitted:', contact);
            console.log('All contacts:', db.getContacts());
        });
    }
});

// Review form submission (for reviews page)
document.addEventListener('DOMContentLoaded', function() {
    const reviewForm = document.getElementById('reviewForm');
    
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('reviewName').value;
            const email = document.getElementById('reviewEmail').value;
            const productId = parseInt(document.getElementById('productSelect').value);
            const rating = parseInt(document.getElementById('rating').value);
            const text = document.getElementById('reviewText').value;

            // Validate form
            if (!name || !email || !productId || !rating || !text) {
                alert('Please fill in all fields');
                return;
            }

            // Add review to database
            const review = db.addReview(name, email, productId, rating, text);

            // Show success message
            alert('Thank you for your review!');
            
            // Reset form
            reviewForm.reset();

            // Reload reviews
            loadReviews();

            // Log to console for verification
            console.log('Review submitted:', review);
            console.log('All reviews:', db.getAllReviews());
        });
    }
});

// Load and display reviews
function loadReviews() {
    const reviewsContainer = document.getElementById('reviewsContainer');
    const reviews = db.getAllReviews();

    if (reviewsContainer) {
        if (reviews.length === 0) {
            reviewsContainer.innerHTML = '<p style="text-align: center; color: #999;">No reviews yet. Be the first to review!</p>';
        } else {
            reviewsContainer.innerHTML = reviews.map(review => `
                <div class="review-card">
                    <div class="stars">${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</div>
                    <p class="review-text">"${review.text}"</p>
                    <p class="reviewer-name">- ${review.name}</p>
                </div>
            `).join('');
        }
    }
}

// CTA Button functionality
document.addEventListener('DOMContentLoaded', function() {
    const ctaButtons = document.querySelectorAll('.cta-button');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            window.location.href = 'perfume.html';
        });
    });
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
