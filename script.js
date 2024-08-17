document.addEventListener('DOMContentLoaded', () => {
    const componentsContainer = document.getElementById('components');
    const subcategoriesContainer = document.getElementById('subcategories');
    const menuToggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('menu');

    // Toggle menu on small screens
    menuToggle.addEventListener('click', () => {
        menu.classList.toggle('hidden');
    });

    // Function to render components
    function renderComponents(filterCategory = null, filterSubcategory = null) {
        componentsContainer.innerHTML = '';

        components
            .filter(component => 
                (!filterCategory || component.category === filterCategory) &&
                (!filterSubcategory || component.subcategory === filterSubcategory)
            )
            .forEach(component => {
                const componentCard = document.createElement('div');
                componentCard.classList.add('p-4', 'bg-white', 'rounded', 'shadow');

                const styleTag = document.createElement('style');
                styleTag.innerHTML = component.css;
                document.head.appendChild(styleTag);

                componentCard.innerHTML = `
                    <h2 class="text-lg font-bold mb-2">${component.title}</h2>
                    <div class="preview mb-4">${component.html}</div>
                    <button class="copy-html bg-blue-500 text-white px-4 py-2 rounded mr-2">Copy HTML</button>
                    <button class="copy-css bg-green-500 text-white px-4 py-2 rounded">Copy CSS</button>
                `;

                componentCard.querySelector('.copy-html').addEventListener('click', () => {
                    copyToClipboard(component.html);
                    alert('HTML copied to clipboard!');
                });

                componentCard.querySelector('.copy-css').addEventListener('click', () => {
                    copyToClipboard(component.css);
                    alert('CSS copied to clipboard!');
                });

                componentsContainer.appendChild(componentCard);
            });
    }

    // Function to render subcategories
    function renderSubcategories(category) {
        subcategoriesContainer.innerHTML = '';

        const subcategories = [...new Set(components.filter(component => component.category === category).map(component => component.subcategory))];

        subcategories.forEach(subcategory => {
            const subcategoryButton = document.createElement('button');
            subcategoryButton.classList.add('bg-gray-200', 'px-4', 'py-2', 'rounded');
            subcategoryButton.innerText = subcategory;
            subcategoryButton.addEventListener('click', () => {
                renderComponents(category, subcategory);
            });

            subcategoriesContainer.appendChild(subcategoryButton);
        });
    }

    // Event listener for category filtering
    document.querySelectorAll('.category-filter').forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            const category = event.target.dataset.category;
            renderSubcategories(category);
            renderComponents(category);
        });
    });

    // Initially render all components
    renderComponents();
});

// Function to copy text to clipboard
function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}
