
const config = {
    type: Phaser.AUTO,
    width: 540,
    height: 960,
    transparent: true,
    parent: 'game-container',
    scene: {
        create,
        update
    }
};

new Phaser.Game(config);

let score = 0;
let lives = 3;
let holes = [];
let current = null;
let currentType = "";

function create() {

    holes = [];

    const positions = [
        [270, 285],
        [300, 405],
        [250, 515],
        [170, 640],
        [360, 640],
        [270, 785]
    ];

    positions.forEach(pos => {

        let hole = this.add.ellipse(
            pos[0],
            pos[1],
            90,
            28,
            0x000000,
            0.45
        );

        hole.setDepth(1);

        holes.push(pos);
    });

    this.time.addEvent({
        delay: 900,
        callback: () => spawn(this),
        loop: true
    });
}

function spawn(scene) {

    if (current) {
        current.destroy();
        current = null;
    }

    const pos = Phaser.Utils.Array.GetRandom(holes);

    const r = Math.random();
    let emoji;

    if (r < 0.50) {
        emoji = "🚴";
        currentType = "tomasevic";
    }
    else if (r < 0.70) {
        emoji = "🅿️";
        currentType = "parking";
    }
    else if (r < 0.90) {
        emoji = "🚗";
        currentType = "car";
    }
    else {
        emoji = "🚋";
        currentType = "tram";
    }

    current = scene.add.text(
        pos[0],
        pos[1] + 25,
        emoji,
        { fontSize: '70px' }
    );

    current.setOrigin(0.5);
    current.setScale(0);
    current.setDepth(2);

    scene.tweens.add({
        targets: current,
        y: pos[1] - 35,
        scale: 1,
        duration: 220,
        ease: 'Back.Out'
    });

    current.setInteractive();

    current.on('pointerdown', () => {

        if (currentType === "tomasevic") score++;
        if (currentType === "parking") score += 5;
        if (currentType === "car") lives--;
        if (currentType === "tram") lives -= 2;

        current.setText("💥");

        scene.time.delayedCall(150, () => {
            if (current) {
                current.destroy();
                current = null;
            }
        });

        if (lives <= 0) {
            scene.time.delayedCall(200, () => {
                alert('Game Over\nScore: ' + score);
                location.reload();
            });
        }
    });
}

function update() {}
