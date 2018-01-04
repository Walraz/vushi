export default class TouchEvent {
  constructor(el, callback) {
    this.handleTouchEvent = callback
    this.touchstartX = 0
    this.touchstartY = 0
    this.touchendX = 0
    this.touchendY = 0
    this.gestureZone = el
    this.touchStartFn = this.touchStartFn.bind(this)
    this.touchEndFn = this.touchEndFn.bind(this)
  }

  touchStartFn(event) {
    this.touchstartX = event.changedTouches[0].screenX
    this.touchstartY = event.changedTouches[0].screenY
  }

  touchEndFn(event) {
    this.touchendX = event.changedTouches[0].screenX
    this.touchendY = event.changedTouches[0].screenY
    this.handleTouchEvent(this)
  }

  init() {
    this.gestureZone.addEventListener('touchstart', this.touchStartFn, false)
    this.gestureZone.addEventListener('touchend', this.touchEndFn, false)
  }

  destroy() {
    this.gestureZone.removeEventListener('touchstart', this.touchStartFn, false)
    this.gestureZone.removeEventListener('touchend', this.touchEndFn, false)
  }

  // function handleGesture() {
  //   if (touchendX <= touchstartX) {
  //     console.log('Swiped left')
  //   }

  //   if (touchendX >= touchstartX) {
  //     console.log('Swiped right')
  //   }

  //   if (touchendY <= touchstartY) {
  //     console.log('Swiped up')
  //   }

  //   if (touchendY >= touchstartY) {
  //     console.log('Swiped down')
  //   }

  //   if (touchendY === touchstartY) {
  //     console.log('Tap')
  //   }
  // }
}
