// Cart constructor
function CartManager() {
    this.cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    this.updateCartDisplay();
}

// Add to cart
CartManager.prototype.addToCart = function(item) {
    console.log('Adding item:', item); // Console logging for verification
    const existingItem = this.cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        this.cart.push({
            ...item,
            quantity: 1
        });
    }
    this.saveCart();
    this.updateCartDisplay();
}

// Remove from cart
CartManager.prototype.removeFromCart = function(itemId) {
    const itemExists = this.cart.some(item => item.id === itemId);
    if (!itemExists) {
        console.log('Item not found in cart.');
        return;
    }
    console.log('Removing item');
    this.cart = this.cart.filter(item => item.id !== itemId);
    this.saveCart();
    this.updateCartDisplay();
}

// Save to session storage
CartManager.prototype.saveCart = function() {
    sessionStorage.setItem('cart', JSON.stringify(this.cart));
}

// Live update cart display
CartManager.prototype.updateCartDisplay = function() {
    const cartCountElement = document.getElementById('cart-count');
    
    // Calculate the total quantity of items in the cart
    const totalQuantity = this.cart.reduce((total, item) => total + item.quantity, 0);

    // Update the cart count display in the UI
    if (cartCountElement) {
        cartCountElement.textContent = totalQuantity;  // Display the total quantity
        cartCountElement.classList.toggle('hidden', totalQuantity === 0); // Hide the cart count if it's 0
    }

    // Update individual item quantities in the cart details
    this.cart.forEach(item => {
        const itemContainer = document.querySelector(`[data-item-id="${item.id}"]`); // Find the item by ID
        if (itemContainer) {
            const quantityElement = itemContainer.querySelector('.item-quantity'); // Find the quantity display
            if (quantityElement) {
                quantityElement.textContent = item.quantity; // Update the displayed quantity
            }
        }
    });

    // Render the detailed cart view (if needed)
    this.renderCartDetails();
}

// Display Cart and Details
CartManager.prototype.renderCartDetails = function() {
    const cartContainer = document.getElementById('cart-container');
    let totalSubtotal = 0;
    if (cartContainer) {
        cartContainer.innerHTML = this.cart.map(item => {
            const itemSubtotal = item.price * item.quantity;
            totalSubtotal += itemSubtotal;

            return `
            <div class="cart-item">
            <li class="flex flex-col space-y-3 py-6 text-left sm:flex-row sm:space-x-5 sm:space-y-0">
            <div class="shrink-0">
              <img class="h-24 w-24 max-w-full rounded-lg object-cover" src="${item.image}">
            </div>
      
            <div class="relative flex flex-1 flex-col justify-between">
              <div class="sm:col-gap-5 sm:grid sm:grid-cols-2">
                <div class="pr-8 sm:pr-5">
                  <p class="text-base font-semibold text-gray-900">${item.name}</p>
                </div>
      
            <div class="mt-4 flex items-end justify-between sm:mt-0 sm:items-start sm:justify-end">
              <p class="shrink-0 w-20 text-base font-semibold text-gray-900 sm:order-2 sm:ml-8 sm:text-right">$${item.price}</p>
            <div class="sm:order-1">
              <div class="mx-auto flex h-8 items-stretch text-gray-600" data-item-id="${item.id}">

            <!-- Quantity display -->
            <div class="flex w-full items-center justify-center bg-gray-100 px-4 text-xs uppercase transition item-quantity">
            ${item.quantity} <!-- This is where the quantity is displayed -->
            </div>
            </div>
            </div>
            </div>
            </div>
      
            <div class="absolute top-0 right-0 flex sm:bottom-0 sm:top-auto">
              <button type="button" class="remove-from-cart-btn flex rounded p-2 text-center text-gray-500 transition-all duration-200 ease-in-out focus:shadow hover:text-gray-900"
               data-part-id="${item.id}">
                <svg class="block h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" class=""></path>
                </svg>
              </button>
            </div>
            </div>
            </li>   
            </div>     
            <div class="mt-6 border-t border-b py-2">
                <div class="flex items-center justify-between">
                    <p class="text-sm text-gray-400">SUBTOTAL</p>
                    <p class="text-lg font-semibold text-gray-900">$${(item.price * item.quantity).toFixed(2)}</p>
                </div>
            </div>     
        `}).join('');

        // Render Total
         cartContainer.innerHTML += `
        <div class="my-6 flex items-center justify-between">
            <p class="text-sm font-medium text-gray-900">TOTAL</p>
            <p class="text-2xl font-semibold text-gray-900"><span class="text-xs font-normal text-gray-400">USD </span>$${totalSubtotal.toFixed(2)}</p>
        </div>
         `;
    }
}

// Event listener for add/remove buttons
document.addEventListener('DOMContentLoaded', () => {
    window.cartManager = new CartManager();

    //Remove from cart button
    document.querySelectorAll('.remove-from-cart-btn').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = this.getAttribute('data-part-id');
            window.cartManager.removeFromCart(itemId);
        });
    });

    //Add to cart button
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function() {
            const item = {
                id: this.getAttribute('data-part-id'),
                name: this.getAttribute('data-part-name'),
                price: parseFloat(this.getAttribute('data-part-price') || '0'),
                image: this.getAttribute('data-part-image') || ''
            };
            window.cartManager.addToCart(item);
        });
    });
});

// Attach event listeners to the buttons
document.querySelectorAll('.quantity-buttons').forEach(buttonContainer => {
  const itemId = buttonContainer.getAttribute('data-item-id');

  const decrementButton = buttonContainer.querySelector('.decrement');
  const incrementButton = buttonContainer.querySelector('.increment');

  decrementButton.addEventListener('click', () => changeQuantity(itemId, 'decrement'));
  incrementButton.addEventListener('click', () => changeQuantity(itemId, 'increment'));
});
