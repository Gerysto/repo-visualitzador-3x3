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
    };
}

class Model {
    constructor() {
        this.materials = new Map();
        this.vertices = [];
        this.normals = [];
        this.faces = [];
    };

    async load(obj_url) {
        const response = await fetch(obj_url);
        if (!response.ok) {
            throw new Error('Failed to fetch from url:' + obj_url);
        }
        const contents = await response.text();

        let lines = contents.split("\n");
        let curr_mtl = "";

        for (let i = 0; i < lines.length; ++i) {
            const line = lines[i];
            var c;
            if (line.length <= 0) continue;
            else c = line[0];
            
            let arr = []; // Auxiliary array
            switch (c){
                case '#':
                    // comment -> ignore
                    break;
                case 'v':
                    switch (line[1]) {
                        case ' ':
                            arr = line.split(" ");
                            for (let j = 1; j < arr.length; ++j) {
                                let f = parseFloat(arr[j]);
                                if (arr[j] == ""){
                                    continue;
                                }
                                this.vertices.push(parseFloat(f));
                            }
                            break;
                        case 'n':
                            arr = line.split(" ");
                            for (let j = 1; j < arr.length; ++j) {
                                let f = parseFloat(arr[j]);
                                if (arr[j] == "")
                                    continue;
                                this.normals.push(parseFloat(f));
                            } 
                            break;
                        case 't':
                            // Not yet supported!!
                            break;
                        default:
                            // DO nothing!
                            break;
                    }
                    break;
                case 'f':
                    arr = line.split(" ");
                    let first = arr[1].indexOf("/");
                    if (first == -1) this.parseV(arr, curr_mtl);
                    
                    let second = arr[1].indexOf("/", first+1);
                    if (second == -1) this.parseVT(arr, curr_mtl);
                    if (second == first+1) this.parseVN(arr, curr_mtl);
                    else this.parseVTN(arr, curr_mtl);
                    break;
                case 'm': // Check for "mtllib"
                    arr = line.split(" ");
                    if (arr[0] == "mtllib") {
                        let url_mtl = arr[1];
                        await this.loadMaterials(url_mtl);
                    }
                    else {
                        // Not yet supported : (
                    }
                    break;
                case 'u': // Check for "usemtl"
                    arr = line.split(" ");
                    if (arr[0] == "usemtl") {
                        curr_mtl = arr[1];
                    }
                    else {
                        // Not yet supported : (
                    }
                    break;
                default: // ignore
                    break;
            }
        }
    };
    parseV(arr, curr_mtl) {
        let v = [];
        let n = [];
        let i = 0;
        while (i < 3) {
            v.push(parseInt(arr[i+1])-1);
            ++i;
        }
        let f = new Face(v,n,curr_mtl);
        this.faces.push(f);

        while (i < arr.length-1) {
            if (arr[i+1] == "") {
                ++i;
                continue;
            }
            v = [f.v[0], f.v[2], parseInt(arr[i+1])-1];
            f = new Face(v,n,curr_mtl);
            this.faces.push(f);
            ++i;
        }
    }

    parseVT(arr, curr_mtl) {
        let v = [];
        let n = [];
        let i = 0;
        while (i < 3) {
            let aux = arr[i+1].split("/");
            v.push(parseInt(aux[0])-1);
            ++i;
        }
        let f = new Face(v,n,curr_mtl);
        this.faces.push(f);

        while (i < arr.length-1) {
            if (arr[i+1] == "") {
                ++i;
                continue;
            }
            let aux = arr[i+1].split("/");
            v = [f.v[0], f.v[2], parseInt(aux[0])-1];
            f = new Face(v,n,curr_mtl);
            this.faces.push(f);
            ++i;
        }
    }

    parseVN(arr, curr_mtl) {
        let v = [];
        let n = [];
        let i = 0;
        while (i < 3) {
            let aux = arr[i+1].split("/");
            v.push(parseInt(aux[0])-1);
            n.push(parseInt(aux[2])-1);
            ++i;
        }
        let f = new Face(v,n,curr_mtl);
        this.faces.push(f);

        while (i < arr.length-1) {
            if (arr[i+1] == "") {
                ++i;
                continue;
            }
            let aux = arr[i+1].split("/");
            v = [f.v[0], f.v[2], parseInt(aux[0])-1];
            n = [f.n[0], f.n[2], parseInt(aux[2])-1]
            f = new Face(v,n,curr_mtl);
            this.faces.push(f);
            ++i;
        }
    }

    parseVTN(arr, curr_mtl) {
        let v = [];
        let n = [];
        let i = 0;
        while (i < 3) {
            let aux = arr[i+1].split("/");
            v.push(parseInt(aux[0])-1);
            // textures are not implemented yet!
            n.push(parseInt(aux[2])-1);
            ++i;
        }
        let f = new Face(v,n,curr_mtl);
        this.faces.push(f);

        while (i < arr.length-1) {
            let aux = arr[i+1].split("/");
            if (aux.length < 3 || parseInt(aux[0]).isNaN || parseInt(aux[2]).isNaN) {
                console.log("NaN value found!!");
                ++i;
                continue;
            }
            v = [f.v[0], f.v[2], parseInt(aux[0])-1];
            // textures are not implemented yet!
            n = [f.n[0], f.n[2], parseInt(aux[2])-1]
            f = new Face(v,n,curr_mtl);
            this.faces.push(f);
            ++i;
        }
    }
}

