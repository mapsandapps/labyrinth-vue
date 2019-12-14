<template>
  <div
    class="labyrinth-container"
    :style="{ backgroundColor: this.theme.background }">
    <svg
      v-if="this.level.path"
      @mousedown="onMousedown"
      @mouseup="onMouseup"
      @mousemove="onMousemove">
      <g
        class="path-container"
        :transform="pathContainerTransform">
        <path
          class="outline"
          :stroke="this.theme.border"
          :stroke-width="this.theme.borderWidth + 24 || 28"
          fill="none"
          :d="this.level.path"
          :transform="`translate(${this.windowWidth / 2}, ${this.windowHeight / 2 })`" />
        <path
          class="outline"
          :stroke="this.theme.fullPath"
          stroke-width="24"
          fill="none"
          :d="this.level.path"
          :transform="`translate(${this.windowWidth / 2}, ${this.windowHeight / 2 })`" />
        <path
          id="animated-path"
          class="animated-path"
          :style="animatedPathStyles"
          :d="this.level.path"
          :stroke="this.theme.playerPath"
          stroke-width="16"
          fill="none"
          :transform="`translate(${this.windowWidth / 2}, ${this.windowHeight / 2 })`" />
      </g>
      <g>
        <circle
          class="position"
          :cx="this.windowWidth / 2"
          :cy="this.windowHeight / 2"
          r="20"
          :fill="this.theme.player" />
      </g>
      <g v-if="debugMode">
        <path
          :d="debugHeading"
          stroke="#ff6063"
          stroke-width="4"
          fill="none" />
        <path
          :d="debugTouchDirection"
          stroke="#a991e8"
          stroke-width="4"
          fill="none" />
      </g>
    </svg>
    <span v-if="finished">Done!</span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { bind, throttle } from 'lodash'
import { mapGetters, mapState } from 'vuex'
import store from '../store'

@Component({
  computed: {
    ...mapGetters({
      level: 'getCurrentLevel',
      theme: 'getRandomTheme'
    }),
    ...mapState('movement', {
      animatedPathStyles: 'animatedPathStyles',
      debugHeading: 'debugHeading',
      debugMode: 'debugMode',
      debugTouchDirection: 'debugTouchDirection',
      finished: 'finished',
      pathContainerTransform: 'pathContainerTransform',
      windowHeight: 'windowHeight',
      windowWidth: 'windowWidth'
    })
  }
})

export default class Labyrinth extends Vue {
  onTouchstart(): void {
    store.dispatch('movement/beginAnimation')
  }

  onMousedown(): void {
    store.dispatch('movement/beginAnimation')
  }

  onTouchend(): void {
    store.dispatch('movement/endAnimation')
  }

  onMouseup(): void {
    store.dispatch('movement/endAnimation')
  }

  // @ts-ignore
  onTouchmove(e) {
    // @ts-ignore
    e.preventDefault()
    // TODO: might need to throttle this? it sounds like chrome may throttle to 200ms by default
    store.dispatch('movement/getCurrentTouchDirection', {
      x: e.touches[0].pageX,
      y: e.touches[0].pageY
    })
  }

  onMousemove = bind(throttle(e => {
    store.dispatch('movement/getCurrentTouchDirection', {
      x: e.x,
      y: e.y
    })
  }, 50, {
    leading: true
  }), this)

  // @ts-ignore
  onAnimationEnd(e) {
    // @ts-ignore
    if (e.type === 'animationend') {
      store.dispatch('movement/stopMovement')
    }
  }

  onWindowResize(): void {
    store.commit('movement/setWindowSize', {
      width: window.innerWidth,
      height: window.innerHeight
    })
  }

  mounted() {
    this.onWindowResize()

    document.body.addEventListener('touchstart', this.onTouchstart, false)
    document.body.addEventListener('touchmove', this.onTouchmove, {
      passive: false
    })
    document.body.addEventListener('touchend', this.onTouchend, false)
    window.addEventListener('resize', this.onWindowResize)

    store.dispatch('movement/beginLevel')
  }

  beforeDestroy() {
    document.body.removeEventListener('touchstart', this.onTouchstart)
    document.body.removeEventListener('touchmove', this.onTouchmove)
    document.body.removeEventListener('touchend', this.onTouchend)
    window.removeEventListener('resize', this.onWindowResize)
    // @ts-ignore
    document.querySelector('.animated-path').removeEventListener('animationend', this.onAnimationEnd, false)
  }
}
</script>

<style scoped lang="scss">
.labyrinth-container, svg {
  width: 100%;
  height: 100%;
}

.animated-path {
  stroke-dasharray: var(--path-length);
  stroke-dashoffset: var(--path-length);
}

.path-container {
  offset-rotate: 0deg;
}
</style>
