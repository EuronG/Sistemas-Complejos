var g_orden = 1
var time, t0, t1, indices0, indices1, blockSize, offset, n;

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
    indices1 = indices0;
    
    colorMode(HSB, 100);
  }

  function draw() {
    background(0);
    stroke(0,0,100);
    strokeWeight(1);
    line(0, height/2,width,height/2);
    line(width/2, 0, width/2, height);


    noFill();
    stroke(0, 100, 100);
    strokeWeight(7);
    
    if (time < t1){
        
        for (let j = 0; j < 4; j++) {
            stroke(0, 100, 100);
            noFill();
            beginShape();
            for (let i = 0 + j*4; i < indices1.length*(j+1)/4; i++) {
                k = int(i%indices0.length);
                vertex(map(time, t0, t1, indices0[k][0], indices1[i][0]), map(time, t0, t1, indices0[k][1], indices1[i][1]));
            }
            endShape();

            fill(80, 100, 100);
            noStroke();
            for (let i = 0 + j*4; i < indices1.length*(j+1)/4; i++) {
                k = int(i%indices0.length);
                circle(map(time, t0, t1, indices0[k][0], indices1[i][0]), map(time, t0, t1, indices0[k][1], indices1[i][1]), 10);
            }
        }
        
    } else {
        beginShape();
        indices0 = indices1;
        indices1.forEach(i => {
            vertex(i[0], i[1]);
        });
        endShape();
        fill(80, 100, 100);
        noStroke();
        indices1.forEach(i => {
            circle(i[0], i[1], 10);
        }); 
    }
    
    time += 0.01;
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
    ind1 = ind0;
    g_orden += 1;
    n = 2**(g_orden);
    //indices0 = [];
    var prevBlockSize = blockSize;
    blockSize = (width / n);
    offset = blockSize / 2;
    var n1 = [];
    var n2 = [];
    var n3 = [];
    var n4 = [];
        ind1.forEach(i => {
        var temp = [i[0]/prevBlockSize, i[1]/prevBlockSize];
        n1.push([temp[0]*blockSize, temp[1]*blockSize]);
        n2.push([temp[0]*blockSize, temp[1]*blockSize + (width/2)]);
        n3.push([temp[0]*blockSize + (width/2), temp[1]*blockSize + (width/2)]);
        n4.push([temp[0]*blockSize + (width/2), temp[1]*blockSize]);
    });
    return n1.concat(n2, n3, n4);
}

function rotation(ind0){
    var ind1 = ind0.map((item) => item.slice());
    for (let i = 0; i < ind1.length/4; i++) {
        tempx = ind1[i][0];
        ind1[i][0] = ind1[i][1];
        ind1[i][1] = tempx;
    }
    for (let i = ind1.length*3/4; i < ind1.length; i++) {
        tempx = ind1[i][0];
        ind1[i][0] = width - ind1[i][1];
        ind1[i][1] = width - tempx;
    }
    return ind1;
}

function toggle1(){
    t0 = time;
    t1 = time + 1;
    indices1 = nextIt(indices0);
}
function toggle2(){
    t0 = time;
    t1 = time + 1;
    indices1 = rotation(indices0);
}