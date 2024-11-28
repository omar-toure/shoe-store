// Données des produits (simulation d'une base de données)
const products = [
    // Chaussures de sport
    {
        id: 1,
        name: "Adidas Yeezy Boost",
        price: 45000,
        category: "sport",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
        sizes: [39, 40, 41, 42, 43, 44],
        description: "Sneakers tendance, parfait pour le style urbain"
    },
    {
        id: 2,
        name: "Nike Air Jordan",
        price: 52000,
        category: "sport",
        image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2",
        sizes: [38, 39, 40, 41, 42, 43],
        description: "Basketball shoes légendaires"
    },
    {
        id: 3,
        name: "Puma Nitro Elite",
        price: 38000,
        category: "sport",
        image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5",
        sizes: [40, 41, 42, 43, 44],
        description: "Chaussures de course haute performance"
    },
    {
        id: 4,
        name: "New Balance 990",
        price: 35000,
        category: "sport",
        image: "https://images.unsplash.com/photo-1539185441755-ccf54634509e",
        sizes: [39, 40, 41, 42, 43],
        description: "Confort et style pour le quotidien"
    },
    {
        id: 5,
        name: "Nike Air Force 1",
        price: 42000,
        category: "sport",
        image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a",
        sizes: [38, 39, 40, 41, 42, 43, 44],
        description: "Sneakers iconiques pour tous les styles"
    },
    // Chaussures casual
    {
        id: 6,
        name: "Sandales Médina",
        price: 15000,
        category: "casual",
        image: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3",
        sizes: [39, 40, 41, 42, 43],
        description: "Sandales traditionnelles en cuir véritable"
    },
    {
        id: 7,
        name: "Mocassins Dakar",
        price: 18000,
        category: "casual",
        image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77",
        sizes: [40, 41, 42, 43],
        description: "Mocassins élégants pour le quotidien"
    },
    {
        id: 8,
        name: "Babouches Thiès",
        price: 12000,
        category: "casual",
        image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86",
        sizes: [39, 40, 41, 42, 43, 44],
        description: "Babouches confortables style moderne"
    },
    {
        id: 9,
        name: "Sandales Gorée",
        price: 8000,
        category: "casual",
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772",
        sizes: [38, 39, 40, 41, 42],
        description: "Sandales tressées artisanales"
    },
    {
        id: 10,
        name: "Mules Saint-Louis",
        price: 20000,
        category: "casual",
        image: "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb",
        sizes: [39, 40, 41, 42, 43],
        description: "Mules en cuir fait main"
    },
    // Chaussures élégantes
    {
        id: 11,
        name: "Babouches Touba",
        price: 25000,
        category: "elegant",
        image: "https://images.unsplash.com/photo-1531310197839-ccf54634509e",
        sizes: [40, 41, 42, 43, 44],
        description: "Babouches de luxe pour cérémonies"
    },
    {
        id: 12,
        name: "Mocassins Almadies",
        price: 30000,
        category: "elegant",
        image: "https://images.unsplash.com/photo-1582897085656-c636d006a246",
        sizes: [39, 40, 41, 42, 43],
        description: "Mocassins haut de gamme en cuir"
    },
    {
        id: 13,
        name: "Sandales Saly",
        price: 22000,
        category: "elegant",
        image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4",
        sizes: [38, 39, 40, 41, 42],
        description: "Sandales élégantes pour occasions spéciales"
    },
    {
        id: 14,
        name: "Babouches Rufisque",
        price: 28000,
        category: "elegant",
        image: "https://images.unsplash.com/photo-1582897085684-c0f2a5d94d4a",
        sizes: [40, 41, 42, 43],
        description: "Babouches brodées main"
    },
    {
        id: 15,
        name: "Mocassins Plateau",
        price: 35000,
        category: "elegant",
        image: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76",
        sizes: [39, 40, 41, 42, 43, 44],
        description: "Mocassins traditionnels haut de gamme"
    }
];

// État du panier
let cart = [];
let selectedSizes = {};

