maptilersdk.config.apiKey = mapToken;

const map = new maptilersdk.Map({
    container: 'map',
    style: maptilersdk.MapStyle.STREETS,
    center: coordinates,
    zoom: 10
});

const popup = new maptilersdk.Popup({ offset: 25 })
    .setHTML("<p>Exact location provided after booking</p>");

const marker = new maptilersdk.Marker()
    .setLngLat(coordinates)
    .setPopup(popup)
    .addTo(map);
