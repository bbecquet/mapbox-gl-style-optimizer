/**
 * Suggests 
 */
import * as R from 'ramda';

// these 'paint' properties cannot be controlled by data-driven expressions
// so will prevent merging too separate layers
const paintNotDataDrivenProperties = [
    'background-pattern',
    'heatmap-color',
    'line-dasharray',
    'line-gradient',
];

const keyGenerators = [
    R.prop('type'),
    R.prop('source'),
    R.prop('source-layer'),
    R.prop('minzoom'),
    R.prop('maxzoom'),
    R.prop('layout'),
    R.pipe(
        R.prop('paint'),
        R.toPairs,
        R.sortBy(R.head),
        R.filter(([ prop, value ]) => {
            return R.includes(prop, paintNotDataDrivenProperties)
                || !!value.stops
        }),
    )
];

function mergeCriterion(layer) {
    return R.pipe(
        R.map(key => key(layer)),
        R.map(R.toString),
        R.join('$')
    )(keyGenerators);
}

function allLayers(layers) {
    return R.pipe(
        R.groupBy(mergeCriterion),
        R.values,
        R.filter(layerGroup => layerGroup.length > 1),
        R.map(mergeableLayers => ({
            layerId: mergeableLayers[0].id,
            msg: `${R.pluck('id', mergeableLayers).join(' - ')} can be merged`,
        }))
    )(layers);
}

export default allLayers;
