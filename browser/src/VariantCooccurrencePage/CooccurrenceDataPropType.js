import PropTypes from 'prop-types'

const CooccurrenceDataPropType = PropTypes.shape({
  cooccurrence: PropTypes.arrayOf(PropTypes.number).isRequired,
  p_compound_het: PropTypes.number,
  populations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      cooccurrence: PropTypes.arrayOf(PropTypes.number).isRequired,
      p_compound_het: PropTypes.number,
    })
  ),
})

export default CooccurrenceDataPropType
