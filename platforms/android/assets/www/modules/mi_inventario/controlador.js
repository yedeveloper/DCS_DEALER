var dtable;
var dtable_paqs;
var dtable_serie;
$(document).ready(function() {
	
	//Crar la tabla de las referencias y cantidades.!
	Cargar_Referencias();
	$("#Cerrar_Paquetes").click(function() {
		$("#paquetes").hide();
		$("#seriales").hide();
	});
	$("#Cerrar_Detalle").click(function () {
		$("#seriales").hide();
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

function Cargar_Referencias () { // FUNCION PARA CARGAR LOS DATOS DE LA TABLA DE REFERENCIAS.!
		if ( ! $.fn.DataTable.isDataTable( '#t_referencias' ) ) {
		
		 dtable = $("#t_referencias").DataTable({
			"ajax": {
				"url": "http://prueba.movilbox.net:88/movistar/yeapp/mi_inventario/controlador.php",
				"type": "POST",
				"deferRender": false,
				"data":{accion:'Cargar_Referencias'}
			},
			  "bFilter": false,
			  "responsive": true,
			  "columns": [
			    { "data": "producto"},
				{ "data": "cantidad"},
				{ "data": "idrefe"}
				],
				"columnDefs": [
				{
					"targets": 2,
					"data": "idrefe",
					 render: function ( data, type, row ) {
						 return '<span data-tipo="'+row['tipo']+'" class="ver_paquetes"><i class="small material-icons blueicon asig">add_circle_outline</i></span>';
						//return '<button class="btn btn-primary ver_paquetes" data-tipo="'+row['tipo']+'"><i class="glyphicon glyphicon-plus-sign"></i></button>';     
					 }
				}],
			
			fnDrawCallback: function () {
				$(".ver_paquetes").unbind("click");
				$(".ver_paquetes").click(function () {
					var data = dtable.row($(this).parents('tr')).data();
					Cargar_Detalles(data);
				});
			}
		 });
	
	}
	else{
		dtable.destroy();
		Cargar_Referencias();
	}
	
}

function Cargar_Detalles(datos) {
	if ( ! $.fn.DataTable.isDataTable( '#t_paquetes' ) ) {
		 dtable_paqs = $("#t_paquetes").DataTable({
			"ajax": {
				"url": "http://prueba.movilbox.net:88/movistar/yeapp/mi_inventario/controlador.php",
				"type": "POST",
				"deferRender": false,
				"data":{accion:'Cargar_Paquetes',datos:datos}
			},
			  "bFilter": false,
			  "responsive": true,
			  "columns": [
			    { "data": "paquete"},
				{ "data": "cantidad"},
				{ "data": "paquete"}
				],
				"columnDefs": [
				{
					"targets": 2,
					"data": "paquete",
					 render: function ( data, type, row ) {
						 return '<span data-tipo="'+row['tipo']+'" class="ver_seriales"><i class="small material-icons blueicon asig">add_circle_outline</i></span>';
						//return '<button class="btn btn-primary ver_seriales" data-tipo="'+row['tipo']+'"><i class="glyphicon glyphicon-plus-sign"></i></button>';     
					 }
				}],
			
			fnDrawCallback: function () {
				$(".ver_seriales").unbind("click");
				$(".ver_seriales").click(function () {
					var data = dtable_paqs.row($(this).parents('tr')).data();
					Cargar_Seriales(data);
				});
			}
		 });
	
	}
	else{
		dtable_paqs.destroy();
		Cargar_Detalles(datos);
	}
	
	$("#paquetes").show();
	$("#seriales").hide();
}

function Cargar_Seriales (datos) {
	console.log(datos);
		if ( ! $.fn.DataTable.isDataTable( '#t_seriales' ) ) {
		 dtable_serie = $("#t_seriales").DataTable({
			"ajax": {
				"url": "http://prueba.movilbox.net:88/movistar/yeapp/mi_inventario/controlador.php",
				"type": "POST",
				"deferRender": false,
				"data":{accion:'Cargar_Seriales',datos:datos}
			},
			  "bFilter": false,
			  "responsive": true,
			  "columns": [
			    { "data": "serie"},
				{ "data": "movil"}
				]
		 });
	
	}
	else{
		dtable_serie.destroy();
		Cargar_Seriales (datos);
	}
	$("#seriales").show();
}
