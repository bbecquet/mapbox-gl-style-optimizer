import * as R from 'ramda';

function isScalar(expr) {
    return !Array.isArray(expr);
}

const op = R.head;

function opEq(value, expr) {
    return op(expr) === value;
}

const args = R.tail;

function nbArgs(expr) {
    return isScalar(expr) ? 1 : expr.length - 1;
}

function mapArgs(cb, expr) {
    return expr.map((arg, index) => index === 0 ? arg : cb(arg));
}

function exprEq(exprA, exprB) {
    return R.equals(exprA, exprB);
}

export {
    isScalar,
    op,
    opEq,
    args,
    nbArgs,
    mapArgs,
    exprEq,
};
