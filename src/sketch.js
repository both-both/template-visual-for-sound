import p5 from 'p5'


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
            }

            p.fill(255, 0, 255);
            const spacing = p.width / 10
            for (let i = 0; i < 10; i++) {
                const x = spacing * i + spacing / 2;


                const level = data ? data[i * 12] : 0;
                const threshold = 175 - i * 12;
                const sound = Math.max(0, level - threshold);

                p.circle(x, p.height / 2, 50 + sound * 3);
            }
        };

    })
};