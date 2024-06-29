import { CompendiumBrowserVueApplication } from "./applications/compendium-browser.js";
import { registerSettings } from "./settings.js";

Hooks.once("setup", () => {
	registerSettings();
});

/* ---------------------------------------------- */

Hooks.on("renderActorDirectory", (app, html, options) => {
	if (!app.popOut) {
		const htmlElement = html[0];
		const compendiumButton = `
			<button type="button" class="open-compendium-browser" data-tab="creatures">
				<i class="fas fa-user"></i>
				${game.i18n.localize("CMPBrowser.Tab.NPCBrowser")}
			</button>`;
		htmlElement.querySelector(".directory-footer").insertAdjacentHTML("beforeend", compendiumButton);
		htmlElement.querySelector(".open-compendium-browser").addEventListener("click", (event) => {
			const { tab: activeTab } = event.target.dataset;
			game.compendiumBrowser = game.compendiumBrowser ?? new CompendiumBrowserVueApplication({ activeTab });
			// Render the browser.
			game.compendiumBrowser.render(true);
		});
	}
});
Hooks.on("renderCompendiumDirectory", (app, html, options) => {
	if (!app.popOut) {
		const htmlElement = html[0];
		const compendiumButton = `
			<button type="button" class="open-compendium-browser">
				<i class="fas fa-magnifying-glass"></i>
				${game.i18n.localize("CMPBrowser.compendiumBrowser")}
			</button>`;
		// Append button. Click handler added in 'ready' hook.
		htmlElement.querySelector(".directory-footer").insertAdjacentHTML("beforeend", compendiumButton);
		htmlElement.querySelector(".open-compendium-browser").addEventListener("click", (event) => {
			const { tab: activeTab } = event.target.dataset;
			game.compendiumBrowser = game.compendiumBrowser ?? new CompendiumBrowserVueApplication({ activeTab });
			// Render the browser.
			game.compendiumBrowser.render(true);
		});
	}
});
Hooks.on("renderItemDirectory", (app, html, options) => {
	if (!app.popOut) {
		const htmlElement = html[0];
		const compendiumButton = `
			<div class="flexrow">
				<button type="button" class="open-compendium-browser" data-tab="powers">
					<i class="fas fa-star"></i>
					${game.i18n.localize("CMPBrowser.Tab.FeatBrowser")}
				</button>
				<button type="button" class="open-compendium-browser" data-tab="spells">
					<i class="fas fa-atlas"></i>
					${game.i18n.localize("CMPBrowser.Tab.SpellBrowser")}
				</button>
				<button type="button" class="open-compendium-browser" data-tab="items">
					<i class="fas fa-suitcase"></i>
					${game.i18n.localize("CMPBrowser.Tab.ItemBrowser")}
				</button>
			</div>`;
		htmlElement.querySelector(".directory-footer").insertAdjacentHTML("beforeend", compendiumButton);
		htmlElement.querySelector(".open-compendium-browser").addEventListener("click", (event) => {
			const { tab: activeTab } = event.target.dataset;
			game.compendiumBrowser = game.compendiumBrowser ?? new CompendiumBrowserVueApplication({ activeTab });
			// Render the browser.
			game.compendiumBrowser.render(true);
		});
	}
});
