#include <Keypad.h>
#include <LiquidCrystal.h>

//Particle pin output communication.(Used for telling the particle photon to
//turn on/off the alarm). This pin will send 'HIGH' to the particle photon if
//the password is correct, and 'LOW' if not. The default value is 'LOW' (sended
//all the time).
int enableOutputComPin = 12;

//Particle pin input communication. (Used for knowing if the alarm is active or
//not). This pin will receive 'HIGH' from the particle photon if
//the alarm is on, and 'LOW' if alarm is off.
int enableInputComPin = 11;

//Password variables
String currentPassword;
String password = "1234";

//Key pad variables
const byte Filas = 4; //KeyPad de 4 filas
const byte Cols = 4; //y 4 columnas
byte Pins_Filas[] = {2, 3, 4, 5}; // Pines Arduino para las columnas.
byte Pins_Cols[] = {6, 7, 8, 9}; //Pines Arduino para las filas.
char Teclas [ Filas ][ Cols ] =
    {
        {'1','2','3','A'},
        {'4','5','6','B'},
        {'7','8','9','C'},
        {'*','0','#','D'}
     };
Keypad Teclado = Keypad(makeKeymap(Teclas), Pins_Filas, Pins_Cols, Filas, Cols);

//Lcd configuration
int rsPin = A5;
int enablePin = A4;
int d4Pin = A3;
int d5Pin = A2;
int d6Pin = A1;
int d7Pin = A0;
LiquidCrystal lcd(rsPin,enablePin,d4Pin,d5Pin,d6Pin,d7Pin);

void setup() {
  lcd.begin(16,2);
  pinMode(enableOutputComPin, OUTPUT);
  pinMode(enableInputComPin, INPUT);
  digitalWrite(enableOutputComPin, LOW);
  Serial.begin(9600);
}

void loop() {
  digitalWrite(enableOutputComPin, LOW);
  lcd.setCursor(0,0);
  lcd.print("Enter Password: ");
  lcd.setCursor(0,1);
  lcd.print(currentPassword);
  int pulsacion = Teclado.getKey();

  //If the "A" key is press, check the password and send it (if it is corrects).
  if(pulsacion == 65){
    if(currentPassword == password){
      lcd.clear();
      lcd.setCursor(0,0);
      lcd.print("Password Correct!");
      currentPassword = ""; //Reset the password wrote.

      //Sends the signal to the particle photon.
      digitalWrite(enableOutputComPin, HIGH);
      delay(100);
      digitalWrite(enableOutputComPin, LOW);

      //If the alarm was activate.
      if(digitalRead(enableInputComPin) == HIGH){
        lcd.setCursor(0,1);
        lcd.print("Alarm activated");
      }
      else{
        lcd.setCursor(0,1);
        lcd.print("Alarm desativated");
      }
      delay(2000); //Reading lcd porpuse.
      lcd.clear();
    }
    else{
      lcd.clear();
      currentPassword = ""; //Reset the password wrote.
      lcd.setCursor(0,0);
      lcd.print("Wrong password!");
      lcd.setCursor(0,1);
      lcd.print("Try again.");
      delay(3000); //Reading lcd porpuse.
      lcd.clear();
    }
  }
  //If another key is press.
  else if (pulsacion != 0){
    //If the "D" key is press, reset the current password.
    if(pulsacion == 49){
      lcd.clear();
      currentPassword = "";
    }
    //If the "B" key is press, display the current state of the alarm.
    else if(pulsacion == 51){
      lcd.clear();
      lcd.setCursor(0,0);

      if(digitalRead(enableInputComPin) == HIGH){
        lcd.print("The alarm is on");
        delay(3000); //Reading lcd porpuse.
      }
      else{
        lcd.print("The alarm is off");
        delay(3000); //Reading lcd porpuse.
      }

    }
    //If the key press is neither "A" or "D", add this char to the current password.
    else{
       //Add a new char to the current password.
       currentPassword+=getCharFromCode(pulsacion);
       }
  }
}

String getCharFromCode(int code){
  String value;
  switch(code){
      case 55: value="0";
      break;
      case 68: value="1";
      break;
      case 67: value="2";
      break;
      case 66: value="3";
      break;
      case 35: value="4";
      break;
      case 57: value="5";
      break;
      case 54: value="6";
      break;
      case 48: value="7";
      break;
      case 56: value="8";
      break;
      case 53: value="9";
      break;
      //Keys not used!
//      case 65: value="A";
//      break;
//      case 51: value="B";
//      break;
//      case 50: value="C";
//      break;
//      case 49: value="D";
//      break;
//      case 42: value="*";
//      break;
//      case 52: value="#";
//      break;
      }
      return value;
}
