// ==========================================
// 1. NAVIGATION & MOBILE MENU
// ==========================================
const sidemenu = document.getElementById("sidemenu");

function openmenu() {
    sidemenu.style.right = "0";
}

function closemenu() {
    sidemenu.style.right = "-240px";
}

// Close mobile menu when clicking a link
document.querySelectorAll("#sidemenu a").forEach(link => {
    link.addEventListener("click", () => {
        closemenu();
    });
});

// Update active navigation link on scroll
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("nav ul li a");

// ==========================================
// 1a. DYNAMIC TEXT SCRAMBLE FOR LOGO
// ==========================================
const logoText = document.querySelector(".logo-text");
if (logoText) {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ./><";
    let interval = null;
    
    logoText.addEventListener("mouseover", event => {  
        let iteration = 0;
        clearInterval(interval);
        
        const originalText = event.target.dataset.value;
        
        interval = setInterval(() => {
            event.target.innerText = originalText
                .split("")
                .map((letter, index) => {
                    if(index < iteration) {
                        return originalText[index];
                    }
                    // Don't scramble dots and slashes
                    if(letter === '.' || letter === '/') return letter;
                    return letters[Math.floor(Math.random() * letters.length)];
                })
                .join("");
            
            if(iteration >= originalText.length){ 
                clearInterval(interval);
            }
            
            iteration += 1 / 3;
        }, 30);
    });
}

