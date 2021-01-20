import PropTypes from 'prop-types'
import React from 'react'

import { BaseTable, TextButton } from '@gnomad/ui'

import CooccurrenceDataPropType from './CooccurrenceDataPropType'

const getCooccurrencePattern = probabilityOfCompoundHet => {
  if (probabilityOfCompoundHet === null) {
    return 'Uncertain'
  }
  if (probabilityOfCompoundHet > 0.505) {
    return 'Different haplotypes'
  }
  if (probabilityOfCompoundHet < 0.164) {
    return 'Same haplotype'
  }
  return 'Uncertain'
}

const VariantCooccurrenceSummaryTable = ({
  cooccurrenceData,
  selectedPopulation,
  onSelectPopulation,
}) => {
  return (
    <BaseTable>
      <thead>
        <tr>
          <th scope="col">Population</th>
          <th scope="col">Samples suggesting variants appear on different haplotypes</th>
          <th scope="col">Samples suggesting variants appear on same haplotype</th>
          <th scope="col">Likely co&#x2011;occurrence pattern</th>
        </tr>
      </thead>
      <tbody>
        {cooccurrenceData.populations.map(pop => (
          <tr
            key={pop.id}
            style={pop.id === selectedPopulation ? { background: '#eee' } : undefined}
          >
            <th scope="row">
              <TextButton
                onClick={() => {
                  onSelectPopulation(pop.id)
                }}
              >
                {pop.id}
              </TextButton>
            </th>
            <td>
              {pop.cooccurrence[1] +
                pop.cooccurrence[2] +
                pop.cooccurrence[3] +
                pop.cooccurrence[6]}
            </td>
            <td>{pop.cooccurrence[4] + pop.cooccurrence[8]}</td>
            <td>{getCooccurrencePattern(pop.p_compound_het)}</td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr style={selectedPopulation === 'All' ? { background: '#eee' } : undefined}>
          <th scope="row" style={{ borderTop: '2px solid #aaa' }}>
            <TextButton
              onClick={() => {
                onSelectPopulation('All')
              }}
              style={{ fontWeight: 'bold' }}
            >
              All
            </TextButton>
          </th>
          <td style={{ borderTop: '2px solid #aaa' }}>
            {cooccurrenceData.cooccurrence[1] +
              cooccurrenceData.cooccurrence[2] +
              cooccurrenceData.cooccurrence[3] +
              cooccurrenceData.cooccurrence[6]}
          </td>
          <td style={{ borderTop: '2px solid #aaa' }}>
            {cooccurrenceData.cooccurrence[4] + cooccurrenceData.cooccurrence[8]}
          </td>
          <td style={{ borderTop: '2px solid #aaa' }}>
            {getCooccurrencePattern(cooccurrenceData.p_compound_het)}
          </td>
        </tr>
      </tfoot>
    </BaseTable>
  )
}

VariantCooccurrenceSummaryTable.propTypes = {
  cooccurrenceData: CooccurrenceDataPropType.isRequired,
  selectedPopulation: PropTypes.string.isRequired,
  onSelectPopulation: PropTypes.func.isRequired,
}

export default VariantCooccurrenceSummaryTable
