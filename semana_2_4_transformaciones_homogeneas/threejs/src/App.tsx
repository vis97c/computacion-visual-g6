import { useRef, useState, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { Matrix4, Mesh, Group } from "three";

import "./App.css";

function MatrixDisplay({ matrix }: { matrix: Matrix4 }) {
	const elements = useMemo(() => matrix.elements, [matrix]);

	return (
		<div className="matrix-panel">
			<div className="label">Matriz de Transformación (Mundo)</div>
			<div className="matrix-grid">
				{Array.from(elements).map((val, i) => (
					<span key={i} className="matrix-cell">
						{val.toFixed(2)}
					</span>
				))}
			</div>
		</div>
	);
}

function SolarSystem({
	setActiveMatrix,
}: {
	activeMatrix: Matrix4;
	setActiveMatrix: (matrix: Matrix4) => void;
}) {
	const sunRef = useRef<Group>(null!);
	const earthPivotRef = useRef<Group>(null!);
	const earthRef = useRef<Mesh>(null!);
	const moonPivotRef = useRef<Group>(null!);
	const moonRef = useRef<Mesh>(null!);

	useFrame((state) => {
		const time = state.clock.getElapsedTime();

		// matrices temporales para cálculos manuales
		const mTranslate = new Matrix4();
		const mRotate = new Matrix4();
		const mScale = new Matrix4();

		// 1. Transformación del Sol (Rotación sobre sí mismo)
		sunRef.current.matrixAutoUpdate = false;
		mRotate.makeRotationY(time * 0.2);
		sunRef.current.matrix.copy(mRotate);
		sunRef.current.updateMatrixWorld();

		// 2. Transformación del Pivote de la Tierra (Traslación + Rotación = Orbita)
		earthPivotRef.current.matrixAutoUpdate = false;
		mRotate.makeRotationY(time * 0.1);
		earthPivotRef.current.matrix.copy(mRotate);
		earthPivotRef.current.updateMatrixWorld();

		// 3. Transformación de la Tierra (Posición local respecto al Sol)
		earthRef.current.matrixAutoUpdate = false;
		mTranslate.makeTranslation(5, 0, 0); // Radio de órbita
		mRotate.makeRotationY(time * 2); // Rotación sobre su propio eje
		// Composición: Traslación * Rotación
		earthRef.current.matrix.copy(mTranslate).multiply(mRotate);
		earthRef.current.updateMatrixWorld();

		// 4. Transformación del Pivote de la Luna (Sigue a la Tierra)
		moonPivotRef.current.matrixAutoUpdate = false;
		mRotate.makeRotationY(time * 2);
		moonPivotRef.current.matrix.copy(mRotate);
		moonPivotRef.current.updateMatrixWorld();

		// 5. Transformación de la Luna (Traslación local respecto a la Tierra)
		moonRef.current.matrixAutoUpdate = false;
		mTranslate.makeTranslation(1.5, 0, 0); // Distancia a la Tierra
		mScale.makeScale(0.3, 0.3, 0.3); // Escala manual
		// Composición: T * S
		moonRef.current.matrix.copy(mTranslate).multiply(mScale);
		moonRef.current.updateMatrixWorld();

		// Actualizar matriz visualizada (Mundo de la Tierra)
		const worldMatrix = new Matrix4();

		earthRef.current.applyMatrix4(worldMatrix);
		setActiveMatrix(worldMatrix.clone());
	});

	return (
		<group ref={sunRef}>
			{/* Sol */}
			<mesh>
				<sphereGeometry args={[1.5, 32, 32]} />
				<meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={2} />
			</mesh>
			<axesHelper args={[3]} />

			{/* Sistema Tierra (Hijo del Sol) */}
			<group ref={earthPivotRef}>
				<group ref={earthRef}>
					{/* Tierra */}
					<mesh>
						<sphereGeometry args={[0.5, 32, 32]} />
						<meshStandardMaterial color="#3b82f6" roughness={0.3} />
					</mesh>
					<axesHelper args={[1.5]} />

					{/* Sistema Luna (Hijo de la Tierra) */}
					<group ref={moonPivotRef}>
						<mesh ref={moonRef}>
							{/* Luna */}
							<sphereGeometry args={[0.5, 16, 16]} />
							<meshStandardMaterial color="#94a3b8" />
						</mesh>
						<axesHelper args={[0.8]} />
					</group>
				</group>
			</group>
		</group>
	);
}

function App() {
	const [activeMatrix, setActiveMatrix] = useState<Matrix4>(new Matrix4());

	return (
		<main id="container">
			<div className="overlay">
				<h1>Sistemas de Coordenadas y Matrices</h1>
				<p>Jerarquía: Sol → Tierra → Luna</p>
			</div>

			<section id="canvas-container">
				<Canvas camera={{ position: [8, 8, 8], fov: 45 }}>
					<Suspense fallback={null}>
						<ambientLight intensity={0.4} />
						<pointLight position={[0, 0, 0]} intensity={20} color="#fff176" />
						<spotLight
							position={[10, 10, 10]}
							angle={0.15}
							penumbra={1}
							intensity={1}
						/>

						<SolarSystem
							activeMatrix={activeMatrix}
							setActiveMatrix={setActiveMatrix}
						/>

						<OrbitControls makeDefault />
						<Environment preset="night" />
						<gridHelper args={[20, 20, 0x333333, 0x111111]} position={[0, -2, 0]} />
					</Suspense>
				</Canvas>
				<MatrixDisplay matrix={activeMatrix} />
			</section>

			<ul id="canvas-options">
				<li>Transformaciones Manuales (Matrix4)</li>
				<li>Jerarquía Anidada: World vs Local</li>
				<li>Composición: T * R * S</li>
			</ul>
		</main>
	);
}

export default App;
