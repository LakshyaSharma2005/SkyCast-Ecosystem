package com.example.skycast;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.github.mikephil.charting.charts.LineChart;
import com.github.mikephil.charting.components.LimitLine;
import com.github.mikephil.charting.components.XAxis;
import com.github.mikephil.charting.components.YAxis;
import com.github.mikephil.charting.data.Entry;
import com.github.mikephil.charting.data.LineData;
import com.github.mikephil.charting.data.LineDataSet;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Locale;

public class MainActivity extends AppCompatActivity {

    private TextView tvTemp, tvHum, tvAqi, tvRain;
    private TextView tvFeelsLike, tvAqiLabel, tvRainIntensity, tvLastSync, tvHumDesc;
    private TextView tvTempDelta;
    private DatabaseReference sensorRef, historyRef;
    private LineChart chartTemp, chartHum, chartRain, chartAqi;

    // Delta tracking
    private Double prevTemp = null;

    private static final int NOTIF_PERMISSION_CODE = 101;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Core readings
        tvTemp      = findViewById(R.id.tvTemp);
        tvHum       = findViewById(R.id.tvHum);
        tvAqi       = findViewById(R.id.tvAqi);
        tvRain      = findViewById(R.id.tvRain);

        // New supplementary views
        tvFeelsLike     = findViewById(R.id.tvFeelsLike);
        tvAqiLabel      = findViewById(R.id.tvAqiLabel);
        tvRainIntensity = findViewById(R.id.tvRainIntensity);
        tvLastSync      = findViewById(R.id.tvLastSync);
        tvHumDesc       = findViewById(R.id.tvHumDesc);
        tvTempDelta     = findViewById(R.id.tvTempDelta);

        // Charts
        chartTemp = findViewById(R.id.chartTemp);
        chartHum  = findViewById(R.id.chartHum);
        chartRain = findViewById(R.id.chartRain);
        chartAqi  = findViewById(R.id.chartAqi);

        setupChartTheme(chartTemp);
        setupChartTheme(chartHum);
        setupChartTheme(chartRain);
        setupChartTheme(chartAqi);

        // Add AQI threshold line to AQI chart
        LimitLine aqiLimit = new LimitLine(150f, "Threshold");
        aqiLimit.setLineColor(Color.parseColor("#ef4444"));
        aqiLimit.setLineWidth(1f);
        aqiLimit.setTextColor(Color.parseColor("#ef4444"));
        aqiLimit.setTextSize(9f);
        aqiLimit.enableDashedLine(8f, 4f, 0f);
        chartAqi.getAxisLeft().addLimitLine(aqiLimit);

        sensorRef  = FirebaseDatabase.getInstance().getReference("skycast/live");
        historyRef = FirebaseDatabase.getInstance().getReference("skycast/history");

        requestNotificationPermission();
        startCloudListener();
        startHistoryListener();

