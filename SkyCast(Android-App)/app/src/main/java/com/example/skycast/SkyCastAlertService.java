package com.example.skycast;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;
import android.os.IBinder;

import androidx.annotation.NonNull;
import androidx.core.app.NotificationCompat;

import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

public class SkyCastAlertService extends Service {

    private static final String CHANNEL_ID       = "SkyCastSentinel";
    private static final String ALERT_CHANNEL_ID = "SkyCastAlerts";
    private static final float  EXTREME_HEAT_C   = 42f;

    private boolean wasRaining   = false;
    private boolean wasToxic     = false;
    private boolean wasExtremeHt = false;

    @Override
    public void onCreate() {
        super.onCreate();
        createNotificationChannels();
        startSentinel();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Notification persistent = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("SkyCast Sentinel Active")
                .setContentText("Monitoring environment in background…")
                .setSmallIcon(android.R.drawable.ic_menu_compass)
                .setPriority(NotificationCompat.PRIORITY_LOW)
                .build();
        startForeground(1, persistent);
        return START_STICKY;
    }

    private int getAqiThreshold() {
        SharedPreferences prefs = getSharedPreferences("skycast_prefs", MODE_PRIVATE);
        return prefs.getInt("aqi_threshold", 150);
    }

    private void startSentinel() {
        DatabaseReference ref = FirebaseDatabase.getInstance().getReference("skycast/live");

        ref.addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                if (!snapshot.exists()) return;

                Boolean isRaining = snapshot.child("isRaining").getValue(Boolean.class);
                Integer aqi       = snapshot.child("aqi").getValue(Integer.class);
                Double  temp      = snapshot.child("temperature").getValue(Double.class);
                // ⚡ NEW: We need to pull humidity specifically for the widget
                Double  hum       = snapshot.child("humidity").getValue(Double.class);

                // Rain alerts
                if (isRaining != null) {
                    if (isRaining && !wasRaining) {
                        pushAlert("🌧️ Rain Detected", "Water hit the sensor. Secure outdoor items.");
                        wasRaining = true;
                    } else if (!isRaining && wasRaining) {
                        pushAlert("☀️ Rain Cleared", "Sensor is dry again. All clear.");
                        wasRaining = false;
                    }
                }

                // AQI tiered alerts
                if (aqi != null) {
                    int threshold = getAqiThreshold();
                    if (aqi > threshold && !wasToxic) {
                        String severity = aqi > 200 ? "⛔ Very Unhealthy Air" : "⚠️ Hazardous Air Quality";
                        pushAlert(severity, "AQI is " + aqi + ". Stay indoors and wear a mask.");
                        wasToxic = true;
                    } else if (aqi <= threshold) {
                        wasToxic = false;
                    }
                }

                // Extreme heat alert
                if (temp != null) {
                    if (temp >= EXTREME_HEAT_C && !wasExtremeHt) {
                        pushAlert("🔥 Extreme Heat Warning",
                                String.format("Temperature is %.1f°C. Avoid direct sun exposure.", temp));
                        wasExtremeHt = true;
                    } else if (temp < EXTREME_HEAT_C) {
                        wasExtremeHt = false;
                    }
                }

                // ⚡ MAGIC LINK: Push Live Data to the Home Screen Widget
                android.appwidget.AppWidgetManager appWidgetManager = android.appwidget.AppWidgetManager.getInstance(getApplicationContext());
                android.content.ComponentName thisWidget = new android.content.ComponentName(getApplicationContext(), SkyCastWidgetProvider.class);
                int[] appWidgetIds = appWidgetManager.getAppWidgetIds(thisWidget);

                if (appWidgetIds != null && appWidgetIds.length > 0) {
                    android.widget.RemoteViews views = new android.widget.RemoteViews(getPackageName(), R.layout.widget_skycast);

                    if (temp != null) views.setTextViewText(R.id.widgetTemp, String.format("%.1f°", temp));
                    if (hum != null) views.setTextViewText(R.id.widgetHum, String.format("%.1f%%", hum));
                    if (aqi != null) views.setTextViewText(R.id.widgetAqi, String.valueOf(aqi));

                    if (isRaining != null && isRaining) {
                        views.setTextViewText(R.id.widgetRain, "WET");
                        views.setTextColor(R.id.widgetRain, android.graphics.Color.parseColor("#38bdf8"));
                    } else {
                        views.setTextViewText(R.id.widgetRain, "DRY");
                        views.setTextColor(R.id.widgetRain, android.graphics.Color.parseColor("#94a3b8"));
                    }

                    appWidgetManager.updateAppWidget(thisWidget, views);
                }
            }

            @Override public void onCancelled(@NonNull DatabaseError e) {}
        });
    }

    private void pushAlert(String title, String message) {
        NotificationManager mgr = getSystemService(NotificationManager.class);
        Notification alert = new NotificationCompat.Builder(this, ALERT_CHANNEL_ID)
                .setContentTitle(title)
                .setContentText(message)
                .setStyle(new NotificationCompat.BigTextStyle().bigText(message))
                .setSmallIcon(android.R.drawable.ic_dialog_alert)
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setDefaults(Notification.DEFAULT_ALL)
                .setAutoCancel(true)
                .build();
        mgr.notify((int) System.currentTimeMillis(), alert);
    }

    private void createNotificationChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationManager mgr = getSystemService(NotificationManager.class);
            mgr.createNotificationChannel(new NotificationChannel(
                    CHANNEL_ID, "Background Service", NotificationManager.IMPORTANCE_LOW));
            mgr.createNotificationChannel(new NotificationChannel(
                    ALERT_CHANNEL_ID, "Environment Alerts", NotificationManager.IMPORTANCE_HIGH));
        }
    }

    @Override public IBinder onBind(Intent intent) { return null; }
}