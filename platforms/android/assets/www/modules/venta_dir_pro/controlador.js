var dtable;
$(document).ready(function() {
	$('select').material_select();
	verRefe();
	
	$("#cancel").click(function() {
		window.location="venta_dir_pro.html";
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

function verRefe(){
	
	$.post('http://prueba.movilbox.net:88/movistar/yeapp/venta_directa_pro/controlador.php',
		{
			accion: 'CargarDatosRefe'
		},
		function(data, textStatus) {
			if(data != 0 || data != "")
			{	
				var datos = JSON.parse(data);
				var refe = "";
				if(datos != ""){
					refe += '<option value="" >Seleccione referencia...</option>';
					
					$.each(datos,function(index, fila) {
						
						refe += '<option value="'+fila.idRefe+','+fila.bd+'">'+fila.nombre+'</option>';
					});
					$("#refe").html(refe).change();
					$('select').material_select();
					$("#refe").change(function() {
						if($(this).val() != ""){
							$("#cancel").show();
						}
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

function verSeries(){
	
	var refe = $("#refe").val();
	var orBd = refe.split(",");
	
	$.post('http://prueba.movilbox.net:88/movistar/yeapp/venta_directa_pro/controlador.php',
		{
			accion: 'CargarDatosSerie',
			refe: refe,
			orBd: orBd[1]
			
		},
		function(data, textStatus) {
			if(data != 0 || data != "")
			{	
				var datos = JSON.parse(data);
				var serial = "";
				if(datos != ""){
					serial += '<option value="" >Seleccione imei...</option>';
					
					$.each(datos,function(index, fila) {
						serial += '<option value="'+fila.serial+'">'+fila.serial+'</option>';
					});
					$("#serial").html(serial).change();
					$('select').material_select();
					$("#serial").change(function() {
						viewB();
					});
				}
				
			}
		}
	);
	$("#viewUni").fadeIn("fast");
	$("#orBd").val(orBd[1]);
}

function viewB(){
	 //$("#viewButtom").html('<button type="buttom" name="enVenta" id="enVenta" class="btn btn-primary">Enviar</button>');
	$("#enVenta").show();
	 $("#enVenta").click(function() {
		 
		var refe = $("#refe").val();
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
		}else if(serial ==""){
			notif({
				type: "error",
				msg: 'El campo imei es obligatorio',
				position: "center",
				width: 400,
				height: 60,
				autohide: true
			});
		}else{
		 	
			$.post('http://prueba.movilbox.net:88/movistar/yeapp/venta_directa_pro/controlador.php',
				{
					accion: 'confirmData',
					refe: refe,
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
							setTimeout('window.location="venta_dir_pro.html"',2000);
						}
						
					}
				}
			);
		}
			
	});
}

function enviV(){
	
	var refe = $("#refe").val();
	var serial = $("#serial").val();
	var orBd = $("#orBd").val();
	
		
	$.post('http://prueba.movilbox.net:88/movistar/yeapp/venta_directa_pro/controlador.php',
		{
			accion: 'EnviV',
			refe: refe,
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
						window.location="venta_dir_pro.html";
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
					setTimeout('window.location="venta_dir_pro.html"',2000);
				}
				
			}
		}
	);
}