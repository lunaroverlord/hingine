#define highp
#define mediump
#define lowp
// A very simple example of video feedback systems.
// Change to Continuous.
// #buffer RGBA32F
// #donotrun

// This is a utlity program for setting
// up anti-aliased 2D rendering.

//// #vertex
//
//// #group Camera
//
//// Use this to adjust clipping planes
//
//uniform vec2 Center;
//uniform float Zoom;
//uniform float AntiAliasScale;
//
//
//uniform vec2 pixelSize;
//
//varying vec2 coord;
//varying vec2 aaScale;
//varying vec2 viewCoord;
//
//void main(void)
//{
//	float ar = pixelSize.y/pixelSize.x;
//	gl_Position =  gl_Vertex;
//	viewCoord = (gl_ProjectionMatrix*gl_Vertex).xy;
//	coord = (((gl_ProjectionMatrix*gl_Vertex).xy*vec2(ar,1.0))/Zoom+  Center);
//	aaScale = vec2(gl_ProjectionMatrix[0][0],gl_ProjectionMatrix[1][1])*pixelSize*AntiAliasScale/Zoom;
//}
//
// #endvertex


varying vec2 coord;
varying vec2 aaScale;
varying vec2 viewCoord;
vec2 aaCoord;
uniform vec2 pixelSize;

// Anti-alias [1=1 samples / pixel, 2 = 4 samples, ...]
uniform int AntiAlias;

vec3 color(vec2 z) ;

vec3 getColor2Daa(vec2 z) {
	vec3 v = vec3(0.0,0.0,0.0);
	float d = 1.0/float(AntiAlias);
	vec2 ard = vec2(pixelSize.x,pixelSize.y)*d;
	for (int x=0; x <AntiAlias;x++) {
		for (int y=0; y <AntiAlias;y++) {
		       aaCoord = (viewCoord + vec2(x,y)*ard);
			v +=  color(z+vec2(x,y)*d*aaScale);
             }
	}
	
	return v/(float(AntiAlias*AntiAlias));
}

#ifdef providesInit
void init(); // forward declare
#endif

void fragmentariumMain() {
#ifdef providesInit
	init(); 
#endif
	gl_FragColor = vec4(getColor2Daa(coord.xy),1.0);
}


// #group default
#define DontClearOnChange
#define IterationsBetweenRedraws 10
// #group post
uniform float Gamma;
uniform bool ExponentialExposure;
uniform float Exposure;
uniform float Brightness;
uniform float Contrast;
uniform float Saturation;

uniform float AARange;
uniform float AAExp;
uniform bool GaussianAA;

// #group IFS
uniform sampler2D backbuffer;
uniform float time;

vec2 pos = (viewCoord*1.0+vec2(1.0))/2.0;

float rand(vec2 co){
	// implementation found at: lumina.sourceforge.net/Tutorials/Noise.html
	return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

uniform float inNoise;
vec3  sample(vec2 p) {
	if (p.x > 1.0 || p.y>1.0) return vec3(0.0);
	if (p.x < 0.0 || p.y< 0.0) return vec3(0.0);
	vec3 v1 = texture2D( backbuffer, p ).xyz*0.8;
	v1+= vec3(inNoise*vec3(p,1.0));
	return v1;
	
}

uniform float BIAS;
uniform float BIAS2;

uniform vec4 M1;
mat2 mM1 = mat2(M1.x,M1.y,M1.z,M1.w);
uniform vec2 O1;
uniform vec4 M2;
mat2 mM2 = mat2(M2.x,M2.y,M2.z,M2.w);
uniform vec2 O2;
uniform vec4 M3;
mat2 mM3 =mat2(M3.x,M3.y,M3.z,M3.w);
uniform vec2 O3;
uniform vec2 v2;
vec3 color(vec2 z) {
	vec3 v = sample(pos);
	vec3 v2 =sample( pos*mM1-O1+v2/2.0)+
	sample(pos*mM2-O2+v2/2.0)+
	sample(pos*mM3-O3+v2/2.0);
	v = v*BIAS+v2*BIAS2;
	return v*BIAS;
}



// #group default

void main() { fragmentariumMain(); }
