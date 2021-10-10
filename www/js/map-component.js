Vue.component('map-component', {
	data: function(){
			return {
				group: null,
				hasMap:false,
			};
	},
	static:function(){
		return {
			map:null,
			markers:[],
			infowindow: null,
		}
	},
	mounted(){
		this.initMap();
		this.infowindow = new google.maps.InfoWindow({});
	},
	computed:{
		refresher(){
			console.log("(", store.state.refreshTime ,") refreshing map ");
			if(!this.hasMap) return "";
			//console.log(store.state.usersFiltered.length, store.state.currentGroupId, store.state.currentMyGroupId, store.state.currentTab);
			return this.refreshMap();
		},
	},
	methods:{
		initMap: function(){
			var centroMapa = {lat: -34.62, lng: -58.46};
			this.map = new google.maps.Map(document.getElementById('mapDiv'), {
				zoom: 12,
				center: centroMapa,
				mapTypeId: 'terrain'
			});
			var noPoi = [
			{
				featureType: "poi",
				stylers: [
				  { visibility: "off" }
				]   
			  }
			];
			this.map.setOptions({styles: noPoi});
			this.hasMap=true;
		},
		refreshMap: function(){
			var tab = store.state.currentTab;
			this.deleteMarkers();
			if(tab=="users"){
				console.log("mostrando ", store.state.usersFiltered.length, " usuarios en el mapa.");
				refreshGroupMarkers(this.map, this.infowindow, this.markers);
				refreshAvailableUsersMarkers(this.map, this.infowindow, this.markers);
				this.setCenter();
				this.setZoom();
				return "";
			}
			if(tab=="groups" || tab=="mygroups"){
				var gid = (tab=="groups") ? store.state.currentGroupId : store.state.currentMyGroupId;
				if(gid!=0){
					var self = this;
					getGroup(gid).then(group => {
						self.group=group;
						displayGroupOnMap(this.map, group, this.infowindow, this.markers);
						this.setCenter();
						this.setZoom();
					});
				}else{
					this.deleteMarkers();
				}
				return "";
			}
			return "";
		},
		deleteMarkers: function() {
			clearMarkers(this.markers);
			this.markers = [];
		},
		setCenter(){
			var tab = store.state.currentTab;
			var gid = (tab=="groups") ? store.state.currentGroupId : store.state.currentMyGroupId;
			var g = this.group;
			if( (tab=="groups" || tab=="mygroups") && gid!=0 && g!==null){
				centerMapOnGroup(this.map,g);
			}
			if(tab=="users"){
				//centerMapOnAverageAvailableUsers(map);
				//centerMapOn(-34.62, -58.46);
			}
			return "";
		},
		setZoom(){
			if(store.state.currentTab=="users"){
				this.map.setZoom(12);
			}
			if(["groups", "mygroups"].includes(store.state.currentTab) ){
				this.map.setZoom(15);
			}
			return "";
		},
	},
	template:`
<div id="map">
	<div id="mapDiv"></div>
	{{ refresher }}
</div>`
})



