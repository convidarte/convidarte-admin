Vue.component('map-component', {
	data: function(){
			return {
				state: store.state,
				group: null,
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
				return "";
			}
			if(tab=="groups"){
				var gid = this.state.currentGroupId;
				if( gid!=0 ){
					this.group = getGroup(gid);
					displayGroupOnMap(this.group);
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
			var g = this.group;
			if(tab=="groups" && gid!=0 && g!==null){
				centerMapOnGroup(g);
			}
			if(tab=="users"){
				//centerMapOnAverageAvailableUsers();
				//centerMapOn(-34.62, -58.46);
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



