#include <ArduinoJson.h>

const int buttonPin = 13;
const int potentiometerPin = 12;
const int joystickPinX = 26;
const int joystickPinY = 27;

int buttonState = 1;
int potentiometerState = 0;
int joystickStateX = 0;
int joystickStateY = 0;


void setup() {
  Serial.begin(115200);
  delay(1000); // give me time to bring up serial monitor
  Serial.println("ESP32 Button Test");
  pinMode(buttonPin, INPUT_PULLUP);
  //need pinModes for joystick and potentiometer
}

void loop(){
  int tempButtonState = digitalRead(buttonPin);
  if(tempButtonState == 0 && buttonState == 1){
    sendButtonClick();
  }
  buttonState = tempButtonState;
  int tempPotentiometerState = analogRead(potentiometerPin);
  if(tempPotentiometerState != potentiometerState){
    potentiometerState = tempPotentiometerState;
    sendPotentiometerChange(potentiometerState);
  }
  potentiometerState = tempPotentiometerState;
  int tempJoystickStateX = analogRead(joystickPinX);
  int tempJoystickStateY = analogRead(joystickPinY);
  if(tempJoystickStateX != joystickStateX || tempJoystickStateY != joystickStateY){
    joystickStateX = tempJoystickStateX;
    joystickStateY = tempJoystickStateY;
    sendJoystickChange(joystickStateX, joystickStateY);
  }
  joystickStateX = tempJoystickStateX;
  joystickStateY = tempJoystickStateY;
}

void sendButtonClick(){
  DynamicJsonDocument doc(260);
  doc["sensor"] = "button";
  doc["data"]   = 1;
  serializeJson(doc, Serial);
  Serial.println("");
}

void sendPotentiometerChange(int val){
  DynamicJsonDocument doc(260);
  doc["sensor"] = "potentiometer";
  doc["data"]   = val;
  serializeJson(doc, Serial);
  Serial.println("");
}

void sendJoystickChange(int x, int y){
  DynamicJsonDocument doc(260);
  doc["sensor"] = "joystick";
  doc["data"]["x"] = x;
  doc["data"]["y"] = y;
  serializeJson(doc, Serial);
  Serial.println("");
}
