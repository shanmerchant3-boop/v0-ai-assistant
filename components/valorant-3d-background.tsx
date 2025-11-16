"use client"

import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, MeshDistortMaterial, Sphere, Html } from '@react-three/drei'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'

function JettVideoPlane({ position, scale = 1 }) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.3
      // Subtle rotation
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[4 * scale, 6 * scale]} />
      <meshBasicMaterial transparent opacity={0.8}>
        <Html
          transform
          occlude
          position={[0, 0, 0]}
          style={{
            width: '400px',
            height: '600px',
            pointerEvents: 'none',
          }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              mixBlendMode: 'screen',
              filter: 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.6))',
            }}
          >
            <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/jett-updraft-dash-valorant-moewalls-com-F69GuzRZ2Mc6zdTbVh3F49I82qMEBM.mp4" type="video/mp4" />
          </video>
        </Html>
      </meshBasicMaterial>
      
      {/* Glow effect around video */}
      <Sphere args={[3 * scale, 32, 32]} position={[0, 0, -0.5]}>
        <meshStandardMaterial 
          color="#8b5cf6"
          transparent
          opacity={0.1}
          emissive="#8b5cf6"
          emissiveIntensity={0.5}
        />
      </Sphere>
    </mesh>
  )
}

function FloatingGeometry({ position, scale, color }) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.4
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <boxGeometry />
      <meshStandardMaterial 
        color={color}
        emissive={color}
        emissiveIntensity={0.4}
        wireframe
      />
    </mesh>
  )
}

function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null)
  
  const particles = useMemo(() => {
    const count = 500
    const positions = new Float32Array(count * 3)
    
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 30
    }
    
    return positions
  }, [])

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#8b5cf6"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

export default function Valorant3DBackground() {
  return (
    <div className="fixed inset-0 -z-10 opacity-40 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#8b5cf6" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ec4899" />
        <spotLight position={[0, 10, 0]} intensity={0.8} color="#06b6d4" angle={0.6} penumbra={1} />
        
        <Environment preset="night" />
        
        <JettVideoPlane position={[-5, 0, -2]} scale={0.8} />
        <JettVideoPlane position={[6, 1, -4]} scale={0.9} />
        <JettVideoPlane position={[0, -1, -6]} scale={0.7} />
        
        {/* Floating geometric shapes */}
        <FloatingGeometry position={[-3, 2, 0]} scale={0.5} color="#8b5cf6" />
        <FloatingGeometry position={[4, -2, -2]} scale={0.7} color="#ec4899" />
        <FloatingGeometry position={[0, -3, 1]} scale={0.4} color="#06b6d4" />
        
        {/* Particle field */}
        <ParticleField />
        
        {/* Central energy sphere */}
        <Float speed={1.5} rotationIntensity={0.3}>
          <Sphere args={[2, 64, 64]} position={[0, 0, -8]}>
            <MeshDistortMaterial
              color="#8b5cf6"
              attach="material"
              distort={0.4}
              speed={2}
              roughness={0.2}
              metalness={0.8}
              emissive="#8b5cf6"
              emissiveIntensity={0.5}
              transparent
              opacity={0.3}
            />
          </Sphere>
        </Float>
      </Canvas>
    </div>
  )
}
