import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Three() {
    const trigger3 = useRef(true);

  useEffect(()=> {
    if (trigger3.current) {
    trigger3.current = false;
    const count = 1000;
    console.log('effect threemin')
	const canvas = document.querySelector('#c');
	const renderer = new THREE.WebGLRenderer({canvas});
	
	var scene = new THREE.Scene();

	var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.physicallyCorrectLights = true;
	renderer.setClearColor('#040404', 1.0);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMapEnabled = true;

	scene.fog = new THREE.Fog('#000000', 200, 800);
	let radius;
	window.innerWidth>window.innerHeight ? radius = window.innerWidth/3 : radius = window.innerHeight/3;
	const star = new THREE.Object3D();
	const slight = new THREE.PointLight(0xffffff, 100000);
	const slight1 = slight.clone();
	const slight2 = slight.clone();
	const slight3 = slight.clone();
	const slight4 = slight.clone();
	const slight5 = slight.clone();
	const slight6 = slight.clone();
	const slight7 = slight.clone();
	const slight8 = slight.clone();
	const slight9 = slight.clone();
	const slight10 = slight.clone();
	const slight11 = slight.clone();
	slight1.position.set(80, 80, -80);
	slight2.position.set(80, 80, 80);
	slight3.position.set(80, -80, -80);
	slight4.position.set(80, -80, 80);
	slight5.position.set(-80, 80, -80);
	slight6.position.set(-80, 80, 80);
	slight7.position.set(-80, -80, -80);
	slight8.position.set(200, 200, 200);
	slight9.position.set(-200, 200, -200);
	slight10.position.set(-200, 200, 200);
	slight11.position.set(200, 200, -200);
	slight.position.set(-80, -80, 80);
	star.add(slight);
	star.add(slight1);
	star.add(slight2);
	star.add(slight3);
	star.add(slight4);
	star.add(slight5);
	star.add(slight6);
	star.add(slight7);
	star.add(slight8);
	star.add(slight9);
	star.add(slight10);
	star.add(slight11);
	for (let j=0; j<count; j++){
	
		var cubeSize = Math.round((Math.random()*10))/10;
		var cubeGeometryS = new THREE.SphereGeometry(cubeSize, 8, 8);
		var cubeMaterialS = new THREE.MeshStandardMaterial({color: ((Math.random() * 0xffffff)&0xffffa0) });
		var cubeS = new THREE.Mesh(cubeGeometryS, cubeMaterialS);
		cubeS.name = "cube-" + scene.children.length;
		cubeS.position.z=radius/(-2) + Math.round((Math.random() * radius));
		cubeS.position.x=radius/(-2) + Math.round((Math.random() * radius));
		cubeS.position.y=radius/(-2) + Math.round((Math.random() * radius));
		star.add(cubeS);
	}
	scene.add(star);

	camera.position.x = 200;
	camera.position.y = 200;
	camera.position.z = 200;
	camera.lookAt(0, 0, 0);
	
	let rot=0, dtime=0;

	function render (time) {
		
		if ((time-dtime)>100) dtime=time;
		rot+=0.001;
		star.rotation.y = rot;
		camera.lookAt(0, 0, 0);
           requestAnimationFrame(render);
		renderer.render(scene, camera);
	}
	requestAnimationFrame(render);	
	window.addEventListener( 'resize', onWindowResize );
	function onWindowResize() {

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );

	}
}
  }, []);

  return (
    <div id='three'>
        <canvas id="c"></canvas>
    </div>
  )
}