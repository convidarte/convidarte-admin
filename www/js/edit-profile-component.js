Vue.component('edit-profile', {
	data: function(){
		return {
			isEditingProfile : false,
			messageUpdatingProfile: "",
			showVehicleSelector:false,
			locationList:[],
			classResult:"",
			
			name:"",
			last_name:"",
			email:"",
			cellphone:"",

			cook:false,
			driver:false,
			vehicle: "",
			
			street:"",
			number:0,
			floor_and_apartment:"",
			province:"",
			city:"",
			neighborhood:"",
			location:"",
			extra_info:"",
			
			validation:{
				result:{
					message:"",
					class:"",				
				},
				name:{
					message:"",
					class:"",
				},
				last_name:{
					message:"",
					class:"",
				},
				email:{
					message:"",
					class:"",
				},
				cellphone:{
					message:"",
					class:"",
				},
				vehicle:{
					message:"",
					class:"",
				},				
				province:{
					message:"",
					class:"",
				},
				location:{
					message:"",
					class:"",
				},
				
			},
		}
	},
	computed:{
		refresher(){
			console.log("refreshing edit-profile data",store.state.refreshTime);
			if(!this.isEditingProfile) this.displayUserData();
			this.refreshReadOnly();
		},
		resetLocationOptions(){
			var url="";
			if(this.province=="CABA"){
				url = "./assets/caba_neighborhoods.json";
			}
			if(this.province=="BUENOS AIRES"){
				url = "./assets/buenos_aires_cities.json";
			}
			if(url!=""){
				fetch(url)
					.then(response => response.json())
					.then( data => {this.locationList = data;} );
			}
			return "";
		},
	},
	methods: {
		startEditingProfile(){
			this.isEditingProfile=true;
			this.validation.result.message="";
			this.refreshReadOnly();
		},
		stopEditingProfile(){
			this.isEditingProfile=false;
			this.validation.result.message="";
			this.displayUserData();
			this.refreshReadOnly();
			this.clearValidationMessages();
		},
		refreshReadOnly(){
			if ((!this.$refs) || (!this.$refs["fieldset"])) return;
			if(this.isEditingProfile){
				this.$refs["fieldset"].removeAttribute("disabled");
			}else{
				this.$refs["fieldset"].setAttribute("disabled","disabled");
			}
		},
		updateProfile(){
			var payload = this.getPayload();
			var result = this.validatePutProfilePayload(payload);
			if(!result){
				this.validation.result.message = "No se pudo actualizar.";
				this.validation.result.class = "text-danger";
				return;
			}
			//send request
			do_request("/users/"+store.state.adminUserId.toString(), payload, true, "PUT").then(
				data =>{
					this.validation.result.message = "Perfil actualizado";
					this.validation.result.class = "text-success";
					this.isEditingProfile = false;	
					this.refreshReadOnly();
				}
			).catch(
				data =>{
					if(data.code=="email_already_taken"){
						this.validation.email.message="El email ya corresponde a otro usuario de Convidarte";
						this.validation.email.class = "text-danger";
					}
					if(data.code=="email_validation_is_email"){
						this.validation.email.message="El email ingresado es inválido";
						this.validation.email.class = "text-danger";
					}
					this.validation.result.message = "Error al actualizar el perfil.";
					this.validation.result.class = "text-danger";
				}
			);
		},
		displayUserData(){
			do_request("/users/"+store.state.adminUserId.toString(), null, true, "GET").then(
				user =>{
					if(user){
						this.name = user.name;
						this.last_name = user.last_name;
						this.cellphone = user.cellphone;
						this.email = user.email;
						this.street = user.address.street;
						this.number = user.address.number;
						this.floor_and_apartment = user.address.floor_and_apartment;
						this.province =user.address.province;
						if(this.province == "CABA"){
							this.location = user.address.neighborhood;
						}
						if(this.province == "BUENOS AIRES"){
							this.location = user.address.city;
						}
						this.extra_info =user.address.extra_info;
						this.cook = user.roles.includes("cook");
						this.driver = user.roles.includes("driver");
						this.showVehicleSelector=user.roles.includes("driver");
						if(user.driver) this.vehicle = user.driver.vehicle;
						this.refreshReadOnly();
					}
				});
		},
		getPayload(){
			return {
				name: this.name,
				last_name: this.last_name,
				address: {
					street: this.street,
					number: parseFloat(this.number,10),
					floor_and_apartment: this.floor_and_apartment,
					extra_info: this.extra_info,
					zip_code: "",
					neighborhood: this.province == "CABA" ? this.location : "",
					commune: "",
					city: this.province != "CABA" ? this.location : "CABA",
					province: this.province,
				},	
				cellphone: this.cellphone,
				email: this.email,
				organization: "",
				roles: ["driver","cook"].filter( role => this[role] ),
				cook: {
					availability: {
						monday: true,
						tuesday: true,
						wednesday: true,
						thursday: true,
						friday: true,
						saturday: true,
						sunday: true
					},
					max_dishes: 20
				},
				driver: {
					availability: {
						monday: true,
						tuesday: true,
						wednesday: true,
						thursday: true,
						friday: true,
						saturday: true,
						sunday: true,
						morning: true,
						afternoon: false,
						evening: false
					},
					vehicle: this.vehicle,
				},							
			};
		},
		validatePutProfilePayload(payload){
			var validationOK = true;
			this.clearValidationMessages();
			if(payload.name == ""){
				this.validation.name.message="El nombre ingresado no es válido.";
				this.validation.name.class="text-danger";
				validationOK = false;
			}
			if(payload.last_name == ""){
				this.validation.last_name.message="El apellido ingresado no es válido.";
				this.validation.last_name.class="text-danger";
				validationOK = false;
			}
			if(payload.cellphone == ""){
				this.validation.cellphone.message="El celular ingresado no es válido.";
				this.validation.cellphone.class="text-danger";
				validationOK = false;
			}
			if(payload.email == ""){
				this.validation.email.message="El email ingresado no es válido.";
				this.validation.email.class="text-danger";
				validationOK = false;
			}
			if(payload.street == ""){
				this.validation.street.message="La calle ingresada no es válida.";
				this.validation.street.class="text-danger";
				validationOK = false;
			}
			if( parseFloat(payload.number,10)==0 ){
				this.validation.number.message="El número ingresado no es válido.";
				this.validation.number.class="text-danger";
				validationOK = false;
			}
			if(payload.roles.includes("driver") && (payload.driver.vehicle=="") ){
				this.validation.vehicle.message="El vehículo ingresado no es válido.";
				this.validation.vehicle.class="text-danger";
				validationOK = false;
			}									
			return validationOK;
		},
		toggleShowVehicleSelector(){
			this.showVehicleSelector=!(this.showVehicleSelector);
		},
		clearValidationMessages(){
			Object.keys(this.validation).forEach(k=> {if(k!="result") this.validation[k].message="";});
		},
	},
	mounted(){
		this.displayUserData();
	},
	template :`
<div class="list-container" style="width:100%;">
{{refresher}}
	<h2>Mis datos en Convidarte</h2>
	<form>
		<fieldset ref="fieldset" disabled>
			<h5>Datos personales</h5>
			<div class="form-row">
				<div class="form-group col-md-6">
					<label for="name">Nombre</label>
					<input type="text" class="form-control" id="name" placeholder="Nombre" v-model="name">
					<div :class="validation.name.class">{{validation.name.message}}</div>
				</div>
				<div class="form-group col-md-6">
					<label for="last_name">Apellido</label>
					<input type="text" class="form-control" id="last_name" placeholder="Apellido" v-model="last_name">
					<div :class="validation.last_name.class">{{validation.last_name.message}}</div>
				</div>
			</div>
			<div class="form-row">
				<div class="form-group col-md-6">
					<label for="cellphone">Celular</label>
					<input type="text" class="form-control" id="cellphone" placeholder="Celular" v-model="cellphone">
					<div :class="validation.cellphone.class">{{validation.cellphone.message}}</div>
				</div>
				<div class="form-group col-md-6">
					<label for="email">Email</label>
					<input type="text" class="form-control" id="email" placeholder="Email" v-model="email">
					<div :class="validation.email.class">{{validation.email.message}}</div>
				</div>
			</div><br><br>

			<h5>Dirección</h5>
			<div class="form-row">
				<div class="form-group col-md-6">
					<label for="street">Calle</label>
					<input type="text" class="form-control" id="street" v-model="street"></input>
				</div>
				<div class="form-group col-md-6">
					<label for="number">Número</label>
					<input type="number" class="form-control" id="number" v-model="number"></input>
				</div>
			</div>	
			<div class="form-row">		
				<div class="form-group col-md-6">
					<label for="floor_and_apartment">Piso/Departamento</label>
					<input type="text" class="form-control" id="floor_and_apartment" v-model="floor_and_apartment"></input>
				</div>
				<div class="form-group col-md-6">
					<label for="extra_info">Más indicaciones </label>
					<input type="text" class="form-control" id="extra_info" v-model="extra_info"></input>
				</div>
			</div>			
			<div class="form-row">
				<div class="form-group col-md-6">
					<label for="province">Provincia</label>
					<select class="form-control" id="province" v-model="province">
						<option value="CABA">Ciudad Autónoma de Buenos Aires</option>
						<option value="BUENOS AIRES">Provincia de Buenos Aires</option>
					</select>
					<div :class="validation.province.class">{{validation.province.message}}</div>
				</div>
				{{resetLocationOptions}}
				<div class="form-group col-md-6">
					<label for="location">Localidad/Barrio</label>
					<select class="form-control" id="location" v-model="location">
						<option v-for="l in locationList" :value="l.value" selected>{{l.label}}</option>
					</select><br>
					<div :class="validation.location.class">{{validation.location.message}}</div>
				</div>
			</div>	


			<h5>Puedo colaborar</h5>
			<div class="form-check">
				<input class="form-check-input" type="checkbox" id="cookCheckbox"  v-model="cook">
				<label class="form-check-label" for="cookCheckbox">Cocinando</label>
			</div>
			
			<div class="form-check">
				<input class="form-check-input" type="checkbox" id="driverCheckbox" v-model="driver" @click="toggleShowVehicleSelector">
				<label class="form-check-label" for="driverCheckbox">Distribuyendo</label>
			</div>
			<div class="form-group col-md-6" v-show="showVehicleSelector">
					<label for="vehicle">Vehículo</label>
					<select class="form-control" id="vehicle" placeholder="Vehículo" v-model="vehicle">
						<option value="car" selected>En auto</option>
						<option value="van" >En camioneta</option>
						<option value="truck">En camión</option>
					</select>
					<div :class="validation.vehicle.class">{{validation.vehicle.message}}</div>
				</div>
		</fieldset>
		<br>
		<div class="form-row">
			<div class="form-group col-md-2" >
				<button type="submit" class="btn btn-primary"  @click="startEditingProfile" v-show="!isEditingProfile">Editar</button>
				<button type="submit" class="btn btn-primary"  @click="updateProfile"  v-show="isEditingProfile">Guardar</button> 
			 	<div :class="validation.result.class">{{validation.result.message}}</div>		
		 	</div>
			<div class="form-group col-md-2" v-show="isEditingProfile">
				<button type="submit" class="btn btn-danger"  @click="stopEditingProfile">Cancelar</button>
			</div>
		</div>
	</form>
	<br><br>
	<change-password></change-password>
</div>
`
});

