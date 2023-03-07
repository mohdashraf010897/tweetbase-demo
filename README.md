# tweetbase-demo
The repo is just a simple project to categorize tweets based on the text entered. 

the pipeline code is written in javascript. 

1. The simpler, faster, and cheaper the architecture, the better. And the more interesting the categories, the better. It should not be simple keyword extraction. 
2. It will work like this. 
    1. the backend will receive an array of tweets via an API call 
    2. check if the tweet exists on the DB
    3. if not, use chatGPT to generate categories
    4. send back categorized tweets
