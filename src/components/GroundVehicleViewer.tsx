import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import rotate3DIcon from "../assets/rotate_3d.svg";
import "./GroundVehicleViewer.scss";

export const GroundVehicleViewer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  const resetControls = () => {
    if (controlsRef.current) controlsRef.current.reset(); // Reset the camera to its initial position
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    containerRef.current.appendChild(renderer.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // Camera position
    camera.position.set(0, 20, 120); // Set camera position

    controlsRef.current = new OrbitControls(camera, renderer.domElement);
    controlsRef.current.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controlsRef.current.maxDistance = 150; // Set maximum zoom level
    controlsRef.current.minDistance = 60; // Set minimum zoom level

    //controls.update() must be called after any manual changes to the camera's transform
    controlsRef.current.update();

    
    // Load Tank Model
    new OBJLoader().load(
      "/models/tank.obj",
      (object: THREE.Object3D) => {
        object.traverse((child: THREE.Object3D) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.material = new THREE.MeshPhongMaterial({
              color: 0xe6e6e6,
              flatShading: true,
              opacity: 0.3,
              transparent: true,
            });
          }
        });
        object.rotation.y = 1.55;
        scene.add(object);
      },
      undefined,
      (error: any) => {
        console.error("An error occurred while loading the OBJ file:", error);
      }
    );

    // Load Fuel Tank Model
    new OBJLoader().load(
      "/models/tank_fuel.obj",
      (object: THREE.Object3D) => {
        object.traverse((child: THREE.Object3D) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.material = new THREE.MeshPhongMaterial({
              color: 0xff0000,
              flatShading: true,
            });
          }
        });
        object.rotation.y = 1.55;
        scene.add(object);
      },
      undefined,
      (error: any) => {
        console.error("An error occurred while loading the OBJ file:", error);
      }
    );

    // Load Radio Tank Model
    new OBJLoader().load(
      "/models/tank_radio.obj",
      (object: THREE.Object3D) => {
        object.traverse((child: THREE.Object3D) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.material = new THREE.MeshPhongMaterial({
              color: 0xffa600,
              flatShading: true,
            });
          }
        });
        object.rotation.y = 1.55;
        scene.add(object);
      },
      undefined,
      (error: any) => {
        console.error("An error occurred while loading the OBJ file:", error);
      }
    );

    // Load Electronics Tank Model
    new OBJLoader().load(
      "/models/tank_electronics.obj",
      (object: THREE.Object3D) => {
        object.traverse((child: THREE.Object3D) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.material = new THREE.MeshPhongMaterial({
              color: 0xffa600,
              flatShading: true,
            });
          }
        });
        object.rotation.y = 1.55;
        scene.add(object);
      },
      undefined,
      (error: any) => {
        console.error("An error occurred while loading the OBJ file:", error);
      }
    );

    const resizeRendererToDisplaySize = (renderer: THREE.WebGLRenderer) => {
      if (!containerRef.current) return false;

      const canvas = renderer.domElement;
      const width  = Math.floor( containerRef.current.clientWidth);
      const height = Math.floor( containerRef.current.clientHeight);
      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        renderer.setSize(width, height);
      }
      return needResize;
    }

    // Animation loop
    const animate = () => {
      if (controlsRef.current) controlsRef.current.update();
      if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div id="GroundVehicleViewer">
      <img src={rotate3DIcon} alt="Rotate 3D" className="rotate-icon" />
      <div ref={containerRef} className="viewer-wrapper"></div>
      <button className="ground-vehicle-viewer-text" onClick={resetControls}>
        Reset view
      </button>
    </div>
  );
};
