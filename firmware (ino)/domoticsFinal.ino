//Dicroica's variables.
int dicroicaIndoorsPin = 0;
int dicroicaOutdoorsPin = 1;
int currentDicroicaIndoorsIntensity;
int currentDicroicaOutdoorsIntensity;

//Photoresistor variables.
int photoresistorPin = A0;
int minOutdoorIntensity = 3000;
bool enablePhotoresistor;
bool lightTurnedOnByPrSensor;

//Alarm variables.
int movementSensorPin = 5;
int alarmSirenPin = 3;
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
int arduinoInputCommunicationPin = 2;
//'arduinoOutputCommunicationPin' --> Is the pin where the particle photon board
//tells the arduino board if the alarm is active or not. If it is HIGH the alarm
//is active, if it is LOW not.
int arduinoOutputCommunicationPin = 6;

//Debugging porpuse variables.
int movementSensorValue;
int lightSensorValue;
int arduinoComVal;

void setup() {
    //Set dicroica light as output
    pinMode(dicroicaIndoorsPin, OUTPUT);
    pinMode(dicroicaOutdoorsPin, OUTPUT);

    //Set photoresistor as input.
    pinMode(photoresistorPin, INPUT);

    //Set momment sensor as input.
    pinMode(movementSensorPin, INPUT);

    //Set arduino input communication pin as input;
    pinMode(arduinoInputCommunicationPin, INPUT);

    //Set arduino output communication pin as output;
    pinMode(arduinoOutputCommunicationPin, OUTPUT);


    //Set some function and variables.
    Particle.function("dicroica", dicroicaCommands);
    Particle.function("setValues",setVariables);
    Particle.variable("indoorLight", currentDicroicaIndoorsIntensity);
    Particle.variable("outdoorLight", currentDicroicaOutdoorsIntensity);
    Particle.variable("alarmActive", alarmActive);
    Particle.variable("alarmTrigger", alarmTrigger);
    Particle.variable("prEnable", enablePhotoresistor);
    Particle.variable("mvEnable", enableMovementSensorToTurnLights);

    //Debuging purpose.
    Particle.variable("movDetected", movementSensorValue);
    Particle.variable("comValue", arduinoComVal);

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
    currentDicroicaIndoorsIntensity = 0;
    currentDicroicaOutdoorsIntensity = 0;
}

void loop() {
    checkAlarmActivationOrDesactivation();
    checkExteriorLightIntensity();
    checkAlarm();
}

//This method operates all the funcions related with the dicroica lights.
//It recives a String as a command. The format of this string must be like this:
//"OUTDOORS/INDOORS-TURNON/TURNOFF/SETINTENSITY-VALUE" note that all is in
//uppercase, and value is only use when setting intensity and it must be a value
//between 0 and 9. An example is "OUTDOORS-TURNOFF".
//The return value will be listed as follow:
// 1--> Outdoors light turn off.
// 2--> Outdoors light turn on.
// 3--> Outdoors light set intensity.
// 4--> Indoors light turn off.
// 5--> Indoors light turn on.
// 6--> Indoors light set intensity.
// -1--> Wrong command.
int dicroicaCommands(String command){
    //Remember analog values goes between 0 and 255;
    //Outdoors Case.
  if(command.substring(0,8) == "OUTDOORS"){
    if(command.substring(9,16) == "TURNOFF"){
      //turn off outdoors light.
      //Serial.println("Outdoor light turn off!");
      analogWrite(dicroicaOutdoorsPin, 0);
      currentDicroicaOutdoorsIntensity = 0;
      return 1;
    }
    else if(command.substring(9,15) == "TURNON"){
      //turn on outdoors light.
      //Serial.println("Outdoor light turn on!");
      analogWrite(dicroicaOutdoorsPin, 255); //Turn on at max intensity.
      currentDicroicaOutdoorsIntensity = 9; //Posibles values goes between 0 and 9;
      lightTurnedOnByPrSensor = false; // Usessless for now. Web page does not allow.
      return 2;
    }
    else if(command.substring(9,21) == "SETINTENSITY"){
      //set intensity outdoors light.
      String stringValue = String(command.charAt(22));
      int intValue = stringValue.toInt();
      //String toPrint = "Outdoor light set intensity: " + String(intValue);
      //Serial.println(toPrint);
      if(intValue > 9){
          intValue = 9;
      }
      analogWrite(dicroicaOutdoorsPin, (intValue * 28));
      currentDicroicaOutdoorsIntensity = intValue;
      lightTurnedOnByPrSensor = false; // Usessless for now. Web page does not allow.
      return 3;
    }
  }
  //Indoors Case.
  else if(command.substring(0,7) == "INDOORS"){
    if(command.substring(8,15) == "TURNOFF"){
      //turn off indoors light.
      //Serial.println("Indoor light turn off!");
      analogWrite(dicroicaIndoorsPin, 0);
      currentDicroicaIndoorsIntensity = 0;
      return 4;
    }
    else if(command.substring(8,14) == "TURNON"){
      //turn on outdoors light.
      //Serial.println("Indoor light turn on!");
      analogWrite(dicroicaIndoorsPin, 255); //Turn on at max intensity.
      currentDicroicaIndoorsIntensity = 9; //Posibles values goes between 0 and 9;
      lightTurnedOnByMovSensor = false; // Usessless for now. Web page does not allow.
      return 5;
    }
    else if(command.substring(8,20) == "SETINTENSITY"){
      //set intensity outdoors light.
      String stringValue = String(command.charAt(21));
      int intValue = stringValue.toInt();
      //String toPrint = "Indoor light set intensity: " + String(intValue);
      //Serial.println(toPrint);
      if(intValue > 9){
          intValue = 9;
      }
      analogWrite(dicroicaIndoorsPin, (intValue * 28));
      currentDicroicaIndoorsIntensity = intValue;
      lightTurnedOnByMovSensor = false; // Usessless for now. Web page does not allow.
      return 6;
    }
  }
  else return -1;
}

