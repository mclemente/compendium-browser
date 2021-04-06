/* eslint-disable valid-jsdoc */
/* eslint-disable complexity */

const CMPBrowser = {
	MODULE_NAME : "compendium-browser-t20",
	MODULE_VERSION : "0.4.5",
	MAXLOAD : 500,	  //Default for the maximum number to load before displaying a message that you need to filter to see more
}

class CompendiumBrowser extends Application {

	static get defaultOptions() {
		const options = super.defaultOptions;
		mergeObject(options, {
			title: "CMPBrowser.compendiumBrowser",
			tabs: [{navSelector: ".tabs", contentSelector: ".content", initial: "spell"}],
			classes: options.classes.concat('compendium-browser'),
			template: "modules/compendium-browser-t20/template/template.html",
			width: 800,
			height: 700,
			resizable: true,
			minimizable: true
		});
		return options;
	}

	async initialize() {
		// load settings
		if (this.settings === undefined) {
			this.initSettings();
		} 

		await loadTemplates([
			"modules/compendium-browser-t20/template/spell-browser.html",
			"modules/compendium-browser-t20/template/spell-browser-list.html",	   
			"modules/compendium-browser-t20/template/npc-browser.html",
			"modules/compendium-browser-t20/template/npc-browser-list.html",
			"modules/compendium-browser-t20/template/feat-browser.html",
			"modules/compendium-browser-t20/template/feat-browser-list.html",
			"modules/compendium-browser-t20/template/item-browser.html",
			"modules/compendium-browser-t20/template/item-browser-list.html",
			"modules/compendium-browser-t20/template/filter-container.html",
			"modules/compendium-browser-t20/template/settings.html",
			"modules/compendium-browser-t20/template/loading.html"
		]);

		this.hookCompendiumList();
		
		//Reset the filters used in the dialog
		this.spellFilters = {
			registeredFilterCategorys: {},
			activeFilters: {}
		};
		this.npcFilters = {
			registeredFilterCategorys: {},
			activeFilters: {}
		};
		this.featFilters = {
			registeredFilterCategorys: {},
			activeFilters: {}
		};
		this.itemFilters = {
			registeredFilterCategorys: {},
			activeFilters: {}
		};
	}


	/** override */
	_onChangeTab(event, tabs, active) {
		super._onChangeTab(event, tabs, active);
		const html = this.element;
		this.replaceList(html, active, {reload : false})
	}


	/** override */
	async getData() {   

		//0.4.1 Filter as we load to support new way of filtering
		//Previously loaded all data and filtered in place; now loads minimal (preload) amount, filtered as we go
		//First time (when you press Compendium Browser button) is called with filters unset
 
		//0.4.1k: Don't do any item/npc loading until tab is visible
		let data = {
			items : [],
			npcs: [],
			spellFilters : this.spellFilters,
			showSpellBrowser : (game.user.isGM || this.settings.allowSpellBrowser),
			featFilters : this.featFilters,
			showFeatBrowser : (game.user.isGM || this.settings.allowFeatBrowser),
			itemFilters : this.itemFilters,
			showItemBrowser : (game.user.isGM || this.settings.allowItemBrowser),
			npcFilters : this.npcFilters,
			showNpcBrowser : (game.user.isGM || this.settings.allowNpcBrowser),
			settings : this.settings,
			isGM : game.user.isGM
		};


		return data;
	}

	activateItemListListeners(html) {
		// show entity sheet
		html.find('.item-edit').click(ev => {
			let itemId = $(ev.currentTarget).parents("li").attr("data-entry-id");
			let compendium = $(ev.currentTarget).parents("li").attr("data-entry-compendium");
			let pack = game.packs.find(p => p.collection === compendium);
			pack.getEntity(itemId).then(entity => {
				entity.sheet.render(true);
			});
		});

		// make draggable
		//0.4.1: Avoid the game.packs lookup
		html.find('.draggable').each((i, li) => {
			li.setAttribute("draggable", true);
			li.addEventListener('dragstart', event => {
				let packName = li.getAttribute("data-entry-compendium");
				let pack = game.packs.find(p => p.collection === packName);
				if (!pack) {
					event.preventDefault();
					return false;
				}
				event.dataTransfer.setData("text/plain", JSON.stringify({
					type: pack.entity,
					pack: pack.collection,
					id: li.getAttribute("data-entry-id")
				}));
			}, false);
		});
	}

