var g_orden = 1
var time, indices0, blockSize, offset, n;

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
    
    //var size = width; // Usamos el ancho del lienzo como tamaño
    n = 2**g_orden;
    indices0 = [];
    blockSize = (width / n);
    offset = blockSize / 2;

    for (let i = 0; i < n**2; i++) {
        coord = hindex2xy(i, n);
        coord = [coord[0] * blockSize + offset, coord[1]*blockSize+offset]
        circle(coord[0], coord[1], 50);
        indices0.push(coord);
    }

    
    colorMode(HSB, 100);
  }

  function draw() {
    background(0);
    stroke(0,0,100);
    strokeWeight(1);
    line(0, height/2,width,height/2);
    line(width/2, 0, width/2, height);
    //n = 2**g_orden;
    //console.log(indices0);
    //blockSize = (width / n);
    //offset = blockSize / 2;

    
    fill(80, 100, 100);
    noStroke();
    indices0.forEach(i => {
        circle(i[0], i[1], 25);
    });

    noFill();
    stroke(0, 100, 100);
    strokeWeight(7);
    beginShape();
    indices0.forEach(i => {
        vertex(i[0], i[1]);
    });
    endShape();
    //nextIt(indices0);
    //console.log(blockSize);
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

function nextIt(ind0) {
    g_orden += 1;
    n = 2**(g_orden);
    indices0 = [];
    var prevBlockSize = blockSize;
    blockSize = (width / n);
    offset = blockSize / 2;
    var n1 = [];
    var n2 = [];
    var n3 = [];
    var n4 = [];
        ind0.forEach(i => {
        var temp = [i[0]/prevBlockSize, i[1]/prevBlockSize];
        var offsetlocal = width/4;
        n1.push([temp[0]*blockSize, temp[1]*blockSize]);
        n2.push([temp[0]*blockSize, temp[1]*blockSize + (width/2)]);
        n3.push([temp[0]*blockSize + (width/2), temp[1]*blockSize + (width/2)]);
        n4.push([temp[0]*blockSize + (width/2), temp[1]*blockSize]);
    });
    return n1.concat(n2, n3, n4);
}

function rotation(ind0){
    console.log("hhh");
    console.log(indices0);
    for (let i = 0; i < ind0.length/4; i++) {
        tempx = ind0[i][0];
        ind0[i][0] = ind0[i][1];
        ind0[i][1] = tempx;
    }
    for (let i = ind0.length*3/4; i < ind0.length; i++) {
        tempx = ind0[i][0];
        ind0[i][0] = width - ind0[i][1];
        ind0[i][1] = width - tempx;
    }
    console.log(indices0);
    //return ind0;
}

function toggle1(){
    indices0 = nextIt(indices0);
}
function toggle2(){
    rotation(indices0);
}