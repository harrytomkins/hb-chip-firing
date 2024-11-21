let point1;
let point2;
let gameStarted = false;

function setup() {
  N = 600;
  createCanvas(N, N);
  A = sq(cos((5*PI)/14))
  r = sqrt((-2*A-1+2*sqrt(3*A*(1-A)))/(4*A-1))
  x = (N/2 * r)
  sx1 = x;
  sy1 = 0;
  sx2 = (-1/2)*x;
  sy2 = (sqrt(3)/2)*x;
  sx3 = (-1/2)*x;
  sy3 = -(sqrt(3)/2)*x;
  R = 10;
  point1 = new Pointer(sx1, sy1, R);
  point2 = new Pointer(sx2, sy2, R);
  point3 = new Pointer(sx3, sy3, R);
  
  button = createButton("Generate tiling");
  button.mousePressed(() => gameStarted = true);
}

function complexAdd([re1,im1],[re2,im2]) {
  return [re1 + re2, im1 + im2];
}

function complexSub([re1,im1],[re2,im2]) {
  return [re1 - re2, im1 - im2];
}

function complexMult([re1,im1],[re2,im2]) {
  return [(re1*re2 - im1*im2),(re1*im2 + im1*re2)];
}

function complexDiv([re1,im1],[re2,im2]) {
  return [(re1*re2 + im1*im2)/(sq(re2) + sq(im2)),(im1*re2 - re1*im2)/(sq(re2) + sq(im2))];
}

function scalarMult(s, [re,im]) {
  return [s * re,s * im];
}

function complexMod([re,im]) {
  return sqrt(sq(re)+sq(im));
}

function complexConj([re,im]) {
  return [re,im*-1];
}

function compMatrixMult([[re1,im1],[re2,im2],[re3,im3],[re4,im4]],[[re5,im5],[re6,im6],[re7,im7],[re8,im8]]) {
  return [complexAdd(complexMult([re1,im1],[re5,im5]), complexMult([re2,im2],[re7,im7])), complexAdd(complexMult([re1,im1],[re6,im6]), complexMult([re2,im2],[re8,im8])), complexAdd(complexMult([re3,im3],[re5,im5]), complexMult([re4,im4],[re7,im7])), complexAdd(complexMult([re3,im3],[re6,im6]), complexMult([re4,im4],[re8,im8]))];
}

function mobiusTransform([[ar,ai],[br,bi],[cr,ci],[dr,di]],[zr,zi]) {
  return complexDiv(complexAdd(complexMult([ar,ai],[zr,zi]),[br,bi]), complexAdd(complexMult([cr,ci],[zr,zi]),[dr,di]));
}

function HtoD([zr,zi]) {
  return mobiusTransform([[1,0],[0,-1],[1,0],[0,1]],[zr,zi]);
}

function DtoH([wr,wi]) {
  return complexDiv(complexMult([0,-1],complexAdd([wr,wi],[1,0])),complexSub([wr,wi],[1,0]))
}

function geoReflect([xr,xi],[ar,ai],r) {
  return complexAdd([ar,ai], scalarMult(sq(r/complexMod(complexSub([xr,xi],[ar,ai]))),complexSub([xr,xi],[ar,ai])));
}

function bigCircle() {
  push();
  noFill();
  stroke(0);
  circle(0,0,N);
  pop();
}

function xcenter(x0,y0,x1,y1)
{
  return (x0**2+y0**2+(N/2)**2-y0*(x1**2+y1**2+(N/2)**2)/y1)/(2*(x0-x1*y0/y1));
}

function ycenter(x0,y0,x1,y1) {
  return (x0**2+y0**2+(N/2)**2-x0*(x1**2+y1**2+(N/2)**2)/x1)/(2*(y0-y1*x0/x1));
}

function Radius(x0,y0,x1,y1) {
  return sqrt(sq(xcenter(x0,y0,x1,y1))+sq(ycenter(x0,y0,x1,y1))-sq(N)/4);
}

function insideArc(x1,y1,x2,y2) {
  let theta = atan2(y1,x1);
  let phi = atan2(y2,x2);
  return ((theta <= phi) && (phi <= theta + PI)) || ((theta <= phi + 2*PI) && (phi <= theta - PI));
}  

function halfCircle(x,y) {
  arc(0,0,N,N,atan2(y,x),atan2(y,x)+PI,CHORD);
}

