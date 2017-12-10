//uniform vec2 center;
//uniform float scale;

varying vec2 vUV;

void main() {
    vec2 z, c;
    int iter = 100;
    float scale = 1.0/1.0;
    vec2 center = vec2(0.5, 0.5);

    c.x = 1.3333 * (vUV.x - 0.5) * scale - center.x;
    c.y = (vUV.y - 0.5) * scale - center.y;

    int i;
    z = c;
    for(i=0; i<iter; i++) {
        float x = (z.x * z.x - z.y * z.y) + c.x;
        float y = (z.y * z.x + z.x * z.y) + c.y;

        if((x * x + y * y) > 4.0) break;
        z.x = x;
        z.y = y;
    }

    //gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
    if(i == iter)
        discard;
    gl_FragColor = vec4(0.0, 0.0, i == iter ? 0.0 : float(i) / 100.0, 1.0);
}