// ==========================================
// 1b. ANIMATED CANVAS LOGO
// ==========================================
function initLogoCanvas() {
    const canvas = document.getElementById('logo-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;
    let angle = 0;

    // Particles orbiting the logo
    const particles = [
        { r: 16, speed: 0.04, size: 2.5, color: '#ff2a75', phase: 0 },
        { r: 16, speed: 0.04, size: 1.5, color: '#00f0ff', phase: Math.PI },
        { r: 12, speed: 0.07, size: 1.5, color: '#8b5cf6', phase: Math.PI * 0.5 },
        { r: 12, speed: 0.07, size: 1.0, color: '#00f0ff', phase: Math.PI * 1.5 },
    ];

    function drawLogo() {
        ctx.clearRect(0, 0, W, H);

        // Outer glow ring
        const ringGrad = ctx.createLinearGradient(0, 0, W, H);
        ringGrad.addColorStop(0, 'rgba(255, 42, 117, 0.8)');
        ringGrad.addColorStop(0.5, 'rgba(0, 240, 255, 0.8)');
        ringGrad.addColorStop(1, 'rgba(139, 92, 246, 0.8)');
        ctx.strokeStyle = ringGrad;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy, 18, 0, Math.PI * 2);
        ctx.stroke();

        // Dashed inner ring
        ctx.setLineDash([3, 5]);
        ctx.lineDashOffset = -angle * 20;
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, 14, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Text "SG" in center
        ctx.font = 'bold 13px "Space Grotesk", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const textGrad = ctx.createLinearGradient(cx - 10, cy, cx + 10, cy);
        textGrad.addColorStop(0, '#ff2a75');
        textGrad.addColorStop(1, '#00f0ff');
        ctx.fillStyle = textGrad;
        ctx.fillText('SG', cx, cy);

        // Orbiting particles
        particles.forEach(p => {
            const px = cx + Math.cos(angle * p.speed * 25 + p.phase) * p.r;
            const py = cy + Math.sin(angle * p.speed * 25 + p.phase) * p.r;
            ctx.shadowBlur = 8;
            ctx.shadowColor = p.color;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(px, py, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        });

        angle += 0.02;
        requestAnimationFrame(drawLogo);
    }
    drawLogo();
}

window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - sectionHeight / 3) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${current}`) {
            link.classList.add("active");
        }
    });
});


// ==========================================
// 2. TAB SWITCHER (Skills, Experience, Education)
// ==========================================
const tablinks = document.getElementsByClassName("tab-links");
const tabcontents = document.getElementsByClassName("tab-contents");

function opentab(tabname) {
    // Remove active classes
    for (let tablink of tablinks) {
        tablink.classList.remove("active-link");
    }
    for (let tabcontent of tabcontents) {
        tabcontent.classList.remove("active-tab");
    }
    
    // Add active classes to target
    event.currentTarget.classList.add("active-link");
    const targetTab = document.getElementById(tabname);
    targetTab.classList.add("active-tab");
    
    // GSAP animation for new tab content
    gsap.fromTo(targetTab.querySelectorAll("li, .timeline > li"), 
         { opacity: 0, y: 15 },
         { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
    );

    // Recalculate ScrollTrigger positions as tab heights might differ
    setTimeout(() => {
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    }, 100);
}


// ==========================================
// 3. CUSTOM LIQUID CURSOR WITH SPRING LERP
// ==========================================
const cursor = document.getElementById("custom-cursor");
const cursorDot = document.getElementById("custom-cursor-dot");

let mouseX = 0, mouseY = 0; // Mouse coords
let cursorX = 0, cursorY = 0; // Cursor ring coords (lagging for smooth effect)
let dotX = 0, dotY = 0; // Cursor dot coords

document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Hide cursor when leaving window
document.addEventListener("mouseleave", () => {
    if (cursor && cursorDot) {
        cursor.style.opacity = "0";
        cursorDot.style.opacity = "0";
    }
});
document.addEventListener("mouseenter", () => {
    if (cursor && cursorDot) {
        cursor.style.opacity = "1";
        cursorDot.style.opacity = "1";
    }
});

// Cursor animation tick loop
function animateCursor() {
    // Lerp values for spring effect (0.15 for ring, 0.3 for dot)
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    
    dotX += (mouseX - dotX) * 0.3;
    dotY += (mouseY - dotY) * 0.3;
    
    if (cursor && cursorDot) {
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        
        cursorDot.style.left = `${dotX}px`;
        cursorDot.style.top = `${dotY}px`;
    }
    
    requestAnimationFrame(animateCursor);
}
animateCursor();

// Expand cursor on hovering interactive elements
const hoverElements = document.querySelectorAll("a, button, .tab-links, .work-card, .service-card, input, textarea, .open-menu, .close-menu");
hoverElements.forEach(elem => {
    elem.addEventListener("mouseenter", () => {
        if (cursor && cursorDot) {
            cursor.style.transform = "translate(-50%, -50%) scale(1.6)";
            cursor.style.borderColor = "var(--secondary)";
            cursor.style.backgroundColor = "rgba(0, 240, 255, 0.05)";
            cursorDot.style.transform = "translate(-50%, -50%) scale(0.5)";
        }
    });
    elem.addEventListener("mouseleave", () => {
        if (cursor && cursorDot) {
            cursor.style.transform = "translate(-50%, -50%) scale(1)";
            cursor.style.borderColor = "var(--primary)";
            cursor.style.backgroundColor = "transparent";
            cursorDot.style.transform = "translate(-50%, -50%) scale(1)";
        }
    });
});


// ==========================================
// 4. 3D CARD HOVER TILT EFFECT
// ==========================================
const tiltCards = document.querySelectorAll(".service-card, .work-card, .about-col-1 .img-wrapper");
tiltCards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        
        // Relative mouse coordinates within the card (-0.5 to 0.5)
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        
        // Tilt amount: max 12 degrees
        const tiltX = -y * 12;
        const tiltY = x * 12;
        
        gsap.to(card, {
            rotateX: tiltX,
            rotateY: tiltY,
            scale: 1.02,
            duration: 0.3,
            ease: "power2.out",
            transformPerspective: 1000
        });
    });
    
    card.addEventListener("mouseleave", () => {
        gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            duration: 0.5,
            ease: "power2.out"
        });
    });
});


// ==========================================
// 5. THREE.JS BACKGROUND GALAXY (STARFIELD)
// ==========================================
const bgCanvas = document.getElementById("bg-canvas");
let bgScene, bgCamera, bgRenderer, starGalaxy;

// Create circular canvas texture for glowing soft stars
function createStarTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext("2d");
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, "rgba(255, 255, 255, 1)");
    grad.addColorStop(0.2, "rgba(255, 255, 255, 0.8)");
    grad.addColorStop(0.5, "rgba(255, 255, 255, 0.15)");
    grad.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 16, 16);
    return new THREE.CanvasTexture(canvas);
}

let bg2DMode = false;
let bg2DParticles = [];
let bg2DContext = null;
let bg2DCanvas = null;

function init2DBackground() {
    bg2DMode = true;
    bg2DCanvas = bgCanvas;
    if (!bg2DCanvas) return;
    bg2DContext = bg2DCanvas.getContext('2d');
    if (!bg2DContext) return;
    
    bg2DCanvas.width = window.innerWidth;
    bg2DCanvas.height = window.innerHeight;
    
    const particleCount = 1200;
    bg2DParticles = [];
    
    const maxRadius = Math.min(window.innerWidth, window.innerHeight) * 0.45;
    for (let i = 0; i < particleCount; i++) {
        const radius = Math.random() * maxRadius;
        const spinAngle = radius * 0.015;
        const branchAngle = ((i % 3) * 2 * Math.PI) / 3;
        
        const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 35;
        const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 35;
        
        // Color interpolation: Magenta (#ff2a75) to Cyan (#00f0ff)
        const pct = radius / (maxRadius || 1);
        const r = Math.round(255 * (1 - pct) + 0 * pct);
        const g = Math.round(42 * (1 - pct) + 240 * pct);
        const b = Math.round(117 * (1 - pct) + 255 * pct);
        const color = `rgba(${r}, ${g}, ${b}, ${0.5 + Math.random() * 0.4})`;
        
        bg2DParticles.push({
            radius: radius,
            spinAngle: spinAngle,
            branchAngle: branchAngle,
            randomX: randomX,
            randomY: randomY,
            size: Math.random() * 1.5 + 0.5,
            color: color,
            speed: 0.05 + Math.random() * 0.05
        });
    }
}

function initBgScene() {
    try {
        bgScene = new THREE.Scene();
        
        // Perspective Camera
        bgCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        bgCamera.position.z = 85;
        bgCamera.position.y = 0;
        
        // WebGL Renderer
        bgRenderer = new THREE.WebGLRenderer({
            canvas: bgCanvas,
            alpha: true,
            antialias: true
        });
        bgRenderer.setSize(window.innerWidth, window.innerHeight);
        bgRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Spiral Galaxy Particles
        const particleCount = 3500;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        const colorInside = new THREE.Color("#ff2a75"); // Magenta core
        const colorOutside = new THREE.Color("#00f0ff"); // Cyan outer space
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Spiral arm math
            const radius = Math.random() * 120;
            const spinAngle = radius * 0.08;
            const branchAngle = ((i % 3) * 2 * Math.PI) / 3; // 3 arms
            
            const randomX = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 8);
            const randomY = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 8);
            const randomZ = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 8);
            
            positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randomX;
            positions[i3 + 1] = randomY;
            positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;
            
            // Blend colors based on distance from core
            const mixedColor = colorInside.clone();
            mixedColor.lerp(colorOutside, radius / 120);
            
            colors[i3 + 0] = mixedColor.r;
            colors[i3 + 1] = mixedColor.g;
            colors[i3 + 2] = mixedColor.b;
        }
        
        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
        
        // Particle Material
        const material = new THREE.PointsMaterial({
            size: 0.9,
            sizeAttenuation: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            vertexColors: true,
            transparent: true,
            opacity: 0.65,
            map: createStarTexture()
        });
        
        starGalaxy = new THREE.Points(geometry, material);
        bgScene.add(starGalaxy);
    } catch (e) {
        console.error("WebGL Background Renderer creation failed, using 2D canvas fallback:", e);
        init2DBackground();
    }
}


// ==========================================
// 6. THREE.JS HERO CANVAS (3D OBJECT)
// ==========================================
const heroContainer = document.getElementById("hero-canvas-container");
let heroScene, heroCamera, heroRenderer, dogModel, heroControls;
let heroFrame = 0;
const heroTarget = new THREE.Vector3(-0.5, 1.2, 0);
const initialCameraPosition = new THREE.Vector3(
    20 * Math.sin(0.2 * Math.PI),
    10,
    20 * Math.cos(0.2 * Math.PI)
);

function easeOutCirc(x) {
    return Math.sqrt(1 - Math.pow(x - 1, 4));
}

function showHeroFallback() {
    if (!heroContainer) return;
    heroContainer.innerHTML = '';
    
    if (!document.getElementById('hero-fallback-style')) {
        const style = document.createElement('style');
        style.id = 'hero-fallback-style';
        style.innerHTML = `
            @keyframes heroFloat {
                0% { transform: translateY(0px) rotate(0deg); }
                50% { transform: translateY(-12px) rotate(1.2deg); }
                100% { transform: translateY(0px) rotate(0deg); }
            }
            .hero-fallback-img {
                width: 100%;
                height: 100%;
                object-fit: contain;
                animation: heroFloat 4.5s ease-in-out infinite;
                filter: drop-shadow(0 15px 25px rgba(0, 0, 0, 0.45));
            }
        `;
        document.head.appendChild(style);
    }
    
    const img = document.createElement('img');
    img.src = './img/shiba-fallback.png?v=3';
    img.alt = '3D Voxel Shiba Inu';
    img.className = 'hero-fallback-img';
    heroContainer.appendChild(img);
}

function initHeroScene() {
    if (!heroContainer) return;
    
    heroScene = new THREE.Scene();
    
    const scW = heroContainer.clientWidth;
    const scH = heroContainer.clientHeight;
    const aspect = scW / scH;
    const scale = scH * 0.005 + 4.8;
    
    // Camera (Orthographic Camera exactly like craftz.dog)
    heroCamera = new THREE.OrthographicCamera(
        -scale * aspect,
        scale * aspect,
        scale,
        -scale,
        0.01,
        50000
    );
    heroCamera.position.copy(initialCameraPosition);
    heroCamera.lookAt(heroTarget);
    
    // Renderer
    try {
        heroRenderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });
        heroRenderer.setSize(scW, scH);
        heroRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        heroRenderer.outputEncoding = THREE.sRGBEncoding;
        heroContainer.appendChild(heroRenderer.domElement);
        
        // Orbit Controls (Auto-rotation and click-and-drag rotation)
        heroControls = new THREE.OrbitControls(heroCamera, heroRenderer.domElement);
        heroControls.enableDamping = true;
        heroControls.dampingFactor = 0.05;
        heroControls.enableZoom = false; // Prevents scroll hijacking
        heroControls.autoRotate = true;
        heroControls.autoRotateSpeed = 2.0;
        heroControls.target.copy(heroTarget);
    } catch (e) {
        console.error("WebGL Renderer creation failed, showing fallback image:", e);
        showHeroFallback();
        return;
    }
    
    // Lights (Simple flat ambient light for MagicaVoxel look)
    const ambientLight = new THREE.AmbientLight(0xcccccc, Math.PI);
    heroScene.add(ambientLight);
    
    // Set up Draco decoder
    const dracoLoader = new THREE.DRACOLoader();
    dracoLoader.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/libs/draco/');
    dracoLoader.setDecoderConfig({ type: 'js' });
    
    // Load Shiba Inu model
    const loader = new THREE.GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    
    loader.load(
        './img/shiba.glb',
        (gltf) => {
            const loadedScene = gltf.scene;
            loadedScene.name = 'dog';
            loadedScene.position.y = 0;
            loadedScene.position.x = 0;
            loadedScene.receiveShadow = false;
            loadedScene.castShadow = false;
            
            heroScene.add(loadedScene);
            
            loadedScene.traverse(function (child) {
                if (child.isMesh) {
                    child.castShadow = false;
                    child.receiveShadow = false;
                }
            });
            
            dogModel = loadedScene;
            console.log("Shiba 3D Model loaded successfully!");
        },
        undefined,
        (error) => {
            console.error("Error loading Shiba GLB model:", error);
        }
    );
}


// ==========================================
// 7. RESPONSIVE RESIZE HANDLING
// ==========================================
window.addEventListener("resize", () => {
    // Update background canvas
    if (bgCamera && bgRenderer) {
        bgCamera.aspect = window.innerWidth / window.innerHeight;
        bgCamera.updateProjectionMatrix();
        bgRenderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    // Update 2D background canvas size if in fallback mode
    if (bg2DMode && bg2DCanvas) {
        bg2DCanvas.width = window.innerWidth;
        bg2DCanvas.height = window.innerHeight;
        init2DBackground();
    }
    
    // Update hero canvas
    if (heroContainer && heroCamera && heroRenderer) {
        const scW = heroContainer.clientWidth;
        const scH = heroContainer.clientHeight;
        heroRenderer.setSize(scW, scH);
        
        if (heroCamera.isOrthographicCamera) {
            const scale = scH * 0.005 + 4.8;
            const aspect = scW / scH;
            heroCamera.left = -scale * aspect;
            heroCamera.right = scale * aspect;
            heroCamera.top = scale;
            heroCamera.bottom = -scale;
        } else {
            heroCamera.aspect = scW / scH;
        }
        heroCamera.updateProjectionMatrix();
    }
});


// ==========================================
// 8. SCROLL PARALLAX & ANIMATION LOOP
// ==========================================
let targetX = 0;
let targetY = 0;

// Mouse coordinates scaled for camera parallax
document.addEventListener("mousemove", (e) => {
    targetX = (e.clientX - window.innerWidth / 2) * 0.04;
    targetY = (e.clientY - window.innerHeight / 2) * 0.04;
});

const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    
    const elapsedTime = clock.getElapsedTime();
    
    // 1. Rotate background star galaxy
    if (starGalaxy) {
        starGalaxy.rotation.y = elapsedTime * 0.02;
        starGalaxy.rotation.x = elapsedTime * 0.005;
    }
    
    // 2. Parallax camera effect on starfield
    if (bgCamera) {
        // Smooth camera movement using linear interpolation (lerp)
        bgCamera.position.x += (targetX - bgCamera.position.x) * 0.05;
        bgCamera.position.y += (-targetY - bgCamera.position.y) * 0.05;
        bgCamera.lookAt(bgScene.position);
    }
    
    // Fallback 2D galaxy animation if WebGL is disabled
    if (bg2DMode && bg2DContext && bg2DCanvas) {
        bg2DContext.clearRect(0, 0, bg2DCanvas.width, bg2DCanvas.height);
        
        const cx = bg2DCanvas.width / 2 + (targetX * 5);
        const cy = bg2DCanvas.height / 2 + (-targetY * 5);
        
        const scrollPercent = window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight || 1);
        const scrollRotation = scrollPercent * Math.PI * 0.8;
        const scaleFactor = 1 - scrollPercent * 0.3;
        
        const time = elapsedTime * 0.05;
        
        for (let i = 0; i < bg2DParticles.length; i++) {
            const p = bg2DParticles[i];
            const angle = p.branchAngle + p.spinAngle + time * p.speed + scrollRotation;
            const currentRadius = p.radius * scaleFactor;
            
            const x = cx + Math.cos(angle) * currentRadius + p.randomX;
            const y = cy + Math.sin(angle) * currentRadius + p.randomY;
            
            bg2DContext.fillStyle = p.color;
            bg2DContext.beginPath();
            bg2DContext.arc(x, y, p.size, 0, Math.PI * 2);
            bg2DContext.fill();
        }
    }
    
    // 3. Update OrbitControls and animate 3D Shiba Inu
    if (heroControls && heroCamera) {
        heroFrame = heroFrame <= 100 ? heroFrame + 1 : heroFrame;
        
        if (heroFrame <= 100) {
            const p = initialCameraPosition;
            const rotSpeed = -easeOutCirc(heroFrame / 120) * Math.PI * 20;
            
            heroCamera.position.y = 10;
            heroCamera.position.x = p.x * Math.cos(rotSpeed) + p.z * Math.sin(rotSpeed);
            heroCamera.position.z = p.z * Math.cos(rotSpeed) - p.x * Math.sin(rotSpeed);
            heroCamera.lookAt(heroTarget);
        } else {
            heroControls.update();
        }
    }
    
    // 4. Rotate and render each service canvas
    servicesScenes.forEach(service => {
        try {
            if (!service.currentRotationSpeed) service.currentRotationSpeed = 0.5;
            service.currentRotationSpeed += (service.targetRotationSpeed - service.currentRotationSpeed) * 0.1;
            
            service.mesh.rotation.y += service.currentRotationSpeed * 0.015;
            service.mesh.rotation.x += service.currentRotationSpeed * 0.007;
            
            service.renderer.render(service.scene, service.camera);
        } catch(e) {}
    });
    
    // Render background scene
    if (bgRenderer && bgScene && bgCamera) {
        bgRenderer.render(bgScene, bgCamera);
    }
    
    // Render hero scene
    if (heroRenderer && heroScene && heroCamera) {
        heroRenderer.render(heroScene, heroCamera);
    }
}


// ==========================================
// 9. GSAP SCROLLTRIGGER INTERACTION
// ==========================================
function initScrollAnimations() {
    if (typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);
    
    // Background starfield camera path based on scrolling sections
    const scrollTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: "main",
            start: "top top",
            end: "bottom bottom",
            scrub: 1.2
        }
    });
    
    // Move the galaxy closer/further and rotate as we scroll
    if (bgCamera && starGalaxy) {
        scrollTimeline
            .to(bgCamera.position, { z: 45, y: -10, ease: "none" })
            .to(starGalaxy.rotation, { z: Math.PI * 0.5, y: Math.PI * 0.6, ease: "none" }, 0);
    }
        
    // GSAP section transitions (fade and slide in headings)
    const sectionHeaders = document.querySelectorAll(".section-header");
    sectionHeaders.forEach(header => {
        gsap.from(header, {
            scrollTrigger: {
                trigger: header,
                start: "top 90%",
                toggleActions: "play none none reverse"
            },
            opacity: 0,
            y: 20,
            duration: 0.6,
            ease: "power2.out"
        });
    });
    
    // GSAP slide in about components
    gsap.from(".about-col-1", {
        scrollTrigger: {
            trigger: ".about-row",
            start: "top 90%",
            toggleActions: "play none none none"
        },
        opacity: 0,
        x: -40,
        duration: 0.8,
        ease: "power2.out"
    });
    gsap.from(".about-col-2", {
        scrollTrigger: {
            trigger: ".about-row",
            start: "top 90%",
            toggleActions: "play none none none"
        },
        opacity: 0,
        x: 40,
        duration: 0.8,
        ease: "power2.out"
    });

    // GSAP fade in service cards individually
    gsap.utils.toArray(".service-card").forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 92%",
                toggleActions: "play none none none"
            },
            opacity: 0,
            y: 40,
            duration: 0.6,
            delay: index * 0.1,
            ease: "power2.out"
        });
    });
    
    // GSAP fade in work cards individually
    gsap.utils.toArray(".work-card").forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 92%",
                toggleActions: "play none none none"
            },
            opacity: 0,
            y: 40,
            duration: 0.6,
            delay: (index % 3) * 0.1,
            ease: "power2.out"
        });
    });

    // IntersectionObserver for tech cards — reliable on all entry paths
    if ('IntersectionObserver' in window) {
        const techCatObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const cards = entry.target.querySelectorAll('.tech-card');
                    cards.forEach((card, i) => {
                        setTimeout(() => {
                            card.classList.add('tech-card--visible');
                        }, i * 70);
                    });
                    techCatObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

        document.querySelectorAll('.tech-category').forEach(cat => {
            techCatObserver.observe(cat);
        });

        // Marquee IntersectionObserver
        const marqueeEl = document.querySelector('.tech-marquee-wrap');
        if (marqueeEl) {
            const marqueeObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        marqueeEl.classList.add('marquee--visible');
                        marqueeObserver.unobserve(marqueeEl);
                    }
                });
            }, { threshold: 0.05 });
            marqueeObserver.observe(marqueeEl);
        }
    } else {
        // Fallback: show everything immediately if IntersectionObserver unsupported
        document.querySelectorAll('.tech-card').forEach(c => c.classList.add('tech-card--visible'));
        const mq = document.querySelector('.tech-marquee-wrap');
        if (mq) mq.classList.add('marquee--visible');
    }

}


// ==========================================
// 10. CONTACT FORM SHEET SUBMISSION
// ==========================================
const scriptURL = "https://script.google.com/macros/s/AKfycbx0hfCuPWkIuh-aCDxPDRkWF75RwdvQnEAWektmosNC9QcRHP-GqSR3r1OfVpZtKQgK_w/exec";
const form = document.forms["submit-to-google-sheet"];
const msg = document.getElementById("msg");

if (form) {
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        // Show loading message / submission feedback
        msg.style.color = "var(--secondary)";
        msg.innerHTML = "<i class='fas fa-circle-notch fa-spin'></i> Sending message...";
        
        // Submit via fetch
        fetch(scriptURL, { method: "POST", body: new FormData(form) })
            .then(response => {
                msg.style.color = "#4ade80";
                msg.innerHTML = "Message sent successfully <i class='fa-solid fa-circle-check'></i>";
                
                // Animate contact form particles contracting when successful
                if (starGalaxy) {
                    gsap.to(starGalaxy.scale, {
                        x: 1.5, y: 1.5, z: 1.5,
                        duration: 0.5,
                        yoyo: true,
                        repeat: 1
                    });
                }
                
                setTimeout(() => {
                    msg.innerHTML = "";
                }, 5000);
                form.reset();
            })
            .catch(error => {
                console.error("Error!", error.message);
                msg.style.color = "#ef4444";
                msg.innerHTML = "Error sending message. Please try again. <i class='fa-solid fa-circle-exclamation'></i>";
                
                setTimeout(() => {
                    msg.innerHTML = "";
                }, 5000);
            });
    });
}


// ==========================================
// 10b. THREE.JS SERVICE CARDS CANVASES
// ==========================================
let servicesScenes = [];

function initServicesScenes() {
    const services = [
        { id: "service-3d-web", type: "sphere", color: 0x00f0ff, icon: "fa-code" },
        { id: "service-3d-uiux", type: "torus", color: 0xff2a75, icon: "fa-crop-simple" },
        { id: "service-3d-app", type: "icosahedron", color: 0x8b5cf6, icon: "fa-app-store" }
    ];

    services.forEach(service => {
        const container = document.getElementById(service.id);
        if (!container) return;

        try {
            const scene = new THREE.Scene();
            
            // Camera
            const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 10);
            camera.position.z = 3.2;

            // Renderer
            const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            renderer.setSize(100, 100);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            container.appendChild(renderer.domElement);

            // Geometry
            let geometry;
            if (service.type === "sphere") {
                geometry = new THREE.SphereGeometry(0.7, 10, 10);
            } else if (service.type === "torus") {
                geometry = new THREE.TorusGeometry(0.48, 0.15, 8, 16);
            } else if (service.type === "icosahedron") {
                geometry = new THREE.IcosahedronGeometry(0.7, 1);
            }

            // Material
            const material = new THREE.MeshBasicMaterial({
                color: service.color,
                wireframe: true,
                transparent: true,
                opacity: 0.35,
                blending: THREE.AdditiveBlending
            });

            const mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);

            // Store references for render loop and interaction
            const serviceObj = { container, scene, camera, renderer, mesh, material, targetRotationSpeed: 0.5 };
            servicesScenes.push(serviceObj);

            // Interact on card hover
            const card = container.closest(".service-card");
            if (card) {
                card.addEventListener("mouseenter", () => {
                    gsap.to(material, { opacity: 0.85, duration: 0.3 });
                    gsap.to(mesh.scale, { x: 1.25, y: 1.25, z: 1.25, duration: 0.3 });
                    serviceObj.targetRotationSpeed = 2.0; // Spin faster
                });
                card.addEventListener("mouseleave", () => {
                    gsap.to(material, { opacity: 0.35, duration: 0.5 });
                    gsap.to(mesh.scale, { x: 1, y: 1, z: 1, duration: 0.5 });
                    serviceObj.targetRotationSpeed = 0.5; // Back to slow spin
                });
            }
        } catch (e) {
            console.error(`WebGL Service card renderer creation failed for ${service.id}:`, e);
            // Show fallback beautiful icon inside the container if WebGL fails
            container.innerHTML = `<i class="fa-solid ${service.icon} service-fallback-icon" style="font-size: 44px; color: ${service.color === 0x00f0ff ? 'var(--secondary)' : service.color === 0xff2a75 ? 'var(--primary)' : 'var(--accent)'}; opacity: 0.6; filter: drop-shadow(0 0 10px rgba(0,240,255,0.2));"></i>`;
        }
    });
}


// ==========================================
// 11. INITIALIZATION ON LOAD
// ==========================================
if (document.readyState === "complete" || document.readyState === "interactive") {
    try { initBgScene(); } catch(e) { console.error("Error loading bg scene:", e); }
    try { initHeroScene(); } catch(e) { console.error("Error loading hero scene:", e); }
    try { initServicesScenes(); } catch(e) { console.error("Error loading services scenes:", e); }
    initLogoCanvas();
    animate();
    initScrollAnimations();
    setTimeout(() => {
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    }, 800);
} else {
    window.addEventListener("DOMContentLoaded", () => {
        try { initBgScene(); } catch(e) { console.error("Error loading bg scene:", e); }
        try { initHeroScene(); } catch(e) { console.error("Error loading hero scene:", e); }
        try { initServicesScenes(); } catch(e) { console.error("Error loading services scenes:", e); }
        initLogoCanvas();
        animate();
    });

    window.addEventListener("load", () => {
        initScrollAnimations();
        setTimeout(() => {
            if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.refresh();
            }
        }, 200);
    });
}

// Hide loader after page fully renders
function hideLoader() {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.classList.add('hidden');
        }
    }, 1800);
}

if (document.readyState === "complete") {
    hideLoader();
} else {
    window.addEventListener("load", hideLoader);
}

// ==========================================
// 12. INTERACTIVE RESUME LINK HANDLING
// ==========================================
// Programmatic PDF download code is removed since we have migrated to an interactive HTML resume (resume.html).
// Clicking the resume buttons now natively opens resume.html in a new tab.

// ==========================================
// 13. AI SHIBA AGENT INTERACTIVE LOGIC
// ==========================================

// Three.js Shiba Inu Reactions using GSAP
function shibaReact(action) {
    if (!dogModel) {
        console.warn("Shiba 3D model is not loaded yet.");
        return;
    }
    
    switch (action) {
        case 'spin':
            gsap.to(dogModel.rotation, {
                y: dogModel.rotation.y + Math.PI * 2,
                duration: 1.0,
                ease: "power2.inOut"
            });
            break;
            
        case 'jump':
            gsap.to(dogModel.position, {
                y: 1.5,
                duration: 0.25,
                yoyo: true,
                repeat: 1,
                ease: "power2.out",
                onComplete: () => {
                    // Reset to initial height
                    gsap.to(dogModel.position, { y: 0, duration: 0.1 });
                }
            });
            break;
            
        case 'shake':
            const originalX = dogModel.position.x;
            gsap.to(dogModel.position, {
                x: originalX + 0.15,
                duration: 0.05,
                yoyo: true,
                repeat: 7,
                ease: "power1.inOut",
                onComplete: () => {
                    gsap.to(dogModel.position, { x: originalX, duration: 0.05 });
                }
            });
            break;
            
        case 'dance':
            // Hop and spin combined
            gsap.to(dogModel.position, {
                y: 1.6,
                duration: 0.3,
                yoyo: true,
                repeat: 3,
                ease: "power2.out",
                onComplete: () => {
                    gsap.to(dogModel.position, { y: 0, duration: 0.1 });
                }
            });
            gsap.to(dogModel.rotation, {
                y: dogModel.rotation.y + Math.PI * 4,
                duration: 1.2,
                ease: "power1.inOut"
            });
            break;
            
        case 'color':
            // Traverse the heroScene to find lights and animate color
            if (heroScene) {
                heroScene.traverse((child) => {
                    if (child.isAmbientLight || child.isLight) {
                        const nextColor = new THREE.Color(Math.random(), Math.random(), Math.random());
                        gsap.to(child.color, {
                            r: nextColor.r,
                            g: nextColor.g,
                            b: nextColor.b,
                            duration: 0.6
                        });
                    }
                });
            }
            break;
    }
}

// Conversation Lookup Logic
function getShibaResponse(query) {
    const q = query.toLowerCase().trim();
    const contains = (words) => words.some(word => q.includes(word));
    
    // Direct Commands
    if (q === '/spin' || q === 'spin' || contains(['spin around', 'rotate', 'do a spin'])) {
        shibaReact('spin');
        return {
            text: "Woohoo! Look at me go! 🌀 *happy spinning noises*",
            reaction: 'spin'
        };
    }
    if (q === '/jump' || q === 'jump' || contains(['hop', 'bounce', 'jump up', 'do a jump'])) {
        shibaReact('jump');
        return {
            text: "Boing! Did you see how high I jumped? 🐾",
            reaction: 'jump'
        };
    }
    if (q === '/shake' || q === 'shake' || q === 'bark' || q === 'woof' || contains(['bark', 'woof', 'shake', 'wag', 'make noise'])) {
        shibaReact('shake');
        return {
            text: "Woof woof! *shakes aggressively* 🐕 I am so excited to be coding with you!",
            reaction: 'shake'
        };
    }
    if (q === '/dance' || q === 'dance' || contains(['dance', 'groove', 'do a dance'])) {
        shibaReact('dance');
        return {
            text: "Rave dog activated! Let's party! 🕺 *spins and hops*",
            reaction: 'dance'
        };
    }
    if (q === '/color' || q === 'color' || contains(['change color', 'rave', 'lighting', 'lights'])) {
        shibaReact('color');
        return {
            text: "Abacadabra! 🪄 I've changed the scene's ambient lighting color! Let there be color!",
            reaction: 'color'
        };
    }
    
    // Sukumar Info
    if (contains(['who are you', 'what is your name', 'your role', 'identity', 'who is craftzdog', 'introduce yourself'])) {
        return {
            text: "Woof! I'm **Craftz Dog**! 🐕 Sukumar's official AI Shiba coding assistant. I live in this 3D workspace. I can tell you all about Sukumar's skills, projects, education, and how to hire him, or show off my 3D tricks (like `/spin` or `/jump`)!"
        };
    }
    
    if (contains(['skills', 'technologies', 'languages', 'code', 'stack', 'know', 'expert', 'database'])) {
        return {
            text: "Sukumar is a full-stack wizard! 🧙‍♂️ Here is his tech stack:\n\n" +
                  "• **Languages:** JavaScript (ES6+), Python, Java, C, C++, HTML5, CSS3\n" +
                  "• **Frameworks & Libs:** React, Node.js, Express.js, Socket.io, Three.js, TailwindCSS, Bootstrap\n" +
                  "• **Databases:** MongoDB, MySQL, Firebase\n" +
                  "• **Tools:** Git, GitHub, VS Code, Figma, Vercel, Postman\n\n" +
                  "Want me to show you the Skills section? 🌟",
            actions: [{ text: "Scroll to Skills", type: "scroll", target: "#about" }]
        };
    }
    
    if (contains(['project', 'work', 'portfolio', 'built', 'created', 'make', 'portfolio builder', 'tarun construction', 'interview coach', 'pdf chat', 'job portal', 'ems'])) {
        return {
            text: "Sukumar has built some awesome projects! 🚀 Here are the highlights:\n\n" +
                  "1. **AI Portfolio Builder:** Drag-and-drop portfolio creator with Gemini writing assistant.\n" +
                  "2. **Tarun Construction:** Premium construction portal featuring interactive 3D landscapes (Three.js & GSAP).\n" +
                  "3. **AI Interview Coach:** Mock interviews, coding rounds, and voice feedback via Gemini API.\n" +
                  "4. **PDF AI Chat:** Upload documents and have semantic, context-aware conversations (RAG).\n" +
                  "5. **Full-Stack Job Portal:** Job tracker, resume submissions, and recruiter dashboards.\n" +
                  "6. **EMS-2026:** Employee directory dashboard tracking work records.\n\n" +
                  "Should we go inspect his Work section? 📁",
            actions: [{ text: "Scroll to Work", type: "scroll", target: "#portfolio" }]
        };
    }
    
    if (contains(['experience', 'intern', 'work', 'job', 'bluestock', 'emertxe', 'sprint', 'cloud', 'infrastructure'])) {
        return {
            text: "Sukumar has solid professional internship experience! 💼\n\n" +
                  "• **Cloud Engineer Intern (On-site)** @ SPRINT: School of Professional Studies & Information Technology (May 2026 - Present): Gaining practical experience in cloud computing, cloud infrastructure management, resource provisioning, and deployment.\n" +
                  "• **Full Stack Developer Intern** @ Emertxe Pvt. Ltd. (Aug - Dec 2025): Developed modular REST APIs and structured React + Node.js client-server interfaces.\n" +
                  "• **SDE Intern** @ Bluestock Fintech (Apr - Jun 2025): Built backend API services, resolved bottlenecks, and implemented clean, reusable DSA code logic.\n\n" +
                  "Would you like to read the details in the Experience tab? 📜",
            actions: [
                { text: "Scroll to Experience", type: "scroll-tab", target: "experience" }
            ]
        };
    }
    
    if (contains(['education', 'college', 'university', 'b.tech', 'diploma', 'gph', 'ucet', 'matriculation', 'school'])) {
        return {
            text: "Here is Sukumar's academic journey! 🎓\n\n" +
                  "• **B.Tech IT (Lateral Entry)** @ UCET Hazaribagh (2023 - 2026): Graduated with 8.17 CGPA, specialized curriculum in Web Graphics and DSA.\n" +
                  "• **Diploma in Computer Engineering** @ Government Polytechnic Kharsawan (2020 - 2023): Graduated with 8.07 CGPA, core computer science foundation.\n" +
                  "• **10th Matriculation** @ NSC High School Kalikapur (Completed 2020).\n\n" +
                  "Let's check out the Education section! 📚",
            actions: [
                { text: "Scroll to Education", type: "scroll-tab", target: "education" }
            ]
        };
    }
    
    if (contains(['cv', 'resume', 'download cv', 'pdf'])) {
        return {
            text: "Absolutely! You can view Sukumar's professional resume directly right here. It includes all his credentials. 📑",
            actions: [{ text: "View Resume 📄", type: "download-cv" }]
        };
    }
    
    if (contains(['contact', 'email', 'phone', 'reach', 'hire', 'phone number', 'message', 'social'])) {
        return {
            text: "Sukumar is open to projects and collaborations! 📬 Here are his coordinates:\n\n" +
                  "• ✉️ **Email:** sgsukumar321@gmail.com\n" +
                  "• 📞 **Phone:** +91 6205472377\n" +
                  "• 📍 **Location:** Jamshedpur, Jharkhand, India\n\n" +
                  "Let me take you straight to his Contact form! ✍️",
            actions: [{ text: "Scroll to Contact Form", type: "scroll", target: "#contact" }]
        };
    }
    
    if (contains(['hello', 'hi', 'hey', 'yo', 'wassup', 'greetings'])) {
        shibaReact('shake');
        return {
            text: "Woof woof! 🐾 Hello! I'm Craftz Dog. I'm sitting at my voxel desk ready to help. What can I tell you about Sukumar today? Or would you like to see a trick? (type `/spin` or `/jump`)"
        };
    }
    
    if (contains(['help', 'commands', 'list', 'what can you do'])) {
        return {
            text: "I can assist you with these commands and topics:\n\n" +
                  "• `/spin` - Make me spin 360° 🌀\n" +
                  "• `/jump` - Make me jump 🐾\n" +
                  "• `/shake` - Make me bark and shake 🐕\n" +
                  "• `/dance` - Watch me dance 🕺\n" +
                  "• `/color` - Change the 3D scene lighting 🎨\n" +
                  "• Ask about: **skills**, **projects**, **education**, **experience**, **CV**, or **contact**."
        };
    }

    if (contains(['bye', 'goodbye', 'see ya'])) {
        return {
            text: "Goodbye! Woof! 🐕 Have a wonderful day exploring! Come back if you want to see me spin again!"
        };
    }
    
    // Fallback
    return {
        text: "Woof? 🐕 I didn't quite catch that. My Shiba brain is simple, but I know all about Sukumar Gope's skills, experience, and projects! Ask me about those, or type `/spin` or `/jump` to see a cool 3D trick!"
    };
}

// Chat UI and Widget Operations
function initChatWidget() {
    const chatToggle = document.getElementById("ai-widget-toggle");
    const chatWindow = document.getElementById("ai-chat-window");
    const chatClose = document.getElementById("chat-close");
    const chatBubble = document.getElementById("shiba-bubble");
    const chatMessages = document.getElementById("chat-messages");
    const chatForm = document.getElementById("chat-input-form");
    const chatInput = document.getElementById("chat-input");
    const pingDot = document.querySelector(".notification-ping");
    
    if (!chatToggle || !chatWindow || !chatMessages || !chatForm || !chatInput) return;
    
    let chatOpened = false;
    let initialGreetingSent = false;
    
    // Helper to format timestamps
    function getFormattedTime() {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return `${hours}:${minutes} ${ampm}`;
    }
    
    // Add message to chat log
    function addMessage(sender, text, actions = []) {
        // Remove typing indicator if present
        const typingIndicator = document.getElementById("typing-indicator-msg");
        if (typingIndicator) {
            typingIndicator.remove();
        }
        
        const messageDiv = document.createElement("div");
        messageDiv.className = `message ${sender}`;
        
        // Render text (handle markdown bold and bullets simply)
        let htmlText = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>')
            .replace(/• (.*?)(<br>|$)/g, '<li>$1</li>');
        
        if (htmlText.includes('<li>')) {
            htmlText = htmlText.replace(/(<li>.*?<\/li>)/gs, '<ul>$1</ul>');
        }
        
        messageDiv.innerHTML = htmlText;
        
        // Append Action Buttons/Links if present
        if (actions && actions.length > 0) {
            actions.forEach(action => {
                const actionBtn = document.createElement("button");
                actionBtn.className = "message-action-btn";
                actionBtn.innerHTML = action.text;
                actionBtn.addEventListener("click", () => handleAction(action));
                messageDiv.appendChild(actionBtn);
            });
        }
        
        // Add timestamp
        const timeSpan = document.createElement("span");
        timeSpan.className = "message-time";
        timeSpan.textContent = getFormattedTime();
        messageDiv.appendChild(timeSpan);
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Show bot typing indicator
    function showTyping() {
        // Remove previous typing indicator if somehow left behind
        const existing = document.getElementById("typing-indicator-msg");
        if (existing) existing.remove();
        
        const typingDiv = document.createElement("div");
        typingDiv.className = "message bot";
        typingDiv.id = "typing-indicator-msg";
        typingDiv.innerHTML = `
            <div class="typing-indicator">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
            </div>
        `;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Handle action click
    function handleAction(action) {
        if (action.type === 'scroll') {
            const targetEl = document.querySelector(action.target);
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth' });
                // If screen is small, minimize chat so they can see the scrolled content
                if (window.innerWidth <= 480) {
                    toggleChat(false);
                }
            }
        } else if (action.type === 'scroll-tab') {
            // open the tab
            if (typeof opentab === 'function') {
                opentab(action.target);
            }
            // scroll about section into view
            const aboutSec = document.getElementById("about");
            if (aboutSec) {
                aboutSec.scrollIntoView({ behavior: 'smooth' });
                if (window.innerWidth <= 480) {
                    toggleChat(false);
                }
            }
        } else if (action.type === 'download-cv') {
            const cvButton = document.querySelector(".btn-cv");
            if (cvButton) {
                cvButton.click();
            }
        }
    }
    
    // Toggle Chat Panel visibility
    function toggleChat(open) {
        chatOpened = (open !== undefined) ? open : !chatWindow.classList.contains("active");
        
        if (chatOpened) {
            chatWindow.classList.add("active");
            if (pingDot) pingDot.style.display = "none";
            if (chatBubble) chatBubble.style.opacity = "0";
            
            // Send initial greeting after opening if not sent before
            if (!initialGreetingSent) {
                showTyping();
                setTimeout(() => {
                    initialGreetingSent = true;
                    addMessage("bot", "Woof! 🐾 Welcome! I am **Craftz Dog**, Sukumar's official AI Shiba assistant! I'm sitting here at my 3D desk ready to help you navigate his work, credentials, and skills. Ask me about his projects, experience, or tell me to do a trick! Type `/spin` or `/jump` to begin!");
                }, 1000);
            }
        } else {
            chatWindow.classList.remove("active");
        }
    }
    
    // Event listeners for open/close
    chatToggle.addEventListener("click", () => toggleChat());
    if (chatClose) chatClose.addEventListener("click", () => toggleChat(false));
    
    // Click speech bubble in hero opens chat
    if (chatBubble) {
        chatBubble.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleChat(true);
        });
    }
    
    // Click 3D canvas also highlights/opens the bubble or chat!
    const heroCanvas = document.getElementById("hero-canvas-container");
    if (heroCanvas) {
        heroCanvas.addEventListener("click", () => {
            // Trigger tail wag on click!
            shibaReact('shake');
            
            // Proactively show the speech bubble if chat isn't open
            if (!chatOpened && chatBubble) {
                chatBubble.style.opacity = "1";
                // Bounce transition effect
                gsap.fromTo(chatBubble, 
                    { scale: 0.8, opacity: 0 }, 
                    { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }
                );
            }
        });
    }
    
    // Connect suggestion chips
    document.querySelectorAll(".suggestion-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const query = btn.getAttribute("data-query");
            if (query) {
                chatInput.value = query;
                chatForm.dispatchEvent(new Event("submit"));
            }
        });
    });
    
    // Form submission
    chatForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (!text) return;
        
        // Add user message
        addMessage("user", text);
        chatInput.value = "";
        
        // Show bot typing
        showTyping();
        
        // Get Shiba's response with a slight thinking delay
        setTimeout(() => {
            const response = getShibaResponse(text);
            addMessage("bot", response.text, response.actions || []);
        }, 800 + Math.random() * 600);
    });
}

// Robust DOM load initializer
function initAllChatAndTypewriter() {
    initChatWidget();
    initTypewriter();
}

if (document.readyState === "complete" || document.readyState === "interactive") {
    initAllChatAndTypewriter();
} else {
    document.addEventListener("DOMContentLoaded", initAllChatAndTypewriter);
}

// ==========================================
// 14. TYPEWRITER EFFECT FOR HERO TITLE
// ==========================================
function renderTypewriter(item, charCount) {
    const fullText = item.prefix + item.highlight + item.suffix;
    const typed = fullText.substring(0, charCount);
    
    let output = "";
    let rem = charCount;
    
    // 1. Prefix
    if (rem <= item.prefix.length) {
        output += item.prefix.substring(0, rem);
        return output;
    }
    output += item.prefix;
    rem -= item.prefix.length;
    
    // 2. Highlight
    const cls = item.spanClass ? ` class="${item.spanClass}"` : '';
    if (rem <= item.highlight.length) {
        output += `<span${cls}>${item.highlight.substring(0, rem)}</span>`;
        return output;
    }
    output += `<span${cls}>${item.highlight}</span>`;
    rem -= item.highlight.length;
    
    // 3. Suffix
    output += item.suffix.substring(0, rem);
    return output;
}

function initTypewriter() {
    const textEl = document.getElementById("typewriter-text");
    if (!textEl) return;
    
    const words = [
        { prefix: "", highlight: "Sukumar", suffix: " Gope", spanClass: "" },
        { prefix: "a ", highlight: "Web", suffix: " Developer", spanClass: "highlight-primary" },
        { prefix: "a ", highlight: "Creative", suffix: " Coder", spanClass: "highlight-primary" },
        { prefix: "an ", highlight: "IT", suffix: " Student", spanClass: "highlight-secondary" }
    ];
    
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function type() {
        const currentItem = words[wordIndex];
        const fullTextLength = currentItem.prefix.length + currentItem.highlight.length + currentItem.suffix.length;
        
        if (isDeleting) {
            charIndex--;
            typingSpeed = 40; // faster deletion
        } else {
            charIndex++;
            typingSpeed = 80; // comfortable typing speed
        }
        
        textEl.innerHTML = renderTypewriter(currentItem, charIndex);
        
        if (!isDeleting && charIndex === fullTextLength) {
            typingSpeed = 2200; // Pause at the end of word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 400; // brief pause before typing next word
        }
        
        setTimeout(type, typingSpeed);
    }
    
    type();
}