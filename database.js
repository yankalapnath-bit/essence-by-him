// Local Storage Database Manager
class Database {
    constructor() {
        this.initializeDatabase();
    }

    initializeDatabase() {
        // Initialize reviews if not exists
        if (!localStorage.getItem('reviews')) {
            const defaultReviews = [
                {
                    id: 1,
                    name: "James M.",
                    email: "james@example.com",
                    productId: 1,
                    rating: 5,
                    text: "Essence by Him Premium Essence is absolutely incredible! The scent is sophisticated and long-lasting. I've received countless compliments since I started wearing it. Highly recommended!",
                    date: new Date().toISOString()
                },
                {
                    id: 2,
                    name: "David R.",
                    email: "david@example.com",
                    productId: 2,
                    rating: 5,
                    text: "The Midnight Mystery fragrance is perfect for evening events. It's dark, mysterious, and absolutely captivating. This is my go-to scent now!",
                    date: new Date().toISOString()
                },
                {
                    id: 3,
                    name: "Michael T.",
                    email: "michael@example.com",
                    productId: 3,
                    rating: 5,
                    text: "Fresh Horizon is my daily driver. It's fresh, crisp, and professional. Perfect for the office and casual outings. Great value for money!",
                    date: new Date().toISOString()
                }
            ];
            localStorage.setItem('reviews', JSON.stringify(defaultReviews));
        }

        // Initialize contacts if not exists
        if (!localStorage.getItem('contacts')) {
            localStorage.setItem('contacts', JSON.stringify([]));
        }

        // Initialize cart if not exists
        if (!localStorage.getItem('cart')) {
            localStorage.setItem('cart', JSON.stringify([]));
        }
    }

    // REVIEWS METHODS
    addReview(name, email, productId, rating, text) {
        const reviews = this.getReviews();
        const newReview = {
            id: reviews.length + 1,
            name,
            email,
            productId,
            rating,
            text,
            date: new Date().toISOString()
        };
        reviews.push(newReview);
        localStorage.setItem('reviews', JSON.stringify(reviews));
        return newReview;
    }

    getReviews() {
        return JSON.parse(localStorage.getItem('reviews')) || [];
    }

    getReviewsByProduct(productId) {
        const reviews = this.getReviews();
        return reviews.filter(r => r.productId == productId);
    }

    getAllReviews() {
        return this.getReviews();
    }

    deleteReview(id) {
        let reviews = this.getReviews();
        reviews = reviews.filter(r => r.id !== id);
        localStorage.setItem('reviews', JSON.stringify(reviews));
    }

    // CONTACTS METHODS
    addContact(name, email, phone, subject, message) {
        const contacts = this.getContacts();
        const newContact = {
            id: contacts.length + 1,
            name,
            email,
            phone,
            subject,
            message,
            date: new Date().toISOString(),
            status: 'new'
        };
        contacts.push(newContact);
        localStorage.setItem('contacts', JSON.stringify(contacts));
        return newContact;
    }

    getContacts() {
        return JSON.parse(localStorage.getItem('contacts')) || [];
    }

    deleteContact(id) {
        let contacts = this.getContacts();
        contacts = contacts.filter(c => c.id !== id);
        localStorage.setItem('contacts', JSON.stringify(contacts));
    }

    updateContactStatus(id, status) {
        let contacts = this.getContacts();
        contacts = contacts.map(c => c.id === id ? { ...c, status } : c);
        localStorage.setItem('contacts', JSON.stringify(contacts));
    }

    // CART METHODS
    addToCart(product) {
        const cart = this.getCart();
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        return cart;
    }

    getCart() {
        return JSON.parse(localStorage.getItem('cart')) || [];
    }

    removeFromCart(productId) {
        let cart = this.getCart();
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        return cart;
    }

    updateCartQuantity(productId, quantity) {
        let cart = this.getCart();
        cart = cart.map(item => 
            item.id === productId ? { ...item, quantity } : item
        );
        localStorage.setItem('cart', JSON.stringify(cart));
        return cart;
    }

    clearCart() {
        localStorage.setItem('cart', JSON.stringify([]));
    }

    getCartTotal() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
}

// Create global database instance
const db = new Database();
