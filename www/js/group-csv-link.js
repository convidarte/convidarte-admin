Vue.component('group-csv-link', {
	data: function(){
			return {
				state: store.state,
				csvSeparator: ";",
			}
	},
	props:[ "group" ],
	computed:{
		csvUrl: function(){
			if( this.group == null) return "";
			var members = this.group.members;
			var csvSeparator = this.csvSeparator;
			var text = ["Id","Nombre","Dirección","Barrio","Ciudad","Provincia","Celular","Email","Rol(es)"].join(csvSeparator)+"\n"; 
			for (var i = 0; i < members.length; i++){
				var u = members[i];
				var uid = u.user_id.toString();
				var address = u.address.street +" "+u.address.number.toString()+ " "+ u.address.floor_and_apartment;
				var neighborhood = u.address.neighborhood;
				var city = u.address.city;
				var province = u.address.province;
				fullname = nameToShow(u);
				var cellphone= u.cellphone;
				var email = u.email;
				var roles = u.roles_in_group.map( x=> x["role"] ).map(roleInSpanish).join( " ");
				var row = [uid,fullname,address,neighborhood,city,province,cellphone,email,roles].map( x => '"' + x.replace(/"/g, '""') + '"' ).join(csvSeparator);
				text+=row+"\n";
			}
			var fileBlob = new Blob([text], {type: "application/octet-binary"});
			return URL.createObjectURL(fileBlob);
		},
		csvFilename: function(){
			if( this.group == null) return "";
			var g = this.group;
			var members = g.members;
			return "grupo " + g.group_id.toString() + " - " + g.name + " - " + getDateString() + ".csv";
		},
	},
	template:`
<div id="downloadCSVLinkDiv">
	<a id="csvLink" :href="csvUrl" :download="csvFilename">Bajar hoja de cálculo (en formato .csv)</a>
</div>
` 
});

