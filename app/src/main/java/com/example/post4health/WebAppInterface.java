package com.example.post4health;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.os.VibratorManager;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.widget.Toast;

import androidx.core.content.FileProvider;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

@SuppressWarnings({"unused", "deprecation"})
public class WebAppInterface {

    private static final String TAG = "WebAppInterface";
    private final Context mContext;

    public WebAppInterface(Context context) {
        this.mContext = context;
    }

    @JavascriptInterface
    public void showToast(String message) {
        Toast.makeText(mContext, message, Toast.LENGTH_SHORT).show();
    }

    @JavascriptInterface
    public void triggerVibration() {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                VibratorManager vibratorManager = (VibratorManager) mContext.getSystemService(Context.VIBRATOR_MANAGER_SERVICE);
                if (vibratorManager != null) {
                    Vibrator vibrator = vibratorManager.getDefaultVibrator();
                    vibrator.vibrate(VibrationEffect.createOneShot(300, VibrationEffect.DEFAULT_AMPLITUDE));
                }
            } else {
                Vibrator v = (Vibrator) mContext.getSystemService(Context.VIBRATOR_SERVICE);
                if (v != null && v.hasVibrator()) {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                        v.vibrate(VibrationEffect.createOneShot(300, VibrationEffect.DEFAULT_AMPLITUDE));
                    } else {
                        v.vibrate(300);
                    }
                }
            }
        } catch (Exception e) {
            Log.e(TAG, "Vibration failed", e);
        }
    }

    @JavascriptInterface
    public void shareCSV(String csvContent, String fileName) {
        try {
            File cachePath = new File(mContext.getCacheDir(), "reports");
            if (!cachePath.exists()) {
                boolean created = cachePath.mkdirs();
                if (!created && !cachePath.exists()) {
                    Log.w(TAG, "Failed to create cache path directory");
                }
            }

            File file = new File(cachePath, fileName != null && !fileName.isEmpty() ? fileName : "ColdChain_Compliance_Report.csv");
            FileOutputStream stream = new FileOutputStream(file);
            stream.write(csvContent.getBytes());
            stream.close();

            Uri contentUri = FileProvider.getUriForFile(mContext, mContext.getPackageName() + ".fileprovider", file);

            if (contentUri != null) {
                Intent shareIntent = new Intent(Intent.ACTION_SEND);
                shareIntent.setType("text/csv");
                shareIntent.putExtra(Intent.EXTRA_SUBJECT, "Post4Health Cold-Chain Compliance Audit Report");
                shareIntent.putExtra(Intent.EXTRA_TEXT, "Attached is the latest Post4Health Cold-Chain Compliance Audit Report CSV.");
                shareIntent.putExtra(Intent.EXTRA_STREAM, contentUri);
                shareIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);

                Intent chooser = Intent.createChooser(shareIntent, "Share Compliance Report");
                chooser.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                mContext.startActivity(chooser);
            }
        } catch (IOException e) {
            Log.e(TAG, "Sharing CSV failed", e);
            Toast.makeText(mContext, "Failed to export report: " + e.getMessage(), Toast.LENGTH_LONG).show();
        }
    }

    @JavascriptInterface
    public String getDeviceInfo() {
        return Build.MANUFACTURER + " " + Build.MODEL + " (Android " + Build.VERSION.RELEASE + ")";
    }
}
