// Configuration
const API_URL = 'http://localhost:5000/api';
let currentProduct = null;
let token = localStorage.getItem('adminToken');

// Vérifier l'authentification
function checkAuth() {
    if (!token) {
        window.location.href = '/admin/login.html';
        return;
    }
    document.getElementById('user-email').textContent = localStorage.getItem('adminEmail');
}

// Charger les produits
async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/products`, {
            headers: {
                'x-auth-token': token
            }
        });
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        showError('Erreur lors du chargement des produits');
    }
}

// Afficher les produits
function displayProducts(products) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.price.toLocaleString()} FCFA</p>
                <p>Catégorie: ${product.category}</p>
                <p>Stock: ${product.inStock ? 'Disponible' : 'Rupture'}</p>
                <div class="product-actions">
                    <button onclick="editProduct('${product._id}')" class="action-btn">
                        <i class="fas fa-edit"></i> Modifier
                    </button>
                    <button onclick="deleteProduct('${product._id}')" class="danger-btn">
                        <i class="fas fa-trash"></i> Supprimer
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Gérer le formulaire de produit
async function handleProductForm(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', document.getElementById('product-name').value);
    formData.append('price', document.getElementById('product-price').value);
    formData.append('category', document.getElementById('product-category').value);
    formData.append('description', document.getElementById('product-description').value);
    formData.append('inStock', document.getElementById('product-instock').checked);

    // Récupérer les tailles sélectionnées
    const sizes = Array.from(document.querySelectorAll('.sizes-grid input:checked'))
        .map(input => parseInt(input.value));
    formData.append('sizes', JSON.stringify(sizes));

    // Ajouter l'image si elle existe
    const imageInput = document.getElementById('product-image');
    if (imageInput.files.length > 0) {
        formData.append('image', imageInput.files[0]);
    }

    try {
        const url = currentProduct
            ? `${API_URL}/products/${currentProduct._id}`
            : `${API_URL}/products`;

        const method = currentProduct ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'x-auth-token': token
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('Erreur lors de l\'enregistrement');
        }

        closeProductModal();
        loadProducts();
        showSuccess(currentProduct ? 'Produit modifié avec succès' : 'Produit ajouté avec succès');
    } catch (error) {
        showError('Erreur lors de l\'enregistrement du produit');
    }
}

// Modifier un produit
async function editProduct(id) {
    try {
        const response = await fetch(`${API_URL}/products/${id}`, {
            headers: {
                'x-auth-token': token
            }
        });
        currentProduct = await response.json();
        
        // Remplir le formulaire
        document.getElementById('product-name').value = currentProduct.name;
        document.getElementById('product-price').value = currentProduct.price;
        document.getElementById('product-category').value = currentProduct.category;
        document.getElementById('product-description').value = currentProduct.description;
        document.getElementById('product-instock').checked = currentProduct.inStock;

        // Cocher les tailles
        document.querySelectorAll('.sizes-grid input').forEach(input => {
            input.checked = currentProduct.sizes.includes(parseInt(input.value));
        });

        // Afficher l'image actuelle
        const preview = document.getElementById('image-preview');
        preview.innerHTML = `<img src="${currentProduct.image}" alt="Preview">`;

        document.getElementById('modal-title').textContent = 'Modifier le produit';
        showProductModal();
    } catch (error) {
        showError('Erreur lors du chargement du produit');
    }
}

// Supprimer un produit
async function deleteProduct(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
        try {
            await fetch(`${API_URL}/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'x-auth-token': token
                }
            });
            loadProducts();
            showSuccess('Produit supprimé avec succès');
        } catch (error) {
            showError('Erreur lors de la suppression du produit');
        }
    }
}

// Fonctions utilitaires pour les modals
function showProductModal() {
    document.getElementById('product-modal').style.display = 'block';
}

function closeProductModal() {
    document.getElementById('product-modal').style.display = 'none';
    document.getElementById('product-form').reset();
    document.getElementById('image-preview').innerHTML = '';
    currentProduct = null;
}

function showAddProductModal() {
    document.getElementById('modal-title').textContent = 'Ajouter un produit';
    showProductModal();
}

// Prévisualisation de l'image
document.getElementById('product-image').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('image-preview');
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        }
        reader.readAsDataURL(file);
    }
});

// Messages de notification
function showSuccess(message) {
    // Implémenter une notification de succès
    alert(message);
}

function showError(message) {
    // Implémenter une notification d'erreur
    alert(message);
}

// Déconnexion
function logout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    window.location.href = '/admin/login.html';
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadProducts();
    document.getElementById('product-form').addEventListener('submit', handleProductForm);
});
