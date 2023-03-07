import React from "react";
import ReactDOM from "react-dom/client";
import { useState } from "react";
import axios from "axios";

import "./index.css";

axios.create({
  baseURL: "http://localhost:8000",
});
function App() {
  const [inputValue, setInputValue] = useState("");
  const [categorizedTweets, setCategorizedTweets] = useState([
    {
      tweet:
        "Hey. I got a job in tech after months and months and months of learning and building and all that shit. It's Sunday night and tomorrow I work from my home office. All your hard work should pay off. Keep going.",
      categories: [
        "Career Success",
        "Technology",
        "Perseverance",
        "Motivation",
      ],
    },
  ]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/categorize", {
        tweets: [inputValue],
      });
      setCategorizedTweets([
        ...categorizedTweets,
        ...response.data.categorizedTweets,
      ]);
    } catch (err) {
      console.log(err);
    }

    setInputValue("");
  };

  return (
    <div>
      {" "}
      <header>
        <h1>Tweet Categorization App</h1>
      </header>
      <form onSubmit={handleSubmit}>
        <label>
          Enter a tweet:
          <input type="text" value={inputValue} onChange={handleInputChange} />
        </label>
        <button type="submit">Categorize</button>
      </form>
      <h2>Categories:</h2>
      <ul>
        {categorizedTweets?.map((tweet, index) => (
          <li className="tweet-wrapper" key={index}>
            <i>{tweet.tweet}</i>
            <ul>
              {tweet.categories.map((category, index) => (
                <li className="category" key={index}>
                  {category}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
