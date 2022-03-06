var clicked = true;
var parser;
var currentVal = "";
var started = false;
var startTurn;
var currentX;
var currentY;
var changeJoystick = true;
var changePotentiometer = true;

setInterval(function(){
  changeJoystick = true;
  changePotentiometer = true;
}, 200)

alert("Click to choose a port. Then press the button to begin a game.")

//when the user clicks anywhere on the page
document.addEventListener('click', async () => {
    // Prompt user to select any serial port.
    var port = await navigator.serial.requestPort();
    // be sure to set the baudRate to match the ESP32 code
    await port.open({ baudRate: 115200 });
    let decoder = new TextDecoderStream();
    inputDone = port.readable.pipeTo(decoder.writable);
    inputStream = decoder.readable;
    reader = inputStream.getReader();
    readLoop();
  });

  
  
  
  async function readLoop() {
    counterVal = 0;
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        // Allow the serial port to be closed later.
        console.log("closing connection")
        reader.releaseLock();
        break;
      }
      if (value) {
        for(i in value){
          let x = value.charAt(i)
          if(!started){
            if(x === "\n"){
              started = true;
            }
          }else{
            if(x === "\n"){
              parse(currentVal)
              currentVal = ""
            }else{
              currentVal += x
            }
          }
          
        }
      }
    }
  };

  function parse(jsonVal){
    try{
      let input = JSON.parse(jsonVal)
      if(input.sensor === "button"){
        click()
      }else if(input.sensor === "joystick"){
        calculateMovement(input.data.x, input.data.y)
      }else if(input.sensor === "potentiometer"){
        rotate((input.data * .088))
      }else{
        console.log(input)
      }
    }catch(error){
      console.log(error)
    }
  }
  

  function click(){
    if(clicked){
        clicked = false;
        currentX = Math.floor(Math.random() * 100)
        document.getElementById("mask").style.left = currentX+"%";  
        currentY = Math.floor(Math.random() * 100)
        document.getElementById("mask").style.top = currentY+"%"; 
        startTurn = Math.floor(Math.random() * 360)
        document.getElementById("mask").style.transform = "rotate("+startTurn+"deg)"; 
    }else{
        clicked = true;
        alert("Great Job! Press the button again to reset the game.")
    }
  }

  function calculateMovement(x,y){
    if(x<1900){
      currentX -= 1
    }else if(x>2000){
      currentX += 1
    }
    if(y<1850){
      currentY -= 1
    }else if(y>1950){
      currentY += 1
    }
    currentX%=100
    currentY%=100
    move(currentX, currentY)
  }
  
  function move(x,y){
    if(!clicked && changeJoystick){
        document.getElementById("mask").style.left = x+"%";  
        document.getElementById("mask").style.top = y+"%"; 
        changeJoystick = false;
    }
  }

  function rotate(pct){
    if(!clicked && changePotentiometer){
        let current = document.getElementById("mask").style.transform
        let currentTurn = ""
        for(i in current){
          let x = current.charAt(i)
          if(x >= '0' && x <= '9'){
            currentTurn += i
          }
        }
        document.getElementById("mask").style.transform = "rotate("+(startTurn+pct)%360+"deg)"; 
        changePotentiometer = false;
    }
  }