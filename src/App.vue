<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';

export default class App extends Vue {}
</script>

<style lang="scss">
@import "~normalize.css/normalize.css";
html, body, #app {
  height: 100vh;
  width: 100vw;
}
#app {
}
</style>
