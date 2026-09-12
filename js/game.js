// Game State Management
const gameState = {
  coins: 0,
  savedBears: 0,
  currentPhase: 1,
  playerName: 'UrsoHeroi',
  selectedColor: '#8B4513',
  selectedHat: 'none',
  selectedBlock: 'grass',
  isGameRunning: false,
  isMultiplayer: false,
  roomId: null,
};

// Block Types & Materials
const blockTypes = {
  grass: { color: 0x22c55e, emoji: '🌱' },
  purple_honey: { color: 0xa855f7, emoji: '🍯' },
  snow: { color: 0xe2e8f0, emoji: '❄️' },
  ice: { color: 0x0ea5e9, emoji: '🧊' },
  sand: { color: 0xfbbf24, emoji: '⏳' },
  wood: { color: 0x92400e, emoji: '🪵' },
  brick: { color: 0xdc2626, emoji: '🧱' },
  gold: { color: 0xfcd34d, emoji: '⭐' },
};

// Player Controller
class PlayerController {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.bearModel = null;
    this.velocity = new THREE.Vector3();
    this.isJumping = false;
    this.canJump = true;
    this.moveSpeed = 0.15;
    this.jumpForce = 0.3;
    this.gravity = 0.012;
    
    this.keys = {};
    this.setupControls();
    this.createBearCharacter();
  }

  setupControls() {
    // Keyboard Controls
    window.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;
      if (e.key === ' ') {
        e.preventDefault();
        this.jump();
      }
    });
    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });

    // Touch Joystick
    const joystickZone = document.getElementById('joystick-zone');
    const joystickKnob = document.getElementById('joystick-knob');
    let joystickActive = false;

    joystickZone.addEventListener('touchstart', (e) => {
      joystickActive = true;
      this.handleJoystick(e, joystickZone, joystickKnob);
    });
    joystickZone.addEventListener('touchmove', (e) => {
      if (joystickActive) this.handleJoystick(e, joystickZone, joystickKnob);
    });
    joystickZone.addEventListener('touchend', () => {
      joystickActive = false;
      joystickKnob.style.transform = 'translate(0, 0)';
      this.keys = {};
    });

    // Touch Action Buttons
    document.getElementById('btn-touch-break').addEventListener('touchstart', () => this.breakBlock());
    document.getElementById('btn-touch-place').addEventListener('touchstart', () => this.placeBlock());
    document.getElementById('btn-touch-jump').addEventListener('touchstart', () => this.jump());

    // Desktop Action Keys
    window.addEventListener('keydown', (e) => {
      if (e.key === 'q') this.breakBlock();
      if (e.key === 'e') this.placeBlock();
    });
  }

  handleJoystick(e, zone, knob) {
    const touch = e.touches[0];
    const rect = zone.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const dx = touch.clientX - centerX;
    const dy = touch.clientY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = rect.width / 2 - 20;
    
    const moveX = Math.min(distance, maxDistance) * (dx / distance) || 0;
    const moveY = Math.min(distance, maxDistance) * (dy / distance) || 0;
    
    knob.style.transform = `translate(${moveX}px, ${moveY}px)`;
    
    const angle = Math.atan2(dy, dx);
    this.keys['w'] = dy < -10;
    this.keys['s'] = dy > 10;
    this.keys['a'] = dx < -10;
    this.keys['d'] = dx > 10;
  }

  createBearCharacter() {
    if (this.bearModel) this.scene.remove(this.bearModel);
    
    this.bearModel = createBearModel(
      parseInt(gameState.selectedColor.replace('#', '0x')),
      gameState.selectedHat
    );
    this.bearModel.position.y = 2;
    this.scene.add(this.bearModel);
  }

  update() {
    if (!this.bearModel) return;

    // Movement
    const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.camera.rotation.y);
    const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.camera.rotation.y);

    if (this.keys['w']) this.bearModel.position.addScaledVector(forward, this.moveSpeed);
    if (this.keys['s']) this.bearModel.position.addScaledVector(forward, -this.moveSpeed);
    if (this.keys['a']) this.bearModel.position.addScaledVector(right, -this.moveSpeed);
    if (this.keys['d']) this.bearModel.position.addScaledVector(right, this.moveSpeed);

    // Gravity & Jumping
    this.velocity.y -= this.gravity;
    this.bearModel.position.y += this.velocity.y;

    // Ground collision
    if (this.bearModel.position.y <= 1) {
      this.bearModel.position.y = 1;
      this.velocity.y = 0;
      this.canJump = true;
    }

    // Camera follow
    this.camera.position.copy(this.bearModel.position);
    this.camera.position.y += 0.8;
    this.camera.position.z += 1.5;
  }

  jump() {
    if (this.canJump) {
      this.velocity.y = this.jumpForce;
      this.canJump = false;
      showToast('🐻 PULO!', 'success');
    }
  }

  breakBlock() {
    showToast('💥 Bloco quebrado!', 'success');
  }

  placeBlock() {
    showToast(`📦 ${blockTypes[gameState.selectedBlock].emoji} Colocado!`, 'success');
  }
}

