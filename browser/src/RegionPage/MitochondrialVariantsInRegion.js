import PropTypes from 'prop-types'
import React from 'react'

import { labelForDataset, referenceGenomeForDataset } from '../datasets'
import Link from '../Link'
import Query from '../Query'
import StatusMessage from '../StatusMessage'
import MitochondrialVariants from '../MitochondrialVariantList/MitochondrialVariants'
import annotateVariantsWithClinvar from '../VariantList/annotateVariantsWithClinvar'

const query = `
query MitochondrialVariantsInRegion($start: Int!, $stop: Int!, $datasetId: DatasetId!, $referenceGenome: ReferenceGenomeId!) {
  meta {
    clinvar_release_date
  }
  region(chrom: "M", start: $start, stop: $stop, reference_genome: $referenceGenome) {
    clinvar_variants {
      clinical_significance
      clinvar_variation_id
      gnomad {
        exome {
          ac
          an
          filters
        }
        genome {
          ac
          an
          filters
        }
      }
      gold_stars
      hgvsc
      hgvsp
      in_gnomad
      major_consequence
      pos
      review_status
      transcript_id
      variant_id
    }
    mitochondrial_variants(dataset: $datasetId) {
      ac_het
      ac_hom
      an
      consequence
      filters
      flags
      gene_id
      gene_symbol
      transcript_id
      hgvsc
      hgvsp
      lof
      lof_filter
      lof_flags
      max_heteroplasmy
      pos
      reference_genome
      rsid
      variant_id
    }
  }
}
`

const MitochondrialVariantsInRegion = ({ datasetId, region, ...rest }) => {
  const regionId = `${region.chrom}-${region.start}-${region.stop}`
  if (datasetId === 'exac' || datasetId.startsWith('gnomad_r2')) {
    return (
      <StatusMessage>
        Mitochondrial variants are not available in {labelForDataset(datasetId)}
        <br />
        <br />
        <Link to={`/region/${regionId}?dataset=gnomad_r3`} preserveSelectedDataset={false}>
          View this region in gnomAD v3.1 to see mitochondrial variants
        </Link>
      </StatusMessage>
    )
  }

  return (
    <Query
      query={query}
      variables={{
        datasetId,
        start: region.start,
        stop: region.stop,
        referenceGenome: referenceGenomeForDataset(datasetId),
      }}
      loadingMessage="Loading variants"
      errorMessage="Unable to load variants"
      success={data => data.region && data.region.mitochondrial_variants}
    >
      {({ data }) => {
        data.region.mitochondrial_variants.forEach(v => {
          /* eslint-disable no-param-reassign */
          if (v.an !== 0) {
            v.af = (v.ac_het + v.ac_hom) / v.an
            v.af_het = v.ac_het / v.an
            v.af_hom = v.ac_hom / v.an
          } else {
            v.af = 0
            v.af_het = 0
            v.af_hom = 0
          }
          v.hgvs = v.hgvsp || v.hgvsc
          /* eslint-enable no-param-reassign */
        })

        return (
          <MitochondrialVariants
            {...rest}
            clinvarReleaseDate={data.meta.clinvar_release_date}
            clinvarVariants={data.region.clinvar_variants}
            context={region}
            exportFileName={`gnomad_mitochondrial_variants_${regionId}`}
            transcripts={region.genes.flatMap(gene => gene.transcripts)}
            variants={annotateVariantsWithClinvar(
              data.region.mitochondrial_variants,
              data.region.clinvar_variants
            )}
          />
        )
      }}
    </Query>
  )
}

MitochondrialVariantsInRegion.propTypes = {
  datasetId: PropTypes.string.isRequired,
  region: PropTypes.shape({
    chrom: PropTypes.string.isRequired,
    start: PropTypes.number.isRequired,
    stop: PropTypes.number.isRequired,
    genes: PropTypes.arrayOf(
      PropTypes.shape({
        transcripts: PropTypes.arrayOf(PropTypes.object).isRequired,
      })
    ).isRequired,
  }).isRequired,
}

export default MitochondrialVariantsInRegion
