class Pose {
    static IDLE = 'idle';
    static CLIMB = 'climb';
    static JUMP = 'jump';
    static LEGACY_SWING = 'legacySwing';
    static RUN = 'run';
    static SIT = 'sit';
    static WALK = 'walk';
    static COMBAT_BACKSLASH = 'combatBackslash';
    static COMBAT_HALFSLASH = 'combatHalfslash';
    static COMBAT_IDLE = 'combatIdle';
    static COMBAT_SLASH = 'combatSlash';
}

class Direction {
    static UP = 'up';
    static DOWN = 'down';
    static LEFT = 'left';
    static RIGHT = 'right';
}

class Material {
    static HAIR = 'hair';
    static SKIN = 'skin';
    static CLOTHING = 'clothing';
    static EYES = 'eyes';
    static METAL = 'metal';
}

class Sprite {
    app = null;

    body = {
        type: {},
        head: {},
        eyes: {},
        largeNose: {},
        hair: {},
        eyebrows: {},
        facialHair: {}
    };

    clothing = {
        neckwear: {},
        shoes: {},
        socks: {},
        legs: {},
        shirt: {},
        accessory: {},
        sweater: {},
        eyewear: {}
    };

    panel = {};

    constructor(app) {
        this. app = app;

        for(let category of ['body', 'clothing']) {
            for(let part in this[category]) {
                this[category][part] = {
                    part: document.getElementById(`${category}-${this.app.stringToSlug(part)}-part`),
                    color: document.getElementById(`${category}-${this.app.stringToSlug(part)}-color`),
                    label: document.getElementById(`${category}-${this.app.stringToSlug(part)}-label`)
                };
            }
        }

        this.panel = {
            body: {
                layer: document.getElementById('panel-layer-body'),
                button: document.getElementById('panel-button-body')
            },
            clothing: {
                layer: document.getElementById('panel-layer-clothing'),
                button: document.getElementById('panel-button-clothing')
            }
        };

        this.panel.body.button.addEventListener('click', this.onPanelBody.bind(this));
        this.panel.clothing.button.addEventListener('click', this.onPanelClothing.bind(this));
    }

    onPanelBody() {
        this.panel.body.layer.classList.remove('hidden');
        this.panel.body.button.disabled = true;
        this.panel.body.button.classList.remove('bg-violet-950', 'hover:bg-violet-700');
        this.panel.body.button.classList.add('bg-violet-600');

        this.panel.clothing.layer.classList.add('hidden');
        this.panel.clothing.button.disabled = false;
        this.panel.clothing.button.classList.add('bg-violet-950', 'hover:bg-violet-700');
        this.panel.clothing.button.classList.remove('bg-violet-600');
    }

    onPanelClothing() {
        this.panel.clothing.layer.classList.remove('hidden');
        this.panel.clothing.button.disabled = true;
        this.panel.clothing.button.classList.remove('bg-violet-950', 'hover:bg-violet-700');
        this.panel.clothing.button.classList.add('bg-violet-600');

        this.panel.body.layer.classList.add('hidden');
        this.panel.body.button.disabled = false;
        this.panel.body.button.classList.add('bg-violet-950', 'hover:bg-violet-700');
        this.panel.body.button.classList.remove('bg-violet-600');
    }
}

class Renderer {
    app = null;

    current = Pose.IDLE;

    poses = {
        climb: {},
        emotes: {},
        idle: {},
        jump: {},
        legacySwing: {},
        run: {},
        sit: {},
        walk: {},
        combatBackslash: {},
        combatHalfslash: {},
        combatIdle: {},
        combatSlash: {}
    };

    constructor(app) {
        this. app = app;

        for(const pose in this.poses) {
            const canvas = document.getElementById(pose);

            this.poses[pose] = {
                canvas: canvas,
                context: canvas.getContext('2d')
            };
        }
    }

