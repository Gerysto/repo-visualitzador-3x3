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

function resizeCanvasToDisplaySize(canvas) {
    const dpr = window.devicePixelRatio || 1;
    const displayWidth = Math.floor(canvas.clientWidth * dpr);
    const displayHeight = Math.floor(canvas.clientHeight * dpr);

    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        return true;
    }
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
    resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0,0,gl.canvas.width,gl.canvas.height);
    console.log(gl.canvas.width, gl.canvas.height);
    // Get attribute locations:
    let vertexLoc = gl.getAttribLocation(g.program, "vertex");
    console.log("Vertex loc = " + vertexLoc);

    // Create and fill-in the buffers
    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    let vertices = [
        0,0,0,
        1,0,0,
        1,1,0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    
    // set up the VAO 
    let vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(vertexLoc);

    // Specify how to read the data:
    gl.vertexAttribPointer(vertexLoc, 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}