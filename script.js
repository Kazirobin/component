
let currentStyleTag = null;

function generateMenu() {
  const menu = document.querySelector(".menu");
  const categories = {};

  // Group items by category and subcategory
  store.forEach((item) => {
    if (!categories[item.category]) {
      categories[item.category] = [];
    }
    categories[item.category].push(item.subCategory);
  });

  // Create HTML for the navigation
  let menuHtml = "";
  for (let category in categories) {
    menuHtml += `<div class="category" data-category="${category}">${category}`;
    categories[category].forEach((subCategory) => {
      menuHtml += `<div class="subCategory" data-category="${category}" data-subcategory="${subCategory}">${subCategory}</div>`;
    });
    menuHtml += `</div>`;
  }

  menu.innerHTML = menuHtml;
}

function renderComponent(category, subCategory) {
  const component = store.find(
    (item) =>
      item.category === category && item.subCategory === subCategory
  );
  if (component) {
    const view = document.querySelector(".view");
    view.innerHTML = component.html;

    // Remove previous style tag if it exists
    if (currentStyleTag) {
      document.head.removeChild(currentStyleTag);
    }

    // Create a new style tag and add it to the head
    currentStyleTag = document.createElement("style");
    currentStyleTag.textContent = component.css;
    document.head.appendChild(currentStyleTag);

    document.querySelector(".copyHtml").dataset.html = component.html;
    document.querySelector(".copyCss").dataset.css = component.css;
  }
}

function showCategoryComponents(category) {
  const components = store.filter((item) => item.category === category);
  const view = document.querySelector(".view");
  view.innerHTML = "";

  // Remove any existing style tags to avoid conflicts
  if (currentStyleTag) {
    document.head.removeChild(currentStyleTag);
    currentStyleTag = null;
  }

  components.forEach((component) => {
    const componentDiv = document.createElement("div");
    componentDiv.innerHTML = `<h2>${component.subCategory}</h2>${component.html}`;
    view.appendChild(componentDiv);

    // Apply CSS to each component
    const styleTag = document.createElement("style");
    styleTag.textContent = component.css;
    componentDiv.appendChild(styleTag);
  });

  // Prepare HTML and CSS for copying
  document.querySelector(".copyHtml").dataset.html = components
    .map((c) => c.html)
    .join("\n");
  document.querySelector(".copyCss").dataset.css = components
    .map((c) => c.css)
    .join("\n");
}

document
  .querySelector(".menu")
  .addEventListener("click", function (event) {
    if (event.target.classList.contains("subCategory")) {
      const category = event.target.dataset.category;
      const subCategory = event.target.dataset.subcategory;
      renderComponent(category, subCategory);
    } else if (event.target.classList.contains("category")) {
      const category = event.target.dataset.category;
      showCategoryComponents(category);
    }
  });

document.getElementById("find").addEventListener("click", function () {
  const searchValue = document
    .getElementById("search")
    .value.trim()
    .toLowerCase();
  const result = store.find(
    (component) =>
      component.category.toLowerCase().includes(searchValue) ||
      component.subCategory.toLowerCase().includes(searchValue)
  );
  if (result) {
    renderComponent(result.category, result.subCategory);
  } else {
    alert("No component found");
  }
});

document
  .querySelector(".copyHtml")
  .addEventListener("click", function () {
    copyToClipboard(this.dataset.html);
  });

document.querySelector(".copyCss").addEventListener("click", function () {
  copyToClipboard(this.dataset.css);
});

function copyToClipboard(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
  alert("Copied to clipboard");
}

// Initialize the menu when the page loads
generateMenu();