        Intent serviceIntent = new Intent(this, SkyCastAlertService.class);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            startForegroundService(serviceIntent);
        } else {
            startService(serviceIntent);
        }

        // Settings FAB
        findViewById(R.id.fabSettings).setOnClickListener(v ->
                startActivity(new Intent(this, SettingsActivity.class)));
    }

    private void requestNotificationPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS)
                    != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(this,
                        new String[]{Manifest.permission.POST_NOTIFICATIONS},
                        NOTIF_PERMISSION_CODE);
            }
        }
    }

    private void setupChartTheme(LineChart chart) {
        chart.getDescription().setEnabled(false);
        chart.getLegend().setEnabled(false);
        chart.setTouchEnabled(true);
        chart.setDragEnabled(true);
        chart.setScaleEnabled(false);
        chart.setDrawGridBackground(false);

        XAxis xAxis = chart.getXAxis();
        xAxis.setPosition(XAxis.XAxisPosition.BOTTOM);
        xAxis.setDrawGridLines(false);
        xAxis.setDrawAxisLine(false);
        xAxis.setDrawLabels(false);

        YAxis leftAxis = chart.getAxisLeft();
        leftAxis.setTextColor(Color.parseColor("#64748b"));
        leftAxis.setTextSize(10f);
        leftAxis.setDrawAxisLine(false);
        leftAxis.setGridColor(Color.parseColor("#1e293b"));

        chart.getAxisRight().setEnabled(false);
        chart.setNoDataText("Awaiting Firebase sync…");
        chart.setNoDataTextColor(Color.parseColor("#64748b"));
    }

    private LineDataSet createDataSet(ArrayList<Entry> entries, String label, String colorHex) {
        LineDataSet ds = new LineDataSet(entries, label);
        ds.setColor(Color.parseColor(colorHex));
        ds.setLineWidth(2.5f);
        ds.setDrawCircles(false);
        ds.setDrawValues(false);
        ds.setMode(LineDataSet.Mode.CUBIC_BEZIER);
        ds.setDrawFilled(true);
        ds.setFillColor(Color.parseColor(colorHex));
        ds.setFillAlpha(25);
        ds.setHighLightColor(Color.parseColor(colorHex));
        return ds;
    }

    /** Heat index (feels-like) using simplified Steadman formula */
    private double calcFeelsLike(double tempC, double humidity) {
        double t = tempC * 9.0 / 5.0 + 32; // convert to °F for formula
        double hi = -42.379 + 2.04901523 * t + 10.14333127 * humidity
                - 0.22475541 * t * humidity - 0.00683783 * t * t
                - 0.05481717 * humidity * humidity
                + 0.00122874 * t * t * humidity
                + 0.00085282 * t * humidity * humidity
                - 0.00000199 * t * t * humidity * humidity;
        return (hi - 32) * 5.0 / 9.0; // back to °C
    }

    /** Human-readable AQI label + color */
    private String[] aqiMeta(int aqi) {
        if (aqi <= 50)  return new String[]{"Good",            "#22c55e"};
        if (aqi <= 100) return new String[]{"Moderate",        "#fbbf24"};
        if (aqi <= 150) return new String[]{"Unhealthy (Sens.)","#f97316"};
        if (aqi <= 200) return new String[]{"Unhealthy",       "#ef4444"};
        if (aqi <= 300) return new String[]{"Very Unhealthy",  "#a855f7"};
        return new String[]{"Hazardous",        "#7c3aed"};
    }

    /** Humidity comfort description */
    private String humDesc(double h) {
        if (h < 30) return "Dry";
        if (h < 55) return "Comfortable";
        if (h < 70) return "Humid";
        return "Muggy";
    }

    private void startCloudListener() {
        sensorRef.addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                if (!snapshot.exists()) return;

                Double temp     = snapshot.child("temperature").getValue(Double.class);
                Double hum      = snapshot.child("humidity").getValue(Double.class);
                Integer aqi     = snapshot.child("aqi").getValue(Integer.class);
                Boolean raining = snapshot.child("isRaining").getValue(Boolean.class);
                Double rainPct  = snapshot.child("rainPct").getValue(Double.class);

                // Temperature + feels-like + delta
                if (temp != null) {
                    tvTemp.setText(String.format("%.1f°", temp));
                    if (hum != null) {
                        double fl = calcFeelsLike(temp, hum);
                        tvFeelsLike.setText(String.format("Feels like %.1f°C", fl));
                    }
                    if (prevTemp != null) {
                        double delta = temp - prevTemp;
                        String arrow = delta >= 0 ? "↑" : "↓";
                        tvTempDelta.setText(String.format("%s %.1f° from last", arrow, Math.abs(delta)));
                        tvTempDelta.setTextColor(delta > 0
                                ? Color.parseColor("#f97316")
                                : Color.parseColor("#38bdf8"));
                    }
                    prevTemp = temp;
                }

                // Humidity + comfort label
                if (hum != null) {
                    tvHum.setText(String.format("%.0f%%", hum));
                    tvHumDesc.setText(humDesc(hum));
                }

                // AQI + label + color
                if (aqi != null) {
                    tvAqi.setText(String.valueOf(aqi));
                    String[] meta = aqiMeta(aqi);
                    tvAqiLabel.setText(meta[0]);
                    tvAqiLabel.setTextColor(Color.parseColor(meta[1]));
                    tvAqi.setTextColor(Color.parseColor(meta[1]));
                }

                // Rain
                if (raining != null) {
                    if (raining) {
                        tvRain.setText("RAINING");
                        tvRain.setTextColor(Color.parseColor("#38bdf8"));
                    } else {
                        tvRain.setText("DRY");
                        tvRain.setTextColor(Color.parseColor("#64748b"));
                    }
                }
                if (rainPct != null) {
                    tvRainIntensity.setText(String.format("Intensity: %.0f%%", rainPct));
                    tvRainIntensity.setVisibility(
                            (raining != null && raining)
                                    ? android.view.View.VISIBLE
                                    : android.view.View.GONE);
                }

                // Timestamp
                String ts = new SimpleDateFormat("HH:mm:ss", Locale.getDefault()).format(new Date());
                tvLastSync.setText("Last sync: " + ts);
            }

            @Override public void onCancelled(@NonNull DatabaseError e) {}
        });
    }

    private void startHistoryListener() {
        historyRef.addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                if (!snapshot.exists()) return;

                ArrayList<Entry> tE = new ArrayList<>(), hE = new ArrayList<>(),
                        rE = new ArrayList<>(), aE = new ArrayList<>();
                int x = 0;

                for (DataSnapshot row : snapshot.getChildren()) {
                    Double t = row.child("temperature").getValue(Double.class);
                    Double h = row.child("humidity").getValue(Double.class);
                    Double r = row.child("rainPct").getValue(Double.class);
                    Integer a = row.child("aqi").getValue(Integer.class);

                    if (t != null) tE.add(new Entry(x, t.floatValue()));
                    if (h != null) hE.add(new Entry(x, h.floatValue()));
                    if (r != null) rE.add(new Entry(x, r.floatValue()));
                    if (a != null) aE.add(new Entry(x, a.floatValue()));
                    x++;
                }

                if (!tE.isEmpty()) { chartTemp.setData(new LineData(createDataSet(tE, "Temp", "#38bdf8"))); chartTemp.animateX(600); }
                if (!hE.isEmpty()) { chartHum.setData(new LineData(createDataSet(hE, "Hum",  "#f472b6"))); chartHum.animateX(600); }
                if (!rE.isEmpty()) { chartRain.setData(new LineData(createDataSet(rE, "Rain", "#3b82f6"))); chartRain.animateX(600); }
                if (!aE.isEmpty()) { chartAqi.setData(new LineData(createDataSet(aE, "AQI",  "#fbbf24"))); chartAqi.animateX(600); }
            }

            @Override public void onCancelled(@NonNull DatabaseError e) {}
        });
    }
}