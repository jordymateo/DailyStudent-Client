import React, { useEffect, useState } from 'react';
import TabPanel, { Item as TabItem } from 'devextreme-react/tab-panel';
import { Button } from 'devextreme-react';
import { useRouteMatch } from 'react-router-dom';
import { CoursesService } from '../../services';
import { Assignment, CareerSubjects } from '../../models';
import { AssignmentCard } from '../Courses/Course';
import { IAssignmentItemProps } from './types';
import { CreateAssignment } from '../Courses';

const SubjectItem: React.FC<IAssignmentItemProps> = ({ subject, setAssigmentPopUpVisible, setSelectedAssignment }) => {
  return (
    <div className="subject-item">
      <label className="subject-name">{subject.name}</label>
      <div className="subject-assignments">
        {subject.assignments?.map(assignment =>
          <AssignmentCard
            key={assignment.id}
            data={assignment}
            onOpenClick={() => {
              setAssigmentPopUpVisible(true);
              setSelectedAssignment(assignment);
            }}
            onDataChanged={() => { }}
          />
        )}
      </div>
    </div>
  );
}

const Assigments = () => {
  var { params }: { params: any } = useRouteMatch();
  var [career, setCareer] = useState<CareerSubjects>();
  var [results, setResults] = useState<{
    complete: number;
    inComplete: number;
    total: number;
  }>({
    complete: 0,
    inComplete: 0,
    total: 0
  });

  var [selectedAssignment, setSelectedAssignment] = useState<Assignment>();
  var [assigmentPopUpVisible, setAssigmentPopUpVisible] = useState<boolean>(false);

  const onLoadAssignments = () => {
    CoursesService.getAssignmentsByCareer(params.id).then(data => {
      setCareer(data);
      let complete = 0, inComplete = 0, total = 0;
      if (data && data.subjects.length) {
        data.subjects.forEach(subject => {
          subject.assignments.forEach(assignment => {
            if (assignment.isCompleted)
              complete++;
            else
              inComplete++;
            total++;
          });
        });
        setResults({ complete, inComplete, total });
      }
    });
  };
  useEffect(() => {
    onLoadAssignments();
  }, [params]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div>
        <h1 style={{ fontWeight: 'bold', margin: '5px 0' }}>{career?.careerName}</h1>
        <h2 style={{ fontWeight: 'bold', margin: '5px 0', color: 'rgb(132 130 130)' }}>Asignaciones</h2>
      </div>
      <div className="dashboard">
        <div className="dashboard-option">
          <label className="dashboard-label">Creadas</label>
          <label className="dashboard-value">{results.total}</label>
        </div>
        <div className="dashboard-option">
          <label className="dashboard-label">Pendientes</label>
          <label className="dashboard-value">{results.inComplete}</label>
        </div>
        <div className="dashboard-option">
          <label className="dashboard-label">Completadas</label>
          <label className="dashboard-value">{results.complete}</label>
        </div>
      </div>
      <div className="assignments-section">
        {career?.subjects && career?.subjects.map(x =>
          <SubjectItem
            key={x.id}
            subject={x}
            setAssigmentPopUpVisible={setAssigmentPopUpVisible}
            setSelectedAssignment={setSelectedAssignment}
          />)}
      </div>
      <CreateAssignment
        data={selectedAssignment}
        courseId={selectedAssignment ? selectedAssignment.courseId : 0}
        visible={assigmentPopUpVisible}
        onHidden={() => setAssigmentPopUpVisible(false)}
        onDataChanged={onLoadAssignments}
      />
    </div>
  );
}
export default Assigments;