Vue.component('group-list-delegate', {
	data: function(){
			return {
				state: store.state,
				groupsDelegate: [],
			}
	},
	methods: {
		showMyGroup: function(event){
			var gid = parseFloat(event.target.getAttribute("data-gid"),10);
			if (gid.toString()!="NaN"){
				setKey("currentMyGroupId",gid);
				showMyGroupById(gid);
			}
		},
	},
	computed: {
		refresh: function(){
			console.log("group delegate ",store.state.refreshTime);
			var self = this;
			if(!this.state.adminUserId) return "";
			getUserGroups(this.state.adminUserId).then( response => {
				self.groupsDelegate = response["groups"].filter( function(g){ return g.roles.includes("delegate");} );
			});
			return "";
		},
	},

	template:`
<div>
	{{refresh}}
	<ul>
		<li class="filter-group">Mis grupos:</li>
		<li class="filter-group" v-for="g in groupsDelegate" style="padding:6px;">
			<a href="#" v-on:click="showMyGroup" :data-gid="g.group_id" > {{ g.name }} </a>
		</li>
	</ul>
</div>
`
});

