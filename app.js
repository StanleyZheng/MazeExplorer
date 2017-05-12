// Colors
const white = vec4(1, 1, 1, 1);
const gray = vec4(0.5, 0.5, 0.5, 1);
const red = vec4(1, 0, 0, 1);
const darkgray = vec4(0.15, 0.15, 0.15, 1);
const yellow = vec4(1.0, 1.0, 0.0, 1);

var canvas, gl, program;
var skyColorRed = 136;
var skyColorGreen = 205;
var skyColorBlue = 250;

var keysDown = [0,0,0,0]; //WASD
var mouseDown = false;
var mouseSpeed = 1;
var mouseX, mouseY;
var playerwon = 0;

var theta = Math.PI/2;
var phi = 0;
var eye = vec3(1.9, 0.15, 1.9);
var at = subtract(eye, vec3(Math.sin(theta)*Math.cos(phi), -Math.sin(phi), Math.cos(theta)*Math.cos(phi)));
const up = vec3(0, 1, 0);

var tempEye;
var prevTheta, prevPhi = 0;
var prevEye = vec3(0,0,0);
var prevAt = vec3(0,0,0);
var birdseye = 0;
var moveSpeed = 0.01

const NUM_ROW = 22;
const NUM_COL = 22;

var tempmaze = [
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],

    [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],

    [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],

    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],

    [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] ];

function generateRandomMaze(){
    var count = -1;
    for(var i = 1; i < 21;){
        for(var j = 1; j < 21;){
            tempmaze[i][j] = count;
            tempmaze[i+1][j] = count;
            tempmaze[i][j+1] = count;
            tempmaze[i+1][j+1] = count;
            j = j + 3;
            count--;
        }
        i = i + 3;
    }

    var vertWalls = [   [1,3],  [1,6],  [1,9],  [1,12],  [1,15],  [1,18],
                        [4,3],  [4,6],  [4,9],  [4,12],  [4,15],  [4,18],
                        [7,3],  [7,6],  [7,9],  [7,12],  [7,15],  [7,18],
                        [10,3], [10,6], [10,9], [10,12], [10,15], [10,18],
                        [13,3], [13,6], [13,9], [13,12], [13,15], [13,18],
                        [16,3], [16,6], [16,9], [16,12], [16,15], [16,18],
                        [19,3], [19,6], [19,9], [19,12], [19,15], [19,18] ];
    var horzWalls = [   [3,2], [3,5], [3,8], [3,11], [3,14], [3,17], [3,20],
                        [6,2], [6,5], [6,8], [6,11], [6,14], [6,17], [6,20],
                        [9,2], [9,5], [9,8], [9,11], [9,14], [9,17], [9,20],
                        [12,2], [12,5], [12,8], [12,11], [12,14], [12,17], [12,20],
                        [15,2], [15,5], [15,8], [15,11], [15,14], [15,17], [15,20],
                        [18,2], [18,5], [18,8], [18,11], [18,14], [18,17], [18,20] ];
    var wallIndices = vertWalls.concat(horzWalls);
    while(wallIndices.length > 0){
        var wallIndex = Math.floor(Math.random() * wallIndices.length);
        var row = wallIndices[wallIndex][0];
        var col = wallIndices[wallIndex][1];

        if ((row + col) % 3 == 1){
            if (tempmaze[row][col-1] != tempmaze[row][col+1]){
                tempmaze[row][col] = 0;
                tempmaze[row+1][col] = 0;
                var tempnum = tempmaze[row][col+1];
                for (var r = 1; r < 21; r++){
                    for (var c = 1; c < 21; c++){
                        if (tempmaze[r][c] == tempnum){
                            tempmaze[r][c] = tempmaze[row][col-1];
                        }
                    }
                }
            }
        }
        else if ((row + col) % 3 == 2){
            if (tempmaze[row-1][col] != tempmaze[row+1][col]){
                tempmaze[row][col] = 0;
                tempmaze[row][col-1] = 0;
                var tempnum = tempmaze[row+1][col];
                for (var r = 1; r < 21; r++){
                    for (var c = 1; c < 21; c++){
                        if (tempmaze[r][c] == tempnum){
                            tempmaze[r][c] = tempmaze[row-1][col];
                        }
                    }
                }
            }
        }
        wallIndices.splice(wallIndex, 1);
    }
    
}

