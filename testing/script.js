// ข้อมูลตัวละคร 
const characters = {
    พิชญ์: {
        sprite: '/images/Students/pich_sprite.png', 
    },
    ไพลิน: {
        sprite: '/images/Students/pailin_sprite.png', 
    },
    มะเฟือง: {
        sprite: '/images/Students/mafuang_sprite.png',
    },
    ทับทิม: {
        sprite: '/images/Students/tubtim_sprite.png',
    },
};

// ข้อมูลฉาก 
const scenes = {
    เริ่มต้น: {
        background: '/images/backgrounds/school_gate.jng', 
        dialogue: [
            { character: 'พิชญ์', text: 'เฮ้อ... ในที่สุดก็ถึงโรงเรียนใหม่แล้วสินะ ตื่นเต้นจัง' },
            { character: 'พิชญ์', text: 'หวังว่าจะเข้ากับเพื่อนใหม่ได้นะ' },
            {
                character: 'บรรยาย',
                text: 'คุณเดินเข้าไปในโรงเรียน และพบกับทางแยก...',
                choices: [
                    { text: 'ไปทางห้องเรียน', nextScene: 'ห้องเรียน' },
                    { text: 'ไปทางโรงอาหาร', nextScene: 'โรงอาหาร' },
                ],
            },
        ],
    },
    ห้องเรียน: {
        background: '/images/backgrounds/classroom.jpg',
        dialogue: [
            { character: 'บรรยาย', text: 'คุณเดินเข้าไปในห้องเรียน และพบกับผู้หญิงคนหนึ่ง' },
            { character: 'ไพลิน', text: 'สวัสดีจ้ะ นายเป็นเด็กใหม่เหรอ?' },
            { character: 'ไพลิน', text: 'ฉันชื่อไพลิน ยินดีที่ได้รู้จักนะ' },
            {
                character: 'บรรยาย',
                text: 'คุณควรทำอย่างไรดี?',
                choices: [
                    { text: 'ทักทายกลับ', nextScene: 'คุยกับไพลิน' },
                    { text: 'แนะนำตัว', nextScene: 'แนะนำตัวไพลิน' },
                ],
            },
        ],
    },
    // เพิ่มฉากอื่นๆ ต่อจากนี้
};

// ตัวแปรควบคุมเกม
let currentScene = 'เริ่มต้น';
let currentDialogueIndex = 0;

// ฟังก์ชันแสดงบทสนทนา
function showDialogue() {
    const scene = scenes[currentScene];
    const dialogue = scene.dialogue[currentDialogueIndex];

    // แสดงภาพพื้นหลัง
    document.getElementById('background').style.backgroundImage = `url(${scene.background})`;

    // แสดงภาพตัวละคร (ถ้ามี)
    if (dialogue.character && characters[dialogue.character]) {
        const spritePath = characters[dialogue.character].sprite;
        document.getElementById('character-sprite').innerHTML = `<img src="${spritePath}" alt="${dialogue.character}">`;
    } else {
        document.getElementById('character-sprite').innerHTML = ''; // ล้างภาพถ้าไม่มีตัวละคร
    }

    // แสดงชื่อตัวละครและข้อความ
    document.getElementById('character-name').textContent = dialogue.character || '???';
    document.getElementById('dialogue-text').textContent = dialogue.text;

    // แสดงตัวเลือก (ถ้ามี)
    const choicesContainer = document.getElementById('choices-container');
    choicesContainer.innerHTML = ''; // ล้างตัวเลือกเก่า

    if (dialogue.choices) {
        dialogue.choices.forEach(choice => {
            const button = document.createElement('button');
            button.classList.add('choice-button');
            button.textContent = choice.text;
            button.addEventListener('click', () => {
                currentScene = choice.nextScene;
                currentDialogueIndex = 0;
                showDialogue();
            });
            choicesContainer.appendChild(button);
        });
    } else {
        // เพิ่มปุ่ม "ถัดไป" ถ้าไม่มีตัวเลือก
        const nextButton = document.createElement('button');
        nextButton.classList.add('choice-button');
        nextButton.textContent = 'ถัดไป';
        nextButton.addEventListener('click', () => {
            currentDialogueIndex++;
            if (currentDialogueIndex < scene.dialogue.length) {
                showDialogue();
            } else {
                // จบฉาก (คุณอาจต้องการกำหนดฉากถัดไปที่นี่)
                console.log('จบฉาก'); 
            }
        });
        choicesContainer.appendChild(nextButton);
    }
}

let isTyping = false;
let typingTimeout;

// ฟังก์ชันพิมพ์ตัวอักษรทีละตัว
function typeWriter(text, element, speed = 30) {
    let i = 0;
    element.innerHTML = "";
    isTyping = true;
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            typingTimeout = setTimeout(type, speed);
        } else {
            isTyping = false;
        }
    }
    type();
}

// ฟังก์ชันเปลี่ยนฉากแบบมี Fade Black
async function changeScene(sceneKey) {
    const overlay = document.createElement('div');
    overlay.className = 'fade-overlay';
    document.body.appendChild(overlay);

    // เริ่มเฟดดำ
    setTimeout(() => overlay.classList.add('active'), 10);
    
    await new Promise(resolve => setTimeout(resolve, 500)); // รอ 0.5 วิ

    currentScene = sceneKey;
    currentDialogueIndex = 0;
    showDialogue();

    // เฟดออก
    overlay.classList.remove('active');
    setTimeout(() => overlay.remove(), 500);
}

function showDialogue() {
    const scene = scenes[currentScene];
    const dialogue = scene.dialogue[currentDialogueIndex];

    // ล้าง Timeout เก่าถ้ากดข้ามไวๆ
    clearTimeout(typingTimeout);

    // แสดงภาพพื้นหลัง
    document.getElementById('background').style.backgroundImage = `url(${scene.background})`;

    // แสดงตัวละครพร้อมรีเซ็ต Animation
    const spriteContainer = document.getElementById('character-sprite');
    if (dialogue.character && characters[dialogue.character]) {
        spriteContainer.innerHTML = `<img key="${dialogue.character}" src="${characters[dialogue.character].sprite}" />`;
    } else {
        spriteContainer.innerHTML = '';
    }

    // แสดงชื่อ
    document.getElementById('character-name').textContent = dialogue.character || '???';

    // เริ่มเอฟเฟกต์พิมพ์ดีด
    const textElement = document.getElementById('dialogue-text');
    typeWriter(dialogue.text, textElement);

    // จัดการตัวเลือก
    const choicesContainer = document.getElementById('choices-container');
    choicesContainer.innerHTML = '';

    if (dialogue.choices) {
        dialogue.choices.forEach(choice => {
            const button = document.createElement('button');
            button.className = 'choice-button';
            button.textContent = choice.text;
            button.onclick = () => changeScene(choice.nextScene);
            choicesContainer.appendChild(button);
        });
    } else {
        const nextBtn = document.createElement('button');
        nextBtn.className = 'choice-button';
        nextBtn.textContent = 'ถัดไป...';
        nextBtn.onclick = () => {
            if (isTyping) {
                // ถ้ายังพิมพ์ไม่เสร็จ แล้วกด จะให้ข้อความขึ้นมาเต็มทันที
                clearTimeout(typingTimeout);
                textElement.innerHTML = dialogue.text;
                isTyping = false;
            } else {
                currentDialogueIndex++;
                if (currentDialogueIndex < scene.dialogue.length) {
                    showDialogue();
                }
            }
        };
        choicesContainer.appendChild(nextBtn);
    }
}
// เริ่มต้นเกม
showDialogue();