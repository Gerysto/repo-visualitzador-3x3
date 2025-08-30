g = {};

async function start() {
    let canvas = document.getElementById("c");
    let gl = canvas.getContext("webgl2");
    if (!gl) {
        throw new Error("Failed to start WebGL!");
    }
    
    g.program = await loadShaders(gl);
    initialize(gl);
}

function resizeCanvasToDisplaySize(gl) {
    const canvas = gl.canvas;
    const dpr = window.devicePixelRatio || 1;
    const displayWidth = Math.floor(canvas.clientWidth * dpr);
    const displayHeight = Math.floor(canvas.clientHeight * dpr);

    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        return true;
    }


    projectTransform(gl);
    viewTransform(gl);
    return false;
}

async function loadShaders(gl) {
    // Setup the program (vertex + fragment shaders)
    let vertShaderSource = await getShaderSource("shaders/shader.vert");
    let fragShaderSource = await getShaderSource("shaders/shader.frag");

    let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertShaderSource);
    let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragShaderSource);

    let program = createProgram(gl,vertexShader,fragmentShader);
    gl.useProgram(program);
    
    return program;
}

function initialize(gl) {
    
    // Set viewport size:
    resizeCanvasToDisplaySize(gl);
    gl.viewport(0,0,gl.canvas.width,gl.canvas.height);
    console.log(gl.canvas.width, gl.canvas.height);

    // Get attribute locations:
    g.vertexLoc = gl.getAttribLocation(g.program,  "vertex");
    g.normalLoc = gl.getAttribLocation(g.program,  "normal");
    g.matambLoc = gl.getAttribLocation(g.program,  "matamb");
    g.matdiffLoc = gl.getAttribLocation(g.program, "matdiff");
    g.matspecLoc = gl.getAttribLocation(g.program, "matspec");
    g.matshinLoc = gl.getAttribLocation(g.program, "matshin");
    g.TGLoc = gl.getUniformLocation(g.program, "TG");
    g.VMLoc = gl.getUniformLocation(g.program, "VM");
    g.PMLoc = gl.getUniformLocation(g.program, "PM");
    g.NMLoc = gl.getUniformLocation(g.program, "NM"); // normal matrix

    console.log("Attribute vertexLoc = "+   g.vertexLoc);
    console.log("Attribute normalLoc = "+ g.normalLoc);
    console.log("Attribute matambLoc = "+  g.matambLoc);
    console.log("Attribute matdiffLoc = "+ g.matdiffLoc);
    console.log("Attribute matspecLoc = "+ g.matspecLoc);
    console.log("Attribute matshinLoc = "+ g.matshinLoc);


    // set up the VAO and store model data in g
    const url = "Patricio.obj";
    let model_data = {};
    createBuffersModel(gl, model_data, url);
    storeBoundingBoxData(model_data);


    projectTransform(gl);
    viewTransform(gl);

    drawModel(gl, model_data);
}

function drawModel(gl, model_data) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    modelTransform(gl, model_data);
    gl.bindVertexArray(model_data.vao);
    gl.drawArrays(gl.TRIANGLES, 0, model_data.vertices.length/3);
}

function projectTransform(gl) {
    let canvas = document.getElementById("c");
    let width = canvas.clientWidth;
    let height = canvas.clientHeight;

    g.PM = new J3DIMatrix4();
    let fov = 30;
    let ra = width/height;
    let z_near = 1;
    let z_far = 100;
    g.PM.perspective(fov, ra, z_near, z_far);
    g.PM.setUniform(gl, g.PMLoc, false);
}

function viewTransform(gl) {
    const d = 20;
    const angleX = 30.0;
    const angleY = 0.0;
    const angleZ = 0.0;

    // Using Euler angles: 
    g.VM = new J3DIMatrix4();
    g.VM.translate(0,0,-d);
    g.VM.rotate(-angleZ, 0,0,1);
    g.VM.rotate( angleX, 1,0,0);
    g.VM.rotate(-angleY, 0,1,0);
    g.VM.translate(0,0,0); // -vrp
    g.VM.setUniform(gl, g.VMLoc, false);
}

