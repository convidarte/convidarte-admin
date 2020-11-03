Vue.component('select-group-component', {
	data: function(){
			return {
				state: store.state,
			}
	},
	computed: {
		groups: function(){ return store.state.groups}
	},
  template: `
<select id="selectGroupComponent" style="max-width:120px;">
	<option disabled selected value>elegir grupo</option>
	<option v-for="g in groups" :value="g.group_id" >{{g.group_id}} - {{ g.name }}</option>
</select>
`
})