generateRandomMaze();
var mainMaze = tempmaze;


// Textures
var whiteTexture, floorTexture, wallTexture;

// Arrays to hold all info for objects
var sunPoints = [];
var sunTextures = [];
var sunColors = [];
var sunNormalsArray = [];

var playerPoints = [];
var playerTextures = [];
var playerColors = [];
var playerNormalsArray = [];

var floorPoints = [];
var floorTextures = [];
var floorColors = [];
var floorNormalsArray = [];

var wallPoints = [];
var wallTextures = [];
var wallColors = [];
var wallNormalsArray = [];
var walls = [];



// Lighting
var lightPosition = vec4(   0,  5,   0, 1.0);
var lightAmbient =  vec4( 0.1, 0.1, 0.1, 1.0 );
var lightDiffuse =  vec4( 0.6, 0.6, 0.6, 1.0 );
var lightSpecular = vec4( 0.3, 0.3, 0.3, 1.0 );
var materialShininess = 20.0;
var normalsArray = [];
var normalMatrix = mat3();

function setupSun(){
    sunPoints = [   vec4(-0.5, 11, 0.5, 1),
                    vec4(-0.5, 11,-0.5, 1),
                    vec4( 0.5, 11,-0.5, 1),
                    vec4( 0.5, 11, 0.5, 1) ];
    sunTextures=[   vec2( 0,  0),
                    vec2( 0, 50),
                    vec2(50, 50),
                    vec2(50,  0) ];
    sunColors=[ white, white, white, white ];
    sunPoints.forEach(function(object){
        sunNormalsArray.push(vec4(0,-1,0,0));
    });
}

function setupPlayer(){
    setPlayerPosition();
    playerTextures=[ vec2( 0,  0),
                     vec2( 0, 50),
                     vec2(50, 50),
                     vec2(50,  0) ];
    playerColors = [yellow, yellow, yellow, yellow];
    playerPoints.forEach(function(object){
        playerNormalsArray.push(vec4(0,1,0,0));
    });
}

function setPlayerPosition(){
    playerPoints = [ vec4(add(eye, vec3(0.05, 0.05, 0.05)), 1),
                     vec4(add(eye, vec3(0.05, 0.05, -0.05)), 1),
                     vec4(add(eye, vec3(-0.05, 0.05, -0.05)), 1),
                     vec4(add(eye, vec3(-0.05, 0.05, 0.05)), 1) ];
}

function setupFloors(){
    floorPoints = [ vec4(-2.2, 0, 2.2, 1),
                    vec4(2.2, 0, 2.2, 1),
                    vec4(2.2, 0, -2.2, 1),
                    vec4(-2.2, 0, -2.2, 1) ];
    floorTextures=[ vec2(0, 0),
                    vec2(15, 0),
                    vec2(15, 15),
                    vec2(0, 15) ];
    floorColors=[ white, white, white, white ];
    floorPoints.forEach(function(object){
        floorNormalsArray.push(vec4(0,1,0,0));
    });
}

function setupWalls(){
    makeWall();
    var counter = 0;
    for (var row = 0; row < NUM_ROW; row++){
        for (var col = 0; col < NUM_COL; col++){
            if (mainMaze[row][col] == 1){
                walls[counter] = new wall(2*row, 2*col);
                counter++;
            }
        }
    }
}

function wall(row, col){
    row = row/10;
    col = col/10;
    this.transformMatrix = mult(translate(row-2.2, 0, col-2.2), scalem(0.201, 0.25, 0.201));
}

