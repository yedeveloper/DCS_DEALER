$(document).ready(function() {
	
	var GET_ = localStorage.getItem('idpos');
	if (GET_ !== null) {
		$("#punto").val(GET_);
		localStorage.removeItem('idpos');
		Consultar_Punto();
	}
	
	localStorage.removeItem('position');
	upLocation();
	//FUNCIONES DE LOS BOTONES
	    Cargar_Departamento_Ciudad ("depto_con_pt", "ciudad_con_pt");
    	Cargar_Rutas_Circuitos ('circuito_con_pt', 'ruta_con_pt',1)
	$("#btn_volver_pos").click(function() {
		$("#punto").val('');
		$("#div_consulta").show();
		$("#div_datos_punto").hide();
	});
	$("#cl_mod").click(function(){
		$('#modal1').closeModal();
		location.reload();
	});
	$("#delbtn_trans_mcoin").click(function(){
		var cad = '&nbsp;&nbsp;Pronto habilitaremos esta opción! Gracias!';
		Materialize.toast(cad, 2000, 'rounded')
	});
	$("#delbtn_venta_producto").click(function(){
		$("#acciones_venta_asesor").hide();
		$("#div_venta_sim").hide();
		$("#div_venta_producto").show()
		Cargar_Referencias_Productos();
	});
	$("#btn_consulta_ant").click(function() {
		$("#info_puntos").hide();			
		$("#consulta_report").hide();		
		$("#consulta_pt").show();
	});
	$("#btn_vender").click(function() {
		$("#div_datos_punto").hide();
		$("#acciones_venta_asesor").show();
	});

	$("#btn_venta_sim").click(function() {
		$("#acciones_venta_asesor").hide();
		$("#div_venta_sim").show();
		$("#sel_tipo_venta").show();
		$("#t_venta_sim").val("").change();
	});

	$("#btn_venta_producto").click(function() {
		$("#acciones_venta_asesor").hide();
		$("#div_venta_sim").hide();
		$("#div_venta_producto").show()
		Cargar_Referencias_Productos();
	});

	$("#btn_vistar").click(function() {
		Asignar_Visita();
	});
	
	$("#bck_bt").click(function() {
		$("#info_puntos").hide();
		$('span.value').html(0);
		$('span.thumb').css("left","0px");
		$("#frm_con_punto")[0].reset();
		$("#con_pto").show();
	});

	$("#t_venta_sim").change(function() {
		
		if($(this).val() == "1")
		{
			$("#sim_venta_paquete").show();
			$("#sim_venta_unidad").hide();
			Cargar_Datos_Venta_Paquete();
		}
		else if($(this).val() == "2")
		{
			$("#sim_venta_paquete").hide();
			$("#sim_venta_unidad").show();
			Cargar_Datos_Venta_Sim_Unidad();
		}
		else
		{
			$("#sim_venta_paquete").hide("delay");
			$("#sim_venta_unidad").hide("delay");
			$("#boton_acciones_venta_sim").hide();
			$("#boton_acciones_venta_sim_paq").hide();
			Cargar_Datos_Venta_Paquete();
		}
	});
	$("#Can_Venta_Sim_Un").click(function() {
		$("#boton_acciones_punto").hide();
		$("#sel_tipo_venta").hide();
		$("#sim_venta_paquete").hide();
		$("#sim_venta_unidad").hide();
		$("#div_venta_sim").hide();
		$("#boton_acciones_venta_sim").hide();
		$("#acciones_venta_asesor").show();
	});
	$("#Can_Venta_Sim_Paq").click(function() {
		$("#boton_acciones_punto").hide();
		$("#sel_tipo_venta").hide();
		$("#sim_venta_paquete").hide();
		$("#sim_venta_unidad").hide();
		$("#div_venta_sim").hide();
		$("#boton_acciones_venta_sim").hide();
		$("#acciones_venta_asesor").show();
	})
	$("#Can_Venta_Producto").click(function(){
		$("#acciones_venta_asesor").show();
		$("#div_venta_producto").hide();
		$("#venta_producto").hide();
	});

	$("#btn_cancelar_venta").click(function() {
		$('#modal1').openModal();
	});
	$("#can_vs").click(function(){
		$("#div_venta_sim").hide();
		$("#sim_venta_paquete").hide();
		$("#sim_venta_unidad").hide();
		$("#acciones_venta_asesor").show();
	});

	$("#btn_finaliza_venta").click(function() {
		$('#modalcf').openModal();
	});
	$("#cf_vt").click(function() {
		$('#modalcf').closeModal();
		Mostrar_Datos_ventas();
	});

	$('#t_venta_simcard tbody').on( 'click', 'tr', function () {
        $(this).toggleClass('success');
        $(this).toggleClass('ischeck');
        var chek = $(this).find('i');
        if($(this).hasClass("success"))
        {
        	$(chek).attr("class","fa fa-check-square-o");
        }
        else
        {
        	$(chek).attr("class","fa fa-square-o");
        }
    } ).css({"cursor":"pointer"});

    $('#t_venta_producto tbody').on( 'click', 'tr', function () {
        $(this).toggleClass('success');
        $(this).toggleClass('ischeck');
        var chek = $(this).find('i');
        if($(this).hasClass("success"))
        {
        	$(chek).attr("class","fa fa-check-square-o");
        }
        else
        {
        	$(chek).attr("class","fa fa-square-o");
        }
    } ).css({"cursor":"pointer"});

	//Funcion para cuando se haga el submit del form.
	$("#frmventa").submit(function(event) {
	 	event.preventDefault();
	 	Consultar_Punto();
    });

    $("#frm_con_punto").submit(function(event) {
    	event.preventDefault();
    	Consultar_Reporte_Puntos();
    })
	$("#can_co").click(function(){
		$("#div_consulta").show();
		$( "#punto" ).focus();
		$("#con_pto").hide();
	});
	$("#consulta_punto").click(function(){
		$("#div_consulta").hide();
		$("#con_pto").show();
	});
	
});
var dtable;
var pt;
var slider;

