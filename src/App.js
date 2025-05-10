// src/App.js ----------------------------------------------------------------
import ImageRecognition from './ImageRecognition.js';
import { hideElement, showElement } from './utils/utils.js';
import find from 'lodash/find';

import { blueBinItems } from './data/blueBinItems';
import { yellowBinItems } from './data/yellowBinItems';
import { greenBinItems } from './data/greenBinItems';
import { brownBinItems } from './data/brownBinItems';
import { greyBinItems } from './data/greyBinItems';
import { redBinItems } from './data/redBinItems';

// helper: records scans + bumps XP
import { recordScan } from './scanRecorder.js';

import './App.css';

export default class App {
    constructor() {
        this.confirmationButtons = document.getElementById('confirmation-buttons');
        this.classificationDiv = document.getElementById('recycling-classification');
        this.doneButton = document.getElementById('next');
        this.resultDiv = document.getElementById('result');
        this.guessButton = document.getElementById('guess-button');
        this.startButton = document.getElementsByClassName('start-button')[0];
        this.introBlock = document.getElementsByClassName('intro')[0];
        this.feedSection = document.getElementsByClassName('feed')[0];

        this.recognitionFeature = new ImageRecognition();
        this.currentItemName = null;   // remember last prediction
    }

    /* -------- Init -------- */
    init = () => {
        this.recognitionFeature.loadModel().then(() => {
            this.startButton.classList.remove('blinking');
            this.startButton.innerText = 'Start';
            this.startButton.onclick = () => this.start();
        });
    };

    /* -------- Camera / prediction flow -------- */
    start() {
        hideElement(this.introBlock);
        showElement(this.feedSection);

        this.recognitionFeature.initiateWebcam()
            .then(() => {
                this.guessButton.classList.remove('blinking');
                this.guessButton.innerText = 'Is this recyclable?';
                this.guessButton.onclick = () => this.predict();
            })
            .catch(() => {
                hideElement(this.guessButton);
                this.resultDiv.innerHTML =
                    'Webcam not available. This demo requires camera access.';
            });
    }

    predict = () => {
        this.recognitionFeature.runPredictions().then(predictions => {
            if (!predictions.length) return;

            const item = predictions[0].class.split(',')[0];
            this.currentItemName = item;

            this.resultDiv.innerText = '';
            this.resultDiv.innerHTML = `Is it a ${item}?`;
            hideElement([this.classificationDiv, this.guessButton]);

            this.classifyItem(item);
        });
    };

    /* -------- Classification logic -------- */
    classifyItem = item => {
        const found = (arr) => !!find(arr, x => x === item);

        if (found(blueBinItems)) this.displayButtons('blue');
        else if (found(yellowBinItems)) this.displayButtons('yellow');
        else if (found(greenBinItems)) this.displayButtons('green');
        else if (found(brownBinItems)) this.displayButtons('brown');
        else if (found(greyBinItems)) this.displayButtons('grey');
        else if (found(redBinItems)) this.displayButtons('red');
        else this.displayButtons('none');
    };

    displayButtons = color => {
        showElement([this.confirmationButtons, this.resultDiv]);

        const yesButton = document.getElementById('yes');
        const noButton = document.getElementById('no');

        yesButton.onclick = () => this.displayClassification(color);
        noButton.onclick = () => this.predict();        // re-scan on “No”
    };

    /* -------- Respond to user’s “Yes” -------- */
    displayClassification = color => {
        this.showClassification();
        let content;

        switch (color) {
            case 'blue':
                content = 'Recycle it! Drop into the 🔵 blue Paper & Cardboard bin.';
                recordScan(this.currentItemName, true);
                break;

            case 'yellow':
                content = 'Recycle it! Into the 🟡 yellow Plastics & Metals bin.';
                recordScan(this.currentItemName, true);
                break;

            case 'green':
                content = 'Recycle it! Into the 🟢 green Glass bin.';
                recordScan(this.currentItemName, true);
                break;

            case 'brown':
                content = 'Compost it! 🟤 brown Organics bin.';
                recordScan(this.currentItemName, true);
                break;

            case 'grey':
                content = '⚫ General waste – no current recycling route.';
                recordScan(this.currentItemName, false);
                break;

            case 'red':
                content = '🔴 Hazardous item! Please take to a special drop-off.';
                recordScan(this.currentItemName, false);
                break;

            case 'none':
                content = `Hmm, I’m not sure how to classify that yet…`;
                this.displayLastButtons();
                break;

            default:
                break;
        }

        this.resultDiv.innerHTML = content;
        if (color !== 'none') this.showFinalMessage(content);
    };

    /* -------- Fallback Q&A for unknown items -------- */
    displayLastButtons = () => {
        showElement([this.confirmationButtons, this.resultDiv]);

        const yesButton = document.getElementById('yes');
        const noButton = document.getElementById('no');

        yesButton.onclick = () => {
            recordScan(this.currentItemName, true);
            this.showFinalMessage(
                'You can probably put it in the 🟡 yellow recycling bin! 🎉'
            );
        };

        noButton.onclick = () => {
            recordScan(this.currentItemName, false);
            this.showFinalMessage(
                'Better put it in ⚫ general waste for now.'
            );
        };
    };

    /* -------- UI helpers -------- */
    showFinalMessage = content => {
        this.resultDiv.innerHTML = content;
        hideElement(this.confirmationButtons);
        showElement(this.doneButton);

        this.doneButton.onclick = () => {
            showElement(this.guessButton);
            hideElement([this.classificationDiv, this.doneButton, this.resultDiv]);
        };
    };

    showClassification = () => {
        showElement(this.classificationDiv);
    };
}
