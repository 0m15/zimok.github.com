(function (){

  var OBJECT_ARRAY = [];
  var _geo, _mat, _mesh;
  var object = new THREE.Object3D();

  //GLOBAL
  var camera, scene, renderer, composer;
  var object, light;
  var clock;
  var effect;
  var targetRotation = 0;
  var targetRotationOnMouseDown = 0;
  var targetReverse = 0;
  var mouseX = 0;
  var mouseXOnMouseDown = 0;
  var windowHalfX = window.innerWidth / 2;
  var windowHalfY = window.innerHeight / 2;

  clock = new THREE.Clock();
  var time, delta;

  init();
  animate();

  function intervalDrawer() {
    setTimeout(function() {
      clear()
      draw()
      intervalDrawer()
    }, Math.random() * 5000)
  }
  intervalDrawer()

  function clear() {
    for ( var i = 0; i < OBJECT_ARRAY.length; i ++ ) {
      var mesh = OBJECT_ARRAY[i]
      mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 100;
      mesh.position.multiplyScalar( Math.random() * 250 );
      object.remove(mesh)
    }
  }

  function draw() {
    
    var geometry = new THREE.SphereGeometry( 1, 1, 1 );
    var material = new THREE.MeshLambertMaterial( { 
      //wireframe: true,
      wireframeLinewidth: 0.1,
      color: 0x8853ff, 
      //vertexColors: THREE.VertexColors,
      shading: THREE.FlatShading
    });

    //GENERATE CENTER OBJECTS
    for ( var i = 0; i < 120; i ++ ) {
      var mesh = new THREE.Mesh( geometry, material );
      mesh.position.set( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 ).normalize();
      mesh.position.multiplyScalar( Math.random() * 3000 );
      mesh.rotation.set( Math.random() * 2, Math.random() * 2, Math.random() * 2 );
      mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 100;
      object.add( mesh );
      OBJECT_ARRAY.push(mesh)
    }
  }

  function init() {

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
  
    renderer.setClearColor( 0x222222, 1);
    document.body.appendChild( renderer.domElement );
    
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.z = 1250;
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0x222222, 0.1, 2000 );
    
    scene.add( object );

    draw()
    

    //LIGHT
    scene.add( new THREE.AmbientLight( 0x5539ff) );
    
    light = new THREE.DirectionalLight( 0xff3300);
    light.position.set( 1, 1, 1 );
    scene.add( light );

    light = new THREE.DirectionalLight( 0xffffff);
    light.position.set( 1, 1, 1 );
    scene.add( light );

    composer = new THREE.EffectComposer( renderer );
    composer.addPass( new THREE.RenderPass( scene, camera ) );

    // var bokehPass = new THREE.BokehPass( scene, camera, {
    //  focus:    1.0,
    //  aperture: 0.0025,
    //  maxblur:  0.5,

    //  width: window.innerWidth,
    //  height: window.innerHeight
    // } );

    // bokehPass.renderToScreen = true;
    // composer.addPass( bokehPass );

    // effect = new THREE.ShaderPass( THREE.DotScreenShader );
    // effect.uniforms[ 'scale' ].value = 4;
    // effect.renderToScreen = true;
    // composer.addPass( effect );

    // effect = new THREE.ShaderPass( THREE.RGBShiftShader );
    // effect.uniforms[ 'amount' ].value = 0.001;
    // effect.renderToScreen = true;
    // composer.addPass( effect );

    var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
    effectCopy.renderToScreen = true;


    // var glitcher = new THREE.GlitchPass();
    // glitcher.renderToScreen = true;
    // composer.addPass( glitcher );

    // effect = new THREE.BloomPass(1);
    // effect.uniforms
    // effect.renderToScreen = true
    
    //composer.addPass( effect );
    composer.addPass( effectCopy );
    
    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'touchstart', onDocumentTouchStart, false );
    document.addEventListener( 'touchmove', onDocumentTouchMove, false );
    window.addEventListener( 'resize', onWindowResize, false );

  }

  function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );

  }


  //EVENTS
  function onDocumentMouseDown( event ) {

    event.preventDefault();
    
    document.addEventListener( 'mouseup', onDocumentMouseUp, false );
    document.addEventListener( 'mouseout', onDocumentMouseOut, false );
    mouseXOnMouseDown = event.clientX - windowHalfX;
    targetRotationOnMouseDown = targetRotation;

  }

  function onDocumentMouseMove( event ) {
    mouseX = event.clientX - windowHalfX;
    // effect.uniforms[ 'amount' ].value = 0.02;
    targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.0002;
  }

  function onDocumentMouseUp( event ) {

    // // effect.uniforms[ 'amount' ].value = 0.002;
    // document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
    // document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
    // document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
    // targetRotation = 0;
  }

  function onDocumentMouseOut( event ) {

    document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
    document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
    document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
    // effect.uniforms[ 'amount' ].value = 0.002;
    targetRotation = 0;
    console.log("out off window");
  }

  function onDocumentTouchStart( event ) {

    if ( event.touches.length === 1 ) {

      event.preventDefault();
      mouseXOnMouseDown = event.touches[ 0 ].pageX - windowHalfX;
      targetRotationOnMouseDown = targetRotation;
    }

  }

  function onDocumentTouchMove( event ) {

    if ( event.touches.length === 1 ) {
      event.preventDefault();
      mouseX = event.touches[ 0 ].pageX - windowHalfX;
      targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.05;

    }

  }


  //RENDER
  

  function animate() {
    time = clock.getElapsedTime();    

    requestAnimationFrame( animate );
    object.rotation.x += 0.001;
    object.rotation.y += 0.001;

    render();
    
    if(parseInt(time) % 3 == 0) {
      animateCamera()
    }

    //renderer.render(scene, camera)
    composer.render(scene, camera);
  }

  function animateCamera() {
    var camPosition = camera.position
    camera.position.setX(Math.random() * 12)
    camera.position.setY(Math.random() * 6)
  }


  var counter = 2;
  

  function render() {

    counter += 2;
    //effect.uniforms[ 'amount' ].value = 0.001;
    object.rotation.x += ( targetRotation - object.rotation.x ) * 0.05;
    //effect.uniforms[ 'amount' ].value += targetRotation/500 ;
  }

})();