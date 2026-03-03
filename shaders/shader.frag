#version 300 es

precision highp float;

in vec3 vertexSCO;
in vec3 normalSCO;
in vec3 f_matamb;
in vec3 f_matdiff;
in vec3 f_matspec;
in float f_matshin;

out vec4 FragColor;

vec3 lightCol = vec3(1.0,1.0,1.0);
vec3 lightPos = vec3(0,0,0);
vec3 amb = vec3(0.1, 0.1, 0.1);

vec3 ambient() {
    return f_matamb*amb;
}
vec3 diffuse(vec3 L, vec3 norm) {
    return lightCol*f_matdiff*vec3(min(max(dot(norm,L),0.0),1.0));
}
vec3 specular(vec3 L, vec3 vertexSCO) {
    vec3 R = 2.0*dot(normalSCO,L)*normalSCO - L;
    vec3 v = normalize(vertexSCO);
    return lightCol*f_matspec*min(max(pow(dot(-v,R),f_matshin),0.0),1.0);
}


void main() {

    vec3 col, L, n;
    n = normalize(normalSCO);
    L = normalize(lightPos - vertexSCO.xyz);

    col += ambient();
    col += diffuse(L, n);
    col += specular(L, vertexSCO.xyz);
    //col = f_matdiff;
    //if (col.r > 0.6 && col.g > 0.01 && col.g < 0.2 && col.b < 0.01 ) col.g = 0.3;

    FragColor = vec4(col,1.0);
}