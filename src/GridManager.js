import * as PIXI from 'pixi.js';
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

let app
const RED = 0x990012
window.PIXI = PIXI

export class GridManager {
    constructor(app_) {
        app = app_
        this.points = []
        this.app = app

        const mouseTracker = new PIXI.Graphics();
        mouseTracker.circle(0, 0, 15)
        mouseTracker.fill(0x990012)
        // app.stage.addChild(mouseTracker)

        this.setupGrid()   
        const lineDrawing = new LineDrawing()
        this.lineDrawing = lineDrawing

        app.stage.hitArea = app.screen;


        app.stage.on('pointerdown', (e) => {            
            const position = this.getPointerPosition(e)

            if (e.data.pointerType != 'mouse') {
                if (lineDrawing.points == 0) {
                    lineDrawing.pushPoint(position.x, position.y)
                } else {

                }
            } else {
                lineDrawing.pushPoint(position.x, position.y)
            }
        })
        app.stage.eventMode = 'static'
        app.stage.on('pointerup', (e) => {
            if (e.data.pointerType != 'mouse') {
                // push last position
                const position = lineDrawing.pointerPosition
                lineDrawing.pushPoint(position.x, position.y)
            }
        })

        

        app.stage.on('pointermove', (e) => {            
            const position = this.getPointerPosition(e)

            lineDrawing.pointerPosition = this.getPointerPosition(e)

            mouseTracker.x = position.x 
            mouseTracker.y = position.y
        })

        // app.view.addEventListener('click', (e) => {
        //     // this catches everything, even empty space
        //     console.log(e.target, e.currentTarget)
        // })

        
    }

    update() {
        const { lineDrawing } = this
        lineDrawing.update()
    }

    ///// 

    setupGrid() {
        const { app } = this
        const gridContainer = new PIXI.Container();
        app.stage.addChild(gridContainer);
        const spacing = 100
        const GRID_SIZE = 3
        const totalWidth = spacing * (GRID_SIZE - 1);
        const totalHeight = spacing * (GRID_SIZE - 1);

        for (let row = 0; row < GRID_SIZE; row++) {
            for (let col = 0; col < GRID_SIZE; col++) {
                const x = col * spacing - totalWidth / 2;
                const y = row * spacing - totalHeight / 2;
                const node = new PointNode(x, y)
                gridContainer.addChild(node);
                this.points.push(node)
            }
        }

        gridContainer.x = app.renderer.width / 2;
        gridContainer.y = app.renderer.height / 2;

        this.gridContainer = gridContainer
    }

    getPointerPosition(e) {
        return { x: e.global.x, y: e.global.y }
    }
}

class LineDrawing {
    constructor() {
        const line = new PIXI.Graphics()
        app.stage.addChild(line)
        
        this.points = []
        this.line = line
        this.pointerPosition = null
    }

    pushPoint(x, y) {
        if (this.points.length == 4) {
            // TODO check win condition
            // if fail, disappear line & start over
            const oldLine = this.line
            gsap.to(this.line, {
                duration: 5,
                pixi: { alpha: 0 },
                onComplete: () => {
                    oldLine.destroy()
                }
            });

            this.line = new PIXI.Graphics()
            app.stage.addChild(this.line)
            this.points = []
            return
        }

        this.points.push({ x, y })        
    }
    

    update() {
        const { points, line } = this
        if (points.length > 0) {
            line.clear()
            line.moveTo(points[0].x, points[0].y)

            for (let i = 1; i < points.length; i++) {
                line.lineTo(points[i].x, points[i].y)
            }

            if (this.pointerPosition) {
                line.lineTo(this.pointerPosition.x, this.pointerPosition.y)
            }

            line.stroke({ width: 3, color: RED, pixelLine: false })
        }
    }
}

class PointNode {
    constructor(x, y) {
        const circle = new PIXI.Graphics();
        circle.circle(0, 0, 7)
        circle.fill(RED)
        circle.x = x 
        circle.y = y

        this.circle = circle
        return circle
    }
}