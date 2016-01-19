$(document).ready(function() {
	$('.datepicker').pickadate({
	    selectMonths: true, 
	    selectYears: 15
	  });
	
	Cargar_territorios("circuito","ruta");
	//Cargar_Rutas_Circuitos ("circuito", "ruta",1);
	Retornar_Saldo();
	
	$("#frmVentas_vendedor").submit(function(event) {
		event.preventDefault();
		//Cargar Primera Parte del Informe.!
		Retornar_Datos_Reporte ();
	});
	$("#ruta").change(function() {
		if($(this).val() != "" && $(this).val()  != undefined)
		{
			Retornar_Puntos();
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

function Retornar_Saldo() {
	$.post('http://prueba.movilbox.net:88/movistar/yeapp/reporte_ventas_vendedor/controlador.php',
        {
            accion: 'Retornar_Saldo'
		},
		function(data, textStatus) {
			data = JSON.parse(data);
			if(!$.isEmptyObject(data))
			{
				$("#debe").css("font-weight","bold");
				$("#debe").html("$ "+format(data[0]['saldo_ventas']));
			}
		}
	);
}

function Retornar_Puntos () {
	var territorio = $("#circuito").val();
	var ruta = $("#ruta").val();
	if(territorio == undefined){territorio = ""};
	if(ruta == undefined){ruta = ""};
	$.post('http://prueba.movilbox.net:88/movistar/yeapp/reporte_ventas_vendedor/controlador.php',
        {
            accion: 'Retornar_Puntos',
            territorio:territorio,
            ruta:ruta
		},
		function(data, textStatus) {
			data = JSON.parse(data);
			var html_puntos = "<option value=''>Seleccionar..</option>"
			if(!$.isEmptyObject(data))
			{
				$.each(data,function(index, row) {
					html_puntos += "<option value='"+row.id+"'>"+row.id+"  -  "+row.descripcion+"</option>";
				});
			}
			$("#idPos").html(html_puntos).change();
			$('select').material_select();
		}
	);
}
var dtable;
function Retornar_Datos_Reporte (){
	suma_valor = 0;
	var fechaIni = $("#fechaIni").val();
	var fechaFin = $("#fechaFin").val();
	var territorio = $("#circuito").val();
	var zona = $("#ruta").val();
	var pos = $("#idPos").val();
	
	if(fechaIni == "" && fechaFin == ""){
		var d = new Date();
		var month = d.getMonth()+1;
		var day = d.getDate();
		var today = d.getFullYear() + '/' +
		    (month<10 ? '0' : '') + month + '/' +
		    (day<10 ? '0' : '') + day;
		fechaIni = today;
		fechaFin = today;
	}

	if(restaFechas(fechaIni,fechaFin) > 5 || restaFechas(fechaIni,fechaFin) < 0)
	{
		notif({
			type: "error",
			msg: 'Por favor ingrese un rango de fechas no superior a 5 días',
			position: "center",
			width: 400,
			height: 60,
			autohide: true
		});	
	}
	else
	{
		if ( ! $.fn.DataTable.isDataTable( '#t_reporte' ) ) {
			
			 dtable = $("#t_reporte").DataTable({
				 
				"ajax": {
					"url": "http://prueba.movilbox.net:88/movistar/yeapp/reporte_ventas_vendedor/controlador.php",
					"type": "POST",
					"deferRender": false,
					"data":{
						accion:'Consultar_Datos_Reporte',
						fechaIni:fechaIni,
						fechaFin:fechaFin,
						territorio:territorio,
						zona:zona,
						pos:pos
					}
				},
				 "dom": '<"top"fl>rt<"bottom"<"info_total">p><"clear">',
				  "bFilter": false,
				  "responsive": true,
				  "columns": [
					{ "data": "fecha"},
					{ "data": "cantidad"},
					{ "data": "valor"},
					{ "data": null}
					],
					"columnDefs": [{
						"targets": 3,
						"data": "",
						"class": "details-control",
						 render: function ( data, type, row ) {
							 return '<i class="material-icons small blueicon">add_circle_outline</i>';
						 }
					},{
						className: "none",
						"targets": 2
					},{
						className: "none",
						"targets": 1
					}],
					createdRow: function ( row, data, index ) {
						suma_valor += parseInt(data['cantidad'].replace(/[\$,]/g, ''));    
					 },
					 footerCallback: function ( row, data, start, end, display ) {
			            var api = this.api(), data;
			            var intVal = function ( i ) {
			                return typeof i === 'string' ?
			                    i.replace(/[\$,]/g, '')*1 :
			                    typeof i === 'number' ?
			                        i : 0;
			            };
			            total = api
			                .column( 1 )
			                .data()
			                .reduce( function (a, b) {
			                    return intVal(a) + intVal(b);
			                }, 0 );
			            pageTotal = api
			                .column( 1, { page: 'current'} )
			                .data()
			                .reduce( function (a, b) {
			                    return intVal(a) + intVal(b);
			                }, 0 );

			                //
			            totalf = api
			                .column( 2 )
			                .data()
			                .reduce( function (a, b) {
			                    return intVal(a) + intVal(b);
			                }, 0 );
			            pageTotalf = api
			                .column( 2, { page: 'current'} )
			                .data()
			                .reduce( function (a, b) {
			                    return intVal(a) + intVal(b);
			                }, 0 );

			            $( api.column( 1 ).footer() ).html(
			                pageTotal
			            );
			            $( api.column( 2 ).footer() ).html(
			                pageTotalf
			            );
			        }
			 });
		
		}
		else{
			dtable.destroy();
			Retornar_Datos_Reporte();
		}
		$("#reporte").show();
		$('#t_reporte tbody').on('click', 'td.details-control', function () {
		        var tr = $(this).closest('tr');
		        var row = dtable.row( tr );
		 
		        if ( row.child.isShown() ) {
		            // This row is already open - close it
		        	tr.find("i").html( '' );
		            tr.find("i").html( 'add_circle_outline' );
		            row.child.hide();
		        }
		        else {
		            // Open this row
		            tr.find("i").html( '' );
                    tr.find("i").html( 'remove_circle_outline' );
		            row.child("").show();
		            row.child().attr("id","d_"+row.data()['fecha']);
		            Retornar_Detalle_1(row.data(),territorio,zona,pos)
		        }
		    } );
	}
	
}


function Retornar_Detalle_1 (d,territorio,zona,pos) {
	var tabla_detalle1 = "";
	$.post('http://prueba.movilbox.net:88/movistar/yeapp/reporte_ventas_vendedor/controlador.php',
        {
            accion: 'Retornar_Detalle_1',
            fecha:d.fecha,
            territorio:territorio,
            zona:zona,
            pos:pos
		},
		function(data, textStatus) {
			data = JSON.parse(data);
			 tabla_detalle1 += '<table id="'+d.fecha+'" class="" cellspacing="0" width="100%"><thead style="background:#EAEAEA;"><tr><th>IDPOS</th><th>CANTIDAD</th><th>VALOR</th><th></th></tr></thead><tbody>';
			if(!$.isEmptyObject(data))
			{
				$.each(data,function(index, row) {
					tabla_detalle1 +="<tr>";
					tabla_detalle1 +="<td>"+row.pos+"</td><td>"+row.cantidad+"</td><td>"+row.valor+"</td>";
					tabla_detalle1 +="<td class='detalle2' data-fecha='"+d.fecha+"' data-pos='"+row.pos+"'><i class='material-icons small blueicon'>add_circle_outline</i></td>";
					tabla_detalle1 +="</tr>";
				});
			   tabla_detalle1 +="</tbody>";
			}
			tabla_detalle1 +="</table>";
			$("#d_"+d.fecha).find("td").html(tabla_detalle1);

			$("#d_"+d.fecha+ " tbody").on('click', 'td.detalle2', function () {
		        var tr = $(this).parent();
		        var pos = $(this).attr("data-pos");
		        var fecha = $(this).attr("data-fecha");
		        pos = parseInt(pos);
		        if(pos.toString() == "NaN")
				{
					pos = 0;
				}
		         var tab = $("body").find('#d_2_'+d.fecha+'_'+pos);
		        if(!$.contains(window.document, tab[0]))
        		{ 
		        	$( "<tr id='d_2_"+d.fecha+'_'+pos+"'><td colspan='4'></td></tr>" ).insertAfter($(tr));
		        	tr.find("i").html( '' );
                    tr.find("i").html( 'remove_circle_outline' );
                    Retornar_Detalle_2(fecha,pos,territorio,zona);
		    	}
		    	else
		    	{
		    		$("#d_2_"+d.fecha+'_'+pos).remove();
		    		tr.find("i").html( '' );
					tr.find("i").html( 'add_circle_outline' );
                    
		    	}
		    } );
		}
	);
    
}

function Retornar_Detalle_2(fecha,pos,territorio,zona){
	if(parseInt(pos) == NaN)
	{
		pos = 0;
	}
	var tabla_detalle2 = "";
	$.post('http://prueba.movilbox.net:88/movistar/yeapp/reporte_ventas_vendedor/controlador.php',
        {
            accion: 'Retornar_Detalle_2',
            fecha:fecha,
            territorio:territorio,
            zona:zona,
            pos:pos
		},
		function(data, textStatus) {
			data = JSON.parse(data);
			 tabla_detalle2 += '<table id="'+fecha+'_'+pos+'" class="" cellspacing="0" width="100%"><thead style="background:#EAEAEA;"><tr><th>REFERENCIA</th><th>CANTIDAD</th><th>VALOR</th><th></th></tr></thead><tbody>';
			if(!$.isEmptyObject(data))
			{
				$.each(data,function(index, row) {
					tabla_detalle2 +="<tr>";
					tabla_detalle2 +="<td>"+row.producto+"</td><td>"+row.cantidad+"</td><td>"+row.valor+"</td>";
					tabla_detalle2 +="<td class='detalle3' data-fecha='"+fecha+"' data-pos='"+pos+"' data-refe='"+row.idrefe+"'><i class='material-icons small blueicon'>add_circle_outline</i></td>";
					tabla_detalle2 +="</tr>";
				});
			   tabla_detalle2 +="</tbody>";
			}
			tabla_detalle2 +="</table>";
			$("#d_2_"+fecha+'_'+pos).find("td").html(tabla_detalle2);

			$("#d_2_"+fecha+'_'+pos+ " tbody").on('click', 'td.detalle3', function () {
		        var tr = $(this).parent();
		        var pos = $(this).attr("data-pos");
		        var fecha = $(this).attr("data-fecha");
		        var idrefe = $(this).attr("data-refe");
		        pos = parseInt(pos);
		        if(pos.toString() == "NaN")
				{
					pos = 0;
				}
		         var tab = $("body").find('#d_3_'+fecha+'_'+pos);
		        if(!$.contains(window.document, tab[0]))
        		{ 
		        	$( "<tr id='d_3_"+fecha+'_'+pos+"'><td colspan='4'></td></tr>" ).insertAfter($(tr));
		        	tr.find("i").html( '' );
                    tr.find("i").html( 'remove_circle_outline' );
                    Retornar_Detalle_3(fecha,pos,territorio,zona,idrefe);
		    	}
		    	else
		    	{
		    		$("#d_3_"+fecha+'_'+pos).remove();
		    		tr.find("i").html( '' );
					tr.find("i").addClass( 'add_circle_outline' );
                    
		    	}
		    } );
		}
	);
}

function Retornar_Detalle_3(fecha,pos,territorio,zona,idrefe){
	if(parseInt(pos) == NaN)
	{
		pos = 0;
	}
	var tabla_detalle3 = "";
	$.post('http://prueba.movilbox.net:88/movistar/yeapp/reporte_ventas_vendedor/controlador.php',
        {
            accion: 'Retornar_Detalle_3',
            fecha:fecha,
            territorio:territorio,
            zona:zona,
            pos:pos,
            refe:idrefe
		},
		function(data, textStatus) {
			data = JSON.parse(data);
			 tabla_detalle3 += '<table id="'+fecha+'_'+pos+'" class="" cellspacing="0" width="100%"><thead style="background:#EAEAEA;"><tr><th>SERIAL</th><th>VALOR</th></tr></thead><tbody>';
			if(!$.isEmptyObject(data))
			{
				$.each(data,function(index, row) {
					tabla_detalle3 +="<tr>";
					tabla_detalle3 +="<td>"+row.serie+"</td><td>"+row.valor_venta+"</td>";
					tabla_detalle3 +="</tr>";
				});
			   tabla_detalle3 +="</tbody>";
			}
			tabla_detalle3 +="</table>";
			$("#d_3_"+fecha+'_'+pos).find("td").html(tabla_detalle3);
		}
	);
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
