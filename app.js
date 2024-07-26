const damageColors = {
    Acid: '#98FB98',
    Bludgeoning: '#DCDCDC',
    Cold: '#E0FFFF ',
    Fire: '#b54b26',
    Force: '#6f3f73',
    Lightning: '#addced ',
    Necrotic: '#2E2B5F',
    Piercing: '#F0F0F0',
    Poison: '#006400',
    Psychic: '#ba69c0',
    Radiant: '#fef7b6',
    Slashing: '#E8E8E8',
    Thunder: '#4682B4'
};

document.getElementById('update-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
        damage: parseInt(formData.get('damage')),
        i: parseInt(formData.get('i')),
        j: parseInt(formData.get('j')),
        k: parseInt(formData.get('k')),
        damageType: formData.get('damageType')
    };
    fetch('/BallTracker/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            updateStatus(data);
        })
        .then(() => {
            document.getElementById('i').value = 0;
            document.getElementById('j').value = 0;
            document.getElementById('k').value = 0;
        });
});

document.getElementById('stop-button').addEventListener('click', function () {
    fetch('/BallTracker/stop', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            updateStatus(data);
        });
});

document.getElementById('reset-button').addEventListener('click', function () {
    fetch('/BallTracker/reset', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            updateStatus(data);
        })
        .then(() => {
            document.getElementById('i').value = 0;
            document.getElementById('j').value = 0;
            document.getElementById('k').value = 0;
        });
});


// Initial status fetch
fetch('/BallTracker/status')
    .then(response => response.json())
    .then(data => {
        updateStatus(data);
    });

function updateStatus(data) {
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    const lines = [`${data.position.i}, ${data.position.j}, ${data.position.k}`, `MP: ${data.MP}`, `AC: ${data.AC}`, `${data.damageType}`];
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    drawCircleWithText(ctx, canvas.width / 2, canvas.height / 2, 50, damageColors[data.damageType], lines);
}

//Ball
function drawCircleWithText(ctx, centerX, centerY, radius, color, lines) {
    const outlineColor = darkenColor(color, 30);
    // Draw the main circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 15, 0, 2 * Math.PI);
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.fillStyle = color;
    ctx.fill();
    ctx.stroke();

    // Draw inner circles for decoration
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 5, 0, 2 * Math.PI);
    ctx.strokeStyle = darkenColor(color, 60);
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();

    // Add a glowing effect
    ctx.shadowBlur = 15;
    ctx.shadowColor = color;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 10, 0, 2 * Math.PI);
    ctx.strokeStyle = darkenColor(color, 30);
    ctx.lineWidth = 5;
    ctx.stroke();

    // Reset shadow properties to avoid affecting other drawings
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';

    // Add text inside the circle    
    ctx.fillStyle = getBrightness(color) > 185 ? 'black' : 'white';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Calculate the vertical offset for each line
    const lineHeight = 16; // Adjust this value as needed
    const startY = centerY - (lineHeight * (lines.length - 1)) / 2;

    // Draw each line of text
    lines.forEach((line, index) => {
        ctx.fillText(line, centerX, startY + index * lineHeight);
    });
}

function getBrightness(hexColor) {
    hexColor = hexColor.replace(/^#/, '');

    // Parse the r, g, b values
    const r = parseInt(hexColor.substr(0, 2), 16);
    const g = parseInt(hexColor.substr(2, 2), 16);
    const b = parseInt(hexColor.substr(4, 2), 16);

    // Calculate the brightness
    return (r * 299 + g * 587 + b * 114) / 1000;
}

function darkenColor(hexColor, amount) {
    hexColor = hexColor.replace(/^#/, '');
    let r = parseInt(hexColor.substr(0, 2), 16);
    let g = parseInt(hexColor.substr(2, 2), 16);
    let b = parseInt(hexColor.substr(4, 2), 16);

    r = Math.max(0, r - amount);
    g = Math.max(0, g - amount);
    b = Math.max(0, b - amount);

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
