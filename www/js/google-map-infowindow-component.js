Vue.component('google-map-infowindow',{
  props: {
    google: {
      type: Object,
      required: true
    },
    map: {
      type: Object,
      required: true
    },
  },
  data: function(){
	return {
		infoWindow: null
	};
  },
  methods:{
  	show(content, marker){
		this.infoWindow.setContent(content);
		this.infoWindow.open(this.map, marker);
  	},
  },
  mounted() {
    this.infoWindow = new this.google.maps.InfoWindow({});
  },
  render() {},
});

