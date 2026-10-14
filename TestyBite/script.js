const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const recipeGrid = document.getElementById("recipeGrid");
const emptyMessage = document.getElementById("emptyMessage");
const recipeDialog = document.getElementById("recipeDialog");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

let recipes = [];

async function getRecipes() {
    try {
        const response = await fetch("https://dummyjson.com/recipes?limit=0");

        if (!response.ok) {
            throw new Error("Failed to load recipes");
        }

        const data = await response.json();

        recipes = data.recipes;

        showCategories();
        displayRecipes(recipes);

    } catch (error) {
        recipeGrid.textContent = "Could not load recipes. Please try again.";
        console.log(error);
    }
}

function showCategories() {
    const categories = [];

    recipes.forEach(function(recipe) {
        if (!categories.includes(recipe.cuisine)) {
            categories.push(recipe.cuisine);
        }
    });

    categories.sort();

    categories.forEach(function(category) {
        const option = document.createElement("option");

        option.value = category;
        option.textContent = category;

        categoryFilter.appendChild(option);
    });
}


function displayRecipes(recipeList) {
    recipeGrid.innerHTML = "";

    recipeList.forEach(function(recipe) {
        const card = document.createElement("div");
        card.className = "recipe-card";

        const image = document.createElement("img");
        image.src = recipe.image;
        image.alt = recipe.name;
        image.loading = "lazy";

        const content = document.createElement("div");
        content.className = "recipe-content";

        const tags = document.createElement("div");
        tags.className = "tags";

        const cuisine = document.createElement("span");
        cuisine.textContent = recipe.cuisine;
        tags.appendChild(cuisine);

        recipe.mealType.forEach(function(meal) {
            const tag = document.createElement("span");
            tag.textContent = meal;
            tags.appendChild(tag);
        });

        const title = document.createElement("h3");
        title.textContent = recipe.name;

        const info = document.createElement("div");
        info.className = "recipe-info";

        const rating = document.createElement("span");
        rating.textContent = "⭐ " + recipe.rating;

        const time = document.createElement("span");
        time.textContent =
            (recipe.prepTimeMinutes + recipe.cookTimeMinutes) +
            " min";

        info.appendChild(rating);
        info.appendChild(time);

        const button = document.createElement("button");
        button.className = "recipe-button";
        button.textContent = "View Recipe";
        button.dataset.id = recipe.id;

        content.appendChild(tags);
        content.appendChild(title);
        content.appendChild(info);
        content.appendChild(button);

        card.appendChild(image);
        card.appendChild(content);

        recipeGrid.appendChild(card);
    });

    emptyMessage.hidden = recipeList.length > 0;
}


function filterRecipes() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const category = categoryFilter.value;

    const filteredRecipes = recipes.filter(function(recipe) {
        const matchesSearch = recipe.name
            .toLowerCase()
            .includes(searchTerm);

        const matchesCategory =
            category === "all" || recipe.cuisine === category;

        return matchesSearch && matchesCategory;
    });

    displayRecipes(filteredRecipes);
}

searchInput.addEventListener("input", filterRecipes);
categoryFilter.addEventListener("change", filterRecipes);

recipeGrid.addEventListener("click", function(event) {
    if (!event.target.classList.contains("recipe-button")) {
        return;
    }

    const recipeId = Number(event.target.dataset.id);

    const recipe = recipes.find(function(item) {
        return item.id === recipeId;
    });

    if (!recipe) {
        return;
    }

    document.getElementById("dialogImage").src = recipe.image;
    document.getElementById("dialogImage").alt = recipe.name;
    document.getElementById("dialogTitle").textContent = recipe.name;
    document.getElementById("dialogDescription").textContent =
        recipe.cuisine + " cuisine. " +
        recipe.difficulty + " difficulty. " +
        recipe.caloriesPerServing + " calories per serving.";

    document.getElementById("dialogTime").textContent =
        "⏱ " +
        (recipe.prepTimeMinutes + recipe.cookTimeMinutes) +
        " minutes";

    document.getElementById("dialogServings").textContent =
        "🍽 Serves " + recipe.servings;

    const ingredientsList =
        document.getElementById("dialogIngredients");

    ingredientsList.innerHTML = "";

    recipe.ingredients.forEach(function(ingredient) {
        const li = document.createElement("li");
        li.textContent = ingredient;
        ingredientsList.appendChild(li);
    });

    const instructionsList =
        document.getElementById("dialogInstructions");

    instructionsList.innerHTML = "";

    recipe.instructions.forEach(function(step) {
        const li = document.createElement("li");
        li.textContent = step;
        instructionsList.appendChild(li);
    });

    recipeDialog.showModal();
});

document.getElementById("closeDialog").addEventListener("click", function() {
    recipeDialog.close();
});

document.getElementById("doneDialog").addEventListener("click", function() {
    recipeDialog.close();
});

recipeDialog.addEventListener("click", function(event) {
    if (event.target === recipeDialog) {
        recipeDialog.close();
    }
});

document.getElementById("viewAll").addEventListener("click", function() {
    searchInput.value = "";
    categoryFilter.value = "all";

    displayRecipes(recipes);
});

getRecipes();