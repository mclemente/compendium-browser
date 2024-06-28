export function registerSettings() {
	game.compendiumBrowser.readCompendiums = {
		loadedSpellCompendium: {},
		loadedNpcCompendium: {},
	};
	for (const compendium of game.packs) {
		if (compendium.documentName === "Item") {
			game.compendiumBrowser.readCompendiums.loadedSpellCompendium[compendium.collection] = {
				load: true,
				name: `${compendium.metadata.label} (${compendium.collection})`,
			};
		}
		if (compendium.documentName === "Actor") {
			game.compendiumBrowser.readCompendiums.loadedNpcCompendium[compendium.collection] = {
				load: true,
				name: `${compendium.metadata.label} (${compendium.collection})`,
			};
		}
	}
	// creating game setting container
	game.settings.register("compendium-browser", "tabVisibility", {
		name: "Compendium Browser Settings",
		hint: "",
		default: {
			actors: false,
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
