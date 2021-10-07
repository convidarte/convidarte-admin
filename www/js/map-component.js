Vue.component('map-component', {
	data: function(){
			return {
				group: null,
				state: store.state,
				//map:null,
				//markers: [],
				//groupMarkers: [],
				//currentInfoWindow: null,
			}
	},
	mounted(){
		this.initMap();
	},
	computed:{
		refresher(){
			console.log("(", this.state.refreshTime ,") refreshing map ");
			if(store.state.token=="") return "";
			if(!(map)) return "";
			var tab = store.state.currentTab;
			if(tab=="users"){
				console.log("mostrando ",store.state.usersFiltered.length, " usuarios en el mapa.");
				deleteMarkers();
				refreshGroupMarkers(map);
				refreshAvailableUsersMarkers(map);
				return "";
			}
			if(tab=="groups" || tab=="mygroups"){
				var gid = (tab=="groups") ? store.state.currentGroupId : store.state.currentMyGroupId;
				if(gid!=0){
					var self = this;
					getGroup(gid).then(group => {
						self.group=group;
						displayGroupOnMap(map,group);
					});
				}else{
					deleteMarkers();
				}
				return "";
			}
			return "";
		},
		centerOnGroup(){
			if(!(map)) return "";
			var tab = store.state.currentTab;
			var gid = (tab=="groups") ? store.state.currentGroupId : store.state.currentMyGroupId;
			var g = this.group;
			if( (tab=="groups" || tab=="mygroups") && gid!=0 && g!==null){
				centerMapOnGroup(map,g);
			}
			if(tab=="users"){
				//centerMapOnAverageAvailableUsers(map);
				//centerMapOn(-34.62, -58.46);
			}
			return "";
		},
		setZoom(){
			if(!(map)) return "";
			if(store.state.currentTab=="users"){
				map.setZoom(12);
			}
			if(["groups", "mygroups"].includes(store.state.currentTab) ){
				map.setZoom(15);
			}
			return "";
		},
	},
	methods:{
		initMap: function(){
			var centroMapa = {lat: -34.62, lng: -58.46};
			map = new google.maps.Map(document.getElementById('mapDiv'), {
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
			map.setOptions({styles: noPoi});
		},
	},
	template:`
<div id="map">
	<div id="mapDiv"></div>
	{{ refresher }}
	{{ centerOnGroup }}
	{{ setZoom }}   
</div>`
})



