const express = require("express");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());

const API_KEY = process.env.OPENAI_API_KEY;
const configuration = new Configuration({
  apiKey: API_KEY || "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",
});
const openai = new OpenAIApi(configuration);

const categorizedTweets = {};

async function categorizeTweets(tweets) {
  const requestBody = {
    model: "text-davinci-003",
    temperature: 1,
    prompt:
      "categorize these tweets - " +
      tweets +
      " Also respond with multiple befitting categories and understand text semantically too. The categories can be random. Sample Response for 'As a developer, do you prefer learning from videos, blogs, or books?' - '['Education', 'Technology', 'Learning','Dev Life', 'Dev chooses best']` Respond with array of arrays for multiple tweets. You can sound like a young teenager willing to utilise every neuron of his brains, sound witty trying to produce its own non-standard categories",
    max_tokens: 3800,
  };

  try {
    const response = await openai.createCompletion(requestBody);

    return response.data.choices[0].text
      .trim()
      .split("\n")
      .map((category) => {
        return category.replace(/[\[\]]/g, "").split(",");
      });
  } catch (error) {
    console.error(error);
  }
}

app.use("/", (req, res) => {
  res.send("Greetings from categorizer server");
});

app.post("/categorize", async (req, res) => {
  const tweets = req.body.tweets;

  if (categorizedTweets[tweets]) {
    console.log(`Returning cached categories for ${tweets}`);
    res.json({ categories: categorizedTweets[tweets] });
    return;
  }

  console.log(`Categorizing tweets: ${tweets}`);

  const categories = await categorizeTweets(tweets);

  categorizedTweets[tweets] = categories;

  res.json({ categories });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
