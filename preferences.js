let Preferences;

// Form getter & setter functions by element type
const bind_functions = {
    SELECT: {
        get: (input) => input.value,
        set: (input, value) => {input.value = value}
    },
    INPUT: {
        get: (input) => !!input.checked,
        set: (input, value) => {input.checked = !!value}
    }
}

async function bind_preference(option) {
    const input = document.getElementById(option);
    const bind_fn = bind_functions[input.tagName];

    // Set the form input value to current value for the preference
    bind_fn.set(input, await Preferences.get(option));

    // Create an event listener for saving the preference value
    // and send a signal when form input value changes
    input.addEventListener('change', async (event) => {
        await Preferences.set(option, bind_fn.get(event.target));
    });
}

async function init() {
    let main = await browser.runtime.getBackgroundPage();
    Preferences = main.Preferences;
    for (option in Preferences.defaults) {
        bind_preference(option);
    }
}

// Bind all preferences
document.addEventListener('DOMContentLoaded', init);
