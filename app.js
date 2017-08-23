
class App {

    constructor(width, height) {
        this.width = width;
        this.height = height;

        this.TILE_WIDTH = 11;
        this.LINE_WIDTH = 1;
        this.playing = false;
        this.drag = false;
        this.mouseDragChangeTiles = false;
        this.updateFrequency = 3;
        this.lastUpdate = 0;

        this.buildUI(width, height);
        this.clearTiles()

        this.canvas.onmousedown = this.mouseDownHandler.bind(this);
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
        this.canvas.onmouseup = () => { this.drag = false; }

        document.onkeypress = (e) => {
            e = e || window.event;

            if (e.keyCode === 32) {
                this.playButtonClick();
            }
        }

        setInterval(this.update.bind(this), 1000/60);
    }

    buildUI(width, height) {
        this.container = document.getElementById('game-container');
        this.container.innerHTML = '';


        this.canvas = document.createElement('canvas');
        this.canvas.width = (width * this.TILE_WIDTH) + ((width - 2) * this.LINE_WIDTH);
        this.canvas.height = (height * this.TILE_WIDTH) + ((height - 2) * this.LINE_WIDTH);
        this.canvas.style.outline = '1px solid black';
        this.container.appendChild(this.canvas);

        this.playButton = document.createElement('button');
        this.playButton.innerHTML = 'Play';
        this.playButton.onclick = this.playButtonClick.bind(this);
        this.container.appendChild(this.playButton);

        this.nextPeriodButton = document.createElement('button');
        this.nextPeriodButton.innerHTML = 'Next';
        this.nextPeriodButton.style.marginLeft = '5px';
        this.nextPeriodButton.onclick = this.nextPeriod.bind(this);
        this.container.appendChild(this.nextPeriodButton);

        this.advanceSeveralPeriodsButton = document.createElement('button');
        this.advanceSeveralPeriodsButton.innerHTML = 'Advance n';
        this.advanceSeveralPeriodsButton.style.marginLeft = '5px';
        this.advanceSeveralPeriodsButton.onclick = this.advanceSeveralPeriods.bind(this);
        this.container.appendChild(this.advanceSeveralPeriodsButton);

        this.clearButton = document.createElement('button');
        this.clearButton.innerHTML = 'Clear';
        this.clearButton.style.marginLeft = '5px';
        this.clearButton.onclick = this.clearTiles.bind(this);
        this.container.appendChild(this.clearButton);

        this.randomButton = document.createElement('button');
        this.randomButton.innerHTML = 'Random';
        this.randomButton.style.marginLeft = '5px';
        this.randomButton.onclick = () => { this.fillRandom(); };
        this.container.appendChild(this.randomButton)

        this.speedSlider = document.createElement('input');
        this.speedSlider.setAttribute('type', 'range');
        this.speedSlider.setAttribute('min', 1);
        this.speedSlider.setAttribute('max', 60);
        this.speedSlider.value = 1;
        this.speedSlider.onchange = this.speedChanged.bind(this);
        this.speedLabel = document.createElement('label');
        this.speedLabel.innerHTML = 'Speed:';
        this.speedLabel.style.marginLeft = '5px';
        this.speedSlider.style.position = 'relative';
        this.speedSlider.style.top = '5px';
        this.container.appendChild(this.speedLabel);
        this.container.appendChild(this.speedSlider);

        this.container.style.width = this.canvas.width + 'px';
    }

    update() {
        if (this.playing) {
            let d = new Date();
            if (d.getTime() - this.lastUpdate > 1000/this.updateFrequency) {
                this.lastUpdate = d.getTime();

                this.nextPeriod();
            }
        }

        this.render();
    }

    nextPeriod() {
        let tiles = new Array();

        for (let y = 0; y < this.tiles.length; y++) {
            tiles[y] = new Array();
            for (let x = 0; x < this.tiles[y].length; x++) {
                const neighbours = this.countNeighbours(this.tiles, x, y);

                tiles[y][x] = this.tiles[y][x];

                if (this.tiles[y][x]) {
                    if (neighbours < 2) {
                        tiles[y][x] = false;
                    } else if (neighbours > 3) {
                        tiles[y][x] = false;
                    }
                } else {
                    if (neighbours === 3) {
                        tiles[y][x] = true;
                    }
                }
            }
        }

        this.tiles = tiles;
    }

