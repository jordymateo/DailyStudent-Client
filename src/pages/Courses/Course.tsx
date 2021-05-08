import React, { useEffect, useState } from "react";
import TabPanel, { Item as TabItem } from 'devextreme-react/tab-panel';
import { Button, SpeedDialAction } from 'devextreme-react';
import { CoursesService } from "../../services";
import { Route, useHistory, useRouteMatch } from "react-router-dom";
import { Course as CourseModel, Assignment as AssigmentModel, Note as NoteModel } from "../../models";
import config from 'devextreme/core/config';
import { CreateAssignment, CreateNote } from ".";
import { IAssignmentCardProps, IAssignmentsSectionProps, INoteCardProps, INotesSectionProps } from "./types";
import { formatDate } from "devextreme/localization";
import { ConfirmationPopup } from "../../components/ConfirmationPopup";
import notify from "devextreme/ui/notify";
import CourseDetail from "./CourseDetail";

export const AssignmentCard: React.FC<IAssignmentCardProps> = ({ data, onOpenClick, onDataChanged }) => {

  const [openConfirm, setOpenConfirm] = useState<boolean>(false);

  const onSubmitDelete = () => {
    setOpenConfirm(false);
    CoursesService.deleteAssignment(data?.id!)
      .then((data) => {
        onDataChanged();
        notify({ message: 'Asignación eliminada correctamente!', width: 'auto' }, "success", 4500);
      }).catch((response: any) => {
        notify({ message: response.data.errors, width: 'auto' }, "error", 4500);
      });
  }

  return (
    <div className="assignment-card" key={data.id}>
      <p className="assignment-title">{data.title}</p>
      <label className="assignment-content">{data.descripcion}</label>
      <div className="assignment-info">
        <label><i className="dx-icon dx-icon-event" /> {formatDate(new Date(data.dueDate), 'EEEE, d MMM, yyyy')}</label>
        {(data.files && data.files.length > 0) && (
          <label><i className="dx-icon dx-icon-doc" /> Adjuntos</label>
        )}
      </div>
      <div className="assignment-options">
        <Button
          text={'ABRIR'}
          height="40px"
          stylingMode={'text'}
          className="btn-assignment-open"
          onClick={onOpenClick}
        />
        {data.isCompleted ? (
          <label className="assignment-completed"><i className="dx-icon dx-icon-check" /> Completada</label>
        ) : (
          <Button
            icon={'trash'}
            height="40px"
            stylingMode={'text'}
            className="btn-assignment-delete"
            onClick={() => setOpenConfirm(true)}
          />
        )}
        <ConfirmationPopup
          okText="Si"
          cancelText="No"
          message={`La asignación seleccionara se eliminará. ¿Desea continuar?`}
          open={openConfirm}
          onOk={onSubmitDelete}
          onCancel={() => setOpenConfirm(false)}
        />
      </div>
    </div>
  );
}

const NoteCard: React.FC<INoteCardProps> = ({ data, onOpenClick, onDataChanged }) => {
  const regex = /(<([^>]+)>)/ig;
  const result = data.description.replace(regex, '');

  const [openConfirm, setOpenConfirm] = useState<boolean>(false);

  const onSubmitDelete = () => {
    setOpenConfirm(false);
    CoursesService.deleteNote(data?.id!)
      .then((data) => {
        onDataChanged();
        notify({ message: 'Nota eliminada correctamente!', width: 'auto' }, "success", 4500);
      }).catch((response: any) => {
        notify({ message: response.data.errors, width: 'auto' }, "error", 4500);
      });
  }

  return (
    <div className="note-card" key={data.id}>
      <p className="note-title">{data.title}</p>
      <div className="note-info">
        <label><i className="dx-icon dx-icon-event" /> {formatDate(new Date(data.creationDate!), 'EEEE, d MMM, yyyy')}</label>
      </div>
      <label className="assignment-content">{result}</label>
      <div className="assignment-options">
        <Button
          text={'ABRIR'}
          height="40px"
          stylingMode={'text'}
          className="btn-assignment-open"
          onClick={onOpenClick}
        />
        <Button
          icon={'trash'}
          height="40px"
          stylingMode={'text'}
          className="btn-assignment-delete"
          onClick={() => setOpenConfirm(true)}
        />
        <ConfirmationPopup
          okText="Si"
          cancelText="No"
          message={`La nota seleccionara se eliminará. ¿Desea continuar?`}
          open={openConfirm}
          onOk={onSubmitDelete}
          onCancel={() => setOpenConfirm(false)}
        />
      </div>
    </div>
  );
}

const AssignmentsSection: React.FC<IAssignmentsSectionProps> =
  ({ assignments, tabIndex, assigmentPopUpVisible, onDataChanged, setSelectedAssignment, setAssigmentPopUpVisible }) => {
    return (
      <div className="tab-section-container">
        <div className="tab-side-filters">
          {/* SideBar */}
          <div className="filter-option">
            <label className="filter-label">Creadas</label>
            <label className="filter-value">{assignments?.length}</label>
          </div>
          <div className="filter-option">
            <label className="filter-label">Pendientes</label>
            <label className="filter-value">{assignments?.filter(x => !x.isCompleted).length}</label>
          </div>
          <div className="filter-option">
            <label className="filter-label">Completadas</label>
            <label className="filter-value">{assignments?.filter(x => x.isCompleted).length}</label>
          </div>
        </div>
        <div className="tab-content">
          {/* Content */}
          {assignments?.map(assignment =>
            <AssignmentCard
              key={assignment.id}
              data={assignment}
              onOpenClick={() => {
                setAssigmentPopUpVisible(true);
                setSelectedAssignment(assignment);
              }}
              onDataChanged={onDataChanged}
            />
          )}
        </div>
        <SpeedDialAction
          icon="add"
          label="Agregar Asignación"
          visible={!assigmentPopUpVisible && tabIndex === 0}
          onClick={() => {
            setAssigmentPopUpVisible(true)
            setSelectedAssignment(undefined);
          }}
        />
      </div>

    );
  }

