#version 330 compatibility

const float PI = 3.14159265;
const float TWOPI = 2.*PI;
const float e = 2.71828;

uniform float uA, uB, uC, uD, uE;
//uniform float uEta;

out vec3 vNs;
out vec3 vMC;
out vec3 vEC;
//out vec3 vRefractVector, vReflectVector;


void
main( )
{
	vMC = gl_Vertex.xyz;
	vec4 newVertex = gl_Vertex;
	newVertex.x +=1;
	newVertex.y+=1;
	newVertex.z = uA * ( cos( (TWOPI *uB*newVertex.x)+ uC ) * e * exp(-uD * newVertex.x) ) * (e * exp(-uE * newVertex.y));
	newVertex.y -=1;
	newVertex.x -=1;



	vec4 ECposition = gl_ModelViewMatrix * newVertex;
	vEC = ECposition.xyz;

	float dzdx = uA * ( -sin(TWOPI*uB*newVertex.x+uC)* TWOPI * uB * exp(-uD*newVertex.x)  +  cos(TWOPI*uB*newVertex.x+uC) * -uD * exp(-uD*newVertex.x) ) * ( exp(-uE*newVertex.y) );
	vec3 xtangent = vec3( 1., 0., dzdx );

	float dzdy =  uA * cos(TWOPI*uB*newVertex.x+uC) * exp(-uD*newVertex.x) * -uE * exp( -uE*newVertex.y );
	vec3 ytangent = vec3( 0., 1., dzdy );

	vec3 newNormal = normalize(  gl_NormalMatrix * cross( xtangent, ytangent )  );
	vNs = newNormal;
	gl_Position = gl_ModelViewProjectionMatrix * newVertex;
}
