'use strict';

// Original point meshes, all bounded by the same unit sphere as the torus.
const studyForms = [
  { name: 'nested torus', points: null },
  { name: 'octahedron in a cube cage', points: [] },
  { name: 'gyroscope', points: [] },
  { name: 'double helix', points: [] },
];

function studyTube(points, center, radius, outer, steps = 160) {
  for (let i = 0; i < steps; i++) {
    const t = i / steps, p = center(t), q = center(t + .0001);
    const length = Math.hypot(q[0]-p[0], q[1]-p[1], q[2]-p[2]) || 1;
    const tangent = q.map((v, j) => (v-p[j])/length);
    const axis = Math.abs(tangent[1]) < .9 ? [0,1,0] : [1,0,0];
    const n = [tangent[1]*axis[2]-tangent[2]*axis[1], tangent[2]*axis[0]-tangent[0]*axis[2], tangent[0]*axis[1]-tangent[1]*axis[0]];
    const norm = Math.hypot(...n); for (let j=0;j<3;j++) n[j]/=norm;
    const binormal = [tangent[1]*n[2]-tangent[2]*n[1], tangent[2]*n[0]-tangent[0]*n[2], tangent[0]*n[1]-tangent[1]*n[0]];
    for (let a=0;a<Math.PI*2;a+=Math.PI/4) {
      const normal = n.map((v,j) => v*Math.cos(a)+binormal[j]*Math.sin(a));
      points.push([...p.map((v,j)=>v+normal[j]*radius), ...normal, outer]);
    }
  }
}

// Flat-shaded octahedron, framed by twelve independently rotating cube edges.
for (const x of [-1,1]) for (const y of [-1,1]) for (const z of [-1,1]) {
  for (let a=0;a<=36;a++) for (let b=0;b<=36-a;b++) {
    studyForms[1].points.push([.66*x*a/36,.66*y*b/36,.66*z*(1-(a+b)/36),x/Math.sqrt(3),y/Math.sqrt(3),z/Math.sqrt(3),false]);
  }
}
for (let axis=0;axis<3;axis++) for (const a of [-.52,.52]) for (const b of [-.52,.52]) {
  studyTube(studyForms[1].points, t => {
    const p=[a,b]; p.splice(axis,0,-.52+t*1.04); return p;
  }, .015, true, 90);
}

// A shaded globe floats inside three perpendicular orbital rings.
for (let u=0;u<Math.PI*2;u+=.065) for (let v=.035;v<Math.PI;v+=.055) {
  const normal=[Math.sin(v)*Math.cos(u),Math.cos(v),Math.sin(v)*Math.sin(u)];
  studyForms[2].points.push([...normal.map(n=>n*.51),...normal,false]);
}
for (let axis=0;axis<3;axis++) studyTube(studyForms[2].points, t => {
  const p=[.89*Math.cos(t*Math.PI*2),.89*Math.sin(t*Math.PI*2)];p.splice(axis,0,0);return p;
},.025,true);

// Two winding strands and rungs inside a spare octagonal frame.
for (const phase of [0,Math.PI]) studyTube(studyForms[3].points, t => [
  .37*Math.cos(t*Math.PI*4+phase),(t-.5)*1.24,.37*Math.sin(t*Math.PI*4+phase),
],.055,false,230);
for (let rung=0;rung<=16;rung++) {
  const t=rung/16, angle=t*Math.PI*4;
  studyTube(studyForms[3].points, s => [(.74*s-.37)*Math.cos(angle),(t-.5)*1.24,(.74*s-.37)*Math.sin(angle)],.018,false,44);
}
for (const y of [-.67,.67]) for (let edge=0;edge<8;edge++) {
  const a=edge*Math.PI/4,b=(edge+1)*Math.PI/4;
  studyTube(studyForms[3].points,t=>[.58*((1-t)*Math.cos(a)+t*Math.cos(b)),y,.58*((1-t)*Math.sin(a)+t*Math.sin(b))],.013,true,40);
}
for (let edge=0;edge<4;edge++) {
  const angle=edge*Math.PI/2;
  studyTube(studyForms[3].points,t=>[.58*Math.cos(angle),(t-.5)*1.34,.58*Math.sin(angle)],.013,true,90);
}
