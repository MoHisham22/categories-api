const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const PORT = 5020;

app.use(bodyParser.json());

const readCategories = () => {
  const data = fs.readFileSync("categories.json");
  return JSON.parse(data);
};

const writeCategories = (categories) => {
  fs.writeFileSync("categories.json", JSON.stringify(categories, null, 2));
};

app.get("/", (req, res) => {
  res.send(
    "🚀 API is running! Available endpoints: /api/Create_Category, /api/GetAllCategories, /api/Update_Category/:id, /api/GetCategoryById/:id, /api/DeleteCategoryById/:id"
  );
});

// Create_Category
app.post("/api/Create_Category", (req, res) => {
  const categories = readCategories();
  const newCategory = req.body;
  newCategory.id = categories.length + 1;
  categories.push(newCategory);
  writeCategories(categories);
  res.status(201).send("Category created successfully!");
});

// GetAllCategories
app.get("/api/GetAllCategories", (req, res) => {
  const categories = readCategories();
  res.status(200).json(categories);
});

// Update_Category
app.put("/api/Update_Category/:id", (req, res) => {
  const categories = readCategories();
  const id = parseInt(req.params.id);
  const index = categories.findIndex((cat) => cat.id === id);

  if (index !== -1) {
    categories[index] = { ...categories[index], ...req.body };
    writeCategories(categories);
    res.send("Category updated successfully!");
  } else {
    res.status(404).send("Category not found!");
  }
});

// GetCategoryById
app.get("/api/GetCategoryById/:id", (req, res) => {
  const categories = readCategories();
  const category = categories.find((cat) => cat.id === parseInt(req.params.id));

  if (category) {
    res.status(200).json(category);
  } else {
    res.status(404).send("Category not found!");
  }
});

// DeleteCategoryById
app.delete("/api/DeleteCategoryById/:id", (req, res) => {
  let categories = readCategories();
  const id = parseInt(req.params.id);

  if (categories.some((cat) => cat.id === id)) {
    categories = categories.filter((cat) => cat.id !== id);
    writeCategories(categories);
    res.send("Category deleted successfully!");
  } else {
    res.status(404).send("Category not found!");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
