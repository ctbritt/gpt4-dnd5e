![](https://img.shields.io/badge/Foundry-v10-informational)
<!--- Downloads @ Latest Badge -->
<!--- replace <user>/<repo> with your username/repository -->
![Latest Release Download Count](https://img.shields.io/github/downloads/ctbritt/gpt4-dnd5e/latest/module.zip)

<!--- Forge Bazaar Install % Badge -->
<!--- replace <your-module-name> with the `name` in your manifest -->
![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Fgpt4-dnd5e&colorB=4aa94a)


# What this is
A simple incorporation of ChatGPT into foundry to assist in lookup rules, stats, etc.

# How to use it
Simply preface your question with a `?` and ask. It will attempt to spit out D&D rules and information.

You will also need an API key from OpenAi.com to use this. Sign up [here](https://auth0.openai.com/u/signup/identifier?state=hKFo2SBhWUF4QkpDQlJMOG9yV3BscDdFVmpwaVpsX3Fab3hOQ6Fur3VuaXZlcnNhbC1sb2dpbqN0aWTZIG5UY1lzdmFmWFFqbmVjWjBEX0NsU2ZKMGVYYzdDZlAxo2NpZNkgRFJpdnNubTJNdTQyVDNLT3BxZHR3QjNOWXZpSFl6d0Q) and get one [here](https://platform.openai.com/).
## Example
`?Fireball`

>Fireball is a 3rd-level evocation spell that creates a burst of flame that spreads around corners. The spell has a range of 150 feet and affects all creatures within a 20-foot radius sphere centered on a point the caster chooses. Each creature in the area must make a Dexterity saving throw. On a failed save, a creature takes 8d6 fire damage, or half as much on a successful one. The spell ignites flammable objects in the area that aren't being worn or carried. The spell can be cast using a spell slot of 4th level or higher, increasing the damage by 1d6 for each level above 3rd.

# To-do
- Improve the settings panel to hide the API key from prying eyes
- Include a game game system selection and update the internal prompt to reflect that.
- Custom game prompt as well
- style the responses so they look nice and reflect the appropriate stat blocks. 
- Open to suggestions on other improvements?

# Special Thanks
Thanks very much to brunocalado#1650 on the foundry discord for a) convincing me to update and b) for suggestion code modifications. 
