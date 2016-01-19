var dtable;
var tipo_crud = 0;
var dir = new Array();

$(document).ready(function() {
	$('select').material_select();
	//Cargar_Rutas_Circuitos_Puntos ('pto_circ', 'pto_ruta')
	Cargar_territorios("pto_circ","pto_ruta");
	Cargar_Categorie();
	Cargar_Categorias("pto_est_com");
	
	$("#frm_p").submit(function(event) {
		event.preventDefault();
		var pto_idpos = $("#pto_idpos").val();
		var pto_cedu = $("#pto_cedu").val();
		var pto_name = $("#pto_name").val();
		var pto_circ = $("#pto_circ").val();
		var pto_ruta = $("#pto_ruta").val();
		
		if(pto_idpos == "" && pto_cedu == "" && pto_name == ""){
			$("#consulta").hide();	
			if(pto_circ == "" || pto_ruta == ""){
				notif({
					type: "error",
					msg: 'Debe seleccionar al menos (Circuito y Ruta).',
					position: "center",
					width: 400,
					height: 60,
					autohide: true
				});	
			}else{
				Charge_Puntos();
			}
		}else{
			Charge_Puntos();
		}
    });
	
	$("#ce_d").click(function(){
		$("#frm_crud")[0].reset();
		$("#second").hide();
		$("#first").show();
		$("#frm_p").unbind("submit");
		$("#frm_crud").unbind("submit");
		$("#bt_pto_new").unbind("click");
		$('#modalcf').css("display","none");
	});
	
	$("#bt_pto_new").click(function(){
		cargar_nomenclatura("tipo_via", "1");
		cargar_nomenclatura("otro_dir", "0");
		Cargar_Categorias("pt_category");
		//Cargar_Rutas_Circuitos_Puntos ('pt_ruta', 'pt_circ',1)
		Cargar_territorios("pt_ruta","pt_circ");
		Cargar_Departamento_Ciudad ("pt_dpto", "pt_ciudad") 
		tipo_crud = 1;
		$("#consulta").hide();
		$("#first").hide();
		$("#second").show();
		$("#submit_bt").unbind("click");
		$("#submit_bt").click(function(event) {
			event.preventDefault();
			$('#modalcf').openModal();
		});
	});
	$("#cf_vt").click(function(){
		CRUD_Puntos();
	});
	
	$("#tipo_via").change(function () {
		if($(this).val() != "")
		{
			$("#nro_via").attr("required","required");
			$("#otro_dir").removeAttr("required");
		}
		else
		{
			$("#nro_via").removeAttr("required");
			$("#otro_dir").attr("required","required");
		}
	})
	
	$("#otro_dir").change(function () {
		if($(this).val() != "")
		{
			$("#des_otro").attr("required","required");
			$("#tipo_via").removeAttr("required");
		}
		else
		{
			$("#des_otro").removeAttr("required");
			$("#tipo_via").attr("required","required");
		}
	})
});



function salir(){
	$.post('http://prueba.movilbox.net:88/movistar/yeapp/logind/close.php',
			{
			},
			function(data, textStatus) {
				location.href = "../../index.html";
			});
}

function cargar_nomenclatura(select, tipo){
	$.post('http://prueba.movilbox.net:88/movistar/yeapp/gestor_puntos/controlador.php',
        {
            accion: 'ver_nomenclaturas', tipo:tipo
		},
		function(data, textStatus) {
			
			data = JSON.parse(data);
			var option = "<option selected='selected' value=''>Seleccionar..</option>";
			$.each(data,function(index, fila) {
				option += "<option value='"+fila.id_nomen+"'>"+fila.nom_nomen+"</option>";
			
			});
			$("#"+select).html(option).change();
			$('select').material_select();
		});
}

function cargar_nomenclatura2(){
	var valor = $("#pt_nomen1").val();
	$.post('http://prueba.movilbox.net:88/movistar/yeapp/gestor_puntos/controlador.php',
        {
            accion: 'ver_nomenclaturas2',
			valor:valor
		},
		function(data, textStatus) {
			
			data = JSON.parse(data);
			var option = "<option  value=''>Seleccionar..</option>";
			$.each(data,function(index, fila) {
				option += "<option value="+fila.id_nomen+">"+fila.nom_nomen+"</option>";
			
			});
			$("#pt_nomen2").html(option);
			$('select').material_select();
		});
}


function Cargar_Categorias(id_selec){
	$.post('http://prueba.movilbox.net:88/movistar/yeapp/gestor_puntos/controlador.php',
        {
            accion: 'ver_categorias'
		},
		function(data, textStatus) {
			
			data = JSON.parse(data);
			
			var option = "<option selected='selected' value=''>Seleccionar..</option>";
			$.each(data,function(index, fila) {
				option += "<option value='"+fila.id_cat+"'>"+fila.nom_cat+"</option>";
			
			});
			$("#"+id_selec).html(option).change();
			$('select').material_select();
		});
}



