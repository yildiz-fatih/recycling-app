/**
 * Checks if the current platform is iOS.
 *
 * @returns true if the platform is iOS, false otherwise.
 */
function isIOS() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

/**
 * Checks if the current platform is Android.
 *
 * @returns true if the platform is Android, false otherwise.
 */
function isAndroid() {
    return /Android/i.test(navigator.userAgent);
}

/**
 * Checks if the current platform is a mobile device.
 *
 * @returns true if the platform is a mobile device, false otherwise.
 */
function isMobile() {
    return isIOS() || isAndroid();
}

/**
 * Checks if the current environment is Chrome.
 *
 * @returns true if the current environment is Chrome, false otherwise.
 */
function isChrome() {
    return navigator.userAgent.indexOf('Chrome') !== -1;
}

/**
 * Checks if the current environment is Chrome and the platform is iOS.
 *
 * @returns true if the current environment is Chrome + iOS, false otherwise.
 */
function isChromeIOS() {
    return isIOS() && /CriOS/i.test(navigator.userAgent);
}

/**
 * Gets the value of the requested query param.
 * @param query The query param to check for.
 */
function getQueryParam(query/*: string*/) {
    if ('URLSearchParams' in (/*<any>*/window)) {
        let params = (new URL(document.URL)).searchParams;
        return params.get(query);
    } else {
        if (!(/*<any>*/window).location.search) {
            return undefined;
        }
        let m = new RegExp(query +
            '=([^&]*)').exec((/*<any>*/window).location.search.substring(1));
        if (!m) {
            return undefined;
        }
        return decodeURIComponent(m[1]);
    }
}

const hideElement = (element) => {
    return element.length ? element.map(e => e.style.display = 'none') : element.style.display = 'none';
}

const showElement = (element) => {
    return element.length ? element.map(e => e.style.display = 'block') : element.style.display = 'block';
}

export { getQueryParam, isMobile, isIOS, isAndroid, isChrome, isChromeIOS, hideElement, showElement };
