console.log('PORT:', process.env.PORT);
console.log('MYSQL_URL:', process.env.MYSQL_URL);


import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import TelegramBot from 'node-telegram-bot-api';

dotenv.config();

console.log('Starting server...');

// Initialize Telegram Bot
const botToken = '7850697198:AAHascQf-eyxVbXkledm4PuWvBFrElenu1g';
const chatId = '907009445';
const bot = new TelegramBot(botToken, { polling: false });

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
});


// Get all products
app.get('/products', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, price, category, images, description, stock, created_at FROM products');
    rows.forEach(row => {
      if (typeof row.images === 'string') {
        if (row.images.startsWith('[')) {
          try {
            row.images = JSON.parse(row.images);
            // Convert relative paths to full URLs
            row.images = row.images.map(img => `http://localhost:4000/uploads/${img}`);
          } catch (e) {
            console.error('Failed to parse images for product', row.id, e);
            row.images = [];
          }
        } else {
          // Old format: single image URL, convert to full URL
          row.images = [`http://localhost:4000/uploads/${row.images}`];
        }
      }
    });
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/products', async (req, res) => {
  const { name, price, images, category, description, stock } = req.body;
  if (!name || !price || !images || !Array.isArray(images)) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO products (name, price, images, category, description, stock) VALUES (?, ?, ?, ?, ?, ?)',
      [name, price, JSON.stringify(images), category || null, description || null, stock || null]
    );
    res.json({ id: result.insertId, name, price, images, category, description, stock });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.put('/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price, images, category, description, stock } = req.body;
  if (!name || !price || !images || !Array.isArray(images)) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    await pool.query(
      'UPDATE products SET name = ?, price = ?, images = ?, category = ?, description = ?, stock = ? WHERE id = ?',
      [name, price, JSON.stringify(images), category || null, description || null, stock || null, id]
    );
    res.json({ id, name, price, images, category, description, stock });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Delete a product
app.delete('/products/:id', async (req, res) => {
  const { id } = req.params;
  console.log('DELETE request for product id:', id);
  try {
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
    console.log('DELETE result:', result);
    if (result.affectedRows > 0) {
      res.json({ message: 'Product deleted' });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('DELETE error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Contact form endpoint
app.post('/contact', upload.single('image'), async (req, res) => {
  try {
    const { prenom, nom, telephone, description } = req.body;
    const imagePath = req.file ? req.file.path : null;

    if (!prenom || !nom || !telephone || !description) {
      return res.status(400).json({ error: 'Tous les champs requis doivent être remplis' });
    }

    const [result] = await pool.query(
      'INSERT INTO contact_requests (prenom, nom, telephone, description, image_path) VALUES (?, ?, ?, ?, ?)',
      [prenom, nom, telephone, description, imagePath]
    );

    res.json({
      message: 'Demande de contact envoyée avec succès',
      id: result.insertId
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi du formulaire de contact:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Custom orders endpoint (sans DB, juste Telegram)
app.post('/custom-orders', upload.array('images', 10), async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      projectType,
      budget,
      description,
      inspiration,
      deadline
    } = req.body;

    if (!name || !email || !projectType || !description) {
      return res.status(400).json({ error: 'Champs requis manquants' });
    }

    // Handle uploaded images
    const imagePaths = req.files ? req.files.map(file => file.path) : [];

    // Generate a unique ID for the order
    const orderId = Date.now();

    // Send Telegram notification
    const message = `
🔔 Nouvelle commande personnalisée !

👤 Nom: ${name}
📧 Email: ${email}
📱 Téléphone: ${phone || 'Non fourni'}
🎨 Type de projet: ${projectType}
💰 Budget: ${budget || 'Non spécifié'}
📝 Description: ${description}
💡 Inspiration: ${inspiration || 'Aucune'}
⏰ Délai souhaité: ${deadline || 'Non spécifié'}
🖼️ Images: ${imagePaths.length > 0 ? `${imagePaths.length} image(s) uploadée(s)` : 'Aucune'}

ID Commande: ${orderId}
    `;

    try {
      await bot.sendMessage(chatId, message);

      // Send images if any
      if (imagePaths.length > 0) {
        for (const imagePath of imagePaths) {
          try {
            await bot.sendPhoto(chatId, imagePath, {
              caption: `Image pour la commande #${orderId}`
            });
          } catch (imageError) {
            console.error('Erreur lors de l\'envoi de l\'image:', imageError);
          }
        }
      }

      console.log('Notification Telegram envoyée avec succès');
    } catch (telegramError) {
      console.error('Erreur lors de l\'envoi de la notification Telegram:', telegramError);
      return res.status(500).json({ error: 'Erreur lors de l\'envoi de la notification' });
    }

    res.json({
      message: 'Demande de création personnalisée envoyée avec succès',
      id: orderId
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la commande personnalisée:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Custom orders endpoints removed (no DB)

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
