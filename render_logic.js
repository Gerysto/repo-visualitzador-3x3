const PI = 180.0;//3.141592653589;

// Corners: 

    // UP
const UBL = new J3DIMatrix4();                           UBL.translate(-2,2,-2); 
const UBR = new J3DIMatrix4(); UBR.rotate(-PI/2, 0,1,0); UBR.translate(-2,2,-2); 
const UFR = new J3DIMatrix4(); UFR.rotate( PI  , 0,1,0); UFR.translate(-2,2,-2);
const UFL = new J3DIMatrix4(); UFL.rotate( PI/2, 0,1,0); UFL.translate(-2,2,-2);

    // DOWN
const DBL = new J3DIMatrix4();                           DBL.rotate(PI, 1, 0, 0); DBL.rotate(PI/2, 0, 1, 0); DBL.translate(-2,2,-2);
const DBR = new J3DIMatrix4(); DBR.rotate(-PI/2, 0,1,0); DBR.rotate(PI, 1, 0, 0); DBR.rotate(PI/2, 0, 1, 0); DBR.translate(-2,2,-2);
const DFR = new J3DIMatrix4(); DFR.rotate( PI  , 0,1,0); DFR.rotate(PI, 1, 0, 0); DFR.rotate(PI/2, 0, 1, 0); DFR.translate(-2,2,-2);
const DFL = new J3DIMatrix4(); DFL.rotate( PI/2, 0,1,0); DFL.rotate(PI, 1, 0, 0); DFL.rotate(PI/2, 0, 1, 0); DFL.translate(-2,2,-2);

const corner_TG = [UBL, UBR, UFR, UFL, DBL, DBR, DFR, DFL];

// Edges:

    // Top:
const UB = new J3DIMatrix4(); UB.translate(0, 2, -2);
const UR = new J3DIMatrix4(); UR.rotate(-PI/2, 0, 1, 0); UR.translate(0, 2, -2);
const UF = new J3DIMatrix4(); UF.rotate( PI  , 0, 1, 0); UF.translate(0, 2, -2);
const UL = new J3DIMatrix4(); UL.rotate( PI/2, 0, 1, 0); UL.translate(0, 2, -2);

    // Middle:
const BL = new J3DIMatrix4(); BL.rotate( PI/2, 0, 1, 0); BL.rotate(-PI/2, 0, 0, 1); BL.translate(0, 2, -2); 
const BR = new J3DIMatrix4(); BR.rotate(-PI/2, 0, 1, 0); BR.rotate( PI/2, 0, 0, 1); BR.translate(0, 2, -2);
const FL = new J3DIMatrix4(); FL.rotate( PI/2, 0, 1, 0); FL.rotate( PI/2, 0, 0, 1); FL.translate(0, 2, -2);  
const FR = new J3DIMatrix4(); FR.rotate(-PI/2, 0, 1, 0); FR.rotate(-PI/2, 0, 0, 1); FR.translate(0, 2, -2); 

    // Down:
const DB = new J3DIMatrix4(); DB.rotate(PI, 0, 0, 1); DB.multiply(UB) //); DB.translate(0, 0, 1);
const DR = new J3DIMatrix4(); DR.rotate(PI, 1, 0, 0); DR.multiply(UR) //DB); DR.rotate(-PI/2, 0, 1, 0);
const DF = new J3DIMatrix4(); DF.rotate(PI, 0, 0, 1); DF.multiply(UF) //DR); DF.rotate(-PI/2, 0, 1, 0);
const DL = new J3DIMatrix4(); DL.rotate(PI, 1, 0, 0); DL.multiply(UL) //DF); DL.rotate(-PI/2, 0, 1, 0);

const edge_TG = [UB, UR, UF, UL, BL, BR, FR, FL, DB, DR, DF, DL];

// Centers:

const U = new J3DIMatrix4(); U.translate(0,2,0);
const D = new J3DIMatrix4(); D.rotate(PI, 0,0,1); D.multiply(U);
const B = new J3DIMatrix4(); B.rotate(-PI/2, 1,0,0); B.multiply(U);
const R = new J3DIMatrix4(); R.rotate(-PI/2, 0,1,0); R.multiply(B);
const F = new J3DIMatrix4(); F.rotate(-PI/2, 0,1,0); F.multiply(R);
const L = new J3DIMatrix4(); L.rotate(-PI/2, 0,1,0); L.multiply(F);

const center_TG = [U, R, F, D, L, B];

const cubeTransform = J3DIMatrix4(); cubeTransform.scale(0.7);