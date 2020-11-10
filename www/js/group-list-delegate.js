Vue.component('group-list-delegate', {
	data: function(){
			return {
				state: store.state,
			}
	},
	methods: {
		showGroup: function(event){
			var gid = parseFloat(event.target.getAttribute("data-gid"),10);
			if (gid.toString()!="NaN"){
				store.setKey("currentGroupId",gid);
				showGroupById(gid);
			}
		},
	},
	computed: {
		groupsDelegate: function(){
			console.log("group delegate ",store.state.refreshTime);		
			return getUserGroups(this.state.adminUserId).filter( function(g){ return g.roles.includes("delegate");} );
		},
	},

	template:`
<div>
	<ul>
		<li class="filter-group">Mis grupos:</li>
		<li class="filter-group" v-for="g in groupsDelegate" style="padding:6px;">
			<a href="#" v-on:click="showGroup" :data-gid="g.group_id" > {{ g.name }} </a>
		</li>
	</ul>
</div>
`
});

