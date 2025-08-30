#version 300 es

precision highp float;

in vec3 f_vertex;
in vec3 f_normal;
in vec3 f_matamb;
in vec3 f_matdiff;
in vec3 f_matspec;
in float f_matshin;

out vec4 FragColor;

void main() {
    FragColor = vec4(f_matdiff,1.0);
}