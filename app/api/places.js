var Place = require('../models/place'); // get our mongoose model
var jwt = require('jsonwebtoken');// used to create, sign, and verify tokens


module.exports = function (app) {

    //add new place
    app.post('/v1/clients/:clientId/places', function (req, res) {

        // create a sample user
        var savePlace = new Place({
            name: req.body.name,
            address: req.body.address,
            isActive: req.body.isActive,
            clientId: req.params.clientId,
            created_on: new Date(),
            updated_on: new Date()
        });
        savePlace.save(function (err) {
            if (err) throw err;

            console.log('Client saved successfully');
            res.json({ success: true });
        });
    });

    //get all places
    app.get('/v1/clients/:clientId/places', function (req, res) {
        Place.find({ "clientId": req.params.clientId }, function (err, places) {
            res.json(places);
        });
    });

    //get by placeId
    app.get('/v1/clients/:clientId/places/:placeId', function (req, res) {
        return Place.findById(req.params.placeId, function (err, place) {
            if (!err) {
                return res.send(place);
            } else {
                return console.log(err);
            }
        });
    });

    //update places
    app.put('/v1/clients/:clientId/places', function (req, res) {                
        return Place.findById(req.body._id, function (err, place) {            
            if (!err) {

                place.name = req.body.name;
                place.address = req.body.address;
                place.clientId = req.body.clientId;
                

                // save the place
                place.save(function (err) {
                    if (err)
                        res.send(err);

                    res.json({ success: "update Successfully!!" });
                });

            } else {
                //return console.log(err);

                res.json({ error: err });
            }
        });
    });

    //delete the places
    app.delete('/v1/clients/:clientId/places/:placeId', function (req, res) {
        Place.remove({
            _id: req.params.placeId
        }, function (err, place) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });
};