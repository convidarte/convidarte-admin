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
	<div>
		<hr style="width:95%;">

		<div v-if="splittingGroup">
			<h3>Dividir grupo</h3>
			Instrucciones: seleccionar los miembros del nuevo grupo, elegir el 
			nombre del nuevo grupo y finalmente clickear en "Dividir".<br>
			Nombre para el nuevo grupo:&nbsp;&nbsp;
			<input id="splitGroupName" type="text"></input><br><br>
			<button @click="splitGroup">Dividir</button>
			&nbsp;&nbsp;&nbsp;&nbsp;
			<button @click="splitGroupStop">Cancelar la división</button><br>
		</div>
	</div>
`,
});

