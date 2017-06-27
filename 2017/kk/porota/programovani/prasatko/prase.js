
var prase = [
/*
  [0.0, 0.0, 1.0, 0.0],
  [1.0, 0.0, 1.0, 1.0],
  [1.0, 1.0, 0.0, 1.0],
  [0.0, 1.0, 0.0, 0.0],
*/

// telo cunete
  [0.7, 0.2, 0.7, 0.5],
  [0.7, 0.5, 0.3, 0.5],
  [0.3, 0.5, 0.3, 0.2],
  [0.3, 0.2, 0.7, 0.2],

// hlava
  [0.7, 0.2, 0.85, 0.35],
  [0.85, 0.35, 0.7, 0.5],

// predni nohy
  [0.7, 0.5, 0.65, 0.7],
  [0.7, 0.5, 0.75, 0.7],

// predni nohy
  [0.3, 0.5, 0.25, 0.7],
  [0.3, 0.5, 0.35, 0.7],

];

// oko

for (i=0; i<360; i+=30)
{
   r = 0.02;
   a1 = 3.14*i/180;
   a2 = 3.14*(i+30)/180;
   x = 0.75;
   y = 0.32;
   prase.push([x+r*Math.cos(a1),y+r*Math.sin(a1),x+r*Math.cos(a2),y+r*Math.sin(a2)]);
}

// ocasek

r1 = 0.11;
for (i=0; i<720; i+=15)
{
   r2 = r1-0.005/2;
   a1 = 3.14*i/180;
   a2 = 3.14*(i+15)/180;
   x = 0.19;
   y = 0.25;
   prase.push([x+r1*Math.cos(a1),y+r1*Math.sin(a1),x+r2*Math.cos(a2),y+r2*Math.sin(a2)]);
   r1 = r2;
}

function delka_useku(pitem)
{
  return Math.sqrt(Math.pow(pitem[0]-pitem[2],2)+Math.pow(pitem[1]-pitem[3],2));
}

function onLoad()
{
  var c = document.getElementById("chlivek");
  var ctx = c.getContext("2d");
  var h = c.height; 
  var w = c.width;

  var delka = 0;
  prase.forEach(function(item, index) {
	delka += delka_useku(item);
  });
  console.log("Delka"+delka);

  var i_c = 0;
  var i_m = 200.0;

  var ival = window.setInterval(function() {

    d = 0;
    for (j=0; j<prase.length; j++)
    {
      pitem = prase[j];

      dd = delka_useku(pitem);

      if (d+dd > delka * i_c / i_m) 
      {
	  // tahle cara se vejde uz jen castecne
          p = ((delka * i_c / i_m) - d) / dd;
//	  p = 0.5;

      	  ctx.moveTo(pitem[0]*w, pitem[1]*h);
      	  ctx.lineTo(pitem[0]*w+(pitem[2]*w-pitem[0]*w) * p, pitem[1]*h+(pitem[3]*h-pitem[1]*h)*p);
	  break;
      }

      ctx.moveTo(pitem[0]*w, pitem[1]*h);
      ctx.lineTo(pitem[2]*w, pitem[3]*h);
      d += dd;
//      console.log(d+" "+delka);
    }
    i_c++;
    if (i_c>=i_m) window.clearInterval(ival);
    ctx.stroke();
    console.log(d+"  "+delka+" "+p+"  "+j);
  }, 70);
}