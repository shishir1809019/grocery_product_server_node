import express from 'express';
import mysql from 'mysql2';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = 8000;

app.use(bodyParser.json());
app.use(cors());

// Create a connection to the MySQL database
const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});


app.post('/products', (req, res) => {
  const { name, price, description, photo_url, product_in_stock } = req.body;
  const productData = {
    name,
    price,
    description,
    photo_url,
    product_in_stock,
  };

  connection.query('INSERT INTO grocery_list SET ?', productData, (err, results) => {
    if (err) {
      console.error('Error inserting product:', err);
      res.status(500).send('Error inserting product');
      return;
    }
    console.log('Product inserted successfully:', results);
    res.status(201).send('Product inserted successfully');
  });
});

// Get all grocery products
app.get('/products', (req, res) => {
  connection.query('SELECT * FROM grocery_list', (err, results) => {
    if (err) {
      console.error('Error fetching products:', err);
      res.status(500).send('Error fetching products');
      return;
    }
    res.status(200).json(results);
  });
});

// Start the server
app.get("/", (req, res) => {
  res.send("Grocery Product");
});
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