// World Generator
class WorldGenerator {
  constructor(scene) {
    this.scene = scene;
    this.blocks = [];
    this.generateTerrain();
  }

  generateTerrain() {
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x22c55e });
    const groundGeo = new THREE.BoxGeometry(100, 1, 100);
    const ground = new THREE.Mesh(groundGeo, groundMaterial);
    ground.position.y = -0.5;
    this.scene.add(ground);

    // Add some decorative blocks
    this.addBlock(0, 1, 0, 'grass');
    this.addBlock(2, 1, 0, 'wood');
    this.addBlock(-2, 1, 0, 'brick');
    this.addBlock(0, 1, 2, 'sand');
    this.addBlock(0, 1, -2, 'purple_honey');

    // Add bear cages (rescue points)
    this.addBearCage(5, 1, 5);
    this.addBearCage(-5, 1, 5);
    this.addBearCage(5, 1, -5);
    this.addBearCage(-5, 1, -5);
    this.addBearCage(0, 1, 8);
  }

  addBlock(x, y, z, blockType = 'grass') {
    const type = blockTypes[blockType];
    const material = new THREE.MeshLambertMaterial({ color: type.color });
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const block = new THREE.Mesh(geometry, material);
    block.position.set(x, y, z);
    block.blockType = blockType;
    this.scene.add(block);
    this.blocks.push(block);
  }

  addBearCage(x, y, z) {
    const cageMaterial = new THREE.MeshLambertMaterial({ color: 0x78350f });
    const cageGeo = new THREE.BoxGeometry(0.8, 1.2, 0.8);
    const cage = new THREE.Mesh(cageGeo, cageMaterial);
    cage.position.set(x, y + 1, z);
    cage.isBearCage = true;
    cage.rescued = false;
    this.scene.add(cage);
  }
}

