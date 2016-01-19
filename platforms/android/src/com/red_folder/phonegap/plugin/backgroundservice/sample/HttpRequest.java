package com.red_folder.phonegap.plugin.backgroundservice.sample;

import java.util.ArrayList;
import java.util.List;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;

public class HttpRequest {

public String post(String posturl, String value){

  try {
	  HttpClient httpclient = new DefaultHttpClient();
      HttpPost httppost = new HttpPost(posturl);
      List<NameValuePair> params = new ArrayList<NameValuePair>();
      params.add(new BasicNameValuePair("id", value));
      httppost.setEntity(new UrlEncodedFormEntity(params));
      HttpResponse resp = httpclient.execute(httppost);
      HttpEntity ent = resp.getEntity();
      String text = EntityUtils.toString(ent);
      return text;
  }

  catch(Exception e) { return "error";}

  }
  
  public String savePos(String posturl, String accion, String lat, String lng, String distri, String hora, String fecha, String c_name){

	  try {
	      HttpClient httpclient = new DefaultHttpClient();
	      HttpPost httppost = new HttpPost(posturl);
	      List<NameValuePair> params = new ArrayList<NameValuePair>();
	      params.add(new BasicNameValuePair("accion", accion));
	      params.add(new BasicNameValuePair("lat", lat));
	      params.add(new BasicNameValuePair("lng", lng));
	      params.add(new BasicNameValuePair("distri", distri));
	      params.add(new BasicNameValuePair("hora", hora));
	      params.add(new BasicNameValuePair("fecha", fecha));
	      params.add(new BasicNameValuePair("c_name", c_name));
	      httppost.setEntity(new UrlEncodedFormEntity(params));
	      HttpResponse resp = httpclient.execute(httppost);
	      HttpEntity ent = resp.getEntity();
	      String text = EntityUtils.toString(ent);
	      return text;
	  }

	  catch(Exception e) { return "error";}

	  }

}

