class Material {
    constructor(Ka, Kd, Ks, Ns) {
        this.Ka = Ka;
        this.Kd = Kd;
        this.Ks = Ks;
        this.Ns = Ns;
    };
}

class Face {
    constructor(v, n, m) {
        this.vertices = v;
        this.normals = n;
        this.material = m;
    }
}

class Model {
    constructor() {
        this.materials = new Map();
        this.vertices = [];
        this.normals = [];
        this.faces = [];
    }
}