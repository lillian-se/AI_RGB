# AI_RGB with ml5.js HandPose

![RGBProject](https://user-images.githubusercontent.com/77015337/193022899-5b89de23-2f7d-44b0-8226-91773f2e299c.jpg)


This project uses a micro:bit that communicate via Bluetooth with computer. 
Ml5.js and p5.js libraries are used to program an app with AI. 
Handpose is a machine-learning model that allows for palm detection and hand-skeleton finger tracking in the browser. 
It can detect a maximum of one hand at a time and provides 21 3D hand keypoints that describe important locations on the palm and fingers.
By holding up your hand in front of the web camera the program detects it and shows it on screen.
I used the position of tip och Indexfinger to calculate when it points on the colored squares in app. 
The RGB led on micro:bit changes color depending on whitch square is "touched" 
