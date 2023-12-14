let specs = null;

let elements = {
    body: {
        part: document.getElementById('body-part'),
        color: document.getElementById('body-color'),
        label: document.getElementById('body-label')
    },
    head: {
        part: document.getElementById('head-part'),
        color: document.getElementById('head-color'),
        label: document.getElementById('head-label')
    },
    headOverlays: {
        eyes: {
            part: document.getElementById('head-overlays-eyes-part'),
            color: document.getElementById('head-overlays-eyes-color'),
            label: document.getElementById('head-overlays-eyes-label')
        },
        largeNose: {
            part: document.getElementById('head-overlays-large-nose-part'),
            color: document.getElementById('head-overlays-large-nose-color'),
            label: document.getElementById('head-overlays-large-nose-label')
        }
    },
    hair: {
        part: document.getElementById('hair-part'),
        color: document.getElementById('hair-color'),
        label: document.getElementById('hair-label')
    },
    eyebrows: {
        part: document.getElementById('eyebrows-part'),
        color: document.getElementById('eyebrows-color'),
        label: document.getElementById('eyebrows-label')
    },
    facialHair: {
        part: document.getElementById('facial-hair-part'),
        color: document.getElementById('facial-hair-color'),
        label: document.getElementById('facial-hair-label')
    },
    eyewear: {
        part: document.getElementById('eyewear-part'),
        color: document.getElementById('eyewear-color'),
        label: document.getElementById('eyewear-label')
    },
    clothing: {
        accessories: {
            neckwear: {
                part: document.getElementById('clothing-accessories-neckwear-part'),
                color: document.getElementById('clothing-accessories-neckwear-color'),
                label: document.getElementById('clothing-accessories-neckwear-label')
            }
        },
        feed: {
            shoes: {
                part: document.getElementById('clothing-feed-shoes-part'),
                color: document.getElementById('clothing-feed-shoes-color'),
                label: document.getElementById('clothing-feed-shoes-label')
            },
            socks: {
                part: document.getElementById('clothing-feed-socks-part'),
                color: document.getElementById('clothing-feed-socks-color'),
                label: document.getElementById('clothing-feed-socks-label')
            }
        },
        legs: {
            part: document.getElementById('clothing-legs-part'),
            color: document.getElementById('clothing-legs-color'),
            label: document.getElementById('clothing-legs-label')
        },
        torso: {
            shirt: {
                part: document.getElementById('clothing-torso-shirt-part'),
                color: document.getElementById('clothing-torso-shirt-color'),
                label: document.getElementById('clothing-torso-shirt-label')
            }
        },
        torso2: {
            accessory: {
                part: document.getElementById('clothing-torso2-accessory-part'),
                color: document.getElementById('clothing-torso2-accessory-color'),
                label: document.getElementById('clothing-torso2-accessory-label')
            },
            sweater: {
                part: document.getElementById('clothing-torso2-sweater-part'),
                color: document.getElementById('clothing-torso2-sweater-color'),
                label: document.getElementById('clothing-torso2-sweater-label')
            }
        }
    }
};

let canvasCollection = {
    climb: {
        canvas: null,
        context: null
    },
    emotes: {
        canvas: null,
        context: null
    },
    idle: {
        canvas: null,
        context: null
    },
    jump: {
        canvas: null,
        context: null
    },
    legacySwing: {
        canvas: null,
        context: null
    },
    run: {
        canvas: null,
        context: null
    },
    sit: {
        canvas: null,
        context: null
    },
    walk: {
        canvas: null,
        context: null
    },
    combatBackslash: {
        canvas: null,
        context: null
    },
    combatHalfslash: {
        canvas: null,
        context: null
    },
    combatIdle: {
        canvas: null,
        context: null
    },
    combatSlash: {
        canvas: null,
        context: null
    }
};

let currentSpritesheet = 'idle';

