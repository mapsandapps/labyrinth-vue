export type MovementStoreState = {
  animatedPathStyles: string
  circlePositionWithinLabyrinth: DOMPoint | null
  currentHeading: number | null
  currentSpeed: number
  currentTouchDirection: number | null
  debugHeading: string
  debugMode: boolean
  debugTouchDirection: string
  finished: boolean
  lastPassedPoint: DOMPoint | null
  moving: boolean
  pathContainerTransform: string
  pathElement: Element | null
  pathLength: number
  position: number
  started: boolean
  windowHeight: number
  windowWidth: number
}

export type Point = {
  x: number
  y: number
}
