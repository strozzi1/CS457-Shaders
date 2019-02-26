#version 330 compatibility


in float vLightIntensity;
in vec2  vST;
in vec3 vMCposition;
in vec3 vECposition;
in vec3 normal;
in vec3 lightPos;
in vec3 eyePos;

uniform float uA; 
uniform float uB;                      
uniform float uC; 
uniform float uD; 
uniform float uE; 
uniform float uNoiseAmp;  		
uniform float uNoiseFreq; 
uniform float uKa, uKd, uKs; 

uniform float uShininess; 		//self explained

//uniform float uLightX, uLightY, uLightZ;		//position of light
uniform vec4 uColor, uSpecularColor; 	//

uniform sampler3D Noise3;		//

const vec3 WHITE = vec3( 1., 1., 1. );
const vec3 YELLOW = vec3( 1., 1., 0.); 

vec3 RotateNormal(float, float, vec3);

void
main( )
{
    vec3 Normal = normalize(normal);                            //normal
    vec3 Light = normalize(lightPos);                           //light position
    vec3 Eye = normalize(eyePos); //eye position
    vec4 Ambient = uKa * uColor;                                //ambient color



	vec4 nvx = texture( Noise3, uNoiseFreq*vMCposition );
	float angx = nvx.r + nvx.g + nvx.b + nvx.a  -  2.;
	angx *= uNoiseAmp;
    vec4 nvy = texture( Noise3, uNoiseFreq*vec3(vMCposition.xy,vMCposition.z+0.5) );
	float angy = nvy.r + nvy.g + nvy.b + nvy.a  -  2.;
	angy *= uNoiseAmp;
    
    vec3 newNormal = RotateNormal(angx, angy, Normal);

    //float d = max (dot(Normal, Light), 0.);
    float d = max(dot(newNormal, Light), 0.);
    vec4 diffuse = uKd * d * uColor;
    float s = 0.;

    /*if(dot(Normal, Light) > 0.){
        vec3 reflection = normalize( 2. * Normal * dot(Normal,Light) - Light );
		s = pow( max( dot(Eye,reflection),0. ), uShininess );
    }*/
    if(dot(newNormal, Light) > 0.){
        vec3 reflection = normalize( 2. * newNormal * dot(newNormal,Light) - Light );
		s = pow( max( dot(Eye,reflection),0. ), uShininess );
    } 

    vec4 specular = uKs * s * uSpecularColor;




	gl_FragColor = vec4(Ambient.rgb + diffuse.rgb + specular.rgb, 1.);

	//gl_FragColor.rgb *= vLightIntensity;	// apply lighting model
}

vec3
RotateNormal( float angx, float angy, vec3 n )
{
        float cx = cos( angx );
        float sx = sin( angx );
        float cy = cos( angy );
        float sy = sin( angy );

        // rotate about x:
        float yp =  n.y*cx - n.z*sx;    // y'
        n.z      =  n.y*sx + n.z*cx;    // z'
        n.y      =  yp;
        // n.x      =  n.x;

        // rotate about y:
        float xp =  n.x*cy + n.z*sy;    // x'
        n.z      = -n.x*sy + n.z*cy;    // z'
        n.x      =  xp;
        // n.y      =  n.y;

        return normalize( n );
}