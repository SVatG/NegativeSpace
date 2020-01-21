/* File generated with Shader Minifier 1.1.4
 * http://www.ctrl-alt-test.fr
 */
#ifndef SHADER_CODE_2_H_
# define SHADER_CODE_2_H_

const char *shader_2_frag =
 "#version 420\n"
 "out vec4 f;"
 "in vec4 gl_Color;"
 "void main()"
 "{"
   "float v=1.-2.*length(gl_PointCoord.xy-vec2(.5)),g=v*.25/(gl_Color.x+1.);"
   "f=vec4(g,g,v*.25,v);"
 "}";

#endif // SHADER_CODE_2_H_
