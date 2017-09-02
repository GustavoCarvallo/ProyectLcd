// This #include statement was automatically added by the Particle IDE.
#include <Adafruit_DHT.h>

//Light's variables.
//IMPORTANT: By default the light1 will be the outdoors light. This means
//that the light will be control by the Photoresistor sensor (if enable). To
//change only modify the lightsUsedByPr variable.
//IMPORTANT: By default the light2 will be the indoors light. This means
//that the light will be control by the Movement sensor (if enable). To
//change only modify the lightsUsedByMov variable.

const int light1Pin = 0;
const int light2Pin = 1;
int currentlight1Intensity;
int currentlight2Intensity;
int lightsUsedByMov = 2;
int lightsUsedByPr = 1;

//Photoresistor variables.
const int photoresistorPin = A0;
int minOutdoorIntensity = 3000;
bool enablePhotoresistor;
bool lightTurnedOnByPrSensor;

//Alarm variables.
const int movementSensorPin = 5;
const int alarmSirenPin = 3;
bool alarmActive;
bool alarmTrigger;
bool increasing = true;
double freqCounter = 0;
String alarmPassword;
//int frequency = 500;

//Movement sensor to turn lights variables.
//Variable use for knowing if the movement sensor should turn on lights or not
//(when alarm is not activated).
bool enableMovementSensorToTurnLights;
bool lightTurnedOnByMovSensor;

//Keypad and Lcd will work on Arduino board.
//'arduinoInputCommunicationPin' --> Is the pin where the arduino board tells
//the particle to turn on or off the alarm. If it HIGH the alarm state changes.
const int arduinoInputCommunicationPin = 2;
//'arduinoOutputCommunicationPin' --> Is the pin where the particle photon board
//tells the arduino board if the alarm is active or not. If it is HIGH the alarm
//is active, if it is LOW not.
const int arduinoOutputCommunicationPin = 6;

//Debugging porpuse variables.
int movementSensorValue;
int lightSensorValue;
int arduinoComVal;

//DHT11 Temperature Sensor.
#define DHTTYPE DHT11
const int DHTPIN = A4;
DHT dht(DHTPIN, DHTTYPE);
double temperature;
double humidity;

void setup() {
    //Set lights as output
    pinMode(light1Pin, OUTPUT);
    pinMode(light2Pin, OUTPUT);

    //Set photoresistor as input.
    pinMode(photoresistorPin, INPUT);

    //Set momment sensor as input.
    pinMode(movementSensorPin, INPUT);

    //Set arduino input communication pin as input;
    pinMode(arduinoInputCommunicationPin, INPUT);

    //Set arduino output communication pin as output;
    pinMode(arduinoOutputCommunicationPin, OUTPUT);


    //Set some function and variables.
    Particle.function("light", lightCommands);
    Particle.function("setValues", setVariables);
    Particle.function("getVar", getVar);
    Particle.variable("temp", temperature);
    //Particle.variable("light1", currentlight1Intensity);
    //Particle.variable("light2", currentlight2Intensity);
    //Particle.variable("alarmActive", alarmActive);
    //Particle.variable("alarmTrigger", alarmTrigger);
    //Particle.variable("prEnable", enablePhotoresistor);
    //Particle.variable("mvEnable", enableMovementSensorToTurnLights);

    //Debuging purpose.
    //Particle.variable("movDetected", movementSensorValue);
    //Particle.variable("comValue", arduinoComVal);

    //Set the photoresistor as enable.
    enablePhotoresistor = FALSE;

    //disable movement sensor pin to turn lights.
    enableMovementSensorToTurnLights = FALSE;

    //Set the alarm as disable.
    alarmActive = FALSE;

    //Sends to the arduino board, that the alarm is not active.
    digitalWrite(arduinoOutputCommunicationPin, LOW);

    //Set the alarm password.
    alarmPassword = "1234";

    //Set both lights to turn off.
    currentlight1Intensity = 0;
    currentlight2Intensity = 0;

    //DTH11 Sensor begin.
    dht.begin();
}

