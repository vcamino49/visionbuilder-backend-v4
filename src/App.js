import React, { useState } from 'react';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState(null);
  const [image, setImage] = useState(null);

  const handleGenerate = async () => {
    const res = await fetch('https://visionbuilder-backend-v4-1.onrender.com/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    const data = await res.json();
    setResult(data);
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch('https://visionbuilder-backend-v4-1.onrender.com/api/upload', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    setImage(data.imageUrl);
  };

  return (
    <div className="App">
      <h1>VisionBuilder</h1>
      <input value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Enter design prompt..." />
      <button onClick={handleGenerate}>Generate</button>
      <br />
      <input type="file" onChange={handleUpload} />
      <br />
      {result && <div><h3>Response:</h3><p>{result.text}</p><img src={result.image_url} alt="Generated" width="300" /></div>}
      {image && <div><h3>Uploaded Image:</h3><img src={image} alt="Uploaded" width="300" /></div>}
    </div>
  );
}

export default App;