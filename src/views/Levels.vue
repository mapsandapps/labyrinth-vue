<template>
<div>
  <svg
    viewBox="0 0 1000 1000"
    v-for="(level, index) in levels"
    class="clickable"
    :key="index"
    @click="selectLevel(index)">
    <path
      :d="level.path"
      stroke="black"
      stroke-width="6"
      fill="none" />
  </svg>
  <div
    class="clickable"
    @click="randomLevel">
    Random level
  </div>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { mapGetters, mapState } from 'vuex'
import router from '../router'
import store from '../store'

@Component({
  computed: {
    ...mapGetters({
      levels: 'getAllLevels'
    })
  }
})

export default class Levels extends Vue {
  randomLevel() {
    store.commit('setRandomLevel')
    router.push({ name: 'labyrinth', params: { level: null } })
  }

  selectLevel(index) {
    store.commit('setCurrentLevel', index)
    router.push({ name: 'labyrinth', params: { level: index } })
  }

  mounted() {
  }
}
</script>

<style lang="scss" scoped>
svg {
  width: 100px;
  height: 100px;
}

.clickable {
  cursor: pointer;
}
</style>
