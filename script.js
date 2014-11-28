var d = document,
        c = d.getElementById('canvas'),
        cx = c.getContext('2d'),
        pAmount = 150,
        particles = [],
        explosions = [],
        m = Math,
        mouseX = m.random()*800,
        mouseY = m.random()*800,
        maxSpeed = Math.random() * 20 + 5;

c.width = window.innerWidth;
c.height = window.innerHeight;

makeParticles(pAmount);

d.onmousemove = function (e) {
    mouseX = e.pageX;
    mouseY = e.pageY;
}

setInterval(draw, 1);

function makeParticles(amount) {
    if (amount > pAmount) {
        amount = pAmount;
    }

    while (amount--) {
        var p = new particle(m.random() * c.width, m.random() * c.height);

        p.size = 0.5;
        
        var rndR = 80 + m.round(m.random() * 170);
        var rndG = 80 + m.round(m.random() * 170);
        var rndB = 80 + m.round(m.random() * 170);

        p.color = 'rgb('+rndR + ',' + rndG + ',' + rndB+')';

        particles.push(p);
    }
    while (particles.length > pAmount) {
        particles.shift();
    }
}

function draw() {

    cx.fillStyle = 'rgba(255,255,255,0.006)';
    cx.fillRect(0, 0, c.width, c.height);

    i = particles.length;

    while (i--) {
        particles[i].update();

        particles[i].render(cx);
    }
}

/**
 particle class
 */
function particle(posX, posY) {

    this.size = 1;
    this.shrink = 1;

    this.posX = posX;
    this.posY = posY;

    this.oldX = posX;
    this.oldY = posY;

    this.dragX = 1;
    this.dragY = 1;

    this.velX = 0;
    this.velY = 0;

    this.alpha = 1;
    this.fade = 0;

    this.gravity = 0;

    this.velm = (m.random() * 3) + 2;

    this.velt = (m.random() * 20) + 8;

    this.color = '0,0,0';
}

particle.prototype.update = function () {
    this.fill = true;

    this.oldX = this.posX;
    this.oldY = this.posY;

    this.alpha -= this.fade;

    this.size *= this.shrink;

    this.size = Math.max(0, this.size);

    this.alpha = Math.max(0, this.alpha);


    var x = this.posX;
    var y = this.posY;

    var speedX = this.velX;
    var speedY = this.velY;

    var targSpeedX = (mouseX - x) / this.velm;
    var targSpeedY = (mouseY - y) / this.velm;

    speedX += (targSpeedX - speedX) / this.velt;
    speedY += (targSpeedY - speedY) / this.velt;

    if (Math.abs(speedX) > maxSpeed) {
        if (speedX > 0) {
            speedX = maxSpeed;
        } else {
            speedX = -maxSpeed;
        }
    }
    if (Math.abs(speedY) > maxSpeed) {
        if (speedY > 0) {
            speedY = maxSpeed;
        } else {
            speedY = -maxSpeed;
        }
    }

    this.velX = speedX;
    this.velY = speedY;

    this.velX *= this.dragX;
    this.velY *= this.dragY;

    this.velY += this.gravity;

    this.posX += this.velX;
    this.posY += this.velY;
}

particle.prototype.render = function (context) {

    if (this.alpha == 0)
        return;

    context.strokeStyle = this.color;
    context.lineWidth = this.size;

    context.beginPath();
    context.moveTo(this.oldX, this.oldY);
    context.lineTo(this.posX, this.posY);
    context.closePath();
    context.stroke();
}