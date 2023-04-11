// Add this import statement at the top of the file
// import { ApiKeyForm } from "./ApiKeyForm.js";

Hooks.once("init", () => {
  console.log("GPT-4 D&D Rules | Initializing GPT-4 D&D Rules module");

  game.settings.register("gpt4-dnd5e", "apiKey", {
    name: "ChatGPT API Key",
    hint: "Enter your ChatGPT API key from OpenAI.",
    scope: "world", // The API key setting will be available only to the GM
    config: true,
    default: "",
    type: String,
  }
  );
  game.settings.register("gpt4-dnd5e", "apiVersion", {
    name: "ChatGPT API Version",
    hint: "Choose the version of the ChatGPT API to use.",
    scope: "world",
    config: true,
    default: "gpt-3.5",
    type: String,
    choices: {
      "gpt-4": "GPT-4",
      "gpt-3.5": "GPT-3.5",
    },
  });

});

async function callGPT4Api(prompt) {
  const apiVersion = game.settings.get("gpt4-dnd5e", "apiVersion");
  const GPT4_API_KEY = game.settings.get("gpt4-dnd5e", "apiKey");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GPT4_API_KEY}`,
    },
    body: JSON.stringify({
      model: apiVersion,
      messages: [
        { role: "system", content: "Dungeons & Dragons 5e" },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 150,
      n: 1,
      stop: null,
      temperature: 0.5,
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

Hooks.on("chatMessage", async (chatLog, message, chatData) => {
  // Check if the message starts with a specific command, like "!gpt4"
  if (message.startsWith("?")) {
    const question = message.slice(1).trim();

    const prompt = `I am a dungeon master running a game right now.I would like you to help me with running the game by coming up with ideas, and answering questions, and improving. Please keep responses as short as possible. Stick to the rules as much as possible and format spells, monsters, and conditions in the proper format. ${question}`;
    const answer = await callGPT4Api(prompt);

    // Create a new chat message with the answer
    let chatMessage = await ChatMessage.create({
      user: game.user._id,
      content: `<span class="gpt-answer">${answer}</span>`,
    });

    // Prevent the original message from being displayed
    return false;
  }
});
