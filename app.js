let ball = {
    position: { i: 0, j: 0, k: 0 },
    MP: 0,
    AC: 8,
    damageType: 'Bludgeoning'
};

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

    ball.position.i += Math.floor(parseInt(formData.get('i')) / 2);
    ball.position.j += Math.floor(parseInt(formData.get('j')) / 2);
    ball.position.k += Math.floor(parseInt(formData.get('k')) / 2);
    ball.damageType = formData.get('damageType');

    const damage = Math.floor(Math.sqrt(
        ball.position.i ** 2 +
        ball.position.j ** 2 +
        ball.position.k ** 2
    ));

    ball.MP = damage;
    ball.AC = 8 + ball.MP;

    updateStatus(ball);

    document.getElementById('i').value = 0;
    document.getElementById('j').value = 0;
    document.getElementById('k').value = 0;
});

document.getElementById('stop-button').addEventListener('click', function () {
    ball.MP = Math.floor(ball.MP / 2);
    ball.AC = 8 + ball.MP;

    updateStatus(ball);
});

document.getElementById('reset-button').addEventListener('click', function () {
    ball = {
        position: { i: 0, j: 0, k: 0 },
        MP: 0,
        AC: 8,
        damageType: 'Bludgeoning'
    };

    updateStatus(ball);

    document.getElementById('i').value = 0;
    document.getElementById('j').value = 0;
    document.getElementById('k').value = 0;
});

updateStatus(ball);

function updateStatus(ball) {
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    const lines = [`${ball.position.i}, ${ball.position.j}, ${ball.position.k}`, `MP: ${ball.MP}`, `AC: ${ball.AC}`, `${ball.damageType}`];
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    drawCircleWithText(ctx, canvas.width / 2, canvas.height / 2, 50, damageColors[ball.damageType], lines);
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
