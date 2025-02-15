import React, { useState } from "react";

import Llamabot from "./Llamabot";

import "./App.css";

function App() {
  const [selectedIntent, setSelectedIntent] = useState(null);

  const handleIntentChange = (intent) => {
    setSelectedIntent(intent);
  };

  return (
    <div className="app-container">
      <h1 className="title">CHOOSE DEFCON AI INTENTS</h1>
      
      <div className="button-container">
       
        <button 
          onClick={() => handleIntentChange('llama')} 
          className="custom-button llama"
        >
          Use Llama (Chatbot)
        </button>
      </div>
      {selectedIntent === 'llama' && <Llamabot />} 
    </div>
  );
}

export default App;

