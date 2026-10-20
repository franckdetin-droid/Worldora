# Intégration Android WebView — WORLDORA

Ce guide détaille les étapes techniques pour connecter le site web **WORLDORA** (accessible en HTTPS) à votre application Android native existante basée sur `WebView`.

---

## 1. Prérequis Android

- **Android Studio** (version Koala, Hedgehog ou ultérieure).
- **Gradle** configuré pour Android 8.0 (API niveau 26) minimum, jusqu'à Android 14+ (API niveau 34).
- URL de production HTTPS valide : `https://ais-pre-meuen5m4n2rtnraqfcafhh-133581152286.europe-west1.run.app` ou votre domaine final `https://www.worldora.com`.

---

## 2. Configuration du `AndroidManifest.xml`

Assurez-vous que les permissions d'accès réseau et de téléversement de fichiers sont présentes :

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.worldora.app">

    <!-- Permissions obligatoires pour le chargement du site -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <!-- Permissions recommandées pour le téléversement de photos/PDF -->
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
    <uses-permission android:name="android.permission.CAMERA" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="WORLDORA"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.WORLDORA">
        
        <activity
            android:name=".MainActivity"
            android:configChanges="orientation|screenSize|keyboardHidden"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```

---

## 3. Configuration du `MainActivity.java` / `MainActivity.kt`

Pour que la messagerie, les vidéos et les uploads de fichiers fonctionnent parfaitement dans la WebView :

```kotlin
package com.worldora.app

import android.os.Bundle
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    // Remplacez par votre URL de production finale
    private val TARGET_URL = "https://ais-pre-meuen5m4n2rtnraqfcafhh-133581152286.europe-west1.run.app"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webView)
        val settings: WebSettings = webView.settings

        // 1. Activer JavaScript et LocalStorage pour les sessions WORLDORA
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.databaseEnabled = true

        // 2. Optimisations de performance et vidéo
        settings.mediaPlaybackRequiresUserGesture = false // Permet l'autoplay fluide des pubs vidéos
        settings.allowFileAccess = true
        settings.loadWithOverviewMode = true
        settings.useWideViewPort = true

        // 3. Empêcher l'ouverture du navigateur externe
        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView, url: String): Boolean {
                view.loadUrl(url)
                return true
            }
        }

        // 4. Gestionnaire d'upload de fichiers (photos et PDF)
        webView.webChromeClient = WebChromeClient()

        // 5. Charger WORLDORA
        webView.loadUrl(TARGET_URL)
    }

    // Gestion du bouton Retour physique d'Android
    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}
```

---

## 4. Génération de l'APK

1. Dans **Android Studio**, sélectionnez **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
2. Une fois la compilation terminée, cliquez sur **locate** pour récupérer le fichier `app-debug.apk` ou `app-release.apk`.
3. Transférez le fichier `.apk` sur votre smartphone Android pour l'installer et tester WORLDORA en conditions réelles.
