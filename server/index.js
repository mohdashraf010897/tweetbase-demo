const express = require("express");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());

const categorizedTweets = {};

app.post("/categorize", async (req, res) => {
  const tweets = req.body.tweets;

  if (!Array.isArray(tweets)) {
    res.status(400).send("tweets must be an array");
    return;
  }

  const finalResults = [];

  for (const tweet of tweets) {
    if (categorizedTweets[tweet]) {
      console.log(`Returning cached categories for ${tweet}`);
      finalResults.push({ tweet, categories: categorizedTweets[tweet] });
    } else {
      const { tweet: resTweet, categories: responseCategories } =
        (await categorizeTweet(tweet)) ?? {};
      console.log(`Categorizing tweet: ${tweet}`, resTweet, responseCategories);
      if (!responseCategories) {
        continue;
      }
      categorizedTweets[resTweet] = responseCategories;

      finalResults.push({ tweet, categories: responseCategories });
    }
  }

  res.json({ categorizedTweets: finalResults });
});

async function categorizeTweet(tweet) {
  const API_KEY = process.env.OPENAI_API_KEY;
  if (!API_KEY) {
    throw Error("API key not found!");
  }
  const configuration = new Configuration({
    apiKey: API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  const requestBody = {
    model: "text-davinci-003",
    temperature: 1,
    prompt: `categorize this tweet - "${tweet}". Also respond with multiple befitting categories and understand text semantically too. The categories can be random. Sample Response for 'As a developer, do you prefer learning from videos, blogs, or books?' - '['Education', 'Technology', 'Learning','Dev Life', 'Dev chooses best']' Respond with a json object containing the original tweet and categories`,
    max_tokens: 3800,
  };

  try {
    const response = await openai.createCompletion(requestBody);
    console.log(
      "🚀 ~ file: index.js:57 ~ categorizeTweet ~ response:",
      response.data.choices
    );

    let categories = [];
    const regex = /(\[.*\])|(\{.*\})/gm;
    const match = regex.exec(
      response.data.choices[0].text.replace(/[\r\n]/gm, "")
    );
    if (match) {
      categories = match[0];
      return JSON.parse(categories);
    }
    return { tweet, categories };
  } catch (error) {
    console.error(error);
    return null;
  }
}

app.use("/", (req, res) => {
  res.send("Greetings from categorizer server");
});
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
