import React, { useEffect } from 'react';
import { particlesCursor } from 'threejs-toys';
import {isMobile} from 'react-device-detect';

export default function Three() {

  useEffect(()=> {
    
    const pc = particlesCursor({
      el: document.getElementById('three'),
      gpgpuSize: 256,
      colors: [0x00ff00, 0x0000ff],
      color: 0xff0000,
      coordScale: 0.5,
      noiseIntensity: 0.001,
      noiseTimeCoef: 0.0001,
      pointSize: 5,
      pointDecay: 0.0025,
      sleepRadiusX: isMobile ? 150 : 250,
      sleepRadiusY: 250,
      sleepTimeCoefX: 0.001,
      sleepTimeCoefY: 0.002
    })
    
    pc.uniforms.uColor.value.set(Math.random() * 0xffffff)
    pc.uniforms.uCoordScale.value = 0.001 + Math.random() * 2
    pc.uniforms.uNoiseIntensity.value = 0.0001 + Math.random() * 0.001
    pc.uniforms.uPointSize.value = 0.01 + Math.random() * 10
  }, []);

  return (
    <div id="three" />
  )
}