//This method operates all the funcions related with the set variables (boolean variables).
//It recives a String as a command. The format of this string must be like this:
//"VARNAME-TRUE/FALSE-VALUE" note that all is in uppercase (except value), and value
//is only use when setting the alarmActive to true or false and it must be a
//string value that represents the alarm password.
//The return value will be listed as follow:
// 1--> enablePhotoresistor var was set TRUE.
// 2--> enablePhotoresistor var was set FALSE.
// 3--> enableMovementSensorToTurnLights var was set TRUE.
// 4--> enableMovementSensorToTurnLights var was set FALSE.
// 5--> The alarm was active correctly.
// 6--> The alarm was desactivate correctly.
// -1--> Wrong command.
// -2--> Wrong password when trying to activate the alarm.
// -3--> Wrong password when trying to desactivate the alarm.
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
    else {
        return -1;
    }

}

void checkExteriorLightIntensity(){
    //The value goes from 1400 (dark) to 4095 (high intensity light) with a 10k
    //ohm resistor. Normal good light value is near 4000.
    if(enablePhotoresistor){
        lightSensorValue = analogRead(photoresistorPin);
        if((lightSensorValue <= minOutdoorIntensity) && (currentDicroicaOutdoorsIntensity == 0)){
            analogWrite(dicroicaOutdoorsPin, 255); //Turns on the outdoors light at a max intensity.
            currentDicroicaOutdoorsIntensity = 9; //Posibles values goes between 0 and 9.
            lightTurnedOnByPrSensor = true;
        return;
        }
        else if((lightSensorValue > minOutdoorIntensity) && (currentDicroicaOutdoorsIntensity != 0) && lightTurnedOnByPrSensor){
            analogWrite(dicroicaOutdoorsPin, 0);
            currentDicroicaOutdoorsIntensity = 0;
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

            if((currentDicroicaOutdoorsIntensity != 9) && (currentDicroicaIndoorsIntensity != 9)){
                //Turn on all the lights when the alarm is trigger.
                analogWrite(dicroicaOutdoorsPin, 255);
                analogWrite(dicroicaIndoorsPin, 255);
                currentDicroicaOutdoorsIntensity = 9;
                currentDicroicaIndoorsIntensity = 9;
            }
        }
    }
    else{
        if(enableMovementSensorToTurnLights){
            movementSensorValue = digitalRead(movementSensorPin);
            if(movementSensorValue){
                if(currentDicroicaIndoorsIntensity == 0){ //Only if the indoors light is turn off.
                    analogWrite(dicroicaIndoorsPin, 255); //Turns on the indoors light.
                    currentDicroicaIndoorsIntensity = 9;
                    lightTurnedOnByMovSensor = TRUE;
                }

            }
            else if(lightTurnedOnByMovSensor){ //Only if the light was turned by the sensor and there is no movemment.
                    analogWrite(dicroicaIndoorsPin, 0); //Turns off the indoors light.
                    currentDicroicaIndoorsIntensity = 0;
                    lightTurnedOnByMovSensor = FALSE;
            }
        }
    }
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
