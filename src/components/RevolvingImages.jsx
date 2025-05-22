/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

const images = [
    'https://images.unsplash.com/photo-1747633126452-dee49902fc6e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://plus.unsplash.com/premium_photo-1746637466037-001842a48d31?q=80&w=1934&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1747645294647-512969fd2d23?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1747595509327-20fb3e0c3216?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1746647695879-bfab32f59f34?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://plus.unsplash.com/premium_photo-1746637466037-001842a48d31?q=80&w=1934&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1747633126452-dee49902fc6e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1747201244747-2f337a26e64f?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
];

const RevolvingImages = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        const width = window.innerWidth - 20;
        const height = window.innerHeight;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(width, height);
        mountRef.current.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.z = 12;

        const group = new THREE.Group();
        scene.add(group);

        const loader = new THREE.TextureLoader();
        const meshes = [];

        images.forEach((src, i) => {
            loader.load(src, (texture) => {
                const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
                const geometry = new THREE.PlaneGeometry(3, 2);
                const mesh = new THREE.Mesh(geometry, material);

                const angle = (i / images.length) * Math.PI * 2;
                const radius = 6;
                mesh.position.x = Math.cos(angle) * radius;
                mesh.position.z = Math.sin(angle) * radius;
                mesh.position.y = 0; // <- keep all images on horizontal plane

                group.add(mesh);
                meshes.push(mesh);
            });
        });

        gsap.to(group.rotation, {
            y: "+=6.283", // 2 * PI
            duration: 20,
            ease: "none",
            repeat: -1,
        });

        const animate = () => {
            requestAnimationFrame(animate);
            meshes.forEach((mesh) => {
                mesh.lookAt(camera.position);
            });
            renderer.render(scene, camera);
        };
        animate();

        return () => {
            if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }
        };
    }, []);

    return <div ref={mountRef} style={{ width: '90vw', height: '100vh' }} />;
};

export default RevolvingImages;
