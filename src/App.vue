<template>
  <div id="app">
    this is the App component
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
#app {
}
</style>
