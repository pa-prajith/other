String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, "");
};



const deepCopyFunction = (inObject) => {
  let outObject, value, key

  if (typeof inObject !== "object" || inObject === null) {
    return inObject // Return the value if inObject is not an object
  }

  // Create an array or object to hold the values
  outObject = Array.isArray(inObject) ? [] : {}

  for (key in inObject) {
    value = inObject[key]

    // Recursively (deep) copy for nested objects, including arrays
    outObject[key] = deepCopyFunction(value)
  }

  return outObject
}

 // -------------
function myFunction(successCallback, failureCallback, someParam) {
    setTimeout(_ => successCallback('ok:' + someParam), 100);
}

function myPromisify(f) {
    return function(...args) {
        return new Promise( (resolve, reject) => f(resolve, reject, ...args) );
    }
}

async function test() {
    const myFunctionAsync = myPromisify(myFunction);
    console.log(await myFunctionAsync('someParam')); // success
}

test();

// --------

function load() {
    return new Promise(function(resolve, reject) {
        window.onload = resolve;
    });
}

load().then(function() {
    // Do things after onload
});

//--------

const myJquery = (el) => ({
    addClass: (className) => {
        el.classList.add(className);
        return myJquery(el);
    },
    removeClass: (className) => {
        el.classList.remove(className);
        return myJquery(el);
    }
});

const $ = (el) => myJquery(document.querySelector(el));

$('#container').addClass('blue').addClass('green').removeClass('blue');


//------- sleep
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ----- Sequential processing

const arr = [1, 2, 3];

const res = await arr.reduce(async (memo, v) => {
    const results = await memo;
    console.log(`S ${v}`)
    await sleep(10);
    console.log(`F ${v}`);
    return [...results, v + 1];
}, []);

// ------- Parallel processing

const arr = [30, 10, 20, 20, 15, 20, 10];


const res = await Promise.map(arr, async (v) => {
    console.log(`S ${v}`)
    await sleep(v);
    console.log(`F ${v}`);
    return v + 1;
}, {concurrency: 2});


// -- debouncing

function debounce(func, timeout = 300){
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}
function saveInput(){
  console.log('Saving data');
}
const processChange = debounce(() => saveInput());

function debounce_leading(func, timeout = 300){
  let timer;
  return (...args) => {
    if (!timer) {
      func.apply(this, args);
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
    }, timeout);
  };
}

// -- throatling


// our simple throttle function
function throttle (callback, limit) {
    var wait = false;                  // Initially, we're not waiting
    return function () {               // We return a throttled function
        if (!wait) {                   // If we're not waiting
            callback.call();           // Execute users function
            wait = true;               // Prevent future invocations
            setTimeout(function () {   // After a period of time
                wait = false;          // And allow future invocations
            }, limit);
        }
    }
}

// the function that you want to be throttled
function doStuff(){

    // do some stuff

}

// On scroll, allow function to run at most 1 time per 100ms
window.addEventListener("scroll", throttle(doStuff, 100));