function makeWall(){
    quad( 1, 0, 3, 2);
    quad( 2, 3, 7, 6);
    // quad( 3, 0, 4, 7 ); // bottom face
    quad( 6, 5, 1, 2);
    quad( 4, 5, 6, 7);
    quad( 5, 4, 0, 1);

        wallNormalsArray.push(vec4( 0, 0, 1, 0));
        wallNormalsArray.push(vec4( 0, 0, 1, 0));
        wallNormalsArray.push(vec4( 0, 0, 1, 0));
        wallNormalsArray.push(vec4( 0, 0, 1, 0));
        wallNormalsArray.push(vec4( 0, 0, 1, 0));
        wallNormalsArray.push(vec4( 0, 0, 1, 0));

        wallNormalsArray.push(vec4( 1, 0, 0, 0));
        wallNormalsArray.push(vec4( 1, 0, 0, 0));
        wallNormalsArray.push(vec4( 1, 0, 0, 0));
        wallNormalsArray.push(vec4( 1, 0, 0, 0));
        wallNormalsArray.push(vec4( 1, 0, 0, 0));
        wallNormalsArray.push(vec4( 1, 0, 0, 0));

        // wallNormalsArray.push(vec4( 0,-1, 0,0)); // bottom face

        wallNormalsArray.push(vec4( 0, 1, 0, 0));
        wallNormalsArray.push(vec4( 0, 1, 0, 0));
        wallNormalsArray.push(vec4( 0, 1, 0, 0));
        wallNormalsArray.push(vec4( 0, 1, 0, 0));
        wallNormalsArray.push(vec4( 0, 1, 0, 0));
        wallNormalsArray.push(vec4( 0, 1, 0, 0));

        wallNormalsArray.push(vec4( 0, 0, -1, 0));
        wallNormalsArray.push(vec4( 0, 0, -1, 0));
        wallNormalsArray.push(vec4( 0, 0, -1, 0));
        wallNormalsArray.push(vec4( 0, 0, -1, 0));
        wallNormalsArray.push(vec4( 0, 0, -1, 0));
        wallNormalsArray.push(vec4( 0, 0, -1, 0));

        wallNormalsArray.push(vec4(-1, 0, 0, 0));
        wallNormalsArray.push(vec4(-1, 0, 0, 0));
        wallNormalsArray.push(vec4(-1, 0, 0, 0));
        wallNormalsArray.push(vec4(-1, 0, 0, 0));
        wallNormalsArray.push(vec4(-1, 0, 0, 0));
        wallNormalsArray.push(vec4(-1, 0, 0, 0));
}

function quad(a, b, c, d) {
    var vertices = [    vec4(  0.0, 0.0,  1.0, 1.0 ),
                        vec4(  0.0, 1.0,  1.0, 1.0 ),
                        vec4(  1.0, 1.0,  1.0, 1.0 ),
                        vec4(  1.0, 0.0,  1.0, 1.0 ),
                        vec4(  0.0, 0.0,  0.0, 1.0 ),
                        vec4(  0.0, 1.0,  0.0, 1.0 ),
                        vec4(  1.0, 1.0,  0.0, 1.0 ),
                        vec4(  1.0, 0.0,  0.0, 1.0 ) ];
    var indices = [ a, b, c, a, c, d ];

    for ( var i = 0; i < indices.length; ++i ) {
        wallPoints.push(vertices[indices[i]]);
        wallColors.push(white);
    }
    wallTextures.push(vec2(0, 0));
    wallTextures.push(vec2(2, 0));
    wallTextures.push(vec2(2, 1));
    wallTextures.push(vec2(0, 0));
    wallTextures.push(vec2(2, 1));
    wallTextures.push(vec2(0, 1));
}

