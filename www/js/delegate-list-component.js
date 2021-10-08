Vue.component('delegate-list', {
	data: function(){
		return {
			delegateData: {
				groups: []
			}
		}
	},
	methods: {
		displayUserData(){
			var self=this;
			do_request("/information/delegates", null, true, "GET").then( data =>{self.delegateData = data;});
		},
	},
	mounted(){
		this.displayUserData();
	},
	template :`
<div class="list-container" style="width:100%;">
	<table class="table table-striped">
		<tr>
			<th>Grupo</th>
			<th>Delegados</th>
			<th>#Voluntarios</th>
			<th>#Voluntarios pendientes de contactar</th>
		</tr>
		<tr v-for="g in delegateData.groups" >
			<td><link-view-group :groupId="g.group_id" :groupName="g.name"/></td>
			<td>
				<table class="table table-borderless">
					<tr v-for="u in g.delegates">
						<td style="padding:0px;"> <link-user-profile :userId="u.user_id" :userName="u.user_name"></link-user-profile></td>
						<td style="padding:0px;">({{u.name}} {{u.last_name}})</td>
						<td style="padding:0px;">{{u.cellphone}}</td>
					</tr>
				</table>
			</td>
			<td>{{g.member_count}}</td>
			<td>{{g.pending_ack_count}}</td>					
		</tr>
	</table>
</div>
`
})

