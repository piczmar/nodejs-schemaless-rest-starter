var EntityEnreacher = require('../../entityEnreacher').EntityEnreacher;
// var ObjectID = require('bson').BSONPure.ObjectID;
var ObjectID = require('mongodb').ObjectID;

function StudentsDAO(db) {
    "use strict";

    var entityEnreacher = new EntityEnreacher();

    /* If this constructor is called without the "new" operator, "this" points
    * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof StudentsDAO)) {
        console.log('Warning: StudentsDAO constructor called without "new" operator');
        return new StudentsDAO(db);
    }

    var students = db.collection("students");

    this.insertEntry = function (entry, callback) {
        "use strict";
        entityEnreacher.enreach(entry);
      
        console.log("inserting students entry" + JSON.stringify(entry));

        students.insert(entry,function(err,insertedInfo){
          "use strict";
          console.log('inserted.. ' + JSON.stringify(insertedInfo));
          if(err)return callback(err,null);
          callback(err, insertedInfo.ops[0]);
      });
    }

    this.updateEntry = function (entry, callback) {
        "use strict";
        
        entityEnreacher.enreach(entry);
      
        console.log("updating students entry" + JSON.stringify(entry));

        if(entry._id && entry._v){
            var toUpdate = JSON.parse(JSON.stringify(entry));;
            var obj_id = ObjectID.createFromHexString(entry._id);
            delete entry._id; // remove _id from the object to make save work (_id is readonly)
            var original_v = entry._v - 1;
            students.update(
                {_id: obj_id, _v: original_v},
                entry,
                function(err, cnt, status){
                    "use strict";
                    console.log('updated.. ' + JSON.stringify(toUpdate));
                    console.log('updated cnt: ' + cnt);
                    if(err)return callback(err,null);
                    if(cnt==0) return callback(new Error("No candidates for update"));

                    callback(err, toUpdate);
                }
            );
        }else{
            var error = new Error('Bad request'); 
            error.code = '400';
            throw error;
        }
    }

    this.getEntry = function(id, callback) {
        "use strict";
            
        var obj_id = ObjectID.createFromHexString(id);

        students.findOne({_id: obj_id},function(err, document) {
            "use strict";

            if (err) return callback(err, null);

            console.log("Found " + JSON.stringify(document));

            callback(err, document);
        });
    }


    this.getAll = function(criteria, skip, limit, callback) {
        "use strict";

        students.find(criteria).sort('_createdAt', -1).skip(skip).limit(limit).toArray(function(err, items) {
            "use strict";

            if (err) return callback(err, null);

            console.log("Found " + items.length + " students");

            callback(err, items);
        });
    }
}

module.exports.StudentsDAO = StudentsDAO;