// Afficher les produits
function displayProducts(productsToShow = products) {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return;

    productGrid.innerHTML = '';
    productsToShow.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <p class="product-price">${product.price.toLocaleString()} FCFA</p>
                <div class="size-selector">
                    <label for="size-${product.id}">Pointure:</label>
                    <select id="size-${product.id}" onchange="updateSelectedSize(${product.id}, this.value)">
                        <option value="">Choisir une taille</option>
                        ${product.sizes.map(size => `<option value="${size}">${size}</option>`).join('')}
                    </select>
                </div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    Ajouter au panier
                </button>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
}

// Mettre à jour la taille sélectionnée
function updateSelectedSize(productId, size) {
    selectedSizes[productId] = size;
}

// Ajouter au panier
function addToCart(productId) {
    const size = selectedSizes[productId];
    if (!size) {
        alert('Veuillez sélectionner une pointure');
        return;
    }

    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId && item.size === size);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            size: size,
            quantity: 1
        });
    }

    updateCart();
    openCartModal();
}

// Fonction pour ouvrir le modal du panier
function openCartModal() {
    const modal = document.getElementById('cart-modal');
    if (!modal) return;
    
    modal.style.display = 'block';
    updateCartDisplay();
}

// Fonction pour fermer le modal du panier
function closeCartModal() {
    const modal = document.getElementById('cart-modal');
    if (!modal) return;
    
    modal.style.display = 'none';
}

// Fonction pour mettre à jour l'affichage du panier
function updateCartDisplay() {
    const cartContent = document.querySelector('.cart-content');
    if (!cartContent) return;

    let cartHTML = `
        <div class="modal-header">
            <h2>Votre Panier</h2>
            <span class="close-button" onclick="closeCartModal()">&times;</span>
        </div>
        <div class="cart-items">
    `;

    if (cart.length === 0) {
        cartHTML += '<p class="empty-cart">Votre panier est vide</p>';
    } else {
        cart.forEach((item, index) => {
            cartHTML += `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <h3>${item.name}</h3>
                        <p>Taille: ${item.size}</p>
                        <p>Prix: ${item.price.toLocaleString()} FCFA</p>
                        <div class="quantity-controls">
                            <button onclick="updateQuantity(${index}, -1)">-</button>
                            <span>${item.quantity}</span>
                            <button onclick="updateQuantity(${index}, 1)">+</button>
                        </div>
                        <button class="remove-item" onclick="removeFromCart(${index})">Supprimer</button>
                    </div>
                </div>
            `;
        });

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartHTML += `
            <div class="cart-total">
                <h3>Total: ${total.toLocaleString()} FCFA</h3>
            </div>
            <button class="checkout-button" onclick="showCheckoutForm()">Commander</button>
        `;
    }

    cartHTML += '</div>';
    cartContent.innerHTML = cartHTML;
}

// Mettre à jour la quantité d'un article
function updateQuantity(index, change) {
    if (cart[index]) {
        cart[index].quantity = Math.max(1, cart[index].quantity + change);
        updateCart();
        updateCartDisplay();
    }
}

// Supprimer un article du panier
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
    updateCartDisplay();
}

// Afficher le modal du panier
function showCartModal() {
    const modal = document.getElementById('cart-modal');
    modal.style.display = 'block';

    // Ajouter le bouton de fermeture s'il n'existe pas déjà
    if (!document.querySelector('.close-cart')) {
        const closeButton = document.createElement('button');
        closeButton.className = 'close-cart';
        closeButton.innerHTML = '&times;';
        closeButton.onclick = closeCartModal;
        modal.querySelector('.cart-content').insertBefore(closeButton, modal.querySelector('.cart-content').firstChild);
    }
}

// Fermer le modal du panier
function closeCartModal() {
    const modal = document.getElementById('cart-modal');
    modal.style.display = 'none';
}

