Vue.component('phonebook', {
	data: function(){
		return {
			delegateData: {
				groups: []
			},
			phonebookData:{
				phonebook: []
			},
			orderBy: "group_id",
			reverseOrder: false,
		}
	},
	methods: {
		displayUserData(){
			var self=this;
			do_request("/information/phonebook", null, true, "GET").then( data =>{
				self.phonebookData = data;
			});
			do_request("/information/delegates", null, true, "GET").then( data =>{
				if(self.orderBy!=""){
					var compare=function(g1,g2){
						var s = self.reverseOrder ? -1 : 1;
						return s*(g1[self.orderBy]<g2[self.orderBy] ? -1 : (g1[self.orderBy]==g2[self.orderBy] ? 0 : 1));
					}
					data.groups.sort(compare);
					/*
					var gs = data.groups;
					gs = gs.sort(compare);
					self.delegateData = {groups: gs};
					console.log(gs);
					return;*/
				}
				self.delegateData = data;
				
			});
		},
		orderByGroupId(){
			this.orderBy="group_id";
			this.reverseOrder=  !(this.reverseOrder);
			this.displayUserData();
		},
		orderByMemberCount(){
			this.orderBy="member_count";
			this.reverseOrder= !(this.reverseOrder);
			this.displayUserData();
		},
		orderByPendingAckCount(){
			this.orderBy="pending_ack_count";
			this.reverseOrder= !(this.reverseOrder);
			this.displayUserData();
		},
	},
	computed:{
		userIsAdmin(){
			return store.state.systemUserRoles.indexOf("admin")>=0;
		},
	},
	mounted(){
		this.displayUserData();
	},
	template :`
<div class="list-container" style="width:100%;">

	<h2>Teléfonos útiles</h2>
	<table class="table">
		<tr>
			<th>Usuario</th>
			<th>Nombre</th>
			<th>Teléfono</th>
			<th>Rol</th>
			<th>Consultar por</th>
		</tr>
		<tr v-for="u in phonebookData.phonebook" >
			<td><link-user-profile :userId="u.user_id" :userName="u.user_name"></link-user-profile></td>
			<td>{{u.name}} {{u.last_name}}</td>
			<td>{{u.cellphone}}</td>
			<td>{{u.position}}</td>
			<td>{{u.description}}</td>
		</tr>
	</table>


	<h2>Grupos y delegados </h2>
	<table class="table">
		<tr>
			<th @click="orderByGroupId">Grupo</th>
			<th>Delegados</th>
			<th v-if="userIsAdmin"><a href="#" @click="orderByMemberCount">#Voluntarios</a></th>
			<th v-if="userIsAdmin"><a href="#" @click="orderByPendingAckCount">#Voluntarios pendientes de contactar</a></th>
		</tr>
		<tr v-for="g in delegateData.groups" >
			<td><link-view-group :groupId="g.group_id" :groupName="g.name"/></td>
			<td>
				<table class="table table-borderless" style="">
				    <colgroup>
					   <col span="1" style="width: 30%;">
					   <col span="1" style="width: 40%;">
					   <col span="1" style="width: 30%;">
					</colgroup>
					<tbody>    
					<tr v-for="u in g.delegates">
						<td style="padding:0px 2px;"> <link-user-profile :userId="u.user_id" :userName="u.user_name"></link-user-profile></td>
						<td style="padding:0px 2px;">{{u.name}} {{u.last_name}}</td>
						<td style="padding:0px 2px;">{{u.cellphone}}</td>
					</tr>
					</tbody>
				</table>
			</td>
			<td v-if="userIsAdmin" >{{g.member_count}}</td>
			<td v-if="userIsAdmin" >{{g.pending_ack_count}}</td>					
		</tr>
	</table>
</div>
`
})

