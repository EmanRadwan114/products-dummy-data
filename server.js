import express from "express";
import fs from "fs";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Load data.json
let db = JSON.parse(fs.readFileSync("data.json"));

// --- PRODUCTS ROUTES ---

// GET all products
app.get("/products", (req, res) => {
  res.json(db.products);
});

// GET single product
app.get("/products/:id", (req, res) => {
  const product = db.products.find((p) => p.id == req.params.id);
  product ? res.json(product) : res.status(404).json({ message: "Not found" });
});

// POST add product
app.post("/products", (req, res) => {
  const newProduct = { id: Date.now(), ...req.body };
  db.products.push(newProduct);
  fs.writeFileSync("data.json", JSON.stringify(db, null, 2));
  res.status(201).json(newProduct);
});

// PUT update product
app.put("/products/:id", (req, res) => {
  const index = db.products.findIndex((p) => p.id == req.params.id);
  if (index === -1) return res.status(404).json({ message: "Not found" });
  db.products[index] = { ...db.products[index], ...req.body };
  fs.writeFileSync("data.json", JSON.stringify(db, null, 2));
  res.json(db.products[index]);
});

// DELETE product
app.delete("/products/:id", (req, res) => {
  db.products = db.products.filter((p) => p.id != req.params.id);
  fs.writeFileSync("data.json", JSON.stringify(db, null, 2));
  res.status(204).end();
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
