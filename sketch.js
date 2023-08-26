var orden = 2

function setup() {
    createCanvas(500, 500);
    background(0);
    
    var canvas = document.getElementById('defaultCanvas0');
    //var size = width; // Usamos el ancho del lienzo como tamaño
    
    colorMode(HSB, 100);
    
  }

  function draw() {
    background(0);
    hilbertDemo(canvas, width);
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
  
  function hilbertDemo(canvas, size) {
    var ctx = canvas.getContext('2d');
  
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
  
      
      if (i > 0) { // Evitar la línea desde el primer punto
        line(prev, curr, blockSize, offset);
        //line(prev[0], prev[1], curr[0], curr[1]);
      }
      dot(curr, blockSize, offset);
      //circle(curr[0], blockSize + offset, 7);
  
      prev = curr;
    }
  
    function dot(point, blockSize, offset) {
      var r = 7 - orden;
      if (orden > 6){
        r = 1
      }  
      
      var x = point[0],
        y = point[1];
  
      
      ctx.beginPath();
      ctx.arc(x * blockSize + offset, y * blockSize + offset, r, 0, 2 * Math.PI);
      //ctx.fill();
    }
  
    function line(from, to, blockSize, offset) {
      var off = offset;
  
      ctx.beginPath();
      ctx.moveTo(from[0] * blockSize + off, from[1] * blockSize + off);
      ctx.lineTo(to[0] * blockSize + off, to[1] * blockSize + off);
      ctx.stroke();
    }
  }
  