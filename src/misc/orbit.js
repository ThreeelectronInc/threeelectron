
let THREE = require('./libs/three/three')
require('./modules/orbit_controls')

var starViewer = {
    
      // variables
      camera: false,
      controls: false,
      scene: false,
      renderer: false,
      container: false,
      textlabels: [],
    
      onReady: function() {
        this.scene = new THREE.Scene();
    
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColor(0x004477);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    
        this.container.appendChild(this.renderer.domElement);
    
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
        this.camera.position.z = 500;
    
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor =  0.25;
        this.controls.enableZoom = true;
        this.controls.enablePan = false;
        this.controls.enableKeys = false;
        
        // world
        var geometry = new THREE.CylinderGeometry(0, 10, 30, 4, 1);
    
        for (var i = 0; i < 20; i++) {
          var material = new THREE.MeshBasicMaterial({
            color: 0xffffff
          });
    
          var mesh = new THREE.Mesh(geometry, material);
          mesh.position.x = (Math.random() - 0.5) * 1000;
          mesh.position.y = (Math.random() - 0.5) * 1000;
          mesh.position.z = (Math.random() - 0.5) * 1000;
          mesh.updateMatrix();
          mesh.matrixAutoUpdate = false;
          this.scene.add(mesh);
          
          var text = this._createTextLabel();
          text.setHTML("Label "+i);
          text.setParent(mesh);
          this.textlabels.push(text);
          this.container.appendChild(text.element);
        }
        
        //
        // animate
        //
        
        var _this = this;
        var animate = function() {
          requestAnimationFrame(animate);
          _this.controls.update();
          _this._render();
        }
        animate();
      },
      
      onResize: function() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      },
      
      _render: function() {
        for(var i=0; i<this.textlabels.length; i++) {
          this.textlabels[i].updatePosition();
        }
        this.renderer.render(this.scene, this.camera);
      },
      
      _createTextLabel: function() {
        var div = document.createElement('div');
        div.className = 'text-label';
        div.style.position = 'absolute';
        div.style.width = 100;
        div.style.height = 100;
        div.innerHTML = "hi there!";
        div.style.top = -1000;
        div.style.left = -1000;
        
        var _this = this;
        
        return {
          element: div,
          parent: false,
          position: new THREE.Vector3(0,0,0),
          setHTML: function(html) {
            this.element.innerHTML = html;
          },
          setParent: function(threejsobj) {
            this.parent = threejsobj;
          },
          updatePosition: function() {
            if(parent) {
              this.position.copy(this.parent.position);
            }
            
            var coords2d = this.get2DCoords(this.position, _this.camera);
            this.element.style.left = coords2d.x + 'px';
            this.element.style.top = coords2d.y + 'px';
          },
          get2DCoords: function(position, camera) {
            var vector = position.project(camera);
            vector.x = (vector.x + 1)/2 * window.innerWidth;
            vector.y = -(vector.y - 1)/2 * window.innerHeight;
            return vector;
          }
        };
      }
    };
    
    starViewer.container = document.body//document.getElementById('myContainer');
    starViewer.onReady();
    window.addEventListener('resize', function() {
      starViewer.onResize();
    }, false);