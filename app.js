const speedDah = document.querySelector('.speed-dash');
const scoreDash = document.querySelector('.score-dash');
const lifeDash = document.querySelector('.life-dash');
const container = document.querySelector('.container');
const btnStart = document.querySelector('.btn-start');
let keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
};
let gamePlay = false;
let player;
let animationGame;

btnStart.addEventListener('click', startGame);
document.addEventListener('keydown', pressKeyOn);
document.addEventListener('keyup', pressKeyOf);

function startGame() {
    container.innerHTML = '';
    btnStart.style.display = 'none';
    let div = document.createElement('div');
    div.setAttribute('class', 'player-car');
    div.x = 250;
    div.y = 500;
    container.appendChild(div);
    animationGame = requestAnimationFrame(playGame);
    gamePlay = true;
    player = {
        ele: div,
        speed: 0,
        lives: 3,
        gameScore: 0,
        carsToPass: 2,
        score: 0,
        roadWidth: 250,
        gameEndCounter: 0,
    };
    startBoard();
    setupBadGuys(10);
}
function setupBadGuys(num) {
    for (let i = 0; i < num; i++) {
        let temp = 'badGuy' + (i + 1);
        let div = document.createElement('div');
        div.innerHTML = i + 1;
        div.setAttribute('class', 'baddy');
        div.setAttribute('id', temp);
        //  div.style.backgroundColor = randomColor();
        makeBad(div);
        container.appendChild(div);
    }
}
function randomColor() {
    function c() {
        let hex = Math.floor(Math.random() * 256).toString(16);
        return ('0' + String(hex)).substr(-2);
    }
    return '#' + c() + c() + c();
}
function makeBad(e) {
    let tempRoad = document.querySelector('.road');
    e.style.left =
        tempRoad.offsetLeft +
        Math.ceil(Math.random() * tempRoad.offsetWidth) -
        30 +
        'px';
    e.style.top = Math.ceil(Math.random() * -400) + 'px';
    e.speed = Math.ceil(Math.random() * 17) + 2;
    e.style.backgroundColor = randomColor();
}
function startBoard() {
    for (let i = 0; i < 13; i++) {
        let div = document.createElement('div');
        div.setAttribute('class', 'road');
        div.style.top = i * 50 + 'px';
        div.style.width = player.roadWidth + 'px';
        container.appendChild(div);
    }
}
function pressKeyOn(event) {
    event.preventDefault();
    keys[event.key] = true;
}

function pressKeyOf(event) {
    event.preventDefault();
    keys[event.key] = false;
}

function updateDash() {
    scoreDash.innerHTML = player.score;
    lifeDash.innerHTML = player.lives;
    speedDah.innerHTML = Math.round(player.speed * 13);
}

function moveRoad() {
    let tempRoads = document.querySelectorAll('.road');
    let prevRoud = tempRoads[0].offsetLeft;
    let prevWidth = tempRoads[0].offsetWidth;
    let pSpeed = Math.floor(player.speed);
    for (let i = 0; i < tempRoads.length; i++) {
        let num = tempRoads[i].offsetTop + pSpeed;
        if (num > 600) {
            num -= 660;
            let mover = prevRoud + (Math.floor(Math.random() * 6) - 3);
            let roadWidth = Math.floor(Math.random() * 11) - 5 + prevWidth;
            if (roadWidth < 200) {
                roadWidth = 200;
            }
            if (roadWidth > 400) {
                roadWidth = 400;
            }
            if (mover < 100) {
                mover = 100;
            }
            if (mover > 600) {
                mover = 600;
            }
            tempRoads[i].style.left = mover + 'px';
            tempRoads[i].style.width = roadWidth + 'px';

            prevRoud = tempRoads[0].offsetLeft;
            prevWidth = tempRoads[0].width;
        }
        tempRoads[i].style.top = num + 'px';
    }
    return {
        width: prevWidth,
        left: prevRoud,
    };
}

function moveBadGuys() {
    let tempBaddys = document.querySelectorAll('.baddy');
    for (let i = 0; i < tempBaddys.length; i++) {
        for (let ii = 0; ii < tempBaddys.length; ii++) {
            if (i != ii && isCollide(tempBaddys[i], tempBaddys[ii])) {
                tempBaddys[ii].style.top = tempBaddys[ii].offsetTop + 20 + 'px';
                tempBaddys[i].style.top = tempBaddys[i].offsetTop - 20 + 'px';
                tempBaddys[ii].style.left =
                    tempBaddys[ii].offsetLeft - 20 + 'px';
                tempBaddys[i].style.left = tempBaddys[i].offsetLeft + 20 + 'px';
            }
        }
        let y = tempBaddys[i].offsetTop + player.speed - tempBaddys[i].speed;
        if (y > 2000 || y < -2000) {
            if (y > 2000) {
                player.score++;
            }
            if (player.score > player.carsToPass) {
                gameOverPlay();
            }
            makeBad(tempBaddys[i]);
        } else {
            tempBaddys[i].style.top = y + 'px';
            let hitCar = isCollide(tempBaddys[i], player.ele);
            console.log(hitCar);
            if (hitCar) {
                player.speed = 0;
                player.lives--;
                if (player.lives < 1) {
                }
                player.gameEndCounter = 1;
                makeBad(tempBaddys[i]);
            }
        }
    }
}

function gameOverPlay() {
    let div = document.createElement('div');
    div.setAttribute('class', 'road');
    div.style.top = '0px';
    div.style.width = '250px';
    div.style.backgroundColor = 'red';
    div.innerHTML = 'FINISH';
    div.style.fontSize = '3em';
    container.appendChild(div);
    player.gameEndCounter = 12;
    player.speed = 0;
}
function isCollide(a, b) {
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();
    return !(
        aRect.bottom < bRect.top ||
        aRect.top > bRect.bottom ||
        aRect.right < bRect.left ||
        aRect.left > bRect.right
    );
}

function playGame() {
    if (gamePlay) {
        updateDash();
        let roadParam = moveRoad();
        moveBadGuys();
        if (keys.ArrowUp) {
            if (player.ele.y > 400) {
                player.ele.y -= 1;
            }
            player.ele.y -= 1;
            player.speed = player.speed < 20 ? player.speed + 0.05 : 20;
        }
        if (keys.ArrowDown) {
            if (player.ele.y < 500) {
                player.ele.y += 1;
            }
            player.ele.y += 1;
            player.speed = player.speed > 0 ? player.speed - 0.02 : 0;
        }
        if (keys.ArrowLeft) {
            player.ele.x -= player.speed / 4;
        }
        if (keys.ArrowRight) {
            player.ele.x += player.speed / 4;
        }
        if (
            player.ele.x + 40 < roadParam.left ||
            player.ele.x > roadParam.left + roadParam.width
        ) {
            if (player.ele.y < 500) {
                player.ele.y += +1;
            }
            player.speed = player.speed > 0 ? player.speed - 0.1 : 1;
            console.log('OFF ROAD');
        }

        player.ele.style.top = player.ele.y + 'px';
        player.ele.style.left = player.ele.x + 'px';
    }
    animationGame = requestAnimationFrame(playGame);
    if (player.gameEndCounter > 0) {
        player.gameEndCounter--;
        player.y = player.y > 60 ? player.y - 30 : 60;
        if (player.gameEndCounter === 0) {
            gamePlay = false;
            cancelAnimationFrame(animationGame);
            btnStart.style.display = 'block';
        }
    }
}
