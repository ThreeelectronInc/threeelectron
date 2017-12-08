let THREE = require('./../../../libs/three/three')

// instantiate a loader
var loader = new THREE.AudioLoader();



function load_audio(path, volume, audio_listener, callback) {
    let audio = new THREE.Audio(audio_listener)

    // load a resource
    loader.load(
        // resource URL
        path,
        // Function when resource is loaded
        (audioBuffer) => {
            // set the audio object buffer to the loaded object
            audio.setBuffer(audioBuffer);
            audio.setVolume(volume);
            callback(audio);
        },
        null,
        // Function called when download errors
        (xhr) => {
            console.log('An error happened');
        }
    );
    
    return audio
}

module.exports = {
    load_audio : load_audio
}