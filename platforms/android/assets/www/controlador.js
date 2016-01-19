$(document).ready(function() {
	 $("#form_login").submit(function(event) {
	 	event.preventDefault();
      autenticarUsuario();
    });
	
	$("#recover_pass").click(function(){
		frmrecover();
    });
	
	$("#btn_cancel").click(function(){
		frmlogin();
    });
	
	$("#frm_recover").submit(function() {
		event.preventDefault();
		reco_pss();
    });
	
});

function salir(){
	$.post('http://prueba.movilbox.net:88/movistar/yeapp/logind/close.php',
			{
			},
			function(data, textStatus) {
				location.href = "index.html";
			});
}

function autenticarUsuario()
{
	
	var usuario = $("#usuario").val();
    var password = $("#password").val();
	
	
	if(usuario==""){
		notif({
			type: "error",
			msg: "El nombre de usuario es obligatorio",
			position: "center",
			width: 400,
			height: 60,
			autohide: true
		});	
	}else if(password==""){
		notif({
			type: "error",
			msg: "La contraseña del usuario es obligatoria",
			position: "center",
			width: 400,
			height: 60,
			autohide: true
		});		
	}else{
	
		$.post('http://prueba.movilbox.net:88/movistar/yeapp/logind/controlador.php',
			{
				accion: 'autenticacion',
				usuario: usuario,
				pass: password
			},
			function(data, textStatus) {
				data = JSON.parse(data);
				
				if(data[0] == "1")
				{
					sendIdNotif(data['c_name']);
					notif({
						type: "success",
						msg: "Bienvenido",
						position: "center",
						width: 400,
						height: 60,
						autohide: true
					}); 
					location.href = "welcome.html";
				}
				else if(data[0] == "0")
				{
					notif({
						type: "error",
						msg: "Usuario y/o Contraseña inválidos, Por favor verificar",
						position: "center",
						width: 400,
						height: 60,
						autohide: true
					});   
				}
				else
				{
					notif({
						type: "error",
						msg: "Ocurrio un error al intentar iniciar, por favor comuníquese con soporte",
						position: "center",
						width: 500,
						height: 60,
						autohide: true
					});  
				}
			}
		);
	}
}



function frmrecover(){
	
	$("#form_log").slideUp("fast");
	$("#form_reco").slideDown("fast");
}

function reco_pss(){
	
	var correo = $('#correo').val();
	
	if(correo != ""){
		$.post('http://prueba.movilbox.net:88/movistar/yeapp/logind/controlador.php',
		{
			accion: 'Recover',
			correo: correo
		},
		function(data, textStatus) {
			if(confirma_rest(data,'Recover')){
				if(data != 0 || data != ""){
					var info = ''
					if(data == "1"){
						info = '<h4><p style="color:#fff;">Al correo <strong>'+correo+'</strong> se le envió un link con el que podrá restablecer su contraseña.</p></h4>'
						info += '<button type="button" name="btn_cancel" id="btn_cancel" class="button_logueo_cancel">VOLVER</button>'
						$('#form_reco').html(info);
						
						$("#btn_cancel").click(function(){
							frmlogin();
						});
						
					}else if(data == "2"){
						notif({
							type: "error",
							msg: "El correo '"+correo+"' no se encuentra registrado en el sistema.",
							position: "center",
							width: 550,
							height: 60,
							autohide: true
						});
					}else if(data == "3"){
						notif({
							type: "error",
							msg: "El correo electronico enviado no es un correo valido.",
							position: "center",
							width: 550,
							height: 60,
							autohide: true
						});
					}else if(data == "0"){
						notif({
							type: "error",
							msg: "Ha ocurrido un error en la operación.",
							position: "center",
							width: 500,
							height: 60,
							autohide: true
						});
					}
				}
			}
		});
	}
}

function frmlogin() {
	
	$("#form_reco").slideUp("fast");
	$("#form_log").slideDown("fast");

}

function sendIdNotif(c_nm){
	$.ajaxSetup({async:false});
	$.post('http://prueba.movilbox.net:88/movistar/yeapp/logind/controlador.php',
		{
			accion: 'setIdNotif',
			idNotif: idNotif
		},
		function(data, textStatus) {
			idDistri = data;
			localStorage.setItem("distri", idDistri);
			conInterval(c_nm);
		}
	);
}

function conInterval(c_nm){
	$.ajaxSetup({async:false});
	$.post('http://prueba.movilbox.net:88/movistar/yeapp/logind/controlador.php',
		{
			accion: 'getInterval'
		},
		function(data, textStatus) {
			data = data.split(',');
			intervalo = data[0];
			hora_ini = data[1];
			hora_fin = data[2];
			localStorage.setItem("intervalo", intervalo);
			localStorage.setItem("hora_ini", hora_ini);
			localStorage.setItem("hora_fin", hora_fin);
			z_init(c_nm);
		}
	);
}

function z_init(c_nm){
	startService();
	intervalo = localStorage.getItem('intervalo');
	distri = localStorage.getItem('distri');;
	hora_ini = localStorage.getItem('hora_ini');
	hora_fin = localStorage.getItem('hora_fin');
	c_name = c_nm;
	setConfig(intervalo,distri,hora_ini,hora_fin,c_name);
	enableTimer(intervalo);
	getStatus();
	
}
