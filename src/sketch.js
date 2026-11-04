import p5 from 'p5'

let showFrame = true;
window.addEventListener('keydown', (e) => {
    if (e.key === 'f') showFrame = !showFrame;
});

let analyser;
let data;

async function startAudio() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);

    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256
    source.connect(analyser);

    data = new Uint8Array(analyser.frequencyBinCount);
}
export function createSketch(onReady) {
    window.addEventListener('pointerdown', () => {
        if (!analyser) startAudio();
    });

    new p5((p) => {
        p.setup = () => {
            const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
            canvas.hide()
            onReady(canvas.elt)
        };

        p.draw = () => {
            p.background(0, 20)
            if (analyser) {
                analyser.getByteFrequencyData(data);
                if (p.frameCount % 30 === 0) {
                    const levels = [];
                    for (let i = 0; i < 10; i++) {
                        levels.push(data[i * 3]);
                    }
                    console.log(levels.join('  '));
                }

            }

            p.fill(255, 0, 255);
            const spacing = p.width / 10
            for (let i = 0; i < 10; i++) {
                const x = spacing * i + spacing / 2;


                const level = data ? data[i * 3] : 0;
                // TÆRSKEL: Juster her til koncerten.
                // 172 er tærsklen for bassen (venstre cirkel). Hæv den, hvis cirklerne reagerer på støj.
                // 3 er, hvor meget tærsklen falder for hver cirkel mod højre, fordi diskanten er svagere.
                // Find støjniveauet ved at logge data[i * 3], når der er stille.

                const threshold = 172 - i * 3;


                const sound = Math.max(0, level - threshold);

                p.circle(x, p.height / 2, 50 + sound * 3);

            }

            if (showFrame) {
                p.noFill();
                p.stroke(255);
                p.strokeWeight(10);
                p.rect(0, 0, p.width, p.height);
                p.noStroke();
            }
        };

    })
};