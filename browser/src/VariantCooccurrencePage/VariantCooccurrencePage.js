import PropTypes from 'prop-types'
import React, { useState } from 'react'
import styled from 'styled-components'

import { isVariantId } from '@gnomad/identifiers'
import { Input, Page, PrimaryButton } from '@gnomad/ui'

import DocumentTitle from '../DocumentTitle'
import GnomadPageHeading from '../GnomadPageHeading'
import Query from '../Query'
import StatusMessage from '../StatusMessage'
import { TranscriptConsequenceList } from '../VariantPage/TranscriptConsequenceList'

import CooccurrenceDataPropType from './CooccurrenceDataPropType'
import VariantCooccurrenceDetailsTable from './VariantCooccurrenceDetailsTable'
import VariantCooccurrenceSummaryTable from './VariantCooccurrenceSummaryTable'

const Section = styled.section`
  width: 100%;
`

const ResponsiveSection = styled(Section)`
  width: calc(50% - 15px);

  @media (max-width: 992px) {
    width: 100%;
  }
`

const Wrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
`

const VariantCoocurrence = ({ variant1Id, variant2Id, cooccurrenceData }) => {
  const [selectedPopulation, setSelectedPopulation] = useState('All')

  const cooccurrenceInSelectedPopulation =
    selectedPopulation === 'All'
      ? cooccurrenceData.cooccurrence
      : cooccurrenceData.populations.find(pop => pop.id === selectedPopulation).cooccurrence

  const probabilityOfCompoundHetInSelectedPopulation =
    selectedPopulation === 'All'
      ? cooccurrenceData.p_compound_het
      : cooccurrenceData.populations.find(pop => pop.id === selectedPopulation).p_compound_het

  let cooccurrenceDescription
  if (probabilityOfCompoundHetInSelectedPopulation === null) {
    cooccurrenceDescription =
      'The co-occurence pattern for these variants doesn’t allow us to give a robust assessment of whether these variants are on the same haplotype or not in'
  } else if (probabilityOfCompoundHetInSelectedPopulation > 0.505) {
    cooccurrenceDescription =
      'Based on their co-occurence pattern in gnomAD, these variants are likely found on different haplotypes in most'
  } else if (probabilityOfCompoundHetInSelectedPopulation < 0.164) {
    cooccurrenceDescription =
      'Based on their co-occurence pattern in gnomAD, these variants are likely found on the same haplotype in  most'
  } else {
    cooccurrenceDescription =
      'The co-occurence pattern for these variants doesn’t allow us to give a robust assessment of whether these variants are on the same haplotype or not in'
  }

  if (selectedPopulation === 'All') {
    cooccurrenceDescription = `${cooccurrenceDescription} individuals in gnomAD`
  } else {
    cooccurrenceDescription = `${cooccurrenceDescription} individuals in the ${selectedPopulation} population in gnomAD`
  }

  return (
    <Wrapper>
      <ResponsiveSection>
        <h2>Overview</h2>
        <VariantCooccurrenceSummaryTable
          cooccurrenceData={cooccurrenceData}
          selectedPopulation={selectedPopulation}
          onSelectPopulation={setSelectedPopulation}
        />
      </ResponsiveSection>
      <ResponsiveSection>
        <h2>
          {selectedPopulation === 'All'
            ? 'Details'
            : `Details for ${selectedPopulation} Population`}
        </h2>
        <VariantCooccurrenceDetailsTable
          variant1Id={variant1Id}
          variant2Id={variant2Id}
          cooccurrence={cooccurrenceInSelectedPopulation}
        />
        <p>{cooccurrenceDescription}.</p>
      </ResponsiveSection>
    </Wrapper>
  )
}

VariantCoocurrence.propTypes = {
  variant1Id: PropTypes.string.isRequired,
  variant2Id: PropTypes.string.isRequired,
  cooccurrenceData: CooccurrenceDataPropType.isRequired,
}

const InputGroup = styled.div`
  margin-bottom: 1em;
`

const FormValidationMessage = styled.span`
  display: inline-block;
  margin-top: 0.5em;
  color: #ff583f;
