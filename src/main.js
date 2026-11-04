import './style.css'
import { createSketch } from './sketch.js'
import * as THREE from 'three';
import { createMapping } from './mapping.js';


const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

// De fire første tal er venstre, højre, top og bund af det, kameraet ser. Med -1 til 1 på begge leder svarer -1 altid til venstre eller nederste kant af skærmen, og 1 til højre eller øverste kant, uanset skærmens størrelse. Det gør det nemt at regne med hjørner senere, fordi du ikke skal tænke i pixels.
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 10)
camera.position.z = 1;

createSketch((canvas) => {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const { mesh } = createMapping(texture);
  scene.add(mesh);



  renderer.setAnimationLoop(() => {

    texture.needsUpdate = true;
    renderer.render(scene, camera);
  })
});
