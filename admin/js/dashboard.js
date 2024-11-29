const API_BASE_URL = window.location.origin + '/api';

// Vérification du token et redirection si non connecté
function checkAuth() {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = '/admin/login.html';
        return;
    }

    // Vérification du token
    fetch(`${API_BASE_URL}/auth/verify`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Token invalide');
        }
        return response.json();
    })
    .then(data => {
        if (!data.valid) {
            throw new Error('Session expirée');
        }
        const adminEmail = localStorage.getItem('adminEmail');
        document.getElementById('user-email').textContent = adminEmail || 'Admin';
    })
    .catch(error => {
        console.error('Erreur d\'authentification:', error);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminEmail');
        window.location.href = '/admin/login.html';
    });
}

// Gestion du formulaire d'ajout/modification de produit
const productForm = document.getElementById('product-form');
const imageInput = document.getElementById('image');
const imagePreview = document.getElementById('image-preview');

// Prévisualisation de l'image
imageInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            imagePreview.innerHTML = '';
            imagePreview.appendChild(img);
        }
        reader.readAsDataURL(file);
    }
});

// Soumission du formulaire
productForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('name', document.getElementById('name').value);
    formData.append('price', document.getElementById('price').value);
    formData.append('category', document.getElementById('category').value);
    formData.append('description', document.getElementById('description').value);
    formData.append('image', document.getElementById('image').files[0]);
    formData.append('sizes', document.getElementById('sizes').value);
    formData.append('stock', document.getElementById('stock').value);

    try {
        const url = currentProductId 
            ? `${API_BASE_URL}/products/${currentProductId}`
            : `${API_BASE_URL}/products`;
            
        const method = currentProductId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            },
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Erreur lors de l\'ajout du produit');
        }

        alert(currentProductId ? 'Produit modifié avec succès' : 'Produit ajouté avec succès');
        closeProductModal();
        loadProducts();
    } catch (error) {
        console.error('Erreur:', error);
        alert(error.message);
    }
});

// Chargement des produits
async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });

        if (!response.ok) {
            throw new Error('Erreur lors du chargement des produits');
        }

        const products = await response.json();
        const productsList = document.getElementById('products-list');
        const noProducts = document.getElementById('no-products');
        
        if (products.length === 0) {
            noProducts.style.display = 'block';
            productsList.innerHTML = '';
            return;
        }
        
        noProducts.style.display = 'none';
        productsList.innerHTML = products.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="price">${product.price.toLocaleString('fr-FR')} FCFA</p>
                    <p class="stock">Stock: ${product.stock}</p>
                    <div class="product-actions">
                        <button onclick="editProduct('${product._id}')" class="edit-btn">
                            <i class="fas fa-edit"></i> Modifier
                        </button>
                        <button onclick="deleteProduct('${product._id}')" class="delete-btn">
                            <i class="fas fa-trash"></i> Supprimer
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors du chargement des produits');
    }
}

// Éditer un produit
async function editProduct(productId) {
    try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });

        if (!response.ok) {
            throw new Error('Erreur lors du chargement du produit');
        }

        const product = await response.json();
        
        document.getElementById('name').value = product.name;
        document.getElementById('price').value = product.price;
        document.getElementById('category').value = product.category;
        document.getElementById('description').value = product.description;
        document.getElementById('sizes').value = product.sizes.join(', ');
        document.getElementById('stock').value = product.stock;

        if (product.image) {
            const img = document.createElement('img');
            img.src = product.image;
            imagePreview.innerHTML = '';
            imagePreview.appendChild(img);
        }

        currentProductId = productId;
        document.getElementById('modal-title').textContent = 'Modifier le Produit';
        document.getElementById('product-modal').style.display = 'block';
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors du chargement du produit');
    }
}

// Supprimer un produit
async function deleteProduct(productId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
        try {
            const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la suppression');
            }

            alert('Produit supprimé avec succès');
            loadProducts();
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de la suppression du produit');
        }
    }
}

// Fonctions modales
function showAddProductModal() {
    currentProductId = null;
    document.getElementById('modal-title').textContent = 'Ajouter un Produit';
    productForm.reset();
    imagePreview.innerHTML = '';
    document.getElementById('product-modal').style.display = 'block';
}

function closeProductModal() {
    document.getElementById('product-modal').style.display = 'none';
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
});
