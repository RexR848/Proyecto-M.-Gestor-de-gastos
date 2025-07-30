const body = document.body;
const colorPickerContainer = document.getElementById("color-picker-container");
const colorPicker = document.getElementById("colorPicker");

function setTheme(theme) {
  body.classList.remove("dark-theme", "light-theme", "custom-theme");
  if (theme === "custom") {
    body.classList.add("custom-theme");
    colorPickerContainer.classList.remove("hidden");
  } else {
    body.classList.add(theme + "-theme");
    colorPickerContainer.classList.add("hidden");
  }
}

colorPicker.addEventListener("input", () => {
  const pickedColor = colorPicker.value;
  document.documentElement.style.setProperty("--accent-color", pickedColor);
});

setTheme("dark");

const canvas = document.getElementById("shader-bg");
const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
}
resize();
window.addEventListener("resize", resize);

const fragmentShaderSrc = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
out vec4 fragColor;
#define FXAA_SPAN_MAX 8.0
#define FXAA_REDUCE_MUL (1.0/FXAA_SPAN_MAX)
#define FXAA_REDUCE_MIN (1.0/128.0)
#define FXAA_SUBPIX_SHIFT (1.0/4.0)
vec3 FxaaPixelShader(vec4 uv, sampler2D tex, vec2 rcpFrame) {
  vec3 rgbNW = textureLod(tex, uv.zw, 0.0).xyz;
  vec3 rgbNE = textureLod(tex, uv.zw + vec2(1.0,0.0)*rcpFrame.xy, 0.0).xyz;
  vec3 rgbSW = textureLod(tex, uv.zw + vec2(0.0,1.0)*rcpFrame.xy, 0.0).xyz;
  vec3 rgbSE = textureLod(tex, uv.zw + vec2(1.0,1.0)*rcpFrame.xy, 0.0).xyz;
  vec3 rgbM = textureLod(tex, uv.xy, 0.0).xyz;
  vec3 luma = vec3(0.299, 0.587, 0.114);
  float lumaNW = dot(rgbNW, luma);
  float lumaNE = dot(rgbNE, luma);
  float lumaSW = dot(rgbSW, luma);
  float lumaSE = dot(rgbSE, luma);
  float lumaM = dot(rgbM, luma);
  float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));
  float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));
  vec2 dir;
  dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));
  dir.y = ((lumaNW + lumaSW) - (lumaNE + lumaSE));
  float dirReduce = max((lumaNW + lumaNE + lumaSW + lumaSE) * (0.25 * FXAA_REDUCE_MUL), FXAA_REDUCE_MIN);
  float rcpDirMin = 1.0/(min(abs(dir.x), abs(dir.y)) + dirReduce);
  dir = min(vec2(FXAA_SPAN_MAX), max(vec2(-FXAA_SPAN_MAX), dir * rcpDirMin)) * rcpFrame.xy;
  vec3 rgbA = (1.0/2.0) * (
      textureLod(tex, uv.xy + dir * (1.0/3.0 - 0.5), 0.0).xyz +
      textureLod(tex, uv.xy + dir * (2.0/3.0 - 0.5), 0.0).xyz);
  vec3 rgbB = rgbA * (1.0/2.0) + (1.0/4.0) * (
      textureLod(tex, uv.xy + dir * (0.0/3.0 - 0.5), 0.0).xyz +
      textureLod(tex, uv.xy + dir * (3.0/3.0 - 0.5), 0.0).xyz);
  float lumaB = dot(rgbB, luma);
  if((lumaB < lumaMin) || (lumaB > lumaMax)) return rgbA;
  return rgbB;
}
void main() {
  vec2 fragCoord = gl_FragCoord.xy;
  vec2 rcpFrame = 1.0 / iResolution.xy;
  vec2 uv2 = fragCoord.xy / iResolution.xy;
  vec4 uv = vec4(uv2, uv2 - (rcpFrame * (0.5 + FXAA_SUBPIX_SHIFT)));
  vec3 col = FxaaPixelShader(uv, iChannel0, rcpFrame);
  col = pow(col * 0.5, vec3(1.3));
  col *= 1.0 - abs(sin(fragCoord.y * 0.8)) * 0.4;
  fragColor = vec4(col, 1.0);
}
`;

const vertexShaderSrc = `#version 300 es
in vec4 a_position;
void main() {
  gl_Position = a_position;
}
`;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl, vShader, fShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vShader);
  gl.attachShader(program, fShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

function initShader() {
  if (!gl) return;
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSrc);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSrc);
  const program = createProgram(gl, vertexShader, fragmentShader);
  gl.useProgram(program);
  const posAttribLocation = gl.getAttribLocation(program, "a_position");
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1, 1, -1, -1, 1,
    -1, 1, 1, -1, 1, 1,
  ]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(posAttribLocation);
  gl.vertexAttribPointer(posAttribLocation, 2, gl.FLOAT, false, 0, 0);
  const iResolutionLoc = gl.getUniformLocation(program, "iResolution");
  const iTimeLoc = gl.getUniformLocation(program, "iTime");
  let startTime = performance.now();
  function render() {
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.uniform2f(iResolutionLoc, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.uniform1f(iTimeLoc, (performance.now() - startTime) / 1000);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(render);
  }
  render();
}

initShader();
