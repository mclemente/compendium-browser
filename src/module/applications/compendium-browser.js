// Import Vue dependencies.
import { createApp } from "../../lib/vue.esm-browser.js";
import { VueCompendiumBrowser } from "../../components/components.vue.es.js";


/**
 * Application class for the Compendium Browser.
 *
 * Extends the Application class into a Vue-based application.
 *
 * @todo refactor to use a mixin.
 *
 * @export
 * @class CompendiumBrowserVueApplication
 * @typedef {CompendiumBrowserVueApplication}
 * @extends {Application}
 */
export class CompendiumBrowserVueApplication extends Application {
	/** @override */
	constructor(...args) {
		super(...args);

		this.vueApp = null;
		this.vueRoot = null;
		this.vueListenersActive = false;
		this.vueComponents = {
			'compendium-browser': VueCompendiumBrowser
		};
	}

	/** @override */
	static get defaultOptions() {
		return {...super.defaultOptions,
			classes: [
				'form',
				'compendium-browser-dialog'
			],
			popOut: true,
			template: "modules/compendium-browser/templates/vue-compendium-browser.html",
			id: 'compendium-browser',
			title: game.i18n.localize('CMPBrowser.compendiumBrowser'),
			width: 1024,
			height: 775,
			resizable: true,
		};
	}

	/** @override */
	async getData() {
		// We only need to return data for the default tab, as compendium content
		// is loaded in the create() method of their respective components.
		return {
			// @todo add more default options, like saved filters.
			defaultTab: this.options.defaultTab ?? 'creatures',
		};
	}

	/* ------------------------------------------------------------------------ */
	/*  Vue Rendering --------------------------------------------------------- */
	/* ------------------------------------------------------------------------ */

	/** @override */
	async render(force=false, options={}) {
		const context = await this.getData();

		// Render the vue application after loading. We'll need to destroy this
		// later in the this.close() method for the sheet.
		if (!this.vueApp || !this.vueRoot) {
			this.vueRoot = null;
			this.vueApp = createApp({
				// Initialize data.
				data() {
					return {
						context: context,
					}
				},
				// Define our character sheet component.
				components: this.vueComponents,
				// Create a method to the update the data while retaining reactivity.
				methods: {
					updateContext(newContext) {
						for (let key of Object.keys(this.context)) {
							this.context[key] = newContext[key];
						}
					}
				}
			});
		}
		// Otherwise, perform update routines on the app.
		else {
			// Pass new values from this.getData() into the app.
			this.vueRoot.updateContext(context);
			// Reactivate the listeners if we need to.
			if (!this.vueListenersActive) {
				setTimeout(() => {
					this.activateVueListeners($(this.form), true);
				}, 150);
			}
			return;
		}

		// If we don't have an active vueRoot, run Foundry's render and then mount
		// the Vue application to the form.
		await this._render(force, options).catch(err => {
			err.message = `An error occurred while rendering ${this.constructor.name} ${this.appId}: ${err.message}`;
			console.error(err);
			this._state = Application.RENDER_STATES.ERROR;
		})

		// Mount our rendered app.
		let $selector = $(`[data-appid="${this.appId}"] .compendium-browser-mount`);
		if ($selector.length > 0) {
			this.vueRoot = this.vueApp.mount(`[data-appid="${this.appId}"] .compendium-browser-mount`);
			// @todo Find a better solution than a timeout.
			setTimeout(() => {
				this.activateVueListeners($(this.form), false);
			}, 150);
		}

		return this;
	}

	/** @override */
	async close(options={}) {
		// Run the upstream close method.
		const result = await super.close(options);
		// Unmount and clean up the vue app on close.
		this.vueApp.unmount();
		this.vueApp = null;
		this.vueRoot = null;
		// Return the close response from earlier.
		return result;
	}

	/* ------------------------------------------------------------------------ */
	/*  Vue Rendering --------------------------------------------------------- */
	/* ------------------------------------------------------------------------ */

	/** @override */
	activateListeners(html) {
		super.activateListeners(html);
	}

	/**
	 * Activate additional listeners on the rendered Vue app.
	 * @param {jQuery} html
	 */
	activateVueListeners(html, repeat = false) {
		if (!this.options.editable) {
			html.find('input,select,textarea').attr('disabled', true);
			return;
		}

		if (html.find('.archmage-v2-vue').length > 0) {
			this.vueListenersActive = true;
		}

		// Place one-time executions after this line.
		if (repeat) return;

		// Input listeners.
		let inputs = '.section input[type="text"], .section input[type="number"]';
		html.on('focus', inputs, (event) => this._onFocus(event));
	}


	/**
	 * Handle focus events.
	 *
	 * @param {*} event
	 */
	_onFocus(event) {
		let target = event.currentTarget;
		setTimeout(function() {
			if (target == document.activeElement) {
				$(target).trigger('select');
			}
		}, 100);
	}
}