// Mettre à jour l'affichage du panier
function updateCart() {
    const cartCount = document.querySelector('.cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotalAmount = document.getElementById('cart-total-amount');
    
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div>
                <h4>${item.name}</h4>
                <p>Pointure: ${item.size}</p>
                <p>${item.price.toLocaleString()} FCFA x ${item.quantity}</p>
                <button onclick="removeFromCart(${item.id}, '${item.size}')">Supprimer</button>
            </div>
        `;
        cartItems.appendChild(itemElement);
        total += item.price * item.quantity;
    });
    
    cartTotalAmount.textContent = total.toLocaleString() + ' FCFA';
}

// Supprimer du panier
function removeFromCart(productId, size) {
    const index = cart.findIndex(item => item.id === productId && item.size === size);
    if (index !== -1) {
        if (cart[index].quantity > 1) {
            cart[index].quantity--;
        } else {
            cart.splice(index, 1);
        }
        updateCart();
    }
}

// Configuration EmailJS
const EMAILJS_CONFIG = {
    serviceID: 'service_uahkrwd',
    templateID: 'template_4i0r3x8',
    publicKey: '-w9IMzLI5y3nKnZk5',
    toEmail: 'toure.omar811@gmail.com'
};

// Initialiser EmailJS
(function initEmailJS() {
    emailjs.init(EMAILJS_CONFIG.publicKey);
})();

// Vérifier si EmailJS est initialisé
function checkEmailJS() {
    return window.emailjs && typeof emailjs.send === 'function';
}

// Formater les détails de la commande pour l'email
function formatOrderDetails(items) {
    return items.map(item => 
        `${item.name} - Taille: ${item.size} - Quantité: ${item.quantity} - Prix: ${item.price.toLocaleString()} FCFA`
    ).join('\\n');
}

// Gestionnaire de commande
async function handleCheckout(e) {
    e.preventDefault();
    
    try {
        if (!checkEmailJS()) {
            throw new Error('EmailJS n\'est pas correctement initialisé');
        }

        if (cart.length === 0) {
            showStatus('Votre panier est vide', true);
            return;
        }

        // Récupérer et valider les données du formulaire
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.replace(/\D/g, ''),
            address: document.getElementById('address').value.trim(),
            payment: document.getElementById('payment').value
        };

        // Validation des champs
        if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.payment) {
            showStatus('Veuillez remplir tous les champs', true);
            return;
        }

        if (formData.phone.length !== 9) {
            showStatus('Le numéro de téléphone doit contenir 9 chiffres', true);
            return;
        }

        if (!formData.email.includes('@') || !formData.email.includes('.')) {
            showStatus('Veuillez entrer une adresse email valide', true);
            return;
        }

        showStatus('Traitement de votre commande...', false);

        // Préparer les détails de la commande
        const orderDetails = {
            customerName: formData.name,
            customerEmail: formData.email,
            customerPhone: formData.phone,
            address: formData.address,
            paymentMethod: formData.payment,
            items: cart.map(item => ({
                name: item.name,
                size: item.size,
                quantity: item.quantity,
                price: item.price
            })),
            totalAmount: cart.reduce((total, item) => total + (item.price * item.quantity), 0)
        };

        // Préparer les données pour l'email
        const emailData = {
            to_name: 'Admin',
            to_email: EMAILJS_CONFIG.toEmail,
            from_name: orderDetails.customerName,
            customer_email: orderDetails.customerEmail,
            customer_phone: orderDetails.customerPhone,
            customer_address: orderDetails.address,
            payment_method: orderDetails.paymentMethod,
            order_details: formatOrderDetails(orderDetails.items),
            total_amount: orderDetails.totalAmount.toLocaleString() + ' FCFA'
        };

        // Envoyer l'email
        const response = await emailjs.send(
            EMAILJS_CONFIG.serviceID,
            EMAILJS_CONFIG.templateID,
            emailData
        );

        // EmailJS renvoie toujours un objet avec status: 200 si l'envoi est réussi
        if (response && response.status === 200) {
            // Sauvegarder la commande
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            orders.push({
                ...orderDetails,
                date: new Date().toISOString(),
                status: 'En attente'
            });
            localStorage.setItem('orders', JSON.stringify(orders));

            // Vider le panier et afficher la confirmation
            cart = [];
            updateCart();
            closeCartModal();

            // Afficher le message de succès
            const successMessage = `
                Commande passée avec succès !
                
                Montant total : ${orderDetails.totalAmount.toLocaleString()} FCFA
                Mode de paiement : ${orderDetails.paymentMethod}
                
                Nous vous contacterons dans les plus brefs délais pour la livraison.
            `;
        } else {
            showStatus(successMessage, false);
        
            throw new Error('Erreur lors de l\'envoi de l\'email');
        }

    } catch (error) {
        console.error('Erreur détaillée:', error);
        showStatus('La commande n\'a pas pu être traitée. Veuillez réessayer ou contactez-nous au +221 78 465 99 01.', true);
    }
}

// Fonction pour afficher un message de statut
function showStatus(message, isError = false) {
    const statusDiv = document.createElement('div');
    statusDiv.style.position = 'fixed';
    statusDiv.style.top = '50%';
    statusDiv.style.left = '50%';
    statusDiv.style.transform = 'translate(-50%, -50%)';
    statusDiv.style.padding = '20px 30px';
    statusDiv.style.borderRadius = '8px';
    statusDiv.style.backgroundColor = isError ? '#ff4444' : '#28a745';
    statusDiv.style.color = 'white';
    statusDiv.style.zIndex = '2000';
    statusDiv.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    statusDiv.style.maxWidth = '400px';
    statusDiv.style.width = '90%';
    statusDiv.style.textAlign = 'center';
    statusDiv.style.whiteSpace = 'pre-line';
    statusDiv.style.fontSize = '16px';
    statusDiv.style.lineHeight = '1.5';

    // Ajouter un bouton de fermeture
    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.border = 'none';
    closeButton.style.background = 'none';
    closeButton.style.color = 'white';
    closeButton.style.fontSize = '24px';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = () => document.body.removeChild(statusDiv);

    statusDiv.textContent = message;
    statusDiv.appendChild(closeButton);
    document.body.appendChild(statusDiv);

    // Fermer automatiquement après 5 secondes
    setTimeout(() => {
        if (document.body.contains(statusDiv)) {
            document.body.removeChild(statusDiv);
        }
    }, 5000);
}

// Fonction pour afficher le formulaire de commande
function showCheckoutForm() {
    const modal = document.getElementById('cart-modal');
    const checkoutForm = document.createElement('div');
    checkoutForm.className = 'checkout-form';
    checkoutForm.innerHTML = `
        <div class="modal-header">
            <h2>Finaliser la commande</h2>
            <span class="close-button" onclick="closeCartModal()">&times;</span>
        </div>
        <form id="order-form">
            <div class="form-group">
                <label for="name">Nom complet</label>
                <input type="text" id="name" required>
            </div>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" required>
            </div>
            <div class="form-group">
                <label for="phone">Téléphone</label>
                <input type="text" id="phone" required 
                       placeholder="77 123 45 67"
                       maxlength="12">
                <small class="form-text">Format: 77 123 45 67</small>
            </div>
            <div class="form-group">
                <label for="address">Adresse de livraison</label>
                <textarea id="address" required></textarea>
            </div>
            <div class="form-group">
                <label for="payment">Mode de paiement</label>
                <select id="payment" required>
                    <option value="">Choisir un mode de paiement</option>
                    <option value="orange">Orange Money</option>
                    <option value="wave">Wave</option>
                    <option value="free">Free Money</option>
                    <option value="cash">Paiement à la livraison</option>
                </select>
            </div>
            <div class="form-actions">
                <button type="button" class="cancel-button" onclick="closeCartModal()">Annuler</button>
                <button type="submit" class="submit-button">Soumettre la commande</button>
            </div>
        </form>
    `;

    const cartContent = modal.querySelector('.cart-content');
    cartContent.innerHTML = '';
    cartContent.appendChild(checkoutForm);

    // Formater automatiquement le numéro de téléphone
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, ''); // Garder uniquement les chiffres
        
        // Formater avec des espaces
        let formattedValue = '';
        for (let i = 0; i < value.length && i < 9; i++) {
            if (i === 2 || i === 5 || i === 7) {
                formattedValue += ' ';
            }
            formattedValue += value[i];
        }
        
        e.target.value = formattedValue;
    });

    // Gestionnaire du formulaire
    const orderForm = document.getElementById('order-form');
    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Vérifier le format du numéro de téléphone
        const phone = phoneInput.value.replace(/\D/g, '');
        if (phone.length !== 9) {
            showStatus('Le numéro de téléphone doit contenir 9 chiffres', true);
            phoneInput.focus();
            return;
        }
        
        handleCheckout(e);
    });
}

// Fonction pour afficher l'historique des commandes
function showOrderHistory() {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const modal = document.getElementById('cart-modal');
    const historyDiv = document.createElement('div');
    historyDiv.className = 'order-history';
    
    if (orders.length === 0) {
        historyDiv.innerHTML = '<h2>Historique des commandes</h2><p>Aucune commande trouvée.</p>';
    } else {
        let historyHTML = '<h2>Historique des commandes</h2>';
        orders.reverse().forEach((order, index) => {
            const date = new Date(order.date).toLocaleString('fr-FR');
            historyHTML += `
                <div class="order-item">
                    <h3>Commande #${orders.length - index}</h3>
                    <p><strong>Date:</strong> ${date}</p>
                    <p><strong>Statut:</strong> <span class="status-${order.status.toLowerCase()}">${order.status}</span></p>
                    <p><strong>Total:</strong> ${order.totalAmount.toLocaleString()} FCFA</p>
                    <button onclick="showOrderDetails(${index})" class="view-details-btn">Voir les détails</button>
                </div>
            `;
        });
        historyDiv.innerHTML = historyHTML;
    }

    const cartContent = modal.querySelector('.cart-content');
    cartContent.innerHTML = '';
    cartContent.appendChild(historyDiv);
}

// Fonction pour afficher les détails d'une commande
function showOrderDetails(index) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const order = orders[orders.length - 1 - index];
    const modal = document.getElementById('cart-modal');
    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'order-details';
    
    detailsDiv.innerHTML = `
        <h2>Détails de la commande #${orders.length - index}</h2>
        <div class="order-info">
            <p><strong>Date:</strong> ${new Date(order.date).toLocaleString('fr-FR')}</p>
            <p><strong>Statut:</strong> <span class="status-${order.status.toLowerCase()}">${order.status}</span></p>
            <p><strong>Nom:</strong> ${order.customerName}</p>
            <p><strong>Email:</strong> ${order.customerEmail}</p>
            <p><strong>Téléphone:</strong> ${order.customerPhone}</p>
            <p><strong>Adresse:</strong> ${order.address}</p>
            <p><strong>Mode de paiement:</strong> ${order.paymentMethod}</p>
        </div>
        <div class="order-items">
            <h3>Articles commandés</h3>
            ${order.items.map(item => `
                <div class="order-item">
                    <p><strong>${item.name}</strong> (Taille: ${item.size})</p>
                    <p>Quantité: ${item.quantity} x ${item.price.toLocaleString()} FCFA</p>
                </div>
            `).join('')}
            <div class="order-total">
                <p><strong>Total:</strong> ${order.totalAmount.toLocaleString()} FCFA</p>
            </div>
        </div>
        <button onclick="showOrderHistory()" class="back-btn">Retour à l'historique</button>
    `;

    const cartContent = modal.querySelector('.cart-content');
    cartContent.innerHTML = '';
    cartContent.appendChild(detailsDiv);
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    // Vérifier EmailJS après un court délai
    setTimeout(() => {
        if (!checkEmailJS()) {
            console.error('EmailJS n\'a pas été chargé correctement');
        } else {
            console.log('EmailJS est prêt à être utilisé');
        }
    }, 1000);

    displayProducts();
    
    const checkoutButton = document.querySelector('.checkout-button');
    if (checkoutButton) {
        checkoutButton.onclick = showCheckoutForm;
    }

    // Fermer le modal quand on clique en dehors
    window.onclick = function(event) {
        const modal = document.getElementById('cart-modal');
        if (event.target === modal) {
            closeCartModal();
        }
    };
});
