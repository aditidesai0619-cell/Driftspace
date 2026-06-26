"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export interface HeroPlanetProps {
  primaryColor?: string;
  accentColor?: string;
  size?: number;
  opacity?: number;
}

function hexToVec3(hex: string): [number, number, number] {
  const c = hex.replace("#", "");
  return [
    parseInt(c.slice(0, 2), 16) / 255,
    parseInt(c.slice(2, 4), 16) / 255,
    parseInt(c.slice(4, 6), 16) / 255,
  ];
}

const SIMPLEX_NOISE_GLSL = `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`;

const planetVert = `
varying vec3 vNormal;
varying vec3 vPosition;
void main() {
  vNormal = normalize(normalMatrix * normal);
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const planetFrag = `
uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uRimColor;
varying vec3 vNormal;
varying vec3 vPosition;

${SIMPLEX_NOISE_GLSL}

void main() {
  float noise1 = snoise(vPosition * 2.0 + uTime * 0.05);
  float noise2 = snoise(vPosition * 5.0 + uTime * 0.08);
  float noise3 = snoise(vPosition * 10.0 + uTime * 0.03);
  float pattern = noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.2;

  vec3 planetColor = mix(uColor1, uColor2, clamp(pattern * 0.5 + 0.5, 0.0, 1.0));
  planetColor = mix(planetColor, uColor3, clamp((pattern - 0.3) * 1.4, 0.0, 1.0));

  float rimLight = 1.0 - max(0.0, dot(vNormal, vec3(0.0, 0.0, 1.0)));
  rimLight = pow(rimLight, 3.0);
  planetColor += uRimColor * rimLight * 0.8;

  vec3 lightDir = normalize(vec3(1.0, 0.5, 1.0));
  float diffuse = max(0.0, dot(vNormal, lightDir));
  planetColor *= (0.2 + diffuse * 0.8);

  gl_FragColor = vec4(planetColor, 1.0);
}
`;

const atmosVert = `
varying vec3 vNormal;
void main() {
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const atmosFrag = `
uniform vec3 uAtmosColor;
varying vec3 vNormal;
void main() {
  float rim = 1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0));
  rim = pow(clamp(rim, 0.0, 1.0), 4.0);
  gl_FragColor = vec4(uAtmosColor, rim * 0.4);
}
`;

export default function HeroPlanet({
  primaryColor = "#082f49",
  accentColor = "#7dd3fc",
  size = 900,
  opacity = 0.85,
}: HeroPlanetProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const [r1, g1, b1] = hexToVec3(primaryColor);
    const [r2, g2, b2] = hexToVec3(accentColor);
    // Derive highlight color: lighten the accent toward white
    const r3 = Math.min(1, r2 * 1.4 + 0.2);
    const g3 = Math.min(1, g2 * 1.2 + 0.2);
    const b3 = Math.min(1, b2 * 1.1 + 0.1);

    const planetUniforms = {
      uTime:      { value: 0 },
      uColor1:    { value: new THREE.Vector3(r1, g1, b1) },
      uColor2:    { value: new THREE.Vector3(r2, g2, b2) },
      uColor3:    { value: new THREE.Vector3(r3, g3, b3) },
      uRimColor:  { value: new THREE.Vector3(r2, Math.min(1, g2 * 1.3), Math.min(1, b2 * 1.5)) },
    };

    const atmosUniforms = {
      uAtmosColor: { value: new THREE.Vector3(r2, g2, b2) },
    };

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 3;

    const planet = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1, 8),
      new THREE.ShaderMaterial({
        uniforms: planetUniforms,
        vertexShader: planetVert,
        fragmentShader: planetFrag,
      })
    );
    scene.add(planet);

    const atmos = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.08, 6),
      new THREE.ShaderMaterial({
        uniforms: atmosUniforms,
        vertexShader: atmosVert,
        fragmentShader: atmosFrag,
        transparent: true,
        depthWrite: false,
        side: THREE.FrontSide,
      })
    );
    scene.add(atmos);

    let raf: number;
    function loop() {
      planet.rotation.y += 0.001;
      atmos.rotation.y += 0.001;
      planetUniforms.uTime.value += 0.01;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    }
    loop();

    return () => {
      cancelAnimationFrame(raf);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primaryColor, accentColor, size]);

  return (
    <div
      ref={mountRef}
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: size,
        height: size,
        opacity,
        pointerEvents: "none",
      }}
    />
  );
}