void loop() {
    checkAlarmActivationOrDesactivation();
    checkExteriorLightIntensity();
    checkAlarm();
    checkTempAndHum();
}

// This method operates all the funcions related with the lights.
// It recives a String as a command. The format of this string must be like this:
// "LIGHT-LIGHTNUMBER-TURNON/TURNOFF/SETINTENSITY-VALUE" note that all is in
// uppercase, and value is only use when setting intensity and it must be a value
// between 0 and 9. An example is "LIGHT-1-TURNOFF".
// The return value will be an int with 3 digits (if command is correct),
// meaning the following:
// Digit 1 --> Light number
// Digit 2 --> Method selected (1 = Turn On, 2 = Turn Off, 3 = Set Intensity).
// Digit 3 --> Light intensity value (from 0 to 9);
// The return value will be -1 if command is NOT correct
int lightCommands(String command){
    //Remember analog values goes between 0 and 255;
  if(command.substring(0,5) == "LIGHT"){
    //Light 1 controls.
    if(command.substring(6,7) == "1"){
      if(command.substring(8,14) == "TURNON"){
        analogWrite(light1Pin, 255); //Turn on at max intensity.
        currentlight1Intensity = 9; //Posibles values goes between 0 and 9;
        return 119;
      }
      else if(command.substring(8,15) == "TURNOFF"){
        analogWrite(light1Pin, 0); //Turn off.
        currentlight1Intensity = 0; //Posibles values goes between 0 and 9;
        return 120;
      }
      else if(command.substring(8,20) == "SETINTENSITY"){
        String stringValue = String(command.charAt(21));
        int intValue = stringValue.toInt();
        if(intValue > 9 || intValue < 0){
            return -1;
        }
        analogWrite(light1Pin, intValue);
        currentlight1Intensity = intValue;
        return (130 + intValue);
      }
    }

    //Light 2 controls.
    else if(command.substring(6,7) == "2"){
      if(command.substring(8,14) == "TURNON"){
        analogWrite(light2Pin, 255); //Turn on at max intensity.
        currentlight2Intensity = 9; //Posibles values goes between 0 and 9;
        return 219;
      }
      else if(command.substring(8,15) == "TURNOFF"){
        analogWrite(light2Pin, 0); //Turn off.
        currentlight2Intensity = 0; //Posibles values goes between 0 and 9;
        return 220;
      }
      else if(command.substring(8,20) == "SETINTENSITY"){
        String stringValue = String(command.charAt(21));
        int intValue = stringValue.toInt();
        if(intValue > 9 || intValue < 0){
            return -1;
        }
        analogWrite(light2Pin, intValue);
        currentlight2Intensity = intValue;
        return (230 + intValue);
      }
    }
  }
  return -1;
}


