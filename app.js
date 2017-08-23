
class App {

    constructor(width, height) {
        this.TILE_WIDTH = 11;
        this.LINE_WIDTH = 1;
        this.playing = false;

        this.container = document.getElementById('game-container');

        this.canvas = document.createElement('canvas');
        this.canvas.width = (width * this.TILE_WIDTH) + ((width - 2) * this.LINE_WIDTH);
        this.canvas.height = (height * this.TILE_WIDTH) + ((height - 2) * this.LINE_WIDTH);
        this.canvas.style.outline = '1px solid black';
        this.container.appendChild(this.canvas);

        this.container.style.width = this.canvas.width + 'px';

        this.tiles = new Array();
        for (let y = 0; y < height; y++) {
            let row = new Array();
            for (let x = 0; x < width; x++) {
                row.push(false);
            }
            this.tiles.push(row);
        }

        this.canvas.onclick = this.clickHandler.bind(this);

        setInterval(this.update.bind(this), 1000/60);
    }

    update() {
        if (this.playing) {
            
        }

        this.render();
    }

    clickHandler(event) {
        let x = event.pageX - this.canvas.offsetLeft;
        let y = event.pageY - this.canvas.offsetTop;

        let tileX = Math.floor(x / (this.TILE_WIDTH + this.LINE_WIDTH));
        let tileY = Math.floor(y / (this.TILE_WIDTH + this.LINE_WIDTH));

        this.tiles[tileY][tileX] = !this.tiles[tileY][tileX];
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