import { registerSettings } from './settings.js';
const modulename = 'gpt4-dnd5e';
Hooks.once('init', () => {
	console.log('GPT-4 D&D Rules | Initializing GPT-4 D&D Rules module');

	registerSettings();
});

async function callGPT4Api(prompt) {
	const apiVersion = game.settings.get(modulename, 'apiVersion');
	console.log('apiVersion:', apiVersion);
	const minimumPermissions = game.settings.get(modulename, 'minimumPermission');
	const userPermission = game.user.data.role;
	if (game.user.data.role < minimumPermissions) {
		ui.notifications.info("You don't have permission to use this module.");
		return false;
	}

	const GPT4_API_KEY = game.settings.get(modulename, 'apiKey');
	const WAIT_TIME = 5000;
	const APIURL = 'https://api.openai.com/v1/chat/completions';
	const requestBody = {
		model: apiVersion,
		messages: [
			{
				role: 'system',
				content:
					'You are a dungeon master running a Dungeons & Dragons 5th Edition game right now. I would like you to help me with running the game by coming up with ideas, answering questions, and improvising. Please keep responses as short as possible. Stick to the rules as much as possible and format spells, monsters, and conditions in the proper format',
			},
			{ role: 'user', content: `${prompt}` },
		],
	};

	const requestOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${GPT4_API_KEY}`,
		},
		body: JSON.stringify(requestBody),
	};

	let response = {};
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
		console.log('data', data);
		return data.choices[0].message.content.trim();
	} else {
		throw new Error('API request timed out');
	}
}

Hooks.on('chatMessage', async (chatLog, message, chatData) => {
	// Check if the message starts with a specific command, like "?"
	const publicMessage = game.settings.get(modulename, 'publicMessages');
	if (message.startsWith('?')) {
		const question = message.slice(1).trim();

		const prompt = `You are a dungeon master running a Dungeons & Dragons 5th Edition game right now. I would like you to help me with running the game by coming up with ideas, answering questions, and improvising. Please keep responses as short as possible. Stick to the rules as much as possible and format spells, monsters, and conditions in the proper format. ${question}`;
		console.warn('================================');
		console.log('prompt', prompt);
		console.log('question', question);
		const answer = await callGPT4Api(prompt);

		if (answer != false) {
			// Create a new chat message with the answer
			let chatMessage = await ChatMessage.create({
				user: game.user._id,
				content: `<span class="gpt-answer">${answer}</span>`,
				whisper: publicMessage ? [] : ChatMessage.getWhisperRecipients('GM'),
			});
		}
		// Prevent the original message from being displayed
		return false;
	}
});