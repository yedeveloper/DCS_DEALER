var tipo_ac = 0;
$(document).ready(function() {
	upLocation();
	ExistPos();
	verMotivo();
	
	$("#frmV").submit(function( event ) {
		enviVisi()
  		event.preventDefault();
    });
	
	$("#cancel").click(function(){
		window.location = "../venta_as/venta_asesor.html";
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

function ExistPos(){
	
	$.post('http://prueba.movilbox.net:88/movistar/yeapp/marcacion_visita/controlador.php',
		{
			accion: 'ExistPos'
		},
		function(data, textStatus) {
			
			data = JSON.parse(data);
			$.each(data,function(index, fila) {
				if(fila.id == 1){
					
					$("#idPos").html(fila.id_punto);
					$("#namePos").html(fila.nombre);
					$("#pt").val(fila.id_punto);
					
				}else if(fila.id == -1){
					
					$("#tit").html('Mensaje de Sistema <hr>');
					  $("#cont").html('<br><div class="center-align"><p>No cuenta con permisos para acceder a este modulo.</p></div>');
					  $('#mod_cancel').openModal();
					  $("#foll").unbind("click");
					  $("#foll").click(function() {
						  	$('#mod_cancel').closeModal();
						  	location.href = "../venta_as/venta_asesor.html";	  
					  });
				}
			});
		
		}
	);

}

function verMotivo(){
	$.post('http://prueba.movilbox.net:88/movistar/yeapp/marcacion_visita/controlador.php',
		{
			accion: 'verMotivo'
		},
		function(data, textStatus) {
			console.log(data);
			data = JSON.parse(data);
			var motivo = "<option value=''>Selecciona un motivo...</option>";
			$.each(data,function(index, fila) {
				
				motivo += "<option value='"+fila.id+"'>"+fila.motivo+"</option>";
			
			});
			$('select').material_select('destroy');
			$("#motivo").html(motivo).change();
			$('select').material_select();
		}
	);
}

function enviVisi(){
	
	var motivo = $("#motivo").val();
	var obs = $("#obs").val();
	var pt = $("#pt").val();
	
	if(motivo==""){
		
		notif({
			type: "error",
			msg: 'El campo motivo es obligatorio',
			position: "center",
			width: 400,
			height: 60,
			autohide: true
		});	
	
	}else{
		var position;
		position = JSON.parse(localStorage.getItem('position'));
		if(!$.isEmptyObject(position))
		{
			BootstrapDialog.confirm("¿Esta seguro de guardar la visita?", function(result){
		    if(result) {	
		
				$.post('http://prueba.movilbox.net:88/movistar/yeapp/marcacion_visita/controlador.php',
					{
						accion: 'enviVisi',
						motivo: motivo,
						obs: obs,
						idpos: pt,
						position:position
					},
					function(data, textStatus) {
						data = JSON.parse(data);
						
						if(data["id"]==1){
							notif({
								type: "success",
								msg: data["msg"],
								position: "center",
								width: 400,
								height: 60,
								autohide: true
							});	
							$("#frmV")[0].reset();
							setTimeout('location.href = "../venta_as/venta_asesor.html"',2000)
						}else if(data["id"]==-1){
							notif({
								type: "error",
								msg: data["msg"],
								position: "center",
								width: 400,
								height: 60,
								autohide: true
							});
						}	
					}
				);
			}
			});
		}
		else
		{
			var cad = "No se encontraron los datos de la posición.Verifique que la localización este activa e intente nuevamente.";
			Materialize.toast(cad, 5000, 'rounded');
			setTimeout('location.href = "../venta_as/venta_asesor.html"',3000)
			/*notif({
				type: "error",
				msg: 'No se puede continuar, no se encontraron los datos de la posicion.!',
				position: "center",
				width: 400,
				height: 60,
				autohide: true
			});	*/
		}
	}

}