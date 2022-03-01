const start = () => {
    const WIDTH = 160;
    const HEIGHT = 100;
    const SCENE = 500;

    const DEG_90 = Math.PI / 2;
    const DEG_360 = Math.PI * 2;

    const canvas_1 = document.getElementById('canvas-1');
    const canvas_2 = document.getElementById('canvas-2');

    const setSize = (canvas) => {
        canvas.width = WIDTH;
        canvas.height = HEIGHT;

        let wrap = canvas.parentElement;
        let wrapRec = wrap.getBoundingClientRect();
        canvas.style.width = wrapRec.width + 'px';
    }

    setSize(canvas_1);
    const ctx_1 = canvas_1.getContext('2d');
    setSize(canvas_2);
    const ctx_2 = canvas_2.getContext('2d');

    const alien = [{
            color: '#0059b3',
            line: [
                [-25, -33],
                [25, -33],
                [45, -3],
                [25, 37],
                [-25, 37],
                [-45, -3]
            ]
        },
        {
            color: '#8c1aff',
            line: [
                [-25, -23],
                [-85, 17],
                [-55, -33]
            ]
        },
        {
            color: '#8c1aff',
            line: [
                [25, -23],
                [85, 17],
                [55, -33]
            ]
        },
        {
            color: '#400',
            line: [
                [-30, -13],
                [-5, 2],
                [-30, -3]
            ]
        },
        {
            color: '#400',
            line: [
                [30, -13],
                [5, 2],
                [30, -3]
            ]
        },
    ]

    const animSizeX = WIDTH * .4;
    const animSizeY = HEIGHT * .4;

    const halfX = WIDTH / 2;
    const halfY = HEIGHT / 2;

    const minScale = .2;
    const maxScale = .6;
    const maxScale1of2 = maxScale / 2;

    let frame = 0;
    const serView = (ctx, smooth) => {
        const radius = DEG_360 * (frame / SCENE);
        const radius2 = radius * 2;

        const half = frame < SCENE / 2;

        const sinR = Math.sin(radius);
        const cosR2 = Math.cos(half ? radius2 : -radius2);
        const sinR2 = Math.sin(radius2) * (half ? 1 : -1);

        /** graphic functions */
        const getSmooth = num => smooth ? num : Math.round(num);

        const vectorX = () => getSmooth(sinR * animSizeX);
        const vectorY = () => getSmooth(Math.cos(DEG_90 + (radius2)) * animSizeY);

        const scale = p => getSmooth(p * (((sinR + 1) * maxScale1of2) + minScale));

        const rotationX = (s1, s2) => getSmooth((cosR2 * s1) - (sinR2 * s2));
        const rotationY = (s1, s2) => getSmooth((cosR2 * s2) + (sinR2 * s1));

        const pointX = (r, v) => getSmooth(r + halfX + v);
        const pointY = (r, v) => getSmooth(r + halfY + v);

        /** drawing */
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        const vx = vectorX();
        const vy = vectorY();

        for (const a of alien) {
            ctx.fillStyle = a.color;
            ctx.beginPath();
            for (let i = 0; i < a.line.length; i++) {
                const p = a.line[i];

                const sx = scale(p[0]);
                const sy = scale(p[1]);

                const rx = rotationX(sx, sy);
                const ry = rotationY(sx, sy);

                const px = pointX(rx, vx);
                const py = pointY(ry, vy);

                if (i == 0) { ctx.moveTo(px, py); continue };
                ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.fill();
        }
    }

    setInterval(() => {
        serView(ctx_1, true);
        serView(ctx_2, false);
        frame++;
        if (frame > SCENE) frame = 0
    }, 16);
}

start();