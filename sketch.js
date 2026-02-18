
const minRadius = 100;
const maxRadius = 200;
const stepRadius = 5;
const steps = 500;
const circles = [];

var h;
var w;
var cnv;
function setup() {
  h =800;
  w =1600;
  cnv = createCanvas(w, h);
  angleMode (RADIANS)
  centerCanvas()
  drawingCircles()
  
}


function centerCanvas() {
    var x = (windowWidth - w) * 0.5;
    var y = (windowHeight - h) * 0.5;
    cnv.position(x, y);
}



// empilement de cercles en evitant les chevauchements mais en minimisant aussi la distance entre les perimetres des cercles 
function drawingCircles(){
  for(let i=0; i<steps; i++) {
    const x = random(0,w);
    const y = random(0,h);
    increaseDiameter(x,y,minRadius) 
  }
} 

function increaseDiameter(x,y,r){
  if (overlap(x,y,r)&& r==minRadius){return;}
  if(overlap(x,y,r)==true){
    r-=stepRadius;
    let choice = Math.floor(random(0,4))
    if(choice==0||choice==1||choice==2){
      let k = new RecursiveCircle(x,y,2*r,20)
      circles.push(k);
      return;
    }else{
      let k = new Spirale(x,y,2*r,Math.floor(random(12,20)));
      circles.push(k);
      return;
    }
  }
  increaseDiameter(x,y,r+stepRadius)
}

// detection de chevauchements entre les cercles et definition des limites de l'emboitement
function overlap (x,y,r) {
  if(x-r < 4 || x+r > width-4 || y-r < 4 || y+r > height-4) return true;
  for (let i = 0; i < circles.length; i++) {
    let d = dist(circles[i].cx, circles[i].cy, x, y);
    if (d <= (circles[i].diametre) / 2 + r) {
      return true; // ← Chevauchement détecté
    }
  }
  
  return false; 
}

// cette classe permet de dessiner un cercle avec des arcs positinnes a differentes positions sur le perimetre du cercle.
// ces arcs effectuent des rotations avec des vitesses qui dependent du diametre du cercle dans lequel ils sont positionnes
class Spirale{
  constructor(cx,cy,diametre,nb_arc){
  this.cx = cx
  this.cy = cy
  this.diametre = diametre
  this.nb_arc= nb_arc
}
  
  display(){
    strokeWeight(3)
    noFill();
    circle(this.cx, this.cy, this.diametre);
    // Sauvegarder l'état avant clip
    drawingContext.save();
    drawingContext.clip()
    for (let i =0; i<this.nb_arc; i++){
      push()
      translate(this.cx,this.cy)
      rotate (frameCount*0.0005*this.diametre/2)
      let angle = TWO_PI*i/this.nb_arc
      let px= this.cx+ (this.diametre/2 *cos(angle));
      let py= this.cy+ (this.diametre/2 * sin(angle));
      translate(-this.cx,-this.cy)
      translate(px, py)
      rotate(angle)
      noFill();
      strokeWeight(4)
      if(i%2==1){
        stroke(43,255,255);
      }else{
        stroke(0,139,139);
      }
      arc(0, 0, this.diametre, this.diametre, 0, PI);
      pop()  
    }
     drawingContext.restore();
  } 
}

// La classe RecursiveCircle permet de dessiner un cercle avec des arcs formants des demi-cercles de facon recursifs. 
// Cette fois ci les arcs tournent autour du centre du cercle a des vitesses differentes qui dependent de leurs hauteurs(rayons)
class RecursiveCircle{ 
  constructor(cx,cy,diametre,espacement){
  this.cx = cx
  this.cy = cy
  this.diametre = diametre
  this.espacement = espacement
}

  display(){
    this.R_Arc(this.diametre,this.diametre,0,PI)
  }
  
  R_Arc(h,w,S_angle,E_angle){
    
    if(h<10 && w<10){
      return;
    }
    push()
    translate(this.cx,this.cy)
    rotate(frameCount*0.0002*h)  //modifier la vitesse de rotation
    noFill();
    strokeWeight(4)
    if(cos(S_angle)==1){
      stroke(43,255,255)
    }else{
      stroke(0,139,139)
    }
    arc(0,0,h,w,S_angle,E_angle)
    let kx =(w/2)*cos(S_angle)
    let ky = (w/2)*sin(S_angle)
    noStroke()
    fill(173,255,57)
    circle(kx,ky,9)
    pop()
    this.R_Arc(h-this.espacement,w-this.espacement,S_angle+PI,E_angle+PI)
  }
}

function draw() {
  background (0);
  
  for(let i =0; i<circles.length ; i++){
     circles[i].display();
  }
  
  
}