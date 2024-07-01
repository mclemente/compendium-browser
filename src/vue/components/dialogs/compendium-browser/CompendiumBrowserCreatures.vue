<template>
	<div class="actor-browser browser flexrow">
		<section class="control-area flexcol">
			<div class="controls">
				<FilterNameSort v-model="name" :filters="sorts"/>

				<div class="filtercontainer">
					<div class="filters">
						<!-- Level range slider. -->
						<div class="filter level-range flexrow">
							<label class="unit-title" for="compendiumBrowser.level">{{ game.i18n.localize('Challenge Rating') }}</label>
								<div class="level-label">
									<span>{{ crRange[0] }}</span>
									<span v-if="crRange[0] !== crRange[1]"> - {{ crRange[1] }}</span>
								</div>
								<div class="level-input slider-wrapper flexrow">
									<Slider v-model="crRange" :min="0" :max="30" :tooltips="false"/>
								</div>
							</div>
						</div>
						<!-- Size filter. -->
						<Multiselect
								:placeholder="game.i18n.localize('CMPBrowser.size')"
								v-model="size"
								mode="tags"
								:searchable="false"
								:create-option="false"
								:options="sortPackValues(CONFIG.DND5E.actorSizes)"
								:closeOnSelect="false"
							/>
						<Multiselect
								:placeholder="game.i18n.localize('CMPBrowser.legAct')"
								v-model="legact"
								:searchable="false"
								:create-option="false"
								:options="sortPackValues(options.legAct)"
							/>
						<Multiselect
								:placeholder="game.i18n.localize('CMPBrowser.legRes')"
								v-model="legres"
								:searchable="false"
								:create-option="false"
								:options="sortPackValues(options.legRes)"
							/>
						<Multiselect
								:placeholder="game.i18n.localize('CMPBrowser.DND5E.CreatureType')"
								v-model="creatureType"
								mode="tags"
								:searchable="false"
								:create-option="false"
								:options="sortPackValues(CONFIG.DND5E.creatureTypes)"
								:closeOnSelect="false"
							/>
					<h3>{{ game.i18n.localize('DND5E.AbilityScorePl') }}</h3>
					<div class="filters">
						<div v-for="(ability, key) in abilities" class="filter level-range flexrow">
							<label class="unit-title" for="compendiumBrowser.str">{{ ability.label }}</label>
							<div class="level-label">
								<span>{{ ability.range[0] }}</span>
								<span v-if="ability.range[0] !== ability.range[1]"> - {{ ability.range[1] }}</span>
							</div>
							<div class="level-input slider-wrapper flexrow">
								<Slider v-model="abilities[key].range" :min="1" :max="30" :tooltips="false" />
							</div>
						</div>
					</div>
					<h3>{{ game.i18n.localize('CMPBrowser.DND5E.DamageAndConditions') }}</h3>
					<div class="filters">
						<Multiselect
								:placeholder="game.i18n.localize('CMPBrowser.DND5E.DamageImmunities')"
								v-model="damageImmunities"
								mode="tags"
								:searchable="false"
								:create-option="false"
								:options="sortPackValues(CONFIG.DND5E.damageTypes)"
							/>
						<Multiselect
								:placeholder="game.i18n.localize('CMPBrowser.DND5E.DamageResistances')"
								v-model="damageResistances"
								mode="tags"
								:searchable="false"
								:create-option="false"
								:options="sortPackValues(CONFIG.DND5E.damageTypes)"
							/>
						<Multiselect
								:placeholder="game.i18n.localize('CMPBrowser.DND5E.DamageVulnerabilities')"
								v-model="damageVulnerabilities"
								mode="tags"
								:searchable="false"
								:create-option="false"
								:options="sortPackValues(CONFIG.DND5E.damageTypes)"
							/>
						<Multiselect
								:placeholder="game.i18n.localize('CMPBrowser.DND5E.ConditionImmunities')"
								v-model="conditionImmunities"
								mode="tags"
								:searchable="false"
								:create-option="false"
								:options="sortPackValues(CONFIG.DND5E.conditionTypes)"
							/>
					</div>
				</div>
			</div>
			<footer>
				<!-- Reset. -->
				<button type="reset" @click="resetFilters()">{{ game.i18n.localize('Reset Filters') }}</button>
			</footer>
		</section>

		<section class="list-area flexcol">
			<!-- Creatures results. -->
			<!-- <section class="section section--npcs section--main flexcol"> -->
			<ul v-if="loaded" class="compendium-browser-results compendium-browser-npcs">
				<!-- Individual creature entries. -->
				<li v-for="(entry, entryKey) in entries" :key="entryKey"
					:class="`flexrow draggable compendium-browser-row${entryKey >= pager.lastIndex - 1 && entryKey < pager.totalRows - 1
						? ' compendium-browser-row-observe': ''} document actor`"
					:data-document-id="entry._id" @click="openDocument(entry.uuid)"
					@dragstart="startDrag($event, entry, 'Actor')"
					draggable="true"
				>
					<!-- Both the image and title have drag events. These are primarily separated so that -->
					<!-- if a user drags the token, it will only show the token as their drag preview. -->
					<img :src="entry.img ?? 'icons/svg/mystery-man.svg'"/>
					<div class="line">
						<!-- First row is the title. -->
						<h4 class="name">[{{ game.dnd5e.utils.formatCR(entry.system.details.cr) }}] {{ entry.name }}</h4>
						<!-- Second row is supplemental info. -->
						<div class="tags flexrow">
							<div class="flexrow">
								<span class="hp"><span class="bold">HP:</span> {{ entry.system.attributes.hp.max }}</span>
								<span class="ac"><span class="bold">AC:</span> {{ entry.system.attributes.ac.flat }}</span>
							</div>
							<div class="details flexrow">
								<span>
									{{ CONFIG.DND5E.actorSizes?.[entry.system.traits.size].label ?? entry.system.traits.size }}
									{{ CONFIG.DND5E.creatureTypes?.[entry.system.details.type.value]?.label ?? entry.system.details.type.value }}
								</span>
							</div>
						</div>
					</div>
				</li>
			</ul>
			<div v-else class="compendium-browser-loading"><p><i class="fas fa-circle-notch fa-spin"></i>Please wait, loading...</p></div>
			<!-- </section> -->
		</section>
	</div>
</template>

<script>
// onUpdated() is used for the infinite scroll intersection observer.
import { onUpdated } from 'vue';
// External components.
import FilterNameSort from '@/components/dialogs/compendium-browser/filters/FilterNameSort.vue';
import Multiselect from '@vueform/multiselect';
import Slider from '@vueform/slider';
// Helper methods.
import {
	getActorModuleArt,
	getPackIndex,
	openDocument,
	sortPackValues,
	startDrag,
} from '@/methods/Helpers.js';

export default {
	name: 'CompendiumBrowserPowers',
	props: ['tab'],
	// Imported components that need to be available in the <template>
	components: {
		Slider,
		Multiselect,
		FilterNameSort,
	},
	setup() {
		return {
			// Imported methods that need to be available in the <template>
			getActorModuleArt,
			openDocument,
			sortPackValues,
			startDrag,
			// Foundry base props and methods. These need to be included here if you
			// want to access them in the template section above.
			CONFIG,
			game,
		}
	},
	data() {
		const abilities = {};
		for (const [key, value] of Object.entries(CONFIG.DND5E.abilities)) {
			abilities[key] = { label: value.label, range: [1, 30] };
		}
		return {
			// Props used for infinite scroll and pagination.
			observer: null,
			loaded: false,
			pager: {
				perPage: 50,
				firstIndex: 0,
				lastIndex: 50,
				totalRows: 0,
			},
			// Sorting.
			sorts: {
				sortBy: 'name',
				direction: 'asc',
				sortOptions: [
					{ value: 'name', label: game.i18n.localize('Name') },
					{ value: 'cr', label: game.i18n.localize('Challenge Rating') },
					{ value: 'size', label: game.i18n.localize('Size') },
				],
			},
			// Our list of pseudo documents returned from the compendium.
			packIndex: [],
			// Filters.
			name: '',
			// Mixed decimals and ints aren't supported by the slider, so
			// just use 0 for all CRs below 1.
			crRange: [0, 30],
			abilities,
			legact: '',
			legres: '',
			damageImmunities: [],
			damageResistances: [],
			damageVulnerabilities: [],
			conditionImmunities: [],
			size: [],
			creatureType: [],
		}
	},
	methods: {
		/**
		 * Callback for the infinite scroll IntersectionObserver.
		 *
		 * @param {Array} List of IntersectionObserverEntry objects.
		 */
		infiniteScroll(entries) {
			// Iterate over our possible elements.
			entries.forEach(({target, isIntersecting}) => {
				// If the element isn't visible, do nothing.
				if (!isIntersecting) {
					return;
				}

				// Otherwise, remove the observer and update our pager properties.
				// We need to increase the lastIndex for our filter by an amount
				// equal to our number of entries per page.
				this.observer.unobserve(target);
				this.pager.lastIndex = Math.min(
					this.pager.lastIndex + this.pager.perPage,
					this.pager.totalRows
				);
			});
		},
		/**
		 * Click event to reset our filters.
		 */
		 resetFilters() {
			this.sorts.sortBy = 'name';
			this.sorts.direction = 'asc';
			this.name = '';
			this.crRange = [0, 30];
			this.legact = '';
			this.legres = '';
			this.damageImmunities = [];
			this.damageResistances= [];
			this.damageVulnerabilities= [];
			this.conditionImmunities= [];
			this.size = [];
			this.creatureType = [];
		},
		applyFilter(property, entries, result) {
    		if (property.length) {
				property.forEach(value => {
					result = result.filter(entry => entry.system.traits[entries].value.includes(value));
				});
			}
    		return result;
		},
	},
	computed: {
		entries() {
			// Build our results array. Exit early if the length is 0.
			let result = this.packIndex;
			if (result.length < 1) {
				this.pager.totalRows = 0;
				return [];
			}

			// Filter by name.
			if (this.name && this.name.length > 0) {
				const name = this.name.toLocaleLowerCase();
				result = result.filter(entry =>
					entry.originalName?.toLocaleLowerCase().includes(name)
					|| entry.name.toLocaleLowerCase().includes(name)
				);
			}

			// // Filter by level range.
			if (this.crRange.length == 2) {
				result = result.filter(entry =>
					Number(entry.system.details.cr) >= this.crRange[0] &&
					Number(entry.system.details.cr) <= this.crRange[1]
				);
			}

			if (this.legact === "yes") {
				result = result.filter((entry) => entry.system.resources.legact.max);
			} else if (this.legact === "no") {
				result = result.filter((entry) => !entry.system.resources.legact.max);
			}

			if (this.legres === "yes") {
				result = result.filter((entry) => entry.system.resources.legres.max);
			} else if (this.legres === "no") {
				result = result.filter((entry) => !entry.system.resources.legres.max);
			}

			// Handle multiselect filters, which use arrays as their values.
			if (Array.isArray(this.size) && this.size.length > 0) {
				result = result.filter(entry => this.size.includes(entry.system.traits.size));
			}
			if (Array.isArray(this.creatureType) && this.creatureType.length > 0) {
				result = result.filter(entry => this.creatureType.includes(entry.system.details.type.value));
			}

			Object.entries(this.abilities)
				.forEach(([k, v]) => {
					// Don't bother filtering if filter wasn't changed.
					if (v.range[0] === 1 && v.range[1] === 30) return;
					result = result.filter((entry) =>
						Number(entry.system.abilities[k].value) >= v.range[0] &&
						Number(entry.system.abilities[k].value) <= v.range[1]
					)
				});

			result = this.applyFilter(this.damageImmunities, 'di', result);
			result = this.applyFilter(this.damageResistances, 'dr', result);
			result = this.applyFilter(this.damageVulnerabilities, 'dv', result);
			result = this.applyFilter(this.conditionImmunities, 'ci', result);

			// Reflow pager.
			if (result.length > this.pager.perPage) {
				this.pager.totalRows = result.length;
				if (this.pager.lastIndex == 0) {
					this.pager.lastIndex = this.pager.perPage - 1;
				}
			} else {
				this.pager.totalRows = 0;
			}

			// Sort.
			result = result.sort((a, b) => {
				// Add sorts here.
				switch (this.sorts.sortBy) {
					case 'cr':
						return a.system.details.cr - b.system.details.cr;
					case 'size':
						return a.system.traits.size.localeCompare(b.system.traits.size);
				}
				return a.name.localeCompare(b.name);
			});
			if (this.sorts.direction === "desc") {
				result = result.reverse();
			}

			// Return results.
			return this.pager.totalRows > 0
				? result.slice(this.pager.firstIndex, this.pager.lastIndex)
				: result;
		},
		options() {
			return {
				legAct: { "yes": { label: game.i18n.localize("CMPBrowser.hasLegAct") }, no: { label: game.i18n.localize("CMPBrowser.hasNoLegAct") } },
				legRes: { "yes": { label: game.i18n.localize("CMPBrowser.hasLegRes") }, no: { label: game.i18n.localize("CMPBrowser.hasNoLegRes") } },
			}
		}
	},
	watch: {},
	// Handle created hook.
	async created() {
		console.log("Creating compendium browser creatures tab...");

		// Load the pack index with the fields we need.
		getPackIndex({
			fields: [
				'system.attributes.ac',
				'system.attributes.hp',
				'system.abilities',
				'system.details.cr',
				'system.details.type',
				'system.resources.legact',
				'system.resources.legres',
				'system.traits.di.value',
				'system.traits.dr.value',
				'system.traits.dv.value',
				'system.traits.ci.value',
				'system.traits.size'
				// insert additional properties as needed.
			],
			types: ["Actor"],
			subTypes: ["npc"]
		}).then(packIndex => {
			// Loading a new index blows away the module art that was loaded by the system.
			// Step through the records and reassign their pack art.
			if (!game.dnd5e?.moduleArt?.suppressArt && game.dnd5e?.moduleArt?.map?.size > 0) {
				for (let record of packIndex) {
					record.img = getActorModuleArt(record);
				}
			}
			// Store our pack index for filtering, and remove the loading indicator.
			this.packIndex = packIndex;
			this.loaded = true;
		});

		// Create our intersection observer for infinite scroll.
		this.observer = new IntersectionObserver(this.infiniteScroll, {
			root: this.$el,
			threshold: 0.1,
		});
	},
	// Handle mounted hook.
	async mounted() {
		console.log("Compendium browser creatures tab mounted.");

		// Note that our tab has beened opened so that it won't de-render later.
		this.tab.opened = true;

		// Adjust our observers whenever the results of the compendium browser
		// are updated.
		onUpdated(() => {
			const target = document.querySelector('.compendium-browser-npcs .compendium-browser-row-observe');
			if (target) {
				this.observer.observe(target);
			}
		});
	},
	// Handle the unmount hook.
	async beforeUnmount() {
		// Disconnect intersection observers when we unmount.
		this.observer.disconnect();
	}
}
</script>

<style lang="less">
</style>