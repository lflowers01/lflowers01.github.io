'use strict';

// A fixed preview keeps the work visible without following or covering the pointer.
const studyProjects = [...document.querySelectorAll('.study-project-list .project-card')];
function selectStudyProject(card) {
  for (const project of studyProjects) project.classList.toggle('is-selected', project === card);
}
for (const card of studyProjects) {
  card.addEventListener('pointerenter', () => selectStudyProject(card));
  card.addEventListener('focusin', () => selectStudyProject(card));
}
if (studyProjects[0]) selectStudyProject(studyProjects[0]);
