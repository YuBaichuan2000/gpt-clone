import { useState, useEffect } from "react";

const App = () => {
  // user input
  const [value, setValue] = useState("");
  // response from chatgpt
  const [messages, setMessages] = useState(null);
  // all previous chat history
  const [previousChats, setPreviousChats] = useState([]);
  // current chat
  const [currentChat, setCurrentChat] = useState(null);

  const getMessages = async () => {
    const options = {
      method: "POST",
      body: JSON.stringify({ message: value }),
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await fetch("http://localhost:8000/completions", options);
      const data = await response.json();

      console.log(data);

      setMessages(data.choices[0].message.content);
    } catch (error) {
      console.log(error);
    }
  };

  const createNewChat = () => {
    setCurrentChat(null);
    setMessages(null);
    setValue('');
  };

  useEffect(() => {
    if (!currentChat && value && messages) {
      setCurrentChat(value)
      
    }
    if (currentChat && value && messages) {
      setPreviousChats(previousChats => ([...previousChats, 
        {title: currentChat, role: "user", content: value},
        {title: currentChat, role: "assistant", content: messages}]))
      setValue('');
    }
    
  }, [messages, currentChat])

  const currentChats = previousChats.filter((chat) => chat.title === currentChat);
  const uniqueChats = Array.from(new Set(previousChats.map((chat) => chat.title)));

  return (
    <div className="App">
      <section className="side-bar">
        <button onClick={createNewChat}>+ New Chat</button>
        <ul className="history">
          {uniqueChats?.map((chat, index) => (
            <li key={index} onClick={() => setCurrentChat(chat)}>
              {chat}
            </li>
          ))}
        </ul>
        <nav>
          <p>
            <a href="https://www.linkedin.com/in/george-yu-a6800a227/" target="_blank" rel="noopener noreferrer">
              Made By George Yu
            </a>
          </p>
        </nav>
      </section>
      <section className="main">
        <h1>FakeGPT</h1>
        <ul className="feed">
          {currentChats?.map((chat, index) => (
            <li key={index} className={chat.role}>
              <p>{chat.content}</p>
            </li>
          ))}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input value={value} onChange={(e) => setValue(e.target.value)} />
            <div id="submit" onClick={getMessages}>
              ➤
            </div>
          </div>
          <p className="info">FakeGPT can make mistakes. Check important info from ChatGPT.</p>
        </div>
      </section>
    </div>
  );
};

export default App;
