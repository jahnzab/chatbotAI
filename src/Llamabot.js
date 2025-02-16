import React, { useState, useRef } from "react";
import axios from "axios";
import "./Llama.css";

const Llamabot = () => {
  const [userInput, setUserInput] = useState("");
  const [chatLog, setChatLog] = useState([
    { role: "assistant", content: "Hello! How can I assist you today?" },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Speech Recognition Setup with Proper Check
  let recognition = null;
  if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setUserInput(transcript);
    };
  } else {
    console.warn("Speech recognition is not supported in this browser.");
  }

  // Send message to FastAPI
  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const newChatLog = [...chatLog, { role: "user", content: userInput }];
    setChatLog(newChatLog);
    setUserInput("");
    setIsTyping(true);

    try {
      const response = await axios.post(
        "/api/generate/", 
        { question: userInput },
        { headers: { "Content-Type": "application/json" } }
      );
      
      
      const botResponse = response.data.answer; // Corrected response format
      setChatLog([...newChatLog, { role: "assistant", content: botResponse }]);
    } catch (error) {
      console.error("Error communicating with FastAPI:", error);
      setChatLog([
        ...newChatLog,
        { role: "assistant", content: "Something went wrong. Please try again later." },
      ]);
    } finally {
      setIsTyping(false);
      scrollToBottom();
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // Start voice recognition
  const startListening = () => {
    if (recognition) {
      recognition.start();
    } else {
      alert("Speech recognition is not supported in your browser.");
    }
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Left side container */}
      <div
        style={{
          width: "550px",
          height: "88vh",
          position: "absolute",
          left: "450px",
          top: "70px",
          backgroundColor: "#2B2A33",
          padding: "10px",
          color: "white",
          fontFamily: "Arial, sans-serif",
          borderRadius: "10px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          margin: "10px",
        }}
      >
        <h1 style={{ textAlign: "center" }}>Jahanzaib's Chatbot</h1>

        <div style={{ flex: 1, overflowY: "auto", marginTop: "10px" }}>
          {chatLog.map((msg, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  backgroundColor: "black",
                  color: "white",
                  padding: "10px",
                  borderRadius: "10px",
                  maxWidth: msg.role === "user" ? "35%" : "80%",
                  textAlign: "left",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div style={{ color: "gray", marginBottom: "10px" }}>
              Assistant is typing...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div
          style={{
            display: "flex",
            backgroundColor: "#2B2A33",
            borderRadius: "10px",
            padding: "10px",
            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
            marginTop: "10px",
          }}
        >
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              backgroundColor: "black",
              color: "white",
            }}
            placeholder="HOW CAN I HELP YOU..."
          />
          <button
            onClick={handleSendMessage}
            style={{
              marginLeft: "10px",
              padding: "10px 15px",
              borderRadius: "5px",
              backgroundColor: "#007BFF",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Send
          </button>
          <button
            onClick={startListening}
            style={{
              marginLeft: "10px",
              padding: "10px 15px",
              borderRadius: "5px",
              backgroundColor: isListening ? "red" : "#28A745",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            {isListening ? "Listening..." : "Start Listening"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Llamabot;