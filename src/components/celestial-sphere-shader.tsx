import React, { useRef, useEffect, memo } from 'react';
import * as THREE from 'three';

// --- GLSL Shaders ---
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  varying vec2 vUv;
  uniform float u_time;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform float u_cloud_density;
  uniform float u_glow_intensity;

  float random(vec3 p) {
    return fract(sin(dot(p, vec3(12.9898,78.233,151.7182))) * 43758.5453);
  }

  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    vec3 u = f*f*(3.0 - 2.0*f);

    return mix(
      mix(mix(random(i+vec3(0,0,0)), random(i+vec3(1,0,0)), u.x),
          mix(random(i+vec3(0,1,0)), random(i+vec3(1,1,0)), u.x), u.y),
      mix(mix(random(i+vec3(0,0,1)), random(i+vec3(1,0,1)), u.x),
          mix(random(i+vec3(0,1,1)), random(i+vec3(1,1,1)), u.x), u.y),
      u.z
    );
  }

  float fbm(vec3 p) {
    float v = 0.0, amp = 0.5;
    for (int i = 0; i < 6; i++) {
      v += amp * noise(p);
      p *= 2.0;
      amp *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    float d = 1.0 - dot(uv, uv);
    if (d < 0.0) discard;

    // map UV onto sphere
    vec3 pos = vec3(uv, sqrt(d));

    // cloud / nebula
    vec3 coord = pos * u_cloud_density + u_time * 0.1;
    float c = fbm(coord);
    vec3 nebula = mix(u_color1, u_color2, smoothstep(0.4, 0.6, c));

    // Fresnel rim glow
    float fresnel = pow(1.0 - dot(normalize(pos), vec3(0,0,1)), 2.0)
                    * u_glow_intensity;
    vec3 glow = fresnel * u_color2;

    gl_FragColor = vec4(nebula + glow, 1.0);
  }
`;

export interface ShaderCanvasProps {
  color1?: THREE.Color | string | number;
  color2?: THREE.Color | string | number;
  cloudDensity?: number;
  glowIntensity?: number;
  rotationSpeed?: number;
  /** When true, fills parent container instead of viewport */
  contained?: boolean;
}

const ShaderCanvas: React.FC<ShaderCanvasProps> = memo(function ShaderCanvas({
  color1 = 0xff4444,
  color2 = 0x4444ff,
  cloudDensity = 2.0,
  glowIntensity = 1.0,
  rotationSpeed = 0.5,
  contained = false,
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const threeRef = useRef<{
    renderer?: THREE.WebGLRenderer;
    scene?: THREE.Scene;
    camera?: THREE.PerspectiveCamera;
    uniforms?: {
      u_time: { value: number };
      u_color1: { value: THREE.Color };
      u_color2: { value: THREE.Color };
      u_cloud_density: { value: number };
      u_glow_intensity: { value: number };
    };
    sphere?: THREE.Mesh;
    clock?: THREE.Timer;
  }>({});

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene + Camera
    const SPHERE_RADIUS = 0.6;
    // Camera pulled back to distance 2 with FOV 50 (half-FOV 25°). The sphere's
    // angular radius at this distance is asin(0.6/2) ≈ 17.46°, leaving a real
    // ~7.5° margin against the frustum edge — verified safe, unlike FOV 30 at
    // this same distance, which would put the sphere's angular radius (17.46°)
    // *outside* a 15° half-FOV and clip on all four sides, not just left/right.
    const CAMERA_DISTANCE = 2;
    const CAMERA_FOV = 50;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      CAMERA_FOV,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = CAMERA_DISTANCE;
    camera.updateProjectionMatrix();

    // 2. Renderer (no alpha → we get a visible background color)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: contained });
    const getW = () => contained ? (container.clientWidth || container.getBoundingClientRect().width || window.innerWidth) : window.innerWidth;
    const getH = () => contained ? (container.clientHeight || container.getBoundingClientRect().height || window.innerHeight) : window.innerHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, contained ? 0 : 1);
    if (contained) {
      renderer.domElement.style.position = 'absolute';
      renderer.domElement.style.top = '50%';
      renderer.domElement.style.left = '50%';
    }
    container.appendChild(renderer.domElement);

    // 3. Uniforms
    const uniforms = {
      u_time: { value: 0.0 },
      u_color1: { value: new THREE.Color(color1) },
      u_color2: { value: new THREE.Color(color2) },
      u_cloud_density: { value: cloudDensity },
      u_glow_intensity: { value: glowIntensity },
    };

    // 4. Sphere mesh with ShaderMaterial
    const geo = new THREE.SphereGeometry(SPHERE_RADIUS, 64, 64);
    const mat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: contained,
    });
    const sphere = new THREE.Mesh(geo, mat);
    scene.add(sphere);

    const clock = new THREE.Timer();
    threeRef.current = { renderer, scene, camera, uniforms, sphere, clock };

    // 5. Handle resize
    function onResize() {
      if (!contained) {
        const W = getW();
        const H = getH();
        camera.aspect = W / H;
        camera.updateProjectionMatrix();
        renderer.setSize(W, H);
        return;
      }

      // Render a SQUARE frustum (aspect = 1) sized to the SMALLER of the
      // container's two dimensions. Using Math.min (not max) guarantees the
      // canvas can never be physically larger than its container on either
      // axis — it always fits entirely inside, so no ancestor's overflow:
      // hidden can ever clip it. If the container isn't already square, the
      // canvas is centered and the longer axis shows letterboxing (the
      // container's own background) rather than any cropped/clipped sphere.
      const W = getW();
      const H = getH();
      const size = Math.max(Math.min(W, H), 1);

      camera.aspect = 1;
      camera.updateProjectionMatrix();
      renderer.setSize(size, size);
      renderer.domElement.style.width = `${size}px`;
      renderer.domElement.style.height = `${size}px`;
      renderer.domElement.style.transform = 'translate(-50%, -50%)';

      const halfFovDeg = camera.fov / 2;
      const sphereAngularRadiusDeg = (Math.asin(SPHERE_RADIUS / CAMERA_DISTANCE) * 180) / Math.PI;
      console.log('[CelestialSphereShader] resize debug', {
        containerW: W,
        containerH: H,
        containerAspect: +(W / H).toFixed(3),
        squareCanvasSizePx: size,
        cameraAspect: camera.aspect,
        cameraDistance: CAMERA_DISTANCE,
        cameraFov: CAMERA_FOV,
        halfFovDeg: +halfFovDeg.toFixed(2),
        sphereAngularRadiusDeg: +sphereAngularRadiusDeg.toFixed(2),
        marginDeg: +(halfFovDeg - sphereAngularRadiusDeg).toFixed(2),
      });
    }
    let ro: ResizeObserver | null = null;
    if (!contained) window.addEventListener('resize', onResize);
    else {
      ro = new ResizeObserver(onResize);
      ro.observe(container);
    }
    onResize();

    // 6. Animation loop
    let raf: number;
    const loop = () => {
      const { clock, sphere } = threeRef.current;
      clock!.update();
      const delta = clock!.getDelta();
      sphere!.rotation.y += delta * rotationSpeed;
      uniforms.u_time.value = clock!.getElapsed();

      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    loop();

    // 7. Cleanup
    return () => {
      cancelAnimationFrame(raf);
      if (!contained) window.removeEventListener('resize', onResize);
      else ro?.disconnect();
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color1, color2, cloudDensity, glowIntensity, rotationSpeed, contained]);

  return (
    <div
      ref={mountRef}
      style={contained ? {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
      } : {
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#050510',
      }}
    />
  );
});

export default ShaderCanvas;