//This method operates all the funcions related with the set variables (boolean variables).
//It recives a String as a command. The format of this string must be like this:
//"VARNAME-TRUE/FALSE-VALUE" note that all is in uppercase (except value), and value
//is only use when setting the alarmActive to true or false and it must be a
//string value that represents the alarm password.
//The format to setting the light used by movemment sensor is:
//LIGHTSUSEDBYMOV-LIGHTNUMBER(BETWEEN 0 AND 9).
//The return value will be listed as follow:
// 1--> enablePhotoresistor var was set TRUE.
// 2--> enablePhotoresistor var was set FALSE.
// 3--> enableMovementSensorToTurnLights var was set TRUE.
// 4--> enableMovementSensorToTurnLights var was set FALSE.
// 5--> The alarm was active correctly.
// 6--> The alarm was desactivate correctly.
// 7--> The light used by the movemment sensor was succesfully change.
// 8--> The light used by the photo resistor sensor was succesfully change.
// -1--> Wrong command.
// -2--> Wrong password when trying to activate the alarm.
// -3--> Wrong password when trying to desactivate the alarm.
// -4--> Error setting the light used by the movement sensor. Wrong format.
// -5--> Error setting the light used by the photo resistor sensor. Wrong format.
int setVariables(String command){
    if(command == "ENABLELIGHTSENSOR-TRUE"){
        enablePhotoresistor = TRUE;
        return 1;
    }
    else if(command == "ENABLELIGHTSENSOR-FALSE"){
        enablePhotoresistor = FALSE;
        return 2;
    }
    else if(command == "ENABLEMOVEMENTSENSOR-TRUE"){
        enableMovementSensorToTurnLights = TRUE;
        return 3;
    }
     else if(command == "ENABLEMOVEMENTSENSOR-FALSE"){
        enableMovementSensorToTurnLights = FALSE;
        return 4;
    }
    else if(command.substring(0,16) == "ALARMACTIVE-TRUE"){
        if(command.substring(17, command.length()+1) == alarmPassword){
          if(!alarmActive){
            activateAlarm();
          }
          return 5;
        }
        else{return -2;}
    }
     else if(command.substring(0,17) == "ALARMACTIVE-FALSE"){
       if(command.substring(18, command.length()+1) == alarmPassword){
         if(alarmActive){
           desactivateAlarm();
         }
         return 6;
       }
       else{return -3;}
    }
    else if(command.substring(0,15) == "LIGHTSUSEDBYMOV"){
      if(command.length() == 17){
        String light = command.substring(16, 17);
        int lightNumber = (int) light.charAt(0);
        if(lightNumber >= 0 && lightNumber < 10){
          lightsUsedByMov = lightNumber;
          return 7;
        }
        return -4;
      }
      return -4;
    }
    else if(command.substring(0,14) == "LIGHTSUSEDBYPR"){
      if(command.length() == 16){
        String light = command.substring(15, 16);
        int lightNumber = (int) light.charAt(0);
        if(lightNumber >= 0 && lightNumber < 10){
          lightsUsedByPr = lightNumber;
          return 8;
        }
        return -5;
      }
      return -5;
    }

    else {
        return -1;
    }
}

void checkExteriorLightIntensity(){
    //The value goes from 1400 (dark) to 4095 (high intensity light) with a 10k
    //ohm resistor. Normal good light value is near 4000.
    if(enablePhotoresistor){
        lightSensorValue = analogRead(photoresistorPin);
        if((lightSensorValue <= minOutdoorIntensity) && (getLightIntensity(lightsUsedByPr) == 0)){
            analogWrite(getLightPin(lightsUsedByPr), 255); //Turns on the outdoors light at a max intensity.
            setLightIntensity(lightsUsedByPr, 9);
            lightTurnedOnByPrSensor = true;
            return;
        }
        else if((lightSensorValue > minOutdoorIntensity) && (getLightIntensity(lightsUsedByPr) != 0) && lightTurnedOnByPrSensor){
            analogWrite(getLightPin(lightsUsedByPr), 0);
            setLightIntensity(lightsUsedByPr, 0);
            lightTurnedOnByPrSensor = false;
            return;
        }
    }
    return;
}