// UI Management
class UIManager {
  constructor() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Character Customization
    document.querySelectorAll('.color-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('ring-2', 'ring-yellow-400'));
        e.target.classList.add('ring-2', 'ring-yellow-400');
        gameState.selectedColor = e.target.dataset.color;
      });
    });

    document.querySelectorAll('.hat-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.hat-btn').forEach(b => b.classList.remove('border-yellow-400'));
        e.target.classList.add('border-yellow-400');
        gameState.selectedHat = e.target.dataset.hat;
      });
    });

    // Hotbar Selection
    document.querySelectorAll('.hotbar-slot').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.hotbar-slot').forEach(b => b.classList.remove('block-selected'));
        e.target.classList.add('block-selected');
        gameState.selectedBlock = e.target.dataset.block;
      });
    });

    // Player Name
    document.getElementById('player-name').addEventListener('change', (e) => {
      gameState.playerName = e.target.value || 'UrsoHeroi';
    });

    // Game Mode Buttons
    document.getElementById('btn-play-offline').addEventListener('click', () => this.startOfflineGame());
    document.getElementById('btn-create-room').addEventListener('click', () => this.createMultiplayerRoom());
    document.getElementById('btn-join-room').addEventListener('click', () => this.joinRoom());
    document.getElementById('btn-leave-game').addEventListener('click', () => this.leaveGame());

    // Modal Close
    document.getElementById('btn-modal-close').addEventListener('click', () => this.closeModal());

    // Chat
    document.getElementById('btn-chat-send').addEventListener('click', () => this.sendChat());
    document.getElementById('chat-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendChat();
    });
  }

  startOfflineGame() {
    gameState.isGameRunning = true;
    gameState.isMultiplayer = false;
    document.getElementById('hud-room-code').textContent = 'SOLO';
    this.showGameHUD();
  }

  createMultiplayerRoom() {
    gameState.roomId = 'ROOM_' + Math.random().toString(36).substr(2, 6).toUpperCase();
    gameState.isMultiplayer = true;
    document.getElementById('hud-room-code').textContent = gameState.roomId;
    this.showGameHUD();
    showToast(`🎮 Sala criada: ${gameState.roomId}`, 'success');
  }

  joinRoom() {
    const code = document.getElementById('room-code-input').value.trim();
    if (code) {
      gameState.roomId = code;
      gameState.isMultiplayer = true;
      document.getElementById('hud-room-code').textContent = code;
      this.showGameHUD();
      showToast(`✅ Entrou na sala: ${code}`, 'success');
    } else {
      showToast('❌ Digite o código da sala', 'error');
    }
  }

  showGameHUD() {
    document.getElementById('lobby-screen').classList.add('hidden');
    document.getElementById('game-hud').classList.remove('hidden');
    updateHUD();
  }

  leaveGame() {
    gameState.isGameRunning = false;
    gameState.isMultiplayer = false;
    gameState.roomId = null;
    document.getElementById('lobby-screen').classList.remove('hidden');
    document.getElementById('game-hud').classList.add('hidden');
    showToast('👋 Você saiu do jogo', 'info');
  }

  closeModal() {
    document.getElementById('unlock-modal').classList.add('hidden');
  }

  sendChat() {
    const input = document.getElementById('chat-input');
    const msg = input.value.trim();
    if (msg) {
      const messagesDiv = document.getElementById('chat-messages');
      const msgEl = document.createElement('div');
      msgEl.className = 'text-purple-300 font-bold text-[11px]';
      msgEl.textContent = `${gameState.playerName}: ${msg}`;
      messagesDiv.appendChild(msgEl);
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
      input.value = '';
    }
  }
}

// Main Game Class
class SuperBearBlockCraft {
  constructor() {
    this.scene = window.scene;
    this.camera = window.camera;
    this.renderer = window.renderer;
    this.player = null;
    this.world = null;
    this.uiManager = null;
    this.animationId = null;
    
    this.initialize();
  }

  initialize() {
    this.uiManager = new UIManager();
    this.setupWindowResize();
    this.startAnimationLoop();
  }

  startGame() {
    if (!this.player) {
      this.player = new PlayerController(this.scene, this.camera);
    }
    if (!this.world) {
      this.world = new WorldGenerator(this.scene);
    }
    gameState.isGameRunning = true;
  }

  update() {
    if (gameState.isGameRunning && this.player) {
      this.player.update();
    }
    this.renderer.render(this.scene, this.camera);
  }

  startAnimationLoop() {
    const animate = () => {
      this.animationId = requestAnimationFrame(animate);
      this.update();
    };
    animate();
  }

  setupWindowResize() {
    window.addEventListener('resize', () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    });
  }
}

