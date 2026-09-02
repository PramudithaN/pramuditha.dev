import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Icon } from '@iconify/react';

interface Companion3DViewerProps {
  modelUrl: string;
  companionName: string;
  theme: 'light' | 'dark';
}

export default function Companion3DViewer({
  modelUrl,
  companionName,
  theme
}: Companion3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    setLoading(true);
    setLoadError(false);

    let animationFrameId: number;
    let mixer: THREE.AnimationMixer | null = null;
    const clock = new THREE.Clock();

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 280;
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.8, 3.2);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.minDistance = 1.5;
    controls.maxDistance = 6.0;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.2;
    controls.maxPolarAngle = Math.PI / 2 + 0.1;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, theme === 'dark' ? 1.6 : 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.2);
    dirLight1.position.set(3, 4, 3);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xe51d1d, 1.4);
    dirLight2.position.set(-3, -2, -2);
    scene.add(dirLight2);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(0, 3, -3);
    scene.add(keyLight);

    // Load Model
    const loader = new GLTFLoader();
    let currentModel: THREE.Group | null = null;

    loader.load(
      modelUrl,
      (gltf) => {
        currentModel = gltf.scene;

        // Auto center and scale model
        const box = new THREE.Box3().setFromObject(currentModel);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        // Standardize height to 1.8 units
        const maxDim = Math.max(size.x, size.y, size.z);
        const targetSize = 1.8;
        const scale = maxDim > 0 ? targetSize / maxDim : 1;
        currentModel.scale.setScalar(scale);

        // Recenter after scaling
        currentModel.position.x = -center.x * scale;
        currentModel.position.y = -center.y * scale;
        currentModel.position.z = -center.z * scale;

        scene.add(currentModel);

        // Handle animations
        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(currentModel);
          const action = mixer.clipAction(gltf.animations[0]);
          action.play();
        }

        setLoading(false);
      },
      undefined,
      () => {
        setLoading(false);
        setLoadError(true);
      }
    );

    // Resize observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    });
    resizeObserver.observe(container);

    // Animation loop
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      if (mixer) mixer.update(delta);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      if (container && renderer.domElement) {
        container.innerHTML = '';
      }
    };
  }, [modelUrl, theme]);

  return (
    <div className="companion-3d-canvas-container">
      <div ref={containerRef} className="companion-3d-canvas" />

      {loading && (
        <div className="companion-3d-loading-overlay">
          <Icon icon="mdi:loading" className="spin-icon" width="28" height="28" />
          <span>Loading 3D {companionName}...</span>
        </div>
      )}

      {loadError && (
        <div className="companion-3d-loading-overlay">
          <Icon icon="mdi:alert-circle-outline" width="28" height="28" />
          <span>Interactive 3D preview available in desktop app</span>
        </div>
      )}

      <div className="companion-3d-hint-pill">
        <Icon icon="mdi:cursor-move" width="14" height="14" />
        <span>Click &amp; Drag to Rotate 3D Model</span>
      </div>
    </div>
  );
}
