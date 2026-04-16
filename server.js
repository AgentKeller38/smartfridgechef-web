import express from 'express';
import multer from 'multer';
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5173;

// Middleware
app.use(express.json());
app.use(express.static('dist'));

// Image upload setup
const upload = multer({ dest: 'uploads/' });

// Google Vision API endpoint
app.post('/api/analyze-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const base64Image = req.file.buffer.toString('base64');
    
    const visionApiKey = process.env.GOOGLE_VISION_API_KEY;
    if (!visionApiKey) {
      return res.status(500).json({ error: 'Google Vision API key not configured' });
    }

    const response = await axios.post(
      `https://vision.googleapis.com/v1/images:annotate?key=${visionApiKey}`,
      {
        requests: [
          {
            image: { content: base64Image },
            features: [
              { type: 'LABEL_DETECTION', maxResults: 20 },
              { type: 'TEXT_DETECTION', maxResults: 10 }
            ]
          }
        ]
      }
    );

    const labels = response.data.responses[0].labelAnnotations || [];
    const textAnnotations = response.data.responses[0].textAnnotations || [];

    // Extract potential food items from labels
    const foodItems = labels
      .filter(label => 
        label.description.toLowerCase().includes('food') ||
        label.description.toLowerCase().includes('fruit') ||
        label.description.toLowerCase().includes('vegetable') ||
        label.description.toLowerCase().includes('meat') ||
        label.description.toLowerCase().includes('cheese') ||
        label.description.toLowerCase().includes('bread') ||
        label.description.toLowerCase().includes('egg') ||
        label.description.toLowerCase().includes('milk') ||
        label.description.toLowerCase().includes('drink') ||
        label.description.toLowerCase().includes('snack')
      )
      .map(label => label.description);

    // Also include text detected (could be product names)
    const detectedText = textAnnotations.slice(1).map(t => t.description).join(' ');

    res.json({
      labels: labels.map(l => ({ description: l.description, score: l.score })),
      foodItems: [...new Set([...foodItems, ...detectedText.split('\n')].filter(Boolean))],
      detectedText
    });

  } catch (error) {
    console.error('Vision API error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to analyze image' });
  }
});

// Spoonacular Recipe API endpoint
app.post('/api/get-recipes', async (req, res) => {
  try {
    const { ingredients } = req.body;
    
    if (!ingredients || ingredients.length === 0) {
      return res.status(400).json({ error: 'No ingredients provided' });
    }

    const spoonacularApiKey = process.env.SPOONACULAR_API_KEY;
    if (!spoonacularApiKey) {
      return res.status(500).json({ error: 'Spoonacular API key not configured' });
    }

    const ingredientString = ingredients.join(',');

    const response = await axios.get(
      'https://api.spoonacular.com/recipes/complexSearch',
      {
        params: {
          apiKey: spoonacularApiKey,
          ingredients: ingredientString,
          number: 5,
          ranking: 1,
          ignorePantryIngredients: true
        }
      }
    );

    const recipes = response.data.results.map(recipe => ({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      readyInMinutes: recipe.readyInMinutes,
      servings: recipe.servings,
      sourceUrl: recipe.sourceUrl,
      usedIngredients: recipe.usedIngredients.map(ing => ing.name),
      missedIngredients: recipe.missedIngredients.map(ing => ing.name)
    }));

    res.json({ recipes });

  } catch (error) {
    console.error('Spoonacular API error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Handy-Zugriff: http://<DEINE-IP>:${PORT}`);
});
