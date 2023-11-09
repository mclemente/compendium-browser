// SPDX-FileCopyrightText: 2022 Johannes Loher
//
// SPDX-License-Identifier: MIT

export async function preloadTemplates() {
	const templatePaths = [
		"modules/compendium-browser/templates/spell-browser.html",
		"modules/compendium-browser/templates/spell-browser-list.html",
		"modules/compendium-browser/templates/npc-browser.html",
		"modules/compendium-browser/templates/npc-browser-list.html",
		"modules/compendium-browser/templates/feat-browser.html",
		"modules/compendium-browser/templates/feat-browser-list.html",
		"modules/compendium-browser/templates/item-browser.html",
		"modules/compendium-browser/templates/item-browser-list.html",
		"modules/compendium-browser/templates/filter-container.html",
		"modules/compendium-browser/templates/settings.html",
		"modules/compendium-browser/templates/loading.html",
	];

	return loadTemplates(templatePaths);
}
