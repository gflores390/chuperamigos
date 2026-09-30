'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Html, OrbitControls, Sparkles, Text } from '@react-three/drei'
import { Suspense, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

const starterCars = [
  '/autos/01.png',
  '/autos/02.png',
  '/autos/03.png',
  '/autos/04.png',
  '/autos/05.png',
  '/autos/06.png',
  '/autos/07.png',
  '/autos/08.png',
  '/autos/09.png',
  '/autos/10.png',
  '/autos/11.png',
]
const messages = ['FELIZ DÍA', 'CHUPERAMIGOS', 'RECUERDOS', 'BUENA VIBRA', 'SIEMPRE JUNTOS', 'RUTA INFINITA', 'AMISTAD', 'CRACK', 'GRACIAS', 'MÁQUINA', 'SOCIOS', 'FELIZ DÍA', 'VICTOR', 'RICHI', 'RONALD', 'GUIDO', 'HECTORCHAN', 'BRYAN', 'A TODOS LOS CHUPERAMIGOS']
type CarProps = { image: string; position: [number, number, number]; scale?: number; central?: boolean; onSelect?: () => void }

function Car({ image, position, scale = 1, central = false, onSelect }: CarProps) {
  const group = useRef<THREE.Group>(null)
  useFrame((_, delta) => { if (group.current) group.current.rotation.y += delta * (central ? 0.18 : 0.35) })
  return <Float speed={central ? 1.1 : 1.7} rotationIntensity={central ? 0.08 : 0.22} floatIntensity={central ? 0.25 : 0.5}>
    <group ref={group} position={position} scale={scale} onClick={onSelect}>
      <mesh><boxGeometry args={[central ? 2.6 : 1.35, central ? 0.42 : 0.22, central ? 1.15 : 0.58]} /><meshStandardMaterial color={central ? '#f1f7ff' : '#4b8dff'} metalness={0.85} roughness={0.18} emissive={central ? '#122b73' : '#061b52'} emissiveIntensity={0.5} /></mesh>
      <mesh position={[0.05, central ? 0.38 : 0.21, 0]}><boxGeometry args={[central ? 1.42 : 0.72, central ? 0.35 : 0.2, central ? 0.88 : 0.42]} /><meshStandardMaterial color={central ? '#172c5f' : '#07122e'} metalness={0.2} roughness={0.1} transparent opacity={0.94} /></mesh>
      <mesh position={[0, central ? 0.03 : 0.02, central ? 0.59 : 0.3]}><boxGeometry args={[central ? 2.15 : 1.1, central ? 0.08 : 0.05, 0.035]} /><meshBasicMaterial color="#35d9ff" /></mesh>
      <Html center distanceFactor={central ? 7 : 10} style={{ pointerEvents: 'none' }}><div className={central ? 'car-card central-card' : 'car-card'}><img src={image} alt="Auto de la galaxia" /></div></Html>
    </group>
  </Float>
}
function OrbitRing({ radius, tilt, speed }: { radius: number; tilt: number; speed: number }) { const ring = useRef<THREE.Group>(null); useFrame((_, delta) => { if (ring.current) ring.current.rotation.z += delta * speed }); return <group ref={ring} rotation={[tilt, 0.2, 0]}><mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[radius, 0.008, 8, 128]} /><meshBasicMaterial color="#1b61cf" transparent opacity={0.55} /></mesh></group> }
function FloatingMessage({ text, position, rotation = [0, 0, 0] as [number, number, number] }) { return <Float speed={1.2} rotationIntensity={0.05} floatIntensity={0.4}><Text position={position} rotation={rotation} fontSize={0.22} color="#52dcff" anchorX="center" anchorY="middle" outlineColor="#006eff" outlineWidth={0.008} depthOffset={-1}>{text}</Text></Float> }
function Scene({ cars, selected, setSelected }: { cars: string[]; selected: number; setSelected: (i: number) => void }) {
  const positions = useMemo(() => Array.from({ length: 64 }, (_, i) => { const phi = Math.acos(1 - (2 * (i + 0.5)) / 64); const theta = Math.PI * (1 + Math.sqrt(5)) * i; const radius = 13 + (i % 5) * 1.2; return [Math.cos(theta) * Math.sin(phi) * radius, Math.cos(phi) * radius * 0.78, Math.sin(theta) * Math.sin(phi) * radius] as [number, number, number] }), [])
  const messagePositions = useMemo(() => messages.map((_, i) => { const phi = Math.acos(1 - (2 * (i + 0.5)) / messages.length); const theta = Math.PI * (1 + Math.sqrt(5)) * i; return [Math.cos(theta) * Math.sin(phi) * 10.5, Math.cos(phi) * 7.5, Math.sin(theta) * Math.sin(phi) * 10.5] as [number, number, number] }), [])
  return <><color attach="background" args={['#01040d']} /><ambientLight intensity={0.4} color="#477dff" /><pointLight position={[0, 2, 2]} intensity={14} color="#36aaff" distance={18} /><pointLight position={[0, -2, -3]} intensity={9} color="#7b21ff" distance={20} /><Sparkles count={1000} scale={[38, 25, 38]} size={1.5} speed={0.25} color="#8adfff" /><Sparkles count={220} scale={[22, 16, 22]} size={3} speed={0.45} color="#2d76ff" />
    <OrbitRing radius={10} tilt={0.42} speed={0.12} /><OrbitRing radius={15} tilt={-0.7} speed={-0.08} /><OrbitRing radius={19} tilt={0.95} speed={0.06} />
    {positions.map((position, i) => <Car key={i} image={cars[i % cars.length]} position={position} scale={0.76} onSelect={() => setSelected(i % cars.length)} />)}
    <Car image={cars[selected]} position={[0, -2.05, 0]} scale={1.45} central onSelect={() => setSelected((selected + 1) % cars.length)} />
    {messages.map((text, i) => <FloatingMessage key={`${text}-${i}`} text={text} position={messagePositions[i]} rotation={[0, (i % 2 ? 0.25 : -0.2), 0]} />)}
    <Html center position={[0, 1.05, 0]} distanceFactor={18} style={{ pointerEvents: 'none' }}><div className="center-title"><strong>FELIZ DÍA</strong><span>PARA LOS CHUPERAMIGOS</span><small>Un espacio para todos tus autos y recuerdos</small></div></Html>
    <OrbitControls enablePan={false} minDistance={8} maxDistance={32} autoRotate autoRotateSpeed={0.35} enableDamping dampingFactor={0.04} />
  </>
}

