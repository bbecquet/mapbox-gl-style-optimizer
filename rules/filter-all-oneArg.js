/**
 * Ensures 'all' filter expressions are not used with one argument only
 */
import { opEq, isScalar, nbArgs, mapArgs, exprEq } from './utils';

const msg = '`all` expressions with one arguments are useless';

function removeOneArgAlls(expr) {
    if (isScalar(expr)) {
        return expr;
    }
    if (opEq('all', expr) && nbArgs(expr) === 1) {
        return removeOneArgAlls(expr[1]);
    }
    return mapArgs(removeOneArgAlls, expr);
}

function singleLayer(layer) {
    const filter = layer.filter || [];
    const suggestion = removeOneArgAlls(filter);
    if (exprEq(suggestion, filter)) {
        return null;
    }
    return {
        layerId: layer.id,
        msg,
        suggestion,
    };
}

function allLayers(layers /* meta: line, etc. */) {
    return layers
        .map(singleLayer)
        .filter(result => result);
}

export default allLayers;
