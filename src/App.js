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
        // DOM refs --------------------------------------------------------
        this.choiceButtonsDiv = document.getElementById('choice-buttons');
        this.classificationDiv = document.getElementById('recycling-classification');
        this.doneButton = document.getElementById('next');
        this.resultDiv = document.getElementById('result');
        this.guessButton = document.getElementById('guess-button');
        this.startButton = document.getElementsByClassName('start-button')[0];
        this.introBlock = document.getElementsByClassName('intro')[0];
        this.feedSection = document.getElementsByClassName('feed')[0];

        // Feature helpers ------------------------------------------------
        this.recognitionFeature = new ImageRecognition();
        this.currentItemName = null;   // remember last confirmed prediction
    }

    /* ------------------------- Init ----------------------------------- */
    init = () => {
        this.recognitionFeature.loadModel().then(() => {
            this.startButton.classList.remove('blinking');
            this.startButton.innerText = 'Start';
            this.startButton.onclick = () => this.start();
        });
    };

    /* ------------------- Camera / prediction flow --------------------- */
    start = () => {
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
    };

    predict = () => {
        this.resultDiv.innerHTML = 'Scanning…';
        hideElement(this.guessButton);

        this.recognitionFeature.runPredictions().then(predictions => {
            if (!predictions.length) {
                this.resultDiv.innerHTML = 'I could not detect anything. Try again?';
                showElement(this.guessButton);
                return;
            }

            const guesses = predictions
                .sort((a, b) => b.score - a.score)
                .slice(0, 3)
                .map(p => p.class.split(',')[0]);

            this.showGuessOptions(guesses);
        });
    };

    /* ------------------ Guess‑list UI helpers ------------------------- */
    showGuessOptions = (guesses) => {
        this.choiceButtonsDiv.innerHTML = '';

        const makeBtn = (label, handler) => {
            const btn = document.createElement('button');
            btn.textContent = label;
            btn.onclick = handler;
            this.choiceButtonsDiv.appendChild(btn);
        };

        guesses.forEach(name => makeBtn(name, () => this.handleGuess(name)));
        makeBtn('None of these', this.handleNoneOfThese);

        this.resultDiv.innerHTML = 'Is it one of these?';
        showElement([this.resultDiv, this.choiceButtonsDiv]);
    };

    handleGuess = (itemName) => {
        this.currentItemName = itemName;
        hideElement(this.choiceButtonsDiv);
        this.classifyItem(itemName);
    };

    handleNoneOfThese = () => {
        hideElement(this.choiceButtonsDiv);
        this.resultDiv.innerHTML = '';
        showElement(this.guessButton);
    };

    /* ------------------- Classification logic ------------------------ */
    classifyItem = (item) => {
        const found = (arr) => !!find(arr, x => x === item);
        if (found(blueBinItems)) this.displayClassification('blue');
        else if (found(yellowBinItems)) this.displayClassification('yellow');
        else if (found(greenBinItems)) this.displayClassification('green');
        else if (found(brownBinItems)) this.displayClassification('brown');
        else if (found(greyBinItems)) this.displayClassification('grey');
        else if (found(redBinItems)) this.displayClassification('red');
        else this.displayClassification('none');
    };

    /* ------------------- Show result message ------------------------- */
    displayClassification = (color) => {
        this.showClassification();
        let content;

        switch (color) {
            case 'blue':
                content = '🔵 Blue Bin: Paper & Cardboard';
                recordScan(this.currentItemName, 'blue');
                break;

            case 'yellow':
                content = '🟡 Yellow Bin: Plastics & Metals';
                recordScan(this.currentItemName, 'yellow');
                break;

            case 'green':
                content = '🟢 Green Bin: Glass';
                recordScan(this.currentItemName, 'green');
                break;

            case 'brown':
                content = '🟤 Brown Bin: Organics';
                recordScan(this.currentItemName, 'brown');
                break;

            case 'grey':
                content = '⚫ General Waste: no recycling route';
                recordScan(this.currentItemName, 'grey');
                break;

            case 'red':
                content = '🔴 Red Bin: Hazardous & Specialty';
                recordScan(this.currentItemName, 'red');
                break;

            case 'none':
                content = '❓ Not recognized';
                break;

            default:
                content = '';
        }

        this.showFinalMessage(content);
    };

    /* ------------------- UI helpers ---------------------------------- */
    showFinalMessage = (content) => {
        this.resultDiv.innerHTML = content;
        hideElement(this.choiceButtonsDiv);
        showElement(this.doneButton);

        this.doneButton.onclick = () => {
            showElement(this.guessButton);
            hideElement([this.classificationDiv, this.doneButton, this.resultDiv]);
            this.resultDiv.innerHTML = '';
        };
    };

    showClassification = () => {
        showElement(this.classificationDiv);
    };
}