function hTriangle(x1,y1,x2,y2,x3,y3) {
  push();
  if (collinear(x1,y1,x2,y2) == true) {
    beginClip({invert:!insideArc(x1,y1,x3,y3)});
    halfCircle(x1,y1);
    endClip();
  }
  else {
    beginClip({invert:outsideCircle(x3,y3,x1,y1,x2,y2)});
    circle(xcenter(x1,y1,x2,y2), ycenter(x1,y1,x2,y2), 2*Radius(x1,y1,x2,y2));
    endClip();
  }
  if (collinear(x1,y1,x3,y3) == true) {
    beginClip({invert:!insideArc(x1,y1,x2,y2)});
    halfCircle(x1,y1);
    endClip();
  }
  else {
    beginClip({invert:outsideCircle(x2,y2,x1,y1,x3,y3)});
    circle(xcenter(x1,y1,x3,y3), ycenter(x1,y1,x3,y3), 2*Radius(x1,y1,x3,y3));
    endClip();
  }
  if (collinear(x2,y2,x3,y3) == true) {
    beginClip({invert:!insideArc(x2,y2,x1,y1)});
    halfCircle(x2,y2);
    endClip();
  }
  else {
    beginClip({invert:outsideCircle(x1,y1,x3,y3,x2,y2)});
    circle(xcenter(x3,y3,x2,y2), ycenter(x3,y3,x2,y2), 2*Radius(x3,y3,x2,y2));
    endClip();
  }
  fill(int(random(0,256)),int(random(0,256)),int(random(0,256)));
  //fill('teal');
  strokeWeight(2);
 circle(0,0,N);
  //circle(xcenter(x1,y1,x2,y2), ycenter(x1,y1,x2,y2), 2*Radius(x1,y1,x2,y2));
 // circle(xcenter(x1,y1,x3,y3), ycenter(x1,y1,x3,y3), 2*Radius(x1,y1,x3,y3));
//  circle(xcenter(x3,y3,x2,y2), ycenter(x3,y3,x2,y2), 2*Radius(x3,y3,x2,y2));
  beginClip({invert:true});
  circle(0,0,N);
  endClip();
  pop();
}

function geodesic(x0,y0,x1,y1)
{
  if (collinear(x0,y0,x1,y1) == true) {
    push();
    line(x0,y0,x1,y1);
    pop();
  }
  else {
    push();
    translate(xcenter(x0,y0,x1,y1),ycenter(x0,y0,x1,y1));
    noFill();
    //fill(145,123,202);
    circle(0,0,2*Radius(x0,y0,x1,y1));
    pop();
  }
}

function collinear(x1,y1,x2,y2) {
  let thing = Math.abs((x1*y2) - (x2*y1));
  //print(thing);
  if (thing < 0.0000005) {
    return true;
  }
  else {
    return false;
  }
}

function symR(px,py) {
  return geoReflect([px,py],[xcenter(point1.x,point1.y,point2.x,point2.y), ycenter(point1.x,point1.y,point2.x,point2.y)], Radius(point1.x,point1.y,point2.x,point2.y));
}

function symS(px,py) {
  return geoReflect([px,py],[xcenter(point2.x,point2.y,point3.x,point3.y), ycenter(point2.x,point2.y,point3.x,point3.y)], Radius(point2.x,point2.y,point3.x,point3.y));
}

function symT(px,py) {
  return geoReflect([px,py],[xcenter(point1.x,point1.y,point3.x,point3.y), ycenter(point1.x,point1.y,point3.x,point3.y)], Radius(point1.x,point1.y,point3.x,point3.y));
}

function genPlane(p1x,p1y,p2x,p2y,p3x,p3y,K) {
  triangle(p1x,p1y,p2x,p2y,p3x,p3y);
  if (K > 0) {
      genPlane(symR(p1x,p1y)[0],symR(p1x,p1y)[1],symR(p2x,p2y)[0],symR(p2x,p2y)[1],symR(p3x,p3y)[0],symR(p3x,p3y)[1],K-1); //triangle reflected along R
      genPlane(symS(p1x,p1y)[0],symS(p1x,p1y)[1],symS(p2x,p2y)[0],symS(p2x,p2y)[1],symS(p3x,p3y)[0],symS(p3x,p3y)[1],K-1); //triangle reflected along S
      genPlane(symT(p1x,p1y)[0],symT(p1x,p1y)[1],symT(p2x,p2y)[0],symT(p2x,p2y)[1],symT(p3x,p3y)[0],symT(p3x,p3y)[1],K-1); //triangle reflected along T
  }
}

function mousePressed() {
  point1.pressed(mouseX, mouseY);
  point2.pressed(mouseX, mouseY);
  point3.pressed(mouseX, mouseY);
}

function mouseReleased() {
  point1.notPressed();
  point2.notPressed();
  point3.notPressed();
}

class Pointer {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.offsetX = 0;
    this.offsetY = 0;
    this.dragging = false;
    this.rollover = false;
  }
  show(px, py) {
    if (this.dragging) {
      this.x = px + this.offsetX;
      this.y = py + this.offsetY;
    }
    // translate(N/2, N/2);
    stroke(0);
    fill(145,123,202);
    circle(this.x, this.y, this.r);
  }
  pressed(px, py) {
    if (px > this.x - this.r + N/2 && px < this.x + (2*this.r) + N/2 && py > this.y - this.r + N/2 && py < this.y + (2*this.r) + N/2) {
      this.dragging = true;
      this.offsetX = this.x - px;
      this.offsetY = this.y - py;
    }
  }
  notPressed(px, py) {
    this.dragging = false;
  }
}

function outsideCircle(x0,y0,x1,y1,x2,y2) {
  return (sq(x0 - xcenter(x1,y1,x2,y2)) + sq(y0 - ycenter(x1,y1,x2,y2))) > sq(Radius(x1,y1,x2,y2));
}

function draw() {
  if (gameStarted) {
    translate(N/2,N/2);
    background(220);
    genPlane(point1.x,point1.y,point2.x,point2.y,point3.x,point3.y,11);
    bigCircle();
	noLoop();
  }
}