function checkbounds(direction){
    if (playerwon == 0){
        var characterWidth = 0.01;
        var xval = tempEye[0] + 2.2;
        var zval = tempEye[2] + 2.2;
        xvalpos = Math.floor((xval+characterWidth) * 5);
        zvalpos = Math.floor((zval+characterWidth) * 5);
        xvalneg = Math.floor((xval-characterWidth) * 5);
        zvalneg = Math.floor((zval-characterWidth) * 5);

        if (xvalneg < 0 || zvalneg < 0){
            alert("WON! :D");
            playerwon = 1;
            window.location.reload();
            return;
        }

        if (mainMaze[xvalpos][zvalpos] == 1 ||
            mainMaze[xvalpos][zvalneg] == 1 ||
            mainMaze[xvalneg][zvalpos] == 1 ||
            mainMaze[xvalneg][zvalneg] == 1){
            return false;
        } else {
            return true;
        }
    }        
}


function mouseSliderChange(){
    mouseSpeed = document.getElementById("mouseSlider").value;
}

function timeSliderChange(){
    var sliderVal = document.getElementById("timeSlider").value;
    console.log(sliderVal);
    skyColorRed = 136 - sliderVal * (136)/256;
    skyColorGreen = 205 - sliderVal * (205)/256;
    skyColorBlue = 250 - sliderVal * (250)/256;
    var tempAmbient = 0.1 - sliderVal * 0.1/256;
    var tempDiffuse = 0.6 - sliderVal * 0.6/256;
    var tempSpecular = 0.3 - sliderVal * 0.3/256;
    lightAmbient = vec4(tempAmbient, tempAmbient, tempAmbient, 1);
    lightDiffuse = vec4(tempDiffuse, tempDiffuse, tempDiffuse, 1);
    lightSpecular = vec4(tempSpecular, tempSpecular, tempSpecular, 1);
    updateLighting();
}

function configureTexture(tex, image){
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
}

// used to update position of player icon
function updateAllPoints(){
    setPlayerPosition();
    var vpoints = sunPoints.concat(playerPoints.concat(floorPoints.concat(wallPoints)));
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vpoints), gl.STATIC_DRAW);
    var vPositionLoc = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPositionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( vPositionLoc );
}

function updateLighting(){
    gl.uniform4fv( gl.getUniformLocation(program, "ambientProduct"), flatten(lightAmbient) );
    gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"), flatten(lightDiffuse) );
    gl.uniform4fv( gl.getUniformLocation(program, "specularProduct"), flatten(lightSpecular) );   
}

