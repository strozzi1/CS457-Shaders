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
uniform float uAlpha;

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
				
	float scale = newDist/ oldDist;			//new

	ds *= scale;								//new
	ds /= Ar;								//new

	dt *= scale;								//new
	dt /= Br;								//new


	float ellipse = (ds*ds) + (dt*dt);

	float d = smoothstep( 1. - uTol, 1. + uTol, ellipse);
	vec3 myColor = YELLOW;
	vec4 theColor = mix( vec4(WHITE, 1.), vec4(myColor, uAlpha), d );
	

	
	if(uAlpha==0){
		if (theColor.rgb == vec3(1.0,1.0,0.0)) 
			discard;
	}
	
	//gl_FragColor = mix( vec4(WHITE, 1.), vec4(myColor, uAlpha), d );
	

	//gl_FragColor = mix( vec4(WHITE, 1.), vColor, d );
	gl_FragColor=theColor;
	

	gl_FragColor.rgb *= vLightIntensity;	// apply lighting model
}

