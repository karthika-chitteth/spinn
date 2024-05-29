let canvas = document.getElementById('spinnerCanvas');
let spinWheel = canvas.getContext('2d');
let colors = ['#baf4ee', '#4ed4c6', '#069687'];
let spinArr = [];
let isSpinning = false;

function drawWheel() {
    let slices = spinArr.length;
    let sliceAngle = 2 * Math.PI / slices;

    spinWheel.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < slices; i++) {
        spinWheel.beginPath();
        spinWheel.moveTo(canvas.width / 2, canvas.height / 2);
        spinWheel.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, sliceAngle * i, sliceAngle * (i + 1));
        spinWheel.closePath();
        spinWheel.fillStyle = colors[i % colors.length];
        spinWheel.fill();

        spinWheel.save();
        spinWheel.translate(canvas.width / 2, canvas.height / 2);
        spinWheel.rotate(sliceAngle * (i + 0.5));
        spinWheel.textAlign = "end";
        spinWheel.fillStyle = "#000000";
        spinWheel.font = "bold small-caps 20px serif";
        spinWheel.fillText(spinArr[i], canvas.width / 4, 0);
        spinWheel.restore();
    }
}

function addItem() {
    let inputValue = document.getElementById("text").value.trim();
    if (inputValue !== '') {
        let list = document.getElementById("list");
        let div = document.createElement("div");
        div.className = "list-item";
        div.textContent = inputValue;

        const removeInput = document.createElement("span");
        removeInput.innerHTML = '<i class="fa fa-trash-o"></i>';
        removeInput.className = "spin-close";
        removeInput.onclick = function () {
            list.removeChild(div);
            let index = spinArr.indexOf(inputValue);
            if (index !== -1) {
                spinArr.splice(index, 1);
                localStorage.setItem("spinWheelItems", JSON.stringify(spinArr)); 
                drawWheel();
            }
        };
        div.appendChild(removeInput);
        list.appendChild(div);
        spinArr.push(inputValue);
        drawWheel();
        localStorage.setItem("spinWheelItems", JSON.stringify(spinArr)); 
        document.getElementById('text').value = '';
    } else {
        console.log("Input is empty");
    }
}

if (localStorage.getItem("spinWheelItems")) {
    spinArr = JSON.parse(localStorage.getItem("spinWheelItems"));
    displayList(); 
}

drawWheel();

function displayList() {
    let list = document.getElementById("list");
    list.innerHTML = ''; 

    spinArr.forEach(spinWheelItems => {
        let div = document.createElement("div");
        div.className = "list-item";
        div.textContent = spinWheelItems;

        const removeInput = document.createElement("span");
        removeInput.innerHTML = '<i class="fa fa-trash-o"></i>';
        removeInput.className = "spin-close";
        removeInput.onclick = function() {
            list.removeChild(div);
            let index = spinArr.indexOf(spinWheelItems);
            if (index !== -1) {
                spinArr.splice(index, 1);
                localStorage.setItem("spinWheelItems", JSON.stringify(spinArr)); 
                drawWheel(); 
            }
        };
        div.appendChild(removeInput);
        list.appendChild(div);
    });
}


function spin() {
    
    let spinButton = document.getElementById('spinbtn'); 
    if (isSpinning) {
        return;
    }

    isSpinning = true;
    spinButton.disabled = true;
    spinButton.style.cursor = 'none';

    let slices = spinArr.length;
    let spin = (Math.floor((Math.random() * slices) + 1)) * (360/slices);

    rotateElement(canvas, {
        angle: 0,
        animateTo: 360 + spin,
        duration: 2000
    });

    setTimeout(function() {
        let slices = spinArr.length;
        let sliceAngle = 360 / slices;
        let currentAngle = (360 + spin) % 360;

        let resultIndex = Math.floor(((360 - currentAngle - 90) % 360) / sliceAngle);
        resultIndex = (slices + resultIndex) % slices; 

        let resultText = spinArr[resultIndex];

        spinArr = spinArr.filter(function(item) {
            return item !== resultText;
        });

        updateModal(resultText);
        console.log(spinArr);

        let resultButton = document.getElementById("resultButton");
        resultButton.click();
    
        spinButton.disabled = false;
        spinButton.style.cursor = 'pointer'; 
        isSpinning = false;

    }, 2000);

    drawWheel();
}

function updateModal(resultText) {
    let modalBody = document.querySelector('.modal-body p');
    modalBody.innerHTML = resultText ;
}

function rotateElement(element, options) {
    let currentAngle = 0;
    let start = null;

    function step(timestamp) {
        if (!start) start = timestamp;
        var progress = timestamp - start;
        currentAngle = options.angle + (options.animateTo - options.angle) * Math.min(progress / options.duration, 1);

        element.style.transform = 'rotate(' + currentAngle + 'deg)';

        if (progress < options.duration) {
            window.requestAnimationFrame(step);
        }
    }
    window.requestAnimationFrame(step);
}


function clearList() {
    localStorage.clear();
    window.location.reload();
}







    

