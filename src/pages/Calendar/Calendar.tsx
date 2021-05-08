import { Scheduler } from 'devextreme-react';
import { Resource } from 'devextreme-react/scheduler';
import React, { useEffect, useState } from 'react';
import { Assignment, Course } from '../../models';
import { CoursesService } from '../../services';
import { formatDate } from "devextreme/localization";
import { CreateAssignment } from '../Courses';

const currentDate = new Date();

const AppointmentTooltipComponent: React.FC<{ data: { appointmentData: any } }> = ({ data }) => {
  const { appointmentData } = data;
  return (
    <div className="dx-tooltip-appointment-item">
      <div className="dx-tooltip-appointment-item-marker">
        <img src={appointmentData.institutionLogo} />
      </div>
      <div className="dx-tooltip-appointment-item-content">
        <div className="dx-tooltip-appointment-item-content-subject">{appointmentData.title}</div>
        <div className="dx-tooltip-appointment-item-content-subject-course">{appointmentData.courseName}</div>
        <div className="dx-tooltip-appointment-item-content-subject-institution">{appointmentData.institutionName}</div>
        <div className="dx-tooltip-appointment-item-content-date">{formatDate(appointmentData.endDate, 'EEEE, d MMM, yyyy')}</div>
      </div>
    </div>
  );
}

const Calendar: React.FC = () => {

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  var [selectedAssignment, setSelectedAssignment] = useState<Assignment>();
  var [assigmentPopUpVisible, setAssigmentPopUpVisible] = useState<boolean>(false);

  const loadData = () => {
    CoursesService.getAssignmentsToCalendar().then(data => {
      if (data && data.assignments && data.assignments.length) {
        let assignmentsArr = data.assignments.map(x => ({ ...x, text: x.title, startDate: new Date(x.dueDate), endDate: new Date(x.dueDate) }));
        let coursesArr = data.courses.map(x => ({ ...x, color: '#' + x.color }));
        setAssignments(assignmentsArr);
        setCourses(coursesArr);
      }
    });
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="calendar-view">
      <Scheduler
        dataSource={assignments}
        views={['month']}
        descriptionExpr="descripcion"
        editing={{
          allowDeleting: false,
          allowDragging: false,
          allowAdding: false,
          allowResizing: false,
          allowUpdating: false
        }}
        onAppointmentFormOpening={(e) => {
          e.cancel = true;
          setAssigmentPopUpVisible(true);
          setSelectedAssignment(e.appointmentData);
        }}
        appointmentTooltipComponent={AppointmentTooltipComponent}
        defaultCurrentView="month"
        defaultCurrentDate={currentDate}
        maxAppointmentsPerCell={3}
        height="100%"
        width="100%"
      >
        <Resource
          dataSource={courses}
          fieldExpr="courseId"
          label="Curso"
        />
      </Scheduler>
      <CreateAssignment
        data={selectedAssignment}
        courseId={selectedAssignment ? selectedAssignment.courseId : 0}
        visible={assigmentPopUpVisible}
        onHidden={() => setAssigmentPopUpVisible(false)}
        onDataChanged={loadData}
      />
    </div>
  );
}

export default Calendar;