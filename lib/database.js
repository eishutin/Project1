var Waterline = require('waterline');
var sailsDiskAdapter = require('sails-disk');
var waterline = new Waterline();


module.exports = {
    init: function () {
        var fileCollection = Waterline.Collection.extend({
            identity: 'file',
            datastore: 'default',
            primaryKey: 'id',

            attributes: {
                id: {
                    type: 'number',
                    autoMigrations: {autoIncrement: true}
                },
                name: {type: 'string'},
                password: {type: 'string'},
                path: {type: 'string'},
                version: {
                    type: 'number',
                    autoMigrations: {autoIncrement: true}
                }
            }
        });

        waterline.registerModel(fileCollection);
        var config = {
            adapters: {
                'disk': sailsDiskAdapter
            },

            datastores: {
                default: {
                    adapter: 'disk'
                }
            }
        };
        let File;
        waterline.initialize(config, async (err, ontology) => {
            if (err) {
                console.error(err);
                return;
            }
            File = ontology.collections.file;

            module.exports.File = File;
        })
    }
};
