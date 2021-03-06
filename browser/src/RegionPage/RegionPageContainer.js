import PropTypes from 'prop-types'
import React from 'react'

import { isRegionId, parseRegionId } from '@gnomad/identifiers'
import { Page, PageHeading } from '@gnomad/ui'

import { referenceGenomeForDataset } from '../datasets'
import DocumentTitle from '../DocumentTitle'
import Query from '../Query'
import { withWindowSize } from '../windowSize'
import RegionPage from './RegionPage'

const AutosizedRegionPage = withWindowSize(RegionPage)

const query = `
  query Region($chrom: String!, $start: Int!, $stop: Int!, $referenceGenome: ReferenceGenomeId!) {
    region(chrom: $chrom, start: $start, stop: $stop, reference_genome: $referenceGenome) {
      genes {
        gene_id
        symbol
        start
        stop
        exons {
          feature_type
          start
          stop
        }
        transcripts {
          transcript_id
          exons {
            feature_type
            start
            stop
          }
        }
      }
    }
  }
`

const RegionPageContainer = ({ datasetId, regionId }) => {
  if (!isRegionId(regionId)) {
    return (
      <Page>
        <DocumentTitle title="Invalid region ID" />
        <PageHeading>Invalid region ID</PageHeading>
        <p>Regions IDs must be formatted chrom-start-stop.</p>
      </Page>
    )
  }

  const { chrom, start, stop } = parseRegionId(regionId)
  const referenceGenome = referenceGenomeForDataset(datasetId)

  return (
    <Query
      query={query}
      variables={{ chrom, start, stop, referenceGenome }}
      loadingMessage="Loading region"
      errorMessage="Unable to load region"
      success={data => data.region}
    >
      {({ data }) => {
        return (
          <AutosizedRegionPage
            datasetId={datasetId}
            region={{
              ...data.region,
              reference_genome: referenceGenome,
              chrom: chrom === 'MT' ? 'M' : chrom,
              start,
              stop,
            }}
          />
        )
      }}
    </Query>
  )
}

RegionPageContainer.propTypes = {
  datasetId: PropTypes.string.isRequired,
  regionId: PropTypes.string.isRequired,
}

export default RegionPageContainer
