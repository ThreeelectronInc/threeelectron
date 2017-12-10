/**
 * Copyright (c) 2017 Alex Forbes and Denzil Buchner
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

let THREE = require('./../../libs/three/three')

let BaseGame = require('./../../core/base_game')

let Tone

// Need to catch errors here or tests will fail
try {
    Tone = require("./../../libs/tone")
} catch (e) {
    console.log('Audio not supported here, surpress error.')
}

class SurvivalGame extends BaseGame {

    constructor(tagName, fps = 0) {
        super(tagName, fps)

        this.time_elapsed = 0


        this.volume = 10

        this.keys = ["z"
            , "s"
            , "x"
            , "d"
            , "c"
            , "v"
            , "g"
            , "b"
            , "h"
            , "n"
            , "j"
            , "m"
            , "q"
            , "2"
            , "w"
            , "3"
            , "e"
            , "r"
            , "5"
            , "t"
            , "6"
            , "y"
            , "7"
            , "u"
            , "i"
            , "9"
            , "o"
            , "0"
            , "p"
        ]


        this.scale = [
            'C', // Tone.js starts octaves at C, so A0 is higher than C0
            'Db',
            'D',
            'Eb',
            'E',
            'F',
            'Gb',
            'G',
            'Ab',
            'A',
            'Bb',
            'B',
        ]

        const octaveStart = 3

        this.notes = []

        // for (let key of this.keys){
        for (let k = 0; k < this.keys.length; k++) {

            let octave = (octaveStart + Math.floor(k / 12))
            let note = k % 12

            this.notes.push(this.scale[note] + octave)


        }

        // console.log(this.polySynth)

        let synthConf =
        // {}
        /*
        {
          "oscillator" : {
            "type" : "square"
          },
          "envelope" : {
            "attack" : 0.01,
            "decay" : 0.05,
            "sustain" : 0.2,
            "release" : 0.2,
          }
        }
        */
        // /*
        {

            "portamento": 0.01,
            "oscillator": {
                "type": "square"
            },
            "envelope": {
                "attack": 0.005,
                "decay": 0.2,
                "sustain": 0.4,
                "release": 1.4,
            },
            "filterEnvelope": {
                "attack": 0.005,
                "decay": 0.1,
                "sustain": 0.05,
                "release": 0.8,
                "baseFrequency": 300,
                "octaves": 4
            }
        }
    // */
    let synthType = Tone.Synth
    // let synthType = Tone.MonoSynth

    let maxSimultaneousTones = 10

    // /*
    this.polySynth = new Tone.PolySynth(maxSimultaneousTones,
        synthType,
        synthConf
    ).toMaster();
    // */
    // this.changeVolume(this.volume)

    this.pitchShiftEffect = new Tone.PitchShift().toMaster();
    // this.pitchShiftEffect.windowSize = 0.22

    this.sampler = new Tone.Sampler(['assets/sound/wilhelm.mp3'], function () {
        //repitch the sample down a half step
        // this.polySynth.triggerAttack(-1);
        // }).toMaster();
    }).connect(this.pitchShiftEffect)

    // this.volume = -10

    }

    // Called when start() is called and the renderer has been initialised
    init() {


        // Lights

        let ambientLight = new THREE.AmbientLight(0xcccccc);
        this.scene.add(ambientLight);

        let directionalLight = new THREE.DirectionalLight(0xffffff, 2);
        directionalLight.position.set(1, 1, 0.5).normalize();
        this.scene.add(directionalLight);


        // Camera
        this.camera.position.set(0, 500, 1000)
        this.camera.lookAt(0, 500, 0)


    }

    onWindowResize() {
        let { camera, renderer } = this

    }

    deInit() {
    }

    update(delta) {

        let press = key => this.keyPressed(key)
        let release = key => this.keyReleased(key)
        

        let k =12
        if (press('a')) {

            //play a chord
            // this.polySynth.triggerAttackRelease(["C4", "E4", "G4", "B4"])//, "2n");

            // if (this.polySynth) {
                // console.log(this.polySynth.volume)
                this.polySynth.triggerAttack(this.notes[k])

                // /*
                this.pitchShiftEffect.pitch = k - 12
                // this.sampler.triggerAttack(-1);
                this.sampler.triggerAttack(0);

                console.log("Start", this.notes[k])

            // }
        }
        if(release('a')){

          this.polySynth.triggerRelease(this.notes[k]);
          
            console.log("Stop", this.notes[k])
        }
    }
}

module.exports = SurvivalGame
