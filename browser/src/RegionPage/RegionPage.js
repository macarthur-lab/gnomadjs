import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import { RegionViewer } from '@gnomad/region-viewer'

import { labelForDataset } from '../datasets'
import DocumentTitle from '../DocumentTitle'
import GnomadPageHeading from '../GnomadPageHeading'
import { TrackPage, TrackPageSection } from '../TrackPage'
import EditRegion from './EditRegion'
import GenesInRegionTrack from './GenesInRegionTrack'
import MitochondrialRegionCoverageTrack from './MitochondrialRegionCoverageTrack'
import MitochondrialVariantsInRegion from './MitochondrialVariantsInRegion'
import RegionControls from './RegionControls'
import RegionCoverageTrack from './RegionCoverageTrack'
import RegionInfo from './RegionInfo'
import VariantsInRegion from './VariantsInRegion'
import StructuralVariantsInRegion from './StructuralVariantsInRegion'

const RegionInfoColumnWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;

  @media (max-width: 1200px) {
    flex-direction: column;
    align-items: center;
  }

  /* Matches responsive styles in AttributeList */
  @media (max-width: 600px) {
    align-items: stretch;
  }
`

const RegionControlsWrapper = styled.div`
  @media (min-width: 1201px) {
    margin-top: 1em;
  }
`

// eslint-disable-next-line no-shadow
const RegionPage = ({ datasetId, region, width }) => {
  const { chrom, start, stop } = region

  const regionViewerRegions = [
    {
      feature_type: 'region',
      chrom,
      start,
      stop,
    },
  ]

  const smallScreen = width < 900

  // Subtract 30px for padding on Page component
  const regionViewerWidth = width - 30

  return (
    <TrackPage>
      <TrackPageSection>
        <DocumentTitle
          title={`${region.chrom}-${region.start}-${region.stop} | ${labelForDataset(datasetId)}`}
        />
        <GnomadPageHeading
          extra={<EditRegion initialRegion={region} style={{ marginLeft: '1em' }} />}
          selectedDataset={datasetId}
          datasetOptions={{
            includeShortVariants: true,
            includeStructuralVariants: chrom !== 'M',
            includeExac: region.reference_genome === 'GRCh37' && chrom !== 'M',
            includeGnomad2: region.reference_genome === 'GRCh37' && chrom !== 'M',
            includeGnomad3: region.reference_genome === 'GRCh38' || chrom === 'M',
            includeGnomad3Subsets: chrom !== 'M',
          }}
        >
          {`${region.chrom}-${region.start}-${region.stop}`}
        </GnomadPageHeading>
        <RegionInfoColumnWrapper>
          <RegionInfo region={region} />
          <RegionControlsWrapper>
            <RegionControls region={region} />
          </RegionControlsWrapper>
        </RegionInfoColumnWrapper>
      </TrackPageSection>
      <RegionViewer
        leftPanelWidth={115}
        padding={0}
        regions={regionViewerRegions}
        rightPanelWidth={smallScreen ? 0 : 160}
        width={regionViewerWidth}
      >
        {region.chrom === 'M' ? (
          <MitochondrialRegionCoverageTrack
            datasetId={datasetId}
            chrom={chrom}
            start={start}
            stop={stop}
          />
        ) : (
          <RegionCoverageTrack
            datasetId={datasetId}
            chrom={chrom}
            includeExomeCoverage={
              !datasetId.startsWith('gnomad_sv') && !datasetId.startsWith('gnomad_r3')
            }
            start={start}
            stop={stop}
          />
        )}

        <GenesInRegionTrack genes={region.genes} region={region} />

        {/* eslint-disable-next-line no-nested-ternary */}
        {datasetId.startsWith('gnomad_sv') ? (
          <StructuralVariantsInRegion datasetId={datasetId} region={region} />
        ) : region.chrom === 'M' ? (
          <MitochondrialVariantsInRegion datasetId={datasetId} region={region} />
        ) : (
          <VariantsInRegion datasetId={datasetId} region={region} />
        )}
      </RegionViewer>
    </TrackPage>
  )
}

RegionPage.propTypes = {
  datasetId: PropTypes.string.isRequired,
  region: PropTypes.shape({
    reference_genome: PropTypes.oneOf(['GRCh37', 'GRCh38']).isRequired,
    chrom: PropTypes.string.isRequired,
    start: PropTypes.number.isRequired,
    stop: PropTypes.number.isRequired,
    genes: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  width: PropTypes.number.isRequired,
}

export default RegionPage