function Charge_Puntos() {
	
	$("#while").show();
		var pto_idpos = $("#pto_idpos").val();
		var pto_cedu = $("#pto_cedu").val();
		var pto_name = $("#pto_name").val();
		var pto_state = $("#pto_state").val();
		var pto_circ = $("#pto_circ").val();
		var pto_ruta = $("#pto_ruta").val();
		var pto_est_com = $("#pto_est_com").val();

	if ( ! $.fn.DataTable.isDataTable( '#t_points' ) ) {
	  dtable = $("#t_points").DataTable({
			"ajax": {
		    "url": "http://prueba.movilbox.net:88/movistar/yeapp/gestor_puntos/controlador.php",
		    "type": "POST",
		    "deferRender": false,
		    "data":{accion:'Consultar_Puntos',pto_idpos: pto_idpos,pto_cedu:pto_cedu,pto_name: pto_name,pto_state:pto_state,pto_circ: pto_circ,pto_ruta:pto_ruta,pto_est_com: pto_est_com }
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
			{ "data": "est_comercial"},
			{ "data": "tel"}
        ],
         "columnDefs": [
        	{
	            "targets": 6,
	            "data": "nom_ruta",
	             render: function ( data, type, row ) {
	             	if(data == ""){
							return 'N/A';
						}  else{
							return data;	
						}             
	             }
	        }],
			 initComplete: function () {
					$("#consulta").show();
					$("#while").hide();
		    },
	        fnDrawCallback: function () { 
	        }
		});
	}
	else{
		dtable.destroy();
		Charge_Puntos();
	}			
};

function validate(){
	var id_punto = $("#pt_id").val();
	var nom1 = $("#pt_nomen1").val();
	var num1 = $("#pt_num1").val();
	var let1 = $("#pt_letra1").val();
	var nom2 = $("#pt_nomen2").val();
	var num2 = $("#pt_num2").val();
	var let2 = $("#pt_letra2").val();
	var ncasa = $("#pt_num_casa").val();	
	var dcasa = $("#pt_des_casa").val();
	var c = id_punto+","+nom1+","+num1+","+let1+","+nom2+","+num2+","+let2+","+ncasa+","+dcasa;
	var datos = c;
	
	$.post('http://prueba.movilbox.net:88/movistar/yeapp/gestor_puntos/controlador.php',
        {
            accion: 'val_all_dir',
			datos:datos
		},
		function(data, textStatus) {
			if(data == 0){
				Notificacion("La dirección ya se encuentra Registrada!","error");
			}else{	
				$("#frm_crud").submit();	
			}
		});
}

function CRUD_Puntos() {
	
	nombre = $("#pt_nombre").val();
	dni = $("#pt_dni").val();
	nombre_cli = $("#pt_name_cli").val();
	email = $("#pt_email").val();
	dpto = $("#pt_dpto").val();
	ciudad = $("#pt_ciudad").val();
	barrio = $("#pt_barrio").val();
	tel = $("#pt_tel").val();
	cel = $("#pt_cel").val();
	est_com = $("#pt_category").val();
	circ = $("#pt_ruta").val();
	ruta = $("#pt_circ").val();
	cate = $("#pt_categoria").val();
	tipo_via = $("#tipo_via").val();
	nro_via = $("#nro_via").val();
	nro_genera = $("#nro_genera").val();
	nro_placa = $("#nro_placa").val();
	
	if(nombre == "" || dni == "" || nombre_cli == "" || email == "" || dpto == "" || ciudad == "" || barrio == "" || 
			tel == "" || cel == "" || est_com == "" || circ == "" || ruta == "" || cate == "" || tipo_via == "" ){
		$('#modalcf').closeModal();
		notif({
			type: "error",
			msg: 'Debe diligenciar completamente el formulario',
			position: "center",
			width: 400,
			height: 60,
			autohide: true
		});	
	}else{
		if(nro_via == ""){
			$('#modalcf').closeModal();
			notif({
				type: "error",
				msg: 'Debe diligenciar completamente el formulario',
				position: "center",
				width: 400,
				height: 60,
				autohide: true
			});	
		}else{
			$.post('http://prueba.movilbox.net:88/movistar/yeapp/gestor_puntos/controlador.php',
			   {
				accion: 'CRUD_Puntos',
				datos: formToJSON("#frm_crud"),
				tipo : tipo_crud
			   },
				function(data, textStatus) {
				   data = JSON.parse(data);
					if(data.evento == 1){
						$('#modalcf').closeModal();
						if(tipo_crud == 1){
							$("#tit").html('<div class="center-align">Punto creado exitosamente!</div>');
							cad = "<div class='center-align'>"+nombre+"<br>IDPOS: "+data.idpos+"</div>";
							  $("#con").html(cad);
							  $('#modal_tot').openModal();
							  $("#cfr_tot").unbind("click");
							  $("#cfr_tot").click(function() {
								  $("#frm_crud")[0].reset();
									$('#modal_tot').closeModal();
									location.reload();
							  });
							  $("#re_vt").unbind("click");
							  $("#re_vt").click(function() {
								  localStorage.setItem('idpos',data.idpos);
								  var url = "../venta_as/venta_asesor.html";
								  $(location).attr('href',url);
							  });
						}else{
							notif({
								type: "success",
								msg: 'Se guardaron con exito los datos del punto',
								position: "center",
								width: 400,
								height: 60,
								autohide: true
							});	
						}				
					}
					else
					{
						notif({
							type: "error",
							msg: 'Error al intentar guardar los datos del punto',
							position: "center",
							width: 400,
							height: 60,
							autohide: true
						});
					}
												
				}
			);
		}
		
	}
}

function Cargar_Categorie() {
		$.post('http://prueba.movilbox.net:88/movistar/yeapp/gestor_puntos/controlador.php',
        {
            accion: 'retornar_categorie'
		},
		function(data, textStatus) {
			
			data = JSON.parse(data);
			
			var option = "<option selected='selected' value=''>Seleccionar..</option>";
			$.each(data,function(index, fila) {
				var sel = "";
				option += "<option value='"+fila.id+"'>"+fila.nombre+"</option>";
			
			});
			$("#pt_categoria").html(option).change();
			$('select').material_select();
			
		});
}

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
