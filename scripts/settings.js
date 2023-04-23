export const registerSettings = function () {
	// Register any custom module settings here
	let modulename = 'gpt4-dnd5e';

	let permissions = {
		1: 'Player',
		2: 'Trusted Player',
		3: 'Assistant GM',
		4: 'Game Master',
	};

	game.settings.register(modulename, 'apiKey', {
		name: 'ChatGPT API Key',
		hint: 'Enter your ChatGPT API key from OpenAI.',
		scope: 'world', // The API key setting will be available only to the GM
		config: true,
		default: '',
		type: String,
	});

	game.settings.register(modulename, 'apiVersion', {
		name: 'ChatGPT API Version',
		hint: 'Choose the version of the ChatGPT API to use.',
		scope: 'world',
		config: true,
		default: 'gpt-3.5-turbo',
		type: String,
		choices: {
			'gpt-4': 'GPT-4',
			'gpt-3.5-turbo': 'GPT-3.5-turbo',
		},
	});

	game.settings.register(modulename, 'publicMessages', {
		name: 'Make GPT messages public',
		hint: 'If checked, GPT messages will be visible to all players',
		scope: 'world',
		config: true,
		default: false,
		type: Boolean,
	});

	game.settings.register(modulename, 'minimumPermission', {
		name: 'Minimum permission to use GPT module',
		hint: 'Choose the minimum permission level for users to use this module',
		scope: 'world',
		config: true,
		default: 3,
		type: String,
		choices: permissions,
	});
};