function salir(){
	$.post('http://prueba.movilbox.net:88/movistar/yeapp/logind/close.php',
			{
			},
			function(data, textStatus) {
				location.href = "../../index.html";
			});
}


function Consultar_Reporte_Puntos() {
	
	var pt_name = $("#nombre_con_pt").val();
	var pt_nit = $("#nit_con_pt").val();
	var pt_respon = $("#res_con_pt").val();
	var pt_depto = $("#depto_con_pt").val();
	var pt_ciudad = $("#ciudad_con_pt").val();
	var pt_territorio = $("#circuito_con_pt").val();
	var pt_zona = $("#ruta_con_pt").val();
	var pt_metros = $("#pt_cerca").val();
	var datos_lnlg = JSON.parse(localStorage.getItem('position'));
	if(pt_name == "" && pt_nit == "" && pt_respon == "" && pt_depto == "" && pt_ciudad == "" && pt_territorio == ""
		&& pt_zona == "" && pt_metros == 0)
	{
		notif({
			type: "error",
			msg: 'Por favor ingrese los datos para la consulta',
			position: "center",
			width: 400,
			height: 60,
			autohide: true
		});	
	}
	else{
		
	if(datos_lnlg == null){
		var cad = "No se encontraron los datos de la posición. &nbsp; Verifique que la ubicación este activa.";
		Materialize.toast(cad, 3000, 'rounded')
		setTimeout('location.reload()',3000);
	}else{
		var lat = datos_lnlg[0]['lat'];
		var lon = datos_lnlg[0]['lng'];
		
		if ( ! $.fn.DataTable.isDataTable( '#t_report_puntos' ) ) {
			  dtable = $("#t_report_puntos").DataTable({
					"ajax": {
				    "url": "http://prueba.movilbox.net:88/movistar/yeapp/ventas_as/controlador.php",
				    "type": "POST",
				    "deferRender": false,
				    "data":{accion:'Consulta_Reporte_Pt',
				    		pt_name: pt_name,
							pt_nit: pt_nit,
							pt_respon: pt_respon,
							pt_depto: pt_depto,
							pt_ciudad: pt_ciudad,
							pt_territorio: pt_territorio, 
							pt_zona: pt_zona,
							pt_metros: pt_metros,
							lat:lat,
							lon:lon
				    	  }
				  },
				  "bFilter": false, "responsive":true,
				  "columns": [
		            { "data": "idpos"},
		            { "data": "razon"},
		            { "data": "idpos"}
		        ],
		         "columnDefs": [
		        	 	{
			            	"targets": 2,
			            	"data": "idpos",
			            	 render: function ( data, type, row ) {
			            		 return '<i class="small material-icons blueicon asig">input</i>';
			       		 }
			    	}],
			        fnDrawCallback: function () { 
						$('.asig').unbind("click");
			            $('.asig').click(function () {
			            	var data = dtable.row( $(this).parents('tr') ).data();
			           		$("input#punto").val(data['idpos']);
			           		$("#info_puntos").hide();
			           		$("#frmventa").submit();
						});
			        },
			        initComplete: function () {
			        	$("#info_puntos").show();			
			        	//$("#consulta_report").show();		
			        	$("#con_pto").hide();
			         }
				});
			}
			else{
				dtable.destroy();
				Consultar_Reporte_Puntos();
			}
		}	
	}
		
}