    async paint() {
        for (const pose in this.poses) {
            const canvas = this.poses[pose].canvas;
            const ctx = this.poses[pose].context;

            const type = this.app.sprite.body.type.part.value;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            await this.drawImage('body.type', pose, type, Material.SKIN);
            await this.drawImage('body.head', pose, type, Material.SKIN);

            if (pose !== Pose.CLIMB && this.app.sprite.body.largeNose.part.value === 'yes') {
                await this.drawImage('body.largeNose', pose, type, Material.SKIN);
            }

            if (pose !== Pose.CLIMB) {
                await this.drawImage('body.eyes', pose, type, Material.EYES);
                await this.drawImage('body.eyebrows', pose, type, Material.HAIR);
                await this.drawImage('body.facialHair', pose, type, Material.HAIR);
                await this.drawImage('body.hair', pose, type, Material.HAIR);
                await this.drawImage('clothing.eyewear', pose, type, Material.METAL);
                await this.drawImage('clothing.neckwear', pose, type, Material.CLOTHING);
            }

            await this.drawImage('clothing.socks', pose, type, Material.CLOTHING);
            await this.drawImage('clothing.shoes', pose, type, Material.CLOTHING);
            await this.drawImage('clothing.legs', pose, type, Material.CLOTHING);
            await this.drawImage('clothing.shirt', pose, type, Material.CLOTHING);
            await this.drawImage('clothing.accessory', pose, type, Material.CLOTHING);
            await this.drawImage('clothing.sweater', pose, type, Material.CLOTHING);
        }

        this.app.preview.refresh();
        this.app.preview.animate();
    }

    async drawImage(key, pose, type, material) {
        const canvas = this.poses[pose].canvas;
        const ctx = this.poses[pose].context;
        const element = this.app.getElementByPath(this.app.sprite, key);
        const path = this.createPath(key, pose, type, material);

        if (element.part.value || element.part.classList.contains('hidden')) {
            try {
                const img = await this.loadImage(path)
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            } catch(e) {
                console.log('Image could not be loaded:', path);
            }
        }
    }

    loadImage(path) {
        return new Promise((resolve, reject) => {
            const img = new Image()
            img.crossOrigin = 'Anonymous' // to avoid CORS if used with Canvas
            img.src = path
            img.onload = () => {
                resolve(img)
            }
            img.onerror = e => {
                reject(e)
            }
        })
    }

    createSkinPath(key, pose) {
        const element = this.app.getElementByPath(this.app.sprite, key);
        const part = this.app.getElementByPath(this.app.parts, key);

        if (element.part.value) {
            let path = '';

            if(element.part.value == 'yes') {
                path = part.path;
            } else {
                path = part[element.part.value].path;
            }

            path += this.getSkinColorPath(element.color.value);
            path += this.app.poses[pose].name + '.png';

            return path;
        }
    }


    createMetalPath(key, pose) {
        const element = this.app.getElementByPath(this.app.sprite, key);
        const part = this.app.getElementByPath(this.app.parts, key);

        if (element.part.value) {
            let path = part[element.part.value].path;
            if(element.part.value !== 'eyepatch') {
                path += this.app.colors.metal[element.color.value].name + '/';
            }
            path += this.app.poses[pose].name + '.png';

            return path;
        }
    }


    createEyesPath(key, pose) {
        const element = this.app.getElementByPath(this.app.sprite, key);
        const part = this.app.getElementByPath(this.app.parts, key);

        if (element.color.value) {
            let path = part.path;
            path += this.app.colors.eyes[element.color.value].name + '/';
            path += this.app.poses[pose].name + '.png';

            return path;
        }
    }

    createHairPath(key, pose) {
        const element = this.app.getElementByPath(this.app.sprite, key);
        const part = this.app.getElementByPath(this.app.parts, key);

        if (element.part.value) {
            let path = part[element.part.value].path;
            path += this.app.colors.hair[element.color.value].name + '/';
            path += this.app.poses[pose].name + '.png';

            return path;
        }
    }

    createClothingPath(key, pose, type) {
        const element = this.app.getElementByPath(this.app.sprite, key);
        const part = this.app.getElementByPath(this.app.parts, key);

        if (element.part.value) {
            let path = part[element.part.value].path['body.' + type];
            path += this.app.colors.clothing[element.color.value].name + '/';
            path += this.app.poses[pose].name + '.png';

            return path;
        }
    }

    createPath(key, pose, type, material) {
        if(material === 'skin') {
            return this.createSkinPath(key, pose);
        } else if(material === 'clothing') {
            return this.createClothingPath(key, pose, type);
        } else if(material === 'metal') {
            return this.createMetalPath(key, pose);
        } else if(material === 'eyes') {
            return this.createEyesPath(key, pose)
        } else if(material === 'hair') {
            return this.createHairPath(key, pose)
        }
    }

    getSkinColorPath(color) {
        if(['bronze', 'brown', 'coffee', 'honey', 'ivory', 'peach', 'porcelain', 'tan', 'tawny'].indexOf(color) >= 0) {
            return this.app.colors['skin'][color].name + '/';
        } else {
            return '_Alternate Colors/' + this.app.colors['clothing'][color].name + '/';
        }
    }
}

