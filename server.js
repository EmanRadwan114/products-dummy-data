import express from "express";
import fs from "fs";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Load JSON file
let db = JSON.parse(fs.readFileSync("data_with_categories.json"));

// --- PRODUCTS API ---

// Get all products
app.get("/products", (req, res) => {
  res.json(db.products);
});

// Get product by id
app.get("/products/:id", (req, res) => {
  const product = db.products.find((p) => p.id == req.params.id);
  product
    ? res.json(product)
    : res.status(404).json({ message: "Product not found" });
});

// Add product
app.post("/products", (req, res) => {
  const newProduct = { id: Date.now(), ...req.body };
  db.products.push(newProduct);
  fs.writeFileSync("data_with_categories.json", JSON.stringify(db, null, 2));
  res.status(201).json(newProduct);
});

// Update product
app.put("/products/:id", (req, res) => {
  const index = db.products.findIndex((p) => p.id == req.params.id);
  if (index === -1)
    return res.status(404).json({ message: "Product not found" });
  db.products[index] = { ...db.products[index], ...req.body };
  fs.writeFileSync("data_with_categories.json", JSON.stringify(db, null, 2));
  res.json(db.products[index]);
});

// Delete product
app.delete("/products/:id", (req, res) => {
  db.products = db.products.filter((p) => p.id != req.params.id);
  fs.writeFileSync("data_with_categories.json", JSON.stringify(db, null, 2));
  res.status(204).end();
});

// --- CATEGORIES API ---

// Get all categories
app.get("/categories", (req, res) => {
  res.json(db.categories);
});

// Get category by id
app.get("/categories/:id", (req, res) => {
  const category = db.categories.find((c) => c.id == req.params.id);
  category
    ? res.json(category)
    : res.status(404).json({ message: "Category not found" });
});

// Add category
app.post("/categories", (req, res) => {
  const newCategory = { id: Date.now(), ...req.body };
  db.categories.push(newCategory);
  fs.writeFileSync("data_with_categories.json", JSON.stringify(db, null, 2));
  res.status(201).json(newCategory);
});

// Update category
app.put("/categories/:id", (req, res) => {
  const index = db.categories.findIndex((c) => c.id == req.params.id);
  if (index === -1)
    return res.status(404).json({ message: "Category not found" });
  db.categories[index] = { ...db.categories[index], ...req.body };
  fs.writeFileSync("data_with_categories.json", JSON.stringify(db, null, 2));
  res.json(db.categories[index]);
});

// Delete category
app.delete("/categories/:id", (req, res) => {
  db.categories = db.categories.filter((c) => c.id != req.params.id);
  fs.writeFileSync("data_with_categories.json", JSON.stringify(db, null, 2));
  res.status(204).end();
});

// Get products inside a category
app.get("/categories/:id/products", (req, res) => {
  const categoryId = Number(req.params.id);
  const category = db.categories.find((c) => c.id === categoryId);
  if (!category) return res.status(404).json({ message: "Category not found" });

  const products = db.products.filter((p) => {
    // Match by category name
    return p.category === category.name;
  });

  res.json(products);
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
