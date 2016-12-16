module.exports = function (data, options, params) {
    return data.replace(new RegExp( '(' + params.data.root.query + ')', 'gi' ), '<b>$1</b>');
};