// Helper Functions
function createBearModel(furColorHex = 0x8B4513, hatType = 'none') {
  const bearGroup = new THREE.Group();
  const bodyMat = new THREE.MeshLambertMaterial({ color: furColorHex });
  const snoutMat = new THREE.MeshLambertMaterial({ color: 0xF5F5DC });
  const blackMat = new THREE.MeshLambertMaterial({ color: 0x111111 });

  // Torso
  const bodyGeo = new THREE.BoxGeometry(1.1, 1.3, 0.8);
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 0.65;
  bearGroup.add(body);

  // Belly
  const bellyGeo = new THREE.BoxGeometry(0.7, 0.8, 0.1);
  const belly = new THREE.Mesh(bellyGeo, snoutMat);
  belly.position.set(0, 0.65, 0.41);
  bearGroup.add(belly);

  // Head
  const headGeo = new THREE.BoxGeometry(0.9, 0.8, 0.8);
  const head = new THREE.Mesh(headGeo, bodyMat);
  head.position.set(0, 1.55, 0);
  bearGroup.add(head);

  // Snout & Nose
  const snoutGeo = new THREE.BoxGeometry(0.45, 0.3, 0.35);
  const snout = new THREE.Mesh(snoutGeo, snoutMat);
  snout.position.set(0, 1.45, 0.48);
  bearGroup.add(snout);

  const noseGeo = new THREE.BoxGeometry(0.18, 0.12, 0.1);
  const nose = new THREE.Mesh(noseGeo, blackMat);
  nose.position.set(0, 1.52, 0.66);
  bearGroup.add(nose);

  // Ears
  const earGeo = new THREE.BoxGeometry(0.25, 0.25, 0.15);
  const earL = new THREE.Mesh(earGeo, bodyMat);
  earL.position.set(-0.4, 2.0, 0);
  const earR = earL.clone();
  earR.position.x = 0.4;
  bearGroup.add(earL, earR);

  // Limbs
  const limbGeo = new THREE.BoxGeometry(0.35, 0.6, 0.35);
  const armL = new THREE.Mesh(limbGeo, bodyMat);
  armL.position.set(-0.7, 0.8, 0);
  const armR = armL.clone();
  armR.position.x = 0.7;
  const legL = new THREE.Mesh(limbGeo, bodyMat);
  legL.position.set(-0.3, 0.3, 0);
  const legR = legL.clone();
  legR.position.x = 0.3;
  bearGroup.add(armL, armR, legL, legR);

  // Hats
  if (hatType === 'crown') {
    const crownGeo = new THREE.ConeGeometry(0.35, 0.35, 5);
    const crownMat = new THREE.MeshStandardMaterial({ color: 0xFFD700, metalness: 0.8 });
    const crown = new THREE.Mesh(crownGeo, crownMat);
    crown.position.set(0, 2.15, 0);
    bearGroup.add(crown);
  } else if (hatType === 'tophat') {
    const hatMat = new THREE.MeshLambertMaterial({ color: 0x111111 });
    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.06, 12), hatMat);
    const top = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.4, 12), hatMat);
    top.position.y = 0.2;
    const hatGroup = new THREE.Group();
    hatGroup.add(brim, top);
    hatGroup.position.set(0, 2.0, 0);
    bearGroup.add(hatGroup);
  } else if (hatType === 'cap') {
    const capMat = new THREE.MeshLambertMaterial({ color: 0x9333ea });
    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.2, 0.6), capMat);
    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.04, 0.3), capMat);
    visor.position.set(0, -0.08, 0.35);
    const hatGroup = new THREE.Group();
    hatGroup.add(cap, visor);
    hatGroup.position.set(0, 1.95, 0);
    bearGroup.add(hatGroup);
  }

  return bearGroup;
}

function updateHUD() {
  document.getElementById('hud-coin-count').textContent = gameState.coins;
  document.getElementById('hud-bear-count').textContent = `${gameState.savedBears} / 5`;
  document.getElementById('hud-phase-name').textContent = `🐢 FASE ${gameState.currentPhase}: VILA & ALDEIA DAS TARTARUGAS`;
}

function showToast(msg, type = 'info') {
  window.showToast(msg, type);
}

// Initialize Game
window.addEventListener('DOMContentLoaded', () => {
  const game = new SuperBearBlockCraft();
});
