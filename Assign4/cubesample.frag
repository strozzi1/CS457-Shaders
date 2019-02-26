#version 330 compatibility

uniform sampler3D	Noise3;
uniform float		uNoiseAmp;
uniform float		uNoiseFreq;
uniform bool		uNoiseWrong;
uniform float		uEta;			//index of refraction
uniform float		uMix;

uniform samplerCube	uReflectUnit;
uniform samplerCube	uRefractUnit;

in vec3 vNs;
in vec3 vMC;
in vec3 vEC;


vec3
RotateNormal( float angx, float angy, vec3 n )
{
	float cx = cos( angx );
	float sx = sin( angx );
	float cy = cos( angy );
	float sy = sin( angy );
	
	// rotate about x:
	float yp =  n.y*cx - n.z*sx;	// y'
	n.z      =  n.y*sx + n.z*cx;	// z'
	n.y      =  yp;
	// n.x      =  n.x;

	// rotate about y:
	float xp =  n.x*cy + n.z*sy;	// x'
	n.z      = -n.x*sy + n.z*cy;	// z'
	n.x      =  xp;
	// n.y      =  n.y;

	return normalize( n );
}


void
main( )
{
	vec3 WHITE = vec3( 1.,1.,1. );
	vec3 Normal = normalize(vNs);
	vec4 nvx = texture( Noise3, uNoiseFreq*vMC );
	float angx = nvx.r + nvx.g + nvx.b + nvx.a  -  2.;
	angx *= uNoiseAmp;

	vec4 nvy = texture( Noise3, uNoiseFreq*vec3(vMC.xy,vMC.z+0.5) );
	float angy = nvy.r + nvy.g + nvy.b + nvy.a  -  2.;
	angy *= uNoiseAmp;


	Normal = normalize( RotateNormal( angx, angy, Normal ) );

	vec3 reflectVector = reflect( vEC, Normal );
	vec3 reflectcolor = textureCube(uReflectUnit, reflectVector ).rgb;
	vec3 refractVector = refract( vEC, Normal, uEta );
	vec3 refractcolor = textureCube( uRefractUnit, refractVector ).rgb;

	refractcolor = mix( refractcolor, WHITE, 0.30 );
	gl_FragColor = vec4( mix( reflectcolor, refractcolor, uMix ),  1. );
}
