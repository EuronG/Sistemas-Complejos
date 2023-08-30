var g_orden = 4
var time;

function setup() {
    createCanvas(700, 700);
    background(0);
    p1_value = 1;
    p1_prev = 1;
    b1_value = false;
    b2_value = true;
    button1 = createButton("-");
    p1 = createP(p1_value);
    button2 = createButton("+");
    div1 = createDiv();
    div1.child(button1);
    div1.child(p1);
    div1.child(button2);
    button1.mousePressed(toggle1);
    button2.mousePressed(toggle2);
    time = 0;
    
    var canvas = document.getElementById('defaultCanvas0');
    //var size = width; // Usamos el ancho del lienzo como tamaño
    
    colorMode(HSB, 100);
    
  }

  function draw() {
    background(0);
    puntos1 = hilbertDemo(canvas, width, g_orden - 1);
    puntos2 = hilbertDemo(canvas, width, g_orden);
    puntos0 = [];
    for (let i = 0; i < puntos2.length; i++) {
        j = int(map(i, 0, puntos2.length, 0, puntos1.length))
        puntos0.push([map(sin(time), -1, 1, puntos1[j][0], puntos2[i][0]), map(sin(time), -1, 1, puntos1[j][1], puntos2[i][1])])
        //const element = array[i];
    }

    stroke(map(sin(time), -1, 1, 0, 100),100,100);
    strokeWeight(1);
    noFill();
    beginShape();
    for (let i = 0; i < puntos2.length; i++) {
        //stroke(map(i, 0, puntos.length, 0, 100), 100,100);
        vertex(puntos0[i][0] , puntos0[i][1] );
    }
    endShape();

    time += 0.01;
    if (time > 99999){
        time = 0;
    }
  }
  
  function hindex2xy(hindex, N) {
    var positions = [
    /* 0: */ [0, 0],
    /* 1: */ [0, 1],
    /* 2: */ [1, 1],
    /* 3: */ [1, 0]
    ];

    var tmp = positions[last2bits(hindex)];
    hindex = (hindex >>> 2);

    var x = tmp[0];
    var y = tmp[1];

    for (var n = 4; n <= N; n *= 2) {
        var n2 = n / 2;

        switch (last2bits(hindex)) {
        case 0: /* left-bottom */
            tmp = x; x = y; y = tmp;
            break;

        case 1: /* left-upper */
            x = x;
            y = y + n2;
            break;

        case 2: /* right-upper */
            x = x + n2;
            y = y + n2;
            break;

        case 3: /* right-bottom */
            tmp = y;
            y = (n2-1) - x;
            x = (n2-1) - tmp;
            x = x + n2;
            break;
        }

        hindex = (hindex >>> 2);
    }

    return [x, y];

    function last2bits(x) { return (x & 3); }
}
  
  function hilbertDemo(canvas, size, orden) {
    var ctx = canvas.getContext('2d');
    var listica = [];
  
    //stroke(0);
    //ctx.strokeStyle = 'red';
    //fill(0);
    //ctx.fillStyle = 'red';
    strokeWeight(2);
    //ctx.lineWidth = 2;
  
    var N = 2**orden;
  
    var prev = [0, 0],
      curr;
  
    var blockSize = (size / N);
    var offset = blockSize / 2;
  
    for (var i = 0; i < N * N; i += 1) {
      stroke(map(i, 0, N * N, 0, 100), 100, 100);
      fill(map(i, 0, N * N, 0, 100), 100, 100); //Color de los circulos
  
      curr = hindex2xy(i, N);
      console.log(curr);
      curr[0] = curr[0] * blockSize + offset;
      curr[1] = curr[1] * blockSize + offset;
      listica.push(curr);
  
      prev = curr;
    }
    return listica;
  }

  function toggle1(){
    if (p1_value > 1) {
        p1.html(p1_value-1);
        p1_value -= 1;
    }
  }

  function toggle2(){
    if (p1_value < 9) {
        p1.html(p1_value+1);
        p1_value += 1;
    }
  }
  