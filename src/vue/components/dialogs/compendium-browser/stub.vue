<template>
  <h1><slot></slot></h1>
</template>

<script>
  export default {
    name: 'Stub',
    props: ['context']
  }
</script>

<style lang="less" scoped>
  h1 {
    color: red;
  }
</style>