window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }
    
    canvas.height = Math.max(300, Math.min(window.innerWidth/2, window.innerHeight*4/5));
    canvas.width = canvas.height*2;
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( skyColorRed/256, skyColorGreen/256, skyColorBlue/256, 1.0 );
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);


    // LOAD SHADERS
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);


    // INITIALIZE TEXTURES
    // white texture, for points without textures
    whiteTexture = gl.createTexture(); 
    gl.bindTexture(gl.TEXTURE_2D, whiteTexture);
    var whitePixel = new Uint8Array([255, 255, 255, 255]);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, whitePixel);

    floorTexture = gl.createTexture();
    floorTextureImage = document.getElementById("floorImage");
    floorTextureImage.onload = function(){ configureTexture(floorTexture, floorTextureImage); }
    floorTextureImage.src = "maze_floor.png";

    wallTexture = gl.createTexture();
    wallTextureImage = document.getElementById("wallImage");
    wallTextureImage.onload = function(){ configureTexture(wallTexture, wallTextureImage); }
    wallTextureImage.src = "maze_wall.png";

    setupSun();
    setupPlayer();
    setupFloors();
    setupWalls();

    // INITIALIZE BUFFERS
    // object points and colors
    var vpoints = sunPoints.concat(playerPoints.concat(floorPoints.concat(wallPoints)));
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vpoints), gl.STATIC_DRAW);
    var vPositionLoc = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPositionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( vPositionLoc );
    
    var cpoints = sunColors.concat(playerColors.concat(floorColors.concat(wallColors)));
    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(cpoints), gl.STATIC_DRAW);
    var vColorLoc = gl.getAttribLocation( program, "vColor");
    gl.vertexAttribPointer(vColorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( vColorLoc );
    
    // textures
    var textures = sunTextures.concat(playerTextures.concat(floorTextures.concat(wallTextures)));
    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(textures), gl.STATIC_DRAW );
    var textureCoordLoc = gl.getAttribLocation(program, "aTextureCoord");
    gl.vertexAttribPointer(textureCoordLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( textureCoordLoc );

    // normals
    normalsArray = sunNormalsArray.concat(playerNormalsArray.concat(floorNormalsArray.concat(wallNormalsArray)));
    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );
    var vNormalLoc = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormalLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormalLoc );

    // lighting
    gl.uniform4fv( gl.getUniformLocation(program, "ambientProduct"), flatten(lightAmbient) );
    gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"), flatten(lightDiffuse) );
    gl.uniform4fv( gl.getUniformLocation(program, "specularProduct"), flatten(lightSpecular) );    
    gl.uniform4fv( gl.getUniformLocation(program, "lightPosition"), flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program, "shininess"), materialShininess );

    var pmatrix = perspective(30.0, canvas.width/canvas.height, 0.0001, 100); // changes when window is resized
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "perspectiveMatrix"), false, flatten(pmatrix));

    // Event listeners
    document.onkeydown = function(event){        
        var key = event.keyCode;
        
        switch(key){
            case 87: // W
                keysDown[0] = 1;
                break;
            case 65: // A
                keysDown[1] = 1;
                break;
            case 83: // S
                keysDown[2] = 1;
                break;
            case 68: // D
                keysDown[3] = 1;
                break;
            case 77: // m
                if (birdseye == 0){
                    prevEye = eye;
                    prevAt = at;
                    prevPhi = phi;
                    prevTheta = theta;

                    eye = vec3(0,10,0);
                    at = vec3(-0.0001,0,0);
                    phi = -Math.PI / 2 + Math.PI / 180;
                    birdseye = 1;
                } else {
                    eye = prevEye;
                    at = prevAt;
                    phi = prevPhi;
                    theta = prevTheta;
                    birdseye = 0;
                }
                break;
            case 37:
                var s = document.getElementById("timeSlider");
                var v = parseFloat(s.value);
                s.value = v - 5;
                timeSliderChange();
                break;
            case 39:
                var s = document.getElementById("timeSlider");
                var v = parseFloat(s.value);
                s.value = v + 5;
    	    	timeSliderChange();
                break;
            default:
                return;
        }
    }

    document.onkeyup = function(event){        
        var key = event.keyCode;
        switch(key){
            case 87: // W
                keysDown[0] = 0;
                break;
            case 65: // A
                keysDown[1] = 0;
                break;
            case 83: // S
                keysDown[2] = 0;
                break;
            case 68: // D
                keysDown[3] = 0;
                break;
            default:
                return;
        }
    }


    //rotate screen with mouse
    canvas.onmousedown = function(event){
        if (birdseye == 0){
            mouseDown = true;
            mouseX = event.clientX;
            mouseY = event.clientY;
        }
    }
    document.onmouseup = function(){
        mouseDown = false;
    }
    canvas.onmousemove = function(event){
        if (!mouseDown){ return; }

        var newX = event.clientX;
        var newY = event.clientY;
        var dx = newX - mouseX;
        var dy = newY - mouseY;
        
        theta = (theta + dx * mouseSpeed * 1/500) % (2 * Math.PI);
        
        phi = (phi + dy * mouseSpeed * 1/900);
        if (phi > Math.PI / 2 - Math.PI / 180)
            phi = Math.PI / 2 - Math.PI / 180;
        else if(phi < -Math.PI / 2 + Math.PI / 180)
            phi = -Math.PI / 2 + Math.PI / 180;
        mouseX = newX;
        mouseY = newY;

        at = subtract(eye, vec3(Math.sin(theta) * Math.cos(phi), -Math.sin(phi), Math.cos(theta) * Math.cos(phi)));
    }

    window.onresize = function(event){
        canvas.height = Math.max(300, Math.min(window.innerWidth/2, window.innerHeight*4/5));
        canvas.width = canvas.height*2;
        gl.viewport(0, 0, canvas.width, canvas.height);
        var pmatrix = perspective(30.0, canvas.width/canvas.height, 0.0001, 100);
        gl.uniformMatrix4fv( gl.getUniformLocation(program, "perspectiveMatrix"), false, flatten(pmatrix));
    }

    requestAnimFrame(render);
}


