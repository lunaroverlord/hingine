// #vertex

// #group Camera

// Use this to adjust clipping planes

uniform vec2 Center;
uniform float  Zoom;

uniform vec2 pixelSize;

uniform mat4 worldViewProjection;
uniform mat4 projection;

// Attributes
attribute vec3 position;
attribute vec2 uv;

varying vec2 coord;
varying vec2 aaScale;
varying vec2 viewCoord;


//// #vertex
//
//// #group Camera
//
//// Use this to adjust clipping planes
//
//uniform vec2 Center;
//uniform float  Zoom;
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
//	viewCoord = (gl_Vertex).xy;
//	coord = (((gl_ProjectionMatrix*gl_Vertex).xy*vec2(ar,1.0))/Zoom+  Center);
//	aaScale = vec2(gl_ProjectionMatrix[0][0],gl_ProjectionMatrix[1][1])*pixelSize/Zoom;
//}
//
// #endvertex


void main(void)
{
	float ar = pixelSize.y/pixelSize.x;
	gl_Position = (worldViewProjection * vec4(position, 1.0));
	viewCoord = uv;
	coord = (((projection*vec4(position, 1.0)).xy*vec2(ar,1.0))/Zoom+  Center);
	aaScale = vec2(projection[0][0],projection[1][1])*pixelSize/Zoom;
}

//#endvertex
