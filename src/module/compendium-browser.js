import { preloadTemplates } from "./preloadTemplates.js";
import { dnd5eProvider } from "./providers/dnd5e.js";
import { registerSettings } from "./settings.js";

const STOP_SEARCH = "StopSearchException";
const NOT_MIGRATED = "NotMigratedException";
const COMPENDIUM_BROWSER = "compendium-browser";

class CompendiumBrowser extends Application {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			title: "CMPBrowser.compendiumBrowser",
			tabs: [{ navSelector: ".tabs", contentSelector: ".content", initial: "spell" }],
			classes: [COMPENDIUM_BROWSER],
			template: "modules/compendium-browser/templates/template.html",
			width: 800,
			height: 730,
			resizable: true,
		});
	}

	get maxLoad() {
		return game.settings.get(COMPENDIUM_BROWSER, "maxload");
	}

	static get extraButtonsGlobal() {
		return game.settings.get(COMPENDIUM_BROWSER, "extraButtonsGlobal");
	}

	static get extraSheetButtons() {
		return game.settings.get(COMPENDIUM_BROWSER, "extraSheetButtons");
	}

	static get extraAdvancementButtons() {
		return game.settings.get(COMPENDIUM_BROWSER, "extraAdvancementButtons");
	}

	static get bannersGlobal() {
		return game.settings.get(COMPENDIUM_BROWSER, "bannersGlobal");
	}

	static get bannersLocal() {
		return game.settings.get(COMPENDIUM_BROWSER, "bannersLocal");
	}

	async setup() {
		// load settings
		this.initSettings();

		// Reset the filters used in the dialog
		this.spellFilters = {
			registeredFilterCategorys: {},
			activeFilters: {},
		};
		this.npcFilters = {
			registeredFilterCategorys: {},
			activeFilters: {},
		};
		this.featFilters = {
			registeredFilterCategorys: {},
			activeFilters: {},
		};
		this.itemFilters = {
			registeredFilterCategorys: {},
			activeFilters: {},
		};
		this.addSpellFilters();
		this.addFeatFilters();
		this.addItemFilters();
		this.addNpcFilters();
	}

	/** @override */
	_onChangeTab(event, tabs, active) {
		super._onChangeTab(event, tabs, active);
		const html = this.element;
		this.replaceList(html, active, { reload: false });
	}

	/** @override */
	async getData() {
		return {
			items: [],
			npcs: [],
			spellFilters: this.spellFilters,
			showSpellBrowser: game.user.isGM || this.settings.allowSpellBrowser,
			featFilters: this.featFilters,
			showFeatBrowser: game.user.isGM || this.settings.allowFeatBrowser,
			itemFilters: this.itemFilters,
			showItemBrowser: game.user.isGM || this.settings.allowItemBrowser,
			npcFilters: this.npcFilters,
			showNpcBrowser: game.user.isGM || this.settings.allowNpcBrowser,
			settings: this.settings,
			isGM: game.user.isGM,
		};
	}

	activateItemListListeners(html) {
		// show entity sheet
		html.find(".item-edit").click((ev) => {
			let itemId = $(ev.currentTarget).parents("li").attr("data-entry-id");
			let compendium = $(ev.currentTarget).parents("li").attr("data-entry-compendium");
			let pack = game.packs.find((p) => p.collection === compendium);
			pack.getDocument(itemId).then((entity) => {
				entity.sheet.render(true);
			});
		});

		// make draggable
		// 0.4.1: Avoid the game.packs lookup
		html.find(".draggable").each((i, li) => {
			li.setAttribute("draggable", true);
			li.addEventListener(
				"dragstart",
				(event) => {
					let packName = li.getAttribute("data-entry-compendium");
					let pack = game.packs.find((p) => p.collection === packName);
					if (!pack) {
						event.preventDefault();
						return false;
					}
					event.dataTransfer.setData(
						"text/plain",
						JSON.stringify({
							type: pack.documentName,
							uuid: `Compendium.${pack.collection}.${li.getAttribute("data-entry-id")}`,
						})
					);
				},
				false
			);
		});
	}

	/** @override */
	activateListeners(html) {
		super.activateListeners(html);

		this.observer = new IntersectionObserver((entries, observer) => {
			for (let e of entries) {
				if (!e.isIntersecting) continue;
				const img = e.target;
				// Avatar image
				// const img = li.querySelector("img");
				if (img && img.dataset.src) {
					img.src = img.dataset.src;
					delete img.dataset.src;
				}

				// No longer observe the target
				observer.unobserve(e.target);
			}
		});

		this.activateItemListListeners(html);

		// toggle visibility of filter containers
		html.find(".filtercontainer h3, .multiselect label").click(async (ev) => {
			await $(ev.target.nextElementSibling).toggle(100);
		});
		html.find(".multiselect label").trigger("click");

		// sort spell list
		html.find(".spell-browser select[name=sortorder]").on("change", (ev) => {
			let spellList = html.find(".spell-browser li");
			let byName = ev.target.value === "true";
			let sortedList = this.sortSpells(spellList, byName);
			let ol = $(html.find(".spell-browser ul"));
			ol[0].innerHTML = [];
			for (let element of sortedList) {
				ol[0].append(element);
			}
		});
		this.triggerSort(html, "spell");

		// sort feat list in place
		html.find(".feat-browser select[name=sortorder]").on("change", (ev) => {
			let featList = html.find(".feat-browser li");
			let byName = ev.target.value === "true";
			let sortedList = this.sortFeats(featList, byName);
			let ol = $(html.find(".feat-browser ul"));
			ol[0].innerHTML = [];
			for (let element of sortedList) {
				ol[0].append(element);
			}
		});
		this.triggerSort(html, "feat");

		// sort item list in place
		html.find(".item-browser select[name=sortorder]").on("change", (ev) => {
			let itemList = html.find(".item-browser li");
			let byName = ev.target.value === "true";
			let sortedList = this.sortItems(itemList, byName);
			let ol = $(html.find(".item-browser ul"));
			ol[0].innerHTML = [];
			for (let element of sortedList) {
				ol[0].append(element);
			}
		});
		this.triggerSort(html, "item");

		// sort npc list in place
		html.find(".npc-browser select[name=sortorder]").on("change", (ev) => {
			let npcList = html.find(".npc-browser li");
			let orderBy = ev.target.value;
			let sortedList = this.sortNpcs(npcList, orderBy);
			let ol = $(html.find(".npc-browser ul"));
			ol[0].innerHTML = [];
			for (let element of sortedList) {
				ol[0].append(element);
			}
		});
		this.triggerSort(html, "npc");

		for (let tab of ["spell", "feat", "item", "npc"]) {
			// reset filters and re-render
			// 0.4.3: Reset ALL filters because when we do a re-render it affects all tabs
			html.find(`#reset-${tab}-filter`).click((ev) => {
				this.resetFilters();
				// v0.4.3: Re-render so that we display the filters correctly
				this.refreshList = tab;
				this.render();
			});

			// copy Javascript seach to clipboard
			html.find(`#copy-search-${tab}`).click(async (ev) => {
				this.copySearchToClipboard(tab);
			});
		}

		// settings
		html.find(".settings input").on("change", (ev) => {
			const setting = ev.target.dataset.setting;
			const value = ev.target.checked;
			if (setting === "spell-compendium-setting") {
				const key = ev.target.dataset.key;
				this.settings.loadedSpellCompendium[key].load = value;
				this.render();
				ui.notifications.info("Settings Saved. Item Compendiums are being reloaded.");
			} else if (setting === "npc-compendium-setting") {
				const key = ev.target.dataset.key;
				this.settings.loadedNpcCompendium[key].load = value;
				this.render();
				ui.notifications.info("Settings Saved. NPC Compendiums are being reloaded.");
			} else if (setting === "allow-spell-browser") {
				this.settings.allowSpellBrowser = value;
			} else if (setting === "allow-feat-browser") {
				this.settings.allowFeatBrowser = value;
			} else if (setting === "allow-item-browser") {
				this.settings.allowItemBrowser = value;
			} else if (setting === "allow-npc-browser") {
				this.settings.allowNpcBrowser = value;
			}
			game.settings.set(COMPENDIUM_BROWSER, "settings", this.settings);
		});

		// activating or deactivating filters
		// 0.4.1: Now does a re-load and updates just the data side
		// text filters
		html.find(".filter[data-type=text] input, .filter[data-type=text] select").on("keyup change paste", (ev) => {
			const path = $(ev.target).parents(".filter").data("path");
			const key = stripDotCharacters(path);
			const value = ev.target.value;
			const browserTab = $(ev.target).parents(".tab").data("tab");

			const filterTarget = `${browserTab}Filters`;

			if (value === "" || value === undefined) {
				delete this[filterTarget].activeFilters[key];
			} else {
				this[filterTarget].activeFilters[key] = {
					path: path,
					type: "text",
					valIsArray: false,
					value: ev.target.value,
				};
			}

			this.replaceList(html, browserTab);
		});

		// select filters
		html.find(".filter[data-type=select] select, .filter[data-type=bool] select").on("change", (ev) => {
			const path = $(ev.target).parents(".filter").data("path");
			const key = stripDotCharacters(path);
			const filterType = $(ev.target).parents(".filter").data("type");
			const browserTab = $(ev.target).parents(".tab").data("tab");
			let valIsArray = $(ev.target).parents(".filter").data("valisarray");
			if (valIsArray === "true") valIsArray = true;
			let value = ev.target.value;
			if (value === "false") value = false;
			if (value === "true") value = true;

			const filterTarget = `${browserTab}Filters`;

			if (value === "null") {
				delete this[filterTarget].activeFilters[key];
			} else {
				this[filterTarget].activeFilters[key] = {
					path: path,
					type: filterType,
					valIsArray: valIsArray,
					value: value,
				};
			}

			this.replaceList(html, browserTab);
		});

		// multiselect filters
		html.find(".filter[data-type=multiSelect] input").on("change", (ev) => {
			const path = $(ev.target).parents(".filter").data("path");
			const key = stripDotCharacters(path);
			const filterType = "multiSelect";
			const browserTab = $(ev.target).parents(".tab").data("tab");
			let valIsArray = $(ev.target).parents(".filter").data("valisarray");
			if (valIsArray === "true") valIsArray = true;
			let value = $(ev.target).data("value");

			const filterTarget = `${browserTab}Filters`;
			const filter = this[filterTarget].activeFilters[key];

			if (ev.target.checked === true) {
				if (filter === undefined) {
					this[filterTarget].activeFilters[key] = {
						path: path,
						type: filterType,
						valIsArray: valIsArray,
						values: [value],
					};
				} else {
					this[filterTarget].activeFilters[key].values.push(value);
				}
			} else {
				delete this[filterTarget].activeFilters[key].values.splice(
					this[filterTarget].activeFilters[key].values.indexOf(value),
					1
				);
				if (this[filterTarget].activeFilters[key].values.length === 0) {
					delete this[filterTarget].activeFilters[key];
				}
			}

			this.replaceList(html, browserTab);
		});

		html.find(".filter[data-type=numberCompare] select, .filter[data-type=numberCompare] input").on(
			"change keyup paste",
			(ev) => {
				const path = $(ev.target).parents(".filter").data("path");
				const key = stripDotCharacters(path);
				const filterType = "numberCompare";
				const browserTab = $(ev.target).parents(".tab").data("tab");
				let valIsArray = false;

				const operator = $(ev.target).parents(".filter").find("select").val();
				const value = $(ev.target).parents(".filter").find("input").val();

				const filterTarget = `${browserTab}Filters`;

				if (value === "" || operator === "null") {
					delete this[filterTarget].activeFilters[key];
				} else {
					this[filterTarget].activeFilters[key] = {
						path: path,
						type: filterType,
						valIsArray: valIsArray,
						operator: operator,
						value: value,
					};
				}

				this.replaceList(html, browserTab);
			}
		);

		// Just for the loading image
		if (this.observer) {
			html.find("img").each((i, img) => this.observer.observe(img));
		}
	}

	async checkListsLoaded() {
		// Provides extra info not in the standard SRD, like which classes can learn a spell
		if (!this.classList) {
			this.classList = dnd5eProvider.classList;
		}

		if (!this.packList) {
			this.packList = dnd5eProvider.packList;
		}

		if (!this.subClasses) {
			this.subClasses = dnd5eProvider.subClasses;
		}
	}

	async loadAndFilterItems(browserTab = "spell", updateLoading = null) {
		await this.checkListsLoaded();

		const seachNumber = Date.now();

		this.CurrentSeachNumber = seachNumber;

		// 0.4.1: Load and filter just one of spells, feats, and items (specified by browserTab)
		let numItemsLoaded = 0;
		let compactItems = {};
		const FeatureList = ["feat", "class", "subclass", "background", "race"];
		const NotItemList = ["spell", "feat", "class", "subclass", "background", "race"];

		try {
			// Filter the full list, but only save the core compendium information + displayed info
			for (let pack of game.packs) {
				if (pack.documentName === "Item" && this.settings.loadedSpellCompendium[pack.collection].load) {
					// can query just for spells since there is only 1 type
					let query = {};
					if (browserTab === "spell") {
						query = { type: "spell" };
					}

					// FIXME: How much could we do with the loaded index rather than all content?
					// OR filter the content up front for the decoratedItem.type??
					await pack.getDocuments(query).then((content) => {
						if (browserTab === "spell") {
							content.reduce(
								function (itemsList, item5e) {
									if (this.CurrentSeachNumber !== seachNumber) throw STOP_SEARCH;

									numItemsLoaded = Object.keys(itemsList).length;

									if (this.maxLoad <= numItemsLoaded) {
										if (updateLoading) {
											updateLoading(numItemsLoaded, true);
										}
										throw STOP_SEARCH;
									}

									const decoratedItem = this.decorateItem(item5e);

									if (
										decoratedItem
										&& this.passesFilter(decoratedItem, this.spellFilters.activeFilters)
									) {
										itemsList[item5e.id] = {
											compendium: pack.collection,
											name: decoratedItem.name,
											img: decoratedItem.img,
											data: {
												level: decoratedItem.level,
												properties: [...decoratedItem.properties]
													.reduce((obj, prop) => ({ ...obj, [prop]: true }), {}),
											},
											id: item5e.id,
										};
									}

									return itemsList;
								}.bind(this),
								compactItems
							);
						} else if (browserTab === "feat") {
							content.reduce(
								function (itemsList, item5e) {
									if (this.CurrentSeachNumber !== seachNumber) throw STOP_SEARCH;

									numItemsLoaded = Object.keys(itemsList).length;

									if (this.maxLoad <= numItemsLoaded) {
										if (updateLoading) {
											updateLoading(numItemsLoaded, true);
										}
										throw STOP_SEARCH;
									}

									const decoratedItem = this.decorateItem(item5e);

									if (
										decoratedItem
										&& FeatureList.includes(decoratedItem.type)
										&& this.passesFilter(decoratedItem, this.featFilters.activeFilters)
									) {
										itemsList[item5e.id] = {
											compendium: pack.collection,
											name: decoratedItem.name,
											img: decoratedItem.img,
											classRequirementString: decoratedItem.classRequirementString,
										};
									}

									return itemsList;
								}.bind(this),
								compactItems
							);
						} else if (browserTab === "item") {
							content.reduce(
								function (itemsList, item5e) {
									if (this.CurrentSeachNumber !== seachNumber) throw STOP_SEARCH;

									numItemsLoaded = Object.keys(itemsList).length;

									if (this.maxLoad <= numItemsLoaded) {
										if (updateLoading) {
											updateLoading(numItemsLoaded, true);
										}
										throw STOP_SEARCH;
									}

									const decoratedItem = this.decorateItem(item5e);

									if (
										decoratedItem
										&& !NotItemList.includes(
											decoratedItem.type
										)
										&& this.passesFilter(decoratedItem, this.itemFilters.activeFilters)
									) {
										itemsList[item5e.id] = {
											compendium: pack.collection,
											name: decoratedItem.name,
											img: decoratedItem.img,
											type: decoratedItem.type,
										};
									}

									return itemsList;
								}.bind(this),
								compactItems
							);
						}

						numItemsLoaded = Object.keys(compactItems).length;
						if (updateLoading) {
							updateLoading(numItemsLoaded, false);
						}
					});
				} // end if pack entity === Item
			} // for packs
		} catch(e) {
			if (e === STOP_SEARCH) {
				// stopping search early
			} else {
				throw e;
			}
		}

		this.itemsLoaded = true;
		updateLoading(numItemsLoaded, true);
		return compactItems;
	}

	async loadAndFilterNpcs(updateLoading = null) {
		const seachNumber = Date.now();
		this.CurrentSeachNumber = seachNumber;

		let npcs = {};

		let numNpcsLoaded = 0;
		this.npcsLoaded = false;

		const indexFields = [
			...new Set(
				["name", "img", "system.details.cr", "system.traits.size", "system.details.type.value"].concat(
					Object.values(this.npcFilters.activeFilters).map((f) => f.path)
				)
			),
		];
		let collectionName = "unknown";
		try {
			for (let pack of game.packs) {
				if (pack.documentName === "Actor" && this.settings.loadedNpcCompendium[pack.collection].load) {
					await pack.getIndex({ fields: indexFields }).then(async (content) => {
						content.reduce(
							function (actorsList, npc5e) {
								if (this.CurrentSeachNumber !== seachNumber) {
									throw STOP_SEARCH;
								}

								if (!npc5e.img) {
									npc5e.img = game.dnd5e.moduleArt.map.get(npc5e.uuid.replace(".Actor", ""))?.actor;
								}

								if (npc5e.system === undefined) {
									collectionName = pack.collection;
									throw NOT_MIGRATED;
								}

								numNpcsLoaded = Object.keys(npcs).length;

								if (this.maxLoad <= numNpcsLoaded) {
									if (updateLoading) {
										updateLoading(numNpcsLoaded, true);
									}
									throw STOP_SEARCH;
								}
								if (npc5e.name !== "#[CF_tempEntity]") {
									const decoratedNpc = this.decorateNpc(npc5e, indexFields);
									if (
										decoratedNpc
										&& this.passesFilter(decoratedNpc, this.npcFilters.activeFilters)
									) {
										actorsList[npc5e._id] = {
											compendium: pack.collection,
											name: decoratedNpc.name,
											img: decoratedNpc.img,
											displayCR: decoratedNpc.displayCR,
											displaySize: decoratedNpc.displaySize,
											displayType: decoratedNpc.displayType,
											orderCR: decoratedNpc.orderCR,
											orderSize: decoratedNpc.filterSize,
										};
									}
								}
								return actorsList;
							}.bind(this),
							npcs
						);

						numNpcsLoaded = Object.keys(npcs).length;
						if (updateLoading) {
							updateLoading(numNpcsLoaded, false);
						}
					});
				}
				// 0.4.1 Only preload a limited number and fill more in as needed
			}
		} catch(e) {
			if (e === STOP_SEARCH) {
				// breaking out
			} else if (e === NOT_MIGRATED) {
				console.log("Cannot browse compendium %s as it is not migrated to v10 format", collectionName);
			} else {
				throw e;
			}
		}

		this.npcsLoaded = true;
		updateLoading(numNpcsLoaded, true);
		return npcs;
	}

	hookCompendiumList(html) {
		if (game.user.isGM
			|| this.settings.allowSpellBrowser
			|| this.settings.allowNpcBrowser
			|| this.settings.allowFeatBrowser
			|| this.settings.allowItemBrowser) {

			const cbButton = $(
				`<button class="compendium-browser-btn"><i class="fas fa-fire"></i> ${game.i18n.localize(
					"CMPBrowser.compendiumBrowser"
				)}</button>`
			);
			html.find(".compendium-browser-btn").remove();

			// adding to directory-list since the footer doesn't exist if the user is not gm
			html.find(".directory-footer").append(cbButton);

			// Handle button clicks
			cbButton.click((ev) => {
				ev.preventDefault();
				// 0.4.1: Reset filters when you click button
				this.resetFilters();
				// 0.4.3: Reset everything (including data) when you press the button - calls afterRender() hook

				if (!this.refreshList) {
					if (game.user.isGM || this.settings.allowSpellBrowser) {
						this.refreshList = "spell";
					} else if (this.settings.allowFeatBrowser) {
						this.refreshList = "feat";
					} else if (this.settings.allowItemBrowser) {
						this.refreshList = "item";
					} else if (this.settings.allowNPCBrowser) {
						this.refreshList = "npc";
					}
				}
				this.render(true);
			});
		}
	}

	/* Hook to load the first data */
	static afterRender(cb, html) {
		// 0.4.3: Because a render always resets ALL the displayed filters (on all tabs) to unselected , we have to blank all the lists as well
		// (because the current HTML template doesn't set the selected filter values)
		if (!cb?.refreshList) {
			return;
		}

		cb.replaceList(html, cb.refreshList);

		// cb.refreshList = null;

		if (CompendiumBrowser.postRender) {
			CompendiumBrowser.postRender();
		}
	}

	resetFilters() {
		this.spellFilters.activeFilters = {};
		this.featFilters.activeFilters = {};
		this.itemFilters.activeFilters = {};
		this.npcFilters.activeFilters = {};
	}

	async replaceList(html, browserTab, options = { reload: true }) {
		// After rendering the first time or re-rendering trigger the load/reload of visible data

		let elements = null;
		// 0.4.2 Display a Loading... message while the data is being loaded and filtered
		let loadingMessage = null;
		const tabElements = {
			spell: { elements: "ul#CBSpells", message: "#CBSpellsMessage" },
			npc: { elements: "ul#CBNPCs", message: "#CBNpcsMessage" },
			feat: { elements: "ul#CBFeats", message: "#CBFeatsMessage" },
			item: { elements: "ul#CBItems", message: "#CBItemsMessage" },
		};

		if (browserTab in tabElements) {
			const tabInfo = tabElements[browserTab];
			elements = html.find(tabInfo.elements);
			loadingMessage = html.find(tabInfo.message);
			this.refreshList = browserTab;
		}

		if (elements?.length) {
			// 0.4.2b: On a tab-switch, only reload if there isn't any data already
			if (options?.reload || !elements[0].children.length) {
				const updateLoading = async (numLoaded, doneLoading) => {
					if (loadingMessage.length) {
						this.renderLoading(
							loadingMessage[0],
							browserTab,
							numLoaded,
							numLoaded >= this.maxLoad,
							doneLoading
						);
					}
				};
				updateLoading(0, false);
				// Uses loadAndFilterItems to read compendia for items which pass the current filters and render on this tab
				const newItemsHTML = await this.renderItemData(browserTab, updateLoading);
				elements[0].innerHTML = newItemsHTML;
				// Re-sort before setting up lazy loading
				this.triggerSort(html, browserTab);

				// Lazy load images
				if (this.observer) {
					$(elements)
						.find("img")
						.each((i, img) => this.observer.observe(img));
				}

				// Reactivate listeners for clicking and dragging
				this.activateItemListListeners($(elements));
			}
		}
	}

	async renderLoading(messageElement, itemType, numLoaded, maxLoaded = false, doneLoading = false) {
		if (!messageElement) return;

		let loadingHTML = await renderTemplate("modules/compendium-browser/templates/loading.html", {
			numLoaded: numLoaded,
			itemType: itemType,
			maxLoaded: maxLoaded,
			doneLoading: doneLoading,
		});
		messageElement.innerHTML = loadingHTML;
	}

	async renderItemData(browserTab, updateLoading = null) {
		let listItems;
		if (browserTab === "npc") {
			listItems = await this.loadAndFilterNpcs(updateLoading);
		} else {
			listItems = await this.loadAndFilterItems(browserTab, updateLoading);
		}
		const html = await renderTemplate(`modules/compendium-browser/templates/${browserTab}-browser-list.html`, {
			listItems: listItems,
		});

		return html;
	}

	// SORTING
	triggerSort(html, browserTab) {
		if (browserTab === "spell") {
			html.find(".spell-browser select[name=sortorder]").trigger("change");
		} else if (browserTab === "feat") {
			html.find(".feat-browser select[name=sortorder]").trigger("change");
		} else if (browserTab === "npc") {
			html.find(".npc-browser select[name=sortorder]").trigger("change");
		} else if (browserTab === "item") {
			html.find(".item-browser select[name=sortorder]").trigger("change");
		}
	}

	sortSpells(list, byName) {
		list.sort((a, b) => {
			const aName = $(a).find(".item-name a")[0].innerHTML;
			const bName = $(b).find(".item-name a")[0].innerHTML;

			if (!byName) {
				const aLevel = $(a).find("input[name=level]").val();
				const bLevel = $(b).find("input[name=level]").val();
				const levelComparison = aLevel.localeCompare(bLevel);

				if (levelComparison !== 0) {
					return levelComparison;
				}
			}
			return aName.localeCompare(bName);
		});
		return list;
	}

	sortFeats(list, byName) {
		list.sort((a, b) => {
			const aName = $(a).find(".item-name a")[0].innerHTML;
			const bName = $(b).find(".item-name a")[0].innerHTML;

			if (!byName) {
				const aLevel = $(a).find("input[name=class]").val();
				const bLevel = $(b).find("input[name=class]").val();
				const levelComparison = aLevel.localeCompare(bLevel);

				if (levelComparison !== 0) {
					return levelComparison;
				}
			}
			return aName.localeCompare(bName);
		});
		return list;
	}

	sortItems(list, byName) {
		list.sort((a, b) => {
			const aName = $(a).find(".item-name a")[0].innerHTML;
			const bName = $(b).find(".item-name a")[0].innerHTML;

			if (!byName) {
				const aLevel = $(a).find("input[name=type]").val();
				const bLevel = $(b).find("input[name=type]").val();
				const levelComparison = aLevel.localeCompare(bLevel);

				if (levelComparison !== 0) {
					return levelComparison;
				}
			}
			return aName.localeCompare(bName);
		});
		return list;
	}

	sortNpcs(list, orderBy) {
		list.sort((a, b) => {
			const aName = $(a).find(".npc-name a")[0].innerHTML;
			const bName = $(b).find(".npc-name a")[0].innerHTML;

			if (orderBy === "cr") {
				const aLevel = Number($(a).find('input[name="order.cr"]').val());
				const bLevel = Number($(b).find('input[name="order.cr"]').val());
				if (aLevel !== bLevel) {
					return aLevel - bLevel;
				}
			} else if (orderBy === "size") {
				const aLevel = Number($(a).find('input[name="order.size"]').val());
				const bLevel = Number($(b).find('input[name="order.size"]').val());
				if (aLevel !== bLevel) {
					return aLevel - bLevel;
				}
			}
			return aName.localeCompare(bName);
		});
		return list;
	}

	decorateItem(item5e) {
		if (!item5e) return null;
		// Decorate and then filter a compendium entry - returns null or the item

		const item = { ...item5e };

		item.level = item5e.system?.level;
		item.properties = item5e.system?.properties;
		item.damage = item5e.system?.damage;
		item.classes = item5e.system?.classes;
		item.requirements = item5e.system?.requirements;
		// getting damage types (common to all Items, although some won't have any)
		item.damageTypes = [];

		if (item.damage && item.damage.parts.length > 0) {
			for (let part of item.damage.parts) {
				let type = part[1];
				if (item.damageTypes.indexOf(type) === -1) {
					item.damageTypes.push(type);
				}
			}
		}

		if (item.type === "spell") {
			// determining classes that can use the spell
			let cleanSpellName = item.name
				.toLowerCase()
				.replace(/[^一-龠ぁ-ゔァ-ヴーa-zA-Z0-9ａ-ｚＡ-Ｚ０-９々〆〤]/g, "")
				.replace("'", "")
				.replace(/ /g, "");
			// let cleanSpellName = spell.name.toLowerCase().replace(/[^a-zA-Z0-9\s:]/g, '').replace("'", '').replace(/ /g, '');
			if (this.classList[cleanSpellName]) {
				let classes = this.classList[cleanSpellName];
				item.classes = classes.split(",");
			} else {
				// FIXME: unfoundSpells += cleanSpellName + ',';
			}
		} else if (item.type === "feat" || item.type === "class") {
			// getting class
			let reqString = item.requirements?.replace(/[0-9]/g, "").trim();
			let matchedClass = [];
			for (let c in this.subClasses) {
				if (reqString && reqString.toLowerCase().indexOf(c) !== -1) {
					matchedClass.push(c);
				} else {
					for (let subClass of this.subClasses[c]) {
						if (reqString && reqString.indexOf(subClass) !== -1) {
							matchedClass.push(c);
							break;
						}
					}
				}
			}
			item.classRequirement = matchedClass;
			item.classRequirementString = matchedClass.join(", ");

			// getting uses/ressources status
			item.usesRessources = item5e.hasLimitedUses;
		} else if (item.type === "subclass") {
			// subclasses dont exist lower then version 10
			item.classRequirement = [item.system.classIdentifier];
			item.classRequirementString = item.system.classIdentifier;
		} else {
			// getting pack
			let matchedPacks = [];
			for (let pack of Object.keys(this.packList)) {
				for (let packItem of this.packList[pack]) {
					if (item.name.toLowerCase() === packItem.toLowerCase()) {
						matchedPacks.push(pack);
						break;
					}
				}
			}
			item.matchedPacks = matchedPacks;
			item.matchedPacksString = matchedPacks.join(", ");

			// getting uses/ressources status
			item.usesRessources = item5e.hasLimitedUses;
		}
		return item;
	}

	decorateNpc(npc, indexFields) {
		const decoratedNpc = indexFields.reduce((npcDict, item) => {
			set(npcDict, item, getPropByString(npc, item));
			return npcDict;
		}, {});

		let npcData = npc.system;

		// cr display
		let cr = npcData.details?.cr;
		if (cr === undefined || cr === "") {
			cr = 0;
		} else {
			cr = Number(cr);
		}

		decoratedNpc.orderCR = cr;

		if (cr > 0 && cr < 1) cr = `1/${1 / cr}`;
		decoratedNpc.displayCR = cr;

		decoratedNpc.displaySize = "unset";
		decoratedNpc.filterSize = 2;
		if (npcData.details) {
			decoratedNpc.displayType = this.getNPCType(npcData.details.type);
		} else {
			decoratedNpc.displayType = game.i18n.localize("CMPBrowser.Unknown") ?? "Unknown";
		}

		if (CONFIG.DND5E.actorSizes[npcData.traits.size] !== undefined) {
			decoratedNpc.displaySize = CONFIG.DND5E.actorSizes[npcData.traits.size];
		}
		let npcSize = npc.system.traits.size;
		switch (npcSize) {
			case "grg":
				decoratedNpc.filterSize = 5;
				break;
			case "huge":
				decoratedNpc.filterSize = 4;
				break;
			case "lg":
				decoratedNpc.filterSize = 3;
				break;
			case "sm":
				decoratedNpc.filterSize = 1;
				break;
			case "tiny":
				decoratedNpc.filterSize = 0;
				break;
			case "med":
			default:
				decoratedNpc.filterSize = 2;
				break;
		}
		return decoratedNpc;
	}

	getNPCType(type) {
		if (type instanceof Object) {
			return game.i18n.localize(CONFIG.DND5E.creatureTypes[type.value]) ?? type.value;
		}

		return type;
	}

	filterElements(list, subjects, filters) {
		for (let element of list) {
			let subject = subjects[element.dataset.entryId];
			if (this.passesFilter(subject, filters) === false) {
				$(element).hide();
			} else {
				$(element).show();
			}
		}
	}

	passesFilter(subject, filters) {
		for (let filter of Object.values(filters)) {
			let prop = getProperty(subject, filter.path);
			if (filter.type === "numberCompare") {
				switch (filter.operator) {
					case "=":
						if (prop !== filter.value) {
							return false;
						}
						break;
					case "<":
						if (prop >= filter.value) {
							return false;
						}
						break;
					case ">":
						if (prop <= filter.value) {
							return false;
						}
						break;
				}

				continue;
			}
			if (filter.valIsArray === false) {
				if (filter.type === "text") {
					if (prop === undefined) return false;
					if (prop.toLowerCase().indexOf(filter.value.toLowerCase()) === -1) {
						return false;
					}
				} else {
					if (prop === undefined) return false;
					if (
						filter.value !== undefined
						&& prop !== undefined
						&& prop !== filter.value
						&& !(filter.value === true && prop)
					) {
						return false;
					}
					if (filter.values && filter.values.indexOf(prop) === -1) {
						return false;
					}
				}
			} else {
				if (prop === undefined) return false;
				if (typeof prop === "object") {
					if (filter.value) {
						if (prop.indexOf(filter.value) === -1) {
							return false;
						}
					} else if (filter.values) {
						for (let val of filter.values) {
							if (prop.indexOf(val) !== -1) {
								continue;
							}
							return false;
						}
					}
				} else {
					for (let val of filter.values) {
						if (prop === val) {
							continue;
						}
					}
					return false;
				}
			}
		}

		return true;
	}

	// incomplete removal of duplicate items
	removeDuplicates(spellList) {
		// sort at n log n
		let sortedList = Object.values(spellList).sort((a, b) => a.name.localeCompare(b.name));

		// search through sorted list for duplicates
		for (let index = 0; index < sortedList.length - 1; ) {
			// all duplicates will be next to eachother
			if (sortedList[index].name === sortedList[index + 1].name) {
				// duplicate something is getting removed
				// TODO choose what to remove rather then the second
				let remove = index + 1;

				delete spellList[sortedList[remove].id];
				sortedList.splice(remove, 1);
			} else {
				index++;
			}
		}
	}

	clearObject(obj) {
		let newObj = {};
		for (let key in obj) {
			if (obj[key] === true) {
				newObj[key] = true;
			}
		}
		return newObj;
	}

	initSettings() {
		let defaultSettings = {
			loadedSpellCompendium: {},
			loadedNpcCompendium: {},
		};
		for (let compendium of game.packs) {
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
		game.settings.register(COMPENDIUM_BROWSER, "settings", {
			name: "Compendium Browser Settings",
			hint: "Settings to exclude packs from loading and visibility of the browser",
			default: defaultSettings,
			type: Object,
			scope: "world",
			onChange: (settings) => {
				this.settings = settings;
			},
		});
		game.settings.register(COMPENDIUM_BROWSER, "maxload", {
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
		game.settings.register(COMPENDIUM_BROWSER, "extraButtonsGlobal", {
			name: game.i18n.localize("CMPBrowser.SETTING.extraButtonsGlobal.NAME"),
			hint: game.i18n.localize("CMPBrowser.SETTING.extraButtonsGlobal.HINT"),
			scope: "world",
			config: true,
			default: true,
			type: Boolean,
		});
		game.settings.register(COMPENDIUM_BROWSER, "extraSheetButtons", {
			name: game.i18n.localize("CMPBrowser.SETTING.extraSheetButtons.NAME"),
			hint: game.i18n.localize("CMPBrowser.SETTING.extraSheetButtons.HINT"),
			scope: "client",
			config: true,
			default: true,
			type: Boolean,
		});
		game.settings.register(COMPENDIUM_BROWSER, "extraAdvancementButtons", {
			name: game.i18n.localize("CMPBrowser.SETTING.extraAdvancementButtons.NAME"),
			hint: game.i18n.localize("CMPBrowser.SETTING.extraAdvancementButtons.HINT"),
			scope: "client",
			config: true,
			default: true,
			type: Boolean,
		});
		game.settings.register(COMPENDIUM_BROWSER, "bannersGlobal", {
			name: game.i18n.localize("CMPBrowser.SETTING.bannersGlobal.NAME"),
			hint: game.i18n.localize("CMPBrowser.SETTING.bannersGlobal.HINT"),
			scope: "world",
			config: true,
			default: true,
			type: Boolean,
		});
		game.settings.register(COMPENDIUM_BROWSER, "bannersLocal", {
			name: game.i18n.localize("CMPBrowser.SETTING.bannersLocal.NAME"),
			hint: game.i18n.localize("CMPBrowser.SETTING.bannersLocal.HINT"),
			scope: "client",
			config: true,
			default: true,
			type: Boolean,
		});

		// load settings from container and apply to default settings (available compendie might have changed)
		let settings = game.settings.get(COMPENDIUM_BROWSER, "settings");
		for (let compKey in defaultSettings.loadedSpellCompendium) {
			// v0.7.1 Check for settings.loadedSpellCompendium
			if (settings.loadedSpellCompendium && settings.loadedSpellCompendium[compKey] !== undefined) {
				defaultSettings.loadedSpellCompendium[compKey].load = settings.loadedSpellCompendium[compKey].load;
			}
		}
		for (let compKey in defaultSettings.loadedNpcCompendium) {
			// v0.7.1 Check for settings.loadedNpcCompendium
			if (settings.loadedNpcCompendium && settings.loadedNpcCompendium[compKey] !== undefined) {
				defaultSettings.loadedNpcCompendium[compKey].load = settings.loadedNpcCompendium[compKey].load;
			}
		}
		defaultSettings.allowSpellBrowser = !!settings.allowSpellBrowser;
		defaultSettings.allowFeatBrowser = !!settings.allowFeatBrowser;
		defaultSettings.allowItemBrowser = !!settings.allowItemBrowser;
		defaultSettings.allowNpcBrowser = !!settings.allowNpcBrowser;

		this.settings = defaultSettings;
	}

	// FILTERS - Added on the Ready hook
	// 0.4.0 Make this async so filters can be added all at once
	async addFilter(entityType, category, label, path, type, possibleValues = null, valIsArray = false) {
		let target = `${entityType}Filters`;
		let filter = {};
		filter.path = path;
		filter.labelId = stripSpecialCharacters(label);
		filter.label = game.i18n.localize(label) ?? label;
		filter.type = "text";
		if (["text", "bool", "select", "multiSelect", "numberCompare"].indexOf(type) !== -1) {
			filter[`is${type}`] = true;
			filter.type = type;
		}

		if (possibleValues !== null) {
			filter.possibleValueIds = possibleValues;

			filter.possibleValues = Object.fromEntries(
				Object.entries(possibleValues).map(([key, data]) => {
					if (typeof data === "string") return [key, game.i18n.localize(data) ?? data];
					return [key, data.label];
				})
			);
		}
		filter.valIsArray = valIsArray;

		let catId = stripSpecialCharacters(category);
		if (this[target].registeredFilterCategorys[catId] === undefined) {
			this[target].registeredFilterCategorys[catId] = {
				label: game.i18n.localize(category) ?? category,
				labelId: catId,
				filters: [],
			};
		}
		this[target].registeredFilterCategorys[catId].filters.push(filter);
	}

	async addSpellFilters() {
		this.addSpellFilter("CMPBrowser.general", "DND5E.Source", "system.source", "text");
		this.addSpellFilter("CMPBrowser.general", "DND5E.Level", "system.level", "multiSelect", {
			0: "DND5E.SpellCantrip",
			1: "1",
			2: "2",
			3: "3",
			4: "4",
			5: "5",
			6: "6",
			7: "7",
			8: "8",
			9: "9",
		});
		this.addSpellFilter(
			"CMPBrowser.general",
			"DND5E.SpellSchool",
			"system.school",
			"select",
			this._sortPackValues(CONFIG.DND5E.spellSchools)
		);
		this.addSpellFilter("CMPBrowser.general", "CMPBrowser.castingTime", "system.activation.type", "select", {
			action: "DND5E.Action",
			bonus: "DND5E.BonusAction",
			reaction: "DND5E.Reaction",
			minute: "DND5E.TimeMinute",
			hour: "DND5E.TimeHour",
			day: "DND5E.TimeDay",
		});
		this.addSpellFilter(
			"CMPBrowser.general",
			"CMPBrowser.spellType",
			"system.actionType",
			"select",
			CONFIG.DND5E.itemActionTypes
		);
		this.addSpellFilter(
			"CMPBrowser.general",
			"CMPBrowser.damageType",
			"damageTypes",
			"select",
			this._sortPackValues(CONFIG.DND5E.damageTypes)
		);
		// JV-082: Fix for missing "Class" search feature
		this.addSpellFilter(
			"CMPBrowser.general",
			"ITEM.TypeClass",
			"classes",
			"select",
			this._sortPackValues({
				artificer: "CMPBrowser.artificer",
				bard: "CMPBrowser.bard",
				cleric: "CMPBrowser.cleric",
				druid: "CMPBrowser.druid",
				paladin: "CMPBrowser.paladin",
				ranger: "CMPBrowser.ranger",
				sorcerer: "CMPBrowser.sorcerer",
				warlock: "CMPBrowser.warlock",
				wizard: "CMPBrowser.wizard",
			}),
			true
		);
		this.addSpellFilter("DND5E.SpellComponents", "DND5E.Ritual", "system.properties.ritual", "bool");
		this.addSpellFilter("DND5E.SpellComponents", "DND5E.Concentration", "system.properties.concentration", "bool");
		this.addSpellFilter("DND5E.SpellComponents", "DND5E.ComponentVerbal", "system.properties.vocal", "bool");
		this.addSpellFilter("DND5E.SpellComponents", "DND5E.ComponentSomatic", "system.properties.somatic", "bool");
		this.addSpellFilter("DND5E.SpellComponents", "DND5E.ComponentMaterial", "system.properties.material", "bool");
	}

	async addItemFilters() {
		this.addItemFilter("CMPBrowser.general", "DND5E.Source", "system.source", "text");

		this.addItemFilter(
			"CMPBrowser.general",
			"Item Type",
			"type",
			"select",
			this._sortPackValues({
				consumable: "ITEM.TypeConsumable",
				backpack: "ITEM.TypeContainer",
				equipment: "ITEM.TypeEquipment",
				loot: "ITEM.TypeLoot",
				tool: "ITEM.TypeTool",
				weapon: "ITEM.TypeWeapon",
			})
		);

		this.addItemFilter(
			"CMPBrowser.general",
			"CMPBrowser.ItemsPacks",
			"matchedPacks",
			"select",
			this._sortPackValues({
				burglar: "CMPBrowser.ItemsPacksBurglar",
				diplomat: "CMPBrowser.ItemsPacksDiplomat",
				dungeoneer: "CMPBrowser.ItemsPacksDungeoneer",
				entertainer: "CMPBrowser.ItemsPacksEntertainer",
				explorer: "CMPBrowser.ItemsPacksExplorer",
				monsterhunter: "CMPBrowser.ItemsPacksMonsterHunter",
				priest: "CMPBrowser.ItemsPacksPriest",
				scholar: "CMPBrowser.ItemsPacksScholar",
			}),
			true
		);
		this.addItemFilter(
			"CMPBrowser.GameMechanics",
			"DND5E.ItemActivationCost",
			"system.activation.type",
			"select",
			CONFIG.DND5E.abilityActivationTypes
		);

		this.addItemFilter(
			"CMPBrowser.GameMechanics",
			"CMPBrowser.damageType",
			"damageTypes",
			"select",
			this._sortPackValues(CONFIG.DND5E.damageTypes)
		);
		this.addItemFilter("CMPBrowser.GameMechanics", "CMPBrowser.UsesResources", "usesRessources", "bool");

		this.addItemFilter(
			"CMPBrowser.ItemSubtype",
			"ITEM.TypeWeapon",
			"system.weaponType",
			"text",
			CONFIG.DND5E.weaponTypes
		);
		this.addItemFilter(
			"CMPBrowser.ItemSubtype",
			"ITEM.TypeEquipment",
			"system.armor.type",
			"text",
			this._sortPackValues(CONFIG.DND5E.equipmentTypes)
		);
		this.addItemFilter(
			"CMPBrowser.ItemSubtype",
			"ITEM.TypeConsumable",
			"system.consumableType",
			"text",
			this._sortPackValues(CONFIG.DND5E.consumableTypes)
		);

		const rarities = Object.fromEntries(
			Object.entries(CONFIG.DND5E.itemRarity).map(([key, value]) => [
				value,
				game.i18n.localize(`DND5E.ItemRarity${key.capitalize()}`).titleCase()
			])
		);
		this.addItemFilter("CMPBrowser.MagicItems", "DND5E.Rarity", "system.rarity", "select", rarities);
	}

	async addFeatFilters() {
		// Feature Filters
		// Foundry v10+ Item#data is now Item#system
		this.addFeatFilter("CMPBrowser.general", "DND5E.Source", "system.source", "text");
		this.addFeatFilter(
			"CMPBrowser.general",
			"ITEM.TypeClass",
			"classRequirement",
			"select",
			this._sortPackValues({
				artificer: "CMPBrowser.artificer",
				barbarian: "CMPBrowser.barbarian",
				bard: "CMPBrowser.bard",
				cleric: "CMPBrowser.cleric",
				druid: "CMPBrowser.druid",
				fighter: "CMPBrowser.fighter",
				monk: "CMPBrowser.monk",
				paladin: "CMPBrowser.paladin",
				ranger: "CMPBrowser.ranger",
				rogue: "CMPBrowser.rogue",
				sorcerer: "CMPBrowser.sorcerer",
				warlock: "CMPBrowser.warlock",
				wizard: "CMPBrowser.wizard",
			}),
			true
		);

		this.addFeatFilter(
			"CMPBrowser.general",
			"CMPBrowser.overall",
			"type",
			"select",
			this._sortPackValues({
				class: "ITEM.TypeClass",
				feat: "ITEM.TypeFeat",
				subclass: "ITEM.TypeSubclass",
				background: "DND5E.Background",
				race: "DND5E.Race",
			}),
			false
		);

		this.addFeatFilter(
			"CMPBrowser.general",
			"DND5E.ItemFeatureType",
			"system.type.value",
			"select",
			this._sortPackValues(
				Object.keys(dnd5e.config.featureTypes).reduce(function (acc, current) {
					acc[current] = dnd5e.config.featureTypes[current].label;
					return acc;
				}, {})
			),
			false
		);

		this.addFeatFilter(
			"CMPBrowser.general",
			"CMPBrowser.subfeature",
			"system.type.subtype",
			"select",
			this._sortPackValues(dnd5e.config.featureTypes.class.subtypes)
		);

		this.addFeatFilter(
			"CMPBrowser.GameMechanics",
			"DND5E.ItemActivationCost",
			"system.activation.type",
			"select",
			CONFIG.DND5E.abilityActivationTypes
		);
		this.addFeatFilter(
			"CMPBrowser.GameMechanics",
			"CMPBrowser.damageType",
			"damageTypes",
			"select",
			this._sortPackValues(CONFIG.DND5E.damageTypes)
		);
		this.addFeatFilter("CMPBrowser.GameMechanics", "CMPBrowser.UsesResources", "usesRessources", "bool");
	}

	_sortPackValues(packValue) {
		const sortable = Object.entries(packValue)
			.map(([key, data]) => {
				if (typeof data === "string") return [key, game.i18n.localize(data)];
				return [key, data.label];
			})
			.sort((a, b) => a[1].localeCompare(b[1]));

		return sortable.reduce((acc, item) => {
			acc[item[0]] = item[1];
			return acc;
		}, {});
	}

	async addNpcFilters() {
		// NPC Filters

		this.addNpcFilter("CMPBrowser.general", "DND5E.Source", "system.details.source", "text");
		this.addNpcFilter("CMPBrowser.general", "DND5E.Size", "system.traits.size", "select", CONFIG.DND5E.actorSizes);

		this.addNpcFilter("CMPBrowser.general", "CMPBrowser.hasLegAct", "system.resources.legact.max", "bool");
		this.addNpcFilter("CMPBrowser.general", "CMPBrowser.hasLegRes", "system.resources.legres.max", "bool");
		this.addNpcFilter("CMPBrowser.general", "DND5E.ChallengeRating", "system.details.cr", "numberCompare");

		let npcDetailsPath = "system.details.type.value";

		this.addNpcFilter(
			"CMPBrowser.general",
			"DND5E.CreatureType",
			npcDetailsPath,
			"select",
			this._sortPackValues(CONFIG.DND5E.creatureTypes)
		);
		this.addNpcFilter("DND5E.Abilities", "DND5E.AbilityStr", "system.abilities.str.value", "numberCompare");
		this.addNpcFilter("DND5E.Abilities", "DND5E.AbilityDex", "system.abilities.dex.value", "numberCompare");
		this.addNpcFilter("DND5E.Abilities", "DND5E.AbilityCon", "system.abilities.con.value", "numberCompare");
		this.addNpcFilter("DND5E.Abilities", "DND5E.AbilityInt", "system.abilities.int.value", "numberCompare");
		this.addNpcFilter("DND5E.Abilities", "DND5E.AbilityWis", "system.abilities.wis.value", "numberCompare");
		this.addNpcFilter("DND5E.Abilities", "DND5E.AbilityCha", "system.abilities.cha.value", "numberCompare");

		const damageTypes = this._sortPackValues(CONFIG.DND5E.damageTypes);
		this.addNpcFilter(
			"CMPBrowser.dmgInteraction",
			"DND5E.DamImm",
			"system.traits.di.value",
			"multiSelect",
			damageTypes,
			true
		);
		this.addNpcFilter(
			"CMPBrowser.dmgInteraction",
			"DND5E.DamRes",
			"system.traits.dr.value",
			"multiSelect",
			damageTypes,
			true
		);
		this.addNpcFilter(
			"CMPBrowser.dmgInteraction",
			"DND5E.DamVuln",
			"system.traits.dv.value",
			"multiSelect",
			damageTypes,
			true
		);
		this.addNpcFilter(
			"CMPBrowser.dmgInteraction",
			"DND5E.ConImm",
			"system.traits.ci.value",
			"multiSelect",
			this._sortPackValues(CONFIG.DND5E.conditionTypes),
			true
		);
	}

	/**
	 * Used to add custom filters to the Spell-Browser
	 * @param {String} category - Title of the category
	 * @param {String} label - Title of the filter
	 * @param {String} path - path to the data that the filter uses. uses dotnotation. example: data.abilities.dex.value
	 * @param {String} type - type of filter
	 *                      possible filter:
	 *                          text:           will give a textinput (or use a select if possibleValues has values) to compare with the data. will use objectData.indexOf(searchedText) to enable partial matching
	 *                          bool:           will see if the data at the path exists and not false.
	 *                          select:         exactly matches the data with the chosen selector from possibleValues
	 *                          multiSelect:    enables selecting multiple values from possibleValues, any of witch has to match the objects data
	 *                          numberCompare:  gives the option to compare numerical values, either with =, < or the > operator
	 * @param {Boolean} possibleValues - predetermined values to choose from. needed for select and multiSelect, can be used in text filters
	 * @param {Boolean} valIsArray - if the objects data is an object use this. the filter will check each property in the object (not recursive). if no match is found, the object will be hidden
	 */
	addSpellFilter(category, label, path, type, possibleValues = null, valIsArray = false) {
		this.addFilter("spell", category, label, path, type, possibleValues, valIsArray);
	}

	/**
	 * Used to add custom filters to the Spell-Browser
	 * @param {String} category - Title of the category
	 * @param {String} label - Title of the filter
	 * @param {String} path - path to the data that the filter uses. uses dotnotation. example: data.abilities.dex.value
	 * @param {String} type - type of filter
	 *                      possible filter:
	 *                          text:           will give a textinput (or use a select if possibleValues has values) to compare with the data. will use objectData.indexOf(searchedText) to enable partial matching
	 *                          bool:           will see if the data at the path exists and not false.
	 *                          select:         exactly matches the data with the chosen selector from possibleValues
	 *                          multiSelect:    enables selecting multiple values from possibleValues, any of witch has to match the objects data
	 *                          numberCompare:  gives the option to compare numerical values, either with =, < or the > operator
	 * @param {Boolean} possibleValues - predetermined values to choose from. needed for select and multiSelect, can be used in text filters
	 * @param {Boolean} valIsArray - if the objects data is an object use this. the filter will check each property in the object (not recursive). if no match is found, the object will be hidden
	 */
	addNpcFilter(category, label, path, type, possibleValues = null, valIsArray = false) {
		this.addFilter("npc", category, label, path, type, possibleValues, valIsArray);
	}

	addFeatFilter(category, label, path, type, possibleValues = null, valIsArray = false) {
		this.addFilter("feat", category, label, path, type, possibleValues, valIsArray);
	}

	addItemFilter(category, label, path, type, possibleValues = null, valIsArray = false) {
		this.addFilter("item", category, label, path, type, possibleValues, valIsArray);
	}

	async renderWith(tab = "spell", filters = []) {
		// if there isn't a tab error out
		if (!this[`${tab}Filters`]) {
			ui.notifications.warn(`no tab by name ${tab}`);
			return;
		}

		this.resetFilters();

		this.refreshList = tab;

		let html = await this.render();

		let activateFilters = filters.reduce((acc, input) => {
			let filter = this.findFilter(tab, input.section, input.label);

			if (filter) {
				if (input.value) {
					filter.value = input.value;
				} else if (input.values) {
					filter.values = input.values;
				} else {
					ui.notifications.warn(`no value(s) in filter:${tab} ${input.section}, ${input.label}`);
				}

				acc[stripSpecialCharacters(filter.path)] = filter;
			} else {
				ui.notifications.warn(`filter not found: tab:${tab} ${input.section}, ${input.label}.`);
			}

			return acc;
		}, {});

		this[`${tab}Filters`].activeFilters = activateFilters;

		// wait for after the afterRender function to change tabs
		// this avoids some errors when initially opening the window
		CompendiumBrowser.postRender = async () => {
			CompendiumBrowser.postRender = () => {};

			await html.activateTab(tab);

			for (let input of filters) {
				let filter = this.findFilter(tab, input.section, input.label);

				if (!filter) {
					continue;
				}

				const typeMap = {
					select: "select",
					bool: "select",
					text: "input",
				};

				if (filter.type in typeMap) {
					let component = html.element.find(
						`${this.getHtmlStringFromInput(input)} ${typeMap[filter.type]}`
					);

					component[0].value = input.value;
				} else if (filter.type === "multiSelect") {
					let components = html.element.find(this.getHtmlStringFromInput(input));

					for (let v of input.values) {
						let c = components.find(`input[data-value=${v}]`);
						c.prop("checked", true);
					}
				} else {
					ui.notifications.warn("Unknown filter type?");
				}
			}
		};

		this.render(true);

		return this;
	}

	getHtmlStringFromInput(input) {
		return `div.tab.active #${input.section}-${stripDotCharacters(input.label)}`;
	}

	findFilter(type, category, label) {
		let target = `${type}Filters`;
		let catId = stripSpecialCharacters(category);

		if (!this[target].registeredFilterCategorys[catId]) {
			return;
		}

		const labelStripped = stripDotCharacters(label);

		let filter = this[target].registeredFilterCategorys[catId].filters.find((x) => x.labelId === labelStripped);

		if (!filter) {
			return;
		}

		return {
			path: filter.path,
			type: filter.type,
			valIsArray: filter.valIsArray,
		};
	}

	async copySearchToClipboard(tab) {
		const text = this.getSearchText(tab);

		try {
			await navigator.clipboard.writeText(text);
			ui.notifications.info("Javascript Copied to clipboard");
		} catch(err) {
			ui.notifications.warn("failed to copy javascript to clipboard, check logs for string");
			console.error("Failed to copy: ", err);
		}
	}

	getSearchText(tab) {
		const target = `${tab}Filters`;

		// map active filters to their labels
		let output = Object.values(this[target].activeFilters).map((filter) => {
			// find Filters from paths
			let out = this.findFilterR(target, filter);

			if (filter.value) {
				out.value = filter.value;
			} else if (filter.values) {
				out.values = filter.values;
			}

			return out;
		});

		const strOut = `game.compendiumBrowser.renderWith("${tab}", ${JSON.stringify(output)})`;

		return strOut;
	}

	findFilterR(target, filterTarget) {
		for (let cat of Object.keys(this[target].registeredFilterCategorys)) {
			for (let filter of this[target].registeredFilterCategorys[cat].filters) {
				if (filterTarget.path === filter.path) {
					return { section: `${cat}`, label: `${filter.labelId}` };
				}
			}
		}

		ui.notifications.warn("Could not find the filter!!");
		console.warn(filterTarget);

	}

	static async addTidySheetButton(cb, html, actor) {
		await CompendiumBrowser.createBanners(html);
		await CompendiumBrowser.addButtons(html, actor);
	}

	static async addButtons(html, actor) {

		// exit out because we dont want these
		if (!CompendiumBrowser.extraButtonsGlobal || !CompendiumBrowser.extraSheetButtons) {
			return;
		}

		await CompendiumBrowser.addTidyFeatureButton(html, "race");
		await CompendiumBrowser.addTidyFeatureButton(html, "background");
		await CompendiumBrowser.addTidyFeatureButton(html, "class");

		await html.find(".spell-browser-btn").remove();

		let tabBar = html.find("div.tab.spellbook .spellcasting-ability");

        const tooltip = game.i18n.localize("CMPBrowser.ToolTip.Spells");
		const cbButton = $(
			`<div style="flex: 0 0 22px; align-self: center; text-align: center;">
				<a title="${tooltip}" class="compendium-browser spell-browser-btn">
					<i class="fa-duotone fa-book"></i>
				</a>
			</div>`
		);

		tabBar.append(cbButton);

		CompendiumBrowser.addSpellsButton(cbButton, actor.actor);
	}

	static async createBanners(html) {
		// Don't build the banners if configuration is turned off
		if (!CompendiumBrowser.bannersGlobal || !CompendiumBrowser.bannersLocal) {
			return;
		}

		let MAP_THING = {};
		MAP_THING[game.i18n.localize("DND5E.Race")] = "race";
		MAP_THING[game.i18n.localize("DND5E.Background")] = "background";
		MAP_THING[game.i18n.localize("ITEM.TypeClassPl")] = "class";

		let isSearchable = (name) => {
			return Object.keys(MAP_THING).includes(name);
		};

		// searches in a similar way to how tidy sheets does it.
		// probably should just use actor data instead of going through the html
		html.find(".inventory-list.features-list .item-list").filter(function () {
			// find any section that is searchable
			return isSearchable($(this.previousElementSibling).find("h3.item-name")[0].innerText)
				// find any section that is empty
				&& $(this).find("li.item").length === 0;
		}).each( function () {
			let type = MAP_THING[$(this.previousElementSibling).find("h3.item-name")[0].innerText];
			let banner = $(`<span class="notice" style="background:rgba(30, 30, 30, 1)">${game.i18n.localize(`CMPBrowser.FindA.${type}`)}</span>`);

			banner.insertAfter(this);

			banner.click(async (ev) => {
				ev.preventDefault();

				game.compendiumBrowser.renderWith("feat", [{ section: "CMPBrowsergeneral", label: "CMPBrowser.overall", value: type }]);
			});
		});

	}

	static async addDefaultSheetButton(cb, html, actor) {
		// exit out because we dont want these
		if (!CompendiumBrowser.extraButtonsGlobal || !CompendiumBrowser.extraSheetButtons) {
			return;
		}

		if (cb.options.classes.includes("tidy5e")) {
			// no need as tidy sheet render will handle it
			return;
		}

		await CompendiumBrowser.addDefaultFeatureButton(html, "race");
		await CompendiumBrowser.addDefaultFeatureButton(html, "background");
		await CompendiumBrowser.addDefaultFeatureButton(html, "class");

		// handle spell browser button
		await html.find(".spell-browser-btn").remove();

		let tabBar = html.find("div.spellbook-filters");
		const cbButton = $(
			`<div style="flex: 0 0 22px; align-self: center; text-align: center;">
				<a data-tooltip="CMPBrowser.ToolTip.Spells" class="compendium-browser spell-browser-btn">
					<i class="fa-duotone fa-book"></i>
				</a>
			</div>`
		);

		tabBar.append(cbButton);

		CompendiumBrowser.addSpellsButton(cbButton, actor.actor);
	}

	static addSpellsButton(cbButton, character) {
		cbButton.click(async (ev) => {
			ev.preventDefault();

			let target = [];

			target = target.concat(CompendiumBrowser.findCasterClass(character));
			target = target.concat(CompendiumBrowser.findMaxCasterLevel(character));

			game.compendiumBrowser.renderWith("spell", target);
		});
	}

	static async addTidyFeatureButton(html, type) {
		const featBars = html.find(`div.features a.item-create[data-type="${type}"]`);

		const tooltip = game.i18n.localize("CMPBrowser.ToolTip.Features");
		const cbButton = $(
			`<a style="flex: 0 0 15px; align-self: center; text-align: center; class="compendium-browser ${type}-browser-btn" title="${tooltip}">
				<i class="fa-duotone fa-book"></i>
			</a>`
		);

		$(featBars[0].parentNode).append(cbButton);
		cbButton.click(async (ev) => {
			ev.preventDefault();

			game.compendiumBrowser.renderWith("feat", [{ section: "CMPBrowsergeneral", label: "CMPBrowser.overall", value: type }]);
		});
	}

	static async addDefaultFeatureButton(html, type) {
		await html.find(`.${type}-browser-btn`).remove();

		const featBars = html.find(`div.features li.items-header a.item-control[data-type="${type}"]`);

		// Other sheets (like tidysheet) may cause this problem
		if (!featBars.length) {
			return;
		}

		const cbButton = $(
			`<a style="flex: 0 0 15px; align-self: center; text-align: center; class="compendium-browser ${type}-browser-btn" data-tooltip="CMPBrowser.ToolTip.Features">
				<i class="fa-duotone fa-book"></i>
			</a>`
		);

		$(featBars[0].parentNode).append(cbButton);
		$(featBars[0].parentNode).css({"flex-basis": "60px"});

		cbButton.click(async (ev) => {
			ev.preventDefault();

			game.compendiumBrowser.renderWith("feat", [{ section: "CMPBrowsergeneral", label: "CMPBrowser.overall", value: type }]);
		});
	}

	static async addASISheetButton(cb, html) {
		// exit out because we dont want these
		if (!CompendiumBrowser.extraButtonsGlobal || !CompendiumBrowser.extraAdvancementButtons) {
			return;
		}

		await html.find(".feat-browser-btn").remove();

		let dropArea = html.find("h3:nth-child(3)");
		const cbButton = $(
			`<span style="font-size: 16px;">
				<a data-tooltip="CMPBrowser.ToolTip.Feats" class="compendium-browser feat-browser-btn">
					<i class="fa-duotone fa-book"></i>
				</a>
			</span>`
		);

		dropArea.append(cbButton);

		cbButton.click(async (ev) => {
			ev.preventDefault();

			game.compendiumBrowser.renderWith("feat", [
				{
					section: "CMPBrowsergeneral",
					label: "DND5EItemFeatureType",
					value: "feat",
				},
			]);
		});
	}

	// find the first caster class of the character
	static findCasterClass(character) {
		const options = ["artificer", "bard", "cleric", "druid", "paladin", "ranger", "sorcerer", "warlock", "wizard"];

		for (let cls of Object.keys(character.classes)) {
			if (options.includes(cls)) {
				return [{ section: "CMPBrowsergeneral", label: "ITEM.TypeClass", value: cls }];
			}
		}

		return [];
	}

	static findMaxCasterLevel(character) {
		// find max spell level
		let maxLevel = Object.keys(character.system.spells).reduce((acc, spell) => {
			// special case for pact magic
			if (spell === "pact") {
				return Math.max(character.system.spells[spell].level, acc);
			} else {
				let spellObject = character.system.spells[spell];
				if ((spellObject.override ?? spellObject.max) > 0) {
					let match = spell.match(/spell(?<lvl>\d+)/);
					return Math.max(parseInt(match.groups.lvl), acc);
				}
			}

			return acc;
		}, 0);

		if (maxLevel > 0) {
			return [
				{
					section: "CMPBrowsergeneral",
					label: "DND5ELevel",
					values: [...Array(maxLevel + 1).keys()],
				},
			];
		}

		return [];
	}
}

Hooks.once("init", async () => {
	registerSettings();
	await preloadTemplates();
});

Hooks.once("setup", () => {
	game.compendiumBrowser = new CompendiumBrowser();
	game.compendiumBrowser.setup();
});

Hooks.on("changeSidebarTab", (app) => {
	if (app.tabName !== "compendium") return;
	game.compendiumBrowser.hookCompendiumList(app.element);
});
Hooks.on("renderSidebarTab", (app, html, data) => {
	if (app.tabName !== "compendium") return;
	game.compendiumBrowser.hookCompendiumList(html);
});

function stripSpecialCharacters(str) {
	return str.replace(/\W/g, "");
}

function stripDotCharacters(str) {
	return str.replace(/\./g, "");
}

function set(obj, path, value) {
	let schema = obj; // a moving reference to internal objects within obj
	let pList = path.split(".");
	let len = pList.length;
	for (let i = 0; i < len - 1; i++) {
		let elem = pList[i];
		if (!schema[elem]) schema[elem] = {};
		schema = schema[elem];
	}

	schema[pList[len - 1]] = value;
}

function getPropByString(obj, propString) {
	if (!propString) return obj;

	const props = propString.split(".");
	let result = obj;

	for (const prop of props) {
		if (result !== undefined) {
			result = result[prop];
		} else {
			break;
		}
	}
	return result;
}

Hooks.on("renderActorSheet5eCharacter", CompendiumBrowser.addDefaultSheetButton);
Hooks.on("renderTidy5eSheet", CompendiumBrowser.addTidySheetButton);
Hooks.on("renderAbilityScoreImprovementFlow", CompendiumBrowser.addASISheetButton);

Hooks.on("renderCompendiumBrowser", CompendiumBrowser.afterRender);
