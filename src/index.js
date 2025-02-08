import { Application, Assets, Sprite } from 'pixi.js';
import * as PIXI from 'pixi.js';

let app;
let hearts = []

async function init() {
    // Create a new application
    app = new Application();

    // Initialize the application
    const containerElement = document.querySelector('#pixi-container')
    await app.init({ 
      background: 'white',
      antialias: true, 
      autoDensity: true,
      resolution: window.devicePixelRatio || 1,
    });
    app.renderer.resize(500, 500);
    containerElement.appendChild(app.canvas);
    app.canvas.style.height = 'auto'
    window.hearts = hearts

    createGrid()
}

init()

function makeCircle() {
  const circle = new PIXI.Graphics();

  circle.circle(0, 0, 5)
  circle.fill(0x990012)
  return circle
}

function createGrid() {
    // Create container for the grid
    const gridContainer = new PIXI.Container();
    const spacing = 100
    const GRID_SIZE = 3

    // Calculate total grid width and height
    const totalWidth = spacing * (GRID_SIZE - 1);
    const totalHeight = spacing * (GRID_SIZE - 1);

    
    // Create sprites
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const sprite = makeCircle()
        // const sprite = new PIXI.Sprite(texture);
          // sprite.on('pointerdown', function(e) {
          //   sprite.texture = heartTexture
          // });
          // sprite.cursor = 'pointer'
          // sprite.eventMode = 'static'
          
          // Center anchor point
          // sprite.anchor.set(0.5);
          
          // Position sprite
          sprite.x = col * spacing - totalWidth / 2;
          sprite.y = row * spacing - totalHeight / 2;
          
          hearts.push(sprite)
          
          // Add to container
          gridContainer.addChild(sprite);
      }
  }
  
  // Center the entire grid container
  gridContainer.x = app.renderer.width / 2;
  gridContainer.y = app.renderer.height / 2;
  
  // Add container to stage
  app.stage.addChild(gridContainer);
    
    return gridContainer;
}






function resize() {

  const scale = Math.min(
      window.innerWidth / DEFAULT_WIDTH,
      window.innerHeight / DEFAULT_HEIGHT
  );

  const newWidth = Math.round(DEFAULT_WIDTH * scale);
  const newHeight = Math.round(DEFAULT_HEIGHT * scale);

  app.renderer.resize(newWidth, newHeight);
  app.stage.scale.x = scale;
  app.stage.scale.y = scale;

  // Center the stage
  app.stage.position.x = newWidth / 2 - (DEFAULT_WIDTH / 2 * scale);
  app.stage.position.y = newHeight / 2 - (DEFAULT_HEIGHT / 2 * scale);
}

// window.addEventListener('resize', resize);
