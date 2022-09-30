// https://lancaster-university.github.io/microbit-docs/resources/bluetooth/bluetooth_profile.html
// An implementation of Nordic Semicondutor's UART/Serial Port Emulation over Bluetooth low energy

const UART_SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";

// Allows the micro:bit to transmit a byte array
const UART_TX_CHARACTERISTIC_UUID = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";

// Allows a connected client to send a byte array
const UART_RX_CHARACTERISTIC_UUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";

screen.orientation.lock("landscape");

let uBitDevice;
let rxCharacteristic;

let handpose;
let video;
let hands = [];
let tipX8 = 0;
let tipY8 = 0;

// Variables for index fingertip position x and y
let px;
let py;
// variables to make sure data only sends once to micro:bit
let red = true;
let green = true;
let blue = true;
let lightOff = true;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);

  //============== Create buttons ==============================
  const connectButton = createButton("Connect");
  connectButton.mousePressed(connectButtonPressed);

  const disconnectButton = createButton("Disconnect");
  disconnectButton.mousePressed(disconnectButtonPressed);
  // End Buttons ==============================================================

  handpose = ml5.handpose(video, modelReady);

  // This sets up an event that fills the global variable "predictions"
  // with an array every time new hand poses are detected
  handpose.on("hand", (results) => {
    hands = results;
  });

  // Hide the video element, and just show the canvas
  video.hide();
}

function modelReady() {
  console.log("Model ready!");
}

function draw() {
  background("#badaff");
  noStroke();
  // red square
  fill(255, 0, 0);
  rect(200, 200, 50, 50);
  // green square
  fill(0, 255, 0);
  rect(295, 200, 50, 50);
  // blue square
  fill(0, 0, 255);
  rect(390, 200, 50, 50);
  // black square
  fill(0);
  rect(10, 10, 50, 50);

  // call function to draw all keypoints
  drawKeypoints();
  // call function to check if index fingertip position is inside square
  checkDistance();
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  for (let i = 0; i < hands.length; i++) {
    const hand = hands[i];

    for (let j = 0; j < hand.landmarks.length; j++) {
      const keypoint = hand.landmarks[j];
      //  console.log(hand);

      // Uncomment below for showing keypoint numbers on their positions

      //   stroke(0);
      //   fill(0);
      //   strokeWeight(1);
      //   textSize(20);
      //   text(j ,keypoint[0]+5, keypoint[1] )

      fill(0);
      noStroke();
      ellipse(keypoint[0], keypoint[1], 10, 10);

      // index finger tip
      if (j == 8) {
        tipX8 = keypoint[0];
        tipY8 = keypoint[1];
        fill(255);

        ellipse(tipX8, tipY8, 10, 10);
      }
    }
  }
}
//function for measuring if index fingertip is inside colored boxes
function checkDistance(error) {
  px = tipX8;
  py = tipY8;

  // show x and y position index fingertip
  fill(0);
  textSize(24);
  text("Indexfinger x position " + nfc(px, 0), 100, 50);
  text("Indexfinger y position " + nfc(py, 0), 100, 80);

  if (error) {
    console.error(error);
  }

  const redSquare = px > 200 && px < 250 && py > 200 && py < 250;
  const greenSquare = px > 295 && px < 345 && py > 200 && py < 250;
  const blueSquare = px > 390 && px < 440 && py > 200 && py < 250;
  const blackSquare = px > 20 && px < 70 && py > 20 && py < 70;

  if (redSquare && red) {
    gotLabel("0");
    console.log("Red");
    red = false;
    green = true;
    blue = true;
    lightOff = true;
  } else if (greenSquare && green) {
    gotLabel("1");
    console.log("Green");
    red = true;
    green = false;
    blue = true;
    lightOff = true;
  } else if (blueSquare && blue) {
    gotLabel("2");
    console.log("Blue");
    red = true;
    green = true;
    blue = false;
    lightOff = true;
  } else if (blackSquare && lightOff) {
    gotLabel("3");
    console.log("Light off");
    red = true;
    green = true;
    blue = true;
    lightOff = false;
  }
}

// Functions for buttons ==========================================
async function connectButtonPressed() {
  try {
    console.log("Requesting Bluetooth Device...");
    uBitDevice = await navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: "BBC micro:bit" }],
      optionalServices: [UART_SERVICE_UUID],
    });

    console.log("Connecting to GATT Server...");
    const server = await uBitDevice.gatt.connect();

    console.log("Getting Service...");
    const service = await server.getPrimaryService(UART_SERVICE_UUID);

    console.log("Getting Characteristics...");
    const txCharacteristic = await service.getCharacteristic(
      UART_TX_CHARACTERISTIC_UUID
    );
    txCharacteristic.startNotifications();
    txCharacteristic.addEventListener(
      "characteristicvaluechanged",
      onTxCharacteristicValueChanged
    );
    rxCharacteristic = await service.getCharacteristic(
      UART_RX_CHARACTERISTIC_UUID
    );
  } catch (error) {
    console.log(error);
  }
}

function disconnectButtonPressed() {
  if (!uBitDevice) {
    return;
  }

  if (uBitDevice.gatt.connected) {
    uBitDevice.gatt.disconnect();
    console.log("Disconnected");
  }
}
//End Functions for buttons ===================================================================

// Functions for sending labels to microbit=====================================================
async function gotLabel(num) {
  if (!rxCharacteristic) {
    return;
  }
  if (num == "0" && uBitDevice.gatt.connected) {
    try {
      let encoder = new TextEncoder();
      rxCharacteristic.writeValue(encoder.encode("0\n"));
    } catch (error) {
      console.log(error);
    }
  } else if (num == "1" && uBitDevice.gatt.connected) {
    try {
      let encoder = new TextEncoder();
      rxCharacteristic.writeValue(encoder.encode("1\n"));
    } catch (error) {
      console.log(error);
    }
  } else if (num == "2" && uBitDevice.gatt.connected) {
    try {
      let encoder = new TextEncoder();
      rxCharacteristic.writeValue(encoder.encode("2\n"));
    } catch (error) {
      console.log(error);
    }
  } else if (num == "3" && uBitDevice.gatt.connected) {
    try {
      let encoder = new TextEncoder();
      rxCharacteristic.writeValue(encoder.encode("3\n"));
    } catch (error) {
      console.log(error);
    }
  }
}
// End functions för sending labels to microbit========================

function onTxCharacteristicValueChanged(event) {
  let receivedData = [];
  for (var i = 0; i < event.target.value.byteLength; i++) {
    receivedData[i] = event.target.value.getUint8(i);
  }
}
