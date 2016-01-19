package com.red_folder.phonegap.plugin.backgroundservice.sample;

import org.apache.cordova.LOG;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteDatabase.CursorFactory;
import android.database.sqlite.SQLiteOpenHelper;

public class Bd_Connect extends SQLiteOpenHelper {
	
	String sqlCreate = "CREATE TABLE data_inter (intervalo DOUBLE, distri INTEGER, hora_ini DATE, hora_fin DATE, c_name TEXT)";
	String firstInsert = "INSERT INTO data_inter (intervalo, distri, hora_ini, hora_fin, c_name) VALUES ('300000',0,'09:00:00','16:00:00','distri_bd')";

	public Bd_Connect(Context context, String name, CursorFactory factory, int version) {
		super(context, name, factory, version);
	}

	@Override
	public void onCreate(SQLiteDatabase db) {
		if(db.isReadOnly()){
			db = getWritableDatabase();
		}
		db.execSQL(sqlCreate);
		db.execSQL(firstInsert);
	}

	@Override
	public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {		
	}
	
	public void Update(SQLiteDatabase db, Long intervalo, Integer distri, String hora_ini, String hora_fin, String c_name){
		
		db.execSQL("DELETE FROM 'data_inter'");
		String sentence = "INSERT INTO data_inter (intervalo, distri, hora_ini, hora_fin, c_name) VALUES ('"+intervalo+"',"+distri+",'"+hora_ini+"','"+hora_fin+"','"+c_name+"')";
		db.execSQL(sentence);
		LOG.i("METODO UPDATE","METODO UPDATE EJECUTADO CORRECTAMENTE");
	}

	
	
	
}
