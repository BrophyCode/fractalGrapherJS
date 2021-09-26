const canvas = document.getElementById("imgCanvas");
const ctx = canvas.getContext("2d");

let cReal = tf.linspace(-2,2, canvas.width);
let cImag = tf.linspace(2,-2, canvas.height);
[cReal, cImag] = tf.meshgrid(cReal,cImag);

let zReal = tf.zeros(cReal.shape);
let zImag = tf.zeros(cImag.shape);
let oldzReal = zReal;

for(let i=0;i<50;i++){
    zReal = zReal.square().sub(zImag.square()).add(cReal);
    zImag = oldzReal.mul(zImag).mul(2).add(cImag);
    oldzReal = zReal;
}

let c = tf.complex(cReal, cImag);
let z = tf.complex(zReal,zImag);

let result = tf.where(tf.logicalAnd(tf.logicalAnd(zReal.less(2), zReal.greater(-2)), tf.logicalAnd(zImag.less(2), zImag.greater(-2))),1,0);


tf.browser.toPixels(result, canvas)
console.log(tf.memory());