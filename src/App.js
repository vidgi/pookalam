import "./App.css";

import { Suspense } from "react";

import { Canvas } from "react-three-fiber";
import { Loader, OrbitControls } from "@react-three/drei";
import PetalRing from "./PetalRing";
function App() {
  const imageData = [
    { image: require("./img/01.png"), size: "500px" },
    { image: require("./img/02.png"), size: "500px" },
    { image: require("./img/03.png"), size: "500px" },
    { image: require("./img/04.png"), size: "800px" },
    { image: require("./img/05.png"), size: "500px" },
    { image: require("./img/06.png"), size: "500px" },
    { image: require("./img/07.png"), size: "500px" },
    { image: require("./img/08.png"), size: "500px" },
    { image: require("./img/09.png"), size: "500px" },
    { image: require("./img/10.png"), size: "500px" },
    { image: require("./img/04.png"), size: "500px" },
    { image: require("./img/05.png"), size: "500px" },
  ];

  return (
    <div className="App">
      <Canvas camera={{ fov: 75, position: [0, 50, 100] }} style={{ height: "100vh", width: "100vw" }}>
        <color attach="background" args={["white"]} />

        <Suspense fallback={null}>
          {/* <group transform scale={[1.25, 1.25, 1.25]} position={[25, 0, -30]}>
            <PetalRing data={imageData[0]} />
          </group>
          <group transform scale={[1, 1, 1]} position={[20, 0, -24]}>
            <PetalRing data={imageData[1]} />
          </group> */}

          {/* <group transform scale={[0.875, 0.875, 0.875]} position={[17.5, 0, -21]}>
            <PetalRing data={imageData[1]} />
          </group> */}

          <group transform scale={[0.75, 0.75, 0.75]} position={[15, 0, -18]}>
            <PetalRing data={imageData[2]} />
          </group>

          <group transform scale={[0.625, 0.625, 0.625]} position={[12.5, 0, -15]}>
            <PetalRing data={imageData[0]} />
          </group>

          <group transform scale={[0.5, 0.5, 0.5]} position={[10, 0, -12]}>
            <PetalRing data={imageData[1]} />
          </group>

          <group transform scale={[0.375, 0.375, 0.375]} position={[7.5, 0, -9]}>
            <PetalRing data={imageData[5]} />
          </group>

          <group transform scale={[0.25, 0.25, 0.25]} position={[5, 0, -6]}>
            <PetalRing data={imageData[9]} />
          </group>
        </Suspense>
        <ambientLight />
        <OrbitControls enablePan={false} minDistance={5} maxDistance={500} autoRotate={true} autoRotateSpeed={0.4} />
      </Canvas>
      <Loader />
    </div>
  );
}

export default App;