function Asignar_Visita() {
	$.post('http://prueba.movilbox.net:88/movistar/yeapp/ventas_as/controlador.php',
		{
			accion: 'Asignar_Visita',
			idpos: pt
		},					
		function(data, textStatus) {
		  data = JSON.parse(data);
		  if(data["estado"]==1){
			window.location = "../marca_visita/marca_visita.html";
		  }
		  else if(data["estado"]==0){
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

function Consultar_Punto() {
	var idpos = $("#punto").val();
	if(idpos != ""){
		$.post('http://prueba.movilbox.net:88/movistar/yeapp/ventas_as/controlador.php',
				{
					accion: 'Consultar_Punto',
					idpos: idpos
				},					
				function(data, textStatus) {
				  data = JSON.parse(data);
				  if(data["estado"]==1){
					$("#div_consulta").hide();
					$("#div_datos_punto").show();
					pt = data['id_pos'];
					$("#btn_vistar").show();
					$("#n_idpos").html(data['id_pos']);
					$("#n_razon_social").html(data['razon_social']);
					$("#cir_punto").html(data['territorio']);
					$("#ruta_punto").html(data['zona']);
					$("#dir_punto").html(data['direccion']);
				  }
				  else if(data['estado'] == 2){
				  	$("#div_consulta").hide();
					$("#div_datos_punto").show();
					pt = data['id_pos'];
					$("#n_idpos").html(data['id_pos']);
					$("#btn_vistar").hide();
					$("#n_razon_social").html(data['razon_social']);
					$("#cir_punto").html(data['territorio']);
					$("#ruta_punto").html(data['zona']);
					$("#dir_punto").html(data['direccion']);
				  }
				  else if(data["estado"]==0){
					  notif({
							type: "error",
							msg: data["msg"],
							position: "center",
							width: 400,
							height: 60,
							autohide: true
						});	
					  setTimeout('location.reload()',2000);
					$("input#punto").val("");
				 }
			   }
			);
	}else{
		notif({
			type: "error",
			msg: "Debe digitar un IDPOS para la búsqueda",
			position: "center",
			width: 400,
			height: 60,
			autohide: true
		});	
	}
	
}

function Cargar_Datos_Venta_Sim_Unidad() {
	
	$.post('http://prueba.movilbox.net:88/movistar/yeapp/ventas_as/controlador.php',
		{
			accion: 'Consultar_Referencias',tipo:0
		},					
		function(data, textStatus) {
		  if(data != "")
		  {
		  	data = JSON.parse(data);

		  	var html_paquete = "<option value=''>Seleccionar</option>";
		  	
		  		$.each(data['paquetes'],function(index,fila) {
		  			if(fila.paquete == 0)
		  			{
		  				html_paquete += "<option value='"+fila.paquete+"'>Sin Paquete </option>";
		  			}
		  			else
		  			{
		  				html_paquete += "<option value='"+fila.paquete+"'>Paquete -- ("+fila.paquete+")</option>";
		  			}
		  		});
		  		$("#t_venta_sim_sel_paquete").html(html_paquete).change();
				$('select').material_select();
		  		$("#t_venta_sim_sel_paquete").change(function() {
		  			$("#venta_sim_simcard").hide();
		  			var paquete = $(this).val();
		  			var html_refe = "<option value=''>Seleccionar</option>";
				  	$.each(data['referencias'],function(index,fila) {
				  		if(fila.paquete == paquete)
				  		{
				  			html_refe += "<option value='"+fila.id_refe+"'>"+fila.producto+" -- ("+fila.cantidad+")</option>";
				  		}
				  	});
				  	$("#t_venta_sim_sel_referencia").html(html_refe).change();
					$('select').material_select();
				  	$("#t_venta_sim_sel_referencia").unbind("change");
				  	$("#t_venta_sim_sel_referencia").change(function() {
				  		$("#venta_sim_simcard").hide();
				  		var referencia = $(this).val();
				  		Consultar_Sims_Paquete_Referencia(referencia,paquete);
				  	})
		  		});
				
		  }
  
	   }
	);
}

function Cargar_Datos_Venta_Paquete() {
	$.post('http://prueba.movilbox.net:88/movistar/yeapp/ventas_as/controlador.php',
		{
			accion: 'Consultar_Referencias',tipo:1
		},					
		function(data, textStatus) {
		  if(data != "")
		  {
		  	data = JSON.parse(data);

		  	var html_paquete = "<option value=''>Seleccionar</option>";
		  	
		  		$.each(data['paquetes'],function(index,fila) {
		  			if(fila.paquete == 0)
		  			{
		  				html_paquete += "<option value='"+fila.paquete+"'>Sin Paquete </option>";
		  			}
		  			else
		  			{
		  				html_paquete += "<option value='"+fila.paquete+"'>Paquete -- ("+fila.paquete+")</option>";
		  			}
		  		});
		  		$("#t_venta_paq_sel_paquete").html(html_paquete).change();
		  		$('select').material_select();
		  		$("#t_venta_paq_sel_paquete").change(function() {
		  			$("#venta_sim_simcard").hide();
		  			var paquete = $(this).val();
		  			var html_refe = "<table class='striped centered'><thead><tr><th>Referencia</th><th>Cantidad</th></tr></thead><tbody>";
				  	$.each(data['referencias'],function(index,fila) {
				  		if(fila.paquete == paquete)
				  		{
				  			html_refe += "<tr><td>"+fila.producto+"</td><td>"+fila.cantidad+"</<td><tr>";
				  		}
				  	});
				  	html_refe += "</tbody></table><br>";
				  	$("#t_venta_simcard_paquete tbody").html(html_refe);
				  	$("#venta_sim_simcard_paquete").show();
		  			$("#t_venta_simcard_paquete").show();
		  			$("#Enviar_Venta_Sim_Paq").unbind("click");
		  			$("#Enviar_Venta_Sim_Paq").click(function() {
		  				if($("#t_venta_paq_sel_paquete").val() != "")
		  				{
		  					$("#titu").html('');
			  				  $("#cont").html('<br><div class="center-align"><h5>¿Desea guardar la venta del paquete?</h5></div>');
			  				  $('#modal_v').openModal();
			  				  $("#sv_vt").unbind("click");
			  				  $("#sv_vt").click(function() {
			  					  	$('#modal_v').closeModal();
			  					  	Guardar_Venta_Paquete(paquete);	  
			  				  });
		  				}
		  				else
		  				{
		  					notif({
								type: "error",
								msg: "Por favor seleccione un paquete",
								position: "center",
								width: 400,
								height: 60,
								autohide: true
							});	
		  				}
		  			})
		  		});
		  }
  
	   }
	);
}

function Consultar_Sims_Paquete_Referencia(referencia,paquete) {
	    $("#t_venta_simcard").hide();
		$.post('http://prueba.movilbox.net:88/movistar/yeapp/ventas_as/controlador.php',
		{
			accion: 'Consultar_Sims_Paquete_Referencia',
			referencia: referencia,
			paquete: paquete
		},					
		function(data, textStatus) {
		  if(data != "")
		  {
		  	data = JSON.parse(data);
		  	var html_tabla = "";
		  	$.each(data,function(index,fila) {
		  		html_tabla += "<tr tp_it='"+fila.tipo_bodega+"' sim='"+fila.serie+"'><td align='center'><input type='checkbox' id='test_"+fila.serie+"' name='vt_sim[]' value='"+fila.tipo_bodega+","+fila.serie+"' /><label for='test_"+fila.serie+"'></label></td><td>"+fila.serie+"</td></tr>";
		  	});
		  	$("#t_venta_simcard tbody").html(html_tabla);
		  	if(referencia != "" && paquete != "")
		  	{
		  		$("#t_venta_simcard").show();
		  		$("#venta_sim_simcard").show();
		  	}
		  	$("#Enviar_Venta_Sim_Un").unbind("click");
		  	$("#Enviar_Venta_Sim_Un").click(function() {
		  		var sims = Simcards_Seleccionadas();
		  		if(sims.length > 0 )
		  		{
					Datos_Venta_Sim(referencia,paquete);
		  		}
		  		else
		  		{
					notif({
						type: "warning",
						msg: "Por favor seleccione la(s) Simcard(s) a vender",
						position: "center",
						width: 400,
						height: 60,
						autohide: true
					});	
		  		}
		  		
		  	})
		  	
		  }
	   }
	);
}
function Simcards_Seleccionadas() {
	var resu = [];
	$('input[name="vt_sim[]"]:checked').each(function() {
		var res = $(this).val();
		res = res.split(",");
		resu.push({"sim":res[1],"t_i":res[0]});
	});
	return resu;
}

function Producto_Seleccionadas() {
	var resu = [];
	$('input[name="vt_pro[]"]:checked').each(function() {
		var res = $(this).val();
		res = res.split(",");
		resu.push({"prod":res[1],"t_i":res[0]});
	});
	return resu;
}

function format (n,c, d, t){
    c = isNaN(c = Math.abs(c)) ? 2 : c, 
    d = d == undefined ? "." : d, 
    t = t == undefined ? "," : t, 
    s = n < 0 ? "-" : "", 
    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 };

function Datos_Venta_Sim(referencia,paquete)
{
	var sims = Simcards_Seleccionadas();
	if(sims.length > 0 )
	{
	   $.post('http://prueba.movilbox.net:88/movistar/yeapp/ventas_as/controlador.php',
			{
				accion: 'Datos_Venta_Sim',
				pt: pt,
				referencia: referencia
			},					
			function(data, textStatus) {
			  data = JSON.parse(data);
			  var Precio_venta = 0;
			  for (var i = 0; i < sims.length; i++) {
			  	Precio_venta += parseInt(data['valor_referencia']);
			  }
			  if(Precio_venta > 0)
			  {
				  $("#titu").html('INFORMACION DE LA VENTA <hr>');
				  $("#cont").html('<br><div class="center-align"><h5>Total a Pagar: '+format(Precio_venta)+'</h5></div>');
				  $('#modal_v').openModal();
				  $("#sv_vt").unbind("click");
				  $("#sv_vt").click(function() {
					  	$('#modal_v').closeModal();
						Guardar_Venta_Sim (referencia,paquete);	  
				  });
			  }
			  
		   }
		);
    }
    else
    {
	   notif({
			type: "warning",
			msg: "Por favor seleccione la(s) Simcard(s) a vender",
			position: "center",
			width: 400,
			height: 60,
			autohide: true
		});	
    }
}
function Guardar_Venta_Sim (referencia,paquete) {
	var sims = Simcards_Seleccionadas();
	if(sims.length > 0 )
	{
	   $.post('http://prueba.movilbox.net:88/movistar/yeapp/ventas_as/controlador.php',
			{
				accion: 'Guardar_Venta_Sim',
				pt: pt,
				sims: sims,
				referencia: referencia,
				paquete:paquete
			},					
			function(data, textStatus) {
				
			 data = JSON.parse(data);
			 if(data['idres'] == 1)
			 {
				 datal = JSON.parse(data["lista_v"]);
				 ht_tb = '<div class="center-align">'+data['msg']+'<br><table id="tabla_carro" class="responsive-table striped centered"><thead><th>Referencia</th><th>Serial</th><th>Paquete</th><th>Valor</th></thead>';
				 $.each(datal, function(index,fila){
						ht_tb += "<tr><td>"+fila.refe+"</td><td>"+fila.serie+"</td><td>"+fila.paq+"</td><td>"+fila.precio+"</td></tr>"; 
				 });
				 ht_tb += "</table></div>";
				 $("#titu_d").html('INFORMACION VENTA <hr>');
				  $("#cont_d").html(ht_tb);
				  $('#modal_v_detail').openModal();
				  $("#ct_vt").unbind("click");
				  $("#ct_vt").click(function() {
						$('#modal_v_detail').closeModal();
						
						$("#sim_venta_unidad").hide();
						$("#div_venta_sim").hide();
						$("#acciones_venta_asesor").show(); 
				  });
			 }else{
				 notif({
						type: "error",
						msg: data['msg'],
						position: "center",
						width: 400,
						height: 60,
						autohide: true
					});	
			  }
		   }
		);
    }
    else
    {
	   notif({
			type: "warning",
			msg: "Por favor seleccione la(s) Simcard(s) a vender",
			position: "center",
			width: 400,
			height: 60,
			autohide: true
		});	
    }
}

function Guardar_Venta_Paquete(paquete)
{
	if(paquete != "")
	{
		$.post('http://prueba.movilbox.net:88/movistar/yeapp/ventas_as/controlador.php',
			{
				accion: 'Guardar_Venta_Paquete',
				pt: pt,
				paquete:paquete
			},					
			function(data, textStatus) {
			  data = JSON.parse(data);
			  if(data['idres'] == 1)
			  {
				  
				  datal = JSON.parse(data["lista_v"]);
				 ht_tb = '<div class="center-align">'+data['msg']+'<br><table id="tabla_carro" class="responsive-table striped centered"><thead><th>Referencia</th><th>Serial</th><th>Paquete</th><th>Valor</th></thead>';
				 $.each(datal, function(index,fila){
						ht_tb += "<tr><td>"+fila.refe+"</td><td>"+fila.serie+"</td><td>"+fila.paq+"</td><td>"+fila.precio+"</td></tr>"; 
				 });
				 ht_tb += "</table></div>";
				 $("#titu_d").html('INFORMACION VENTA <hr>');
				  $("#cont_d").html(ht_tb);
				  $('#modal_v_detail').openModal();
				  $("#ct_vt").unbind("click");
				  $("#ct_vt").click(function() {
					  clear();
						$('#modal_v_detail').closeModal();
						$("#sim_venta_paquete").hide();
						$("#div_venta_sim").hide();
						$("#acciones_venta_asesor").show(); 
				  });
			  }
			  else 
			  {
				  notif({
						type: "error",
						msg: data['msg'],
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

function clear(){
	$("#t_venta_sim").val('').change();
	$("#t_venta_paq_sel_paquete").val('').change();
	$("#t_venta_sim_sel_paquete").val('').change();
	$("#t_venta_sim_sel_referencia").val('').change();
}

function Cargar_Referencias_Productos(){
	$.post('http://prueba.movilbox.net:88/movistar/yeapp/ventas_as/controlador.php',
		{
			accion: 'Consultar_Referencias_Producto'
		},					
		function(data, textStatus) {
		  if(data != "")
		  {
		  	data = JSON.parse(data);

		  	var html_refes = "<option value=''>Seleccionar</option>";
		  	
		  		$.each(data,function(index,fila) {
		  			html_refes += "<option value='"+fila.id_refe+"'>"+fila.producto+" -- ("+fila.cantidad+")</option>";
		  		});
		  		$("#select_referencia_producto").html(html_refes).change();
		  		$('select').material_select();
		  		$("#select_referencia_producto").unbind("change");
		  		$("#select_referencia_producto").change(function() {
		  			if($(this).val() != "")
		  			{
		  				$("#venta_producto").show();
		  				Cargar_Productos_Tabla($(this).val());
		  			}
		  			else
		  			{
		  				$("#venta_producto").hide();
		  			}
		  		});

		  		$("#Enviar_Venta_Producto").unbind("click");
		  		$("#Enviar_Venta_Producto").click(function() {
		  			
		  			$("#titu").html('');
					  $("#cont").html('<br><div class="center-align"><h5>¿Desea Guardar la Venta de Productos?</h5></div>');
					  $('#modal_v').openModal();
					  $("#sv_vt").unbind("click");
					  $("#sv_vt").click(function() {
						  	var refe = $("#select_referencia_producto").val();
				   	    	var datos = Producto_Seleccionadas();
						  	$('#modal_v').closeModal();
						  	if(datos.length > 0)
				   	    	{
				   	    		Guardar_Venta_Producto(refe);
				   	    	}
				   	    	else
				   	    	{
				   	    		notif({
									type: "error",
									msg: "Por favor seleccione los productos a agregar a la venta",
									position: "center",
									width: 400,
									height: 60,
									autohide: true
								});	
				   	    	}
					  });
		  		});
		  }
	   }
	);
}

function Cargar_Productos_Tabla (referencia) {
	$("#t_venta_producto").hide();
	$.post('http://prueba.movilbox.net:88/movistar/yeapp/ventas_as/controlador.php',
		{
			accion: 'Cargar_Productos_Tabla',
			referencia: referencia
		},					
		function(data, textStatus) {
		  if(data != "")
		  {
		  	data = JSON.parse(data);
		  	var html_tabla = "";
		  	$.each(data,function(index,fila) {
		  		html_tabla += "<tr tp_it='"+fila.tipo_bodega+"' prod='"+fila.serie+"'><td align='center'><input type='checkbox' id='test_pro_"+fila.serie+"' name='vt_pro[]' value='"+fila.tipo_bodega+","+fila.serie+"' /><label for='test_pro_"+fila.serie+"'></label></td><td>"+fila.serie+"</td></tr>";
		  		//html_tabla += "<tr tp_it='"+fila.tipo_bodega+"' prod='"+fila.serie+"'><td><i class='fa fa-square-o'></i></td><td>"+fila.serie+"</td></tr>";
		  	});
		  	$("#t_venta_producto tbody").html(html_tabla);
		  	if(referencia != "")
		  	{
		  		$("#t_venta_producto").show();
		  	}
		  }
	   }
	);
}

function Guardar_Venta_Producto(referencia) {
  var datos = Producto_Seleccionadas();
	if(datos.length > 0)
	{
		$.post('http://prueba.movilbox.net:88/movistar/yeapp/ventas_as/controlador.php',
		{
			accion: 'Guardar_Venta_Producto',
			pt:pt,
			datos: datos,
			referencia:referencia
		},					
		function(data, textStatus) {
		  data = JSON.parse(data);
			  if(data['idres'] == 1)
			  {
				  	datal = JSON.parse(data["lista_v"]);
					 ht_tb = '<div class="center-align">'+data['msg']+'<br><table id="tabla_carro" class="responsive-table striped centered"><thead><th>Referencia</th><th>Serial</th><th>Paquete</th><th>Valor</th></thead>';
					 $.each(datal, function(index,fila){
							ht_tb += "<tr><td>"+fila.refe+"</td><td>"+fila.serie+"</td><td>"+fila.paq+"</td><td>"+fila.precio+"</td></tr>"; 
					 });
					 ht_tb += "</table></div>";
				  
				  $("#titu_d").html('INFORMACION VENTA <hr>');
				  $("#cont_d").html(ht_tb);
				  $('#modal_v_detail').openModal();
				  $("#ct_vt").unbind("click");
				  $("#ct_vt").click(function() {
						$('#modal_v_detail').closeModal();
						
						$("#div_venta_producto").hide();
						$("#select_referencia_producto").val("").change();
						$("#acciones_venta_asesor").show(); 
				  });
			  }
			  else 
			  {
				  notif({
						type: "error",
						msg: data['msg'],
						position: "center",
						width: 400,
						height: 60,
						autohide: true
					});	
			  }
	   }
	);
	}
	else
	{
		notif({
			type: "error",
			msg: "Por favor seleccione los productos a agregar a la venta",
			position: "center",
			width: 400,
			height: 60,
			autohide: true
		});
	}
}
var tabla_carro;
function Mostrar_Datos_ventas() {
	var suma_valor = 0;
	$.post('http://prueba.movilbox.net:88/movistar/yeapp/ventas_as/controlador.php',
			{
				accion: 'Mostrar_Datos_Venta'
			},					
			function(data, textStatus) {
			  data = JSON.parse(data);
			  if(data['idres'] == 1)
			  {
				  suma = 0;
				  datal = JSON.parse(data["lista_v"]);
					 ht_tb = '<div class="center-align"><table id="tabla_carro" class="responsive-table striped centered"><thead><th>Referencia</th><th>Serial</th><th>Paquete</th><th>Valor</th></thead>';
					 $.each(datal, function(index,fila){
							ht_tb += "<tr><td>"+fila.refe+"</td><td>"+fila.serie+"</td><td>"+fila.paq+"</td><td>"+fila.precio+"</td></tr>"; 
							suma += parseInt(fila.precio);
					 });
					 ht_tb += "</table><br><div class='center-align'><h5>Total a pagar: $ <span id='valor_venta'>"+suma+"</span></h5></div></div>";
					 $("#tit_d").html('INFORMACION VENTA <hr>');
					  $("#con_d").html(ht_tb);
					  $('#modal_vf_detail').openModal();
					  $("#cfr_vt").unbind("click");
					  $("#cfr_vt").click(function() {
							$('#modal_vf_detail').closeModal();
							Finalizar_Venta();
					  });
			  }
			  else 
			  {
				  notif({
						type: "error",
						msg: data['msg'],
						position: "center",
						width: 400,
						height: 60,
						autohide: true
					});	
			  }
		   }
		);
}

function Finalizar_Venta() {
	var position;
	position = JSON.parse(localStorage.getItem('position'));
	if(!$.isEmptyObject(position))
	{
		$.post('http://prueba.movilbox.net:88/movistar/yeapp/ventas_as/controlador.php',
			{
				accion: 'Finalizar_Venta',
				pt:pt,
				pos:position
			},					
			function(data, textStatus) {
			  if(data != "")
			  {
			  	data = JSON.parse(data);
			  	ht_tb = "";
			  	if(data['idres'] == 1)
			  	{
			  		Precio_venta = data['valor'];
					 ht_tb += '<div><p>'+data['msg']+'</p></div><br><div class="center-align"><h5>Total a Pagar: '+format(Precio_venta)+'</h5></div>';
					 $("#tit_t").html('Venta Exitosa <hr>');
					  $("#con_t").html(ht_tb);
					  $('#modal_tot').openModal();
					  $("#cfr_tot").unbind("click");
					  $("#cfr_tot").click(function() {
							$('#modal_tot').closeModal();
							location.reload();
					  });
			  	}
			  	else
			  	{
			  		notif({
						type: "error",
						msg: data['msg'],
						position: "center",
						width: 400,
						height: 60,
						autohide: true
					});	
			  	}
			  }
		   }
		);
	}
	else
	{
		var cad = "No se encontraron los datos de la posición. &nbsp; Verifique que la ubicación este activa.";
		   Materialize.toast(cad, 3000, 'rounded');
	}
}

