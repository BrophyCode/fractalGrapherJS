const canvas = document.getElementById("imgCanvas");
const ctx = canvas.getContext("2d");


tf.tidy(()=>{
    let cReal = tf.linspace(-2,2, canvas.width);
    let cImag = tf.linspace(2,-2, canvas.height);
    [cReal, cImag] = tf.meshgrid(cReal,cImag);

    let zReal = tf.zeros(cReal.shape);
    let zImag = tf.zeros(cImag.shape);
    let oldzReal = zReal;
    count = zReal;

    for(let i=0;i<50;i++){
        zReal = zReal.square().sub(zImag.square()).add(cReal);
        zImag = oldzReal.mul(zImag).mul(2).add(cImag);
        oldzReal = zReal;
        count = count.add(tf.where(zReal.square().add(zImag.square()).less(4),0,1));
    }
    
    let c = tf.complex(cReal, cImag);
    let z = tf.complex(zReal, zImag);
    
    //let result = tf.where(zReal.square().add(zImag.square()).less(4),1,0);
    let result = hToRGB(count.mul(1));
    
    tf.browser.toPixels(result, canvas);
})

console.log(performance.now());
console.log(tf.memory());

/* Tensors are disposed
canvas.addEventListener("click", getPixel);

function getPixel(event){
    let x = event.layerX;
    let y = event.layerY;
    console.log(zReal.arraySync()[y][x]);
    console.log(zImag.arraySync()[y][x]);
}*/

function hToRGB(h){
    return tf.tidy(()=>{
        let s = 1,
        l = 0.5,
        c = 255* (1 - Math.abs(2 * l - 1)) * s;

        let x = h.div(60).mod(2).sub(1).abs().neg().add(1).mul(c);
        
        x = x.reshape([1,h.shape[0]*h.shape[1]]);


        function createRGB(a){
            const n = tf.fill([1,h.shape[0]*h.shape[1]], 255);
            const m = tf.fill([1,h.shape[0]*h.shape[1]], 0);
            switch(a){
                case 1: r = n; g = x; b = m; break;
                case 2: r = x; g = n; b = m; break;
                case 3: r = m; g = n; b = x; break;
                case 4: r = m; g = x; b = n; break;
                case 5: r = x; g = m; b = n; break;
                case 6: r = n; g = m; b = x; break;
                case 7: r = m, g = m, b = m; break;
            }
            return tf.stack([r,g,b]).transpose().reshape([h.shape[0],h.shape[1],3]);
        }
    
        let result = tf.where(h.equal(0).reshape([h.shape[0], h.shape[1], 1]), createRGB(7),
        tf.where(h.greaterEqual(  1).logicalAnd(h.less( 60)).reshape([h.shape[0], h.shape[1], 1]), createRGB(1), 
        tf.where(h.greaterEqual( 60).logicalAnd(h.less(120)).reshape([h.shape[0], h.shape[1], 1]), createRGB(2),
        tf.where(h.greaterEqual(120).logicalAnd(h.less(180)).reshape([h.shape[0], h.shape[1], 1]), createRGB(3),
        tf.where(h.greaterEqual(180).logicalAnd(h.less(240)).reshape([h.shape[0], h.shape[1], 1]), createRGB(4),
        tf.where(h.greaterEqual(240).logicalAnd(h.less(300)).reshape([h.shape[0], h.shape[1], 1]), createRGB(5),
        tf.where(h.greaterEqual(300).logicalAnd(h.less(360)).reshape([h.shape[0], h.shape[1], 1]), createRGB(6), 0)))))));
        
        return result.cast("int32");
    })
}