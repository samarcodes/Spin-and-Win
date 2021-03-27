//Hello World of Phaser = Basic Game = Single Scene in Spin & Win Game
// How to create the basic skeleton for the game -> Game Loop

let prizes_config = {
    count: 12,
    prize_names: [
        "3000 Credits",
        "35% Off",
        "Hard Luck",
        "70% Off",
        "Swagpack",
        "100% Off",
        "Netflix Subscription",
        "50% Off",
        "Amazon Voucher",
        "2 Extra Spin",
        "CB Tshirt",
        "CB Book"
    ]
}

let config = {
    type: Phaser.CANVAS,
    width: 800,
    height: 350,
    backgroundColor: 0xffcc00,
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
    audio: {
        disableWebAudio: true
    }
};
let game = new Phaser.Game(config);

function preload() {
    console.log("Preload");
    //load object, load some images
    this.load.image('background', '../Assets/back.jpg');
    this.load.image('wheel', '../Assets/wheel.png');
    this.load.image('pin', '../Assets/pin.png');
    this.load.image('stand', '../Assets/stand.png');
    this.load.image('button', '../Assets/red-button.png');
    this.load.audio('theme', [
        '../Assets/sound.wav',
    ]);
}
function create() {
    console.log("Create");
    //create the background image
    const W = game.config.width;
    const H = game.config.height;

    this.music = this.sound.add('theme');
    this.noOfSpinsLeft = 5;
    this.prizeArr = [];

    const background = this.add.sprite(0, 0, 'background');
    background.setPosition(W / 2, H / 2);
    background.setScale(0.20);

    //lets create the stand
    const stand = this.add.sprite(W / 2, H / 2 + 105, 'stand');
    stand.setScale(0.08);

    //lets create a pin
    const pin = this.add.sprite(W / 2, H / 2 - 150, "pin");
    pin.setScale(0.10);
    pin.depth = 1;

    //lets create wheel
    this.wheel = this.add.sprite(W / 2, H / 2 - 25, "wheel");
    this.wheel.setScale(0.12);
    //this.wheel.alpha = 0.5;

    //lets add a button
    this.button = this.add.sprite(W / 2, H / 2 + 135, 'button');
    this.button.setScale(0.025);
    this.button.setInteractive();

    //event listener for button click
    this.isSpinning = false;
    this.button.on('pointerdown', spinwheel, this)
    this.button.on('pointerup', () => { this.button.setScale(0.025) });

    //event listener for mouse click
    // this.input.on("pointerdown", spinwheel, this);

    //lets create text object
    font_style = {
        font: "bold 22px Arial",
        align: "center",
        color: "red",
    }
    font_style1 = {
        font: "bold 18px Arial",
        align: "center",
        color: "black",
    }
    font_style_button = {
        font: "bold 8px Arial",
        align: "center",
        color: "white",
    }
    font_style_win = {
        font: "bold 12px Arial",
        align: "center",
        color: "black",
    }
    this.game_text = this.add.text(10, 10, "Welcome to Spin & Win", font_style);
    this.button_text = this.add.text(W / 2 - 22, H / 2 + 130, 'Tap to spin', font_style_button);
    this.win_text = this.add.text(W / 2 - 60, H / 2 + 150, '', font_style_win);
    this.spin_number = this.add.text(W / 2 - 350, H / 2 - 30, `Spins Left : ${this.noOfSpinsLeft}`, font_style1);
    this.winnings = this.add.text(W / 2 - 350, H / 2, 'Winnings: ', font_style1);
    this.winning_text = this.add.text(W / 2 - 350, H / 2 + 30, '', font_style1);;
}

//Game Loop
function update() {
    console.log("Inside Update");
    //this.wheel.angle += 1;
}

function spinwheel() {
    if (this.isSpinning === false && this.noOfSpinsLeft > 0) {
        this.button.setScale(0.027);
        this.noOfSpinsLeft -= 1;
        this.music.play();
        this.isSpinning = true;
        console.log("You clicked the mouse");
        console.log("Start spinning");
        //this.game_text.setText("You clicked the mouse!");

        const rounds = Phaser.Math.Between(2, 4);
        const degrees = Phaser.Math.Between(0, 11) * 30;

        const total_angle = rounds * 360 + degrees;

        const idx = prizes_config.count - 1 - Math.floor(degrees / (360 / prizes_config.count));

        let prize_name = prizes_config.prize_names[idx];
        if (prize_name === '2 Extra Spin') {
            this.noOfSpinsLeft += 2;
        }
        if (prize_name !== 'Hard Luck') {
            this.prizeArr.push(prize_name);
            const newPrizeName = 'You Won ' + prize_name;
            prize_name = newPrizeName;
        }

        this.isSpinning = true;
        tween = this.tweens.add({
            targets: this.wheel,
            angle: total_angle,
            ease: "Cubic.easeOut",
            duration: 6000,
            callbackScope: this,
            onComplete: function () {
                this.isSpinning = false;
                this.win_text.setText(prize_name);
                this.spin_number.setText(`Spins Left : ${this.noOfSpinsLeft}`);
                this.winning_text.setText(this.prizeArr.reduce((acc, prize_name) => acc + prize_name + '\n', ' '));
            },
        });
    }
}






