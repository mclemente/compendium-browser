// SPDX-FileCopyrightText: 2022 Johannes Loher
//
// SPDX-License-Identifier: MIT

export function registerSettings() {
	// Register any custom module settings here
	const defaultSettings = {
		loadedSpellCompendium: {},
		loadedNpcCompendium: {},
	};
	for (const compendium of game.packs) {
		if (compendium.documentName === "Item") {
			defaultSettings.loadedSpellCompendium[compendium.collection] = {
				load: true,
				name: `${compendium.metadata.label} (${compendium.collection})`,
			};
		}
		if (compendium.documentName === "Actor") {
			defaultSettings.loadedNpcCompendium[compendium.collection] = {
				load: true,
				name: `${compendium.metadata.label} (${compendium.collection})`,
			};
		}
	}
	// creating game setting container
	game.settings.register("compendium-browser", "settings", {
		name: "Compendium Browser Settings",
		hint: "Settings to exclude packs from loading and visibility of the browser",
		default: defaultSettings,
		type: Object,
		scope: "world"
	});
	game.settings.register("compendium-browser", "maxload", {
		name: game.i18n.localize("CMPBrowser.SETTING.Maxload.NAME"),
		hint: game.i18n.localize("CMPBrowser.SETTING.Maxload.HINT"),
		scope: "world",
		config: true,
		default: 600,
		type: Number,
		range: {
			// If range is specified, the resulting setting will be a range slider
			min: 200,
			max: 2000,
			step: 100,
		},
	});
	game.settings.register("compendium-browser", "extraButtonsGlobal", {
		name: game.i18n.localize("CMPBrowser.SETTING.extraButtonsGlobal.NAME"),
		hint: game.i18n.localize("CMPBrowser.SETTING.extraButtonsGlobal.HINT"),
		scope: "world",
		config: true,
		default: true,
		type: Boolean,
	});
	game.settings.register("compendium-browser", "extraSheetButtons", {
		name: game.i18n.localize("CMPBrowser.SETTING.extraSheetButtons.NAME"),
		hint: game.i18n.localize("CMPBrowser.SETTING.extraSheetButtons.HINT"),
		scope: "client",
		config: true,
		default: true,
		type: Boolean,
	});
	game.settings.register("compendium-browser", "extraAdvancementButtons", {
		name: game.i18n.localize("CMPBrowser.SETTING.extraAdvancementButtons.NAME"),
		hint: game.i18n.localize("CMPBrowser.SETTING.extraAdvancementButtons.HINT"),
		scope: "client",
		config: true,
		default: true,
		type: Boolean,
	});
	game.settings.register("compendium-browser", "bannersGlobal", {
		name: game.i18n.localize("CMPBrowser.SETTING.bannersGlobal.NAME"),
		hint: game.i18n.localize("CMPBrowser.SETTING.bannersGlobal.HINT"),
		scope: "world",
		config: true,
		default: true,
		type: Boolean,
	});
	game.settings.register("compendium-browser", "bannersLocal", {
		name: game.i18n.localize("CMPBrowser.SETTING.bannersLocal.NAME"),
		hint: game.i18n.localize("CMPBrowser.SETTING.bannersLocal.HINT"),
		scope: "client",
		config: true,
		default: true,
		type: Boolean,
	});
}
