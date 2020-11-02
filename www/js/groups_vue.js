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
			refreshGroupById(gid);
			return "";
		},
		style : function(){
			if(this.state.currentTab=="users"){
				return "display: none;";
			}
			if(this.state.currentTab=="groups"){
				return "";
			}
			return "display:none;";
		}
	},
	template:`
<div id="groupsLeftPanel" :style="style">  
	<div id="grupos" style="display:none;"></div>
	<div id="groupMembers"></div>
	<group-detail-printable></group-detail-printable>
	{{ refresh }}
</div>
` 
})

