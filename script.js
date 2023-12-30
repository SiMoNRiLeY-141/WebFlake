document.addEventListener('DOMContentLoaded', function () {
    const snowfallContainer = document.getElementById('snowfall');

    for (let i = 0; i < 50; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.style.cssText = `
            left: ${Math.random() * 100}vw;
            animation-duration: ${Math.random() * 3 + 2}s;
            animation-delay: ${Math.random()}s;
        `;
        snowfallContainer.appendChild(snowflake);
    }
});