class Preview {
    app = null;
    base = null;
    canvas = null;
    context = null;
    controls = {};
    currentZoom = 3;
    currentDirection = Direction.LEFT;
    totalFrames = 0;
    currentFrame = 0;
    isStarted = false;
    isRunning = true;
    duration = 200;
    lastFrameTime = 0;

    constructor(app) {
        this.app = app;

        this.base = document.getElementById('preview');
        this.canvas = document.getElementById('preview-canvas');
        this.context = this.canvas.getContext('2d')

        this.controls.play = document.getElementById('preview-play');
        this.controls.play.addEventListener('click', this.onPlay.bind(this));

        this.controls.pause = document.getElementById('preview-pause');
        this.controls.pause.addEventListener('click', this.onPause.bind(this));

        this.controls.zoomIn = document.getElementById('preview-zoom-in');
        this.controls.zoomIn.addEventListener('click', this.onZoomIn.bind(this));

        this.controls.zoomOut = document.getElementById('preview-zoom-out');
        this.controls.zoomOut.addEventListener('click', this.onZoomOut.bind(this));

        for(const i in Direction) {
            const dir = `${Direction[i][0].toUpperCase()}${Direction[i].slice(1)}`;
            this.controls[`direction${dir}`] = document.getElementById(`preview-direction-${this.app.stringToSlug(Direction[i])}`);
            this.controls[`direction${dir}`].addEventListener('click', this[`onDirection${dir}`].bind(this));
        }
    }

    zoom() {
        this.base.style.width = `${64 * this.currentZoom}px`;
        this.base.style.height = `${64 * this.currentZoom}px`;
    }

    onPlay() {
        console.log('PLAY CLICKED');
        this.controls.play.classList.add('hidden');
        this.controls.pause.classList.remove('hidden');
        this.isRunning = true;
    }

    onPause() {
        console.log('PAUSE CLICKED');
        this.controls.play.classList.remove('hidden');
        this.controls.pause.classList.add('hidden');
        this.isRunning = false;
    }



    onZoomIn() {
        console.log('ZOOM IN CLICKED');
        this.currentZoom += 0.25;

        if(this.currentZoom < 4) {
            this.controls.zoomIn.disabled = false;
            this.controls.zoomOut.disabled = false;
        } else {
            this.currentZoom = 4;
            this.controls.zoomIn.disabled = true;
            this.controls.zoomOut.disabled = false;
        }

        this.zoom();
    }

    onZoomOut() {
        console.log('ZOOM OUT CLICKED');
        this.currentZoom -= 0.25;

        if(this.currentZoom > 0.75) {
            this.controls.zoomOut.disabled = false;
            this.controls.zoomIn.disabled = false;
        } else {
            this.currentZoom = 0.75;
            this.controls.zoomOut.disabled = true;
            this.controls.zoomIn.disabled = false;
        }

        this.zoom();
    }

    onDirectionUp() {
        console.log('DIRECTION UP CLICKED');
        this.currentDirection = Direction.UP;
    }

    onDirectionDown() {
        console.log('DIRECTION DOWN CLICKED');
        this.currentDirection = Direction.DOWN;
    }

    onDirectionLeft() {
        console.log('DIRECTION LEFT CLICKED');
        this.currentDirection = Direction.LEFT;
    }

    onDirectionRight() {
        console.log('DIRECTION RIGHT CLICKED');
        this.currentDirection = Direction.RIGHT;
    }

    getDirectionOffset() {
        switch(this.currentDirection) {
            case Direction.UP: return 0;
            case Direction.LEFT: return 64;
            case Direction.DOWN: return 128;
            case Direction.RIGHT: return 192;
        }
    }

    refresh() {
        if(this.app.renderer.current === Pose.CLIMB) {
            this.currentDirection = Direction.UP;
            this.controls.directionLeft.disabled = true;
            this.controls.directionRight.disabled = true;
            this.controls.directionDown.disabled = true;
        } else {
            this.controls.directionLeft.disabled = false;
            this.controls.directionRight.disabled = false;
            this.controls.directionDown.disabled = false;
        }

        this.currentCanvas = this.app.renderer.poses[this.app.renderer.current].canvas;
        this.context = this.canvas.getContext('2d');
        this.totalFrames = (this.currentCanvas.width / 64);
    }

    animate() {
        if(!this.isStarted) {
            this.isStarted = true;
            this.runAnimation();
        }
    }

    runAnimation(timestamp) {
        const elapsedTime = timestamp - this.lastFrameTime;

        if(elapsedTime > this.duration) {
            this.drawFrame();

            if(this.isRunning) {
                this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
            }
            this.lastFrameTime = timestamp;
        }

        requestAnimationFrame(this.runAnimation.bind(this));
    }

