const maxWidth = 200;
const maxHeight = 300;
var svgns = "http://www.w3.org/2000/svg"; // SVG Namespace (in case we need it)
var slices = []; // Array of wheel slice objects
var isSpinning = false; // Is the arrow spinning?
var rotation = 0; // Arrow rotation
var currentSlice = 0; // Current slice the arrow is over
var wheel; // DOM Object for the spinner board
var arrow; // DOM Object for the spinner arrow
var spinButton; // DOM Object for the spin wheel <button>
var numSlices = 8;  // TODO Size of the circle slices ***** MUST update with total of all animals
var categories = [
    {
        animal:'dog',
        color: '#e0edad'
     }, 			{
        animal:'cow',
        color: '#fac34b'
     }, 			{
        animal:'pig',
        color: '#d1e6ff'
     }, 			{
        animal:'dog',
        color: '#e0edad'
     }, 			{
        animal:'cow',
        color: '#fac34b'
     }, 			{
        animal:'pig',
        color: '#d1e6ff'
     }, 			{
        animal:'dog',
        color: '#e0edad'
     }, 			{
        animal:'cow',
        color: '#fac34b'
     }, 			{
        animal:'pig',
        color: '#d1e6ff'
     }];

// Basic wheel "slice" object for drawing SVG
function Slice(num, parent) {
    // Set instance vars
    this.parent = parent;
    this.size = 360/numSlices;
    this.offset = num * this.size;
    this.id = "slice_"+num;
    this.animal = categories[num].animal;
    this.color = categories[num].color;
    // Draw the object
    this.object = this.create();
    this.parent.appendChild(this.object);
}

Slice.prototype = {
    create:function() {
        // Create a group to store the slice in
        var g = document.createElementNS(svgns, "g");
        // Create the slice object
        var slice = document.createElementNS(svgns, "path");
        slice.setAttributeNS(null, "id", this.id);
        var x1 = maxWidth + 180 * Math.cos(Math.PI*(-90+this.offset)/180);
        var y1 = maxHeight + 180 * Math.sin(Math.PI*(-90+this.offset)/180);
        var x2 = maxWidth + 180 * Math.cos(Math.PI*(-90+this.size+this.offset)/180);
        var y2 = maxHeight + 180 * Math.sin(Math.PI*(-90+this.size+this.offset)/180);
        slice.setAttributeNS(null, "d", `M ${maxWidth} ${maxHeight} L ${x1} ${y1} A 180 180 0 0 1 ${x2} ${y2}  Z`);
        // Randomize the color of the slice and finish styling
        slice.setAttributeNS(null, "fill", this.color);
        slice.setAttributeNS(null, "style", "stroke-width:2px");
        // Add the slice to the group
        g.appendChild(slice);
        // Create the highlight for the slice
        var overlay = document.createElementNS(svgns, "path");
        overlay.setAttributeNS(null, "d", `M ${maxWidth} ${maxHeight} L ${x1} ${y1} A 180 180 0 0 1 ${x2} ${y2}  Z`);
        overlay.setAttributeNS(null, "fill", "#FFFFFF");
        overlay.setAttributeNS(null, "style", "stroke-width:1px");
        overlay.setAttributeNS(null, "opacity", "0");
        // Add the highlight for the slice to the group
        g.appendChild(overlay);
        // Create text object for animal name
        var text = document.createElementNS(svgns, "text");
        var x1 = maxWidth + 135 * Math.cos(Math.PI*(-90+(this.size/2 + this.offset))/180);
        var y1 = maxHeight + 135 * Math.sin(Math.PI*(-90+(this.size/2 + this.offset))/180);
        var x2 = maxWidth + 135 * Math.cos(Math.PI*(-90+this.size+this.offset)/180);
        var y2 = maxHeight + 135 * Math.sin(Math.PI*(-90+this.size+this.offset)/180);
        text.setAttributeNS(null, "x", x1);
        text.setAttributeNS(null, "y", y1);
        text.setAttributeNS(null,"font-size","20px"); // *** TODO change text size of aniaml name
        var textNode = document.createTextNode(this.animal);
        text.appendChild(textNode);
        g.appendChild(text);
        // Create image element for animal picture
        var img = document.createElementNS(svgns, "image");
        img.setAttributeNS(null, 'href', 'images/' + this.animal + '.jpg'); // *** TODO alll images must be named category.JPG
        img.setAttributeNS(null, "x", x1);
        img.setAttributeNS(null, "y", y1);
        img.setAttributeNS(null,"width","40px"); // *** TODO change size of animal image
        img.setAttributeNS(null,"height","40px");
        g.appendChild(img);
        return g;
    },
    toggleOverlay:function() {
        var overlay = this.object.childNodes[1];
        if (overlay.getAttribute("opacity") == 0) {
            overlay.setAttributeNS(null, "opacity", 1);
        }
        else {
            overlay.setAttributeNS(null, "opacity", 0);
        }
    }
};

// Toggle the spinning of the wheel
function toggleSpinning() {
    // Toggle the spinning animation
    if (isSpinning) {
        // Stop the arrow
        isSpinning = false;
        console.log(this.currentSlice);
        let animal = slices[this.currentSlice];
        var audio = new Audio('sounds/' + animal.animal + '.mp3'); // TODO all sound files need to be named same as animal list
        audio.play();
        clearInterval(toggleSpinning.spinInt);
        // spinButton.removeAttribute("disabled"); // for pull string
    }
    else {
        // Start spinning the arrow
        isSpinning = true;
        toggleSpinning.spinInt = setInterval(spinWheel, 1000/60);
        // Set how long the wheel will be spinning
        var duration = Math.floor(Math.random() * 2000) + 1000;
        setTimeout(toggleSpinning, duration);
        // Disable the spin button
        // spinButton.setAttribute("disabled", "true"); // for pull string
    }
}

// Animation step for spinning the wheel arrow
function spinWheel() {
    // Rotate the spinner arrow
    rotation = (rotation + 12) % 360;
    arrow.setAttributeNS(null, "transform", `rotate(${rotation},${maxWidth},${maxHeight})`);
    // Highlight the slice the arrow is above
    var newSlice = Math.floor(rotation / (360/numSlices));
    if (newSlice != currentSlice) {
        slices[currentSlice].toggleOverlay();
        slices[newSlice].toggleOverlay();
        currentSlice = newSlice;
    }
}
// Document ready event
document.addEventListener("DOMContentLoaded", function() {
    // Get a handle to all necessary DOM elements
    wheel = document.getElementById("spinner-board"); // DOM Object for the spinner board
    arrow = document.getElementById("spinner-arrow"); // DOM Object for the spinner arrow
    spinButton = document.getElementById("spinner-button"); // DOM Object for the spin wheel <button>
    // Generate the wheel sections
    for (var i = 0; i < numSlices; i++) {
        slices[i] = new Slice(i, wheel);
    }
    // Highlight the first slice
    slices[0].toggleOverlay();
}, false);