const NotesSection: React.FC<INotesSectionProps> = ({ notes, tabIndex, notePopUpVisible, onDataChanged, setSelectedNote, setNotePopUpVisible }) => {
  return (
    <div className="tab-section-container">
      <div className="tab-content">
        {/* Content */}
        {notes?.map(note =>
          <NoteCard
            key={note.id}
            data={note}
            onOpenClick={() => {
              setNotePopUpVisible(true);
              setSelectedNote(note);
            }}
            onDataChanged={onDataChanged}
          />
        )}
      </div>
      <SpeedDialAction
        icon="add"
        label="Agregar Nota"
        visible={!notePopUpVisible && tabIndex === 1}
        onClick={() => {
          setNotePopUpVisible(true)
          setSelectedNote(undefined);
        }}
      />
    </div>
  );
}

const Course: React.FC = () => {
  var history = useHistory();
  var { params }: { params: any } = useRouteMatch();

  var [info, setInfo] = useState<CourseModel>();
  var [tabIndex, setTabIndex] = useState<number>(0);

  var [assignments, setAssignments] = useState<AssigmentModel[]>([]);
  var [selectedAssignment, setSelectedAssignment] = useState<AssigmentModel | undefined>();
  var [assigmentPopUpVisible, setAssigmentPopUpVisible] = useState<boolean>(false);

  var [notes, setNotes] = useState<NoteModel[]>([]);
  var [selectedNote, setSelectedNote] = useState<NoteModel | undefined>();
  var [notePopUpVisible, setNotePopUpVisible] = useState<boolean>(false);

  
  var [courseDetailVisible, setCourseDetailVisible] = useState<boolean>(false);

  const loadAssignments = () => {
    CoursesService.getAssignmentsByCourse(params.id).then(data => setAssignments(data));
  }

  const loadNotes = () => {
    CoursesService.getNotesByCourse(params.id).then(data => setNotes(data));
  }

  const loadCourseInfo = () => {
    CoursesService.get(params.id).then(data => setInfo(data));
  }
  useEffect(() => {
    loadCourseInfo();
    loadAssignments();
    loadNotes();
  }, [params]);

  useEffect(() => {
    config({
      floatingActionButtonConfig: {
        position: {
          at: 'right bottom',
          my: 'right bottom',
          offset: '-80 -40'
        }
      }
    });
  }, []);

  var onSelectionTabChanged = (args: any) => {
    if (args.name == 'selectedIndex') {
      setTabIndex(args.value);
    }
  }

  const onRefreshAssignments = () => {
    loadAssignments();
  }

  const onRefreshNotes = () => {
    loadNotes();
  }

  return (
    <div className="course-section">
      <div className="course-section-header">
        <h1>{info?.name}</h1>
        <h2 className="color-primary-red">{info?.teacherFullName}</h2>
      </div>
      <div className="course-section-detail">
        <Button
          text={'Ver detalle'}
          height="40px"
          stylingMode={'text'}
          type="danger"
          onClick={() => setCourseDetailVisible(true)}
          icon="dx-icon dx-icon-info"
        />
        <CourseDetail
          data={info}
          visible={courseDetailVisible}
          onHidden={() => setCourseDetailVisible(false)}
          onDataChanged={loadCourseInfo}
        />
      </div>
      <div style={{ marginTop: '4em', flexGrow: 1 }}>
        <TabPanel
          selectedIndex={tabIndex}
          onOptionChanged={onSelectionTabChanged}
          focusStateEnabled={false}
          className="assigment-tab-panel"
          height="100%"
        >
          <TabItem title="Asignaciones">
            <AssignmentsSection
              tabIndex={tabIndex}
              assignments={assignments}
              assigmentPopUpVisible={assigmentPopUpVisible}
              onDataChanged={onRefreshAssignments}
              setSelectedAssignment={setSelectedAssignment}
              setAssigmentPopUpVisible={setAssigmentPopUpVisible}
            />
          </TabItem>
          <TabItem title="Notas">
            <NotesSection
              tabIndex={tabIndex}
              notes={notes}
              notePopUpVisible={notePopUpVisible}
              onDataChanged={onRefreshNotes}
              setSelectedNote={setSelectedNote}
              setNotePopUpVisible={setNotePopUpVisible}
            />
          </TabItem>

        </TabPanel>
      </div>
      <CreateAssignment
        data={selectedAssignment}
        courseId={params.id}
        visible={assigmentPopUpVisible}
        onHidden={() => setAssigmentPopUpVisible(false)}
        onDataChanged={onRefreshAssignments}
      />
      <CreateNote
        data={selectedNote}
        courseId={params.id}
        visible={notePopUpVisible}
        onHidden={() => setNotePopUpVisible(false)}
        onDataChanged={onRefreshNotes}
      />
    </div>
  );
}
export default Course;