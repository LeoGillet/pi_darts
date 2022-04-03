var circle = {"x": -50, "y": -50, "r": 50};
var darts = {"in": 0, "total": 0};
var new_dart = null;
var dart_n = 0;
var sleep = ms => new Promise(r => setTimeout(r, ms));
var working = false;

function randomInt(min, max) {
    return Math.random() * (max - min) + min;
}

function get_attribute(el, key) {
    return el.getAttribute(key);
}

function set_attribute(el, key, value) {
    el.setAttribute(key, value);
}


function drawDart(cx, cy, isOnTarget, r=0.5) {
    let drawbox = document.getElementById("svg-draw");
    let dart = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    set_attribute(dart, "cx", cx);
    set_attribute(dart, "cy", cy);
    set_attribute(dart, "r", r);
    set_attribute(dart, "class", "dart")
    if (isOnTarget) {
        set_attribute(dart, "fill", "#ff0000");
    } else {
        set_attribute(dart, "fill", "#0000ff");
    }
    drawbox.appendChild(dart);
    return dart;
}

async function throwDart(minx, maxx, miny, maxy) {
    let dart = {}; let onTarget;
    const x = randomInt(minx, maxx);
    const y = randomInt(miny, maxy);
    if ((x-circle.x)**2 + (y-circle.y)**2 < circle.r**2) {
        onTarget = true;
        darts.in ++;
        new_dart = drawDart(x, y, true);
        document.getElementById("in-circle").textContent=darts.in.toString();
    } else {
        onTarget = false;
        new_dart = drawDart(x, y, false);
        document.getElementById("out-circle").textContent=(darts.total-darts.in).toString();
    }
    darts.total++;
    console.info("Dart " + dart_n + " is thrown and lands at ("+dart.x+","+dart.y+").");

    await sleep(10);
    if (onTarget) { // On target
        set_attribute(new_dart, "fill", "#ffb3b3");
    } else {                                                        // Out of target
        set_attribute(new_dart, "fill", "#b3b3ff");
    }
    return {"x": dart.x, "y": dart.y};
}

async function estimatePi() {
   let pi = 4 * (darts.in / darts.total);
   document.getElementById("pi").textContent = pi.toString()
}


async function start() {
    working = true;
    button.removeEventListener("click", start);
    button.addEventListener("click", pause);
    button.innerText = "Pause";
    reset_button.disabled = true;
    do {
        await throwDart(-100, 0, -100, 0);
        await estimatePi();
    } while (working)
}

async function pause() {
    working = false;
    button.removeEventListener("click", pause);
    button.addEventListener("click", start);
    button.innerText = "Resume";
    reset_button.disabled = false;
}

async function reset() {
    darts.in = 0;  darts.total = 0;
    let dart_elements = document.getElementsByClassName('dart');
    while(dart_elements[0]) {
        dart_elements[0].parentNode.removeChild(dart_elements[0]);
    }
    button.innerText = "Start";
}