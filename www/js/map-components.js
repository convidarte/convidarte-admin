Vue.component('group-map-marker',{
  props: {
    google: {
      type: Object,
      required: true
    },
    map: {
      type: Object,
      required: true
    },
    group: {
      type: Object,
      required: true
    },
    clickListener: null,
  },
  computed:{
  	marker(){
  		var m = {
			id: "group_marker_" + (this.group["group_id"]).toString(),
			position: { lat: parseFloat(this.group.average_latitude), lng: parseFloat(this.group.average_longitude) },
			title: this.group["name"],
			label: " ",
			icon: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
		};			
		return m;
  	}
  },
  template:`
<div>
  <google-map-marker
  	:key="marker.id"
	:marker="marker"
	:google="google"
	:map="map"
	:clickListener="clickListener"
  />
</div>`
});

Vue.component('user-map-marker',{
  props: {
    google: {
      type: Object,
      required: true
    },
    map: {
      type: Object,
      required: true
    },
    user: {
      type: Object,
      required: true
    },
    clickListener: null,
  },
  computed:{
  	marker(){
  		var color;
  		if (this.user.role=="cook"){
			iconURL = 'https://maps.google.com/mapfiles/ms/icons/red-dot.png';
		}
		if (this.user.role=="driver"){
			iconURL = 'https://maps.google.com/mapfiles/ms/icons/green-dot.png';
		}
		if (this.user.role=="delegate"){
			iconURL = 'https://maps.google.com/mapfiles/ms/icons/purple-dot.png';
		}
  		var m = {
			id: "user_marker_" + (this.user["user_id"]).toString(),
			position: { lat: parseFloat(this.user.address.latitude), lng: parseFloat(this.user.address.longitude) },
			title: this.user["username"],
			label: " ",
			icon: iconURL,
		};
		return m;
  	}
  },
  template:`
<div>
  <google-map-marker
  	:key="marker.id"
	:marker="marker"
	:google="google"
	:map="map"
	:clickListener="clickListener"
  />
</div>`
});


Vue.component('map-component-users', {
	data: function(){
			return {
				state: store.state,
			}
	},
	computed:{
		refresher(){
			console.log("(", this.state.refreshTime ,") refreshing map ");
			if(store.state.token=="") return "";
			console.log("mostrando ",store.state.usersFiltered.length, " usuarios en el mapa.");
			//refreshAvailableUsersMarkers(map);
			return "";
		},
		mapConfig(){
			var centroMapa = {lat: -34.62, lng: -58.46};
			var noPoi = [
			{
				featureType: "poi",
				stylers: [
				  { visibility: "off" }
				]   
			  }
			];
			return {
				zoom: 12,
				center: centroMapa,
				mapTypeId: 'terrain',
				styles: noPoi
			};
		},
		groups(){
			var self = this;
			var gs = store.state.groups;
			for (g of gs){
				let s=infoWindowTextForGroupMarker(g);
				g.clickListener = function(marker){
					return function(){
						self.$refs.infoWindow.show(s,marker);
					};
				};
			}
			return gs;
		},
		availableUsers(){
			var self = this;
			var us = store.state.usersFiltered;
			for (u of us){
				let s=userMarkerContent(u,u.role);
				u.clickListener = function(marker){
					return function(){
						self.$refs.infoWindow.show(s,marker);
					};
				};
			}
			return us;
		},
		infoWindowKey(){
			return this.infoWindowContent;
		},
	},
	template:`
<div>
<google-map-loader :mapConfig="mapConfig" class="profile-map">
	<template slot-scope="{ google, map }">
	  <user-map-marker
	  	v-for="u in availableUsers"
	  	:key="u.group_id"
		:user="u"
		:google="google"
		:map="map"
		:clickListener="u.clickListener"
	  />
	  <group-map-marker
	  	v-for="g in groups"
	  	:key="g.group_id"
		:group="g"
		:google="google"
		:map="map"
		:clickListener="g.clickListener"
	  />
	  <google-map-infowindow
	  	ref="infoWindow"
		:google="google"
		:map="map"  
	  />
	</template>
</google-map-loader>		
{{ refresher }}
</div>`
})



