Vue.component('map-component', {
	data: function(){
			return {
				group: null,
			}
	},
	computed:{
		refresher(){
			console.log("(",store.state.refreshTime ,") refreshing map ");
			if(store.state.token=="") return "";
			var tab = store.state.currentTab;
			if(tab=="users"){
				console.log("mostrando ",store.state.usersFiltered.length, " usuarios en el mapa.");
				deleteMarkers();
				refreshGroupMarkers();
				refreshAvailableUsersMarkers();
				return "";
			}
			if(tab=="groups" || tab=="mygroups"){
				var gid = store.state.currentGroupId;
				if(gid!=0){
					var self = this;
					getGroup(gid).then(group => {
						self.group=group;
						displayGroupOnMap(group);
					});
				}else{
					deleteMarkers();
				}
				return "";
			}
			return "";
		},
		centerOnGroup(){
			var gid = store.state.currentGroupId;
			var tab = store.state.currentTab;
			var g = this.group;
			if( (tab=="groups" || tab=="mygroups") && gid!=0 && g!==null){
				centerMapOnGroup(g);
			}
			if(tab=="users"){
				//centerMapOnAverageAvailableUsers();
				//centerMapOn(-34.62, -58.46);
			}
			return "";
		},
		setZoom(){
			if(store.state.currentTab=="users"){
				map.setZoom(12);
			}
			if( store.state.currentTab in ["groups", "mygroups"] ){
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



