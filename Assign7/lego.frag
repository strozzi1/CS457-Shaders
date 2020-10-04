#version 400


in float gLightIntensity;

//const vec3 COLOR = vec3( 1., 1., 0. );
uniform vec3 uColor;

void
main( )
{
	gl_FragColor = vec4( gLightIntensity * uColor.xyz, 1. );
}
