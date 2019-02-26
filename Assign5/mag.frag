#version 330 compatibility

uniform sampler2D ImageUnit;
uniform float uScenter, uTcenter;   //Center of magic lense rect
//uniform float uDs, uDt;             //dimensions of magic lense rect
uniform float uRad;

uniform float uMagFactor;           //how much we zoom
uniform float uRotAngle;            //in radians
uniform float uSharpFactor;         //for sharpening



const float PI = 3.14159265;
const float PI_OVER_4 = PI/4.;
const float SIN_PI_OVER_4 = 0.707;

in vec2	vST;

float	 ResS, ResT;		// texture size

void
main( )
{
	vec2 st = vST;
    vec3 irgb = texture2D( ImageUnit,  st ).rgb;
    
    /*float sLbound=(uScenter-uDs);
    float sRbound=(uScenter+uDs);
    float tUBound =(uTcenter +uDt);
    float tDbound = (uTcenter -uDt);*/

    //opposite and adjacent lines from lense center
    float distS = vST.s -uScenter;
    float distT = vST.t - uTcenter;
    //a^2 + b^2
    float dist = (distS * distS) + (distT*distT);



    // if ( ((st.s > sLbound) && (st.s < sRbound)) && ((st.t < tUBound) &&(st.t > tDbound) )  ) {
    if (dist <= (uRad * uRad) ) {
        //irgb =texture2D( ImageUnit,  st ).rgb;
        
        //rotate with respect center of lense
        float ds = st.s -uScenter;
        float dt = st.t -uTcenter;


        //Rotation
        st.s = (ds*cos(uRotAngle)) + (dt*sin(uRotAngle));
        st.t = (-ds*sin(uRotAngle)) + (dt*cos(uRotAngle));
        
        //magnify
        st.s /=uMagFactor;
        st.t /=uMagFactor;


        //bring st origin back from rotational origin
        st.s +=uScenter;
        st.t +=uTcenter;

        // from notes
        ivec2 ires = textureSize(ImageUnit, 0);
        float ResS = float(ires.s);
        float ResT = float(ires.t);

        vec2 stp0 = vec2(1. / ResS, 0.);
        vec2 st0p = vec2(0., 1. / ResT);
        vec2 stpp = vec2(1. / ResS, 1. / ResT);
        vec2 stpm = vec2(1. / ResS, -1. / ResT);

        vec3 i00    = texture2D( ImageUnit, st ).rgb;
        vec3 im1m1  = texture2D( ImageUnit, st - stpp ).rgb;
        vec3 ip1p1  = texture2D( ImageUnit, st + stpp ).rgb;
        vec3 im1p1  = texture2D( ImageUnit, st - stpm ).rgb;
        vec3 ip1m1  = texture2D( ImageUnit, st + stpm ).rgb;
        vec3 im10   = texture2D( ImageUnit, st - stp0 ).rgb;
        vec3 ip10   = texture2D( ImageUnit, st + stp0 ).rgb;
        vec3 i0m1   = texture2D( ImageUnit, st - st0p ).rgb;
        vec3 i0p1   = texture2D( ImageUnit, st + st0p ).rgb;

        vec3 target = vec3(0., 0., 0.);
        target += 1.* (im1m1 + ip1m1 + ip1p1 + im1p1);
        target += 2.* (im10 + ip10 + i0m1 + i0p1);
        target += 4. * (i00);
        target /= 16.;




        
        irgb = texture2D(ImageUnit, st).rgb;
        gl_FragColor = vec4(mix(target, irgb, uSharpFactor), 1.);

    }
    else{
        gl_FragColor = vec4(irgb, 1.);
    }
}