    drawFrame() {
        this.context.clearRect(0, 0, 64, 64);
        this.context.drawImage(
            this.currentCanvas,
            this.currentFrame * 64, // frame
            this.getDirectionOffset(), // direction
            64,
            64,
            0,
            0,
            64,
            64
        );

        this.base.style.backgroundImage = `url(${this.canvas.toDataURL()})`;
    }
}

class Controls {
    app = null;

    preview = {};
    download = {};
    pose = {};

    constructor(app) {
        this.app = app;

        this.download.current = document.getElementById('download-current');
        this.download.current.addEventListener('click', this.onDownloadCurrent.bind(this));

        this.download.all = document.getElementById('download-all');
        this.download.all.addEventListener('click', this.onDownloadAll.bind(this));

        this.download.credits = document.getElementById('download-credits');
        this.download.credits.addEventListener('click', this.onDownloadCredits.bind(this));

        for(const i in Pose) {
            this.pose[Pose[i]] = document.getElementById(`pose-${this.app.stringToSlug(Pose[i])}`);
            this.pose[Pose[i]].addEventListener('click', this.onPoseChanged.bind(this))
        }
    }

    onDownloadCurrent() {
        const path = this.app.renderer.poses[this.app.renderer.current].canvas.toDataURL();
        const link = document.createElement('a');
        link.download = this.app.renderer.current;
        link.href = path;
        link.click();
        URL.revokeObjectURL(link.href);
    }

    onDownloadAll() {
        for(const sprite in this.app.renderer.poses) {
            const path = this.app.renderer.poses[sprite].canvas.toDataURL();
            const link = document.createElement('a');
            link.download = sprite;
            link.href = path;
            link.click();
            URL.revokeObjectURL(link.href);
        }
    }

    onDownloadCredits() {
        let parts = [
            this.app.parts.body.type[this.app.sprite.body.type.part.value],
            this.app.parts.body.head[this.app.sprite.body.head.part.value],
            this.app.parts.body.eyes[this.app.sprite.body.eyes.part.value],
            this.app.parts.body.largeNose[this.app.sprite.body.largeNose.part.value],
            this.app.parts.clothing.neckwear[this.app.sprite.clothing.neckwear.part.value],
            this.app.parts.clothing.eyewear[this.app.sprite.clothing.eyewear.part.value],
            this.app.parts.body.hair[this.app.sprite.body.hair.part.value],
            this.app.parts.body.eyebrows[this.app.sprite.body.eyebrows.part.value],
            this.app.parts.body.facialHair[this.app.sprite.body.facialHair.part.value],
            this.app.parts.clothing.shoes[this.app.sprite.clothing.shoes.part.value],
            this.app.parts.clothing.socks[this.app.sprite.clothing.socks.part.value],
            this.app.parts.clothing.legs[this.app.sprite.clothing.legs.part.value],
            this.app.parts.clothing.shirt[this.app.sprite.clothing.shirt.part.value],
            this.app.parts.clothing.accessory[this.app.sprite.clothing.accessory.part.value],
            this.app.parts.clothing.sweater[this.app.sprite.clothing.sweater.part.value],
        ];

        let out = '';

        for(let i of parts) {
            if(!i) {
                continue;
            }

            out += i.credits + "\n";
            out += '-------------------' + "\n";
            out += '  ARTIST(S): ' + this.app.credits[i.credits].artists + "\n";

            if(this.app.credits[i.credits].source) {
                out += '  SOURCE: ' + this.app.credits[i.credits].source + "\n";
            }

            out += '  LICENSE: ' + this.app.credits[i.credits].license + "\n";
            out += '  DETAILS: ' + this.app.credits[i.credits].details + "\n";

            if(this.app.credits[i.credits].notes) {
                out += '  NOTES: ' + "\n";

                for(let n of this.app.credits[i.credits].notes) {
                    out += '    ' + n + "\n";
                }
            }

            out += "\n\n";


        }

        const link = document.createElement("a");
        const file = new Blob([out], { type: 'text/plain' });

        link.href = URL.createObjectURL(file);
        link.download = "credits.txt";
        link.click();
        URL.revokeObjectURL(link.href);
    }
}

class App {
    specs = null;
    credits = null;

    parts = null;
    poses = null;
    colors = null;

    renderer = null;
    sprite = null;
    preview = null;

    constructor() {
        this.controls = new Controls(this);
        this.renderer = new Renderer(this);
        this.sprite = new Sprite(this);
        this.preview = new Preview(this);
    }

