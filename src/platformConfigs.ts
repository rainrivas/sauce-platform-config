import dotenv from 'dotenv';

dotenv.config({ debug: true });

export default function platformConfigs() {
    interface slcaps {
        seleniumVersion: string;
        extendedDebugging?: boolean;
        browserName?: string;
        version?: number
        platform?: string
        tunnel?: string
        name?: string
        build?: string
    }
    if (process.env.SAUCE_USER === 'undefined' || process.env.SAUCE_AUTHKEY === 'undefined') {
        throw new Error(`Sauce username and authkey must both be defined, ${process.env.SAUCE_USER} | ${process.env.SAUCE_AUTHKEY}`);
    }
    let host = `https://${process.env.SAUCE_USER}:${process.env.SAUCE_AUTHKEY}@ondemand.saucelabs.com:443/wd/hub`;
    let browser = process.env.SAUCE_BROWSER
    // Declare optional values now so we can use them later
    let version = process.env.SAUCE_BROWSER_VERSION;
    let platform = process.env.SAUCE_OS;
    let tunnel = process.env.SAUCE_TUNNEL;
    let name = process.env.TEST_NAME;
    let build = process.env.BUILD_NUMBER;
    let extendedDebugging = process.env.SAUCE_DEBUG;
    console.log(extendedDebugging);

    let caps = {
        'seleniumVersion': '3.14.0',
        'extendedDebugging': '',
        'browserName': "",
        'version': "",
        'platform': "",
        'tunnel': "",
        'name': "",
        'build': ""
    };



    if ('firefox, chrome, safari'.includes(browser)) {
        caps.browserName = browser;
        if (platform === 'undefined' || platform.includes('Windows')) { platform = 'macOS 10.13' }
    } else if ('ie'.includes(browser)) {
        caps.browserName = 'internet explorer';
        if (platform === 'undefined' || platform.includes('mac')) { platform = 'Windows 10' }
    } else if ('edge'.includes(browser)) {
        caps.browserName = 'MicrosoftEdge';
        if (platform === 'undefined' || platform.includes('mac')) { platform = 'Windows 10' }
    } else { // if no good browser name was found, just make it random
        console.warn('Browser was not passed, we are creating a default browser os combo');
        caps.browserName = 'firefox';
        switch (Math.round(Math.random() * Math.max(4))) {
            case 0:
                caps.browserName = 'firefox';
                version = 'latest';
                break;
            case 1:
                caps.browserName = 'chrome';
                version = 'latest';
                break;
            case 2:
                caps.browserName = 'internet explorer';
                if (platform === 'undefined' || platform.includes('mac')) { platform = 'Windows 10' }
                version = 'latest';
                break;
            case 3:
                caps.browserName = 'safari';
                if (platform === 'undefined' || platform.includes('Windows')) { platform = 'macOS 10.13' }
                version = 'latest';
                break;
            default:
                caps.browserName = 'MicrosoftEdge';
                if (platform === 'undefined' || platform.includes("mac")) { platform = 'Windows 10' }
                version = 'latest';
                break;
        }
    }

    // assign optional caps their default values if none is defined
    (version === 'undefined') ? caps.version = 'latest' : caps.version = version;
    (platform === 'undefined') ? caps.platform = 'Windows 10' : caps.platform = platform;
    (tunnel === 'undefined') ? caps.tunnel = '' : caps.tunnel = tunnel;

    caps.name = name;
    caps.build = build;
    console.info(`Custom SL driver caps: ${JSON.stringify(caps)}`);
    return { "host": host, "caps": caps }
}