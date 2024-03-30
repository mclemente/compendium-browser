<template>
  <div class="npc-browser browser flexrow">
    <section class="control-area">
      <div class="filtercontainer">
        <!-- Name filter. -->
        <div class="filter">
          <label class="unit-title" for="compendiumBrowser.name">{{ game.i18n.localize('Name') }}</label>
          <input type="text" name="compendiumBrowser.name" v-model="name" placeholder="Hydra"/>
        </div>

        <!-- Sort -->
        <dl class="sorter">
          <dt>{{ game.i18n.localize('Sort by:') }}</dt>
          <dd>
            <select class="sort" name="sortorder" v-model="sortBy">
              <option v-for="(option, index) in sortOptions" :key="index" :value="option.value">{{ option.label }}</option>
            </select>
          </dd>
        </dl>

        <!-- Reset. -->
        <button type="reset" @click="resetFilters()">{{ game.i18n.localize('Reset Filters') }}</button>
      </div>

      <div class="filtercontainer">
        <h3>{{ game.i18n.localize('General') }}</h3>
        <!-- Level range slider. -->
        <div class="filter">
          <dt class="unit-title" for="compendiumBrowser.level">{{ game.i18n.localize('Challenge Rating') }}</dt>
          <div class="level-range flexrow">
            <div class="level-label"><span>{{ crRange[0] }}</span><span v-if="crRange[0] !== crRange[1]"> - {{ crRange[1] }}</span></div>
            <div class="level-input slider-wrapper flexrow">
              <Slider v-model="crRange" :min="1" :max="30" :tooltips="false"/>
            </div>
          </div>
        </div>
        <!-- Size filter. -->
        <div class="filter">
          <dt class="unit-title" for="compendiumBrowser.size">{{ game.i18n.localize('Size') }}</dt>
          <dd>
            <Multiselect
              v-model="size"
              mode="tags"
              :searchable="false"
              :create-option="false"
              :options="getOptions(CONFIG.DND5E.actorSizes)"
            />
          </dd>
        </div>
      </div>

    </section>

    <div class="list-area flexcol">
      <!-- Creatures results. -->
      <!-- <section class="section section--npcs section--main flexcol"> -->
      <ul v-if="loaded" class="compendium-browser-results compendium-browser-npcs">
        <!-- Individual creature entries. -->
        <li v-for="(entry, entryKey) in entries" :key="entryKey" :class="`npc flexrow draggable compendium-browser-row${entryKey >= pager.lastIndex - 1 && entryKey < pager.totalRows - 1 ? ' compendium-browser-row-observe': ''} document actor`" :data-document-id="entry._id" @click="openDocument(entry.uuid)" @dragstart="startDrag($event, entry, 'Actor')" draggable="true">
          <!-- Both the image and title have drag events. These are primarily separated so that -->
          <!-- if a user drags the token, it will only show the token as their drag preview. -->
          <div class="npc-image">
            <img :src="entry.img ?? 'icons/svg/mystery-man.svg'"/>
          </div>
          <div class="npc-line">
            <!-- First row is the title. -->
            <div class="npc-name">
              <a>{{ entry.name }}</a>
            </div>
            <!-- Second row is supplemental info. -->
            <div class="npc-tags">
              <span class="cr" :data-tooltip="game.i18n.localize('Challenge rating')">{{ entry.system.details.cr }}</span>
              <span class="size">{{ entry.system.traits.size }}</span>
              <span class="type">{{ entry.system.details.type.value }}</span>
            </div>
          </div>
        </li>
      </ul>
      <div v-else class="compendium-browser-loading"><p><i class="fas fa-circle-notch fa-spin"></i>Please wait, loading...</p></div>
      <!-- </section> -->
    </div>
  </div>
</template>

<script>
// onUpdated() is used for the infinite scroll intersection observer.
import { onUpdated } from 'vue';
// External components.
import Slider from '@vueform/slider';
import Multiselect from '@vueform/multiselect';
// Helper methods.
import {
  getPackIndex,
  getActorModuleArt,
  openDocument,
  startDrag,
} from '@/methods/Helpers.js';

export default {
  name: 'CompendiumBrowserPowers',
  props: ['tab'],
  // Imported components that need to be available in the <template>
  components: {
    Slider,
    Multiselect,
  },
  setup() {
    return {
      // Imported methods that need to be available in the <template>
      getActorModuleArt,
      openDocument,
      startDrag,
      // Foundry base props and methods.
      CONFIG,
      game,
    }
  },
  data() {
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
      sortBy: 'name',
      sortOptions: [
        { value: 'name', label: game.i18n.localize('Name') },
        { value: 'cr', label: game.i18n.localize('Challenge Rating') },
        { value: 'size', label: game.i18n.localize('Size') },
      ],
      // Our list of pseudo documents returned from the compendium.
      packIndex: [],
      // Filters.
      name: '',
      // @todo partial CRs like 1/4.
      crRange: [1, 30],
      size: [],
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
      this.sortBy = 'name';
      this.name = '';
      this.crRange = [1, 30];
      this.size = [];
    },
    /**
     * Get multiselect options.
     */
    getOptions(config) {
      const options = {};
      for (let [key, value] of Object.entries(config)) {
        options[key] = value.label;
      }
      return options;
    }
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
        result = result.filter(entry => entry.name.toLocaleLowerCase().includes(name));
      }

      // // Filter by level range.
      // if (this.crRange.length == 2) {
      //   result = result.filter(entry =>
      //     entry.system.attributes.level.value >= this.crRange[0] &&
      //     entry.system.attributes.level.value <= this.crRange[1]
      //   );
      // }

      // Handle multiselect filters, which use arrays as their values.
      // if (Array.isArray(this.size) && this.size.length > 0) {
      //   result = result.filter(entry => this.size.includes(entry.system.details.size.value));
      // }

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
        switch (this.sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'size':
            return a.system.traits.size.localeCompare(b.system.traits.size);
        }
        return a.system.details.cr - b.system.details.cr;
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
    console.log("Creating compendium browser creatures tab...");

    // Load the pack index with the fields we need.
    getPackIndex([
      'dnd5e.monsters',
      // insert additional packs as needed.
    ], [
      'img',
      'system.details.cr',
      'system.details.type',
      'system.traits.size'
      // insert additional properties as needed.
    ]).then(packIndex => {
      // Restore the pack art.
      if (!game.dnd5e?.moduleArt?.suppressArt && game.dnd5e?.moduleArt?.map?.size > 0) {
        for (let record of packIndex) {
          record.img = getActorModuleArt(record);
        }
      }
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

<style>
  @import "@vueform/slider/themes/default.css";
  @import "@vueform/multiselect/themes/default.css";
</style>