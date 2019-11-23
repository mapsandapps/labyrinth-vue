<template>
  <div id="app">
    <Labyrinth />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Labyrinth from './components/Labyrinth.vue';

@Component({
  components: {
    Labyrinth,
  },
})
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
