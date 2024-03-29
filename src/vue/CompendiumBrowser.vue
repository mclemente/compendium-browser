<template>
  <div class="compendium-browser-vue flexcol">
    <!-- Tabs. -->
    <section class="container container--top">
      <Tabs group="primary" :tabs="tabs.primary" :flags="flags"/>
    </section>

    <!-- Filters + Content. -->
    <section class="container container--bottom">

      <!--
        Render each tab wrapper and their contents. The CompendiumBrowser<Type> components
        each have a v-if on them that causes them to only render if they're active or if they
        have been opened at least once.
      -->
      <Tab group="primary" :tab="tabs.primary.creatures" classes="container container--bottom flexrow">
        <Stub />
        <!-- <CompendiumBrowserCreatures v-if="tabs.primary.creatures.active || tabs.primary.creatures.opened" :tab="tabs.primary.creatures"/> -->
      </Tab>

      <!-- <Tab group="primary" :tab="tabs.primary.powers" classes="container container--bottom flexrow">
        <CompendiumBrowserPowers v-if="tabs.primary.powers.active || tabs.primary.powers.opened" :tab="tabs.primary.powers" :escalation="this.context.escalationDie"/>
      </Tab> -->

      <!-- <Tab group="primary" :tab="tabs.primary.items" classes="container container--bottom flexrow">
        <CompendiumBrowserItems v-if="tabs.primary.items.active || tabs.primary.items.opened" :tab="tabs.primary.items"/>
      </Tab> -->

    </section>
  </div>
</template>

<script>
// Import component dependencies.
import Tabs from '@/components/parts/Tabs.vue';
import Tab from '@/components/parts/Tab.vue';
import Stub from '@/components/dialogs/compendium-browser/stub.vue';
// import CompendiumBrowserCreatures from '@/components/dialogs/compendium-browser/CompendiumBrowserCreatures.vue';
// import CompendiumBrowserPowers from '@/components/dialogs/compendium-browser/CompendiumBrowserPowers.vue';
// import CompendiumBrowserItems from '@/components/dialogs/compendium-browser/CompendiumBrowserItems.vue';

export default {
  name: 'ArchmageCompendiumBrowser',
  props: [`context`],
  components: {
    Tabs,
    Tab,
    Stub,
    // CompendiumBrowserCreatures,
    // CompendiumBrowserPowers,
    // CompendiumBrowserItems
  },
  setup() {
    return {
      CONFIG,
      game
    }
  },
  data() {
    return {
      // The only variable we actually need to track is the active tab.
      tabs: {
        defaultTab: 'creatures',
        primary: {
          // Default tab is assigned in the flags() computed property.
          creatures: {
            key: 'creatures',
            label: game.i18n.localize('CMPBrowser.Tab.NPCBrowser'),
            active: false,
            opened: false
          },
          powers: {
            key: 'powers',
            label: game.i18n.localize('CMPBrowser.Tab.SpellBrowser'),
            active: false,
            opened: false
          },
          items: {
            key: 'items',
            label: game.i18n.localize('CMPBrowser.Tab.ItemBrowser'),
            active: false,
            opened: false
          }
        }
      }
    }
  },
  methods: {},
  computed: {},
  watch: {},
  async created() {
    console.log("Creating compendium browser...");
  },
  async mounted() {
    console.log("Compendium browser mounted.");
  }
}
</script>