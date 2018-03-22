/**
 * Copyright (c) 2017 Alex Forbes and Denzil Buchner
 *
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

let THREE = require('./../../libs/three/three')

let BaseGame = require('./../../core/base_game')

let DeityCamera = require('./../../core/camera/deity')
let CustomButton = require('./../../components/custom_button')

let { ipcRenderer, remote } = require('electron');

class SurvivalGame extends BaseGame {

    constructor(tagName, fps = 0) {
        super(tagName, fps)

        this.assetDirectory = 'assets'
        this.assets = {}

        this.currentIntersects = ''

        this.counter = 0

        this.mouseClient = {x:0, y: 0}
        this.startMouse =  {x:0, y: 0}

        
        this.selection = document.getElementById( "selection" );
        this.selectionLayer = document.getElementById( "selection-layer" );
        this.pickingChecks = []

    }


    // Called when start() is called and the renderer has been initialised
    init() {

        this.cameraControl = new DeityCamera(
            this.camera,
            (key) => this.keyDown(key),
            this.mouse,
            5 // camera velocity in units/second
        )

        this.camera.position.y = 2.5
        this.camera.position.z = 5

        this.initEntity('bee')
        this.initEntity('skull', { posY: 1 })
        this.initEntity('chicken', { posX: -1 })
        this.initEntity('chicken', { posY: -1 })

    }

    deInit() {
    }

    checkForIntersects() {

        let intersects = this.raySelect()

        let intersectsString = 'None'

        if (intersects.length > 0) {
            intersectsString = intersects.reduce(
                (acc, item) => {
                    return acc + item.object.name + ', '
                },
                '',
            )
            this.currentIntersects = intersectsString
            this.reactHandle.forceUpdate()
            this.counter++
        }


    }

    update(delta) {
        // this.cameraControl.update(delta)
    }

    onWindowResize() {
        let { camera, renderer } = this
    }


    // onMouseMove(event) {
    //     this.checkForIntersects()
    // }

    // TODO: Box select like this: http://output.jsbin.com/tamoce/3/


    gui(guiHandle) {

        this.reactHandle = guiHandle // Get handle to gui to force redraws elsewhere

        return React.createElement(
            'div',
            {},
            React.createElement(
                CustomButton,
                {
                    name: 'Spawn bee',
                    onClick: () => this.initEntity('bee', { posX: 1 })
                }
            ),
            React.createElement(
                'div',
                null,
                `Mouse ray intersects: ${this.currentIntersects}`,
            ),

        )
    }


    // Custom methods
    initEntity(name, props = {}) {

        if (this.assets[name] === undefined) {
            console.log(`Generating new asset for ${name}...`)
            let asset = {}

            asset.texture = new THREE.TextureLoader().load(`${this.assetDirectory}/${name}.png`)

            asset.material = new THREE.MeshBasicMaterial({
                map: asset.texture,
                color: 0xffffff,
                transparent: true,
                side: THREE.DoubleSide,
            })

            asset.geometry = new THREE.PlaneGeometry(1, 1, 1)

            this.assets[name] = asset
        }

        let mesh = new THREE.Mesh(
            this.assets[name].geometry,
            this.assets[name].material
        )

        mesh.scale.x = props.scaleX === undefined ? 1 : props.scaleX
        mesh.scale.y = props.scaleY === undefined ? 1 : props.scaleY

        mesh.position.x = props.posX === undefined ? 0 : props.posX
        mesh.position.z = props.posY === undefined ? 0 : props.posY

        //   mesh.rotateX(-Math.PI / 2)

        mesh.name = name // required for picking
        this.scene.add(mesh)

        this.pickingChecks.push(mesh)
    }









    unselect() {
              
        // unselect all
        // for (var i = 0; i < highlightBoxes.length; i++) {
          
        //   highlightBoxes[i].visible = false;
          
        // }
        
      }

      select( x1, x2, y1, y2) {
        
        let rx1 = ( x1 / window.innerWidth ) * 2 - 1;
        let rx2 = ( x2 / window.innerWidth ) * 2 - 1;
        let ry1 = -( y1 / window.innerHeight ) * 2 + 1;
        let ry2 = -( y2 / window.innerHeight ) * 2 + 1;
        
        let projectionMatrix = new THREE.Matrix4();
        projectionMatrix.makePerspective( rx1, rx2, ry1, ry2, this.camera.near, this.camera.far );
        
        this.camera.updateMatrixWorld();
        this.camera.matrixWorldInverse.getInverse( this.camera.matrixWorld );
        
        let viewProjectionMatrix = new THREE.Matrix4();
        viewProjectionMatrix.multiplyMatrices( projectionMatrix, this.camera.matrixWorldInverse );
        
        let frustum = new THREE.Frustum();
        frustum.setFromMatrix( viewProjectionMatrix );
        
        this.unselect();
        

        // console.log(rx1, ry1, rx2, ry2)
        // // select intersections with constructed frustum
        // for (i = 0; i < pickingData.length; i++) {
          
        //   let data = pickingData[ i ];
        //   let mesh = data.mesh;
          
        //   if ( frustum.intersectsObject( mesh ) ) {
        //     highlightBoxes[i].position.copy( data.position );
        //     highlightBoxes[i].rotation.copy( data.rotation );
        //     highlightBoxes[i].scale.copy( data.scale ).add( offset );
        //     highlightBoxes[i].visible = true;
        //   }
          
        // }
        
        let selectedString = ''
        for (let mesh of this.pickingChecks){
            if ( frustum.intersectsObject( mesh ) ) {
                selectedString += mesh.name
            }
        }
        console.log(selectedString)
        
      }

      onMouseDown( e ) {

        this.startMouse.x = e.clientX;
        this.startMouse.y = e.clientY;

        this.selecting = true;

        let x1 = this.startMouse.x;
        let x2 = x1 + 1;
        let y1 = this.startMouse.y;
        let y2 = y1 + 1;

        this.selection.style.left = x1 + "px";
        this.selection.style.top = y1 + "px";
        this.selection.style.width = (x2 - x1) + "px";
        this.selection.style.height = (y2 - y1) + "px";
        this.selection.style.visibility = "visible";
        
      }

      onMouseMove( e ) {

          this.mouseClient.x = e.clientX;
          this.mouseClient.y = e.clientY;
        
          let x1 = this.startMouse.x;
          let x2 = this.mouseClient.x;
          let y1 = this.startMouse.y;
          let y2 = this.mouseClient.y;
        
          if (x1 > x2) {
            
            let tmp1 = x1;
            x1 = x2;
            x2 = tmp1;
            
          }
        
          if (y1 > y2) {
            
            let tmp2 = y1;
            y1 = y2;
            y2 = tmp2;
            
          }
        
          if (this.selecting) {
            
            this.selection.style.left = x1 + "px";
            this.selection.style.top = y1 + "px";
            this.selection.style.width = (x2 - x1) + "px";
            this.selection.style.height = (y2 - y1) + "px";
            
            this.select(x1, x2, y1, y2);

          } else {
            
            this.unselect();
            
          }

      }

     onMouseUp ( e ) {
        
        this.selecting = false;
        this.selection.style.visibility = "hidden";
          
        
      }

}

module.exports = SurvivalGame

