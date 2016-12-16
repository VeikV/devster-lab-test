module.exports = function (data, options) {
    const myPosition = new google.maps.LatLng(options.data.root.position.coords.latitude, options.data.root.position.coords.longitude);
    const userPosition = new google.maps.LatLng(this.address.geo.lat, this.address.geo.lng);

    return (google.maps.geometry.spherical.computeDistanceBetween(myPosition, userPosition) / 1000).toFixed(2);
};
