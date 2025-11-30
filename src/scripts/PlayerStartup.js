(function () {
    /* 1. Load Azure Speech SDK *********************************************/
    const script = document.createElement('script');
    script.src = 'https://aka.ms/csspeech/jsbrowserpackageraw';   // ← space removed
    script.onload = () => {
        console.log('✅ Azure Speech SDK loaded');
        try {
            Microsoft.Dynamics.NAV.InvokeExtensibilityMethod('ControlReady', []);
        } catch (e) {
            console.log('ControlReady mock triggered');
        }
    };
    document.head.appendChild(script);
    /************************************************************************/

    /* Mock outside BC */
    if (!window.Microsoft || !window.Microsoft.Dynamics || !window.Microsoft.Dynamics.NAV) {
        window.Microsoft = { Dynamics: { NAV: { InvokeExtensibilityMethod: (n, a) => console.log('Mock:', n, a) } } };
    }

    /* Global error handler */
    window.onerror = (m, s, l, c, e) => {
        document.body.innerHTML += `<div style="color:red">Error: ${m}</div>`;
        return true;
    };
})();