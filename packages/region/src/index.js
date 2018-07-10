export {
  types,
  actions,
  default as createRegionReducer,
  currentRegion,
  byRegionName,
  allRegionNames,
  isFetching,
  regionData,
  currentChromosome,
} from './regionRedux'

export {
  coverageConfigClassic,
  coverageConfigNew,
  attributeConfig,
} from './regionViewerStyles'

export { RegionHoc } from './RegionHoc'

export {
  default as RegionViewer,
} from './RegionViewer'

export {
  default as GeneViewer,
} from './GeneViewerReduxConnected'
