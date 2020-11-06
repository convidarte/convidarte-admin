Vue.component('map-component', {
	data: function(){
			return {
				state: store.state,
			}
	},
	computed:{
		refresher(){
			console.log("(",store.state.refreshTime ,") refreshing map ");
			if(this.state.token=="") return "";
			var tab = this.state.currentTab;
			if(tab=="users"){
				console.log("mostrando ",store.state.usersFiltered.length, " usuarios en el mapa.");
				deleteMarkers();
				refreshGroupMarkers();
				refreshAvailableUsersMarkers();
				//centerMapOn(-34.62, -58.46);
				return "";
			}
			if(tab=="groups"){
				var gid = this.state.currentGroupId;
				if( gid!=0 ){
					var g = getGroup(gid);
					displayGroupOnMap(g);
				}else{
					deleteMarkers();
				}
				return "";
			}
			return "";
		},
		centerOnGroup(){
			var gid = this.state.currentGroupId;
			var tab = this.state.currentTab;
			if(gid!=0 && tab=="groups"){
				centerMapOnGroup(gid);
			}
			if(tab=="users"){
				//centerMapOnAverageAvailableUsers();
			}
			return "";
		},
		setZoom(){
			if(this.state.currentTab=="users"){
				map.setZoom(12);
			}
			if(this.state.currentTab=="groups"){
				map.setZoom(15);
			}
			return "";
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



