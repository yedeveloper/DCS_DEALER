var dtable;
$(document).ready(function() {
	verPaque();
	
	$("#cancel").click(function() {
		window.location="venta_dir_sim.html";
	});
	
	$("#frmV").submit(function(event) {
		event.preventDefault();
		DevPed();
		$("#resultado2").hide();
		$("#resultado3").hide();
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

function verPaque(){
	
	$.post('http://prueba.movilbox.net:88/movistar/yeapp/venta_directa_sim/controlador.php',
		{
			accion: 'CargarDatosPaque'
			
		},
		function(data, textStatus) {
			if(data != 0 || data != "")
			{	
				var datos = JSON.parse(data);
				var paquete = "";
				if(datos != ""){
					paquete += '<option value="" >Seleccionar..</option>';
					$.each(datos,function(index, fila) {
						var paque = "Paquete Nro "+fila.paquete;
						if(fila.paquete == 0){
							paque = "Sin paquete";
						}
						paquete += '<option value="'+fila.paquete+","+fila.bd+'">'+paque+'</option>';
					});
					$("#paque").html(paquete).change();
					$('select').material_select();
					$("#paque").change(function() {
						
						$("#enVenta").hide();
						verRefe();
						
					});
				}
				
			}
		}
	);
}

function verRefe(){
	
	var paque = $("#paque").val();
	var orBd = paque.split(",");
	
	if(paque == ""){
		$("#refer").hide();
		$("#serie").hide();
	}else{
		$.post('http://prueba.movilbox.net:88/movistar/yeapp/venta_directa_sim/controlador.php',
				{
					accion: 'CargarDatosRefe',
					paque: paque,
					orBd: orBd[1]
				},
				function(data, textStatus) {
					if(data != 0 || data != "")
					{	
						var datos = JSON.parse(data);
						var refe = "";
						if(datos != ""){
							refe += '<option value="" >Seleccionar..</option>';
							
							$.each(datos,function(index, fila) {
								refe += '<option value="'+fila.idRefe+'">'+fila.nombre+'</option>';
							});
							$("#refe").html(refe).change();
							$('select').material_select();
							$("#refer").show();
							$("#refe").change(function() {
								
								$("#enVenta").hide();
								verSeries();
							});
							
						}
						
					}
				}
			);
			$("#viewRefe").fadeIn("fast");
			$("#serial").html("");
			$("#viewButtom").html('');
			$("#orBd").val(orBd[1]);
	}
	
	
}

function verSeries(){
	
	var refe = $("#refe").val();
	var paque = $("#paque").val();
	var orBd = $("#orBd").val();
	
	if(refe =="" || paque == ""){
		$("#serie").hide();
	}else{
		$.post('http://prueba.movilbox.net:88/movistar/yeapp/venta_directa_sim/controlador.php',
				{
					accion: 'CargarDatosSerie',
					refe: refe,
					paque: paque,
					orBd: orBd
					
				},
				function(data, textStatus) {
					if(data != 0 || data != "")
					{	
						var datos = JSON.parse(data);
						var serial = "";
						if(datos != ""){
							serial += '<option value="" >Seleccionar..</option>';
							
							$.each(datos,function(index, fila) {
								serial += '<option value="'+fila.serial+'">'+fila.serial+'</option>';
							});
							$("#serial").html(serial).change();
							$('select').material_select();
							$("#serie").show();
							$("#serial").change(function() {
								viewB();
							});
						}
						
					}
				}
			);
			$("#viewUni").fadeIn("fast");
	}
	
	
}

function viewB(){
	// $("#viewButtom").html('<button type="buttom" name="enVenta" id="enVenta" class="btn btn-primary">Enviar</button>');
	 $("#enVenta").show();
	 $("#enVenta").click(function() {
		
		var refe = $("#refe").val();
		var paque = $("#paque").val();
		var serial = $("#serial").val();
		var orBd = $("#orBd").val();
		
		if(refe ==""){
			notif({
				type: "error",
				msg: 'El campo referencia es obligatorio',
				position: "center",
				width: 400,
				height: 60,
				autohide: true
			});	
		}else if(paque ==""){
			notif({
				type: "error",
				msg: 'El campo paquete es obligatorio',
				position: "center",
				width: 400,
				height: 60,
				autohide: true
			});	
		}else if(serial ==""){
			notif({
				type: "error",
				msg: 'El campo serial es obligatorio',
				position: "center",
				width: 400,
				height: 60,
				autohide: true
			});	
		}else{
		 	
			$.post('http://prueba.movilbox.net:88/movistar/yeapp/venta_directa_sim/controlador.php',
				{
					accion: 'confirmData',
					refe: refe,
					paque: paque,
					serial: serial,
					orBd: orBd
					
				},
				function(data, textStatus) {
					if(data != 0 || data != "")
					{	
						var datos = JSON.parse(data);
						
						if(datos["res"] == 1){
							$("#txt").html(datos["msg"]);
							$('#modalcf').openModal();
							$("#cf_vt").unbind("click");
							$("#cf_vt").click(function(){
								enviV();
								$('#modalcf').closeModal();
							});
						
						}else{
							notif({
								type: "error",
								msg: datos["msg"],
								position: "center",
								width: 400,
								height: 60,
								autohide: true
							});	
							setTimeout('window.location="venta_dir_sim.html"',2000);
						}
						
					}
				}
			);
		}
		
	});
}

function enviV(){
	
	var refe = $("#refe").val();
	var paque = $("#paque").val();
	var serial = $("#serial").val();
	var orBd = $("#orBd").val();
	
	$.post('http://prueba.movilbox.net:88/movistar/yeapp/venta_directa_sim/controlador.php',
		{
			accion: 'EnviV',
			refe: refe,
			paque: paque,
			serial: serial,
			orBd: orBd
			
		},
		function(data, textStatus) {
			if(data != 0 || data != "")
			{	
				var datos = JSON.parse(data);
				
				if(datos["res"] == 1){
					$("#txtfv").html("");
					$("#txtfv").html(datos["msg"]);
					$("#cl_fvmod").hide();
					$('#modalfv').openModal();
					$("#cf_fvt").unbind("click");
					$("#cf_fvt").click(function(){
						$('#modalfv').closeModal();
						window.location="venta_dir_sim.html";
					});
					
				}else{
					notif({
						type: "error",
						msg: datos["msg"],
						position: "center",
						width: 400,
						height: 60,
						autohide: true
					});	
					setTimeout('window.location="venta_dir_sim.html"',2000);
				}
				
			}
		}
	);
	
}