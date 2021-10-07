Vue.component('google-map-loader',{
  props: {
    mapConfig: Object,
    center: null,
  },
  data() {
    return {
      google: google,
      map: null
    };
  },

  async mounted() {
    this.initializeMap();
  },

  methods: {
    initializeMap() {
      const mapContainer = this.$refs.googleMap;
      this.map = new google.maps.Map(mapContainer, this.mapConfig);
    }
  },
  computed:{
  	setCenter(){
  		if(this.center && this.map)
	  		this.map.setCenter(new google.maps.LatLng(this.center.lat, this.center.lng));
  	},
  },
template:`
<div>
	{{setCenter}}
    <div
	  style="width:100%;height:100%;"
      ref="googleMap"
    ></div>
    <template v-if="Boolean(this.google) && Boolean(this.map)">
      <slot
        :google="google"
        :map="map"
      />
    </template>
  </div>
`});



