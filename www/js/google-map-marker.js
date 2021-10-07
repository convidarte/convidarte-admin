Vue.component('google-map-marker',{
  props: {
    google: {
      type: Object,
      required: true
    },
    map: {
      type: Object,
      required: true
    },
    marker: {
      type: Object,
      required: true
    }
  },
  mounted() {
    const { Marker } = this.google.maps;
    this.marker.map=this.map;
    new Marker(this.marker);
/*    var m = new Marker(this.marker);
    m.setMap(this.map);*/
/*
    new Marker({
      position: this.marker.position,
      marker: this.marker,
      map: this.map,
      //icon: POINT_MARKER_ICON_CONFIG
    });
    */
  },

  render() {}
});


