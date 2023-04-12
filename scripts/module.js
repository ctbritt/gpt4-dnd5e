Hooks.once("init", () => {
  console.log("GPT-4 D&D Rules | Initializing GPT-4 D&D Rules module");

  game.settings.register("gpt4-dnd5e", "apiKey", {
    name: "ChatGPT API Key",
    hint: "Enter your ChatGPT API key from OpenAI.",
    scope: "world", // The API key setting will be available only to the GM
    config: true,
    default: "",
    type: String,
  });
  game.settings.register("gpt4-dnd5e", "apiVersion", {
    name: "ChatGPT API Version",
    hint: "Choose the version of the ChatGPT API to use.",
    scope: "world",
    config: true,
    default: "gpt-3.5-turbo",
    type: String,
    choices: {
      "gpt-4": "GPT-4",
      "gpt-3.5-turbo": "GPT-3.5-turbo",
    },
  });
});

async function callGPT4Api(prompt) {
  const apiVersion = game.settings.get("gpt4-dnd5e", "apiVersion");
  console.log("apiVersion:", apiVersion);

  const GPT4_API_KEY = game.settings.get("gpt4-dnd5e", "apiKey");
  const WAIT_TIME = 5000;
  const APIURL = "https://api.openai.com/v1/chat/completions";
  const requestBody = {
    model: `${apiVersion}`,
    messages: [
      {
        role: "system",
        content:
          "You are a dungeon master running a Dungeons & Dragons 5th Edition game right now. I would like you to help me with running the game by coming up with ideas, answering questions, and improvising. Please keep responses as short as possible. Stick to the rules as much as possible and format spells, monsters, and conditions in the proper format",
      },
      { role: "user", content: `${prompt}` },
    ],
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GPT4_API_KEY}`,
    },
    body: JSON.stringify(requestBody),
  };

  let response = null;
  let retries = 0;

  while (!(response && response.ok) && retries < 5) {
    console.log(`Waiting OpenAI Reply (${retries})`);
    await new Promise((resolve) => setTimeout(resolve, WAIT_TIME));
    response = await fetch(APIURL, requestOptions);
    retries++;
  }

  console.log(response);
  if (response && response.ok) {
    const data = await response.json();
    console.log("data", data);
    return data.choices[0].message.content.trim();
  } else {
    throw new Error("API request timed out");
  }
}

Hooks.on("chatMessage", async (chatLog, message, chatData) => {
  // Check if the message starts with a specific command, like "?"
  if (message.startsWith("?")) {
    const question = message.slice(1).trim();

    const prompt = `You are a dungeon master running a Dungeons & Dragons 5th Edition game right now. I would like you to help me with running the game by coming up with ideas, answering questions, and improvising. Please keep responses as short as possible. Stick to the rules as much as possible and format spells, monsters, and conditions in the proper format. ${question}`;
    console.warn("================================");
    console.log("prompt", prompt);
    console.log("question", question);
    const answer = await callGPT4Api(prompt);

    if (answer != false) {
      // Create a new chat message with the answer
      let chatMessage = await ChatMessage.create({
        user: game.user._id,
        content: `<span class="gpt-answer">${answer}</span>`,
      });
    }
    // Prevent the original message from being displayed
    return false;
  }
});

