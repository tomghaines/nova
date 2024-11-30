'use client';
import * as THREE from 'three';
import { useEffect, useRef } from 'react';

const ParticleSystem = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 }); // [新增] 保存鼠标位置

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true // 背景透明
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // 背景透明
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // 创建粒子系统
    const particleCount = 1000;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20; // x 坐标
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20; // y 坐标
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20; // z 坐标
    }

    particlesGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );

    const textureLoader = new THREE.TextureLoader();
    const circleTexture = textureLoader.load(
      'https://threejs.org/examples/textures/sprites/circle.png'
    );

    const particlesMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.1,
      sizeAttenuation: true,
      map: circleTexture, // 圆形纹理
      transparent: true,
      opacity: 1.0,
      alphaTest: 0.5,
      depthWrite: false
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    camera.position.z = 10;

    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1; // 归一化为 -1 到 1
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 动画循环
    const animate = () => {
      requestAnimationFrame(animate);

      // [新增] 根据鼠标位置动态调整粒子旋转
      particles.rotation.y += 0.001;
      particles.rotation.x += mouse.current.y * 0.01; // 鼠标 y 影响 x 轴旋转
      particles.rotation.z += mouse.current.x * 0.01; // 鼠标 x 影响 z 轴旋转

      renderer.render(scene, camera);
    };
    animate();

    // 处理窗口调整
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // 清理
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove); // [新增] 清理鼠标事件
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className='pointer-events-none absolute inset-0 z-10'
    ></div>
  );
};

export default ParticleSystem;
