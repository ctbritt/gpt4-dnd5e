// Add this import statement at the top of the file
import { ApiKeyForm } from './ApiKeyForm.js';

Hooks.once('init', () => {
  console.log('GPT-4 D&D Rules | Initializing GPT-4 D&D Rules module');

  game.settings.registerMenu('gpt4-dnd5e', 'apiKeyForm', {
	name: 'ChatGPT API Key',
	// hint: 'Enter your ChatGPT API key from OpenAI.',
	label: `Set ChatGPT API Key`,
	icon: `fas fa-key`,
	type: ApiKeyForm,
	// scope: 'world', // The API key setting will be available only to the GM
	restricted: true,
	// config: true,
	// default: '',
	// type: String
  });
});
async function callGPT4Api( prompt ) {
	const GPT4_API_KEY = game.settings.get('gpt4-dnd5e', 'apiKey');

	const response = await fetch( 'https://api.openai.com/v1/chat/completions', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${GPT4_API_KEY}`
		},
		body: JSON.stringify( {
			model: "gpt-3.5-turbo",
			messages: [
				{ 'role': 'user', 'content': prompt }
			],
			max_tokens: 200,
			n: 1,
			stop: null,
			temperature: 0.5
		} )
	} );

	const data = await response.json( );
	return data.choices[ 0 ].message.content.trim( );
}

Hooks.on( 'chatMessage', async ( chatLog, message, chatData ) => {
	// Check if the message starts with a specific command, like "!gpt4"
	if ( message.startsWith( '?' ) ) {
		const question = message.slice( 1 ).trim( );
		console.log( "question:", question );

		const prompt = `You are a AI Dungeon Master for Dungeons and Dragons 5e. You can answer any questions regarding rules and other lore about D&D. If the question about a monster, format your answer in the form of a D&D 5e statblock. You should stick to the text of the various rulebooks and don't add anything. ${question}`
		const answer = await callGPT4Api( prompt );

		// Create a new chat message with the answer
		let chatMessage = await ChatMessage.create( {
			user: game.user._id,
			content: `<span class="gpt-answer">${answer}</span>`
		} );

		// Prevent the original message from being displayed
		return false;
	}
} );
