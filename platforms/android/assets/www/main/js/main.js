$(document).ready(function() {
	
	$("input[is-data]").blur(function() {
        if($(this).val() != "")
        {
		    var opciones = $(this).attr("is-data").split(',');
		       if(validar_datox(opciones[0],opciones[1],opciones[2],$(this).val()) == false)
		       {
		    	   var especiales = "";
		    	   if(opciones[2] == 1)
		    	   {
		    		   especiales = ", además no debe contener caracteres especiales";
		    	   }
		    	   var nombre_campo = $(this).attr("data-name");
		    	   var d_error = $(this).parent().find(".error");
		    	   if(!$.contains(window.document, d_error[0]))
		    	   {
		    		   var cad = "El campo '"+ nombre_campo +"' debe tener un mínimo de "+opciones[0]+" caracteres y máximo "+opciones[1]+especiales;
		    		   Materialize.toast(cad, 5000, 'rounded')	
		    	   } 
		       } 
		 }
	});
	
	
	
});

function upLocation(){
	var watchID = navigator.geolocation.watchPosition(onSuccess, onError, { timeout: 60000 });
}
function onSuccess(position) {
	cad = 'Posicion tomada desde dentro de la App!!    Latitud: '+position.coords.latitude+"  Longitud: "+position.coords.longitude;
	$.post('http://prueba.movilbox.net:88/movistar/yeapp/otro/id_equipo.php',
			{
				id:cad
			},
			function(data, textStatus) {
				
				console.log("Hecho");
		});
	localStorage.removeItem('position');
	var array = [];
    array.push({"lat":position.coords.latitude, "lng":position.coords.longitude});
    localStorage.setItem("position",JSON.stringify(array));
    var datos_lnlg = JSON.parse(localStorage.getItem('position'));
}
function onError(error) {
	console.log('code: '    + error.code    + '\n' +
	      'message: ' + error.message + '\n');
}


function Cargar_Rutas_Circuitos (select_ruta, select_circuito,tipo) {
	  if(tipo == undefined)
	  {
	    tipo = 0;
	  }
	  $.post('http://prueba.movilbox.net:88/movistar/yeapp/funciones/controlador.php',
	          {
	              accion: 'Retornar_Rutas_Circuitos',
	              tipo:tipo
	          },
	          function(data, textStatus) {
	              if(data != 0 || data != "")
	              {
	                data = JSON.parse(data);
	                var html_ruta= "<option value=''>Seleccionar..</option>";
	                

	                $.each(data['rutas'],function(index, fila) {
	                  html_ruta += "<option value='"+fila.id+"'>"+fila.descripcion+"</option>" 
	                });
	                $("#"+select_ruta).change(function() {
	                  var html_circuito = "<option value=''>Seleccionar..</option>";
	                    var id_territorio = $(this).val();
	                    $.each(data['circuitos'],function(index, fila) {
	                      if(fila.id_territorio == id_territorio)
	                      {
	                        html_circuito += "<option value='"+fila.id+"'>"+fila.nombre+"</option>" 
	                      }
	                    });
	                    $("#"+select_circuito).html(html_circuito).change();
	                    $('select').material_select();
	                });
	                $("#"+select_ruta).html(html_ruta).change();
	                $('select').material_select();
	                
	              }
	          }
	      );
	}


function Cargar_Rutas_Circuitos_Puntos (select_ruta, select_circuito) {
	  $.post('http://prueba.movilbox.net:88/movistar/yeapp/funciones/controlador.php',
	          {
	              accion: 'Retornar_Rutas_Circuitos_Puntos'
	          },
	          function(data, textStatus) {
	              if(data != 0 || data != "")
	              {
	                data = JSON.parse(data);
	                var html_ruta= "<option value=''>SELECCIONAR</option>";
	                

	                $.each(data['rutas'],function(index, fila) {
	                  html_ruta += "<option value='"+fila.id+"'>"+fila.descripcion+"</option>" 
	                });
	                $("#"+select_ruta).change(function() {
	                  var html_circuito = "<option value=''>SELECCIONAR</option>";
	                    var id_territorio = $(this).val();
	                    $.each(data['circuitos'],function(index, fila) {
	                      if(fila.id_territorio == id_territorio)
	                      {
	                        html_circuito += "<option value='"+fila.id+"'>"+fila.nombre+"</option>" 
	                      }
	                    });
	                    $("#"+select_circuito).html(html_circuito).change();
	                    $('select').material_select();
	                });
	                
	                $("#"+select_ruta).html(html_ruta).change();
	                $('select').material_select();
	                
	              }
	          }
	      );
	}


