#include <Bridge.h>
#include <YunClient.h>

const int pulsePin = A0;                  
const int threshold = 515;                
const unsigned long debounceDelay = 300;  
const unsigned long measureInterval = 20000;

int pulseValue;
unsigned long lastBeatTime = 0;
int beatCount = 0;
unsigned long lastMeasureTime = 0;

void setup() {
    Serial.begin(9600);
    Bridge.begin();
     while (!Serial); 
    Serial.println("Inizio programma...");
}

void loop() {
    pulseValue = analogRead(pulsePin);
    unsigned long currentTime = millis();

    if (pulseValue > threshold && (currentTime - lastBeatTime > debounceDelay)) {
        lastBeatTime = currentTime;
        beatCount++;
        Serial.println("Battito rilevato");
    }

    if (currentTime - lastMeasureTime >= measureInterval) {
        float elapsedTime = (float)(measureInterval / 1000.0); 
        float bpm = (beatCount / elapsedTime) * 60.0;
        float bps = bpm / 60.0;

        Serial.print("Battiti conteggiati: ");
        Serial.println(beatCount);
        Serial.print("Tempo trascorso (secondi): ");
        Serial.println(elapsedTime);
        Serial.print("BPM: ");
        Serial.println(bpm);
        Serial.print("BPS: ");
        Serial.println(bps);

        YunClient client;
        if (client.connect("192.168.1.120", 3000)) {
          Serial.println("Connessione al server riuscita!");
            client.print("GET /heartbeat?bpm=");
            client.print(bpm);
            client.print("&bps=");
            client.print(bps);
            client.println(" HTTP/1.1");
            client.println("Host: 192.168.56.1");
            client.println("Connection: close");
            client.println();
            client.stop();
            Serial.println("Dati inviati al server");
        }else{
          Serial.println("Connessione al server fallita.");
        }

        beatCount = 0;
        lastMeasureTime = currentTime;
        delay(1000); 
    }
}

