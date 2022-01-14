import './style.css'
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import { Float32BufferAttribute, MeshBasicMaterial, ShaderMaterial } from 'three';
import vertexShader from './Shaders/vertex.glsl'
import fragmentShader from './Shaders/fragment.glsl'
import gsap from 'gsap'
import atmosphereVertexShader from './Shaders/atmosphereVertex.glsl'
import atmosphereFragmentShader from './Shaders/atmosphereFragment.glsl'


const mouse={x:undefined,
              y:undefined}
const scene = new THREE.Scene();
const canvasContainer=document.querySelector('#canvasContainer');
const camera=new THREE.PerspectiveCamera(75, canvasContainer.offsetWidth/canvasContainer.offsetHeight, 0.1,1000);

const renderer =new THREE.WebGLRenderer({
  canvas: document.querySelector('canvas'),
  antialias:true
});

renderer.setPixelRatio(window.devicePixelRatio );
renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
camera.position.setZ(20);
renderer.render(scene,camera);


const Earth = new THREE.Mesh(new THREE.SphereGeometry(5,50,50), new ShaderMaterial({vertexShader,fragmentShader,uniforms:{globetexture:{value:new THREE.TextureLoader().load('./Images/globe.jpg')}}}))
const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(5,50,50), new ShaderMaterial({vertexShader:atmosphereVertexShader,fragmentShader:atmosphereFragmentShader,blending:THREE.AdditiveBlending, side:THREE.BackSide}))
atmosphere.scale.set(1.1,1.1,1.1)

scene.add(atmosphere)

const group = new THREE.Group()
group.add(Earth)
scene.add(group)

const starGeometry = new THREE.BufferGeometry()

const starMaterial= new THREE.PointsMaterial({
  color:0xffffff
})


const stars=new THREE.Points(starGeometry,starMaterial)
scene.add(stars)

const starVertices=[]

for(let i=0;i<1000;i++){
  const x=(Math.random()-0.5)*2000
  const y=(Math.random()-0.5)*2000
  const z=-Math.random()*2000
  starVertices.push(x,y,z)
}
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices,3))
function animate(){
  Earth.rotateY(0.005)
  requestAnimationFrame(animate)
  renderer.render(scene, camera)


  gsap.to(group.rotation,{
                          y: mouse.x*0.5,duration: 2})

}
animate()

addEventListener('mousemove',()=>{
  mouse.x=(event.clientX/innerWidth)*2-1
  mouse.y=-(event.clintY/innerHeight)*2+1
});