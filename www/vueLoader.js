// https://github.com/vuejs/vue/issues/1988#issuecomment-402964241
Vue.mixin({
  beforeCreate() {
    const static = this.$options.static
    if (static && typeof static === 'function') {
      staticData = static()
      if (typeof staticData === 'object') {
        Object.assign(this, staticData)
      }
    }
  }
});


new Vue({ el:'#applicationComponent', store: store});
