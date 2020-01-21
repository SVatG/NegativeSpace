#version 420

out vec4 f;
in vec4 gl_Color;

void main() {
	float radius = 1.0 - 2.0 * length(gl_PointCoord.xy - vec2(0.5));
	float shaded = radius*0.25 / (gl_Color.r + 1.0);
	f = vec4(shaded, shaded, radius*0.25, radius);
}