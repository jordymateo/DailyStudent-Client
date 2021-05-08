import { Accordion, Button, DropDownBox, TextBox, TreeView } from 'devextreme-react';
import { formatDate } from 'devextreme/localization';
import notify from 'devextreme/ui/notify';
import React, { useEffect, useRef, useState } from 'react';
import { Course, Period, PeriodSubject } from '../../../../models';
import { CareersService, InstitutionsService } from '../../../../services';
import { CreatePopup as CreateSubjectsPopup } from '../../../Subjects';
import Edit from './Edit';
import Subject from './Subject';
import { IAccordionItemProps, IAccordionTitleProps } from './types';

const InstitutionTreeOption = ({ data, index }: any) => {
  return (
    <div className="treeview-institution-option">
      {data.logoPath && (<img src={data.logoPath} />)}<label className={data.isGroup ? 'option-group' : ''}>{data.name}</label>
    </div>
  );
}

const InstitutionDropDownField = (data: any) => {
  if (!data)
    return (<TextBox disabled />);
  return (
    <div className="dropdown-institution-field">
      <img src={data.institutionLogo} />
      <div className="dropdown-institution-text">
        <label>{data.institutionName}</label>
        <label>{data.name}</label>
        <TextBox disabled style={{ display: 'none' }}></TextBox>
      </div>
    </div>
  );
}

const InstitutionsTreeOptions = ({ refChild, data, selected, onSelectionChange }: any) => {
  return (
    <TreeView
      ref={refChild}
      dataSource={data}
      keyExpr="uId"
      dataStructure="tree"
      //itemsExpr="items"
      selectionMode="single"
      displayExpr="name"
      selectByClick={true}
      itemComponent={InstitutionTreeOption}
      onItemSelectionChanged={onSelectionChange}
    />
  );
}

const AccordeonItem: React.FC<IAccordionItemProps> = ({ data, onEditSubjectClick, onTonggleSubjectClick }) => {
  return (
    <>
      { data.subjects.length && data.subjects.map(item => (
        <div className="course" key={item.id}>
          <div className="course-icon" style={{ background: '#' + item.color, color: "white", fontWeight: 600, opacity: '0.6' }}>
            <span>{item.name.substr(0, 2)}</span>
          </div>
          <div className="course-info">
            <div className="course-info-name">{item.name}</div>
            <div className="course-info-teacher">{item.teacherFullName}</div>
          </div>
          <div className="course-options">
            <div className="course-option-item">
              <Button
                text={item.isDeleted ? "HABILITAR" : "DESHABILITAR"}
                type="danger"
                stylingMode="text"
                onClick={() => {
                  onTonggleSubjectClick(item);
                }}
              />
            </div>
            <div className="course-option-item">
              <Button
                icon="edit"
                type="danger"
                stylingMode="text"
                onClick={() => {
                  onEditSubjectClick(data, item);
                }}
              />
            </div>
          </div>
        </div >
      ))}
    </>
  );
}

const AccordionTitle: React.FC<IAccordionTitleProps> = ({ data, onEditClick, onAddSubjectClick }) => {
  const initialDate = new Date(data.initialDate);
  const endDate = new Date(data.endDate);
  const currentDate = new Date();
  return (
    <div className="period-header">
      <div className="period-title">
        <h3>{data.name}&nbsp;{(initialDate <= currentDate && endDate >= currentDate) && "- Periodo actual"}</h3>
        <span style={{ textTransform: 'capitalize' }}>{formatDate(initialDate, 'MMMM yyyy')} - {formatDate(endDate, 'MMMM yyyy')}</span>
      </div>
      <div className="perdio-button-edit">
        <Button
          icon="add"
          type="normal"
          stylingMode="text"
          onClick={() => {
            onAddSubjectClick(data);
          }}
        />
        <Button
          icon="edit"
          type="normal"
          stylingMode="text"
          onClick={() => {
            onEditClick(data);
          }}
        />
      </div>
    </div>
  );
}

const getFirstItem: any = (data: any) => {
  for (let i in data) {
    let element;
    if (data[i]['items'] && data[i]['items'].length) {
      element = getFirstItem(data[i]['items']);
    } else {
      if (data[i]['courseTypeId'])
        return data[i];
    }
    if (element) return element;
  }
}


