#version 330 compatibility


out float vLightIntensity;
out vec2  vST;
out vec3 vMCposition;
out vec3 vECposition;
out vec3 normal;
out vec3 lightPos;
out vec3 eyePos;

uniform float uA;
uniform float uB;
uniform float uC;
uniform float uD;
uniform float uE;
uniform float uLightX, uLightY, uLightZ;



//const vec3 LIGHTPOS = vec3( 0., 0., 10. );
vec3 LIGHTPOS = vec3( uLightX, uLightY, uLightZ );

const float pi = 3.141592653589793;
const float e = 2.71828;

void
main( )
{	

	vec3 vert = gl_Vertex.xyz;
	vert.x +=1;
	vert.y +=1;
	vert.z = uA * ( cos( (2*pi *uB*vert.x)+ uC ) * e * exp(-uD * vert.x) ) * (e * exp(-uE * vert.y));
	vert.y -=1;
	vert.x -=1;
	//dzdx = A * [ -sin(2.*π*B*x+C) * 2.*π*B * exp(-D*x) + cos(2.*π*B*x+C) * -D * exp(-Dx) ] * [ exp(-E*y) ];
	float dzdx = uA * ( (-sin((2.*pi*uB*vert.x)+uC ) *2.*pi*uB*exp(-uD*vert.x)) + (cos((2.*pi*uB*vert.x)+uC ) *-uD* exp(-uD*vert.x))  ) * exp(-uE*vert.y);

	//dzdy = A * [ cos(2.*π*B*x+C) * exp(-D*x) ] * [ -E * exp(-E*y) ];
	float dzdy = uA * ( cos((2.*pi*uB*vert.x ) + uC) * exp(-uD*vert.x) ) * (-uE * exp(-uE*vert.y));

	vec3 Tx = vec3(1., 0., dzdx ); 
	vec3 Ty = vec3(0., 1., dzdy );
	normal = gl_NormalMatrix * normalize( cross( Tx, Ty ) );
	//vec3 tnorm = normalize( gl_NormalMatrix * gl_Normal );
	
	vECposition = ( gl_ModelViewMatrix * gl_Vertex ).xyz;
	lightPos = LIGHTPOS - vECposition;
	eyePos = vec3(0.,0.,0.) - vECposition;
	//vLightIntensity  = abs( dot( normalize(LIGHTPOS - vECposition), tnorm ) );
	vLightIntensity  = abs( dot( normalize(LIGHTPOS - vECposition), normal ) );		//frag shader should be taking care of light math
	vMCposition = gl_Vertex.xyz;					//this doesn't feel entirely necessary

	

	vST = gl_MultiTexCoord0.st;			//doesn't need to change
	
	gl_Position = gl_ModelViewProjectionMatrix * vec4(vert, 1.)/*gl_Vertex*/;  //don't change
}
