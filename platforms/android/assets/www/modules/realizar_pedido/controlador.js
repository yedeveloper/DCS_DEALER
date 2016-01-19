var dtable;
var tipo_crud = 0;
var dir = new Array();

$(document).ready(function() {
	
	Validate_Ped_Pen();
	
	$("#save_cant").click(function() {
		validate();
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

function Validate_Ped_Pen(){
	
	$.post('http://prueba.movilbox.net:88/movistar/yeapp/realizar_pedido/controlador.php',
        {
            accion: 'Validate_Ped_Pen'
		},
		function(data, textStatus) {
			console.log(data);
			data = JSON.parse(data);
			if(data != ""){
				$.each(data, function(index, fila){
					if(fila.band == 1){
						Cargar_Ped_Pen();
						$("#consulta").hide();
						$("#save_cant").hide();
						Notificacion(fila.msg,"error");
					}
				});	
			}
			else{
				Cargar_Bodegas_Asoc();
				$("#consulta2").hide();
				$("#sub").hide();	
				$("#det_ped_pen").hide();	
			}
			
		}
	);
	
}

function Cargar_Ped_Pen(){
	
	$.post('http://prueba.movilbox.net:88/movistar/yeapp/realizar_pedido/controlador.php',
        {
            accion: 'Charge_Ped_Pen'
		},
		function(data, textStatus) {
			data = JSON.parse(data);
			$.each(data, function(index, fila){
				$("#id_ped").html(fila.id_ped);
				$("#fecha_ped").html(fila.fecha_ped);
				$("#hora_ped").html(fila.hora_ped);
				Cargar_Detalle(fila.id_ped);
			});
		}
	);
	
}

function Cargar_Detalle(id_ped) {
	
		if ( ! $.fn.DataTable.isDataTable( '#t_detalle_ped' ) ) {	
		  dtable2 = $("#t_detalle_ped").DataTable({
				"ajax": {
				"url": "http://prueba.movilbox.net:88/movistar/yeapp/realizar_pedido/controlador.php",
				"type": "POST",
				"deferRender": false,
				"data":{accion:'Cargar_Detalle',id_ped:id_ped}
			  },
			  "bFilter": false,
			  "responsive":true,
			  "columns": [
			  	{ "data": "nom_ref"},
				{ "data": "cantidad"},
				{ "data": "nom_bod"},
				
			],
			"columnDefs": [
        	],
				fnDrawCallback: function () { 
				$("#sub").unbind("click");
				$("#sub").click(function() {
					event.preventDefault();
					Cancelar_Ped_Pen(id_ped);
				});
				}
			});
	$("#consulta2").show();
		}
		else{
			dtable2.destroy();
			Cargar_Detalle(id_ped);
		}		
};

function Cancelar_Ped_Pen(id_ped){
	
		$('#mod_anu').openModal();
		  $("#fo_an").unbind("click");
		  $("#fo_an").click(function() {
			  	$('#mod_anu').closeModal();
			  	$.post('http://prueba.movilbox.net:88/movistar/yeapp/realizar_pedido/controlador.php',
						{
							accion: 'Cancelar_Ped_Pen',id_ped:id_ped
						},
						function(data, textStatus) {
							if(data == "Y"){
								notif({
									type: "success",
									msg: "El procedimiento se realizó con éxito!",
									position: "center",
									width: 400,
									height: 60,
									autohide: true
								});	
								setTimeout('location.reload()',1000);	
							}else if(data == "A"){
								notif({
									type: "error",
									msg: "El pedido ya se encuentra asignado!",
									position: "center",
									width: 400,
									height: 60,
									autohide: true
								});	
								setTimeout('location.reload()',1000);
							}else if(data == "C"){
								notif({
									type: "error",
									msg: "El pedido ya se encuentra cancelado!",
									position: "center",
									width: 400,
									height: 60,
									autohide: true
								});	
								setTimeout('location.reload()',1000);
							}
							else
							{
								notif({
									type: "error",
									msg: "No se pudo realizar el procedimiento!",
									position: "center",
									width: 400,
									height: 60,
									autohide: true
								});	
								setTimeout('location.reload()',1000);
							}	
						}
					);	  
		  });
}

function Cargar_Bodegas_Asoc() {
	
	$.post('http://prueba.movilbox.net:88/movistar/yeapp/realizar_pedido/controlador.php',
        {
            accion: 'Devolver_Id_Bodega'
		},
		function(data, textStatus) {
			datos = JSON.parse(data);
			$.each(datos,function (index, fila) {
				var tabla = $("#tabla_ejemplo").clone();
				var titulo = "<div class='card-panel pan'>";
			 	  $.each(fila,function (indes, filas) {
			 	  	 tabla.find('#t_bod').attr('id','t_bod_'+indes);
			 	  	 titulo  += "<div class='center-align blue-text text-darken-3'> BODEGA &nbsp; - &nbsp;  "+filas[0][3]+"</div>";
			 	  	 tabla.find('#t_bod_'+indes).attr('data-bodega',indes);
			 	  	 tabla.find('#t_bod_'+indes).attr('data-index',index);
			 	  });
			 	  $("#consulta").append(titulo);
			 	  $("#consulta").append(tabla);
			 	  $("#consulta").append("</div>");

			 })
			 var tabla = $("#tabla_ejemplo").remove();
			 $('.table').each(function () {
			 	var bodega = $(this).attr("data-bodega");
			 	var indice = $(this).attr("data-index");
				
		        var source = $(this).attr("id");
				$(this).dataTable({
				   bFilter: false, 
				   bInfo: false,
				   bLengthChange: false,
				   iDisplayLength: 1500,
				   bPaginate: false,
				   "responsive":true,
				   data: datos[indice][bodega],
				    fnDrawCallback: function (row) { 
						  $('input').unbind("keyup");   
				    },
				     fnRowCallback: function(nRow, aData, iDisplayIndex) {
				    	var index = iDisplayIndex;
						$('td:eq(0)',nRow).parents('tr').attr("data-referencia",aData[4]);
						$('td:eq(0)',nRow).parents('tr').attr("data-disponible",aData[1]);
						$('td:eq(0)',nRow).parents('tr').attr("data-tipobod",aData[5]);
						$('td:eq(0)',nRow).parents('tr').attr("data-tipo_ref",aData[6]);
						return nRow;
				    }
				});
		        
		    });
		}
	);

};

function validate(){
	
	var envio = new Array();
	var error = 0;
	var cont = 0;

	$("table tbody tr").each(function(){
		var valor = $(this).find("td>input").val();
		var bodega = parseInt($(this).parents("table").attr("data-bodega"));
		var referencia = parseInt($(this).attr("data-referencia"));
		var disponible = parseInt($(this).attr("data-disponible"));
		var tipo_bod = parseInt($(this).attr("data-tipobod"));
		var tipo_ref = parseInt($(this).attr("data-tipo_ref"));
		
		if(valor != ""){
			if(valor <= disponible){
				envio.push(bodega+","+referencia+","+valor+","+tipo_bod+","+tipo_ref);	
			}else{
				error = 1;	
			}	
		}else{
			cont++;	
		}
	});

	if(cont == $("table tbody tr").length){
		notif({
			type: "error",
			msg: "Debe digitar una cantidad!",
			position: "center",
			width: 400,
			height: 60,
			autohide: true
		});	
	}else{
		  $('#mod_conf').openModal();
		  $("#foll").unbind("click");
		  $("#foll").click(function() {
			  	$('#mod_conf').closeModal();
			  	if(error != 1){
					Send_Data(envio);	
				}else{
					notif({
						type: "error",
						msg: "La cantidad a enviar no puede ser mayor a la disponible",
						position: "center",
						width: 400,
						height: 60,
						autohide: true
					});		
				}	  
		  });
	}
	
}

function Send_Data(envio){
	
	$.post('http://prueba.movilbox.net:88/movistar/yeapp/realizar_pedido/controlador.php',
        {
            accion: 'Send_Data',
			envio: envio
		},
		function(data, textStatus) {
			if(data == 1){
				notif({
					type: "success",
					msg: "Se ha realizado el pedido exitosamente",
					position: "center",
					width: 400,
					height: 60,
					autohide: true
				});
				setTimeout('location.reload()',700);	
			}else{
				notif({
					type: "error",
					msg: "No se ha podido realizar el pedido",
					position: "center",
					width: 400,
					height: 60,
					autohide: true
				});	
			}
		}
	);

}




