const start = () => {
    const WIDTH = 160;
    const HEIGHT = 100;
    const SCENE = 1500;

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
    ctx_2.imageSmoothingEnabled = false;
    // ctx_2.imageSmoothingQuality = 'low';

    const animSizeX = WIDTH * .4;
    const animSizeY = HEIGHT * .4;

    const halfX = WIDTH / 2;
    const halfY = HEIGHT / 2;

    const minScale = .12;
    const maxScale = .5;
    const maxScale1of2 = maxScale / 2;

    let frame_1 = 0;
    let frame_2 = 600;
    let frame_3 = 1050;
    const clear = ctx => {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
    }

    const serView = (ctx, smooth, data, frame) => {
        const radius = DEG_360 * (frame / SCENE);
        const radius2 = radius * 2;

        const half = frame < SCENE / 2;

        const sinR = Math.sin(radius);
        const cosR2 = Math.cos(half ? radius2 : -radius2);
        const sinR2 = Math.sin(radius2) * (half ? 1 : -1);

        /** graphic functions */
        const getSmooth = num => smooth ? num : Math.round(num);

        const vectorX = () => (sinR * animSizeX);
        const vectorY = () => (Math.cos(DEG_90 + (radius2)) * animSizeY);

        const scale = p => (p * (((sinR + 1) * maxScale1of2) + minScale));

        const rotationX = (s1, s2) => getSmooth((cosR2 * s1) - (sinR2 * s2));
        const rotationY = (s1, s2) => getSmooth((cosR2 * s2) + (sinR2 * s1));

        const pointX = (r, v) => getSmooth(r + halfX + v);
        const pointY = (r, v) => getSmooth(r + halfY + v);

        /** drawing */
        const vx = vectorX();
        const vy = vectorY();

        for (const d of data) {
            ctx.fillStyle = d.color;
            ctx.beginPath();
            for (let i = 0; i < d.line.length; i++) {
                const p = d.line[i];

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
        clear(ctx_1);
        clear(ctx_2);

        serView(ctx_1, true, alien_1, frame_1);
        serView(ctx_2, false, alien_1, frame_1);
        frame_1++;
        if (frame_1 > SCENE) frame_1 = 0

        serView(ctx_1, true, alien_2, frame_2);
        serView(ctx_2, false, alien_2, frame_2);
        frame_2++;
        if (frame_2 > SCENE) frame_2 = 0

        serView(ctx_1, true, alien_3, frame_3);
        serView(ctx_2, false, alien_3, frame_3);
        frame_3++;
        if (frame_3 > SCENE) frame_3 = 0
    }, 16);
}

start();