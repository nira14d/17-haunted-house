import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')





// Scene
const scene = new THREE.Scene()

//fog 

const fog = new THREE.Fog('#262837',1,15)
scene.fog = fog

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/Alpha.jpg')
const doorAmbientTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeighTxture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg')
const bricksambientColorTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')
const bricksrougnessColorTexture = textureLoader.load('/textures/bricks/roughness.jpg')
const bricksnormalColorTexture = textureLoader.load('/textures/bricks/normal.jpg')

const grassColorTexture = textureLoader.load('/textures/grass/color.jpg')
const grassambientColorTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
const grassrougnessColorTexture = textureLoader.load('/textures/grass/roughness.jpg')
const grassnormalColorTexture = textureLoader.load('/textures/grass/normal.jpg')

grassColorTexture.repeat.set(8,8)
grassambientColorTexture.repeat.set(8,8)
grassrougnessColorTexture.repeat.set(8,8)
grassnormalColorTexture.repeat.set(8,8)


grassColorTexture.wrapS = THREE.RepeatWrapping
grassambientColorTexture.wrapS = THREE.RepeatWrapping
grassrougnessColorTexture.wrapS = THREE.RepeatWrapping
grassnormalColorTexture.wrapS = THREE.RepeatWrapping
grassColorTexture.wrapT = THREE.RepeatWrapping
grassambientColorTexture.wrapT = THREE.RepeatWrapping
grassrougnessColorTexture.wrapT = THREE.RepeatWrapping
grassnormalColorTexture.wrapT = THREE.RepeatWrapping




/**
 * House
 */
const house = new THREE.Group()
scene.add(house)

//Walls
const walls = new THREE.Mesh(
    new THREE.BoxBufferGeometry(4,2.5,4),
    new THREE.MeshStandardMaterial({ 
        
        map: bricksColorTexture,
        aoMap: bricksambientColorTexture,
        normalMap: bricksnormalColorTexture,
        roughnessMap: bricksrougnessColorTexture,        
     })
)
walls.position.y = 2.5 / 2

walls.geometry.setAttribute('uv2', 
    new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array,2)
)


const roof = new THREE.Mesh(
    new THREE.ConeBufferGeometry(3.5,1,4),
    new THREE.MeshStandardMaterial({ color: '#b35f45' })
)
roof.position.y =3
roof.rotation.y = Math.PI/4

const door = new THREE.Mesh(

    new THREE.PlaneBufferGeometry(2.2,2.2,100,100),
    new THREE.MeshStandardMaterial({ 
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientTexture  ,
        displacementMap: doorHeighTxture,
        displacementScale:0.1,  
        normalMap: doorNormalTexture,
        metalnessMap:doorMetalnessTexture,
        roughnessMap:doorRoughnessTexture
        

    })
)
door.geometry.setAttribute('uv2', 
    new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array,2)
)
door.position.y = 1
door.position.z =2.01

const bushGeometry = new THREE.SphereBufferGeometry(1,16,16)
const bushMaterial = new THREE.MeshStandardMaterial({ color: 'green' })
const bush1 = new THREE.Mesh(bushGeometry,bushMaterial) 
bush1.scale.set(0.5,0.5,0.5)
bush1.position.set(0.8,0.2,2.2)

const bush2 = new THREE.Mesh(bushGeometry,bushMaterial) 
bush2.scale.set(0.25,0.25,0.25)
bush2.position.set(1.4,0.1,2.1)

const bush3 = new THREE.Mesh(bushGeometry,bushMaterial) 
bush3.scale.set(0.4,0.4,0.4)
bush3.position.set(-0.8,0.2,2.2)

const bush4 = new THREE.Mesh(bushGeometry,bushMaterial) 
bush4.scale.set(0.15,0.15,0.15)
bush4.position.set(-1,0.05,2.6)

const bush = new THREE.Group()
bush.add(bush1,bush2,bush3,bush4)
//graves 

const graves = new THREE.Group()
const graveGeometry = new THREE.BoxBufferGeometry(0.6,0.8,0.2)
const graveMaterial = new THREE.MeshStandardMaterial({ color: '#b2b6b1' })

for (let i=0; i<50; i++){
    const angle = Math.random() * Math.PI * 2
    const radius = 4 + Math.random() * 6
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius
    

    const grave = new THREE.Mesh(graveGeometry, graveMaterial)
    grave.position.set(x,0.3,z)
    grave.rotation.y = (Math.random() - 0.4) * 0.4
    graves.castShadow = true
    graves.add(grave)
}


house.add(walls,roof,door,bush,graves)

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        map: grassColorTexture,
        aoMap: grassambientColorTexture,
        normalMap: grassnormalColorTexture,
        roughnessMap: grassrougnessColorTexture,
        
        side:THREE.DoubleSide
     })
)

floor.geometry.setAttribute('uv2', 
    new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array,2)
)

floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)


//door light

const doorLight= new THREE.PointLight('red',1,7)
doorLight.position.set(0,2.2,2.7)

house.add(doorLight)


//  ghost 


const ghost1 = new THREE.PointLight('yellow', 2,3)
const ghost2 = new THREE.PointLight('white', 2,3)
const ghost3 = new THREE.PointLight('green', 2,3)

scene.add(ghost1,ghost3,ghost2)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#262837')
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
// shadows

moonLight.castShadow = true
doorLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true
walls.castShadow = true
bush1.castShadow = true
bush2.castShadow = true
bush3.castShadow = true
bush4.castShadow = true


floor.receiveShadow = true


doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.mapSize.far = 7 
ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.mapSize.far = 7 
ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.mapSize.far = 7 
ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.mapSize.far = 7 

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    //ghost 

    const ghost1Angle = elapsedTime * 0.5
    ghost1.position.x = Math.cos(ghost1Angle) * 4
    ghost1.position.z = Math.cos(ghost1Angle) * 4
    ghost1.position.y = Math.cos(ghost1Angle * 3)

    const ghost2Angle = -elapsedTime * 0.32
    ghost2.position.x = Math.cos(ghost2Angle) * 5
    ghost2.position.z = Math.cos(ghost2Angle) * 6
    ghost2.position.y = Math.cos(ghost2Angle * 4)+ Math.sin(elapsedTime*2.5)


    const ghost3Angle = elapsedTime * 0.10
    ghost3.position.x = Math.cos(ghost3Angle) *  +(  Math.sin(elapsedTime*2.5))
    ghost3.position.z = Math.cos(ghost3Angle) *  ( 8 * Math.sin(elapsedTime*2.5))
    ghost3.position.y = Math.cos(ghost3Angle)+ Math.sin(elapsedTime*2.5)
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()