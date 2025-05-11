// src/ImageRecognition.js
import * as mobilenet from '@tensorflow-models/mobilenet';
import { Webcam } from './utils/webcam';
import { isMobile } from './utils/utils';

export default class ImageRecognition {
    constructor() {
        this.webcam = null;
        this.model = null;
    }

    /**
     * Load the MobileNet model.
     */
    loadModel = async () => {
        this.model = await mobilenet.load();
        return this.model;
    };

    /**
     * Initialize webcam exactly as before.
     */
    initiateWebcam = async () => {
        this.webcam = new Webcam(document.getElementById('webcam'));
        // size video to fill the screen
        this.webcam.webcamElement.width = window.innerWidth;
        this.webcam.webcamElement.height = window.innerHeight;

        try {
            const facingMode = isMobile() ? 'environment' : 'user';
            if (!isMobile()) {
                this.webcam.webcamElement.classList.add('flip-horizontally');
            }
            await this.webcam.setup({ video: { facingMode }, audio: false });
            console.log('Webcam successfully initialized');
        } catch (err) {
            return err;
        }
    };

    /**
     * Take the current video frame and run MobileNet classification,
     * returning an array of { class, score } objects (top 3 by default).
     */
    runPredictions = async () => {
        // MobileNet.classify takes the video element directly and by default returns top 3
        const results = await this.model.classify(this.webcam.webcamElement, 3);
        return results.map(r => ({
            class: r.className,      // e.g. "banana"
            score: r.probability     // e.g. 0.87
        }));
    };
}
