import io from 'socket.io-client';

declare var Odometer: any;

console.log('i am loaded, i am lord. i am tachanka');

const serverUrl = 'http://192.168.0.2:58825';

const socket = io(serverUrl);
window.onerror = (message, file, line, col, error) => {
  socket.emit('log', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
};

socket.on('refresh', () => {
  location.reload();
});

let average = 0;
let total = 0;
let max = 0;

// const arrowElement = document.getElementById("arrow");
// const totalElement = document.getElementById('total');
const speedElement = document.getElementById('speed');
const maxElement = document.getElementById('max');
const gaugeElement = document.getElementById('gauge_mid');

socket.on('key', async (key) => {
  average += 1;
  total += 1;
  odometer.update(total);
  console.log(key);
  setTimeout(() => {
    average -= 1;
  }, 1000);
  if(max >= average) return;
  max = average;
});


function padLeft0(num: number) {
  const temp = '000' + `${num}`;
  return temp.slice(-4);
}

function updateInfo() {
  // totalElement.innerText = `${total}`;
  speedElement.innerText = `${padLeft0(average * 60)}`;
  maxElement.innerText = `${padLeft0(max * 60)}`;
}

function tick() {
  const pixelY = 440 - (380 / 30 * average);
  // const degree = 240 / 30 * average - 120;
  // console.log(degree);
  updateInfo();
  // arrowElement.style.transform = `rotate(${degree}deg)`;
  gaugeElement.style.clip = `rect(${pixelY}px, 300px, 440px, 0px)`;
  requestAnimationFrame(tick);
}
tick();








const counterElement = document.getElementById('counter');

(window as any).odometerOptions = {
  // auto: false, // Don't automatically initialize everything with class 'odometer'
  // selector: '.my-numbers', // Change the selector used to automatically find things to be animated
  // format: '(,ddd).dd', // Change how digit groups are formatted, and how many digits are shown after the decimal point
  duration: 60, // Change how long the javascript expects the CSS animation to take
  // theme: 'car', // Specify the theme (if you have more than one theme css file on the page)
  // animation: 'count' // Count is a simpler animation method which just increments the value,
  //                    // use it when you're looking for something more subtle.
};

const odometer = new Odometer({
  el: counterElement,
  value: 0,
  // format: '',
  // theme: 'digital'
});


