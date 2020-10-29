Vue.component('select-user-component', {
	data: function(){
			return {
				state: store.state,
			}
	},
	computed: {
		refreshOptions: function (){
			console.log("completo opciones");
			var allUsers = store.state.users;
			optionList = new Array();
			for ( var i=0; i<allUsers.length; i++){
				u = allUsers[i];
				optionList.push( tidySpaces(u.user_id.toString()+": "+ encodeHTML(u.user_name)	+ " ("+encodeHTML(u.name) + " " + encodeHTML(u.last_name)+" " +encodeHTML(u.cellphone) +")"));
			}
			$( "#userList" ).autocomplete({
				source: optionList,
				select: function(event,ui){
					selectedOption = ui.item.label
					document.getElementById("userList").value = selectedOption;
					num = parseFloat(selectedOption.split(":")[0]);
					if (num.toString()!="NaN"){
						currentUserId = num;
						showModalProfile(currentUserId);
					}
				},
			});
			return "";
		},
	},
	methods: {
		clearText: function(event){
			event.target.value="";
		},
	},
	template: `
	  <div id="userSearchBoxContainer" class="ui-widget" style = "display: none;">
		<label for="userList"><span style="color:black">Buscar usuario:</span></label>
		<input id="userList" v-on:click="clearText">
		{{ refreshOptions }}
	  </div>
`
})