function move(){
    if (keysDown[0] == 1){
        if (birdseye == 0){
            tempEye = add(eye, vec3(-moveSpeed * Math.sin(theta), 0, 0));
            if (checkbounds(0))
                eye = tempEye;

            tempEye = add(eye, vec3(0, 0, -moveSpeed * Math.cos(theta)));
            if (checkbounds(0))
                eye = tempEye;

            at = subtract(eye, vec3(Math.sin(theta) * Math.cos(phi), -Math.sin(phi), Math.cos(theta) * Math.cos(phi)));
            updateAllPoints();
            return;
        }
	    else if (birdseye == 1){
            tempEye = add(prevEye, vec3(-moveSpeed * 2 * Math.sin(theta), 0, 0));
            if (checkbounds(0))
                prevEye = tempEye;

            tempEye = add(prevEye, vec3(0, 0, -moveSpeed * 2 * Math.cos(theta)));
            if (checkbounds(0))
                prevEye = tempEye;

            prevAt = subtract(prevEye, vec3(Math.sin(theta) * Math.cos(prevPhi), -Math.sin(prevPhi), Math.cos(theta) * Math.cos(prevPhi)));           
            
            eye = prevEye;
            updateAllPoints();
            eye = vec3(0,10,0);
            at = vec3(-0.0001,0,0);
            phi = -Math.PI / 2 + Math.PI / 180;
        }
	
    }
    if (keysDown[1] == 1){
        if (birdseye == 0){
            tempEye = add(eye, vec3(-moveSpeed * Math.cos(theta), 0, 0));
            if (checkbounds(1))
                eye = tempEye;

            tempEye = add(eye, vec3(0, 0, moveSpeed * Math.sin(theta)));
            if (checkbounds(1))
                eye = tempEye;

            at = subtract(eye, vec3(Math.sin(theta) * Math.cos(phi), -Math.sin(phi), Math.cos(theta) * Math.cos(phi)));
            updateAllPoints();
            return;
        }
        else if (birdseye == 1){
            tempEye = add(prevEye, vec3(-moveSpeed * 2 * Math.cos(theta), 0, 0));
            if (checkbounds(1))
                prevEye = tempEye;

            tempEye = add(prevEye, vec3(0, 0, moveSpeed * 2 * Math.sin(theta)));
            if (checkbounds(1))
                prevEye = tempEye;

            prevAt = subtract(prevEye, vec3(Math.sin(theta) * Math.cos(prevPhi), -Math.sin(prevPhi), Math.cos(theta) * Math.cos(prevPhi)));           
            
            eye = prevEye;
            updateAllPoints();
            eye = vec3(0,10,0);
            at = vec3(-0.0001,0,0);
            phi = -Math.PI / 2 + Math.PI / 180;
        }
    }
    if (keysDown[2] == 1){
        if (birdseye == 0){
            tempEye = add(eye, vec3(moveSpeed * Math.sin(theta), 0, 0));
            if (checkbounds(2))
                eye = tempEye;

            tempEye = add(eye, vec3(0, 0, moveSpeed * Math.cos(theta)));
            if (checkbounds(2))
                eye = tempEye;

            at = subtract(eye, vec3(Math.sin(theta) * Math.cos(phi), -Math.sin(phi), Math.cos(theta) * Math.cos(phi)));
            updateAllPoints();
            return;
        }
        else if (birdseye == 1){
            tempEye = add(prevEye, vec3(moveSpeed * 2 * Math.sin(theta), 0, 0));
            if (checkbounds(2))
                prevEye = tempEye;

            tempEye = add(prevEye, vec3(0, 0, moveSpeed * 2 * Math.cos(theta)));
            if (checkbounds(2))
                prevEye = tempEye;

            prevAt = subtract(prevEye, vec3(Math.sin(theta) * Math.cos(prevPhi), -Math.sin(prevPhi), Math.cos(theta) * Math.cos(prevPhi)));           
            
            eye = prevEye;
            updateAllPoints();
            eye = vec3(0,10,0);
            at = vec3(-0.0001,0,0);
            phi = -Math.PI / 2 + Math.PI / 180;
        }
    }
    if (keysDown[3] == 1){
        if (birdseye == 0){
            tempEye = add(eye, vec3(moveSpeed * Math.cos(theta), 0, 0));
            if (checkbounds(3))
                eye = tempEye;

            tempEye = add(eye, vec3(0, 0, -moveSpeed * Math.sin(theta)));
            if (checkbounds(3))
                eye = tempEye;

            at = subtract(eye, vec3(Math.sin(theta) * Math.cos(phi), -Math.sin(phi), Math.cos(theta) * Math.cos(phi)));
            updateAllPoints();
            return;
        }
        else if (birdseye == 1){
            tempEye = add(prevEye, vec3(moveSpeed * 2 * Math.cos(theta), 0, 0));
            if (checkbounds(3))
                prevEye = tempEye;

            tempEye = add(prevEye, vec3(0, 0, -moveSpeed * 2 * Math.sin(theta)));
            if (checkbounds(3))
                prevEye = tempEye;

            prevAt = subtract(prevEye, vec3(Math.sin(theta) * Math.cos(prevPhi), -Math.sin(prevPhi), Math.cos(theta) * Math.cos(prevPhi)));           
            
            eye = prevEye;
            updateAllPoints();
            eye = vec3(0,10,0);
            at = vec3(-0.0001,0,0);
            phi = -Math.PI / 2 + Math.PI / 180;
        }
    }
}