function modelTransform(gl, model_data) {
    let scale_factor = 5.0/model_data.height;
    let x_trans = -model_data.center.x;
    let y_trans = -model_data.center.y;
    let z_trans = -model_data.center.z;
    model_data.TG = new J3DIMatrix4();
    model_data.TG.scale(scale_factor, scale_factor, scale_factor);
    model_data.TG.translate(x_trans, y_trans, z_trans);
    model_data.TG.setUniform(gl, g.TGLoc, false);

    // Normal Matrix:
    model_data.NM = new J3DIMatrix4();
    model_data.NM.load(g.VM);
    model_data.NM.multiply(model_data.TG);
    model_data.NM.transpose();
    model_data.NM.invert();
    model_data.NM.setUniform(gl, g.NMLoc, false);
}

// Stores the bounding box, height, center and baseCenter in m
function storeBoundingBoxData(m) {
    let minX, minY, minZ, maxX, maxY, maxZ;
    minX = minY = minZ = 1e100;
    maxX = maxY = maxZ = -1e100;

    for (let i = 0; i < m.vertices.length; i+=3) {
        minX = Math.min(minX, m.vertices[i]);
        minY = Math.min(minY, m.vertices[i+1]);
        minZ = Math.min(minZ, m.vertices[i+2]);

        maxX = Math.max(maxX, m.vertices[i]);
        maxY = Math.max(maxY, m.vertices[i+1]);
        maxZ = Math.max(maxZ, m.vertices[i+2]);
    }
    m.height = maxY - minY;

    m.boundinBox = {
        minX: minX,
        minY: minY,
        minZ: minZ,
        maxX: maxX,
        maxY: maxY,
        maxZ: maxZ
    };
    m.center = {
        x: (minX+maxX)/2.0,
        y: (minY+maxY)/2.0,
        z: (minZ+maxZ)/2.0
    };
    m.baseCenter = {
        x: (minX+maxX)/2.0,
        y: minY,
        z: (minZ+maxZ)/2.0
    };
}

// Creates and fills the requiered Web-GL buffers to render the model.
// Returns the model's VAO (vertex array object)
function createBuffersModel(gl, m, url) {
    vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    model = new Model();

    model.load(url);
    // Create and fill-in the buffers
    m.vertices = model.get_VBO_vertices();
    m.normals = model.get_VBO_normals();
    m.matamb = model.get_VBO_matamb();
    m.matdiff = model.get_VBO_matdiff();
    m.matspec = model.get_VBO_matspec();
    m.matshin = model.get_VBO_matshin();

    // Vertex buffer: 
    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(m.vertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(g.vertexLoc);
    gl.vertexAttribPointer(g.vertexLoc, 3, gl.FLOAT, false, 0, 0);
    
    // Normals buffer: 
    let normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(m.normals), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(g.normalLoc);
    gl.vertexAttribPointer(g.normalLoc, 3, gl.FLOAT, false, 0, 0);

    // Ambient material parameter buffer: 
    let matambBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, matambBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(m.matamb), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(g.matambLoc);
    gl.vertexAttribPointer(g.matambLoc, 3, gl.FLOAT, false, 0, 0);
        
    // Diffuse material parameter buffer: 
    let matdiffBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, matdiffBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(m.matdiff), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(g.matdiffLoc);
    gl.vertexAttribPointer(g.matdiffLoc, 3, gl.FLOAT, false, 0, 0);
    
    // Specular material parameter buffer: 
    let matspecBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, matspecBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(m.matspec), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(g.matspecLoc);
    gl.vertexAttribPointer(g.matspecLoc, 3, gl.FLOAT, false, 0, 0);
    
    
    // shinyness material parameter buffer: 
    let matshinBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, matshinBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(m.matshin), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(g.matshinLoc);
    gl.vertexAttribPointer(g.matshinLoc, 1, gl.FLOAT, false, 0, 0);
    
    gl.bindVertexArray(null);
    m.vao = vao;
}