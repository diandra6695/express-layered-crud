const express = require("express");
const dotenv = require("dotenv");
const app = express();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
dotenv.config();

const PORT = process.env.PORT;

app.use(express.json());

app.get("/api", (req, res) => {
  res.send("Selamat datang di API akuh");
});

app.get("/product", async (req, res) => {
  const products = await prisma.product.findMany();

  res.send(products);
});

app.post("/product", async (req, res) => {
  const newProductData = req.body;
  const product = await prisma.product.create({
    data: {
      name: newProductData.name,
      description: newProductData.description,
      image: newProductData.image,
      price: newProductData.price,
    },
  });
  if (
    !(
      newProductData.image &&
      newProductData.description &&
      newProductData.name &&
      newProductData.price
    )
  ) {
    return res.status(400).send("Some fields are missing");
  } else {
    return res.send({
      data: product,
      message: "create product success",
    });
  }
});

app.delete("/product/:id", async (req, res) => {
  const productId = req.params.id;
  await prisma.product.delete({
    where: {
      id: parseInt(productId),
    },
  });
  res.send("product deleted");
});

//memasukkan seluruh data
app.put("/product/:id", async (req, res) => {
  const productId = req.params.id;
  const productData = req.body;
  if (
    !(
      productData.image &&
      productData.description &&
      productData.name &&
      productData.price
    )
  ) {
    return res.status(400).send("Some fields are missing");
  }
  const product = await prisma.product.update({
    where: {
      id: parseInt(productId),
    },
    data: {
      name: productData.name,
      description: productData.description,
      image: productData.image,
      price: productData.price,
    },
  });
  res.send({
    data: product,
    message: "edit product success",
  });
});

app.patch("/product/:id", async (req, res) => {
  const productId = req.params.id;
  const productData = req.body;
  const product = await prisma.product.update({
    where: {
      id: parseInt(productId),
    },
    data: {
      name: productData.name,
      description: productData.description,
      image: productData.image,
      price: productData.price,
    },
  });
  res.send({
    data: product,
    message: "edit product success",
  });
});

app.listen(PORT, () => {
  console.log(`Express API running on port: ${PORT}`);
});