function Cargar_Departamento_Ciudad (select_depto, select_ciudad) {
	  $.post('http://prueba.movilbox.net:88/movistar/yeapp/funciones/controlador.php',
	          {
	              accion: 'Retornar_Departamento_Ciudad'
	          },
	          function(data, textStatus) {
	              if(data != 0 || data != "")
	              {
	                data = JSON.parse(data);
	                var html_selectDepartamento= "<option value=''>Seleccionar..</option>";
	                

	                $.each(data['departamento'],function(index, fila) {
						
	                  html_selectDepartamento += "<option value='"+fila.id+"'>"+fila.nombre+"</option>" 
	                });
	                $("#"+select_depto).change(function() {
	                  var html_selectCiudad = "<option value=''>Seleccionar..</option>";
	                    var id_depto = $(this).val();
	                    $.each(data['ciudad'],function(index, fila) {
	                      if(fila.id_departamento == id_depto)
	                      {
	                        html_selectCiudad += "<option value='"+fila.id+"'>"+fila.nombre+"</option>" 
	                      }
	                    });
	                    $("#"+select_ciudad).html(html_selectCiudad).change();
	                    $('select').material_select();
	                });
	                $("#"+select_depto).html(html_selectDepartamento).change();
	                $('select').material_select();
	                
	              }
	          }
	      );
	}



function validar_datox (cmin,cmax,special,cadena) {  
	  var tamanio = 0;
	  tamanio = cadena.length;
	  
	  if(tamanio < cmin || tamanio > cmax){ 
	     return false;
	  }
	  else{
	      if(special == 1){
	        var caracteres = new Array();
	      var caracteres = [";", "'", "!", '"', "#", "$", "%", "(", ")", "*", "+", "?", "=","-",".","/","|","&",":","<",">","¡","{","}","[","]","_"];
	      
	      for(i=0;i<caracteres.length;i++){
	         if(cadena.indexOf(caracteres[i]) > -1){
	            return false;
	         }
	      }
	    }
	    else{
	       if(special == 2){
	           for(i=0;i<cadena.length;i++){  
	            if(cadena.charCodeAt(i) < 48 || cadena.charCodeAt(i) > 57)//si el codigo ASCII es el de los numeros
	          {  
	           return false;
	          }
	         }
	       }
	       else if (special == 3){
	           for(i=0;i<cadena.length;i++){  
	             cadena = cadena.toUpperCase(); 
	            if(cadena.charCodeAt(i) < 65 || cadena.charCodeAt(i) > 90)//si el codigo ASCII para solo letras
	          {  
	           return false;
	          }
	         }
	       }
	    }
	  } 
	  
	  return true; 
	}

function formToJSON( selector ){
    var form = {};
    $(selector).find(':input[name]:checked').each( function() {
      var self = $(this);
      if(self.attr('id') != undefined)
      {
        var name = self.attr('id');
         if (form[name]) {
           form[name] = form[name] + ',' + self.val();
         }
         else {
           form[name] = self.val();
         }
      }
      
   });

    var TXTinputs =$(selector).find('input[type=text],input[type=email],input[type=number],input[type=date],input[type=password],input[type=radio],input[type=hidden],select,textarea').filter(function() {
      return this.value!='-1';
    });

    TXTinputs.each( function() {
      var self = $(this);
      if(self.attr('id') != undefined)
      {
          var name = self.attr('id');
           if (form[name]) {
             form[name] = form[name] + ',' + self.val();
           }
           else {
              form[name] = self.val();
           }
     }
   });

return form;
}

function validar_numeros(evt){	 
	if(window.event){
		keynum = evt.keyCode;
	}else{
	  	keynum = evt.which;
	}
	if((keynum>47 && keynum<58) || (keynum==13) ){
		return true;
	}else{
		return false;
	}
}

$(document).ajaxSend(function(event, request, settings) {

	  $("input[is-data]").each(function() {
	     if($(this).val() != "")
	     {
	       var opciones = $(this).attr("is-data").split(',');
	   if(validar_datox(opciones[0],opciones[1],opciones[2],$(this).val()) == false)
	   {
	    var d_error = $("body").find(".appriseOverlay");
	    if(!$.contains(window.document, d_error[0]))
	    { 
	    	$('#modalcf').closeModal();
	    	notif({
				type: "error",
				msg: 'La información no es correcta. Verifique',
				position: "center",
				width: 400,
				height: 60,
				autohide: true
			});	
	    } 
	    request.abort();
	   }    
	     }
	  })
	  
});

function format (n,c, d, t){
    c = isNaN(c = Math.abs(c)) ? 2 : c, 
    d = d == undefined ? "." : d, 
    t = t == undefined ? "," : t, 
    s = n < 0 ? "-" : "", 
    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 };
 
 restaFechas = function(f1,f2)
 {
   var aFecha1 = f1.split('-'); 
   var aFecha2 = f2.split('-'); 
   var fFecha1 = Date.UTC(aFecha1[0],aFecha1[1]-1,aFecha1[2]); 
   var fFecha2 = Date.UTC(aFecha2[0],aFecha2[1]-1,aFecha2[2]); 
   var dif = fFecha2 - fFecha1;
   var dias = Math.floor(dif / (1000 * 60 * 60 * 24)); 
   return dias;
 }
 
 function get_vars(){
	    var url= location.search.replace("?", "");
	    var arrUrl = url.split("&");
	    var urlObj={};   
	    for(var i=0; i<arrUrl.length; i++){
	        var x= arrUrl[i].split("=");
	        urlObj[x[0]]=x[1];
	    }
	    return urlObj;
	}