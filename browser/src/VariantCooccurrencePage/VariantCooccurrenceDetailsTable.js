import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import { parseVariantId } from '@gnomad/identifiers'

const Table = styled.table`
  border-collapse: collapse;
  border-spacing: 0;

  td,
  th {
    padding: 0.5em 10px;
  }

  td {
    text-align: right;
  }
`

const LegendSwatch = styled.span`
  position: relative;
  top: 2px;
  display: inline-block;
  width: 12px;
  height: 12px;
  border: 1px solid #000;
  background: ${props => props.color};
`

const truncate = (str, maxLength = 5) => {
  if (str.length > maxLength - 1) {
    return `${str.slice(0, maxLength - 1)}\u2026`
  }
  return str
}

const DIFFERENT_HAPLOTYPES_HIGHLIGHT_COLOR = 'rgb(255, 119, 114)'
const SAME_HAPLOTYPE_HIGHLIGHT_COLOR = 'rgb(0, 202, 235)'

const VariantCooccurrenceDetailsTable = ({ variant1Id, variant2Id, cooccurrence }) => {
  const variant1 = parseVariantId(variant1Id)
  const variant2 = parseVariantId(variant2Id)

  // cooccurrence: ref_ref ref_het ref_hom het_ref het_het het_hom hom_ref hom_het hom_hom
  return (
    <div>
      <Table>
        <colgroup span="2" />
        <colgroup span="3" />
        <thead>
          <tr>
            <td colSpan={2} />
            <th colSpan={3} scope="colgroup">
              {variant2.chrom}-{variant2.pos}-{truncate(variant2.ref)}-{truncate(variant2.alt)}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={2} />
            <th scope="col">
              {truncate(variant2.ref)}/{truncate(variant2.ref)}
            </th>
            <th scope="col">
              {truncate(variant2.ref)}/{truncate(variant2.alt)}
            </th>
            <th scope="col">
              {truncate(variant2.alt)}/{truncate(variant2.alt)}
            </th>
          </tr>
          <tr>
            <th rowSpan={3} scope="rowgroup">
              {variant1.chrom}-{variant1.pos}-{truncate(variant1.ref)}-{truncate(variant1.alt)}
            </th>
            <th scope="row">
              {truncate(variant1.ref)}/{truncate(variant1.ref)}
            </th>
            <td>{cooccurrence[0]}</td>
            <td
              style={{
                background:
                  cooccurrence[1] !== 0 ? DIFFERENT_HAPLOTYPES_HIGHLIGHT_COLOR : undefined,
              }}
            >
              {cooccurrence[1]}
            </td>
            <td
              style={{
                background:
                  cooccurrence[2] !== 0 ? DIFFERENT_HAPLOTYPES_HIGHLIGHT_COLOR : undefined,
              }}
            >
              {cooccurrence[2]}
            </td>
          </tr>
          <tr>
            <th scope="row">
              {truncate(variant1.ref)}/{truncate(variant1.alt)}
            </th>
            <td
              style={{
                background:
                  cooccurrence[3] !== 0 ? DIFFERENT_HAPLOTYPES_HIGHLIGHT_COLOR : undefined,
              }}
            >
              {cooccurrence[3]}
            </td>
            <td
              style={{
                background: cooccurrence[4] !== 0 ? SAME_HAPLOTYPE_HIGHLIGHT_COLOR : undefined,
              }}
            >
              {cooccurrence[4]}
            </td>
            <td>{cooccurrence[5]}</td>
          </tr>
          <tr>
            <th scope="row">
              {truncate(variant1.alt)}/{truncate(variant1.alt)}
            </th>
            <td
              style={{
                background:
                  cooccurrence[6] !== 0 ? DIFFERENT_HAPLOTYPES_HIGHLIGHT_COLOR : undefined,
              }}
            >
              {cooccurrence[6]}
            </td>
            <td>{cooccurrence[7]}</td>
            <td
              style={{
                background: cooccurrence[8] !== 0 ? SAME_HAPLOTYPE_HIGHLIGHT_COLOR : undefined,
              }}
            >
              {cooccurrence[8]}
            </td>
          </tr>
        </tbody>
      </Table>
      <p>
        <LegendSwatch color={DIFFERENT_HAPLOTYPES_HIGHLIGHT_COLOR} /> Samples that suggest variants
        appear on different haplotypes.
        <br />
        <LegendSwatch color={SAME_HAPLOTYPE_HIGHLIGHT_COLOR} /> Samples that suggest variants appear
        on the same haplotype.
      </p>
    </div>
  )
}

VariantCooccurrenceDetailsTable.propTypes = {
  variant1Id: PropTypes.string.isRequired,
  variant2Id: PropTypes.string.isRequired,
  cooccurrence: PropTypes.arrayOf(PropTypes.number).isRequired,
}

export default VariantCooccurrenceDetailsTable
