<template>
  <nav :class="`tabs tabs--${group}`" :data-group="group">
    <span v-for="(tab, tabKey) in tabs" :key="'tab-' + group + '-' + tabKey">
      <a @click="changeTab" :class="getTabClass(tab, tabKey)" :data-tab="tabKey" v-if="!tab.hidden">
        <i v-if="tab.icon" :class="concat('fas ', tab.icon)"></i>
        <span v-if="!tab.hideLabel">{{tab.label}}</span>
      </a>
    </span>
  </nav>
</template>

<script>
import { concat, getActor } from '@/methods/Helpers';
export default {
  name: 'Tabs',
  props: ['context', 'actor', 'group', 'tabs', 'flags'],
  setup() {
    return { concat }
  },
  data() {
    return {
      currentTab: 'creatures'
    }
  },
  methods: {
    changeTab(event) {
      // If this was a click, update the default tab.
      if (event && event.currentTarget) {
        this.currentTab = event.currentTarget.dataset.tab;
      }

      // Update the tab displays.
      for (let [k,v] of Object.entries(this.tabs)) {
        this.tabs[k].active = false;
      }

      // Update the active tab display.
      if (this.tabs[this.currentTab]) {
        this.tabs[this.currentTab].active = true;
      }
    },
    getTabClass(tab, index) {
      return `item tab-link tab-link--${index}${tab.active ? ' active': ''}`;
    }
  },
  async mounted() {
    const activeTab = Object.values(this.tabs)?.find((tab) => tab.active);
    Object.values(this.tabs).forEach((tab) => console.log(tab));
    console.log('Active', activeTab);
    this.currentTab = activeTab?.key ?? 'creatures';
    this.changeTab(false);
  }
}
</script>

<style lang="scss">

</style>