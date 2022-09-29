# AI_RGB with ml5.js HandPose!

[RGBProject](https://user-images.githubusercontent.com/77015337/193020622-09980813-af61-4fd3-a119-6a1aa9e1ed8a.jpg)

This project uses a micro:bit that communicate via Bluetooth with computer. 
Ml5.js and p5.js libraries are used to program an app with AI. 
Handpose is a machine-learning model that allows for palm detection and hand-skeleton finger tracking in the browser. 
It can detect a maximum of one hand at a time and provides 21 3D hand keypoints that describe important locations on the palm and fingers.
I used the position of tip och Indexfinger to calculate when it points on the colored squares in app. 
The RGB led on micro:bit changes color depending on whitch square is "touched"
