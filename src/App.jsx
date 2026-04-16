import { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import './styles/index.css';

function App() {
  const [image, setImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [detectedItems, setDetectedItems] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState('');
  const [step, setStep] = useState('camera');
  const webcamRef = useRef(null);

  const captureImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImage(imageSrc);
      setStep('analyze');
    }
  };

  const retakePhoto = () => {
    setImage(null);
    setStep('camera');
    setDetectedItems([]);
    setRecipes([]);
    setError('');
  };

  const analyzeImage = async () => {
    setAnalyzing(true);
    setError('');
    setStep('analyzing');

    try {
      // Convert base64 to blob
      const response = await fetch(image);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append('image', blob, 'fridge.jpg');

      // Call Clarifai via our backend
      const apiResponse = await fetch('/api/analyze-image', {
        method: 'POST',
        body: formData
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(errorData.details || 'Failed to analyze image');
      }

      const data = await apiResponse.json();
      console.log('🥬 Clarifai detected:', data.foodItems);
      
      setDetectedItems(data.foodItems);

      if (data.foodItems.length > 0) {
        // Get recipes based on detected items
        const recipesResponse = await fetch('/api/get-recipes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ingredients: data.foodItems })
        });

        if (recipesResponse.ok) {
          const recipesData = await recipesResponse.json();
          setRecipes(recipesData.recipes);
        } else {
          console.log('⚠️ No recipes API, showing demo recipes');
          // Demo recipes fallback
          setRecipes([
            {
              id: 1,
              title: `Gericht mit ${data.foodItems[0]} und ${data.foodItems[1] || 'Gemüse'}`,
              image: 'https://spoonacular.com/recipeImages/641129-312x231.jpg',
              readyInMinutes: 20,
              servings: 2,
              sourceUrl: 'https://spoonacular.com',
              usedIngredients: data.foodItems.slice(0, 3),
              missedIngredients: []
            },
            {
              id: 2,
              title: 'Gesunder Mix-Salat',
              image: 'https://spoonacular.com/recipeImages/641129-312x231.jpg',
              readyInMinutes: 15,
              servings: 2,
              sourceUrl: 'https://spoonacular.com',
              usedIngredients: data.foodItems.slice(0, 2),
              missedIngredients: ['Olivenöl', 'Zitronensaft']
            }
          ]);
        }
      } else {
        setError('Keine Lebensmittel erkannt. Bitte mache ein helleres Foto mit klareren Zutaten.');
        setStep('analyze');
        setAnalyzing(false);
        return;
      }

      setStep('results');
    } catch (err) {
      console.error('Analysis error:', err);
      setError(`Fehler bei der Analyse: ${err.message}. Bitte versuche es erneut.`);
      setStep('analyze');
    } finally {
      setAnalyzing(false);
    }
  };

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: 'environment'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-700 mb-2">
            🧊 Smart Fridge Chef
          </h1>
          <p className="text-gray-600">
            KI-gestützte Lebensmittel-Erkennung mit Rezeptvorschlägen
          </p>
          <div className="mt-2 bg-green-100 border border-green-300 text-green-800 px-3 py-1 rounded-lg inline-block text-sm">
            ✨ Echte KI-Bilderkennung aktiv! (Clarifai)
          </div>
        </header>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
            <button onClick={() => setError('')} className="float-right font-bold">×</button>
          </div>
        )}

        {/* Step Indicator */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'camera' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>1</div>
            <div className="text-sm">Foto</div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'analyzing' || step === 'analyze' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>2</div>
            <div className="text-sm">KI-Analyse</div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'results' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>3</div>
            <div className="text-sm">Rezepte</div>
          </div>
        </div>

        {/* Camera View */}
        {step === 'camera' && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="relative">
              <Webcam
                ref={webcamRef}
                audio={false}
                videoConstraints={videoConstraints}
                screenshotFormat="image/jpeg"
                className="w-full rounded-lg"
              />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <button
                  onClick={captureImage}
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg transition transform hover:scale-105"
                >
                  📸 Foto machen
                </button>
              </div>
            </div>
            <p className="text-center text-gray-500 mt-4">
              Richte die Kamera auf den Kühlschrank-Inhalt. Gute Beleuchtung verbessert die Erkennung!
            </p>
          </div>
        )}

        {/* Image Preview & Analyze */}
        {step === 'analyze' && !analyzing && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <img src={image} alt="Captured fridge" className="w-full rounded-lg mb-4" />
            <div className="flex space-x-4">
              <button
                onClick={retakePhoto}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold"
              >
                🔄 Neu machen
              </button>
              <button
                onClick={analyzeImage}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold"
              >
                ✨ KI-Analyse starten
              </button>
            </div>
          </div>
        )}

        {/* Analyzing */}
        {step === 'analyzing' && analyzing && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-xl text-gray-700">🤖 KI analysiert deine Zutaten...</p>
            <p className="text-gray-500 mt-2">Das dauert nur wenige Sekunden</p>
            <div className="mt-4 text-sm text-gray-400">
              Powered by Clarifai Food Recognition
            </div>
          </div>
        )}

        {/* Results */}
        {step === 'results' && (
          <div className="space-y-6">
            {/* Detected Items */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-green-700 mb-4">
                🥬 Erkannte Lebensmittel
              </h2>
              {detectedItems.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {detectedItems.map((item, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-medium animate-pulse"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Keine Lebensmittel erkannt</p>
              )}
              <p className="text-sm text-gray-500 mt-3">
                📊 {detectedItems.length} Zutaten von der KI identifiziert
              </p>
            </div>

            {/* Recipe Suggestions */}
            {recipes.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-bold text-blue-700 mb-4">
                  🍳 Rezeptvorschläge basierend auf deinen Zutaten
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {recipes.map((recipe) => (
                    <div
                      key={recipe.id}
                      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition"
                    >
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-2">{recipe.title}</h3>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <span>⏱️ {recipe.readyInMinutes} Min</span>
                          <span className="mx-2">•</span>
                          <span>👥 {recipe.servings} Portionen</span>
                        </div>
                        {recipe.usedIngredients.length > 0 && (
                          <div className="text-sm text-green-600 mb-2">
                            <strong>✅ Hast du:</strong> {recipe.usedIngredients.slice(0, 3).join(', ')}
                          </div>
                        )}
                        {recipe.missedIngredients.length > 0 && (
                          <div className="text-sm text-orange-600 mb-3">
                            <strong>⚠️ Fehlt:</strong> {recipe.missedIngredients.slice(0, 2).join(', ')}
                          </div>
                        )}
                        <a
                          href={recipe.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition"
                        >
                          Rezept ansehen →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Start Over */}
            <div className="text-center">
              <button
                onClick={retakePhoto}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg transition transform hover:scale-105"
              >
                🔄 Neues Foto machen
              </button>
            </div>
          </div>
        )}

        {/* Info Card */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-800">
            <strong>💡 Tipps für beste Ergebnisse:</strong>
            Mache ein gut ausgeleuchtetes Foto. Halte die Kamera stabil und achte darauf,
            dass die Lebensmittel klar sichtbar sind. Die KI erkennt über 1.000 verschiedene Lebensmittel!
          </p>
          <p className="text-xs text-blue-600 mt-2">
            📊 Free-Tier: 1.000 Analysen/Monat (ca. 33/Tag)
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
