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
	if (userPermission < minimumPermissions) {
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
					`You are a game master running a ${game.settings.get(modulename, 'gameSystem')} game right now. I would like you to help me with running the game by coming up with ideas, answering questions, and improvising. Please keep responses as short as possible. Stick to the rules as much as possible and format spells, monsters, and conditions in the proper format. If you do not know the answer, do not make things up; simply say you do not know.`
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

	const response = await retryFetch(APIURL, requestOptions);

	if (response.ok) {
		const data = await response.json();
		console.log('data', data);
		return data.choices[0].message.content.trim();
	} else {
		throw new Error('API request failed');
	}
}

Hooks.on('chatMessage', async (chatLog, message, chatData) => {
	if (message.startsWith('?')) {
		const question = message.slice(1).trim();

		const prompt = `You are a game master running a ${game.settings.get(modulename, 'gameSystem')} game right now. I would like you to help me with running the game by coming up with ideas, answering questions, and improvising. Please keep responses as short as possible. Stick to the rules as much as possible and format spells, monsters, and conditions in the proper format. If you do not know the answer, do not make things up; simply say you do not know. ${question}`;

		console.warn('================================');
		console.log('prompt', prompt);
		console.log('question', question);

		try {
			const answer = await callGPT4Api(prompt);

			if (answer != false) {
				const publicMessage = game.settings.get(modulename, 'publicMessages');
				const chatMessage = await ChatMessage.create({
					user: game.user._id,
					content: `<span class="gpt-answer">${answer}</span>`,
					whisper: publicMessage ? [] : ChatMessage.getWhisperRecipients('GM'),
				});
			}
		} catch (error) {
			console.error(error);
			ui.notifications.error('Failed to complete request');
		}

		return false;
	}
});

async function retryFetch(url, options, retries = 5) {
	let response;

	while (retries > 0) {
		console.log(`Waiting OpenAI Reply (${retries})`);
		await new Promise((resolve) => setTimeout(resolve, 5000));
		response = await fetch(url, options);
		retries--;

		if (response.ok) {
			return response;
		}
	}

	throw new Error('API request timed out');
}