	/** override */
	activateListeners(html) {
		super.activateListeners(html);

		this.observer = new IntersectionObserver((entries, observer) => {
			for (let e of entries) {
				if (!e.isIntersecting) continue;
				const img = e.target;
				// Avatar image
				//const img = li.querySelector("img");
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
		html.find('.filtercontainer h3, .multiselect label').click(async ev => {
			await $(ev.target.nextElementSibling).toggle(100);

		});
		html.find('.multiselect label').trigger('click');

		// sort spell list
		html.find('.spell-browser select[name=sortorder]').on('change', ev => {
			let spellList = html.find('.spell-browser li');
			let byName = (ev.target.value == 'true');
			let sortedList = this.sortSpells(spellList, byName);
			let ol = $(html.find('.spell-browser ul'));
			ol[0].innerHTML = [];
			for (let element of sortedList) {
				ol[0].append(element);
			}
		});
		this.triggerSort(html, "spell");

		// sort feat list in place
		html.find('.feat-browser select[name=sortorder]').on('change', ev => {
			let featList = html.find('.feat-browser li');
			let byName = (ev.target.value == 'true');
			let sortedList = this.sortFeats(featList, byName);
			let ol = $(html.find('.feat-browser ul'));
			ol[0].innerHTML = [];
			for (let element of sortedList) {
				ol[0].append(element);
			}
		});
		this.triggerSort(html, "feat");

		// sort item list in place
		html.find('.item-browser select[name=sortorder]').on('change', ev => {
			let itemList = html.find('.item-browser li');
			let byName = (ev.target.value == 'true');
			let sortedList = this.sortItems(itemList, byName);
			let ol = $(html.find('.item-browser ul'));
			ol[0].innerHTML = [];
			for (let element of sortedList) {
				ol[0].append(element);
			}
		});
		this.triggerSort(html, "item");

		// sort npc list in place
		html.find('.npc-browser select[name=sortorder]').on('change', ev => {
			let npcList = html.find('.npc-browser li');
			let orderBy = ev.target.value;
			let sortedList = this.sortNpcs(npcList, orderBy);
			let ol = $(html.find('.npc-browser ul'));
			ol[0].innerHTML = [];
			for (let element of sortedList) {
				ol[0].append(element);
			}
		});
		this.triggerSort(html, "npc");

		// reset filters and re-render
		//0.4.3: Reset ALL filters because when we do a re-render it affects all tabs
		html.find('#reset-spell-filter').click(ev => {
			this.resetFilters();
			//v0.4.3: Re-render so that we display the filters correctly
			this.refreshList = "spell";
			this.render();
		});

		html.find('#reset-feat-filter').click(ev => {
			this.resetFilters();
			//v0.4.3: Re-render so that we display the filters correctly
			this.refreshList = "feat";
			this.render();
		});

		html.find('#reset-item-filter').click(ev => {
			this.resetFilters();
			//v0.4.3: Re-render so that we display the filters correctly
			this.refreshList = "item";
			this.render();

		});

		html.find('#reset-npc-filter').click(ev => {
			this.resetFilters();
			//v0.4.3: Re-render so that we display the filters correctly
			this.refreshList = "npc";
			this.render();
		});

		// settings
		html.find('.settings input').on('change', ev => {
			let setting = ev.target.dataset.setting;
			let value = ev.target.checked;
			if (setting === 'spell-compendium-setting') {
				let key = ev.target.dataset.key;
				this.settings.loadedSpellCompendium[key].load = value;
				this.render();
				ui.notifications.info("Settings Saved. Item Compendiums are being reloaded.");
			} else if (setting === 'npc-compendium-setting') {
				let key = ev.target.dataset.key;
				this.settings.loadedNpcCompendium[key].load = value;
				this.render();
				ui.notifications.info("Settings Saved. NPC Compendiums are being reloaded.");
			}
			if (setting === 'allow-spell-browser') {
				this.settings.allowSpellBrowser = value;
			}
			if (setting === 'allow-feat-browser') {
				this.settings.allowFeatBrowser = value;
			}
			if (setting === 'allow-item-browser') {
				this.settings.allowItemBrowser = value;
			}
			if (setting === 'allow-npc-browser') {
				this.settings.allowNpcBrowser = value;
			}
			this.saveSettings();
		});


		// activating or deactivating filters
		//0.4.1: Now does a re-load and updates just the data side
		// text filters
		html.find('.filter[data-type=text] input, .filter[data-type=text] select').on('keyup change paste', ev => {
			const path = $(ev.target).parents('.filter').data('path');
			const key = path.replace(/\./g, '');
			const value = ev.target.value;
			const browserTab = $(ev.target).parents('.tab').data('tab');

			const filterTarget = `${browserTab}Filters`;

			if (value === '' || value === undefined) {
				delete this[filterTarget].activeFilters[key];
			} else {
				this[filterTarget].activeFilters[key] = {
					path: path,
					type: 'text',
					valIsArray: false,
					value: ev.target.value
				}
			}

			this.replaceList(html, browserTab);   
		});

		// select filters
		html.find('.filter[data-type=select] select, .filter[data-type=bool] select').on('change', ev => {
			const path = $(ev.target).parents('.filter').data('path');
			const key = path.replace(/\./g, '');
			const filterType = $(ev.target).parents('.filter').data('type');
			const browserTab = $(ev.target).parents('.tab').data('tab');
			let valIsArray = $(ev.target).parents('.filter').data('valisarray');
			if (valIsArray === 'true') valIsArray = true;
			let value = ev.target.value;
			if (value === 'false') value = false;
			if (value === 'true') value = true;

			const filterTarget = `${browserTab}Filters`;

			if (value === "null") {
				delete this[filterTarget].activeFilters[key]
			} else {
				this[filterTarget].activeFilters[key] = {
					path: path,
					type: filterType,
					valIsArray: valIsArray,
					value:value
				}
			}
			this.replaceList(html, browserTab);	  
		});

		// multiselect filters
		html.find('.filter[data-type=multiSelect] input').on('change', ev => {
			const path = $(ev.target).parents('.filter').data('path');
			const key = path.replace(/\./g, '');
			const filterType = 'multiSelect';
			const browserTab = $(ev.target).parents('.tab').data('tab');
			let valIsArray = $(ev.target).parents('.filter').data('valisarray');
			if (valIsArray === 'true') valIsArray = true;
			let value = $(ev.target).data('value');

			const filterTarget = `${browserTab}Filters`;
			const filter = this[filterTarget].activeFilters[key];

			if (ev.target.checked === true) {
				if (filter === undefined) {
					this[filterTarget].activeFilters[key] = {
						path: path,
						type: filterType,
						valIsArray: valIsArray,
						values: [value]
					}
				} else {
					this[filterTarget].activeFilters[key].values.push(value);
				}
			} else {
				delete this[filterTarget].activeFilters[key].values.splice(this[filterTarget].activeFilters[key].values.indexOf(value),1);
				if (this[filterTarget].activeFilters[key].values.length === 0) {
					delete this[filterTarget].activeFilters[key];
				}
			}

			this.replaceList(html, browserTab);   
		});


		html.find('.filter[data-type=numberCompare] select, .filter[data-type=numberCompare] input').on('change keyup paste', ev => {
			const path = $(ev.target).parents('.filter').data('path');
			const key = path.replace(/\./g, '');
			const filterType = 'numberCompare';
			const browserTab = $(ev.target).parents('.tab').data('tab');
			let valIsArray = false;

			const operator = $(ev.target).parents('.filter').find('select').val();
			const value = $(ev.target).parents('.filter').find('input').val();

			const filterTarget = `${browserTab}Filters`;

			if (value === '' || operator === 'null') {
				delete this[filterTarget].activeFilters[key]
			} else {
				this[filterTarget].activeFilters[key] = {
					path: path,
					type: filterType,
					valIsArray: valIsArray,
					operator: operator,
					value: value
				}
			}

			this.replaceList(html, browserTab);
		});

		//Just for the loading image
		if (this.observer) { 
			html.find("img").each((i,img) => this.observer.observe(img));
		}
	}

	async loadAndFilterItems(browserTab="spell",updateLoading=null) {
		const maxLoad = game.settings.get(CMPBrowser.MODULE_NAME, "maxload") ?? CMPBrowser.MAXLOAD;
	   
		//0.4.1: Load and filter just one of spells, feats, and items (specified by browserTab)
		let numItemsLoaded = 0;
		let compactItems = {};

		//Filter the full list, but only save the core compendium information + displayed info 
		for (let pack of game.packs) {
			if (pack['metadata']['entity'] === "Item" && this.settings.loadedSpellCompendium[pack.collection].load) {
//FIXME: How much could we do with the loaded index rather than all content? 
//OR filter the content up front for the decoratedItem.type??			   
				await pack.getContent().then(content => {
					for (let item5e of content) {
						let compactItem = null;
						const decoratedItem = this.decorateItem(item5e);
						if (decoratedItem) {
							switch (browserTab) {
								case "spell":
									if ((decoratedItem.type === "magia") && this.passesFilter(decoratedItem, this.spellFilters.activeFilters)) {
										compactItem = {
											compendium : pack.collection,
											name : decoratedItem.name,
											img: decoratedItem.img,
											data : {
												level : decoratedItem.data?.level,
												components : decoratedItem.data?.components
											}
										}
									}
									break;

								case "feat":
									if (["poder"].includes(decoratedItem.type) && this.passesFilter(decoratedItem, this.featFilters.activeFilters)) {
										compactItem = {
											compendium : pack.collection,
											name : decoratedItem.name,
											img: decoratedItem.img,
											classRequirementString : decoratedItem.classRequirementString
										}
									}									
									break;

								case "item":
									//0.4.5: Itm type for true items could be many things (weapon, consumable, etc) so we just look for everything except spells, feats, classes
									if (!["magia","poder","classe"].includes(decoratedItem.type) && this.passesFilter(decoratedItem, this.itemFilters.activeFilters)) {
										compactItem = {
											compendium : pack.collection,
											name : decoratedItem.name,
											img: decoratedItem.img,
											type : decoratedItem.type
										}
									}
									break;

								default:
									break;
							}

							if (compactItem) {  //Indicates it passed the filters
								compactItems[decoratedItem._id] = compactItem; 
								if (numItemsLoaded++ >= maxLoad) break;
								//0.4.2e: Update the UI (e.g. "Loading 142 spells")
								if (updateLoading) {updateLoading(numItemsLoaded);}
							}
						}
					}//for item5e of content
				});
			}//end if pack entity === Item
			if (numItemsLoaded >= maxLoad) break;
		}//for packs
		this.itemsLoaded = true;
		return compactItems;
	}

	async loadItems(numToPreload=CMPBrowser.PRELOAD) {
		this.itemsLoaded = false;
	  
		let numSpellsLoaded = 0;
		let numFeatsLoaded = 0;
		let numItemsLoaded = 0;
		let items = {
			spells: {},
			feats: {},
			items: {}
		};


		for (let pack of game.packs) {
			if (pack['metadata']['entity'] === "Item" && this.settings.loadedSpellCompendium[pack.collection].load) {
				await pack.getContent().then(content => {
					for (let item5e of content) {
						let item = item5e.data;
						if (item.type === 'magia') {
							//0.4.1 Only preload a limited number and fill more in as needed
							if (numSpellsLoaded++ > numToPreload) continue;

							item.compendium = pack.collection;
							items.spells[(item._id)] = item;
						}
						else if (item.type === 'poder') {
							//0.4.1 Only preload a limited number and fill more in as needed
							if (numFeatsLoaded++ > numToPreload) continue;

							item.compendium = pack.collection;

							// getting uses/ressources status
							item.usesRessources = item5e.hasLimitedUses;

							item.hasSave = item5e.hasSave;

							items.feats[(item._id)] = item;

						}
						else {
							//0.4.1 Only preload a limited number and fill more in as needed
							if (numItemsLoaded++ > numToPreload) continue;

							item.compendium = pack.collection;
							items.items[(item._id)] = item;
						}		  

					}//for item5e of content
				});
			}
			if ((numSpellsLoaded >= numToPreload) && (numFeatsLoaded >= numToPreload) && (numItemsLoaded >= numToPreload)) break;
		}//for packs 
		this.itemsLoaded = true;  
		return items;
	}
	
	async loadAndFilterNpcs(updateLoading=null) {
		let npcs = {};

		const maxLoad = game.settings.get(CMPBrowser.MODULE_NAME, "maxload") ?? CMPBrowser.MAXLOAD;
	   
		let numNpcsLoaded = 0;
		this.npcsLoaded = false;
		for (let pack of game.packs) {
			if (pack['metadata']['entity'] == "Actor" && this.settings.loadedNpcCompendium[pack.collection].load) {
				await pack.getContent().then(async content => {
					
					for (let npc of content) {
						let compactNpc = null;
						const decoratedNpc = this.decorateNpc(npc);
						if (decoratedNpc && this.passesFilter(decoratedNpc, this.npcFilters.activeFilters)) {
							//0.4.2: Don't store all the details - just the display elements
							compactNpc = {
								compendium : pack.collection,
								name : decoratedNpc.name,
								img: decoratedNpc.img,
								displayCR : decoratedNpc.displayCR,
								displaySize : decoratedNpc.displaySize,
								displayType: decoratedNpc.data?.attributes?.raca,
								orderCR : decoratedNpc.data.nd,
								orderSize : decoratedNpc.filterSize
							}
							if (compactNpc) {
								npcs[decoratedNpc._id] = compactNpc;
								//0.4.2 Don't load more than maxLoad; display a message to filter
								if (numNpcsLoaded++ > maxLoad) break;
								//0.4.2e: Update the UI (e.g. "Loading 142 NPCs")
								if (updateLoading) {updateLoading(numNpcsLoaded);}
							}
						}
					}
				});
			}
		   //0.4.1 Only preload a limited number and fill more in as needed
			if (numNpcsLoaded >= maxLoad) break;
		}

		this.npcsLoaded = true;
		return npcs;
	}
	


	hookCompendiumList() {
		Hooks.on('renderCompendiumDirectory', (app, html, data) => {
			this.hookCompendiumList();
		});

		let html = $('#compendium');
		if (this.settings === undefined) {
			this.initSettings();
		}
		if (game.user.isGM || this.settings.allowSpellBrowser || this.settings.allowNpcBrowser) {
			const cbButton = $(`<button class="compendium-browser-btn"><i class="fas fa-fire"></i> ${game.i18n.localize("CMPBrowser.compendiumBrowser")}</button>`);
			html.find('.compendium-browser-btn').remove();

			// adding to directory-list since the footer doesn't exist if the user is not gm
			html.find('.directory-footer').append(cbButton);

			// Handle button clicks
			cbButton.click(ev => {
				ev.preventDefault();
				//0.4.1: Reset filters when you click button
				this.resetFilters();
				//0.4.3: Reset everything (including data) when you press the button - calls afterRender() hook
				 
				if (game.user.isGM || this.settings.allowSpellBrowser) {
					this.refreshList = "spell";
				} else if (this.settings.allowFeatBrowser) {
					this.refreshList = "feat";
				} else if (this.settings.allowItemBrowser) {
					this.refreshList = "item";
				} else if (this.settings.allowNPCBrowser) {
					this.refreshList = "npc";
				}
				this.render(true);
			});
		}
	}

	
	/* Hook to load the first data */
	static afterRender(cb, html) {
		//0.4.3: Because a render always resets ALL the displayed filters (on all tabs) to unselected , we have to blank all the lists as well
		// (because the current HTML template doesn't set the selected filter values)
		if (!cb?.refreshList) {return;}

		cb.replaceList(html, cb.refreshList);

		cb.refreshList = null;
	}

	resetFilters() {
		this.spellFilters.activeFilters = {};
		this.featFilters.activeFilters = {};
		this.itemFilters.activeFilters = {};
		this.npcFilters.activeFilters = {};
	}



	async replaceList(html, browserTab, options = {reload : true}) {
		//After rendering the first time or re-rendering trigger the load/reload of visible data
 
		let elements = null;
		//0.4.2 Display a Loading... message while the data is being loaded and filtered
		let loadingMessage = null;
		if (browserTab === 'spell') {
			elements = html.find("ul#CBSpells");
			loadingMessage = html.find("#CBSpellsMessage");
		} else if (browserTab === 'npc') {
			elements = html.find("ul#CBNPCs");
			loadingMessage = html.find("#CBNpcsMessage");			
		} else if (browserTab === 'feat') {
			elements = html.find("ul#CBFeats");
			loadingMessage = html.find("#CBFeatsMessage");			
		} else if (browserTab === 'item') {
			elements = html.find("ul#CBItems");
			loadingMessage = html.find("#CBItemsMessage");			
		}
		if (elements?.length) {
			//0.4.2b: On a tab-switch, only reload if there isn't any data already 
			if (options?.reload || !elements[0].children.length) {

				const maxLoad = game.settings.get(CMPBrowser.MODULE_NAME, "maxload") ?? CMPBrowser.MAXLOAD;
				const updateLoading = async numLoaded => {
					if (loadingMessage.length) {this.renderLoading(loadingMessage[0], browserTab, numLoaded, numLoaded>=maxLoad);}
				}
				updateLoading(0);

				//Uses loadAndFilterItems to read compendia for items which pass the current filters and render on this tab
				const newItemsHTML = await this.renderItemData(browserTab, updateLoading); 
				elements[0].innerHTML = newItemsHTML;
				//Re-sort before setting up lazy loading
				this.triggerSort(html, browserTab);

				//Lazy load images
				if (this.observer) { 
					$(elements).find("img").each((i,img) => this.observer.observe(img));
				}

				//Reactivate listeners for clicking and dragging
				this.activateItemListListeners($(elements));
			}
		}

	}

	async renderLoading(messageElement, itemType, numLoaded, maxLoaded=false) {
		if (!messageElement) return;
		
		if (itemType === "spell") itemType = "magias";
		else if (itemType === "feat") itemType = "poderes";
		else if (itemType === "item") itemType = "itens";
		else if (itemType === "npc") itemType = "personagens de mestre";
		let loadingHTML = await renderTemplate("modules/compendium-browser-t20/template/loading.html", {numLoaded: numLoaded, itemType: itemType, maxLoaded: maxLoaded});
		messageElement.innerHTML = loadingHTML;
	}

	async renderItemData(browserTab, updateLoading=null) {
		let listItems;
		if (browserTab === "npc") {
			listItems = await this.loadAndFilterNpcs(updateLoading);
		} else {
			listItems = await this.loadAndFilterItems(browserTab, updateLoading);
		}
		const html = await renderTemplate(`modules/compendium-browser-t20/template/${browserTab}-browser-list.html`, {listItems : listItems})

		return html;
	}

	//SORTING
	triggerSort(html, browserTab) {
		if (browserTab === 'spell') {
			html.find('.spell-browser select[name=sortorder]').trigger('change');
		} else if (browserTab === 'feat') {
			html.find('.feat-browser select[name=sortorder]').trigger('change');
		} else if (browserTab === 'npc') {
			html.find('.npc-browser select[name=sortorder]').trigger('change')
		} else if (browserTab === 'item') {
			html.find('.item-browser select[name=sortorder]').trigger('change');
		}
	}



	sortSpells(list, byName) {
		if (byName) {
			list.sort((a, b) => {
				let aName = $(a).find('.item-name a')[0].innerHTML;
				let bName = $(b).find('.item-name a')[0].innerHTML;
				if (aName < bName) return -1;
				if (aName > bName) return 1;
				return 0;
			});
		} else {
			list.sort((a, b) => {
				let aVal = $(a).find('input[name=level]').val();
				let bVal = $(b).find('input[name=level]').val();
				if (aVal < bVal) return -1;
				if (aVal > bVal) return 1;
				if (aVal == bVal) {
					let aName = $(a).find('.item-name a')[0].innerHTML;
					let bName = $(b).find('.item-name a')[0].innerHTML;
					if (aName < bName) return -1;
					if (aName > bName) return 1;
					return 0;
				}
			});
		}
		return list;
	}

	sortFeats(list, byName) {
		if (byName) {
			list.sort((a, b) => {
				let aName = $(a).find('.item-name a')[0].innerHTML;
				let bName = $(b).find('.item-name a')[0].innerHTML;
				if (aName < bName) return -1;
				if (aName > bName) return 1;
				return 0;
			});
		} else {
			list.sort((a, b) => {
				let aVal = $(a).find('input[name=class]').val();
				let bVal = $(b).find('input[name=class]').val();
				if (aVal < bVal) return -1;
				if (aVal > bVal) return 1;
				if (aVal == bVal) {
					let aName = $(a).find('.item-name a')[0].innerHTML;
					let bName = $(b).find('.item-name a')[0].innerHTML;
					if (aName < bName) return -1;
					if (aName > bName) return 1;
					return 0;
				}
			});
		}
		return list;
	}

	sortItems(list, byName) {
		if (byName) {
			list.sort((a, b) => {
				let aName = $(a).find('.item-name a')[0].innerHTML;
				let bName = $(b).find('.item-name a')[0].innerHTML;
				if (aName < bName) return -1;
				if (aName > bName) return 1;
				return 0;
			});
		} else {
			list.sort((a, b) => {
				let aVal = $(a).find('input[name=type]').val();
				let bVal = $(b).find('input[name=type]').val();
				if (aVal < bVal) return -1;
				if (aVal > bVal) return 1;
				if (aVal == bVal) {
					let aName = $(a).find('.item-name a')[0].innerHTML;
					let bName = $(b).find('.item-name a')[0].innerHTML;
					if (aName < bName) return -1;
					if (aName > bName) return 1;
					return 0;
				}
			});
		}
		return list;
	}

	sortNpcs(list, orderBy) {
		switch (orderBy) {
			case 'name':
				list.sort((a, b) => {
					let aName = $(a).find('.npc-name a')[0].innerHTML;
					let bName = $(b).find('.npc-name a')[0].innerHTML;
					if (aName < bName) return -1;
					if (aName > bName) return 1;
					return 0;
				}); break;
			case 'cr':
				list.sort((a, b) => {
					let aVal = Number($(a).find('input[name="order.cr"]').val());
					let bVal = Number($(b).find('input[name="order.cr"]').val());
					if (aVal < bVal) return -1;
					if (aVal > bVal) return 1;
					if (aVal == bVal) {
						let aName = $(a).find('.npc-name a')[0].innerHTML;
						let bName = $(b).find('.npc-name a')[0].innerHTML;
						if (aName < bName) return -1;
						if (aName > bName) return 1;
						return 0;
					}
				}); break;
			case 'size':
				list.sort((a, b) => {
					let aVal = $(a).find('input[name="order.size"]').val();
					let bVal = $(b).find('input[name="order.size"]').val();
					if (aVal < bVal) return -1;
					if (aVal > bVal) return 1;
					if (aVal == bVal) {
						let aName = $(a).find('.npc-name a')[0].innerHTML;
						let bName = $(b).find('.npc-name a')[0].innerHTML;
						if (aName < bName) return -1;
						if (aName > bName) return 1;
						return 0;
					}
				}); break;
		}
		return list;
	}

	decorateItem(item5e) {
		if (!item5e) return null;
		//Decorate and then filter a compendium entry - returns null or the item
		const item = item5e.data;

		if (item.type === 'poder') {
			// getting uses/ressources status
			item.hasSave = item5e.data.resistencia;

		}
		return item;
	}

	decorateNpc(npc) {
		const decoratedNpc = npc.data;

		// cr display
		let cr = decoratedNpc.data.attributes.nd;
		if (cr == undefined || cr == '') cr = 0;
		else cr = Number(cr);
		if (cr > 0 && cr < 1) cr = "1/" + (1 / cr);
		decoratedNpc.displayCR = cr;
		decoratedNpc.displaySize = 'unset';
		decoratedNpc.filterSize = 2;
		if (CONFIG.T20.tamanhos[decoratedNpc.data.tamanho] !== undefined) {
			decoratedNpc.displaySize = CONFIG.T20.tamanhos[decoratedNpc.data.tamanho];
		}
		switch (decoratedNpc.data.tamanho) {
			case 'Colossal': decoratedNpc.filterSize = 5; break;
			case 'Enorme': decoratedNpc.filterSize = 4; break;
			case 'Grande': decoratedNpc.filterSize = 3; break;
			case 'Medio': decoratedNpc.filterSize = 1; break;
			case 'Pequeno': decoratedNpc.filterSize = 0; break;
			case 'Minusculo':
			default: decoratedNpc.filterSize = 2; break;
		}

		// getting value for HasSpells and damage types
		decoratedNpc.hasSpells = false;
		for (let item of decoratedNpc.items) {
			if (item.type == 'magia') {
				decoratedNpc.hasSpells = true;
			}
		}

		return decoratedNpc;
	}

	filterElements(list, subjects, filters) {
		for (let element of list) {
			let subject = subjects[element.dataset.entryId];
			if (this.passesFilter(subject, filters) == false) {
				$(element).hide();
			} else {
				$(element).show();
			}
		}
	}

	passesFilter(subject, filters) {
		for (let filter of Object.values(filters)) {
			let prop = getProperty(subject, filter.path);
			if (filter.type === 'numberCompare') {

				switch (filter.operator) {
					case '=': if (prop != filter.value) { return false; } break;
					case '<': if (prop >= filter.value) { return false; } break;
					case '>': if (prop <= filter.value) { return false; } break;
				}

				continue;
			}
			if (filter.valIsArray === false) {
				if (filter.type === 'text') {
					if (prop === undefined) return false;
					if (prop.toLowerCase().indexOf(filter.value.toLowerCase()) === -1) {
						return false;
					}
				} else {
					if (filter.value !== undefined && prop !== undefined && prop != filter.value && !(filter.value === true && prop)) {
						return false;
					}
					if (filter.values && filter.values.indexOf(prop) === -1) {
						return false;
					}
				}
			} else {
				if (prop === undefined) return false;
				if (typeof prop === 'object') {
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

	clearObject(obj) {
		let newObj = {};
		for (let key in obj) {
			if (obj[key] == true) {
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
			if (compendium['metadata']['entity'] === "Item") {
				defaultSettings.loadedSpellCompendium[compendium.collection] = {
					load: true,
					name: `${compendium['metadata']['label']} (${compendium.collection})`
				};
			}
			if (compendium['metadata']['entity'] === "Actor") {
				defaultSettings.loadedNpcCompendium[compendium.collection] = {
					load: true,
					name: `${compendium['metadata']['label']} (${compendium.collection})`
				};
			}
		}
		// creating game setting container
		game.settings.register(CMPBrowser.MODULE_NAME, "settings", {
			name: "Compendium Browser Settings",
			hint: "Settings to exclude packs from loading and visibility of the browser",
			default: defaultSettings,
			type: Object,
			scope: 'world',
			onChange: settings => {
				this.settings = settings;
			}
		});
		game.settings.register(CMPBrowser.MODULE_NAME, "maxload", {
			name: game.i18n.localize("CMPBrowser.SETTING.Maxload.NAME"),
			hint: game.i18n.localize("CMPBrowser.SETTING.Maxload.HINT"),
			scope: "world",
			config: true,
			default: CMPBrowser.MAXLOAD,
			type: Number,
			range: {			 // If range is specified, the resulting setting will be a range slider
				min: 200,
				max: 5000,
				step: 100
			}
		});
		
		// load settings from container and apply to default settings (available compendie might have changed)
		let settings = game.settings.get(CMPBrowser.MODULE_NAME, 'settings');
		for (let compKey in defaultSettings.loadedSpellCompendium) {
			if (settings.loadedSpellCompendium[compKey] !== undefined) {
				defaultSettings.loadedSpellCompendium[compKey].load = settings.loadedSpellCompendium[compKey].load;
			}
		}
		for (let compKey in defaultSettings.loadedNpcCompendium) {
			if (settings.loadedNpcCompendium[compKey] !== undefined) {
				defaultSettings.loadedNpcCompendium[compKey].load = settings.loadedNpcCompendium[compKey].load;
			}
		}
		defaultSettings.allowSpellBrowser = settings.allowSpellBrowser ? true : false;
		defaultSettings.allowFeatBrowser = settings.allowFeatBrowser ? true : false;
		defaultSettings.allowItemBrowser = settings.allowItemBrowser ? true : false;
		defaultSettings.allowNpcBrowser = settings.allowNpcBrowser ? true : false;
		
		if (game.user.isGM) {
			game.settings.set(CMPBrowser.MODULE_NAME, 'settings', defaultSettings);
		}   
		this.settings = defaultSettings;
	}

	saveSettings() {
		game.settings.set(CMPBrowser.MODULE_NAME, 'settings', this.settings);
	}

	//FILTERS - Added on the Ready hook
	//0.4.0 Make this async so filters can be added all at once
	async addFilter(entityType, category, label, path, type, possibleValues = null, valIsArray = false) {
		let target = `${entityType}Filters`;
		let filter = {};
		filter.path = path;
		filter.label = label;
		filter.type = 'text';
		if (['text', 'bool', 'select', 'multiSelect', 'numberCompare'].indexOf(type) !== -1) {
			filter[`is${type}`] = true;
			filter.type = type;
		}
		if (possibleValues !== null) {
			filter.possibleValues = possibleValues;
		}
		filter.valIsArray = valIsArray;

		let catId = category.replace(/\W/g, '');
		if (this[target].registeredFilterCategorys[catId] === undefined) {
			this[target].registeredFilterCategorys[catId] = {label: category, filters: []};
		}
		this[target].registeredFilterCategorys[catId].filters.push(filter);

	}

	async addSpellFilters() {
		// Spellfilters
		this.addSpellFilter(game.i18n.localize("CMPBrowser.general"), "Círculo", 'data.circulo', 'select',
			{"1":"1","2":"2","3":"3","4":"4","5":"5"});
		this.addSpellFilter(game.i18n.localize("CMPBrowser.general"), "Escola", 'data.escola', 'select', {
			"Abjuração":"Abjuração",
			"Adivinhação":"Adivinhação",
			"Convocação":"Convocação",
			"Encantamento":"Encantamento",
			"Evocação":"Evocação",
			"Ilusão":"Ilusão",
			"Necromancia":"Necromancia",
			"Transmutação":"Transmutação"
		});
		this.addSpellFilter(game.i18n.localize("CMPBrowser.general"), "Ação", 'data.ativacao.execucao', 'select',
			{
				"padrao": "Padrão",
				"movimento": "Movimento",
				"completa": "Completa",
				"reacao": "Reação",
				"livre": "Livre",
				"duasRodadas": "Duas Rodadas"
			}
		);
		this.addSpellFilter(game.i18n.localize("CMPBrowser.general"), "Tipo", 'data.tipo', 'select',
			{
				Arcana: "Arcana",
				Divina: "Divina",
				Universal: "Universal"
			}
		);
	}

	async addItemFilters() {
		// Item Filters
		this.addItemFilter(game.i18n.localize("CMPBrowser.general"), "Tipo", 'type', 'select', {
			arma: "Arma",
			consumivel: "Consumível",
			equip: "Equipamentos",
			tesouro: "Tesouro"
		});
		this.addItemFilter("Subtipo", "Arma", 'data.tipoUso', 'text', CONFIG.T20.weaponTypes);
		this.addItemFilter("Subtipo", "Equipamento", 'data.tipo', 'text',
			{
				leve: "Armadura Leve",
				pesada: "Armadura Pesada",
				escudo: "Escudo",
				traje: "Traje",
				bonus: "Bônus Mágico",
				natural: "Armadura Natural",
				acessorio: "Acessório"
			});
	}

	async addFeatFilters() {
		
		// Feature Filters
		this.addFeatFilter(game.i18n.localize("CMPBrowser.general"), "Tipo", 'data.tipo', 'select',
			{
				"classe": "Classe",
				"concedido": "Concedido",
				"geral": "Geral",
				"origem": "Origem",
				"racial": "Racial"
			}
		);
		this.addFeatFilter(game.i18n.localize("CMPBrowser.general"), "Ação", 'data.ativacao.execucao', 'select',
			{
				"": "Nenhuma",
				"padrao": "Padrão",
				"movimento": "Movimento",
				"completa": "Completa",
				"reacao": "Reação",
				"livre": "Livre"
			}
		);
	}

	async addNpcFilters() {
		// NPC Filters
		this.addNpcFilter(game.i18n.localize("CMPBrowser.general"), game.i18n.localize("CMPBrowser.size"), 'data.traits.size', 'select', CONFIG.T20.tamanhos);
		this.addNpcFilter(game.i18n.localize("CMPBrowser.general"), game.i18n.localize("CMPBrowser.hasSpells"), 'hasSpells', 'bool');
		this.addNpcFilter(game.i18n.localize("CMPBrowser.general"), game.i18n.localize("CMPBrowser.cr"), 'data.attributes.nd', 'numberCompare');
		this.addNpcFilter(game.i18n.localize("CMPBrowser.general"), game.i18n.localize("CMPBrowser.creatureType"), 'data.attributes.raca', 'text', {
			"Animal": "Animal",
			"Construto": "Construto",
			"Espírito": "Espírito",
			"Humanóide": "Humanóide",
			"Bugbear": "Humanóide: Bugbear",
			"Centauro": "Humanóide: Centauro",
			"Elfo": "Humanóide: Elfo",
			"Finntroll": "Humanóide: Finntroll",
			"Gnoll": "Humanóide: Gnoll",
			"Goblin": "Humanóide: Goblin",
			"Hobgoblin": "Humanóide: Hobgoblin",
			"Humano": "Humanóide: Humano",
			"Orc": "Humanóide: Orc",
			"Monstro": "Monstro",
			"Monstro (aberrante)": "Monstro (aberrante)",
			"Monstro (dragão)": "Monstro (dragão)",
			"Medusa": "Monstro: Medusa",
			"Nagah": "Monstro: Nagah",
			"Trog": "Monstro: Trog",
			"Morto-vivo": "Morto-vivo"
		});

		this.addNpcFilter(game.i18n.localize("CMPBrowser.abilities"), "Força", 'data.abilities.str.value', 'numberCompare');
		this.addNpcFilter(game.i18n.localize("CMPBrowser.abilities"), "Destreza", 'data.abilities.dex.value', 'numberCompare');
		this.addNpcFilter(game.i18n.localize("CMPBrowser.abilities"), "Constituição", 'data.abilities.con.value', 'numberCompare');
		this.addNpcFilter(game.i18n.localize("CMPBrowser.abilities"), "Inteligência", 'data.abilities.int.value', 'numberCompare');
		this.addNpcFilter(game.i18n.localize("CMPBrowser.abilities"), "Sabedoria", 'data.abilities.wis.value', 'numberCompare');
		this.addNpcFilter(game.i18n.localize("CMPBrowser.abilities"), "Carisma", 'data.abilities.cha.value', 'numberCompare');

		// this.addNpcFilter(game.i18n.localize("CMPBrowser.dmgInteraction"), game.i18n.localize("DND5E.DamImm"), 'data.traits.di.value', 'multiSelect', CONFIG.DND5E.damageTypes, true);
		// this.addNpcFilter(game.i18n.localize("CMPBrowser.dmgInteraction"), game.i18n.localize("DND5E.DamRes"), 'data.traits.dr.value', 'multiSelect', CONFIG.DND5E.damageTypes, true);
		// this.addNpcFilter(game.i18n.localize("CMPBrowser.dmgInteraction"), game.i18n.localize("DND5E.DamVuln"), 'data.traits.dv.value', 'multiSelect', CONFIG.DND5E.damageTypes, true);
		// this.addNpcFilter(game.i18n.localize("CMPBrowser.dmgInteraction"), game.i18n.localize("DND5E.ConImm"), 'data.traits.ci.value', 'multiSelect', CONFIG.DND5E.conditionTypes, true);
		// this.addNpcFilter(game.i18n.localize("CMPBrowser.dmgInteraction"), game.i18n.localize("CMPBrowser.dmgDealt"), 'damageDealt', 'multiSelect', CONFIG.DND5E.damageTypes, true);
	}

	/**
	 * Used to add custom filters to the Spell-Browser
	 * @param {String} category - Title of the category
	 * @param {String} label - Title of the filter
	 * @param {String} path - path to the data that the filter uses. uses dotnotation. example: data.abilities.dex.value
	 * @param {String} type - type of filter
	 *					  possible filter:
	 *						  text:		   will give a textinput (or use a select if possibleValues has values) to compare with the data. will use objectData.indexOf(searchedText) to enable partial matching
	 *						  bool:		   will see if the data at the path exists and not false.
	 *						  select:		 exactly matches the data with the chosen selector from possibleValues
	 *						  multiSelect:	enables selecting multiple values from possibleValues, any of witch has to match the objects data
	 *						  numberCompare:  gives the option to compare numerical values, either with =, < or the > operator
	 * @param {Boolean} possibleValues - predetermined values to choose from. needed for select and multiSelect, can be used in text filters
	 * @param {Boolean} valIsArray - if the objects data is an object use this. the filter will check each property in the object (not recursive). if no match is found, the object will be hidden
	 */
	addSpellFilter(category, label, path, type, possibleValues = null, valIsArray = false) {
		this.addFilter('spell', category, label, path, type, possibleValues, valIsArray);
	}

	/**
	 * Used to add custom filters to the Spell-Browser
	 * @param {String} category - Title of the category
	 * @param {String} label - Title of the filter
	 * @param {String} path - path to the data that the filter uses. uses dotnotation. example: data.abilities.dex.value
	 * @param {String} type - type of filter
	 *					  possible filter:
	 *						  text:		   will give a textinput (or use a select if possibleValues has values) to compare with the data. will use objectData.indexOf(searchedText) to enable partial matching
	 *						  bool:		   will see if the data at the path exists and not false.
	 *						  select:		 exactly matches the data with the chosen selector from possibleValues
	 *						  multiSelect:	enables selecting multiple values from possibleValues, any of witch has to match the objects data
	 *						  numberCompare:  gives the option to compare numerical values, either with =, < or the > operator
	 * @param {Boolean} possibleValues - predetermined values to choose from. needed for select and multiSelect, can be used in text filters
	 * @param {Boolean} valIsArray - if the objects data is an object use this. the filter will check each property in the object (not recursive). if no match is found, the object will be hidden
	 */
	addNpcFilter(category, label, path, type, possibleValues = null, valIsArray = false) {
		this.addFilter('npc', category, label, path, type, possibleValues, valIsArray);
	}

	addFeatFilter(category, label, path, type, possibleValues = null, valIsArray = false) {
		this.addFilter('feat', category, label, path, type, possibleValues, valIsArray);
	}

	addItemFilter(category, label, path, type, possibleValues = null, valIsArray = false) {
		this.addFilter('item', category, label, path, type, possibleValues, valIsArray);
	}
}

Hooks.on('ready', async () => {

	if (game.compendiumBrowser === undefined) {
		game.compendiumBrowser = new CompendiumBrowser();
//0.4.0 Defer loading content until we actually use the Compendium Browser
		//A compromise approach would be better (periodic loading) except would still create the memory use problem
		await game.compendiumBrowser.initialize();
	}

	game.compendiumBrowser.addSpellFilters();
	game.compendiumBrowser.addFeatFilters();
	game.compendiumBrowser.addItemFilters();
	game.compendiumBrowser.addNpcFilters();

});

Hooks.on("renderCompendiumBrowser", CompendiumBrowser.afterRender);