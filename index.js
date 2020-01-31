import filterAllOneArg from './rules/filter-all-oneArg';
import filterAllFlatten from './rules/filter-all-flatten';
import layerMerge from './rules/layer-merge';
import * as R from 'ramda';

const rules = [
    filterAllOneArg,
    filterAllFlatten,
    layerMerge,
];

function applyRules(style) {
    return R.flatten(rules.map(rule => rule(style.layers)));
}

function compactOutput(output) {
    return R.pipe(
        R.groupBy(R.prop('layerId')),
        R.map(R.pluck('msg'))
    )(output);
}

function applyAndFormatResults(style, options = {}) {
    return R.pipe(
        applyRules,
        options.compactOutput ? compactOutput : R.identity        
    )(style);
}

export default applyAndFormatResults;
