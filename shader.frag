#version 420

out vec4 f;
in vec4 gl_Color;
layout(size4x32) uniform image2D imageTexture;
uniform sampler2D imageSampler;
layout(binding=1) uniform sampler2D shadeMe;

float field(vec3 pos, float t) {
	const float sa = 338688.;
	const float maxi = 4294967296.;
	float inpartpos = mod(gl_Color.x, (sa * 2.0) / maxi) / ((sa * 2.0) / maxi);
	pos.z = (15.0 - pos.z) / 30.0;
	pos.x /= (720.0 / 1280.0);

	// Sphere
	float dist = length(pos) - (0.1 + sin(inpartpos * 3.41) * 1.3);

	// Box
	if(gl_Color.x > (338688.0 * 2.0) / 4294967296.0) {
		pos.x -= 0.6;
		pos.x += inpartpos;
		pos.y += inpartpos * 0.2;
		pos *= mat3(
			cos(t), sin(t), 0.0, 
			-sin(t), cos(t), 0.0, 
			0.0, 0.0, 1.0
		) * mat3(
			cos(t*0.3), 0.0, sin(t*0.3), 
			0.0, 1.0, 0.0, 
			-sin(t*0.3), 0.0, cos(t*0.3)
		);
		vec3 d = abs(pos) - vec3(0.3 + sin(max(inpartpos - 0.5, 0.0)));
		dist = min(max(d.x, max(d.y, d.z)), 0.0) + length(max(d, 0.0));
	}

	// Torus
	if(gl_Color.x > (sa * 4.0) / maxi) {
		vec2 q = vec2(length(pos.xz)-0.45,pos.y);
		dist = length(q)-0.5;
	}

	// Text
	if(gl_Color.x > (sa * 6.0) / maxi) {
		dist = length(pos) - (0.1 + sin(max(inpartpos - 0.5, 0.0) * 3.41) * 1.3);
	}

	if(gl_Color.x > (sa * 8.0) / maxi) {
		dist = 0.0;
	}

	return(dist);
}

void main() {
	float timemult = gl_Color.z * 10.0 - 5.0;
	float t = gl_Color.x * 3000.0 * 10.0;
	float ms = gl_Color.y * 3000.0 * timemult;
	float fade = gl_Color.w;
	vec2 v = gl_FragCoord.xy/vec2(1280., 720.);
	// f = vec4(texture(imageSampler, vec2(v.x, v.y)).g, v.x, v.y, 1.0);
	vec2 pd = vec2(0.001, 0.0);
	if(gl_FragCoord.y < 10) {
		vec4 old = texture(imageSampler, v.xy);
		vec4 new = old + vec4(sin(length(old.xy)) * ms * old.z + ms * (15.0 - old.z), cos(length(old.xy)) * ms * old.z, 0.0, 0.0);
		vec3 pos = new.xyz;
		vec2 displace = vec2(
			field(pos-pd.xyy, t) - field(pos+pd.xyy, t),
			field(pos-pd.yxy, t) - field(pos+pd.yxy, t)
		);
		if(field(pos, t) < 0.0) {
			new.xy -= normalize(displace) * ms * 8.0 * sign(timemult);
		}
		
		float fieldAccu = 0.0;
		for(float i = 0.0; i < 50.0; i += 1.0) {
			float fieldValue = field(pos + i * normalize(vec3(0.0, 0.0, 1.0) - pos) / 50.0, t);
			if(fieldValue < 0.0) {
				fieldAccu += 1.0;
			}
		}

		new.xy = mod(new.xy + vec2(1.0), 2.0) - vec2(1.0);
		new.w = fieldAccu / 50.0;
		imageStore(imageTexture, ivec2(gl_FragCoord.xy), new);
	}
	vec4 temp = clamp(vec4(v.y, v.y, v.y, 1.0) + texture(shadeMe, v.xy) * fade, 0.0, 1.0);
	float shadow = 1. - temp.r;
	float light = temp.r;
	vec4 shadowColor = vec4(70./255., 140./255., 255./255., 1.);
	vec4 lightColor = vec4(255./255., 200./255., 62./255., 1.);
	temp = mix(mix(temp, temp * shadowColor, shadow),
	mix(temp*lightColor, temp, light), light);
	f = temp;
} 