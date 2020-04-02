var script = document.createElement("script")
script.type = "text/javascript";

if (script.readyState){  //IE
    script.onreadystatechange = function(){
        if (script.readyState == "loaded" ||
                script.readyState == "complete"){
            script.onreadystatechange = null;
            callback();
        }
    };
} else {  //Others
    script.onload = function(){
		//
    };
}
script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDD-__W-HWHW8b7VKeACWC_t8elR6cNEfE&callback=initMap";
document.getElementsByTagName("body")[0].appendChild(script);

