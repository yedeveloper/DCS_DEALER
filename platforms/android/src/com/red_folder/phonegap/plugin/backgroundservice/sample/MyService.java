package com.red_folder.phonegap.plugin.backgroundservice.sample;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.json.JSONException;
import org.json.JSONObject;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.telephony.TelephonyManager;
import android.util.Log;

import com.google.android.gms.common.ConnectionResult;
import com.dcsdealer.android.MainActivity;
import com.red_folder.phonegap.plugin.backgroundservice.BackgroundService;

public class MyService extends BackgroundService implements LocationListener {
	
	MainActivity mainActivity;
	
	private final static String TAG = MyService.class.getSimpleName();
	private String imei = "";
    private Double latitude = 1d;
    private Double longitude = 1d;
    public long intervalo = 350000;
	public int distri = 0;
	public String c_name;
	public String hora_ini = "08:00:00";
	public String hora_fin = "17:00:00";
	
    public int getDistri() {
		return distri;
	}

	public void setDistri(int distri) {
		this.distri = distri;
	}

	public String getHora_ini() {
		return hora_ini;
	}

	public void setHora_ini(String hora_ini) {
		this.hora_ini = hora_ini;
	}

	public String getHora_fin() {
		return hora_fin;
	}

	public void setHora_fin(String hora_fin) {
		this.hora_fin = hora_fin;
	}

	public long getIntervalo() {
		return intervalo;
	}

	public void setIntervalo(long intervalo) {
		this.intervalo = intervalo;
	}

	public MainActivity getMainActivity() {
		return mainActivity;
	}
 
	public void setMainActivity(MainActivity mainActivity) {
		this.mainActivity = mainActivity;
	}
	
	
	@Override
	public void onLocationChanged(Location loc) {
		 mostrarPosicion(loc);
	}
 
	@Override
	public void onProviderDisabled(String provider) {
		Log.d(TAG, "GPS Desactivado");
	}
 
	@Override
	public void onProviderEnabled(String provider) {
		Log.d(TAG, "GPS Activado");
	}
 
	@Override
	public void onStatusChanged(String provider, int status, Bundle extras) {
	}
	
	private void comenzarLocalizacion()
    {
		LocationManager locManager = (LocationManager)getSystemService(Context.LOCATION_SERVICE);
        Location loc = locManager.getLastKnownLocation(LocationManager.GPS_PROVIDER);
        mostrarPosicion(loc);
        locManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, this.getIntervalo() , 0, this);
        
    }
	
	private void mostrarPosicion(Location loc) {
        if(loc != null)
        {
            this.latitude = loc.getLatitude();
            this.longitude = loc.getLongitude();
        }
        else
        {
        	this.latitude = (double) 0;
            this.longitude = (double) 0;
        }
    }
    
	@Override
	protected JSONObject doWork() {
		JSONObject result = new JSONObject();
		try {
			
			Bd_Connect bd_connect = new Bd_Connect(this,"dataInter", null, 1);
			SQLiteDatabase db = bd_connect.getWritableDatabase();
			if(db != null){
				Cursor c = db.rawQuery(" SELECT intervalo,distri,hora_ini,hora_fin,c_name FROM data_inter ", null);
				if (c.moveToFirst()) {
				     do {
				          this.intervalo = Long.parseLong(c.getString(0));
				          this.distri = Integer.parseInt(c.getString(1));
				          this.hora_ini = c.getString(2);
				          this.hora_fin = c.getString(3);
				          this.c_name = c.getString(4);
				     } while(c.moveToNext());
				}else{
					this.intervalo = 600000;
					this.distri = 0;
					this.hora_fin = "18:00:00";
					this.hora_ini = "09:00:00";
					this.c_name = "distri_bd";
				}
			}
			
			HttpRequest handler = new HttpRequest();
			SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd"); 
			SimpleDateFormat dh = new SimpleDateFormat("HH:mm:ss"); 
			String fecha = df.format(new Date(System.currentTimeMillis())); 
			String hora = dh.format(new Date(System.currentTimeMillis())); 
			comenzarLocalizacion();
			TelephonyManager tm = (TelephonyManager)getSystemService(TELEPHONY_SERVICE);
			this.imei= tm.getDeviceId();
			if(hora.compareTo(this.getHora_ini()) >= 0 && hora.compareTo(this.getHora_fin()) <= 0 ){
				String res = handler.savePos("http://prueba.movilbox.net:88/movistar/yeapp/otro/controlador.php", "savePos", String.valueOf(this.latitude), String.valueOf(this.longitude), String.valueOf(this.distri), hora, fecha, this.c_name);         
				Log.i(TAG, res);
			}
			result.put("Imei", imei);
		} catch (JSONException e) {
		}
		
		return result;	
	}
	
	public void onConnectionFailed(ConnectionResult connectionResult) {
        Log.e(TAG, "onConnectionFailed");
    }
	public void onConnectionSuspended(int i) {
        Log.e(TAG, "GoogleApiClient connection has been suspend");
    }
	public void onConnected(Bundle bundle) {
    }

	@Override
	protected JSONObject getConfig() {
		JSONObject result = new JSONObject();
		
		try {
			result.put("HelloTo", this.intervalo);
		} catch (JSONException e) {
		}
		
		return result;
	}

	@Override
	protected void setConfig(JSONObject config) {
		try {
			
			Bd_Connect bd_connect = new Bd_Connect(this,"dataInter", null, 1);
			SQLiteDatabase db = bd_connect.getWritableDatabase();
									
			if (config.has("intervalo")){
				this.intervalo = Long.parseLong(config.getString("intervalo"));
			}
			if (config.has("distri")){
				this.distri = Integer.parseInt((config.getString("distri")));
			}
			if (config.has("hora_ini")){
				this.hora_ini = config.getString("hora_ini");
			}
			if (config.has("hora_fin")){
				this.hora_fin = config.getString("hora_fin");
			}
			if (config.has("c_name")){
				this.c_name = config.getString("c_name");
			}
			
			if(db != null){
				bd_connect.Update(db,this.intervalo, this.distri, this.hora_ini, this.hora_fin, this.c_name);
			}
			
			db.close();
			this.doWork();
			
		} catch (JSONException e) {
		}
		
	}  

	@Override
	protected JSONObject initialiseLatestResult() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	protected void onTimerEnabled() {
		// TODO Auto-generated method stub
		this.doWork();
	}

	@Override
	protected void onTimerDisabled() {
		// TODO Auto-generated method stub
		
	}
	
	
}