    advanceSeveralPeriods() {
        let periods = parseInt(window.prompt('Advance how many generations?'));
        for (let i = 0; i < periods; i++) {
            this.nextPeriod();
        }
    }

    countNeighbours(tiles, x, y) {
        let count = 0;
        
        for (let y2 = y - 1; y2 <= y + 1; y2++) {
            if (y2 < 0 || y2 >= tiles.length) { continue; }
            for (let x2 = x - 1; x2 <= x + 1; x2++) {
                if (x2 < 0 || x2 >= tiles[y2].length) { continue; }
                if (x2 === x && y2 === y) { continue; }
                if (tiles[y2][x2]) {
                    count++;
                }
            }
        }

        return count;
    }

    mouseDownHandler(event) {
        let x = event.pageX - this.canvas.offsetLeft;
        let y = event.pageY - this.canvas.offsetTop;

        let tileX = Math.floor(x / (this.TILE_WIDTH + this.LINE_WIDTH));
        let tileY = Math.floor(y / (this.TILE_WIDTH + this.LINE_WIDTH));

        this.mouseDragChangeTiles = this.tiles[tileY][tileX];
        this.tiles[tileY][tileX] = !this.tiles[tileY][tileX];
        this.drag = true;
    }

    mouseMoveHandler(event) {
        if (!this.drag) { return; }

        let x = event.pageX - this.canvas.offsetLeft;
        let y = event.pageY - this.canvas.offsetTop;

        let tileX = Math.floor(x / (this.TILE_WIDTH + this.LINE_WIDTH));
        let tileY = Math.floor(y / (this.TILE_WIDTH + this.LINE_WIDTH));

        if (this.tiles[tileY][tileX] === this.mouseDragChangeTiles) {
            this.tiles[tileY][tileX] = !this.tiles[tileY][tileX];
        }
    }

    playButtonClick() {
        this.playing = !this.playing;
        if (this.playing) {
            this.playButton.innerHTML = 'Pause';
        } else {
            this.playButton.innerHTML = 'Play';
        }
    }
    
    speedChanged() {
        this.updateFrequency = this.speedSlider.value;
    }

    clearTiles() {
        this.tiles = new Array();
        for (let y = 0; y < this.height; y++) {
            let row = new Array();
            for (let x = 0; x < this.width; x++) {
                row.push(false);
            }
            this.tiles.push(row);
        }
		
		this.playing = false;
		this.playButton.innerHTML = 'Play';
    }

    fillRandom(fillRatio = 0.2) {
        this.tiles = new Array();
        for (let y = 0; y < this.height; y++) {
            let row = new Array();
            for (let x = 0; x < this.width; x++) {
                row.push(Math.random() <= fillRatio);
            }
            this.tiles.push(row);
        }
    }

    render() {
        let context = this.canvas.getContext('2d');
        context.fillStyle = '#FFFFFF';
        context.fillRect(0, 0, this.canvas.width, this.canvas.height);

        context.fillStyle = '#000000'
        for (let y = 0; y < this.tiles.length; y++) {
            for (let x = 0; x < this.tiles[y].length; x++) {
                if (this.tiles[y][x]) {
                    let px = x * (this.TILE_WIDTH + this.LINE_WIDTH);
                    let py = y * (this.TILE_WIDTH + this.LINE_WIDTH);
                    context.fillRect(px, py, this.TILE_WIDTH, this.TILE_WIDTH);
                }
            }
        }

        context.strokeStyle = '#D0D0D0';
        context.lineWidth = this.LINE_WIDTH;
        for (let y = 1; y < this.tiles.length; y++) {
            let py = y * (this.TILE_WIDTH + this.LINE_WIDTH) - this.LINE_WIDTH + 0.5;
            context.beginPath();
            context.moveTo(0, py);
            context.lineTo(this.canvas.width, py);
            context.stroke();
        }

        for (let x = 1; x < this.tiles[0].length; x++) {
            let px = x * (this.TILE_WIDTH + this.LINE_WIDTH) - this.LINE_WIDTH + 0.5;
            context.beginPath();
            context.moveTo(px, 0);
            context.lineTo(px, this.canvas.height);
            context.stroke();
        }
    }

}