export default function Page() {
  const [started, setStarted] = useState(false)
  const [selected, setSelected] = useState(0)
  const [cars, setCars] = useState(starterCars)
  const [welcome, setWelcome] = useState('/hot-wheels.png')
  const [music, setMusic] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
const toggleMusic = async () => {
  const audio = audioRef.current

  if (!audio) return

  try {
    if (audio.paused) {
      await audio.play()
      setMusic(true)
    } else {
      audio.pause()
      setMusic(false)
    }
  } catch (error) {
    console.error('Error al reproducir:', error)
  }
}
const startGalaxy = async () => {
  setStarted(true)

  const audio = audioRef.current

  if (!audio) return

  try {
    await audio.play()
    setMusic(true)
  } catch (error) {
    console.error('No se pudo iniciar la música:', error)
  }
}
  const addImages = (files: FileList | null) => { if (!files) return; const urls = Array.from(files).slice(0, 10).map((file) => URL.createObjectURL(file)); setCars((current) => [...urls, ...current].slice(0, 10)) }
  return <main className="galaxy-app">
    <audio
      ref={audioRef}
      src="/music/background.mp3"
      loop
      preload="auto"
    />
    {!started && <div className="welcome-screen"><div className="welcome-glow" />
    <div className="welcome-card"><div className="eyebrow">CHUPERAMIGOS · ESPACIO DE AMIGOS</div>
    <img
      src={welcome}
      alt="Logo Hot Wheels de bienvenida"
      className="welcome-image hotwheels-logo"
      onClick={startGalaxy}
      />
 
 <h1>Una galaxia para<br /><em>mi amigo.</em></h1><p>Haz clic en la imagen y prepárate para entrar a nuestra órbita 🚀✨</p>
<p>Un pequeño viaje para recordar los buenos momentos, las risas y todas esas historias que nos hacen un gran grupo. ❤️</p>
<p>— Att. Guadalupe F.M.</p>
</div></div>}
    {started && <>
      <header className="topbar"><div className="brand-mark"><span>CHUPERAMIGOS</span> AMIGO<span className="dot">·</span></div><div className="live-pill"><i /> LIVE GALAXY</div>
      <div className="top-actions">
       

</div></header>
      <section className="scene-wrap" aria-label="Editor  de una esfera de autos"><Canvas camera={{ position: [0, 3, 19], fov: 45 }} dpr={[1, 2]}><Suspense fallback={null}><Scene cars={cars} selected={selected} setSelected={setSelected} /></Suspense></Canvas><div className="scene-vignette" /><div className="hint">ARRASTRA PARA EXPLORAR <span>·</span> RUEDA PARA ACERCAR</div></section>
      <footer className="footer"><span>PARA LOS QUE SIEMPRE ESTÁN</span><span>SCROLL / ROTATE TO PLAY</span></footer>
     <audio
  ref={audioRef}
  src="/music/background.mp3"
  loop
  preload="auto"
/>
    </>}
  </main>
}
