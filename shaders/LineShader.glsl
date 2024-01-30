// Created by inigo quilez - iq/2015
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.


// An attempt to find a way to compute the distance to a parametric curve p(t) that is
// better than linear search. In this case, I'm trying to measure curvature to concentrate
// the samples in highly curved areas.
//
// The shader switches between the linear search and the optimized version, showing how for the
// same amount of steps / complexity, the new method produces better results.
//
// I need to work on this more, I am not sure yet the right way to do this really, all I got was
// an intuition inspired by eiffie's shader https://www.shadertoy.com/view/4tfGRl.\
uniform float iTime;
uniform vec2 iResolution;

vec2 map(float t)
{
    return vec2(cos(t), sin(t));
}

float dot2( in vec2 v ) { return dot(v,v); }
float sdSqSegment( in vec2 p, in vec2 a, in vec2 b )
{
	vec2 pa = p - a, ba = b - a;
	return dot2( pa - ba*clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 ) );
}

float graph( vec2 p, bool doOptimized )
{
    float h = doOptimized ? 0.05 : 6.2831/70.0;
	float t = 0.0;
    
    vec2  a = map(t);
    float d = dot2( p - a );
    
    t += h;
    for( int i=0; i<72; i++ )
    {
        vec2  b = map(t);
        d = min( d, sdSqSegment( p, a, b ) );
        
		t += (doOptimized) ? clamp( 0.026*length(a-p)/length(a-b), 0.02, 0.1 ) : h;
        a = b;
	}
    
	return sqrt(d);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 p = (-iResolution.xy+2.0*fragCoord.xy)/iResolution.y;
    
    bool doOptimized = sin(90.0*iTime) < 2.0;

    float d = graph( p, doOptimized );
        
    vec3 col = vec3(0.9);
    //col *= 1.0 - 0.03*smoothstep(-0.3,0.3,d);
    col *= smoothstep(0.0, 0.01, d );
    //col *= 1.0 - 0.1*dot(p,p);

	fragColor = vec4( col, 1.0 );
}