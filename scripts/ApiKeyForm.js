export class ApiKeyForm extends FormApplication {
  static get defaultOptions() {
	return mergeObject(super.defaultOptions, {
	  id: 'gpt4-dnd5e-api-key-form',
	  title: 'ChatGPT API Key',
	  template: './modules/gpt4-dnd5e/templates/api-key-form.html',
	  width: 350,
	  height: 'auto',
	  closeOnSubmit: true
	});
  }

  getData() {
	const apiKey = game.settings.get('gpt4-dnd5e', 'apiKey');
	return { apiKey };
  }

  async _updateObject(event, formData) {
	const apiKey = formData.apiKey;
	await game.settings.set('gpt4-dnd5e', 'apiKey', apiKey);
  }
}
