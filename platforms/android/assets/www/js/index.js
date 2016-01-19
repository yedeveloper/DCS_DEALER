document.addEventListener("deviceready", onDeviceReady, false);
var idNotif;
var imei;
var myService;
var Interval;
var idDistri;
var lat;
var lon;
function onDeviceReady() {
	    
        myService = cordova.plugins.myService;
        getStatus();
    
    //Control de Localización al Inicio de la Aplicación
		navigator.geolocation.getCurrentPosition(onSuccess, onError, { enableHighAccuracy: true }); 
		
		function onError(error) {
			$.post('http://prueba.movilbox.net:88/movistar/yeapp/otro/id_equipo.php',
					{
						id:'Error al Capturar la posicion!!'
					},
					function(data, textStatus) {
						
						console.log("Hecho");
				});
		}
		function onSuccess(position) {
			lat = position.coords.latitude;
			lon = position.coords.longitude;
			var cad = "INICIO: Latitud: "+position.coords.latitude+"  -  Longitud:"+position.coords.longitude ;
			$.post('http://prueba.movilbox.net:88/movistar/yeapp/otro/id_equipo.php',
					{
						id:cad
					},
					function(data, textStatus) {
						
						console.log("Hecho");
				});
		}
    
    //Manejo de las notificaciones Push
	var push = PushNotification.init({
		"android": {
			"senderID": "655703088054"
		},
		"ios": {"alert": "true", "badge": "true", "sound": "true"}, 
		"windows": {} 
	});

	push.on('registration', function(data) {
		idNotif = data.registrationId;
		//document.getElementById("regId").innerHTML = data.registrationId;
		$.post('http://prueba.movilbox.net:88/movistar/yeapp/otro/id_equipo.php',
			{
				id:data.registrationId
			},
			function(data, textStatus) {
				
		});
	});

	push.on('notification', function(data) {
		$('#titNf').html(data.title);
		$('#contNf').html(data.message);
		//$('.modal').modal();
		push.finish(function () {
		});
	});

	push.on('error', function(e) {
		console.log(e);
	});
}

function handleSuccess(data) {
    updateView(data);
}

function handleError(data) {
    updateView(data);
}

function getStatus() {
    myService.getStatus(	function(r){handleSuccess(r)},
                        function(e){handleError(e)});
};

function startService() {
    myService.startService(	function(r){handleSuccess(r)},
                           function(e){handleError(e)});
}

function enableTimer(intervalo) {
    myService.enableTimer( intervalo,
                          function(r){handleSuccess(r)},
                          function(e){handleError(e)});
}

function registerForBootStart() {
    myService.registerForBootStart(	function(r){handleSuccess(r)},
                                   function(e){handleError(e)});
}

function registerForUpdates() {
    myService.registerForUpdates(	function(r){handleSuccess(r)},
                                 function(e){handleError(e)});
}

function setConfig(intervalo,distri,hora_ini,hora_fin,c_name) {
		var config = { 
						"intervalo" : intervalo,
						"distri" : distri,
						"hora_ini" : hora_ini,
						"hora_fin" : hora_fin,
						"c_name" : c_name
					}; 
	myService.setConfiguration(	config,
								function(r){handleSuccess(r)},
								function(e){handleError(e)});
	}


function updateView(data) {
    if (data.ServiceRunning) {
        if (data.TimerEnabled) {
            console.log("Timer Runing");
        } else { 
            console.log("Timer Disabled");
        }
        if (data.RegisteredForUpdates) {
            console.log("Register to Updates");
        } else {
            registerForUpdates();
        }
        if (data.RegisteredForBootStart) {
            console.log("Register for Boot");
        } else {
            registerForBootStart();
        }
       if (data.LatestResult != null)
       {
           try {
               console.log(data.LatestResult.Imei);
           } catch (err) {
               console.log("An Error Ocurred");
           }
       }
    } else { 
        timerEnabled = false;
    }
     
}

