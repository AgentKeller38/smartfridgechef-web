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
  console.log('📸 Received image upload, file:', req.file?.originalname);
  
  try {
    if (!req.file) {
      console.error('❌ No file uploaded');
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const base64Image = req.file.buffer.toString('base64');
    console.log('📷 Image size:', base64Image.length, 'bytes');
    
    const visionApiKey = process.env.GOOGLE_VISION_API_KEY;
    if (!visionApiKey) {
      console.error('❌ No Vision API key configured');
      return res.status(500).json({ error: 'Google Vision API key not configured' });
    }

    console.log('🔍 Calling Google Vision API...');
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
      },
      { timeout: 30000 }
    );

    console.log('✅ Vision API response received');
    console.log('📊 Full response:', JSON.stringify(response.data, null, 2));

    const labels = response.data.responses?.[0]?.labelAnnotations || [];
    const textAnnotations = response.data.responses?.[0]?.textAnnotations || [];

    // Extract potential food items from labels - broader matching
    const foodKeywords = [
      'food', 'fruit', 'vegetable', 'meat', 'cheese', 'bread', 
      'egg', 'milk', 'drink', 'snack', 'tomato', 'lettuce', 
      'onion', 'potato', 'carrot', 'apple', 'banana', 'orange',
      'chicken', 'beef', 'pork', 'fish', 'rice', 'pasta',
      'salad', 'cucumber', 'pepper', 'mushroom', 'broccoli'
    ];

    const foodItems = labels
      .filter(label => {
        const desc = label.description.toLowerCase();
        return foodKeywords.some(keyword => desc.includes(keyword));
      })
      .map(label => label.description);

    // Also include text detected (could be product names)
    const detectedText = textAnnotations.slice(1).map(t => t.description).join(' ');
    const textItems = detectedText.split(/[\s\n]+/).filter(t => t.length > 2);

    const allItems = [...new Set([...foodItems, ...textItems].filter(Boolean))];
    
    console.log('🥬 Detected items:', allItems);

    res.json({
      labels: labels.map(l => ({ description: l.description, score: l.score })),
      foodItems: allItems,
      detectedText
    });

  } catch (error) {
    console.error('❌ Vision API error:', error.response?.data || error.message);
    console.error('❌ Error details:', JSON.stringify(error.response?.data, null, 2));
    res.status(500).json({ 
      error: 'Failed to analyze image',
      details: error.response?.data?.error?.message || error.message
    });
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
