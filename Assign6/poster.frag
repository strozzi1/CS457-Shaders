#version 330 compatibility

in vec4  vColor;
in float vLightIntensity;
in vec2  vST;
in vec3 vMCposition;

uniform float uAd;
uniform float uBd;
uniform float uTol;
uniform float uNoiseAmp;
uniform float uNoiseFreq;


uniform sampler3D Noise3;		//

const vec3 WHITE = vec3( 1., 1., 1. );
const vec3 YELLOW = vec3(1., 1., 0.); 

void
main( )
{
	//noise stuff
	vec4 nv = texture3D( Noise3, uNoiseFreq*vMCposition);
	float Noise = nv.r +nv.g +nv.b +nv.a; 	//1. ->3.
	Noise = Noise-2.;						//-1. -> 1.
	//Noise = (Noise - 1. )/ 2.;
	// my stuff
	float s = vST.s;
	float t = vST.t;

	float Ar = uAd/2;
	float Br = uBd/2;
	
	int numins = int(s/uAd);
	int numint = int(t/uBd);

	float scenter = float(numins) * uAd + Ar;
	float ds = s-scenter; 				//new: distance of s to scenter? wrt ellipse center
	float tcenter = float(numint) * uBd + Br;
	float dt = t - tcenter; 				//new: same but t ... wrt ellipse center

	float oldDist = sqrt (ds*ds + dt*dt);	//new
	float newDist = oldDist+ (Noise*uNoiseAmp);
				//new
	float scale = newDist/ oldDist;			//new

	ds*= scale;								//new
	ds /=Ar;								//new

	dt *=scale;								//new
	dt /= Br;								//new


	float ellipse = ( ((ds-scenter)/Ar) * ((ds-scenter)/Ar) ) +
					( ((dt-tcenter)/Br) * ((dt-tcenter)/Br) );

	float de = ds*ds +dt*dt;
	float d = smoothstep( 1. - uTol, 1. + uTol, ellipse);
	gl_FragColor = mix( vec4(WHITE, 1.), vColor, de );
}