    async run() {
        try {
            await this.fetchSpecs();
        } catch (error) {
            console.error("Specs fetch failed:", error.message);
        }

        try {
            await this.fetchCredits();
        } catch (error) {
            console.error("Credits fetch failed:", error.message);
        }

        this.initSelections();
        this.initCanvasMenu();
        this.renderer.paint();
    }

    async fetchSpecs() {
        this.specs = await this.fetch('specs.json');
        this.colors = this.specs.colors;
        this.poses = this.specs.poses;
        this.parts = this.specs.parts;
    }

    async fetchCredits() {
        this.credits = await this.fetch('credits.json');
    }

    async fetch(path) {
        let response = await fetch(path);

        if(!response.ok) {
            throw new Error("Network response was not ok");
        }

        return response.json();
    }

    initCanvasMenu() {
        const buttons = document.querySelectorAll('#pose button');

        for(const button of buttons) {
            button.addEventListener('click', () => {
                document.querySelectorAll('#canvas canvas').forEach((c) => {
                    c.classList.add('hidden');

                    if(c.id === button.value) {
                        this.renderer.current = button.value;
                        c.classList.remove('hidden');
                        this.preview.refresh();
                        this.preview.animate();
                    }
                });
            });
        }
    }

    initSelections() {
        this.initSelection('body.type', Material.SKIN);
        this.initSelection('body.head', Material.SKIN);
        this.initSelection('body.eyes', Material.EYES);
        this.initSelection('body.largeNose', Material.SKIN);
        this.initSelection('clothing.eyewear', 'metal');
        this.initSelection('body.hair', Material.HAIR);
        this.initSelection('body.eyebrows', Material.HAIR);
        this.initSelection('body.facialHair', Material.HAIR);
        this.initSelection('clothing.neckwear', 'clothing');
        this.initSelection('clothing.shoes', 'clothing');
        this.initSelection('clothing.socks', 'clothing');
        this.initSelection('clothing.legs', 'clothing');
        this.initSelection('clothing.shirt', 'clothing');
        this.initSelection('clothing.accessory', 'clothing');
        this.initSelection('clothing.sweater', 'clothing');
    }

    initSelection(key, material) {
        const element = this.getElementByPath(this.sprite, key);

        this.fillPartSelects(key, this.getElementByPath(this.parts, key), element.part);
        this.fillColorSelects(key, this.colors[material], element.color);

        element.label.style.backgroundColor = this.colors[material][element.color.value].color;
        element.color.addEventListener('change', (event) => {
            try {
                element.label.style.backgroundColor = this.colors[material][element.color.value].color;
            } catch(e) { // fallback
                element.label.style.backgroundColor = this.colors.clothing[element.color.value].color;
            }

            this.renderer.paint();
        });

        element.part.addEventListener('change', (event) => {
            this.renderer.paint();
        });
    }

    fillPartSelects(key, parts, select) {
        if(key === 'body.eyes') {
            select.disabled = true;
            select.classList.add('hidden');
            return;
        } else if(key === 'body.largeNose') {
            return;
        }

        for(let i in parts) {
            const option = this.createOption(i, parts[i].name);
            option.classList.add('text-black');
            select.appendChild(option);
        }
    }

    fillColorSelects(key, colors, select) {
        for(let i in colors) {
            const option = this.createOption(i, colors[i].name);
            option.style.backgroundColor = colors[i].color;
            option.classList.add('text-black', 'm-2', 'uppercase', 'font-bold', 'text-sm');
            select.appendChild(option);
        }

        if(key === 'body.type' || key === 'body.head' || key === 'body.largeNose') {
            const optGroup = document.createElement('optgroup');
            optGroup.label = 'Additional';
            optGroup.classList.add('text-black', 'm-2', 'uppercase', 'font-bold', 'text-sm');
            select.appendChild(optGroup);
            this.fillColorSelects(null, this.colors.clothing, optGroup);
        }


        select.selectedIndex = 0;
    }

    createOption(value, label) {
        const option = document.createElement('option');
        option.value = value;
        option.innerText = label;

        return option;
    }

    stringToSlug(str) {
        return str.replace(/[A-Z]/g, match => '-' + match.toLowerCase()).replace(/^-/, '');
    }

    getElementByPath(elements, path) {
        const keys = path.split('.');
        let current = elements;

        for (const key of keys) {
            if (current.hasOwnProperty(key)) {
                current = current[key];
            } else {
                return undefined;
            }
        }

        return current;
    }
}

const app = new App();
app.run();