const preview = {
    currentDirection: 'left',
    currentZoom: 3,
    currentCanvas: null,
    totalFrames: 0,
    currentFrame: 0,
    isStarted: false,
    isRunning: true,
    duration: 200,
    lastFrameTime: 0,
    base: document.getElementById('preview'),
    canvas: document.getElementById('preview-canvas'),
    context: null,
    direction: {
        up: document.getElementById('preview-up'),
        left: document.getElementById('preview-left'),
        right: document.getElementById('preview-right'),
        down: document.getElementById('preview-down'),
    },
    zoom: {
        in: document.getElementById('preview-zoom-in'),
        out: document.getElementById('preview-zoom-out')
    },
    control: {
        play: document.getElementById('preview-play'),
        pause: document.getElementById('preview-pause'),
    }
}

const download = {
    current: document.getElementById('download-current'),
    all: document.getElementById('download-all'),
    credits: document.getElementById('download-credits'),
}

const panel = {
    body: {
        layer: document.getElementById('panel-layer-body'),
        button: document.getElementById('panel-button-body')
    },
    clothing: {
        layer: document.getElementById('panel-layer-clothing'),
        button: document.getElementById('panel-button-clothing')
    }
};

let credits = null;

fetch('specs.json')
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(data => {
        specs = data;

        initCanvasMenu();
        initCanvasCollection();
        initPreviewButtons();
        initPanelButtons();
        initDownloadButtons();
        initSelections();

        paint();
    })
    .catch(error => {
        console.error("Fetch failed:", error.message);
    });

fetch('credits.json')
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(data => {
        credits = data;
    })
    .catch(error => {
        console.error("Fetch failed:", error.message);
    });

/******************************************************************************
 * INITIALISATION
 *****************************************************************************/
function initSelections() {
    initSelection('body', 'skin');
    initSelection('head', 'skin');
    initSelection('headOverlays.eyes', 'eyes');
    initSelection('headOverlays.largeNose', 'skin');
    initSelection('clothing.accessories.neckwear', 'clothing');
    initSelection('eyewear', 'metal');
    initSelection('hair', 'hair');
    initSelection('eyebrows', 'hair');
    initSelection('facialHair', 'hair');
    initSelection('clothing.feed.shoes', 'clothing');
    initSelection('clothing.feed.socks', 'clothing');
    initSelection('clothing.legs', 'clothing');
    initSelection('clothing.torso.shirt', 'clothing');
    initSelection('clothing.torso2.accessory', 'clothing');
    initSelection('clothing.torso2.sweater', 'clothing');
}

function initPanelButtons() {
    for(const type in panel) {
        const button = panel[type].button;

        button.addEventListener('click', () => {
            if(type === 'body') {
                panel.body.layer.classList.remove('hidden');
                panel.body.button.disabled = true;
                panel.body.button.classList.remove('bg-violet-950', 'hover:bg-violet-700');
                panel.body.button.classList.add('bg-violet-600');

                panel.clothing.layer.classList.add('hidden');
                panel.clothing.button.disabled = false;
                panel.clothing.button.classList.add('bg-violet-950', 'hover:bg-violet-700');
                panel.clothing.button.classList.remove('bg-violet-600');
            } else if(type === 'clothing') {
                panel.clothing.layer.classList.remove('hidden');
                panel.clothing.button.disabled = true;
                panel.clothing.button.classList.remove('bg-violet-950', 'hover:bg-violet-700');
                panel.clothing.button.classList.add('bg-violet-600');

                panel.body.layer.classList.add('hidden');
                panel.body.button.disabled = false;
                panel.body.button.classList.add('bg-violet-950', 'hover:bg-violet-700');
                panel.body.button.classList.remove('bg-violet-600');
            }
        });

    }
}
function initPreviewButtons() {
    for(const direction in preview.direction) {
        const button = preview.direction[direction];

        button.addEventListener('click', () => {
            preview.currentDirection = direction;
            setPreview();
            animate();
        });

    }

    for(const direction in preview.zoom) {
        const button = preview.zoom[direction];

        button.addEventListener('click', () => {
            console.log(preview.currentZoom);
            if(direction == 'in') {
                preview.currentZoom += 0.25;

                if(preview.currentZoom < 4) {
                    preview.zoom.in.disabled = false;
                    preview.zoom.out.disabled = false;
                } else {
                    preview.currentZoom = 4;
                    preview.zoom.in.disabled = true;
                    preview.zoom.out.disabled = false;
                }
            } else if(direction == 'out') {
                preview.currentZoom -= 0.25;

                if(preview.currentZoom > 0.75) {
                    preview.zoom.out.disabled = false;
                    preview.zoom.in.disabled = false;
                } else {
                    preview.currentZoom = 0.75;
                    preview.zoom.out.disabled = true;
                    preview.zoom.in.disabled = false;
                }
            }

            preview.base.style.width = `${64 * preview.currentZoom}px`;
            preview.base.style.height = `${64 * preview.currentZoom}px`;

        });
    }

    for(const control in preview.control) {
        const button = preview.control[control];

        button.addEventListener('click', () => {
            if(control == 'play') {
                preview.control.play.classList.add('hidden');
                preview.control.pause.classList.remove('hidden');
                preview.isRunning = true;
            } else if(control == 'pause') {
                preview.control.play.classList.remove('hidden');
                preview.control.pause.classList.add('hidden');
                preview.isRunning = false;
            }
        });
    }

    preview.base.style.width = `${64 * preview.currentZoom}px`;
    preview.base.style.height = `${64 * preview.currentZoom}px`;
}

