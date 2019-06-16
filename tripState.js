const trips = [];

module.exports = {
    add: data => {
        const index = index(data.id)
        if (index >= 0) {
            setData(index, data);
            return;
        }
        trips.push({
            id: data.id,
            latitude: data.latitude,
            longitude: data.longitude,
        })
    },
    remove: data => {
        if (trips.length <= 0) return null
        const index = index(data.id)
        if (index < 0) return;
        return trips.splice(index, 1);
    },
    getData: id => {
        if (trips.length <= 0) return null
        const index = index(data.id)
        if (index < 0) return;
        return trips[index];
    },
    setData: data => {
        setData(index(data.id), data)
    }
}

function index(id) {
    trips.forEach((value, index, array) => {
        if (value.id === id) return index;
    })
    return -1;
}

function setData(index, data) {
    if (trips.length <= 0 || index < 0) return;
    trips[index].latitude = data.latitude;
    trips[index].longitude = data.longitude;
}