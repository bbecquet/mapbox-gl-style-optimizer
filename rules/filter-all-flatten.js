/**
 * Ensures 'all' filter expressions are not nested uselessly
 */
import { opEq, isScalar, args, mapArgs, exprEq, nbArgs } from './utils';
import * as R from 'ramda';

const msg = 'Nested `all` expressions can be flattened';

function replaceByList(array, index, list) {
    return R.insertAll(index, list, R.remove(index, 1, array));
}

function flattenAlls(expr) {
    if (isScalar(expr)) {
        return expr;
    }
    if (opEq('all', expr)) {
        let exprModif = [...expr];
        let childExpr;
        for (let i=1; i < exprModif.length; i++) {
            childExpr = flattenAlls(exprModif[i]);
            if (opEq('all', childExpr)) {
                exprModif = replaceByList(exprModif, i, args(childExpr));
                i += nbArgs(childExpr);
            } else {
                exprModif[i] = childExpr;
            }
        }
        return exprModif;
    }
    return mapArgs(flattenAlls, expr);
}

function singleLayer(layer) {
    const filter = layer.filter || [];
    const suggestion = flattenAlls(filter);
    if (exprEq(suggestion, filter)) {
        return null;
    }
    return {
        layerId: layer.id,
        msg,
        suggestion: JSON.stringify(suggestion),
    };
}

function allLayers(layers) {
    return layers
        .map(singleLayer)
        .filter(result => result);
}

export default allLayers;