`

const SubmitButton = styled(PrimaryButton).attrs({ type: 'submit' })``

const VariantCoocurrenceForm = ({ onSubmit }) => {
  const [variant1Id, setVariant1Id] = useState('')
  const [variant2Id, setVariant2Id] = useState('')

  const isVariant1Invalid = variant1Id && !isVariantId(variant1Id)
  const isVariant2Invalid = variant2Id && !isVariantId(variant2Id)

  return (
    <form
      onSubmit={e => {
        e.preventDefault()

        onSubmit([variant1Id, variant2Id])
      }}
    >
      <InputGroup>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label htmlFor="cooccurrence-variant1" style={{ display: 'block' }}>
          Variant 1 (required)
          <Input
            aria-describedby={isVariant1Invalid ? 'cooccurrence-variant1-error' : undefined}
            aria-required="true"
            id="cooccurrence-variant1"
            required
            value={variant1Id}
            onChange={e => {
              setVariant1Id(e.target.value)
            }}
          />
        </label>
        {isVariant1Invalid && (
          <FormValidationMessage id="cooccurrence-variant1-error">
            Invalid variant ID
          </FormValidationMessage>
        )}
      </InputGroup>
      <InputGroup>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label htmlFor="cooccurrence-variant2" style={{ display: 'block' }}>
          Variant 2 (required)
          <Input
            aria-describedby={isVariant2Invalid ? 'cooccurrence-variant2-error' : undefined}
            aria-required="true"
            id="cooccurrence-variant2"
            required
            value={variant2Id}
            onChange={e => {
              setVariant2Id(e.target.value)
            }}
          />
        </label>
        {isVariant2Invalid && (
          <FormValidationMessage id="cooccurrence-variant2-error">
            Invalid variant ID
          </FormValidationMessage>
        )}
      </InputGroup>

      <SubmitButton disabled={!variant1Id || !variant2Id || isVariant1Invalid || isVariant2Invalid}>
        Submit
      </SubmitButton>
    </form>
  )
}

VariantCoocurrenceForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
}

// TODO: Add cooccurrence query
const query = `
query VariantCooccurrence($variant1Id: String!, $variant2Id: String, $datasetId: DatasetId!) {
  variant1: variant(variantId: $variant1Id, dataset: $datasetId) {
    transcript_consequences {
      gene_id
      gene_version
      gene_symbol
      hgvs
      hgvsc
      hgvsp
      is_canonical
      is_mane_select
      is_mane_select_version
      lof
      lof_flags
      lof_filter
      major_consequence
      polyphen_prediction
      sift_prediction
      transcript_id
      transcript_version
    }
  }
  variant2: variant(variantId: $variant2Id, dataset: $datasetId) {
    transcript_consequences {
      gene_id
      gene_version
      gene_symbol
      hgvs
      hgvsc
      hgvsp
      is_canonical
      is_mane_select
      is_mane_select_version
      lof
      lof_flags
      lof_filter
      major_consequence
      polyphen_prediction
      sift_prediction
      transcript_id
      transcript_version
    }
  }
}
`

const VariantCoocurrenceContainer = ({ datasetId }) => {
  const [variantIds, setVariantIds] = useState(null)

  return (
    <>
      <Section>
        <h2>Select a variant pair</h2>
        <VariantCoocurrenceForm onSubmit={setVariantIds} />
      </Section>
      {variantIds && (
        <Query
          query={query}
          variables={{
            variant1Id: variantIds[0],
            variant2Id: variantIds[1],
            datasetId,
          }}
        >
          {({ data, error, graphQLErrors, loading }) => {
            if (loading) {
              return <StatusMessage>Loading co-occurrence...</StatusMessage>
            }

            if (error || !data) {
              return <StatusMessage>Unable to load co-occurrence</StatusMessage>
            }

            if (!data.variantCooccurrence) {
              return (
                <StatusMessage>
                  {graphQLErrors
                    ? graphQLErrors.map(e => e.message).join(', ')
                    : 'Unable to load co-occurrence'}
                </StatusMessage>
              )
            }

            const variant1TranscriptConsequences = data.variant1.transcript_consequences
            const variant2TranscriptConsequences = data.variant2.transcript_consequences

            const variant1Genes = new Set(variant1TranscriptConsequences.map(csq => csq.gene_id))
            const variant2Genes = new Set(variant2TranscriptConsequences.map(csq => csq.gene_id))

            const genesInCommon = new Set(
              [...variant1Genes].filter(geneId => variant2Genes.has(geneId))
            )

            return (
              <>
                <VariantCoocurrence
                  variant1Id={variantIds[0]}
                  variant2Id={variantIds[1]}
                  cooccurrenceData={data.variantCooccurrence}
                />
                <Wrapper>
                  <ResponsiveSection>
                    <h2>{variantIds[0]} Annotations</h2>
                    <TranscriptConsequenceList
                      transcriptConsequences={variant1TranscriptConsequences.filter(csq =>
                        genesInCommon.has(csq.gene_id)
                      )}
                    />
                  </ResponsiveSection>

                  <ResponsiveSection>
                    <h2>{variantIds[1]} Annotations</h2>
                    <TranscriptConsequenceList
                      transcriptConsequences={variant2TranscriptConsequences.filter(csq =>
                        genesInCommon.has(csq.gene_id)
                      )}
                    />
                  </ResponsiveSection>
                </Wrapper>
              </>
            )
          }}
        </Query>
      )}
    </>
  )
}

VariantCoocurrenceContainer.propTypes = {
  datasetId: PropTypes.string.isRequired,
}

const VariantCoocurrencePage = ({ datasetId }) => {
  return (
    <Page>
      <DocumentTitle title="Variant Co-occurrence" />
      <GnomadPageHeading
        datasetOptions={{
          // Co-occurrence data only available for gnomAD v2
          includeExac: false,
          includeGnomad2: true,
          includeGnomad3: false,
          includeStructuralVariants: false,
        }}
        selectedDataset={datasetId}
      >
        Variant Co-Occurrence
      </GnomadPageHeading>
      {datasetId.startsWith('gnomad_r2_1') ? (
        <VariantCoocurrenceContainer datasetId={datasetId} />
      ) : (
        <StatusMessage>Variant co-occurrence is only available for gnomAD v2.</StatusMessage>
      )}
    </Page>
  )
}

VariantCoocurrencePage.propTypes = {
  datasetId: PropTypes.string.isRequired,
}

export default VariantCoocurrencePage