function render(){
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //gl.clearColor( 0.53, 0.80, skyColorBlue/256, 1.0 );    
    gl.clearColor( skyColorRed/256, skyColorGreen/256, skyColorBlue/256, 1.0 );

    var mvMatrix = lookAt(eye, at, up); // changes when user moves
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "modelViewMatrix"), false, flatten(mvMatrix));
    gl.uniform1i( gl.getUniformLocation(program, "uSampler"), 0);
    
    var modelMatrixLoc = gl.getUniformLocation(program, "modelMatrix");

    // draw SUN
    gl.bindTexture(gl.TEXTURE_2D, whiteTexture);
    gl.uniformMatrix4fv( modelMatrixLoc, false, flatten(mat4()) );
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    // draw PLAYER
    gl.bindTexture(gl.TEXTURE_2D, whiteTexture);
    gl.uniformMatrix4fv( modelMatrixLoc, false, flatten(mat4()) );
    gl.drawArrays(gl.TRIANGLE_FAN, 4, 4);

    // draw FLOORS
    gl.bindTexture(gl.TEXTURE_2D, floorTexture);
    gl.uniformMatrix4fv( modelMatrixLoc, false, flatten(mat4()) );
    gl.drawArrays(gl.TRIANGLE_FAN, 8, 4);

    // draw WALLS
    walls.forEach(function(object){
        gl.uniformMatrix4fv( modelMatrixLoc, false, flatten(object.transformMatrix) );
        gl.bindTexture(gl.TEXTURE_2D, wallTexture);
        gl.drawArrays(gl.TRIANGLES, 12, 30);
    });
    move();

    requestAnimFrame(render);
}


