import React, { useEffect, useRef, useState } from 'react';
import TabPanel, { Item as TabItem } from 'devextreme-react/tab-panel';
import { Button, DataGrid, DropDownBox, List, TextBox, TreeView } from 'devextreme-react';
import { Column, Grouping, GroupPanel, Paging, Scrolling, SearchPanel } from 'devextreme-react/data-grid';
import { InstitutionsService, PensumsService } from '../../../../services';
import { AcademicPlan as AcademicPlanModel, Subject } from '../../../../models';
import notify from 'devextreme/ui/notify';
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
};

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
};

const GroupTemplate = (item: any) => {
  return (
    <div>
      <label style={{ fontWeight: 'bold', fontSize: '16px', marginRight: '10px' }}>PERIODO: {item.key}</label>
      <label style={{ fontWeight: 'normal', fontSize: '16px' }}>(Creditos: {item.credits})</label>
    </div>
  );
}

const ListItemTemplate = (item: any) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div style={{ width: '10%', borderRight: '1px solid #ccc' }}>
        <label style={{ fontWeight: 'bold' }}>{item.code}</label>
      </div>
      <div style={{ width: '60%', paddingLeft: '10px' }}>
        <label>{item.name}</label>
      </div>
      <div style={{ width: '15%' }}>
        <label style={{ color: '#E74C3C' }}>{item.prerequisites2.join(", ")}</label>
      </div>
      <div style={{ width: '15%' }}>
        <label style={{ color: '#3498DB' }}>{item.corequisites2.join(", ")}</label>
      </div>
    </div>
  );
}

const AcademicPlan: React.FC<any> = () => {
  const IDENTIFY_SELECTED_DATA = 'academic-plan-selected';

  var [tabIndex, setTabIndex] = useState<number>(0);
  const [subjects, setSubjects] = useState<Subject[]>();
  const [planData, setPlanData] = useState<AcademicPlanModel[]>();
  const [subjectsSelected, setSubjectsSelected] = useState<string[]>();

  const [selected, setSelected] = useState<any>();
  const treeView = useRef<TreeView>();
  const dropDownBox = useRef<DropDownBox | any>();
  const [institutions, setInstitutions] = useState<any>();
  const [sending, setSending] = useState<boolean>(false);

  var onSelectionTabChanged = (args: any) => {
    if (args.name == 'selectedIndex') {
      setTabIndex(args.value);
    }
  }
  useEffect(() => {
    InstitutionsService.getUserCareers()
      .then((data) => {
        setInstitutions(data);
        if (data && data.length) {
          setSelected(getFirstItem(data));
        }
      });
  }, []);

  useEffect(() => {
    if (selected) {
      PensumsService
        .getSubjects(selected['pensumId'])
        .then(data => {
          setSubjects(data);

          var items = localStorage.getItem(IDENTIFY_SELECTED_DATA);
          if (items) {
            var itemsArr = items.split(',');
            setSubjectsSelected(itemsArr);
          }
        });
    }
  }, [selected]);


  const onSelectionChange = ({ event, itemData }: any) => {
    if (event && itemData && itemData.courseTypeId) {
      setSelected(itemData);
      dropDownBox.current?.instance.close();
    }
  };

  const onGenerate = () => {
    setSending(true);
    PensumsService.generateAcademicPlan(selected['pensumId'], subjectsSelected ? subjectsSelected : [])
      .then((data) => {
        if (subjectsSelected)
          localStorage.setItem(IDENTIFY_SELECTED_DATA, subjectsSelected.join(","));

        setPlanData(data);
        setSending(false);
      })
      .catch((response: any) => {
        setSending(false);
        notify({ message: response.data.errors, width: 'auto' }, "error", 4500);
      });
  }

  return (
    <div className="periods" >
      <div className="periods-header">
        <h2><b>Plan academico</b></h2>
        <DropDownBox
          ref={dropDownBox}
          valueExpr="id"
          displayExpr="name"
          placeholder="Selecciona una institución"
          showClearButton={false}
          fieldRender={InstitutionDropDownField}
          value={selected}
          readOnly={sending}
          contentRender={() =>
            <InstitutionsTreeOptions
              refChild={treeView}
              data={institutions}
              onSelectionChange={onSelectionChange}
            />
          }
        />
      </div>
      <div style={{ flexGrow: 1 }}>
        <TabPanel
          selectedIndex={tabIndex}
          onOptionChanged={onSelectionTabChanged}
          focusStateEnabled={false}
          className="ds-tab-panel"
          height="100%"
        >
          <TabItem title="Asignaturas cursadas">
            <div style={{ width: '100%', maxWidth: 'fit-content', padding: '15px' }}>
              <div style={{ textAlign: 'right' }}>
                <Button
                  className="btn-secondary"
                  text={'GENERAR PLAN'}
                  width="auto"
                  height="40px"
                  stylingMode={'text'}
                  type="normal"
                  style={{ marginTop: '10px' }}
                  onClick={onGenerate}
                  disabled={sending}
                />
              </div>

              <DataGrid
                dataSource={subjects}
                allowColumnReordering={true}
                showBorders={true}
                width="100%"
                height="350px"
                selection={{ mode: 'multiple' }}
                keyExpr="code"
                disabled={sending}
                selectedRowKeys={subjectsSelected}
                onSelectionChanged={({ selectedRowKeys }) => {
                  if (selectedRowKeys)
                    setSubjectsSelected(selectedRowKeys)
                }}
              >
                <GroupPanel visible={true} allowColumnDragging={false} />
                <Grouping autoExpandAll={true} />
                <Scrolling mode="infinite" />

                <Column dataField="code" caption="Código" dataType="string" />
                <Column dataField="name" caption="Nombre" dataType="string" width="40%" />
                <Column dataField="credits" caption="Creditos" dataType="string" />
                <Column dataField="prerequisite" caption="Pre-requisitos" dataType="string" />
                <Column dataField="corequisite" caption="Co-requisitos" dataType="string" />
                <Column dataField="period" caption="Periodo" dataType="string" groupIndex={0} />
              </DataGrid>
              <label><b>Nota:</b> Seleccionar las materias que ya ha cursado.</label>
            </div>
          </TabItem>
          <TabItem title="Plan generado" disabled={!(planData && planData.length > 0)}>
            <div style={{ width: '100%', maxWidth: 'fit-content', padding: '15px' }}>
              <List
                dataSource={planData?.map(item => ({ ...item, key: item.code, items: item.subjects }))}
                grouped={true}
                keyExpr="code"
                collapsibleGroups={true}
                selectionMode={'none'}
                itemRender={ListItemTemplate}
                groupRender={GroupTemplate}
              />
            </div>
          </TabItem>

        </TabPanel>
      </div>
    </div>
  );
}

export default AcademicPlan;