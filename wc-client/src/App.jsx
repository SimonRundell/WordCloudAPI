import { useState } from 'react'
import './App.css'

function App() {
  const [text, setText] = useState('')
  const [cloudData, setCloudData] = useState(null)

  const generateCloud = async (inputText) => {
    // Clean and process text
    const cleanedText = inputText.replace(/[^\w\s]/g, '').toLowerCase();
    const words = cleanedText.split(/\s+/).filter(Boolean);

    // Count word occurrences
    const wordCount = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });

    // Prepare payload for API
    const jsonBody = {
      words: Object.entries(wordCount).map(([word, count]) => ({
      text: word,
      value: count
      })),
      options: {
      width: 800,
      height: 600,
      backgroundColor: "#ffffff",
      colorScheme: [
        "#e74c3c",
        "#3498db",
        "#2ecc71",
        "#f1c40f",
        "#9b59b6",
        "#34495e"
      ]
      }
    };

console.log('Sending JSON body:', jsonBody);

    try {
      const response = await fetch('http://localhost:3000/api/wordcloud/advanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonBody)
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setCloudData(imageUrl);
    } catch (error) {
      console.error('Error:', error);
      setCloudData(null);
    }
  };
  if (cloudData) {
    return (
      <div>
        <h1>Word Cloud</h1>
        <img src={cloudData} alt="Word Cloud" />
      </div>
    )
  }
  return (
    <>
      <div>
        <h1>WordCloud Client</h1>

    <textarea className="textarea" placeholder="Type your text here..." onChange={(e) => setText(e.target.value)} value={text} rows="10" cols="50">
    </textarea>

    <button className="topgap" onClick={() => generateCloud(text)}>Generate Word Cloud</button>


      </div>
    </>
  )
}

export default App
