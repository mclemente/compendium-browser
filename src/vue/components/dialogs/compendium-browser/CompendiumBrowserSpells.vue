<template>
	<div class="feat-browser browser flexrow">
		<section class="control-area flexcol">
			<div class="controls">
				<FilterNameSort v-model="name" :filters="sorts"/>

				<div class="filtercontainer">
					<h3>{{ game.i18n.localize('General') }}</h3>
					<div class="filters">
						<div class="filter level-range flexrow">
							<label class="unit-title" for="compendiumBrowser.levelRange">{{ game.i18n.localize('DND5E.Level') }}</label>
							<div class="level-range flexrow">
								<div class="level-label spell">
									<span v-if="levelRange[0] === 0">Cantrip</span>
									<span v-else>{{ levelRange[0] }}</span>
									<span v-if="levelRange[0] !== levelRange[1]"> - {{ levelRange[1] }}</span>
								</div>
								<div class="level-input slider-wrapper flexrow">
									<Slider v-model="levelRange" :min="0" :max="9" :tooltips="false"/>
								</div>
							</div>
						</div>
					</div>
					<div class="filter">
						<label class="unit-title" for="compendiumBrowser.spellSchool">{{ game.i18n.localize('DND5E.SpellSchool') }}</label>
						<Multiselect
							v-model="spellSchool"
							mode="tags"
							:searchable="false"
							:create-option="false"
							:options="sortPackValues(CONFIG.DND5E.spellSchools)"
						/>
					</div>
					<div class="filter">
						<label class="unit-title" for="compendiumBrowser.activation">{{ game.i18n.localize('CMPBrowser.castingTime') }}</label>
						<Multiselect
							v-model="activation"
							mode="tags"
							:searchable="false"
							:create-option="false"
							:options="sortPackValues({
								action: 'DND5E.Action',
								bonus: 'DND5E.BonusAction',
								reaction: 'DND5E.Reaction',
								minute: 'DND5E.TimeMinute',
								hour: 'DND5E.TimeHour',
								day: 'DND5E.TimeDay',
							}, false)"
						/>
					</div>
					<div class="filter">
						<label class="unit-title" for="compendiumBrowser.spellType">{{ game.i18n.localize('CMPBrowser.spellType') }}</label>
						<Multiselect
							v-model="spellType"
							mode="tags"
							:searchable="false"
							:create-option="false"
							:options="sortPackValues(CONFIG.DND5E.itemActionTypes, false)"
						/>
					</div>
					<div class="filter">
						<label class="unit-title" for="compendiumBrowser.damageTypes">{{ game.i18n.localize('CMPBrowser.damageType') }}</label>
						<Multiselect
							v-model="damageTypes"
							mode="tags"
							:searchable="false"
							:create-option="false"
							:options="sortPackValues(CONFIG.DND5E.damageTypes)"
						/>
					</div>
					<div class="filter">
						<label class="unit-title" for="compendiumBrowser.properties">{{ game.i18n.localize('DND5E.SpellComponents') }}</label>
						<Multiselect
							v-model="properties"
							mode="tags"
							:searchable="false"
							:create-option="false"
							:options="sortPackValues({
								vocal: 'DND5E.ComponentVerbal',
								somatic: 'DND5E.ComponentSomatic',
								material: 'DND5E.ComponentMaterial',
								concentration: 'DND5E.Concentration',
								ritual: 'DND5E.Ritual',
							}, false)"
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
			<ul v-if="loaded" class="compendium-browser-results compendium-browser-spells">
				<li v-for="(entry, entryKey) in entries" :key="entryKey"
						:class="`flexrow draggable compendium-browser-row${entryKey >= pager.lastIndex - 1 && entryKey < pager.totalRows - 1
							? ' compendium-browser-row-observe': ''} document item`"
						:data-document-id="entry._id" @click="openDocument(entry.uuid, 'Item')"
						@dragstart="startDrag($event, entry, 'Item')"
						draggable="true"
					>
					<img :src="entry.img"/>
					<div class="line">
						<div class="flexrow">
							<h4 class="name">{{ entry.name }}</h4>
							<h4 style="flex: 0; margin: 0;">
								<span v-if="entry.system.level !== 0">{{ entry.system.level }}</span>
								<span v-else>{{ game.i18n.localize('DND5E.SpellCantrip') }}</span>
							</h4>
						</div>
						<div class="tags">
						</div>
					</div>
				</li>
			</ul>
		</section>
	</div>

</template>

<script>
// onUpdated() is used for the infinite scroll intersection observer.
import { onUpdated } from 'vue';
// External components.
import Multiselect from '@vueform/multiselect';
import Slider from '@vueform/slider';
// Helper methods.
import FilterNameSort from '@/components/dialogs/compendium-browser/filters/FilterNameSort.vue';
import {
	getPackIndex,
	openDocument,
	sortPackValues,
	startDrag,
} from '@/methods/Helpers.js';

export default {
	name: 'CompendiumBrowserSpells',
	props: ['tab'],
	// Imported components that need to be available in the <template>
	components: {
		Slider,
		Multiselect,
		FilterNameSort
	},
	setup() {
		return {
			// Imported methods that need to be available in the <template>
			openDocument,
			sortPackValues,
			startDrag,
			// Foundry base props and methods.
			CONFIG,
			game,
			getDocumentClass
		}
	},
	data() {
		return {
			// Props used for infinited scroll and pagination.
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
					{ value: 'level', label: game.i18n.localize('DND5E.Level') },
				],
			},
			// Our list of pseudo documents returned from the compendium.
			packIndex: [],
			// Filters.
			name: '',
			levelRange: [0, 9],
			spellSchool: [],
			activation: [],
			spellType: [],
			damageTypes: [],
			properties: []
		}
	},
	methods: {
		/**
		 * Callback for the infinite scroll IntersectionObserver.
		 *
		 * @param {Array} List of IntersectionObserverEntry objects.
		 */
		infiniteScroll(entries) {
			entries.forEach(({target, isIntersecting}) => {
				// If the element isn't visible, do nothing.
				if (!isIntersecting) {
					return;
				}

				// Otherwise, remove the observer and update our pager properties.
				// We need to increase the lastIndex for our filter by an amount
				// equal to our number of entries per page.
				this.observer.unobserve(target);
				this.pager.lastIndex = Math.min(this.pager.lastIndex + this.pager.perPage, this.pager.totalRows);
			});
		},
		/**
		 * Click event to reset our filters.
		 */
		resetFilters() {
			this.sorts.sortBy = 'name';
			this.sorts.direction = 'asc';
			this.name = '';
			this.levelRange = [0, 9];
			this.spellSchool = [];
			this.activation = [];
			this.spellType = [];
			this.damageTypes = [];
			this.properties = [];
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

			// Filter by level.
			if (this.levelRange.length == 2) {
				result = result.filter(entry =>
					entry.system.level >= this.levelRange[0] &&
					entry.system.level <= this.levelRange[1]
				);
			}

			if (this.spellSchool.length) {
				result = result.filter(entry => this.spellSchool.includes(entry.system.school));
			}

			if (this.activation.length) {
				result = result.filter(entry => this.activation.includes(entry.system.activation.type));
			}

			if (this.spellType.length) {
				result = result.filter(entry => this.spellType.includes(entry.system.actionType));
			}

			if (this.properties.length) {
				const propSet = new Set(this.properties);
				result = result.filter(entry => propSet.intersection(new Set(entry.system.properties)).size);
			}

			// Reflow pager.
			if (result.length > this.pager.perPage) {
				this.pager.totalRows = result.length;
				if (this.pager.lastIndex == 0) {
					this.pager.lastIndex = this.pager.perPage - 1;
				}
			}
			else {
				this.pager.totalRows = 0;
			}

			// Sort.
			result = result.sort((a, b) => {
				switch (this.sorts.sortBy) {
					case 'level':
						return a.system.level - b.system.level;
				}
				return a.name.localeCompare(b.name);
			});

			// Return results.
			return this.pager.totalRows > 0
				? result.slice(this.pager.firstIndex, this.pager.lastIndex)
				: result;
		},
	},
	watch: {},
	// Handle created hook.
	async created() {
		console.log("Creating compendium browser powers tab...");
		// Load the pack index with the fields we need.
		getPackIndex({
			// [
			// 	'dnd5e.spells',
			// ],
			fields: [
				'system.activation.type',
				'system.actionType',
				'system.damage',
				'system.level',
				'system.properties',
				'system.school'
			],
			types: ["Item"],
			subTypes: ["spell"]
		}).then(packIndex => {
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
		console.log("Compendium browser powers tab mounted.");

		// Note that our tab has beened opened so that it won't de-render later.
		this.tab.opened = true;

		// Adjust our observers whenever the results of the compendium browser
		// are updated.
		onUpdated(() => {
			const target = document.querySelector('.compendium-browser-spells .compendium-browser-row-observe');
			if (target) {
				this.observer.observe(target);
			}
		});
	},
	// Handle the unmount hook.
	async beforeUnmount() {
		// Handle the unmount hook.
		this.observer.disconnect();
	}
}
</script>

<style lang="scss">
	@import "@vueform/slider/themes/default.css";
	@import "@vueform/multiselect/themes/default.css";
</style>