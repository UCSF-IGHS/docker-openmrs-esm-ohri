import React, { useState } from 'react';

import styles from './hts-overview-list.scss';
import Button from 'carbon-components-react/es/components/Button';
import { Add16 } from '@carbon/icons-react';
import { useTranslation } from 'react-i18next';
import OTable from '../../components/data-table/o-table.component';
import { attach, openmrsFetch, switchTo } from '@openmrs/esm-framework';
import { DataTableSkeleton } from 'carbon-components-react';
import dayjs from 'dayjs';
import EmptyState from '../../components/empty-state/empty-state.component';

interface HtsOverviewListProps {
  patientUuid: string;
}

export const htsFormSlot = 'hts-encounter-form-slot';
export const htsEncounterRepresentation =
  'custom:(uuid,encounterDatetime,location:(uuid,name),' +
  'encounterProviders:(uuid,provider:(uuid,name)),' +
  'obs:(uuid,obsDatetime,concept:(uuid,name:(uuid,name)),value:(uuid,name:(uuid,name))))';

const HtsOverviewList: React.FC<HtsOverviewListProps> = ({ patientUuid }) => {
  const { t } = useTranslation();
  const [tableRows, setTableRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [counter, setCounter] = useState(0);
  const rowCount = 5;
  const htsEncounterTypeUUID = '30b849bd-c4f4-4254-a033-fe9cf01001d8';
  const hivTestResultConceptUUID = 'f4470401-08e2-40e5-b52b-c9d1254a4d66';

  const forceComponentUpdate = () => setCounter(counter + 1);
  const launchHTSForm = () => {
    switchTo('workspace', htsFormSlot, {
      title: t('htsForm', 'HIV Test'),
      state: { updateHTSList: forceComponentUpdate },
    });
    attach(htsFormSlot, 'hts-encounter-form-ext');
  };
  const editHTSEncounter = encounterUuid => {
    switchTo('workspace', htsFormSlot, {
      title: t('htsForm', 'HIV Test'),
      state: { updateHTSList: forceComponentUpdate, encounter: encounterUuid },
    });
    attach(htsFormSlot, 'hts-encounter-form-ext');
  };
  const tableHeaders = [
    { key: 'date', header: 'Date', isSortable: true },
    { key: 'location', header: 'Location' },
    { key: 'result', header: 'Result' },
    { key: 'provider', header: 'HTS Provider' },
    { key: 'action', header: 'Action' },
  ];

  function getHtsEncounters(query: string, customRepresentation: string) {
    return openmrsFetch(`/ws/rest/v1/encounter?${query}&v=${customRepresentation}`).then(({ data }) => {
      let rows = [];
      data.results.map(encounter => {
        const htsResult = encounter.obs.find(observation => observation.concept.uuid === hivTestResultConceptUUID);
        const htsProvider = encounter.encounterProviders.map(p => p.provider.name).join(' | ');
        const editEncounterButton = (
          <Button
            kind="ghost"
            iconDescription="Edit"
            onClick={e => {
              e.preventDefault();
              editHTSEncounter(encounter.uuid);
            }}>
            {t('editHTSEncounter', 'Edit')}
          </Button>
        );
        rows.push({
          id: encounter.uuid,
          date: dayjs(encounter.encounterDatetime).format('DD-MMM-YYYY'),
          location: encounter.location.name,
          result: htsResult?.value?.name?.name,
          provider: htsProvider,
          action: editEncounterButton,
        });
      });

      setTableRows(rows);
      setIsLoading(false);
    });
  }
  React.useEffect(() => {
    let query = `encounterType=${htsEncounterTypeUUID}&patient=${patientUuid}`;
    getHtsEncounters(query, htsEncounterRepresentation);
  }, [counter]);

  const headerTitle = 'HTS Summary';

  return (
    <>
      {isLoading ? (
        <DataTableSkeleton rowCount={rowCount} />
      ) : tableRows.length > 0 ? (
        <div className={styles.widgetContainer}>
          <div className={styles.widgetHeaderContainer}>
            <h4 className={`${styles.productiveHeading03} ${styles.text02}`}>{headerTitle}</h4>
            <div className={styles.toggleButtons}>
              <Button
                kind="ghost"
                renderIcon={Add16}
                iconDescription="New"
                onClick={e => {
                  e.preventDefault();
                  launchHTSForm();
                }}>
                {t('add', 'New')}
              </Button>
            </div>
          </div>
          <OTable tableHeaders={tableHeaders} tableRows={tableRows} />
        </div>
      ) : (
        <EmptyState
          displayText={t('htsEncounters', 'hts encounters')}
          headerTitle={headerTitle}
          launchForm={launchHTSForm}
        />
      )}

      <div className={styles.widgetContainer} style={{ marginTop: '2.5rem' }}>
        <div className={styles.widgetHeaderContainer}>
          <h4 className={`${styles.productiveHeading03} ${styles.text02}`}>Client Linkage</h4>
          <div className={styles.toggleButtons}>
            <Button
              kind="ghost"
              renderIcon={Add16}
              iconDescription="New"
              onClick={e => {
                e.preventDefault();
              }}>
              {t('add', 'New')}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HtsOverviewList;
