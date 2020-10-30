Vue.component('groups-component', {
	data: function(){
			return {
				state: store.state,
			}
	},
	computed:{
		refresh : function(){
			console.log("refrescando grupo desde vue ", this.state.refreshTime);
			var gid= store.state.currentGroupId;
			if( gid!=0 ){
				refreshGroupById(gid);
			}
			return "";
		},
	},
	template:`
<div id="groupsLeftPanel" style="display: none;">  
	<div id="grupos" style="display:none;"></div>
	<div id="groupMembers"></div>
	{{ refresh }}
</div>
` 
})

