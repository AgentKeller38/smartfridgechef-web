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

// Clarifai Food Recognition API endpoint (correct structure)
app.post('/api/analyze-image', upload.single('image'), async (req, res) => {
  console.log('📸 Received image upload, file:', req.file?.originalname);
  
  try {
    if (!req.file) {
      console.error('❌ No file uploaded');
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const clarifaiToken = process.env.CLARIFAI_API_KEY;
    const clarifaiUserId = 'clarifai'; // Official Clarifai user
    const clarifaiAppId = 'food-item-recognition'; // Official food app
    
    if (!clarifaiToken) {
      console.error('❌ No Clarifai API key configured');
      return res.status(500).json({ error: 'Clarifai API key not configured' });
    }

    console.log('🔍 Calling Clarifai Food Recognition API...');
    
    // Convert image to base64
    const base64Image = req.file.buffer.toString('base64');
    
    // Clarifai 2024 API: POST /v2/users/{user_id}/apps/{app_id}/outputs
    const response = await axios.post(
      `https://api.clarifai.com/v2/users/${clarifaiUserId}/apps/${clarifaiAppId}/outputs`,
      {
        inputs: [
          {
            data: {
              image: {
                base64: base64Image
              }
            }
          }
        ]
      },
      {
        headers: {
          'Authorization': `Key ${clarifaiToken}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    console.log('✅ Clarifai API response received');
    
    const outputs = response.data.outputs || [];
    const concepts = outputs[0]?.data?.concepts || [];
    
    console.log('📊 Raw concepts:', concepts.length);

    // Filter for high-confidence food items (score > 0.5)
    const foodItems = concepts
      .filter(concept => concept.score > 0.5)
      .map(concept => concept.name)
      .slice(0, 10); // Top 10 items

    console.log('🥬 Detected food items:', foodItems);

    res.json({
      foodItems: foodItems,
      allConcepts: concepts.slice(0, 20).map(c => ({
        name: c.name,
        score: c.score
      })),
      detectedText: ''
    });

  } catch (error) {
    console.error('❌ Clarifai API error:', error.response?.data || error.message);
    if (error.response?.data) {
      console.error('❌ Full error:', JSON.stringify(error.response.data, null, 2));
    }
    res.status(500).json({ 
      error: 'Failed to analyze image with Clarifai',
      details: error.response?.data?.status?.description || error.message
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
