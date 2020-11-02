Vue.component('split-group-form', {
	props: ['splittingGroup'],
	methods:{
		splitGroup: function(){
			var newName = document.getElementById("splitGroupName").value;
			this.$emit('splitGroup',  newName );
		},
		splitGroupStop: function(){
		    this.$emit('splitGroupStop');
		},
		splitGroupStart: function(){
		    this.$emit('splitGroupStart');
		},
	},
	template:`
	<div style="margin-left:15px;">
		<hr style="width:95%;">
		<h3>Dividir grupo</h3>
		<div v-if="splittingGroup">
			Instrucciones: seleccionar los miembros del nuevo grupo, luego elegir el 
			nombre del nuevo grupo y finalmente clickear en Dividir grupo.<br>
			Nombre para el nuevo grupo:&nbsp;&nbsp;
			<input id="splitGroupName" type="text"></input><br><br>
			<button @click="splitGroup">Dividir grupo</button>
			&nbsp;&nbsp;&nbsp;&nbsp;
			<button @click="splitGroupStop">Cancelar la división</button><br>
		</div>
		<div v-else>
			<button id="startDividingGroupButton" @click="splitGroupStart">Quiero dividir el grupo</button>
			<br>
		</div>
	<hr style="width:95%;">
	</div>
`,
});

