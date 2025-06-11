
// houdini-ripple.js
if ('CSS' in window && 'paintWorklet' in CSS) {
    CSS.registerProperty({
        name: '--ripple-x',
        syntax: '<number>',
        inherits: false,
        initialValue: 0,
    });
    CSS.registerProperty({
        name: '--ripple-y',
        syntax: '<number>',
        inherits: false,
        initialValue: 0,
    });
    CSS.registerProperty({
        name: '--ripple-progress',
        syntax: '<number>',
        inherits: false,
        initialValue: 0,
    });

    CSS.paintWorklet.addModule('ripple-paint-worklet.js');
}

// ripple-paint-worklet.js
registerAnimator('ripple', class RippleAnimator {
    animate(currentTime, effect) {
        // En un escenario real, esto se animaría con scroll o eventos de ratón.
        // Para la demo de Houdini, podemos animarlo con currentTime.
        // Para el propósito de esta demo en CSS, dejaremos que CSS controle las propiedades.
        // Aquí es donde harías lógica si estuvieras animando desde JS.
        // Por ejemplo, para un efecto de clic:
        // effect.updateTiming({
        //   duration: 1000,
        //   fill: 'forwards',
        // });
        // effect.updatePlaybackRate(1);
    }
});

registerPaint('ripple', class RipplePaint {
    static get inputProperties() {
        return ['--ripple-x', '--ripple-y', '--ripple-progress', 'background-color', 'border-radius'];
    }

    paint(ctx, geom, properties) {
        const x = properties.get('--ripple-x').value * geom.width;
        const y = properties.get('--ripple-y').value * geom.height;
        const progress = properties.get('--ripple-progress').value;
        const bgColor = properties.get('background-color').toString();
        const borderRadius = properties.get('border-radius').value;

        // Dibujar el fondo normal con border-radius
        ctx.fillStyle = bgColor;
        ctx.beginPath();
        ctx.roundRect(0, 0, geom.width, geom.height, borderRadius);
        ctx.fill();

        // Dibujar el efecto de onda
        if (progress > 0 && progress < 1) {
            const radius = geom.width * 0.5 * progress * 2; // La onda se expande
            const opacity = 1 - progress; // La onda se desvanece

            ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.4})`; // Color de la onda
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
});