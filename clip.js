let canvas
let canvas_context
let keysPressed = {}
let FLEX_engine
let TIP_engine = {}
let XS_engine
let YS_engine
function setUp(canvas_pass, style = "#000000") {
    canvas = canvas_pass
    canvas_context = canvas.getContext('2d');
    canvas.style.background = style
    window.setInterval(function () {
        main()
    }, 25)
    document.addEventListener('keydown', (event) => {
        keysPressed[event.key] = true;
    });
    document.addEventListener('keyup', (event) => {
        delete keysPressed[event.key];
    });
    window.addEventListener('pointerdown', e => {
        FLEX_engine = canvas.getBoundingClientRect();
        XS_engine = e.clientX - FLEX_engine.left;
        YS_engine = e.clientY - FLEX_engine.top;
        TIP_engine.x = XS_engine
        TIP_engine.y = YS_engine
        TIP_engine.body = TIP_engine

        let dot = new Rectangle(TIP_engine.x, TIP_engine.y, 1,1, "white")
        dots.push(dot)
    });
    window.addEventListener('pointermove', continued_stimuli);
    window.addEventListener('pointerup', e => {
    })
    function continued_stimuli(e) {
        FLEX_engine = canvas.getBoundingClientRect();
        XS_engine = e.clientX - FLEX_engine.left;
        YS_engine = e.clientY - FLEX_engine.top;
        TIP_engine.x = XS_engine
        TIP_engine.y = YS_engine
        TIP_engine.body = TIP_engine
    }
}

let setup_canvas = document.getElementById('canvas')

setUp(setup_canvas)


let quadDepth = 10


class Rectangle {
    constructor(x, y, width, height, color, fill = 1, stroke = 0, strokeWidth = 1) {
        this.x = x
        this.y = y
        this.height = height
        this.width = width
        this.color = color
        this.xmom = 0
        this.ymom = 0
        this.stroke = stroke
        this.strokeWidth = strokeWidth
        this.fill = fill
    }
    draw() {
        canvas_context.lineWidth = .5
        canvas_context.fillStyle = this.color
        canvas_context.strokeStyle = this.color
        canvas_context.strokeRect(this.x, this.y, this.width, this.height)
    }
    move() {
        this.x += this.xmom
        this.y += this.ymom
    }
    isPointInside(point) {
        if (point.x >= this.x) {
            if (point.y >= this.y) {
                if (point.x <= this.x + this.width) {
                    if (point.y <= this.y + this.height) {
                        return true
                    }
                }
            }
        }
        return false
    }
    doesPerimeterTouch(point) {
        if (point.x + point.radius >= this.x) {
            if (point.y + point.radius >= this.y) {
                if (point.x - point.radius <= this.x + this.width) {
                    if (point.y - point.radius <= this.y + this.height) {
                        return true
                    }
                }
            }
        }
        return false
    }
}


class Quad {
    constructor(x, y, w, h, k, t) {
        if (k > 0) {
            this.tl = [new Quad(x, y, w / 2, h / 2, k - 1, 0)]
            this.tr = [new Quad(x + (w / 2), y, w / 2, h / 2, k - 1, 1)]
            this.bl = [new Quad(x, y + (h / 2), w / 2, h / 2, k - 1, 2)]
            this.br = [new Quad(x + (w / 2), y + (h / 2), w / 2, h / 2, k - 1, 3)]
        } else {
            this.tl = [new PixQuad(x, y, w / 2, h / 2, k - 1, 0)]
            this.tr = [new PixQuad(x + (w / 2), y, w / 2, h / 2, k - 1, 1)]
            this.bl = [new PixQuad(x, y + (h / 2), w / 2, h / 2, k - 1, 2)]
            this.br = [new PixQuad(x + (w / 2), y + (h / 2), w / 2, h / 2, k - 1, 3)]
        }
        this.body = new Rectangle(x, y, w, h, (["red", "blue", "#00ff00", "Yellow"])[t])
        this.on = 0
    }
    draw() {
        if (this.on == 1) {
            this.body.draw()
        }
        this.tl[0].draw()
        this.br[0].draw()
        this.tr[0].draw()
        this.bl[0].draw()
        return false
    }
    check() {
        for (let t = 0; t < dots.length; t++) {
            if (this.body.isPointInside(dots[t])) {
                this.on = 1
            }
        }
        if (this.tl[0].check()) { this.on = 1 }
        if (this.tr[0].check()) { this.on = 1 }
        if (this.bl[0].check()) { this.on = 1 }
        if (this.br[0].check()) { this.on = 1 }
        if (this.on == 1) {
            return true
        }
        return false
    }
}
class PixQuad {
    constructor(x, y, w, h, k, t) {
        this.body = new Rectangle(x, y, w, h, (["red", "blue", "#00ff00", "Yellow"])[t])
        this.on = 0
        this.owns = []
    }
    draw() {
        if (this.on == 1) {
            this.body.draw()
            for (let t = 0; t < this.owns.length; t++) {
                this.owns[t].draw()
            }
            return true
        }
        return false
    }
    check() {
        for (let t = 0; t < dots.length; t++) {
            if (this.body.isPointInside(dots[t])) {
                if (this.owns.includes(dots[t])) {
                } else {
                    this.owns.push(dots[t])
                }
                this.on = 1
                return true
            }
        }
        return false
    }
}

class Quadtree {
    constructor(x, y, w, h, k) {
        this.tl = [new Quad(x, y, w / 2, h / 2, k - 1, 0)]
        this.tr = [new Quad(x + (w / 2), y, w / 2, h / 2, k - 1, 1)]
        this.bl = [new Quad(x, y + (h / 2), w / 2, h / 2, k - 1, 2)]
        this.br = [new Quad(x + (w / 2), y + (h / 2), w / 2, h / 2, k - 1, 3)]
        this.on = 0
    }
    check() {
        if (this.tl[0].check()) { this.on = 1 }
        if (this.tr[0].check()) { this.on = 1 }
        if (this.bl[0].check()) { this.on = 1 }
        if (this.br[0].check()) { this.on = 1 }
    }
    draw() {
        if (this.tl[0].draw()) { this.on = 1 }
        if (this.tr[0].draw()) { this.on = 1 }
        if (this.bl[0].draw()) { this.on = 1 }
        if (this.br[0].draw()) { this.on = 1 }
    }
}
let q = new Quadtree(0, 0, canvas.width, canvas.height, quadDepth, 0)

let dots = []


function main() {
    canvas_context.clearRect(0, 0, canvas.width, canvas.height)  // refreshes the image
    q.check()
    q.draw()
}

