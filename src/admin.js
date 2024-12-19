document.addEventListener('DOMContentLoaded', function () {
    const buttons = document.querySelectorAll('.nav-button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function () {
            const target = this.getAttribute('data-target');
            
            if (target.startsWith('#')) {
                document.querySelectorAll('section').forEach(section => {
                    section.classList.remove('active');
                });
                
                const section = document.querySelector(target);
                section.classList.add('active');
                
                if (target === '#orders') {
                    fetchOrdersData();
                } 
            } else {
                window.location.href = target;
            }
        });
    });

    function fetchOrdersData() {
        fetch('http://localhost:3000/api/legacy/parts')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => displayData('orders-data', data))
            .catch(error => {
                console.error('Error fetching orders:', error);
                document.getElementById('orders-data').innerHTML = '<p>Error loading data.</p>';
            });
    }

    function displayData(containerId, data) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        
        if (data.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-center py-4">No data available.</p>';
            return;
        }
        
        const table = document.createElement('table');
        table.classList.add(
            'min-w-full', 
            'bg-white', 
            'shadow-md', 
            'rounded-lg', 
            'overflow-hidden', 
            'w-full', 
            'border-collapse'
        );
        
        const headers = [...Object.keys(data[0]), 'Cart'];
    
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr class="bg-gray-100 text-black uppercase text-sm leading-normal">
                ${headers.map(header => 
                    `<th class="px-6 py-3 text-left font-semibold tracking-wider border-b">${header}</th>`
                ).join('')}
            </tr>
        `;
        
        const tbody = document.createElement('tbody');
        tbody.classList.add('text-black', 'text-sm', 'font-light');
        
        data.forEach((row, index) => {
            const rowHTML = document.createElement('tr');
            rowHTML.classList.add(
                'border-b', 
                'border-gray-200', 
                'hover:bg-gray-100',
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
            );
            
            // Create cell content including original data and a new 'Add to Cart' button
            const cellsHTML = headers.map(header => {
                // If last column
                if (header === 'Cart') {
                    return `
                    <td class="px-6 py-3 text-left whitespace-nowrap">
                        <button
                        class="add-to-cart-btn bg-gray-100 text-white p-2 rounded hover:bg-green-600 transition-colors flex items-center justify-center"
                        data-part-id="${row.id || ''}"
                        data-part-name="${row.name || ''}"
                        >
                            <img src="/assets/cart.svg" alt="Add to Cart" class="w-6 h-6"/>
                        </button>
                    </td>
                    `;
                }
                
                // Handle original data cells
                let cellContent = row[header];
                
                // Check if the content looks like an image URL
                if (typeof cellContent === 'string' && isImageUrl(cellContent)) {
                    cellContent = `
                        <img 
                            src="${cellContent}" 
                            alt="${header}" 
                            class="w-full h-20 object-cover rounded-md"
                            onerror="this.onerror=null; this.src='placeholder.jpg'; this.alt='Image not found'"
                        />
                    `;
                }
                
                return `
                    <td class="px-6 py-3 text-left whitespace-nowrap">
                        <div class="flex items-center">
                            <span class="font-medium">${cellContent}</span>
                        </div>
                    </td>
                `;
            }).join('');
            
            rowHTML.innerHTML = cellsHTML;
            
            tbody.appendChild(rowHTML);
        });
        
        table.appendChild(thead);
        table.appendChild(tbody);
        
        container.appendChild(table);
        
    }


    // Helper function to check for image
    function isImageUrl(url) {
        if (!url || typeof url !== 'string') return false;
        const imageExtensions = [ '.jpg', '.jpeg', '.png', '.webp', '.svg' ];
        
        // Check if the URL ends with an image extension
        return imageExtensions.some(ext => 
            url.toLowerCase().endsWith(ext) || 
            url.toLowerCase().includes(ext)
        );
    }

    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        document.querySelectorAll('section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(hash)?.classList.add('active');
        if (hash === 'orders') fetchOrdersData();
    } else {
        document.getElementById('orders').classList.add('active');
        fetchOrdersData();
    }
});