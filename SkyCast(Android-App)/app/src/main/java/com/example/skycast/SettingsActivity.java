package com.example.skycast;

import android.content.SharedPreferences;
import android.os.Bundle;
import android.widget.SeekBar;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

public class SettingsActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_settings);

        SharedPreferences prefs = getSharedPreferences("skycast_prefs", Context.MODE_PRIVATE);

        SeekBar seekAqi = findViewById(R.id.seekAqiThreshold);
        TextView tvAqiVal = findViewById(R.id.tvAqiValue);

        int saved = prefs.getInt("aqi_threshold", 150);
        seekAqi.setProgress(saved);
        tvAqiVal.setText("Alert at AQI: " + saved);

        seekAqi.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
            @Override public void onProgressChanged(SeekBar s, int v, boolean user) {
                tvAqiVal.setText("Alert at AQI: " + v);
            }
            @Override public void onStartTrackingTouch(SeekBar s) {}
            @Override public void onStopTrackingTouch(SeekBar s) {
                prefs.edit().putInt("aqi_threshold", s.getProgress()).apply();
            }
        });
    }
}   