function initDownloadButtons() {
    for(const type in download) {
        const button = download[type];

        button.addEventListener('click', () => {
            if(type === 'current') {
                const path = canvasCollection[currentSpritesheet].canvas.toDataURL();
                const link = document.createElement('a');
                link.download = currentSpritesheet;
                link.href = path;
                link.click();
                URL.revokeObjectURL(link.href);
            } else if(type === 'all') {
                for(const sprite in canvasCollection) {
                    const path = canvasCollection[sprite].canvas.toDataURL();
                    const link = document.createElement('a');
                    link.download = sprite;
                    link.href = path;
                    link.click();
                    URL.revokeObjectURL(link.href);
                }

            } else if(type === 'credits') {
                let parts = [
                    specs.parts.body[elements.body.part.value],
                    specs.parts.head[elements.head.part.value],
                    specs.parts.headOverlays.eyes[elements.headOverlays.eyes.part.value],
                    specs.parts.headOverlays.largeNose[elements.headOverlays.largeNose.part.value],
                    specs.parts.clothing.accessories.neckwear[elements.clothing.accessories.neckwear.part.value],
                    specs.parts.eyewear[elements.eyewear.part.value],
                    specs.parts.hair[elements.hair.part.value],
                    specs.parts.eyebrows[elements.eyebrows.part.value],
                    specs.parts.facialHair[elements.facialHair.part.value],
                    specs.parts.clothing.feed.shoes[elements.clothing.feed.shoes.part.value],
                    specs.parts.clothing.feed.socks[elements.clothing.feed.socks.part.value],
                    specs.parts.clothing.legs[elements.clothing.legs.part.value],
                    specs.parts.clothing.torso.shirt[elements.clothing.torso.shirt.part.value],
                    specs.parts.clothing.torso2.accessory[elements.clothing.torso2.accessory.part.value],
                    specs.parts.clothing.torso2.sweater[elements.clothing.torso2.sweater.part.value],
                ];

                let out = '';

                for(let i of parts) {
                    if(!i) {
                        continue;
                    }

                    out += i.credits + "\n";
                    out += '-------------------' + "\n";
                    out += '  ARTIST(S): ' + credits[i.credits].artists + "\n";

                    if(credits[i.credits].source) {
                        out += '  SOURCE: ' + credits[i.credits].source + "\n";
                    }

                    out += '  LICENSE: ' + credits[i.credits].license + "\n";
                    out += '  DETAILS: ' + credits[i.credits].details + "\n";

                    if(credits[i.credits].notes) {
                        out += '  NOTES: ' + "\n";

                        for(let n of credits[i.credits].notes) {
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
        });

    }
}

function initSelection(key, material) {
    const element = getElementByPath(elements, key);

    fillPartSelects(key, getElementByPath(specs.parts, key), element.part);
    fillColorSelects(key, specs.colors[material], element.color);
    element.label.style.backgroundColor = specs.colors[material][element.color.value].color;

    element.color.addEventListener('change', (event) => {

        try {
            element.label.style.backgroundColor = specs.colors[material][element.color.value].color;
        } catch(e) { // fallback
            element.label.style.backgroundColor = specs.colors.clothing[element.color.value].color;
        }

        paint();
    });

    element.part.addEventListener('change', (event) => {
        paint();
    });
}

function initCanvasMenu() {
    const buttons = document.querySelectorAll('#pose button');

    for(const i in buttons) {
        buttons[i].onclick = function() {
            document.querySelectorAll('#canvas canvas').forEach((c) => {
                c.classList.add('hidden');

                if(c.id === this.value) {
                    currentSpritesheet = this.value;
                    c.classList.remove('hidden');
                    setPreview();
                    animate();
                }
            });
        }
    }
}
function initCanvasCollection() {
    for (const pose in canvasCollection) {
        canvasCollection[pose].canvas = document.getElementById(pose);
        canvasCollection[pose].context = canvasCollection[pose].canvas.getContext('2d')
    }
}


async function paint() {
    for (const pose in canvasCollection) {
        const canvas = canvasCollection[pose].canvas;
        const ctx = canvasCollection[pose].context;
        const type = elements.body.part.value;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        await drawImage('body', pose, type, 'skin');
        await drawImage('head', pose, type, 'skin');

        if (pose != 'climb' && elements.headOverlays.largeNose.part.value == 'yes') {
            await drawImage('headOverlays.largeNose', pose, type, 'skin');
        }

        if (pose != 'climb') {
            await drawImage('headOverlays.eyes', pose, type, 'eyes');
            await drawImage('eyebrows', pose, type, 'hair');
            await drawImage('facialHair', pose, type, 'hair');
            await drawImage('hair', pose, type, 'hair');
            await drawImage('eyewear', pose, type, 'metal');
            await drawImage('clothing.accessories.neckwear', pose, type, 'clothing');
        }

        await drawImage('clothing.feed.socks', pose, type, 'clothing');
        await drawImage('clothing.feed.shoes', pose, type, 'clothing');
        await drawImage('clothing.legs', pose, type, 'clothing');
        await drawImage('clothing.torso.shirt', pose, type, 'clothing');
        await drawImage('clothing.torso2.accessory', pose, type, 'clothing');
        await drawImage('clothing.torso2.sweater', pose, type, 'clothing');
    }

    setPreview();
    animate();
}

/******************************************************************************
 * ANIMATION
 *****************************************************************************/
function getDirectionOffset() {
    switch(preview.currentDirection) {
        case 'up': return 0;
        case 'left': return 64;
        case 'down': return 128;
        case 'right': return 192;
    }
}

function setPreview() {
    preview.currentCanvas = canvasCollection[currentSpritesheet].canvas;
    preview.context = preview.canvas.getContext('2d');
    preview.totalFrames = (preview.currentCanvas.width / 64);
}

function animate() {
    if(!preview.isStarted) {
        preview.isStarted = true;
        runAnimation();
    }
}

function runAnimation(timestamp) {
    const elapsedTime = timestamp - preview.lastFrameTime;

    if(elapsedTime > preview.duration) {
        drawFrame();

        if(preview.isRunning) {
            preview.currentFrame = (preview.currentFrame + 1) % preview.totalFrames;
        }
        preview.lastFrameTime = timestamp;
    }

    requestAnimationFrame(runAnimation);
}

function drawFrame() {
    preview.context.clearRect(0, 0, 64, 64);
    preview.context.drawImage(
        preview.currentCanvas,
        preview.currentFrame * 64, // frame
        getDirectionOffset(), // direction
        64,
        64,
        0,
        0,
        64,
        64
    );
    preview.base.style.backgroundImage = `url(${preview.canvas.toDataURL()})`;
}


/******************************************************************************
 * FORMS
 *****************************************************************************/
function fillPartSelects(key, parts, select) {
    if(key == 'headOverlays.eyes') {
        select.disabled = true;
        select.classList.add('hidden');
        return;
    } else if(key == 'headOverlays.largeNose') {
        return;
    }

    for(let i in parts) {
        const option = createOption(i, parts[i].name);
        option.classList.add('text-black');
        select.appendChild(option);
    }
}

function fillColorSelects(key, colors, select) {
    for(let i in colors) {
        const option = createOption(i, colors[i].name);
        option.style.backgroundColor = colors[i].color;
        option.classList.add('text-black', 'm-2', 'uppercase', 'font-bold', 'text-sm');
        select.appendChild(option);
    }

    if(key == 'body' || key == 'head' || key == 'headOverlays.largeNose') {
        const optGroup = document.createElement('optgroup');
        optGroup.label = 'Additional';
        optGroup.classList.add('text-black', 'm-2', 'uppercase', 'font-bold', 'text-sm');
        select.appendChild(optGroup);
        fillColorSelects(null, specs.colors.clothing, optGroup);
    }


    select.selectedIndex = 0;
}

 function createOption(value, label) {
     const option = document.createElement('option');
     option.value = value;
     option.innerText = label;

     return option;
 }

/******************************************************************************
 * PATHS
 *****************************************************************************/
function createSkinPath(key, pose) {
    const element = getElementByPath(elements, key);
    const part = getElementByPath(specs.parts, key);

    if (element.part.value) {
        var path = '';

        if(element.part.value == 'yes') {
            path = part.path;
        } else {
            path = part[element.part.value].path;
        }

        path += getSkinColorPath(element.color.value);
        path += specs.poses[pose].name + '.png';

        return path;
    }
}


function createMetalPath(key, pose) {
    const element = getElementByPath(elements, key);
    const part = getElementByPath(specs.parts, key);

    if (element.part.value) {
        var path = part[element.part.value].path;
        path += specs.colors.metal[element.color.value].name + '/';
        path += specs.poses[pose].name + '.png';

        return path;
    }
}


function createEyesPath(key, pose) {
    const element = getElementByPath(elements, key);
    const part = getElementByPath(specs.parts, key);

    if (element.color.value) {
        var path = part.path;
        path += specs.colors.eyes[element.color.value].name + '/';
        path += specs.poses[pose].name + '.png';

        return path;
    }
}

function createHairPath(key, pose) {

    const element = getElementByPath(elements, key);
    const part = getElementByPath(specs.parts, key);



    if (element.part.value) {
        console.log(element.part.value)
        var path = part[element.part.value].path;
        path += specs.colors.hair[element.color.value].name + '/';
        path += specs.poses[pose].name + '.png';

        console.log(part, path);

        return path;
    }
}

function createClothingPath(key, pose, type) {
    const element = getElementByPath(elements, key);
    const part = getElementByPath(specs.parts, key);

    if (element.part.value) {
        var path = part[element.part.value].path['body.' + type];
        path += specs.colors.clothing[element.color.value].name + '/';
        path += specs.poses[pose].name + '.png';

        return path;
    }
}

function createPath(key, pose, type, material) {
    if(material == 'skin') {
        return createSkinPath(key, pose);
    } else if(material == 'clothing') {
        return createClothingPath(key, pose, type);
    } else if(material == 'metal') {
        return createMetalPath(key, pose);
    } else if(material == 'eyes') {
        return createEyesPath(key, pose)
    } else if(material == 'hair') {
        return createHairPath(key, pose)
    }
}

function getSkinColorPath(color) {
    if(['bronze', 'brown', 'coffee', 'honey', 'ivory', 'peach', 'porcelain', 'tan', 'tawny'].indexOf(color) >= 0) {
        return specs.colors['skin'][color].name + '/';
    } else {
        return '_Alternate Colors/' + specs.colors['clothing'][color].name + '/';
    }
}

/******************************************************************************
 * RENDERING
 *****************************************************************************/
async function drawImage(key, pose, type, material) {
    const canvas = canvasCollection[pose].canvas;
    const ctx = canvasCollection[pose].context;
    const element = getElementByPath(elements, key);
    const path = createPath(key, pose, type, material);

    if (element.part.value || element.part.classList.contains('hidden')) {
        try {
            const img = await loadImage(path)
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        } catch(e) {
            console.log('Image could not be loaded:', path);
        }
    }
}


/******************************************************************************
 * UTILITIES
 *****************************************************************************/
function loadImage(path) {
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

function getElementByPath(elements, path) {
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