void checkAlarm(){
    if(alarmActive){
        movementSensorValue = digitalRead(movementSensorPin);
        if(movementSensorValue || alarmTrigger){
            alarmTrigger = TRUE;

            //Turn on the siren.
            //Modify the frecuency (from 100000 to 0);
            modifyFrequency();
            int currentFreq = ((freqCounter/100000) + 1) * 1000;
            tone(alarmSirenPin, currentFreq);

            if((currentlight1Intensity != 9) && (currentlight2Intensity != 9)){
                //Turn on all the lights when the alarm is trigger.
                analogWrite(light1Pin, 255);
                analogWrite(light2Pin, 255);
                currentlight1Intensity = 9;
                currentlight2Intensity = 9;
            }
        }
    }
    else{
        if(enableMovementSensorToTurnLights){
            movementSensorValue = digitalRead(movementSensorPin);
            if(movementSensorValue){
                if(getLightIntensity(lightsUsedByMov) == 0){ //Only if the indoors light is turn off.
                    analogWrite(getLightPin(lightsUsedByMov), 255); //Turns on the indoors light.
                    setLightIntensity(lightsUsedByMov,9);
                    lightTurnedOnByMovSensor = TRUE;
                }

            }
            else if(lightTurnedOnByMovSensor){ //Only if the light was turned by the sensor and there is no movemment.
                    analogWrite(getLightPin(lightsUsedByMov), 0); //Turns off the indoors light.
                    setLightIntensity(lightsUsedByMov,0);
                    lightTurnedOnByMovSensor = FALSE;
            }
        }
    }
}

void checkTempAndHum(){
    temperature = dht.getTempCelcius();
    humidity = dht.getHumidity();
}

//This method returns an specific variable ask.
//All the variables return are integer type, the boolean are represented as:
// 0 --> FALSE
// 1 --> TRUE
int getVar(String var){
  if(var == "temperature"){
    checkTempAndHum();
    return (int) temperature;
  }
  else if(var == "humidity"){
    checkTempAndHum();
    return (int) humidity;
  }
  else if(var == "light1"){
    return (int) currentlight1Intensity;
  }
  else if(var == "light2"){
    return (int) currentlight2Intensity;
  }
  else if(var == "alarmActive"){
    if(alarmActive == TRUE) return 1;
    else return 0;
  }
  else if(var == "alarmTrigger"){
    if(alarmTrigger == TRUE) return 1;
    else return 0;
  }
  else if(var == "enablePhotoresistor"){
    if(enablePhotoresistor == TRUE) return 1;
    else return 0;
  }
  else if(var == "enableMovementSensorToTurnLights"){
    if(enableMovementSensorToTurnLights == TRUE) return 1;
    else return 0;
  }
  else if(var == "lightsUsedByMov"){
    return lightsUsedByMov;
  }
  else if(var == "lightsUsedByPr"){
    return lightsUsedByPr;
  }
  else return -100;
}

void modifyFrequency(){
    if((freqCounter < 100000) && (increasing)){
        freqCounter++;
    }
    else{
        increasing = false;
        if(freqCounter >= 0){
            freqCounter--;
                if(freqCounter = 0){
                    increasing = true;
                }
        }
    }
}

void checkAlarmActivationOrDesactivation(){
    if(digitalRead(arduinoInputCommunicationPin) == HIGH){
         if(alarmActive){
             desactivateAlarm();
         }
         else if(!alarmActive){
             activateAlarm();
         }
    }
    //arduinoComVal = digitalRead(enableArduinoComunicationPin);
}

void activateAlarm(){
  alarmActive = TRUE;
  //Sends to the arduino board, that the alarm is active.
  digitalWrite(arduinoOutputCommunicationPin, HIGH);
  delay(100); //Waits 0.1 seconds after activates the alarm.
}

void desactivateAlarm(){
  alarmActive = FALSE;
  alarmTrigger = FALSE;
  noTone(alarmSirenPin);
  //Sends to the arduino board, that the alarm is not active.
  digitalWrite(arduinoOutputCommunicationPin, LOW);
  delay(100);
}

int getLightPin(int lightNumber){
  switch (lightNumber) {
    case 1: return light1Pin;
    case 2: return light2Pin;
  }
  return -1;
}

int getLightIntensity(int lightNumber){
  switch (lightNumber) {
    case 1: return currentlight1Intensity;
    case 2: return currentlight2Intensity;
  }
  return -1;
}
void setLightIntensity(int lightNumber,int intensity){
  switch (lightNumber) {
    case 1: currentlight1Intensity = intensity;
    break;
    case 2: currentlight2Intensity = intensity;
    break;
  }
}
