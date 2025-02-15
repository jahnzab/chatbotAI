// import React, { useState } from "react";
// // import Whisper from "./Whisper";
// import Llamabot from "./Llamabot";
// // import ImageCaptioning from "./ImageCaptioning";
// // import Generateimage from "./Generateimage";
// import "./App.css";

// function App() {
//   const [selectedIntent, setSelectedIntent] = useState(null);

//   const handleIntentChange = (intent) => {
//     setSelectedIntent(intent);
//   };

//   return (
//     <div className="app-container">
//       <h1 className="title">CHOOSE DEFCON AI INTENTS</h1>
      
//       <div className="button-container">
       
//         <button 
//           onClick={() => handleIntentChange('llama')} 
//           className="custom-button llama"
//         >
//           Use Llama (Chatbot)
//         </button>
//       </div>
//       {selectedIntent === 'llama' && <Llamabot />} 
//     </div>
//   );
// }

// export default App;


import React, { useState, useEffect } from "react";
import Llamabot from "./Llamabot";
// You can import other components like Whisper, ImageCaptioning, etc.
// import Whisper from "./Whisper";
// import ImageCaptioning from "./ImageCaptioning";
import "./App.css";

function App() {
  const [selectedIntent, setSelectedIntent] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");

  const handleIntentChange = (intent) => {
    setSelectedIntent(intent);
    setResponse(null); // Reset previous response when changing intent
  };

  // Handling API calls to your FastAPI backend (example for llama intent)
  const handleAskQuestion = async () => {
    setLoading(true);
    try {
      const res = await fetch("/.netlify/functions/chat/generate/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      setResponse(data.answer);
    } catch (error) {
      console.error("Error fetching response:", error);
      setResponse("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1 className="title">CHOOSE DEFCON AI INTENTS</h1>

      <div className="button-container">
        {/* Button for Llama Intent */}
        <button
          onClick={() => handleIntentChange("llama")}
          className="custom-button llama"
        >
          Use Llama (Chatbot)
        </button>

        {/* Button for Whisper Intent (future integration) */}
        {/* <button
          onClick={() => handleIntentChange("whisper")}
          className="custom-button whisper"
        >
          Whisper (Speech-to-Text)
        </button> */}

        {/* Button for Image Captioning Intent (future integration) */}
        {/* <button
          onClick={() => handleIntentChange("image-captioning")}
          className="custom-button image-captioning"
        >
          Image Captioning
        </button> */}
      </div>

      {/* Render Llama Bot if 'llama' intent is selected */}
      {selectedIntent === "llama" && (
        <div>
          <h2>Ask the Llama Bot</h2>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question..."
          />
          <button onClick={handleAskQuestion} disabled={loading}>
            {loading ? "Thinking..." : "Ask"}
          </button>

          {response && <p className="response">{response}</p>}
        </div>
      )}

      {/* You can add conditional rendering for other intents like Whisper, etc. */}
      {/* {selectedIntent === "whisper" && <Whisper />} */}
      {/* {selectedIntent === "image-captioning" && <ImageCaptioning />} */}
    </div>
  );
}

export default App;
