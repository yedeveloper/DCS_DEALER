var dtable;
var tipo_crud = 0;
var dir = new Array();

$(document).ready(function() {
	
	Cargar_territorios("pto_circ","pto_ruta");
	//Cargar_Rutas_Circuitos ("pto_circ", "pto_ruta",1);
	
	$("#frm_p").submit(function(event) {
		event.preventDefault();
		var pto_idpos = $("#pto_idpos").val();
		var pto_cedu = $("#pto_cedu").val();
		var pto_name = $("#pto_name").val();
		var pto_circ = $("#pto_circ").val();
		var pto_ruta = $("#pto_ruta").val();
		Charge_points();
    });
	
});

function salir(){
	$.post('http://prueba.movilbox.net:88/movistar/yeapp/logind/close.php',
			{
			},
			function(data, textStatus) {
				location.href = "../../index.html";
			});
}

function Charge_points() {
		$("#consulta").hide();
		var pto_idpos = $("#pto_idpos").val();
		var pto_name = $("#pto_name").val();
		var pto_circ = $("#pto_circ").val();
		var pto_ruta = $("#pto_ruta").val();
		var pto_est_vis = $("#pto_est_vis").val();
		var pto_dias = $("#pto_dias").val();
		
		$("#while").show();
	 if ( ! $.fn.DataTable.isDataTable( '#t_points' ) ) {
	  dtable = $("#t_points").DataTable({
			"ajax": {
		    "url": "http://prueba.movilbox.net:88/movistar/yeapp/mi_rutero/controlador.php",
		    "type": "POST",
		    "deferRender": false,
		    "data":{
				accion:'Consultar_Puntos',
				pto_idpos: pto_idpos,
				pto_name: pto_name,
				pto_circ: pto_circ,
				pto_ruta: pto_ruta,
				pto_est_vis: pto_est_vis,
				pto_dias: pto_dias
			}
		  },
		  "bFilter": false, 
		  "responsive":true,
		  "columns": [
            { "data": "id"},
            { "data": "dir"},
			{ "data": "razon"},
            { "data": "depto"},
            { "data": "ciudad"},
			{ "data": "nom_circuito"},
            { "data": "nom_ruta"},
			{ "data": "tel"},
			{ "data": "dias"},
			{ "data": "visitado"},
			{ "data": "horavis"}
        ],
         "columnDefs": [
			{
	            "targets": 9,
	            "data": "visitado",
	             render: function ( data, type, row ) {
	             	if(data == "1"){
							 return '<i class="material-icons small greenicon">done</i>';
						}  else{
							return '<i class="material-icons small redicon">clear</i>';
						}             
	             }
	        } 
		 ],
		 initComplete: function () {
		 	$("#while").hide();
			$("#consulta").show();
         }

	  });
	}
	else{
		dtable.destroy();
		Charge_points();
	}
	 
};

function Cargar_territorios(etiquetac,etiquetar){
	 $.post('http://prueba.movilbox.net:88/movistar/yeapp/gestor_puntos/controlador.php',
	        {
	            accion: 'ver_circuitos'
			},
			function(data, textStatus) {
				data = JSON.parse(data);
				var option = "<option selected='selected' value=''>Seleccionar..</option>";
				
				if(!$.isEmptyObject(data)){
					$.each(data,function(index, fila) {
						option += "<option value='"+fila.idter+"'>"+fila.nombre+"</option>";
					
					});
					$("#"+etiquetac+"").html(option).change(function(){
					   Cargar_zonas(etiquetac,etiquetar);
					});
				}
				
				
				$("#"+etiquetac+"").html(option).change();
				$('select').material_select();
				
			});
	}


	function Cargar_zonas(etiquetac,etiquetar){
	   var idcir = 	$("#"+etiquetac+"").val(); 
	   if(idcir > 0){
	   $.post('http://prueba.movilbox.net:88/movistar/yeapp/gestor_puntos/controlador.php',
	        {
	            accion: 'ver_rutas',
				idcir:idcir
			},
			function(data, textStatus) {
				data = JSON.parse(data);
				var option = "<option selected='selected' value=''>Seleccionar..</option>";
				
				if(!$.isEmptyObject(data)){
					$.each(data,function(index, fila) {
						option += "<option value='"+fila.idcir+"'>"+fila.nombre+"</option>";
					});
				}
				$("#"+etiquetar+"").html(option).change();
				$('select').material_select();
			});
	   }
	   else{
	      var option = "<option selected='selected' value=''>Seleccionar..</option>";
		  $("#"+etiquetar+"").html(option).change();
	   }
	}