const Periods: React.FC<any> = () => {

  const treeView = useRef<TreeView>();
  const dropDownBox = useRef<DropDownBox | any>();
  var [createSubjectsVisible, setCreateSubjectsVisible] = useState<boolean>(false);

  const [selected, setSelected] = useState<any>();
  const [institutions, setInstitutions] = useState<any>();
  const [periods, setPeriods] = useState<Period[]>();

  const [editVisible, setEditVisible] = useState<boolean>(false);
  const [selectedPeriod, setSelectedPeriod] = useState<Period>();

  const [subjectVisible, setSubjectVisible] = useState<boolean>(false);
  const [selectedPeriodSubject, setSelectedPeriodSubject] = useState<PeriodSubject>();


  useEffect(() => {
    InstitutionsService.getUserCareers()
      .then((data) => {
        setInstitutions(data);
        if (data && data.length) {
          setSelected(getFirstItem(data));
        }
      });
  }, []);

  const onLoadPeriods = () => {
    if (selected && selected.id) {
      CareersService.getUserPeriods(selected.id)
        .then((data) => {
          setPeriods(data)
        });
    }
  }

  useEffect(() => {
    onLoadPeriods();
  }, [selected]);

  const onSelectionChange = ({ event, itemData }: any) => {
    if (event && itemData && itemData.courseTypeId) {
      setSelected(itemData);
      dropDownBox.current?.instance.close();
    }
  };

  const onEditPeriodClick = (data: Period) => {
    setEditVisible(true);
    setSelectedPeriod(data);
  };

  const onAddSubjectClick = (data: Period) => {
    setSubjectVisible(true);
    setSelectedPeriod(data);
    setSelectedPeriodSubject(undefined);
  };

  const onEditSubjectClick = (data: Period, item: PeriodSubject) => {
    setSubjectVisible(true);
    setSelectedPeriod(data);
    setSelectedPeriodSubject(item);
  };

  const onTonggleSubjectClick = (item: PeriodSubject) => {
    InstitutionsService.toggleUserCourseState(item.id)
      .then((data) => {
        onLoadPeriods();
        notify({ message: `Materia ${item.isDeleted ? 'habilidata' : 'deshabilitada'} correctamente!`, width: 'auto' }, "success", 4500);
      });
  };

  return (
    <div className="periods" >
      <div className="periods-header">
        <h2><b>Periodos de clase</b></h2>
        <DropDownBox
          ref={dropDownBox}
          valueExpr="id"
          displayExpr="name"
          placeholder="Selecciona una institución"
          showClearButton={false}
          fieldRender={InstitutionDropDownField}
          value={selected}
          contentRender={() =>
            <InstitutionsTreeOptions
              refChild={treeView}
              data={institutions}
              onSelectionChange={onSelectionChange}
            />
          }
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <Button
          icon="add"
          text="AGREGAR NUEVO PERIODO"
          type="danger"
          stylingMode="text"
          disabled={!selected}
          onClick={() => setCreateSubjectsVisible(true)}
        />
      </div>
      <div className="periods-list">
        <div id="accordion">
          <Accordion
            dataSource={periods}
            itemTitleComponent={({ data }) => (
              <AccordionTitle
                data={data}
                onEditClick={onEditPeriodClick}
                onAddSubjectClick={onAddSubjectClick}
              />
            )}
            itemComponent={({ data }) => (
              <AccordeonItem
                data={data}
                onEditSubjectClick={onEditSubjectClick}
                onTonggleSubjectClick={onTonggleSubjectClick}
              />
            )}
          />
        </div>
      </div>
      <CreateSubjectsPopup
        userCareer={selected}
        visible={createSubjectsVisible}
        onHidden={() => setCreateSubjectsVisible(false)}
        onDataChanged={onLoadPeriods}
      />
      <Edit
        data={selectedPeriod ? selectedPeriod : {} as Period}
        visible={editVisible}
        onHidden={() => setEditVisible(false)}
        onDataChanged={onLoadPeriods}
      />
      <Subject
        periodId={selectedPeriod ? selectedPeriod.id : 0}
        data={selectedPeriodSubject as Course}
        visible={subjectVisible}
        onHidden={() => {
          setSubjectVisible(false);
        }}
        onDataChanged={onLoadPeriods}
      />
    </div>
  );

}

export default Periods;