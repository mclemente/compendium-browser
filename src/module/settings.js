export function registerSettings() {
	// creating game setting container
	game.settings.register("compendium-browser", "tabVisibility", {
		name: "Compendium Browser Settings",
		hint: "",
		default: {
			features: false,
			items: false,
			spells: false
		},
		type: Object,
		scope: "world"
	});
	game.settings.register("compendium-browser", "settings", {
		name: "Loaded Compendiums",
		hint: "",
		default: {
			actors: {},
			items: {}
		},
		type: Object,
		scope: "world"
	});
	game.settings.register("compendium-browser", "maxload", {
		name: game.i18n.localize("CMPBrowser.SETTING.Maxload.NAME"),
		hint: game.i18n.localize("CMPBrowser.SETTING.Maxload.HINT"),
		scope: "world",
		config: true,
		type: new foundry.data.fields.NumberField({ required: true, min: 200, max: 2000, step: 100, initial: 600 }),
	});
}
