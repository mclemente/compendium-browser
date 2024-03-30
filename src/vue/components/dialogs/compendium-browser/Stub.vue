<template>
  <h1>
    <!-- Use <slot> to pass in content wrapped by this component's tag. -->
    <slot></slot>
  </h1>
</template>

<script>
  export default {
    name: 'Stub',
    props: ['context']
  }
</script>

<style lang="less" scoped>
  // Scoped styles have special identifiers that prevent them
  // from affecting anything outside of this component.
  h1 {
    color: red;
  }
</style>