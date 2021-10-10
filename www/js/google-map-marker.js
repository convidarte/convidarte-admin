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
    },
    clickListener: null,
  },
  mounted() {
    const { Marker } = this.google.maps;
    this.marker.map=this.map;
    var m = new Marker(this.marker);
    if(this.clickListener!= null){
    	m.addListener('click', this.clickListener(m));
    }
    
  },

  render() {}
});


