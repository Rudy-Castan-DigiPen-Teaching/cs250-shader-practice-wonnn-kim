#version 300 es

precision mediump float;

/**
 * \file
 * \author Won Kim
 * \date 2025 Spring
 * \par CS250 Computer Graphics II
 * \copyright DigiPen Institute of Technology
 */

 out vec4 FragColor;

 uniform vec2 u_resolution;
 uniform vec2 u_mouse;
 uniform float u_time;

 const int NUM_CIRCLES = 20;

// Convert pixel coords to normalized coords
 vec2 to_coord(vec2 pixel_point)
 {
    vec2 point = pixel_point / u_resolution;
    if(u_resolution.x > u_resolution.y)
    {
        // wide not tall
        // height is going to between 0-1
        // width is going to be expanded, larger than 0-1
        point.x *= u_resolution.x / u_resolution.y;
        // now to recenter the range
        point.x += (u_resolution.y - u_resolution.x) / (u_resolution.x);
    }
    else
    {
        point.y *= u_resolution.y / u_resolution.x;
        point.y += (u_resolution.x - u_resolution.y) / u_resolution.y;
    }

    return point;
 }

 float sCircle(vec2 point, vec2 center, float radius)
 {
    float d = distance(point, center);
    return d - radius;
 }

 // return 0 not in circle, 1 in circle
 float circle(vec2 point, vec2 center, float radius)
 {
    float sd = sCircle(point, center, radius);
    // return 1.0 - step(0., sd);
    float E = fwidth(sd);
    return 1. - smoothstep(-E, E, sd);
 }

/*
 float flipping_circle(vec2 point, vec2 center, float radius)
 {
    float sd = sCircle(point, center, radius);
    // return 1.0 - step(0., sd);
    float E = fwidth(sd);
    float circle_alpha = 1. - smoothstep(-E, E, sd);

    float flip = sin(u_time * 2.0) * 0.5 + 0.5;

    return circle_alpha * flip;
 }
*/

 void main(void)
 {
   vec2 position = to_coord(gl_FragCoord.xy);
   vec3 color = vec3(0.1686, 0.1647, 0.2235);

   //vec2 p = vec2(cos(u_time), sin(u_time)) * 0.5 + vec2(0.5);

   vec2 first = vec2( 0.3 * sin(u_time * 0.5), 0.1 * cos(u_time * 0.5)) + vec2(0.5);

   for (int i = 0; i < NUM_CIRCLES; ++i) 
   {

      float t = float(i) * 0.2;

      float x = first.x + 0.01 * float(i) * sin(u_time * 2.0 - t * 2.0);
      float y = first.y + 0.01 * float(i) * cos(u_time * 2.5 - t * 2.0);

      vec2 segment_pos = vec2(x, y);
      float seg = circle(position, segment_pos, 0.03);

      vec3 seg_color = mix(vec3(0.9608, 1.0, 0.2196), vec3(0.0784, 0.2157, 0.4431), float(i) / float(NUM_CIRCLES));
      color = mix(color, seg_color, seg);
   }
   FragColor = vec4(color, 1.0);
 }