Vue.component('map-component', {
	data: function(){
			return {
				state: store.state,
			}
	},
	computed:{
		refresher(){
			console.log("refresh map vue ",store.state.refreshTime);
			if(token==""){
				return "";
			}
			var tab = this.state.currentTab;
			if(tab=="users"){
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
			return "";
		}
	},
	template:`
<div id="map">
	<div id="mapDiv"></div>
	{{ refresher }}
	{{ centerOnGroup }}
</div>`
})



